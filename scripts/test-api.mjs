import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const port = 3217;
const baseUrl = `http://127.0.0.1:${port}`;
const dataDir = await mkdtemp(path.join(tmpdir(), 'firts-api-test-'));
const server = spawn(process.execPath, ['dist/server.cjs'], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(port),
    ADMIN_SECRET: 'test-only-secret-with-enough-length',
    DATA_DIR: dataDir
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverOutput = '';
server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

async function waitUntilReady() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/data`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Servidor não iniciou a tempo.\n${serverOutput}`);
}

try {
  await waitUntilReady();

  const publicResponse = await fetch(`${baseUrl}/api/data`);
  assert.equal(publicResponse.status, 200);

  const protectedResponse = await fetch(`${baseUrl}/api/admin/data`);
  assert.equal(protectedResponse.status, 401);

  const invalidLogin = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrong-password' })
  });
  assert.equal(invalidLogin.status, 401);

  const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'test-only-secret-with-enough-length' })
  });
  assert.equal(loginResponse.status, 200);
  const cookie = loginResponse.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie, 'O login deve definir um cookie de sessão.');

  const authenticatedResponse = await fetch(`${baseUrl}/api/admin/data`, {
    headers: { Cookie: cookie }
  });
  assert.equal(authenticatedResponse.status, 200);

  const rejectedContact = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Teste',
      email: 'teste@example.com',
      subject: 'Teste',
      message: 'Mensagem sem consentimento'
    })
  });
  assert.equal(rejectedContact.status, 400);

  const acceptedContact = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Teste',
      email: 'teste@example.com',
      subject: 'Teste',
      message: 'Mensagem válida',
      privacyConsent: true
    })
  });
  assert.equal(acceptedContact.status, 201);

  const adminDataResponse = await fetch(`${baseUrl}/api/admin/data`, {
    headers: { Cookie: cookie }
  });
  const adminData = await adminDataResponse.json();
  assert.equal(adminData.contactMessages.length, 1);

  const logoutResponse = await fetch(`${baseUrl}/api/admin/auth/logout`, {
    method: 'POST',
    headers: { Cookie: cookie }
  });
  assert.equal(logoutResponse.status, 204);

  console.log('API: autenticação, privacidade e persistência validadas.');
} finally {
  server.kill('SIGTERM');
  await new Promise((resolve) => server.once('exit', resolve));
  await rm(dataDir, { recursive: true, force: true });
}
