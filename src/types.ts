export type CompetitionStatus = 
  | 'INSCRICOES_ABERTAS' 
  | 'EM_BREVE' 
  | 'EM_ANDAMENTO' 
  | 'FINALIZADA';

export type PublishStatus = 'draft' | 'published' | 'archived';

export interface ScheduleItem {
  id: string;
  date: string;
  time?: string;
  title: string;
  description?: string;
  location?: string;
}

export interface Competition {
  id: string;
  slug: string;
  name: string;
  modality: string;
  season: string;
  status: CompetitionStatus;
  publishStatus: PublishStatus;
  startDate?: string;
  endDate?: string;
  location?: string;
  city?: string;
  organization?: string;
  description?: string;
  bannerUrl?: string;
  logoUrl?: string;
  teamsCount?: number;
  regulationUrl?: string;
  regulationName?: string;
  prizesDescription?: string;
  schedule?: ScheduleItem[];
  registeredTeamIds?: string[];
  sponsorIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  number?: string;
  photoUrl?: string;
}

export interface TeamAchievement {
  id: string;
  year: string;
  title: string;
  placement?: string;
  competition?: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  modality: string;
  location?: string;
  city?: string;
  currentCompetitionId?: string;
  crestUrl?: string;
  bannerUrl?: string;
  historyBio?: string;
  seekingSponsors: boolean;
  publishStatus: PublishStatus;
  members?: TeamMember[];
  achievements?: TeamAchievement[];
  officialLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  sponsorIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResultRecord {
  id: string;
  competitionId: string;
  competitionName?: string;
  stage: string;
  date: string;
  teamAName: string;
  scoreA?: string | number;
  teamBName?: string;
  scoreB?: string | number;
  standingRank?: number;
  winnerName?: string;
  notes?: string;
  publishStatus: 'draft' | 'published';
  createdAt: string;
}

export type SponsorCategory = 
  | 'PATROCINADOR_OFICIAL' 
  | 'PATROCINADOR' 
  | 'PARCEIRO' 
  | 'APOIADOR';

export interface Sponsor {
  id: string;
  name: string;
  category: SponsorCategory;
  logoUrl: string;
  websiteUrl?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export type SponsorshipProperty = 
  | 'UNIFORME' 
  | 'ESPACO_FISICO' 
  | 'BANNERS' 
  | 'REDES_SOCIAIS' 
  | 'TRANSMISSAO' 
  | 'CONTEUDO' 
  | 'MATERIAL_OFICIAL' 
  | 'NAMING_RIGHTS' 
  | 'ATIVACAO' 
  | 'OUTRO';

export interface SponsorshipOpportunity {
  id: string;
  title: string;
  type: 'COMPETITION' | 'TEAM' | 'INSTITUTIONAL';
  targetId?: string;
  targetName?: string;
  property: SponsorshipProperty;
  description: string;
  available: boolean;
  tierOrValue?: string;
  createdAt: string;
}

export type LeadStatus = 'NOVO' | 'CONTATADO' | 'EM_NEGOCIACAO' | 'CONCLUIDO' | 'ARQUIVADO';
export type InterestType = 'PATROCINAR_COMPETICAO' | 'PATROCINAR_EQUIPE' | 'PARCERIA_INSTITUCIONAL';

export interface SponsorshipLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  interestType: InterestType;
  targetCompetitionId?: string;
  targetTeamId?: string;
  targetName?: string;
  investmentRange?: string;
  message: string;
  privacyConsent: boolean;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export type StorySubjectRole = 
  | 'PARTICIPANTE' 
  | 'EQUIPE' 
  | 'TREINADOR' 
  | 'MENTOR' 
  | 'ORGANIZADOR' 
  | 'VOLUNTARIO';

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  subjectName: string;
  subjectRole: StorySubjectRole;
  content: string;
  photoUrl?: string;
  competitionId?: string;
  teamId?: string;
  publishStatus: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  order: number;
  verified: boolean;
  publishStatus: 'draft' | 'published';
}

export interface SiteSettings {
  platformName: string;
  tagline: string;
  missionText: string;
  aboutText: string;
  organizationName: string;
  officialEmail: string;
  officialPhone: string;
  officialAddress: string;
  socialLinks: {
    website?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
  allowPublicLeads: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
  read: boolean;
  createdAt: string;
}

export interface AppStateData {
  competitions: Competition[];
  teams: Team[];
  results: ResultRecord[];
  sponsors: Sponsor[];
  opportunities: SponsorshipOpportunity[];
  leads: SponsorshipLead[];
  stories: Story[];
  metrics: ImpactMetric[];
  settings: SiteSettings;
  contactMessages: ContactMessage[];
}
