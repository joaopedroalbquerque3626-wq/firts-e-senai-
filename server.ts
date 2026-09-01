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
      slug: 'first-robotics-competition-regional-brasil-2026',
      name: 'FIRST® Robotics Competition - Regional Brasil 2026',
      modality: 'FRC® (FIRST Robotics Competition)',
      season: 'CRESCENDO / REEFSCAPE 2026',
      status: 'EM_ANDAMENTO',
      publishStatus: 'published',
      startDate: '2026-03-12',
      endDate: '2026-03-15',
      location: 'Arena SESI de Inovação & Ginásio Ibirapuera',
      city: 'São Paulo, SP',
      organization: 'FIRST® & SESI Nacional de Educação',
      description: 'O maior torneio internacional de robótica de nível industrial da América Latina. Reúne 48 equipes com robôs de até 57kg em alianças 3v3 disputando vagas diretas para o FIRST Championship em Houston, Texas.',
      bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      teamsCount: 48,
      regulationName: 'Manual do Jogo Oficial FRC 2026 - Versão 3.2.pdf',
      regulationUrl: 'https://www.firstinspires.org/robotics/frc/game-and-season',
      prizesDescription: 'FIRST Impact Award (Chairman\'s Award), Vencedor Regional (Blue Banner), Prêmio de Inspiração em Engenharia e Vagas para Houston.',
      schedule: [
        { id: 's1', date: '2026-03-12', time: '08:30', title: 'Abertura dos Pits e Inspeção Técnica de Segurança', location: 'Pits Arena SESI' },
        { id: 's2', date: '2026-03-13', time: '09:00', title: 'Cerimônia de Abertura e Partidas de Qualificação', location: 'Arena Principal de Jogo' },
        { id: 's3', date: '2026-03-14', time: '14:00', title: 'Seleção de Alianças e Finais Playoff Eliminatórias', location: 'Arena Principal' },
        { id: 's4', date: '2026-03-15', time: '16:30', title: 'Cerimônia de Premiação e Entrega dos Blue Banners', location: 'Palco Principal' }
      ],
      registeredTeamIds: ['team_1', 'team_2', 'team_3'],
      sponsorIds: ['sp_1', 'sp_2', 'sp_3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comp_2',
      slug: 'festival-sesi-robotica-nacional-2026',
      name: 'Festival SESI de Robótica Nacional 2026 (FLL, FTC, FRC)',
      modality: 'Multidisciplinar FIRST® (FLL / FTC / FRC)',
      season: 'Temporada Oficial 2026',
      status: 'INSCRICOES_ABERTAS',
      publishStatus: 'published',
      startDate: '2026-05-20',
      endDate: '2026-05-24',
      location: 'Centro de Convenções Ulysses Guimarães',
      city: 'Brasília, DF',
      organization: 'SESI / SENAI & FIRST® Inspires',
      description: 'O maior festival de robótica e inovação educacional do Brasil. Mais de 2.000 estudantes competindo nas categorias FIRST LEGO League (Discover, Explore, Challenge), FIRST Tech Challenge e FRC.',
      bannerUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
      teamsCount: 120,
      regulationName: 'Guia do Participante e Regulamento Geral - Festival SESI 2026.pdf',
      regulationUrl: 'https://www.portaldaindustria.com.br/sesi/canais/robotica/',
      prizesDescription: 'Champion\'s Award FLL, Inspire Award FTC, Impact Award FRC e troféus de Design e Inovação.',
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
      slug: 'first-tech-challenge-regional-sudeste-2026',
      name: 'FIRST® Tech Challenge (FTC) - Regional Sudeste 2026',
      modality: 'FTC® (FIRST Tech Challenge)',
      season: 'CENTERSTAGE / INTO THE DEEP 2026',
      status: 'EM_BREVE',
      publishStatus: 'published',
      startDate: '2026-08-14',
      endDate: '2026-08-16',
      location: 'Ginásio Multiuso Unicamp',
      city: 'Campinas, SP',
      organization: 'FIRST® Sudeste & Qualcomm',
      description: 'Torneio regional de FTC reunindo equipes com robôs de até 19kg desenvolvidos com peças de alumínio, atuadores servo, visão computacional e controle via Android.',
      bannerUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      teamsCount: 32,
      regulationName: 'Game Manual Part 1 & Part 2 FTC 2026.pdf',
      regulationUrl: 'https://www.firstinspires.org/robotics/ftc',
      prizesDescription: 'Inspire Award, Think Award, Connect Award e Classificação Nacional.',
      schedule: [
        { id: 's8', date: '2026-08-14', time: '13:00', title: 'Inspeção de Hardware e Software', location: 'Pits FTC' },
        { id: 's9', date: '2026-08-15', time: '09:30', title: 'Partidas Oficiais de Arena 2v2', location: 'Arena FTC' }
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
      slug: 'the-force-1771',
      name: '#1771 - The Force Robotics',
      modality: 'FRC® (FIRST Robotics Competition)',
      location: 'Suwanee / Brasil Partner Alliance',
      city: 'São Paulo / Internacional',
      currentCompetitionId: 'comp_1',
      crestUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Fundada com o lema de excelência e Gracious Professionalism®, a equipe #1771 é referência global em transmissão Swerve Drive, visão computacional autônoma e mentoria aberta para novas equipes brasileiras.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm1', name: 'Lucas "Sky" Mendonça', role: 'Capitão & Drive Coach', number: '1771' },
        { id: 'm2', name: 'Beatriz Vasconcelos', role: 'Líder de Software & Visão Autônoma', number: '1771' },
        { id: 'm3', name: 'Eng. Ricardo Silveira', role: 'Mentor Principal / Mecatrônica' }
      ],
      achievements: [
        { id: 'a1', year: '2025', title: 'Vencedor do Regional (Blue Banner Winner)', placement: '1º Lugar', competition: 'FRC Regional Brasil' },
        { id: 'a2', year: '2025', title: 'Industrial Design Award by General Motors', placement: 'Prêmio Técnico', competition: 'FIRST Championship Houston' },
        { id: 'a3', year: '2024', title: 'Excellence in Engineering Award', placement: 'Destaque de Engenharia', competition: 'FRC Regional' }
      ],
      officialLinks: {
        instagram: 'https://instagram.com/team1771force',
        youtube: 'https://youtube.com/@frc1771theforce',
        website: 'https://theforcerobotics.org'
      },
      sponsorIds: ['sp_1', 'sp_2', 'sp_3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_2',
      slug: 'megazord-9085',
      name: '#9085 - Megazord SESI SENAI',
      modality: 'FRC® (FIRST Robotics Competition)',
      location: 'Jundiaí, SP',
      city: 'Jundiaí, SP',
      currentCompetitionId: 'comp_1',
      crestUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Formada por estudantes da Escola SESI SENAI, a Megazord #9085 combina automação industrial de precisão, fabricação CNC em alumínio aeronáutico e campanhas comunitárias de divulgação STEM em escolas públicas.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm4', name: 'Carolina Neves', role: 'Capitã da Equipe & Operadora', number: '9085' },
        { id: 'm5', name: 'Gabriel Torres', role: 'Piloto / Mecânica', number: '9085' },
        { id: 'm6', name: 'Prof. Marcos Andrade', role: 'Mentor de Eletrônica & Robótica' }
      ],
      achievements: [
        { id: 'a4', year: '2025', title: 'FIRST Impact Award Finalist', placement: 'Prêmio de Maior Honra FIRST', competition: 'Regional Brasil' },
        { id: 'a5', year: '2024', title: 'Rookie All-Star Award', placement: 'Melhor Equipe Estreante', competition: 'FRC Brazil Regional' }
      ],
      officialLinks: {
        instagram: 'https://instagram.com/frc_megazord9085',
        youtube: 'https://youtube.com/@megazord9085'
      },
      sponsorIds: ['sp_1', 'sp_4'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_3',
      slug: 'under-control-1156',
      name: '#1156 - Under Control',
      modality: 'FRC® (FIRST Robotics Competition)',
      location: 'Novo Hamburgo, RS',
      city: 'Novo Hamburgo, RS',
      currentCompetitionId: 'comp_1',
      crestUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Pioneira da FIRST no Brasil fundada em 2003 na Fundação Evangélica. Com mais de 20 anos de história e presença no FIRST Hall of Fame brasileiro, a #1156 já conquistou dezenas de Blue Banners internacionais e inspirou centenas de engenheiros.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm7', name: 'Guilherme Sauer', role: 'Capitão da Equipe', number: '1156' },
        { id: 'm8', name: 'Isabela Dhein', role: 'Líder de Impacto & Outreach', number: '1156' },
        { id: 'm9', name: 'Eng. Henrique Becker', role: 'Head Mentor (Alumni)' }
      ],
      achievements: [
        { id: 'a6', year: '2024', title: 'FIRST Impact Award (Regional Chairman\'s Award)', placement: 'Prêmio Supremo', competition: 'FRC Regional' },
        { id: 'a7', year: '2023', title: 'World Championship Division Finalist', placement: 'Finalista Mundial', competition: 'FIRST Championship Houston' },
        { id: 'a8', year: '2022', title: 'Engineering Inspiration Award', placement: 'Incentivo à Engenharia', competition: 'FRC Regional' }
      ],
      officialLinks: {
        instagram: 'https://instagram.com/undercontrol1156',
        youtube: 'https://youtube.com/@frc1156',
        website: 'https://undercontrol1156.com'
      },
      sponsorIds: ['sp_1', 'sp_3', 'sp_5'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_4',
      slug: 'takemetec-16059',
      name: '#16059 - Takemetec FTC',
      modality: 'FTC® (FIRST Tech Challenge)',
      location: 'Curitiba, PR',
      city: 'Curitiba, PR',
      currentCompetitionId: 'comp_3',
      crestUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Equipe de FIRST Tech Challenge reconhecida pelo design modular inovador de seus robôs e forte compromisso com a filosofia Coopertition®.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm10', name: 'Mariana Duarte', role: 'Capitã & Programadora Java', number: '16059' },
        { id: 'm11', name: 'Felipe Klein', role: 'Projetista CAD 3D', number: '16059' }
      ],
      achievements: [
        { id: 'a9', year: '2025', title: 'Inspire Award (1º Lugar Geral FTC)', placement: '1º Lugar', competition: 'Torneio Regional FTC' },
        { id: 'a10', year: '2024', title: 'Think Award por Inovação Técnica', placement: 'Caderno de Engenharia', competition: 'Festival SESI' }
      ],
      officialLinks: {
        instagram: 'https://instagram.com/takemetec16059'
      },
      sponsorIds: ['sp_2', 'sp_6'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team_5',
      slug: 'legozilla-48914',
      name: '#48914 - LegoZilla',
      modality: 'FLL® Challenge (FIRST LEGO League)',
      location: 'Salvador, BA',
      city: 'Salvador, BA',
      currentCompetitionId: 'comp_2',
      crestUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
      historyBio: 'Composta por estudantes do Ensino Fundamental, a equipe se destaca pelo desenvolvimento de soluções sustentáveis no Projeto de Inovação e precisão mecânica nas missões com LEGO SPIKE Prime.',
      seekingSponsors: true,
      publishStatus: 'published',
      members: [
        { id: 'm12', name: 'Sofia Barreto (13 anos)', role: 'Apresentadora do Projeto de Inovação' },
        { id: 'm13', name: 'Theo Albuquerque (14 anos)', role: 'Programador do Robô LEGO' }
      ],
      achievements: [
        { id: 'a11', year: '2025', title: 'Champion\'s Award (1º Lugar Geral FLL)', placement: 'Campeão Geral', competition: 'Regional Bahia' },
        { id: 'a12', year: '2024', title: 'Global Innovation Award Nominee', placement: 'Projeto Científico', competition: 'Festival Nacional' }
      ],
      officialLinks: {
        instagram: 'https://instagram.com/legozillarobotics'
      },
      sponsorIds: ['sp_1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  results: [
    {
      id: 'res_1',
      competitionId: 'comp_1',
      competitionName: 'FIRST® Robotics Competition - Regional Brasil 2026',
      stage: 'Final 2 - Aliança Playoff (Best of 3)',
      date: '2026-03-14',
      teamAName: 'Aliança Vermelha (#1771 The Force + #9085 Megazord + #1156 Under Control)',
      scoreA: 142,
      teamBName: 'Aliança Azul (#1382 + #7563 + #8280)',
      scoreB: 128,
      standingRank: 1,
      winnerName: 'Aliança Vermelha (#1771 + #9085 + #1156)',
      notes: 'Partida histórica! Autônomo com 5 notas pontuadas pelo #1771 (42 pts) e subida tripla sincronizada no Endgame (30 pts). Pontuação oficial homologada pela FIRST.',
      publishStatus: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'res_2',
      competitionId: 'comp_1',
      competitionName: 'FIRST® Robotics Competition - Regional Brasil 2026',
      stage: 'Qualificação - Match 34',
      date: '2026-03-13',
      teamAName: 'Aliança Azul (#9085 Megazord + #5800 + #1860)',
      scoreA: 118,
      teamBName: 'Aliança Vermelha (#7033 + #8880 + #9199)',
      scoreB: 95,
      standingRank: 1,
      winnerName: 'Aliança Azul (#9085 Megazord + #5800 + #1860)',
      notes: 'Vitória conquistada com bônus de Ranking Point de Melodia (Melody RP) e Escalada.',
      publishStatus: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'res_3',
      competitionId: 'comp_3',
      competitionName: 'FIRST® Tech Challenge (FTC) - Regional Sudeste 2026',
      stage: 'Final da Divisão Qualcomm',
      date: '2026-08-16',
      teamAName: 'Aliança #16059 Takemetec + #21400',
      scoreA: 215,
      teamBName: 'Aliança #18900 + #22300',
      scoreB: 198,
      standingRank: 1,
      winnerName: 'Aliança #16059 Takemetec + #21400',
      notes: 'Novo recorde de pontuação do torneio em fase teleoperada com entrega de pixel de alta precisão.',
      publishStatus: 'published',
      createdAt: new Date().toISOString()
    }
  ],
  sponsors: [
    {
      id: 'sp_1',
      name: 'SESI & SENAI Nacional',
      category: 'PATROCINADOR_OFICIAL',
      logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://www.portaldaindustria.com.br/sesi/',
      active: true,
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_2',
      name: 'Qualcomm Incorporated',
      category: 'PATROCINADOR_OFICIAL',
      logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://www.qualcomm.com',
      active: true,
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_3',
      name: 'Rockwell Automation',
      category: 'PATROCINADOR_OFICIAL',
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://www.rockwellautomation.com',
      active: true,
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_4',
      name: 'The Boeing Company',
      category: 'PATROCINADOR',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://www.boeing.com',
      active: true,
      order: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_5',
      name: 'Apple & Google Education',
      category: 'PARCEIRO',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://www.apple.com/education',
      active: true,
      order: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp_6',
      name: 'Haas CNC Automation',
      category: 'APOIADOR',
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80',
      websiteUrl: 'https://www.haascnc.com',
      active: true,
      order: 6,
      createdAt: new Date().toISOString()
    }
  ],
  opportunities: [
    {
      id: 'opp_1',
      title: 'Naming Rights da Arena Principal - FRC Regional Brasil',
      type: 'COMPETITION',
      targetId: 'comp_1',
      targetName: 'FIRST® Robotics Competition - Regional Brasil 2026',
      property: 'NAMING_RIGHTS',
      description: 'Sua marca dará nome à arena de batalhas industriais com transmissão ao vivo para mais de 100.000 espectadores, presença em backdrop oficial, telões LED de pontuação e medalhas.',
      available: true,
      tierOrValue: 'Cota Master Diamante',
      createdAt: new Date().toISOString()
    },
    {
      id: 'opp_2',
      title: 'Patrocínio de Robô & Uniforme da Equipe #1771 The Force',
      type: 'TEAM',
      targetId: 'team_1',
      targetName: '#1771 - The Force Robotics',
      property: 'UNIFORME',
      description: 'Estampe seu logotipo no chassi de alumínio do robô FRC de alta velocidade, uniformes oficiais da equipe de pit e banners no FIRST Championship em Houston.',
      available: true,
      tierOrValue: 'Cota Ouro de Robótica',
      createdAt: new Date().toISOString()
    },
    {
      id: 'opp_3',
      title: 'Fundo de Bolsas e Peças (Robotics Parts Grant) para Escolas Públicas',
      type: 'INSTITUTIONAL',
      property: 'MATERIAL_OFICIAL',
      description: 'Financiamento direto de kits de motores, baterias e controladores para criação de 10 novas equipes de FIRST Tech Challenge e FIRST LEGO League em comunidades vulneráveis.',
      available: true,
      tierOrValue: 'Investimento Social ESG',
      createdAt: new Date().toISOString()
    },
    {
      id: 'opp_4',
      title: 'Patrocínio de Viagem e Logística para o FIRST Championship (Houston)',
      type: 'TEAM',
      targetId: 'team_3',
      targetName: '#1156 - Under Control',
      property: 'ATIVACAO',
      description: 'Apoio no custeio de passagens aéreas e transporte internacional do robô de 57kg da equipe classificada para a grande final mundial nos EUA.',
      available: true,
      tierOrValue: 'Cota Internacional',
      createdAt: new Date().toISOString()
    }
  ],
  leads: [],
  stories: [
    {
      id: 'story_1',
      slug: 'mais-que-robos-transformacao-stem',
      title: '"Mais Que Robôs®": Como a FIRST® forma a próxima geração de líderes em tecnologia',
      subtitle: 'O impacto de mais de 30 anos desenvolvendo ciência, cooperação e liderança em jovens de todo o planeta.',
      subjectName: 'Dean Kamen & Dr. Woodie Flowers',
      subjectRole: 'ORGANIZADOR',
      content: 'A robótica é apenas o veículo. O verdadeiro produto da FIRST são os jovens inspirados, confiantes e capacitados para resolver os maiores desafios do planeta — da sustentabilidade à exploração espacial.',
      photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      competitionId: 'comp_1',
      teamId: 'team_1',
      publishStatus: 'published',
      publishedAt: '2026-03-01',
      createdAt: new Date().toISOString()
    },
    {
      id: 'story_2',
      slug: 'gracious-professionalism-na-pratica',
      title: 'Gracious Professionalism®: A filosofia que revoluciona a forma de competir',
      subtitle: 'Ajudar os adversários a consertar seus robôs minutos antes da grande final não é fraqueza — é o coração da FIRST.',
      subjectName: 'Equipe #1156 Under Control',
      subjectRole: 'EQUIPE',
      content: 'Durante o Regional Brasil, quando a aliança rival teve seu sistema de transmissão pneumático danificado, mentores e estudantes da equipe #1156 cederam peças sobressalentes e trabalharam juntos no pit adversário até que ambos os robôs entrassem 100% prontos na arena.',
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
      label: 'Estudantes Impactados Anualmente',
      value: 679000,
      order: 1,
      verified: true,
      publishStatus: 'published'
    },
    {
      id: 'met_2',
      label: 'Mentores e Voluntários Ativos',
      value: 200000,
      order: 2,
      verified: true,
      publishStatus: 'published'
    },
    {
      id: 'met_3',
      label: 'Países com Programas FIRST®',
      value: 110,
      order: 3,
      verified: true,
      publishStatus: 'published'
    },
    {
      id: 'met_4',
      label: 'Bolsas Universitárias Disponíveis (US$)',
      value: 80000000,
      order: 4,
      verified: true,
      publishStatus: 'published'
    }
  ],
  settings: {
    platformName: 'FIRST® Inspires',
    tagline: 'More Than Robots® — Preparando jovens para o futuro através de Ciência, Tecnologia e Inovação (STEM)',
    missionText: 'Inspirar jovens a se tornarem líderes e inovadores em ciência e tecnologia, desenvolvendo habilidades de engenharia, autoconfiança, liderança e cooperação através dos programas FIRST® LEGO® League, FIRST® Tech Challenge e FIRST® Robotics Competition.',
    aboutText: 'Fundada em 1989 pelo inventor Dean Kamen e pelo Dr. Woodie Flowers, a FIRST® (For Inspiration and Recognition of Science and Technology) é uma comunidade global de robótica sem fins lucrativos que desenvolve jovens da Educação Infantil ao Ensino Médio com programas inovadores baseados em mentoria prática.',
    organizationName: 'FIRST® Inspires / FIRST® Brasil (Parceria SESI SENAI)',
    officialEmail: 'contato@firstinspires.org.br',
    officialPhone: '+55 (11) 3322-0000',
    officialAddress: 'São Paulo, SP - Brasil | Manchester, NH - USA',
    socialLinks: {
      instagram: 'https://instagram.com/first_official',
      youtube: 'https://youtube.com/@FIRSTWorldTube',
      website: 'https://www.firstinspires.org'
    },
    allowPublicLeads: true
  },
  contactMessages: []
});

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
