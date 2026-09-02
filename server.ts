import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { createServer as createViteServer } from 'vite';
import { AppStateData, SponsorshipLead, ContactMessage } from './src/types.js';

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ADMIN_SECRET = process.env.ADMIN_SECRET?.trim() || (IS_PRODUCTION ? '' : 'admin2026');
const ADMIN_COOKIE = 'firts_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const TRUST_PROXY = process.env.TRUST_PROXY === '1';

if (!Number.isFinite(PORT) || PORT <= 0 || PORT > 65535) {
  throw new Error('PORT deve ser um número válido entre 1 e 65535.');
}

if (!ADMIN_SECRET) {
  throw new Error('ADMIN_SECRET é obrigatório em produção. Configure uma senha forte no ambiente.');
}
if (IS_PRODUCTION && ADMIN_SECRET.length < 16) {
  throw new Error('ADMIN_SECRET deve ter pelo menos 16 caracteres em produção.');
}

app.disable('x-powered-by');
if (TRUST_PROXY) app.set('trust proxy', 1);
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  next();
});
app.use(express.json({ limit: '256kb' }));

// Neutral initial state. Verified content must be entered through the admin panel.
const initialDefaultState: AppStateData = {
  competitions: [],
  teams: [],
  results: [],
  sponsors: [],
  opportunities: [],
  leads: [],
  stories: [],
  metrics: [],
  settings: {
    platformName: 'Portal de Competições e Patrocínio',
    tagline: 'Acompanhe competições, conheça equipes e crie oportunidades de patrocínio.',
    missionText: 'Conectar competições, equipes, apoiadores e patrocinadores em um ambiente claro e confiável.',
    aboutText: '',
    organizationName: '',
    officialEmail: '',
    officialPhone: '',
    officialAddress: '',
    socialLinks: {
      website: 'https://www.firstinspires.org'
    },
    allowPublicLeads: true,
  },
  contactMessages: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadState(): AppStateData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        ...initialDefaultState,
        ...parsed,
        settings: { ...initialDefaultState.settings, ...(parsed.settings || {}) }
      };
    }
  } catch (error) {
    console.error('Error loading state from disk:', error);
  }
  return initialDefaultState;
}

function saveState(state: AppStateData): boolean {
  const tempFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), { encoding: 'utf-8', mode: 0o600 });
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (error) {
    console.error('Error saving state to disk:', error);
    try {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    } catch {
      // Best effort cleanup only.
    }
    return false;
  }
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function rateLimit(scope: string, max: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${scope}:${req.ip || req.socket.remoteAddress || 'unknown'}`;
    const current = rateBuckets.get(key);

    if (!current || current.resetAt <= now) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= max) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      res.status(429).json({ error: 'Muitas tentativas. Aguarde e tente novamente.' });
      return;
    }

    current.count += 1;
    next();
  };
}

function getCookie(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  for (const item of cookieHeader.split(';')) {
    const [rawKey, ...rawValue] = item.trim().split('=');
    if (rawKey === name) return decodeURIComponent(rawValue.join('='));
  }
  return undefined;
}

function signSession(payload: string): string {
  return createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
}

function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS, nonce: randomUUID() })
  ).toString('base64url');
  return `${payload}.${signSession(payload)}`;
}

function hasValidSession(req: Request): boolean {
  const token = getCookie(req, ADMIN_COOKIE);
  if (!token) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expected = Buffer.from(signSession(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return typeof session.exp === 'number' && session.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!hasValidSession(req)) {
    res.status(401).json({ error: 'Sessão administrativa inválida ou expirada.' });
    return;
  }
  next();
}

function secureStringEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function cleanHttpUrl(value: unknown): string | undefined {
  const text = cleanText(value, 500);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

let db: AppStateData = loadState();

// ----------------------------------------------------
// Public API Endpoints
// ----------------------------------------------------

// GET /api/data - Public dataset (only published items)
app.get('/api/data', (_req: Request, res: Response) => {
  const publicData = {
    competitions: db.competitions.filter(c => c.publishStatus === 'published'),
    teams: db.teams.filter(t => t.publishStatus === 'published'),
    results: db.results.filter(r => r.publishStatus === 'published'),
    sponsors: db.sponsors.filter(s => s.active),
    opportunities: db.opportunities.filter(o => o.available),
    stories: db.stories.filter(s => s.publishStatus === 'published'),
    metrics: db.metrics.filter(m => m.publishStatus === 'published' && m.verified),
    settings: db.settings
  };
  res.json(publicData);
});

// POST /api/leads - Public sponsorship inquiry submission
app.post('/api/leads', rateLimit('leads', 10, 60 * 60 * 1000), (req: Request, res: Response) => {
  if (!db.settings.allowPublicLeads) {
    return res.status(403).json({ error: 'O envio público de propostas está temporariamente desativado.' });
  }

  const {
    companyName,
    contactName,
    email,
    phone,
    website,
    interestType,
    targetCompetitionId,
    targetTeamId,
    targetName,
    investmentRange,
    message,
    privacyConsent
  } = req.body;

  const cleanCompanyName = cleanText(companyName, 120);
  const cleanContactName = cleanText(contactName, 120);
  const cleanEmail = cleanText(email, 254).toLowerCase();
  const cleanPhone = cleanText(phone, 40);
  const cleanMessage = cleanText(message, 4000);
  const cleanWebsite = cleanHttpUrl(website);
  const allowedInterestTypes = new Set([
    'PATROCINAR_COMPETICAO',
    'PATROCINAR_EQUIPE',
    'PARCERIA_INSTITUCIONAL'
  ]);

  if (!cleanCompanyName || !cleanContactName || !cleanEmail || !cleanPhone || !cleanMessage) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios.' });
  }
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
  }
  if (!allowedInterestTypes.has(String(interestType))) {
    return res.status(400).json({ error: 'Tipo de interesse inválido.' });
  }
  if (website && !cleanWebsite) {
    return res.status(400).json({ error: 'O site deve começar com http:// ou https://.' });
  }
  if (privacyConsent !== true) {
    return res.status(400).json({ error: 'É necessário autorizar o uso dos dados para contato.' });
  }

  const newLead: SponsorshipLead = {
    id: `lead_${randomUUID()}`,
    companyName: cleanCompanyName,
    contactName: cleanContactName,
    email: cleanEmail,
    phone: cleanPhone,
    website: cleanWebsite,
    interestType: String(interestType) as SponsorshipLead['interestType'],
    targetCompetitionId: cleanText(targetCompetitionId, 160) || undefined,
    targetTeamId: cleanText(targetTeamId, 160) || undefined,
    targetName: cleanText(targetName, 180) || undefined,
    investmentRange: cleanText(investmentRange, 100) || undefined,
    message: cleanMessage,
    privacyConsent: true,
    status: 'NOVO',
    createdAt: new Date().toISOString()
  };

  db.leads.unshift(newLead);
  if (!saveState(db)) {
    db.leads = db.leads.filter((lead) => lead.id !== newLead.id);
    return res.status(500).json({ error: 'Não foi possível registrar a solicitação.' });
  }

  return res.status(201).json({ success: true, message: 'Solicitação de patrocínio registrada com sucesso!', leadId: newLead.id });
});

// POST /api/contact - Public contact message submission
app.post('/api/contact', rateLimit('contact', 10, 60 * 60 * 1000), (req: Request, res: Response) => {
  const { name, email, phone, subject, message, privacyConsent } = req.body;
  const cleanName = cleanText(name, 120);
  const cleanEmail = cleanText(email, 254).toLowerCase();
  const cleanPhone = cleanText(phone, 40);
  const cleanSubject = cleanText(subject, 180);
  const cleanMessage = cleanText(message, 4000);

  if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios.' });
  }
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
  }
  if (privacyConsent !== true) {
    return res.status(400).json({ error: 'É necessário autorizar o uso dos dados para contato.' });
  }

  const newContact: ContactMessage = {
    id: `msg_${randomUUID()}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone || undefined,
    subject: cleanSubject,
    message: cleanMessage,
    privacyConsent: true,
    read: false,
    createdAt: new Date().toISOString()
  };

  db.contactMessages.unshift(newContact);
  if (!saveState(db)) {
    db.contactMessages = db.contactMessages.filter((contact) => contact.id !== newContact.id);
    return res.status(500).json({ error: 'Não foi possível registrar a mensagem.' });
  }

  return res.status(201).json({ success: true, message: 'Mensagem registrada com sucesso.' });
});

// ----------------------------------------------------
// Admin API Endpoints
// ----------------------------------------------------

app.post('/api/admin/auth/login', rateLimit('admin-login', 8, 15 * 60 * 1000), (req: Request, res: Response) => {
  const password = cleanText(req.body?.password, 256);
  if (!password || !secureStringEquals(password, ADMIN_SECRET)) {
    return res.status(401).json({ error: 'Senha de administração incorreta.' });
  }
  res.cookie(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: IS_PRODUCTION,
    maxAge: SESSION_TTL_MS,
    path: '/'
  });
  return res.json({ success: true });
});

app.get('/api/admin/auth/session', (req: Request, res: Response) => {
  res.json({ authenticated: hasValidSession(req) });
});

app.post('/api/admin/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie(ADMIN_COOKIE, {
    httpOnly: true,
    sameSite: 'strict',
    secure: IS_PRODUCTION,
    path: '/'
  });
  res.status(204).send();
});

// GET /api/admin/data - Returns everything
app.get('/api/admin/data', requireAdmin, (_req: Request, res: Response) => {
  res.json(db);
});

// Save complete or specific entity updates
app.post('/api/admin/sync', requireAdmin, (req: Request, res: Response) => {
  const updatedData = req.body;
  if (!updatedData || typeof updatedData !== 'object') {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const allowedArrayKeys: Array<keyof AppStateData> = [
    'competitions',
    'teams',
    'results',
    'sponsors',
    'opportunities',
    'leads',
    'stories',
    'metrics',
    'contactMessages'
  ];
  const nextDb: AppStateData = { ...db };

  for (const key of allowedArrayKeys) {
    if (key in updatedData) {
      if (!Array.isArray(updatedData[key])) {
        return res.status(400).json({ error: `O campo ${key} deve ser uma lista.` });
      }
      (nextDb[key] as unknown[]) = updatedData[key];
    }
  }

  if ('settings' in updatedData) {
    if (!updatedData.settings || typeof updatedData.settings !== 'object' || Array.isArray(updatedData.settings)) {
      return res.status(400).json({ error: 'Configurações inválidas.' });
    }
    nextDb.settings = { ...db.settings, ...updatedData.settings };
  }

  if (!saveState(nextDb)) {
    return res.status(500).json({ error: 'Não foi possível salvar as alterações.' });
  }
  db = nextDb;
  res.json({ success: true, state: db });
});

// Helper for FIRST mock datasets
const getFirstDataset = (): AppStateData => ({
  competitions: [
    {
      id: 'comp_1',
      slug: 'desafio-regional-robotica-demo-2026',
      name: 'Desafio Regional de Robótica — DEMO 2026',
      modality: 'FRC® (referência de modalidade)',
      season: 'Temporada demonstrativa 2026',
      status: 'EM_ANDAMENTO',
      publishStatus: 'published',
      startDate: '2026-03-12',
      endDate: '2026-03-15',
      location: 'Arena de Demonstração',
      city: 'São Paulo, SP',
      organization: 'Organização fictícia do protótipo',
      description: 'Evento fictício criado para demonstrar inscrições, programação, resultados e oportunidades de patrocínio no sistema.',
      bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      teamsCount: 3,
      regulationName: 'Página de referência da modalidade FRC®',
      regulationUrl: 'https://www.firstinspires.org/robotics/frc/game-and-season',
      prizesDescription: 'Premiação demonstrativa para design, programação e trabalho em equipe.',
      schedule: [
        { id: 's1', date: '2026-03-12', time: '08:30', title: 'Credenciamento e inspeção técnica', location: 'Área de equipes' },
        { id: 's2', date: '2026-03-13', time: '09:00', title: 'Abertura e partidas classificatórias', location: 'Arena principal' },
        { id: 's3', date: '2026-03-14', time: '14:00', title: 'Finais demonstrativas', location: 'Arena principal' },
        { id: 's4', date: '2026-03-15', time: '16:30', title: 'Encerramento e premiação', location: 'Palco principal' }
      ],
      registeredTeamIds: ['team_1', 'team_2', 'team_3'],
      sponsorIds: ['sp_1', 'sp_2', 'sp_3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comp_2',
      slug: 'festival-robotica-educacional-demo-2026',
      name: 'Festival de Robótica Educacional — DEMO 2026',
      modality: 'Mostra multidisciplinar (FLL® / FTC® / FRC®)',
      season: 'Temporada demonstrativa 2026',
      status: 'INSCRICOES_ABERTAS',
      publishStatus: 'published',
      startDate: '2026-05-20',
      endDate: '2026-05-24',
      location: 'Centro de Convenções Ulysses Guimarães',
      city: 'Brasília, DF',
      organization: 'Organização fictícia do protótipo',
      description: 'Festival fictício com diferentes modalidades, criado para validar filtros, cadastros e estados de inscrição.',
      bannerUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
      teamsCount: 4,
      regulationName: 'Referência: página de robótica do SESI',
      regulationUrl: 'https://www.portaldaindustria.com.br/sesi/canais/robotica/',
      prizesDescription: 'Reconhecimentos demonstrativos de inovação, design e cooperação.',
      schedule: [
        { id: 's5', date: '2026-05-20', time: '10:00', title: 'Credenciamento, Montagem de Pits e Testes de Arena', location: 'Pavilhão Central' },
        { id: 's6', date: '2026-05-21', time: '09:00', title: 'Rodadas de Apresentação de Projetos de Inovação', location: 'Salas de Avaliação' },
        { id: 's7', date: '2026-05-24', time: '15:00', title: 'Grande Final das Alianças e Premiação Nacional', location: 'Auditório Master' }
      ],
      registeredTeamIds: ['team_2', 'team_3', 'team_4', 'team_5'],
      sponsorIds: ['sp_1', 'sp_4', 'sp_5'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comp_3',
      slug: 'desafio-ftc-regional-demo-2026',
      name: 'Desafio FTC Regional — DEMO 2026',
      modality: 'FTC® (referência de modalidade)',
      season: 'Temporada demonstrativa 2026',
      status: 'EM_BREVE',
      publishStatus: 'published',
      startDate: '2026-08-14',
      endDate: '2026-08-16',
      location: 'Arena Tecnológica de Demonstração',
      city: 'Campinas, SP',
      organization: 'Organização fictícia do protótipo',
      description: 'Desafio fictício usado para demonstrar uma competição futura, sua agenda e equipes participantes.',
      bannerUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      teamsCount: 1,
      regulationName: 'Página de referência da modalidade FTC®',
      regulationUrl: 'https://www.firstinspires.org/robotics/ftc',
      prizesDescription: 'Premiação demonstrativa para projeto, estratégia e integração.',
      schedule: [
        { id: 's8', date: '2026-08-14', time: '13:00', title: 'Inspeção de Hardware e Software', location: 'Pits FTC' },
        { id: 's9', date: '2026-08-15', time: '09:30', title: 'Partidas demonstrativas de arena', location: 'Arena FTC' }
      ],
      registeredTeamIds: ['team_4'],
      sponsorIds: ['sp_2', 'sp_6'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  teams: [
    {
      id: 'team_1',
      slug: 'equipe-orbita-101',
      name: '#101 — Equipe Órbita (DEMO)',
      modality: 'FRC® (referência de modalidade)',
      location: 'Laboratório Escola Modelo',
      city: 'São Paulo, SP',
      currentCompetitionId: 'comp_1',
      crestUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Equipe fictícia de estudantes criada para demonstrar integrantes, conquistas, participação em eventos e busca por patrocinadores.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm1', name: 'Alex Silva (DEMO)', role: 'Capitão e piloto', number: '101' },
        { id: 'm2', name: 'Bia Costa (DEMO)', role: 'Líder de software', number: '101' },
        { id: 'm3', name: 'Mentor Exemplo', role: 'Mentoria em mecatrônica' }
      ],
      achievements: [
        { id: 'a1', year: '2025', title: 'Prêmio demonstrativo de design', placement: '1º lugar', competition: 'Evento de teste' },
        { id: 'a2', year: '2024', title: 'Destaque demonstrativo de programação', placement: 'Menção', competition: 'Mostra escolar' }
      ],
      sponsorIds: ['sp_1', 'sp_2', 'sp_3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_2',
      slug: 'equipe-megabots-202',
      name: '#202 — Equipe MegaBots (DEMO)',
      modality: 'FRC® (referência de modalidade)',
      location: 'Escola Técnica Modelo',
      city: 'Campinas, SP',
      currentCompetitionId: 'comp_1',
      crestUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Equipe fictícia focada em automação e fabricação digital, incluída para testar a navegação entre equipes e competições.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm4', name: 'Carla Lima (DEMO)', role: 'Capitã e operadora', number: '202' },
        { id: 'm5', name: 'Gui Torres (DEMO)', role: 'Mecânica', number: '202' }
      ],
      achievements: [
        { id: 'a4', year: '2025', title: 'Destaque demonstrativo de impacto', placement: 'Finalista', competition: 'Evento de teste' }
      ],
      sponsorIds: ['sp_1', 'sp_4'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_3',
      slug: 'equipe-controle-303',
      name: '#303 — Equipe Controle (DEMO)',
      modality: 'FRC® (referência de modalidade)',
      location: 'Centro Educacional Modelo',
      city: 'Curitiba, PR',
      currentCompetitionId: 'comp_1',
      crestUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Equipe fictícia com histórico demonstrativo de cooperação, eletrônica e desenvolvimento de novos integrantes.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm7', name: 'Gabi Souza (DEMO)', role: 'Capitã', number: '303' },
        { id: 'm8', name: 'Isa Nunes (DEMO)', role: 'Eletrônica', number: '303' }
      ],
      achievements: [
        { id: 'a6', year: '2025', title: 'Prêmio demonstrativo de cooperação', placement: 'Destaque', competition: 'Evento de teste' }
      ],
      sponsorIds: ['sp_1', 'sp_3', 'sp_5'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_4',
      slug: 'equipe-tecnova-404',
      name: '#404 — Equipe TecNova (DEMO)',
      modality: 'FTC® (referência de modalidade)',
      location: 'Laboratório Maker Modelo',
      city: 'Campinas, SP',
      currentCompetitionId: 'comp_3',
      crestUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Equipe fictícia criada para demonstrar uma modalidade diferente e um evento futuro.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm10', name: 'Mari Duarte (DEMO)', role: 'Capitã e programadora', number: '404' },
        { id: 'm11', name: 'Felipe Klein (DEMO)', role: 'Projeto 3D', number: '404' }
      ],
      achievements: [
        { id: 'a9', year: '2025', title: 'Destaque demonstrativo de projeto', placement: '1º lugar', competition: 'Mostra de teste' }
      ],
      sponsorIds: ['sp_2', 'sp_6'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_5',
      slug: 'equipe-legolab-505',
      name: '#505 — Equipe LegoLab (DEMO)',
      modality: 'FLL® Challenge (referência de modalidade)',
      location: 'Escola Criativa Modelo',
      city: 'Salvador, BA',
      currentCompetitionId: 'comp_2',
      crestUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Equipe fictícia criada para demonstrar projetos de inovação e missões com blocos programáveis.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm12', name: 'Sofia Barros (DEMO)', role: 'Projeto de inovação' },
        { id: 'm13', name: 'Theo Alves (DEMO)', role: 'Programação do robô' }
      ],
      achievements: [
        { id: 'a11', year: '2025', title: 'Reconhecimento demonstrativo de inovação', placement: 'Destaque', competition: 'Festival de teste' }
      ],
      sponsorIds: ['sp_1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  results: [
    {
      id: 'res_1',
      competitionId: 'comp_1',
      competitionName: 'Desafio Regional de Robótica — DEMO 2026',
      stage: 'Final demonstrativa',
      date: '2026-03-14',
      teamAName: 'Aliança Laranja (#101 + #202 + #303)',
      scoreA: 142,
      teamBName: 'Aliança Azul (equipes de teste)',
      scoreB: 128,
      standingRank: 1,
      winnerName: 'Aliança Laranja (#101 + #202 + #303)',
      notes: 'Resultado fictício usado para validar placar, vencedor e classificação.',
      publishStatus: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'res_2',
      competitionId: 'comp_1',
      competitionName: 'Desafio Regional de Robótica — DEMO 2026',
      stage: 'Partida classificatória demonstrativa',
      date: '2026-03-13',
      teamAName: 'Aliança Azul (#202 + equipes de teste)',
      scoreA: 118,
      teamBName: 'Aliança Laranja (equipes de teste)',
      scoreB: 95,
      standingRank: 1,
      winnerName: 'Aliança Azul (#202 + equipes de teste)',
      notes: 'Resultado fictício para demonstrar a listagem por competição.',
      publishStatus: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'res_3',
      competitionId: 'comp_3',
      competitionName: 'Desafio FTC Regional — DEMO 2026',
      stage: 'Final demonstrativa',
      date: '2026-08-16',
      teamAName: 'Aliança #404 + equipe de teste',
      scoreA: 215,
      teamBName: 'Aliança adversária de teste',
      scoreB: 198,
      standingRank: 1,
      winnerName: 'Aliança #404 + equipe de teste',
      notes: 'Placar fictício para demonstrar o estado de uma competição futura.',
      publishStatus: 'published',
      createdAt: new Date().toISOString()
    }
  ],
  sponsors: [
    {
      id: 'sp_1',
      name: 'Indústria Alfa (DEMO)',
      category: 'PATROCINADOR_OFICIAL',
      logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
      active: true,
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_2',
      name: 'Tecnologia Beta (DEMO)',
      category: 'PATROCINADOR_OFICIAL',
      logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=300&q=80',
      active: true,
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_3',
      name: 'Automação Gama (DEMO)',
      category: 'PATROCINADOR_OFICIAL',
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80',
      active: true,
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_4',
      name: 'Logística Delta (DEMO)',
      category: 'PATROCINADOR',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=300&q=80',
      active: true,
      order: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_5',
      name: 'Educação Épsilon (DEMO)',
      category: 'PARCEIRO',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      active: true,
      order: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_6',
      name: 'Manufatura Zeta (DEMO)',
      category: 'APOIADOR',
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80',
      active: true,
      order: 6,
      createdAt: new Date().toISOString()
    }
  ],
  opportunities: [
    {
      id: 'opp_1',
      title: 'Cota de nome da arena demonstrativa',
      type: 'COMPETITION',
      targetId: 'comp_1',
      targetName: 'Desafio Regional de Robótica — DEMO 2026',
      property: 'NAMING_RIGHTS',
      description: 'Exemplo de cota para demonstrar exposição de marca na arena, sinalização e comunicação do evento.',
      available: true,
      tierOrValue: 'Cota Master Diamante',
      createdAt: new Date().toISOString()
    },
    {
      id: 'opp_2',
      title: 'Patrocínio de robô e uniforme — Equipe Órbita',
      type: 'TEAM',
      targetId: 'team_1',
      targetName: '#101 — Equipe Órbita (DEMO)',
      property: 'UNIFORME',
      description: 'Exemplo de apoio com aplicação de marca no robô, uniforme e materiais de apresentação da equipe fictícia.',
      available: true,
      tierOrValue: 'Cota Ouro de Robótica',
      createdAt: new Date().toISOString()
    },
    {
      id: 'opp_3',
      title: 'Apoio demonstrativo para kits educacionais',
      type: 'INSTITUTIONAL',
      property: 'MATERIAL_OFICIAL',
      description: 'Exemplo de parceria institucional para aquisição de componentes e criação de oficinas educacionais.',
      available: true,
      tierOrValue: 'Investimento Social ESG',
      createdAt: new Date().toISOString()
    },
    {
      id: 'opp_4',
      title: 'Apoio demonstrativo de viagem e logística',
      type: 'TEAM',
      targetId: 'team_3',
      targetName: '#303 — Equipe Controle (DEMO)',
      property: 'ATIVACAO',
      description: 'Exemplo de apoio para transporte da equipe e de seus equipamentos até uma competição.',
      available: true,
      tierOrValue: 'Cota Internacional',
      createdAt: new Date().toISOString()
    }
  ],
  leads: [
    {
      id: 'lead_demo_1',
      companyName: 'Empresa Exemplo (DEMO)',
      contactName: 'Contato de Demonstração',
      email: 'patrocinio@example.com',
      phone: '(00) 00000-0000',
      website: 'https://example.com/',
      interestType: 'PATROCINAR_EQUIPE',
      targetTeamId: 'team_1',
      targetName: '#101 — Equipe Órbita (DEMO)',
      investmentRange: 'Faixa demonstrativa',
      message: 'Lead fictício criado apenas para demonstrar o funil de patrocínio no painel.',
      privacyConsent: true,
      status: 'NOVO',
      notes: 'Dado fictício de apresentação.',
      createdAt: new Date().toISOString()
    }
  ],
  stories: [
    {
      id: 'story_1',
      slug: 'da-ideia-ao-primeiro-prototipo',
      title: 'Da ideia ao primeiro protótipo',
      subtitle: 'Uma história fictícia para demonstrar relatos de equipes na página inicial.',
      subjectName: 'Equipe Órbita (DEMO)',
      subjectRole: 'EQUIPE',
      content: 'Neste cenário demonstrativo, estudantes dividiram tarefas, testaram mecanismos e documentaram o aprendizado até concluir a primeira versão do robô.',
      photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      competitionId: 'comp_1',
      teamId: 'team_1',
      publishStatus: 'published',
      publishedAt: '2026-03-01',
      createdAt: new Date().toISOString()
    },
    {
      id: 'story_2',
      slug: 'cooperacao-dentro-da-arena',
      title: 'Cooperação dentro da arena',
      subtitle: 'Relato fictício sobre colaboração entre equipes durante uma competição.',
      subjectName: 'Equipe Controle (DEMO)',
      subjectRole: 'EQUIPE',
      content: 'Durante o evento demonstrativo, integrantes compartilharam ferramentas e ajudaram outra equipe a corrigir um problema antes da partida.',
      photoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      competitionId: 'comp_1',
      teamId: 'team_3',
      publishStatus: 'published',
      publishedAt: '2026-03-05',
      createdAt: new Date().toISOString()
    }
  ],
  metrics: [
    {
      id: 'met_1',
      label: 'Competições no cenário',
      value: 3,
      order: 1,
      verified: true,
      publishStatus: 'published'
    },
    {
      id: 'met_2',
      label: 'Equipes de exemplo',
      value: 5,
      order: 2,
      verified: true,
      publishStatus: 'published'
    },
    {
      id: 'met_3',
      label: 'Resultados cadastrados',
      value: 3,
      order: 3,
      verified: true,
      publishStatus: 'published'
    },
    {
      id: 'met_4',
      label: 'Oportunidades demonstrativas',
      value: 4,
      order: 4,
      verified: true,
      publishStatus: 'published'
    }
  ],
  settings: {
    platformName: 'FIRST & SENAI | Protótipo',
    tagline: 'Competições, equipes e oportunidades de patrocínio em um só lugar.',
    missionText: 'Demonstrar uma plataforma capaz de organizar competições, equipes, resultados e contatos de patrocinadores.',
    aboutText: 'Protótipo acadêmico e demonstrativo. Os registros carregados automaticamente são fictícios e servem apenas para testar as funções do sistema.',
    organizationName: 'Protótipo criado por João Pedro Albuquerque Montenegro',
    officialEmail: '',
    officialPhone: '',
    officialAddress: '',
    socialLinks: {
      instagram: 'https://www.instagram.com/first_official_/',
      youtube: 'https://youtube.com/@FIRSTWorldTube',
      website: 'https://www.firstinspires.org'
    },
    allowPublicLeads: true
  },
  contactMessages: [
    {
      id: 'msg_demo_1',
      name: 'Visitante de Demonstração',
      email: 'visitante@example.com',
      phone: '(00) 00000-0000',
      subject: 'Mensagem de teste do protótipo',
      message: 'Esta mensagem fictícia demonstra como os contatos aparecem e podem ser gerenciados no painel.',
      privacyConsent: true,
      read: false,
      createdAt: new Date().toISOString()
    }
  ]
});

// A fresh clone opens fully populated so every prototype flow can be demonstrated.
if (!fs.existsSync(DATA_FILE)) {
  const initialSampleState = getFirstDataset();
  if (saveState(initialSampleState)) db = initialSampleState;
}

// Optional fictional dataset for local layout testing only.
app.post('/api/admin/seed-sample', requireAdmin, (_req: Request, res: Response) => {
  const sampleState = getFirstDataset();
  if (!saveState(sampleState)) {
    return res.status(500).json({ error: 'Não foi possível carregar os dados demonstrativos.' });
  }
  db = sampleState;
  return res.json({
    success: true,
    message: 'Dados demonstrativos carregados. Eles não devem ser publicados como dados oficiais.',
    state: db
  });
});

// Clear all data to test zero-data empty state
app.post('/api/admin/clear-all', requireAdmin, (_req: Request, res: Response) => {
  const emptyState: AppStateData = {
    ...initialDefaultState,
    competitions: [],
    teams: [],
    results: [],
    sponsors: [],
    opportunities: [],
    leads: [],
    stories: [],
    metrics: [],
    contactMessages: []
  };
  if (!saveState(emptyState)) {
    return res.status(500).json({ error: 'Não foi possível limpar os dados.' });
  }
  db = emptyState;
  return res.json({ success: true, message: 'Todos os registros foram removidos.', state: db });
});

// ----------------------------------------------------
// Setup Vite in Dev or Static in Prod
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exitCode = 1;
});
