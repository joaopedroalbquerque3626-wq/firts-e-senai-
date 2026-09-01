import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Users,
  Award,
  DollarSign,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  RefreshCw,
  Sparkles,
  Inbox,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  Competition,
  Team,
  ResultRecord,
  Sponsor,
  SponsorshipOpportunity,
  SponsorshipLead,
  Story,
  ImpactMetric,
  CompetitionStatus,
  PublishStatus,
  LeadStatus,
  InterestType
} from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    syncAdminData,
    seedSampleData,
    clearAllData,
    logoutAdmin,
    navigateTo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'competitions'
    | 'teams'
    | 'results'
    | 'sponsors'
    | 'leads'
    | 'stories'
    | 'metrics'
    | 'settings'
    | 'messages'
  >('overview');

  // Competitions state
  const [editingComp, setEditingComp] = useState<Competition | null>(null);
  const [isCreatingComp, setIsCreatingComp] = useState(false);

  // Teams state
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  // Results state
  const [editingResult, setEditingResult] = useState<ResultRecord | null>(null);
  const [isCreatingResult, setIsCreatingResult] = useState(false);

  // Sponsors state
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [isCreatingSponsor, setIsCreatingSponsor] = useState(false);

  // Opportunities state
  const [editingOpp, setEditingOpp] = useState<SponsorshipOpportunity | null>(null);
  const [isCreatingOpp, setIsCreatingOpp] = useState(false);

  // Stories state
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  // Metrics state
  const [editingMetric, setEditingMetric] = useState<ImpactMetric | null>(null);
  const [isCreatingMetric, setIsCreatingMetric] = useState(false);

  // Site settings local state
  const [settingsForm, setSettingsForm] = useState(data.settings);

  // ----------------------------------------------------
  // Handlers for Competitions
  // ----------------------------------------------------
  const handleSaveCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;

    let updatedList: Competition[];
    const now = new Date().toISOString();
    const finalComp = {
      ...editingComp,
      updatedAt: now,
      slug: editingComp.slug || editingComp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (isCreatingComp) {
      updatedList = [finalComp, ...data.competitions];
    } else {
      updatedList = data.competitions.map((c) => (c.id === finalComp.id ? finalComp : c));
    }

    await syncAdminData({ competitions: updatedList });
    setEditingComp(null);
    setIsCreatingComp(false);
  };

  const handleDeleteCompetition = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta competição?')) return;
    const updated = data.competitions.filter((c) => c.id !== id);
    await syncAdminData({ competitions: updated });
  };

  // ----------------------------------------------------
  // Handlers for Teams
  // ----------------------------------------------------
  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    let updatedList: Team[];
    const now = new Date().toISOString();
    const finalTeam = {
      ...editingTeam,
      updatedAt: now,
      slug: editingTeam.slug || editingTeam.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (isCreatingTeam) {
      updatedList = [finalTeam, ...data.teams];
    } else {
      updatedList = data.teams.map((t) => (t.id === finalTeam.id ? finalTeam : t));
    }

    await syncAdminData({ teams: updatedList });
    setEditingTeam(null);
    setIsCreatingTeam(false);
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta equipe?')) return;
    const updated = data.teams.filter((t) => t.id !== id);
    await syncAdminData({ teams: updated });
  };

  // ----------------------------------------------------
  // Handlers for Results
  // ----------------------------------------------------
  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;

    let updatedList: ResultRecord[];
    if (isCreatingResult) {
      updatedList = [editingResult, ...data.results];
    } else {
      updatedList = data.results.map((r) => (r.id === editingResult.id ? editingResult : r));
    }

    await syncAdminData({ results: updatedList });
    setEditingResult(null);
    setIsCreatingResult(false);
  };

  const handleDeleteResult = async (id: string) => {
    if (!confirm('Deseja realmente excluir este resultado?')) return;
    const updated = data.results.filter((r) => r.id !== id);
    await syncAdminData({ results: updated });
  };

  // ----------------------------------------------------
  // Handlers for Sponsors & Opportunities
  // ----------------------------------------------------
  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor) return;

    let updatedList: Sponsor[];
    if (isCreatingSponsor) {
      updatedList = [editingSponsor, ...data.sponsors];
    } else {
      updatedList = data.sponsors.map((s) => (s.id === editingSponsor.id ? editingSponsor : s));
    }

    await syncAdminData({ sponsors: updatedList });
    setEditingSponsor(null);
    setIsCreatingSponsor(false);
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm('Deseja realmente excluir este patrocinador?')) return;
    const updated = data.sponsors.filter((s) => s.id !== id);
    await syncAdminData({ sponsors: updated });
  };

  const handleSaveOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;

    let updatedList: SponsorshipOpportunity[];
    if (isCreatingOpp) {
      updatedList = [editingOpp, ...data.opportunities];
    } else {
      updatedList = data.opportunities.map((o) => (o.id === editingOpp.id ? editingOpp : o));
    }

    await syncAdminData({ opportunities: updatedList });
    setEditingOpp(null);
    setIsCreatingOpp(false);
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta oportunidade?')) return;
    const updated = data.opportunities.filter((o) => o.id !== id);
    await syncAdminData({ opportunities: updated });
  };

  // ----------------------------------------------------
  // Handlers for Leads Status
  // ----------------------------------------------------
  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus, notes?: string) => {
    const updated = data.leads.map((l) =>
      l.id === leadId ? { ...l, status, notes: notes !== undefined ? notes : l.notes } : l
    );
    await syncAdminData({ leads: updated });
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Deseja remover este lead?')) return;
    const updated = data.leads.filter((l) => l.id !== leadId);
    await syncAdminData({ leads: updated });
  };

  // ----------------------------------------------------
  // Handlers for Stories & Metrics
  // ----------------------------------------------------
  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    let updatedList: Story[];
    if (isCreatingStory) {
      updatedList = [editingStory, ...data.stories];
    } else {
      updatedList = data.stories.map((s) => (s.id === editingStory.id ? editingStory : s));
    }

    await syncAdminData({ stories: updatedList });
    setEditingStory(null);
    setIsCreatingStory(false);
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta história?')) return;
    const updated = data.stories.filter((s) => s.id !== id);
    await syncAdminData({ stories: updated });
  };

  const handleSaveMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetric) return;

    let updatedList: ImpactMetric[];
    if (isCreatingMetric) {
      updatedList = [editingMetric, ...data.metrics];
    } else {
      updatedList = data.metrics.map((m) => (m.id === editingMetric.id ? editingMetric : m));
    }

    await syncAdminData({ metrics: updatedList });
    setEditingMetric(null);
    setIsCreatingMetric(false);
  };

  const handleDeleteMetric = async (id: string) => {
    if (!confirm('Deseja realmente excluir este indicador?')) return;
    const updated = data.metrics.filter((m) => m.id !== id);
    await syncAdminData({ metrics: updated });
  };

  // ----------------------------------------------------
  // Handlers for Settings
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await syncAdminData({ settings: settingsForm });
  };

  // Lead Counts
  const newLeadsCount = data.leads.filter((l) => l.status === 'NOVO').length;
  const unreadMessagesCount = data.contactMessages.filter((m) => !m.read).length;

  return (
    <div id="admin-dashboard-view" className="w-full bg-[#fdfdfd] min-h-screen text-[#111111] pb-20">
      {/* Top Admin Navigation Bar */}
      <div className="bg-[#ffffff] border-b border-[#111111] sticky top-20 z-30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#84cc16] rounded-full animate-pulse border border-[#111111]"></span>
          <h1 className="font-serif text-xl text-[#111111]">
            Painel de Controle Oficial
          </h1>
          <span className="text-xs font-mono text-[#666666] hidden sm:inline-block">
            | Gestão de Competições & Patrocínios
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-admin-preview-site"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f3ef] border border-[#111111] text-xs font-mono uppercase tracking-wider text-[#111111] hover:bg-[#C2410C] hover:text-[#fdfdfd] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Site Público</span>
          </button>

          <button
            id="btn-admin-logout"
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] border border-[#C2410C] text-xs font-mono uppercase tracking-wider text-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] transition-colors shadow-[2px_2px_0px_#C2410C] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#111111] mb-8 scrollbar-none">
          {[
            { id: 'overview', label: 'Visão Geral', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'competitions', label: `Competições (${data.competitions.length})`, icon: <Trophy className="w-4 h-4" /> },
            { id: 'teams', label: `Equipes (${data.teams.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'results', label: `Resultados (${data.results.length})`, icon: <Award className="w-4 h-4" /> },
            {
              id: 'leads',
              label: `Leads Patrocínio ${newLeadsCount > 0 ? `(${newLeadsCount} novos)` : `(${data.leads.length})`}`,
              icon: <DollarSign className="w-4 h-4" />,
              highlight: newLeadsCount > 0
            },
            { id: 'sponsors', label: `Patrocinadores (${data.sponsors.length})`, icon: <BriefcaseIcon className="w-4 h-4" /> },
            { id: 'stories', label: `Histórias (${data.stories.length})`, icon: <FileText className="w-4 h-4" /> },
            { id: 'metrics', label: `Indicadores Reais (${data.metrics.length})`, icon: <ShieldCheck className="w-4 h-4" /> },
            {
              id: 'messages',
              label: `Mensagens ${unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}`,
              icon: <Inbox className="w-4 h-4" />
            },
            { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider border whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#111111] bg-[#111111] text-[#fdfdfd] font-bold shadow-[2px_2px_0px_#111111]'
                  : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-[#f4f3ef]'
              } ${tab.highlight && activeTab !== tab.id ? 'text-[#C2410C] font-bold' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ==================================================== */}
        {/* TAB 1: OVERVIEW & DATA TESTING TOOLS                 */}
        {/* ==================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#777777] block">
                  Competições Cadastradas
                </span>
                <div className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
                  {data.competitions.length}
                </div>
                <span className="text-[11px] text-[#84cc16] font-mono">
                  {data.competitions.filter((c) => c.publishStatus === 'published').length} publicadas
                </span>
              </div>

              <div className="p-5 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#777777] block">
                  Equipes Cadastradas
                </span>
                <div className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
                  {data.teams.length}
                </div>
                <span className="text-[11px] text-[#C2410C] font-mono">
                  {data.teams.filter((t) => t.seekingSponsors).length} buscando patrocínio
                </span>
              </div>

              <div className="p-5 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#777777] block">
                  Solicitações de Patrocínio
                </span>
                <div className="font-serif text-3xl sm:text-4xl text-[#C2410C] mt-1">
                  {data.leads.length}
                </div>
                <span className="text-[11px] text-[#555555] font-mono">
                  {newLeadsCount} aguardando contato
                </span>
              </div>

              <div className="p-5 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#777777] block">
                  Resultados Oficiais
                </span>
                <div className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
                  {data.results.length}
                </div>
                <span className="text-[11px] text-[#777777] font-mono">Validados</span>
              </div>
            </div>

            {/* Test & Data Seeding Tools */}
            <div className="p-6 bg-[#ffffff] border border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
              <div className="flex items-center justify-between border-b border-[#111111] pb-3">
                <div>
                  <h3 className="font-serif text-xl text-[#111111]">
                    Ferramentas de Homologação & Estado Zero
                  </h3>
                  <p className="text-xs text-[#666666] font-sans">
                    Permite testar o comportamento visual da plataforma tanto com estado zerado quanto com dados de exemplo.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#f4f3ef] border border-[#111111] text-[10px] font-mono uppercase text-[#C2410C]">
                  Regra Zero Invenção
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  id="btn-seed-sample-data"
                  onClick={seedSampleData}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#f4f3ef] border border-[#111111] text-[#111111] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#111111] hover:text-[#fdfdfd] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Carregar Dados Reais de Exemplo (Testes)</span>
                </button>

                <button
                  id="btn-clear-all-data"
                  onClick={() => {
                    if (confirm('Tem certeza? Isso zerará todos os registros para testar a experiência com dados vazios.')) {
                      clearAllData();
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ffffff] border border-[#C2410C] text-[#C2410C] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] hover:text-[#fdfdfd] transition-colors shadow-[2px_2px_0px_#C2410C] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Zerar Todos os Dados (Testar Estado Vazio)</span>
                </button>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] p-6">
              <div className="flex items-center justify-between border-b border-[#111111] pb-4 mb-4">
                <h3 className="font-serif text-xl text-[#111111]">
                  Últimos Leads Comerciais Recebidos
                </h3>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs text-[#C2410C] font-mono uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Ver Todos os Leads ({data.leads.length}) →
                </button>
              </div>

              {data.leads.length === 0 ? (
                <p className="text-xs text-[#777777] py-4 font-mono">Nenhuma solicitação de patrocínio recebida ainda.</p>
              ) : (
                <div className="space-y-3">
                  {data.leads.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 bg-[#fdfdfd] border border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="font-serif text-base text-[#111111]">
                            {lead.companyName}
                          </strong>
                          <span className="text-xs text-[#666666] font-mono">({lead.contactName})</span>
                          <span className="px-2 py-0.5 bg-[#f4f3ef] border border-[#e5e5e5] text-[10px] font-mono uppercase text-[#C2410C]">
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#555555] line-clamp-1 font-sans">{lead.message}</p>
                      </div>

                      <div className="text-xs text-[#777777] shrink-0 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: COMPETITIONS MANAGER                          */}
        {/* ==================================================== */}
        {activeTab === 'competitions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#111111]">
                Gestão de Competições
              </h2>
              <button
                onClick={() => {
                  setEditingComp({
                    id: `comp_${Date.now()}`,
                    slug: '',
                    name: '',
                    modality: 'Futsal',
                    season: 'Temporada 2026',
                    status: 'INSCRICOES_ABERTAS',
                    publishStatus: 'published',
                    teamsCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
                  setIsCreatingComp(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Competição</span>
              </button>
            </div>

            {/* Editing / Creating Modal or Form */}
            {editingComp && (
              <form
                onSubmit={handleSaveCompetition}
                className="bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] p-6 sm:p-8 space-y-4"
              >
                <h3 className="font-serif text-xl text-[#111111] border-b border-[#111111] pb-3">
                  {isCreatingComp ? 'Cadastrar Nova Competição' : `Editar: ${editingComp.name}`}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Nome Oficial da Competição *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingComp.name}
                      onChange={(e) => setEditingComp({ ...editingComp, name: e.target.value })}
                      placeholder="Ex: Taça Regional de Basquete 2026"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Modalidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingComp.modality}
                      onChange={(e) => setEditingComp({ ...editingComp, modality: e.target.value })}
                      placeholder="Ex: Skate Street, Futsal, Vôlei..."
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Temporada / Edição
                    </label>
                    <input
                      type="text"
                      value={editingComp.season}
                      onChange={(e) => setEditingComp({ ...editingComp, season: e.target.value })}
                      placeholder="Ex: 2026 / Edição 1"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Status da Competição *
                    </label>
                    <select
                      value={editingComp.status}
                      onChange={(e) => setEditingComp({ ...editingComp, status: e.target.value as CompetitionStatus })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    >
                      <option value="INSCRICOES_ABERTAS">Inscrições Abertas</option>
                      <option value="EM_ANDAMENTO">Em Andamento</option>
                      <option value="EM_BREVE">Em Breve</option>
                      <option value="FINALIZADA">Finalizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Status de Publicação *
                    </label>
                    <select
                      value={editingComp.publishStatus}
                      onChange={(e) => setEditingComp({ ...editingComp, publishStatus: e.target.value as PublishStatus })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    >
                      <option value="published">Publicado (Visível no site)</option>
                      <option value="draft">Rascunho (Oculto no site)</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Data Início
                    </label>
                    <input
                      type="date"
                      value={editingComp.startDate || ''}
                      onChange={(e) => setEditingComp({ ...editingComp, startDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Data Término
                    </label>
                    <input
                      type="date"
                      value={editingComp.endDate || ''}
                      onChange={(e) => setEditingComp({ ...editingComp, endDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Cidade / Estado
                    </label>
                    <input
                      type="text"
                      value={editingComp.city || ''}
                      onChange={(e) => setEditingComp({ ...editingComp, city: e.target.value })}
                      placeholder="Ex: São Paulo, SP"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                    Descrição Editorial Oficial
                  </label>
                  <textarea
                    rows={3}
                    value={editingComp.description || ''}
                    onChange={(e) => setEditingComp({ ...editingComp, description: e.target.value })}
                    placeholder="Resumo oficial da competição..."
                    className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      URL da Foto de Capa (Opcional)
                    </label>
                    <input
                      type="url"
                      value={editingComp.bannerUrl || ''}
                      onChange={(e) => setEditingComp({ ...editingComp, bannerUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Nome do Arquivo de Regulamento (Opcional)
                    </label>
                    <input
                      type="text"
                      value={editingComp.regulationName || ''}
                      onChange={(e) => setEditingComp({ ...editingComp, regulationName: e.target.value })}
                      placeholder="Ex: Regulamento Oficial 2026.pdf"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#111111]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
                  >
                    Salvar Competição
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingComp(null);
                      setIsCreatingComp(false);
                    }}
                    className="px-4 py-2.5 border border-[#111111] text-[#666666] font-mono uppercase tracking-wider text-xs hover:text-[#111111] hover:bg-[#f4f3ef] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111]">
              {data.competitions.length === 0 ? (
                <p className="p-8 text-center text-xs text-[#777777] font-mono">
                  Nenhuma competição cadastrada. Clique em "Nova Competição" ou "Carregar Dados de Exemplo".
                </p>
              ) : (
                <div className="divide-y divide-[#e5e5e5]">
                  {data.competitions.map((comp) => (
                    <div key={comp.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="font-serif text-lg text-[#111111]">
                            {comp.name}
                          </strong>
                          <span className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                            comp.publishStatus === 'published' ? 'border-[#84cc16] text-[#84cc16] bg-[#84cc16]/10' : 'border-[#C2410C] text-[#C2410C] bg-[#C2410C]/10'
                          }`}>
                            {comp.publishStatus}
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] font-sans">
                          {comp.modality} • {comp.season} • {comp.city || 'Sem localidade definida'} • Status: <span className="font-mono">{comp.status}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingComp(comp);
                            setIsCreatingComp(false);
                          }}
                          className="p-2 border border-[#111111] hover:bg-[#111111] hover:text-[#fdfdfd] text-[#111111] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompetition(comp.id)}
                          className="p-2 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] text-[#C2410C] transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: TEAMS MANAGER                                 */}
        {/* ==================================================== */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#111111]">
                Gestão de Equipes & Atletas
              </h2>
              <button
                onClick={() => {
                  setEditingTeam({
                    id: `team_${Date.now()}`,
                    slug: '',
                    name: '',
                    modality: 'Futsal',
                    seekingSponsors: true,
                    publishStatus: 'published',
                    members: [],
                    achievements: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
                  setIsCreatingTeam(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Equipe</span>
              </button>
            </div>

            {/* Team Edit Form */}
            {editingTeam && (
              <form
                onSubmit={handleSaveTeam}
                className="bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] p-6 sm:p-8 space-y-4"
              >
                <h3 className="font-serif text-xl text-[#111111] border-b border-[#111111] pb-3">
                  {isCreatingTeam ? 'Cadastrar Nova Equipe' : `Editar: ${editingTeam.name}`}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Nome Oficial da Equipe *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                      placeholder="Ex: Atlético União Futsal"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Modalidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTeam.modality}
                      onChange={(e) => setEditingTeam({ ...editingTeam, modality: e.target.value })}
                      placeholder="Ex: Futsal, Skate..."
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Cidade / Estado
                    </label>
                    <input
                      type="text"
                      value={editingTeam.city || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, city: e.target.value })}
                      placeholder="Ex: Curitiba, PR"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Status de Publicação
                    </label>
                    <select
                      value={editingTeam.publishStatus}
                      onChange={(e) => setEditingTeam({ ...editingTeam, publishStatus: e.target.value as PublishStatus })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    >
                      <option value="published">Publicado</option>
                      <option value="draft">Rascunho</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C2410C] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTeam.seekingSponsors}
                        onChange={(e) => setEditingTeam({ ...editingTeam, seekingSponsors: e.target.checked })}
                        className="accent-[#C2410C] w-4 h-4 cursor-pointer"
                      />
                      <span>Buscando Patrocínio Oficial</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                    História / Biografia Real
                  </label>
                  <textarea
                    rows={3}
                    value={editingTeam.historyBio || ''}
                    onChange={(e) => setEditingTeam({ ...editingTeam, historyBio: e.target.value })}
                    placeholder="Histórico real da equipe..."
                    className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      URL do Escudo / Logo
                    </label>
                    <input
                      type="url"
                      value={editingTeam.crestUrl || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, crestUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Instagram Oficial
                    </label>
                    <input
                      type="text"
                      value={editingTeam.officialLinks?.instagram || ''}
                      onChange={(e) =>
                        setEditingTeam({
                          ...editingTeam,
                          officialLinks: { ...editingTeam.officialLinks, instagram: e.target.value }
                        })
                      }
                      placeholder="@equipeoficial"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#111111]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
                  >
                    Salvar Equipe
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTeam(null);
                      setIsCreatingTeam(false);
                    }}
                    className="px-4 py-2.5 border border-[#111111] text-[#666666] font-mono uppercase tracking-wider text-xs hover:text-[#111111] hover:bg-[#f4f3ef] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] divide-y divide-[#e5e5e5]">
              {data.teams.length === 0 ? (
                <p className="p-8 text-center text-xs text-[#777777] font-mono">
                  Nenhuma equipe cadastrada no sistema.
                </p>
              ) : (
                data.teams.map((team) => (
                  <div key={team.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="font-serif text-lg text-[#111111]">
                          {team.name}
                        </strong>
                        {team.seekingSponsors && (
                          <span className="px-2 py-0.5 bg-[#C2410C]/10 border border-[#C2410C] text-[#C2410C] text-[10px] font-mono uppercase font-bold">
                            Buscando Patrocínio
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                          team.publishStatus === 'published' ? 'border-[#84cc16] text-[#84cc16] bg-[#84cc16]/10' : 'border-[#666666] text-[#666666] bg-[#666666]/10'
                        }`}>
                          {team.publishStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] font-sans">
                        {team.modality} • {team.city || 'Sem cidade definida'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTeam(team);
                          setIsCreatingTeam(false);
                        }}
                        className="p-2 border border-[#111111] hover:bg-[#111111] hover:text-[#fdfdfd] text-[#111111] cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] text-[#C2410C] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: RESULTS MANAGER                               */}
        {/* ==================================================== */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#111111]">
                Gestão de Resultados Oficiais
              </h2>
              <button
                onClick={() => {
                  setEditingResult({
                    id: `res_${Date.now()}`,
                    competitionId: data.competitions[0]?.id || '',
                    stage: 'Fase de Grupos',
                    date: new Date().toISOString().split('T')[0],
                    teamAName: '',
                    scoreA: 0,
                    teamBName: '',
                    scoreB: 0,
                    publishStatus: 'published',
                    createdAt: new Date().toISOString()
                  });
                  setIsCreatingResult(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Resultado</span>
              </button>
            </div>

            {editingResult && (
              <form
                onSubmit={handleSaveResult}
                className="bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] p-6 sm:p-8 space-y-4"
              >
                <h3 className="font-serif text-xl text-[#111111] border-b border-[#111111] pb-3">
                  {isCreatingResult ? 'Lançar Resultado Oficial' : 'Editar Resultado'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Competição Relacionada
                    </label>
                    <select
                      value={editingResult.competitionId}
                      onChange={(e) => setEditingResult({ ...editingResult, competitionId: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    >
                      <option value="">Selecione...</option>
                      {data.competitions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.modality})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Etapa / Fase
                    </label>
                    <input
                      type="text"
                      required
                      value={editingResult.stage}
                      onChange={(e) => setEditingResult({ ...editingResult, stage: e.target.value })}
                      placeholder="Ex: Quartas de Final"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Data da Partida
                    </label>
                    <input
                      type="date"
                      required
                      value={editingResult.date}
                      onChange={(e) => setEditingResult({ ...editingResult, date: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-[#f4f3ef] border border-[#111111]">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-bold">
                      Equipe / Atleta A
                    </label>
                    <input
                      type="text"
                      required
                      value={editingResult.teamAName}
                      onChange={(e) => setEditingResult({ ...editingResult, teamAName: e.target.value })}
                      placeholder="Nome Equipe A"
                      className="w-full px-3 py-1.5 bg-[#ffffff] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                    <input
                      type="number"
                      value={editingResult.scoreA ?? ''}
                      onChange={(e) => setEditingResult({ ...editingResult, scoreA: Number(e.target.value) })}
                      placeholder="Pontuação A"
                      className="w-full px-3 py-1.5 bg-[#ffffff] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-bold">
                      Equipe / Atleta B (Opcional)
                    </label>
                    <input
                      type="text"
                      value={editingResult.teamBName || ''}
                      onChange={(e) => setEditingResult({ ...editingResult, teamBName: e.target.value })}
                      placeholder="Nome Equipe B"
                      className="w-full px-3 py-1.5 bg-[#ffffff] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                    <input
                      type="number"
                      value={editingResult.scoreB ?? ''}
                      onChange={(e) => setEditingResult({ ...editingResult, scoreB: Number(e.target.value) })}
                      placeholder="Pontuação B"
                      className="w-full px-3 py-1.5 bg-[#ffffff] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Vencedor Homologado
                    </label>
                    <input
                      type="text"
                      value={editingResult.winnerName || ''}
                      onChange={(e) => setEditingResult({ ...editingResult, winnerName: e.target.value })}
                      placeholder="Nome da equipe vencedora"
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Observações Técnicas
                    </label>
                    <input
                      type="text"
                      value={editingResult.notes || ''}
                      onChange={(e) => setEditingResult({ ...editingResult, notes: e.target.value })}
                      placeholder="Ex: Prorrogação, pênaltis, etc."
                      className="w-full px-3.5 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#111111]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
                  >
                    Salvar Resultado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResult(null);
                      setIsCreatingResult(false);
                    }}
                    className="px-4 py-2.5 border border-[#111111] text-[#666666] font-mono uppercase tracking-wider text-xs hover:text-[#111111] hover:bg-[#f4f3ef] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] divide-y divide-[#e5e5e5]">
              {data.results.length === 0 ? (
                <p className="p-8 text-center text-xs text-[#777777] font-mono">
                  Nenhum resultado registrado ainda.
                </p>
              ) : (
                data.results.map((r) => (
                  <div key={r.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="font-serif text-base text-[#111111]">
                          {r.teamAName} {r.scoreA !== undefined ? `(${r.scoreA})` : ''} x {r.teamBName || ''} {r.scoreB !== undefined ? `(${r.scoreB})` : ''}
                        </strong>
                        <span className="text-xs text-[#C2410C] font-mono">({r.stage})</span>
                      </div>
                      <p className="text-xs text-[#666666] font-sans">
                        Data: <span className="font-mono">{new Date(r.date).toLocaleDateString('pt-BR')}</span> {r.winnerName ? `• Vencedor: ${r.winnerName}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingResult(r);
                          setIsCreatingResult(false);
                        }}
                        className="p-2 border border-[#111111] hover:bg-[#111111] hover:text-[#fdfdfd] text-[#111111] cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteResult(r.id)}
                        className="p-2 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] text-[#C2410C] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: SPONSORSHIP LEADS CRM                         */}
        {/* ==================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="border-b border-[#111111] pb-4">
              <h2 className="font-serif text-2xl text-[#111111]">
                CRM de Leads & Propostas de Patrocínio
              </h2>
              <p className="text-xs text-[#666666] font-sans">
                Empresas e marcas que solicitaram contato e demonstraram interesse comercial através do site.
              </p>
            </div>

            {data.leads.length === 0 ? (
              <div className="bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] p-12 text-center">
                <p className="text-sm text-[#777777] font-mono">Nenhum lead comercial registrado até o momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-xl text-[#111111]">
                            {lead.companyName}
                          </h3>
                          <span className="px-2.5 py-0.5 bg-[#f4f3ef] border border-[#111111] text-xs font-mono uppercase text-[#C2410C]">
                            {lead.interestType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] mt-1 font-sans">
                          Responsável: <strong className="text-[#111111]">{lead.contactName}</strong> • {lead.email} • {lead.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className="px-3 py-1.5 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-xs font-mono uppercase tracking-wider focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                        >
                          <option value="NOVO">Novo</option>
                          <option value="CONTATADO">Contatado</option>
                          <option value="EM_NEGOCIACAO">Em Negociação</option>
                          <option value="CONCLUIDO">Concluído (Fechado)</option>
                          <option value="ARQUIVADO">Arquivado</option>
                        </select>

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 border border-[#C2410C] text-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] cursor-pointer transition-colors"
                          title="Remover lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#555555]">
                      {lead.targetName && (
                        <div>
                          <span className="text-[#777777] block font-mono">Alvo de Interesse:</span>
                          <span className="font-medium text-[#111111]">{lead.targetName}</span>
                        </div>
                      )}
                      {lead.investmentRange && (
                        <div>
                          <span className="text-[#777777] block font-mono">Faixa de Investimento:</span>
                          <span className="font-medium text-[#C2410C]">{lead.investmentRange}</span>
                        </div>
                      )}
                      {lead.website && (
                        <div>
                          <span className="text-[#777777] block font-mono">Website:</span>
                          <a href={lead.website} target="_blank" rel="noreferrer" className="text-[#C2410C] hover:underline">
                            {lead.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#fdfdfd] border border-[#e5e5e5] text-xs text-[#555555] leading-relaxed">
                      <strong className="text-[#111111] block mb-1 font-mono text-[11px] uppercase">Mensagem enviada:</strong>
                      {lead.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: SPONSORS & OPPORTUNITIES MANAGER              */}
        {/* ==================================================== */}
        {activeTab === 'sponsors' && (
          <div className="space-y-8">
            {/* Sponsors Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#111111] pb-3">
                <h2 className="font-serif text-2xl text-[#111111]">
                  Patrocinadores Oficiais
                </h2>
                <button
                  onClick={() => {
                    setEditingSponsor({
                      id: `sp_${Date.now()}`,
                      name: '',
                      category: 'PATROCINADOR',
                      logoUrl: '',
                      active: true,
                      order: data.sponsors.length + 1,
                      createdAt: new Date().toISOString()
                    });
                    setIsCreatingSponsor(true);
                  }}
                  className="px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
                >
                  + Novo Patrocinador
                </button>
              </div>

              {editingSponsor && (
                <form onSubmit={handleSaveSponsor} className="p-6 bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        required
                        value={editingSponsor.name}
                        onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Categoria</label>
                      <select
                        value={editingSponsor.category}
                        onChange={(e) => setEditingSponsor({ ...editingSponsor, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                      >
                        <option value="PATROCINADOR_OFICIAL">Patrocinador Oficial</option>
                        <option value="PATROCINADOR">Patrocinador</option>
                        <option value="PARCEIRO">Parceiro</option>
                        <option value="APOIADOR">Apoiador</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">URL do Logo</label>
                      <input
                        type="url"
                        value={editingSponsor.logoUrl}
                        onChange={(e) => setEditingSponsor({ ...editingSponsor, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#111111]">
                    <button type="submit" className="px-4 py-2 bg-[#111111] text-[#fdfdfd] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer">
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSponsor(null)}
                      className="px-3 py-2 border border-[#111111] text-xs font-mono uppercase text-[#666666] hover:bg-[#f4f3ef] hover:text-[#111111] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.sponsors.map((sp) => (
                  <div key={sp.id} className="p-4 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base text-[#111111]">{sp.name}</h4>
                      <span className="text-xs font-mono uppercase text-[#C2410C]">{sp.category}</span>
                    </div>
                    <button onClick={() => handleDeleteSponsor(sp.id)} className="text-[#C2410C] p-1.5 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] cursor-pointer transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities Section */}
            <div className="space-y-4 pt-6 border-t border-[#111111]">
              <div className="flex items-center justify-between border-b border-[#111111] pb-3">
                <h2 className="font-serif text-2xl text-[#111111]">
                  Oportunidades & Cotas Comerciais
                </h2>
                <button
                  onClick={() => {
                    setEditingOpp({
                      id: `opp_${Date.now()}`,
                      title: '',
                      type: 'COMPETITION',
                      property: 'UNIFORME',
                      description: '',
                      available: true,
                      createdAt: new Date().toISOString()
                    });
                    setIsCreatingOpp(true);
                  }}
                  className="px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
                >
                  + Nova Oportunidade
                </button>
              </div>

              {editingOpp && (
                <form onSubmit={handleSaveOpportunity} className="p-6 bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Título da Cota</label>
                      <input
                        type="text"
                        required
                        value={editingOpp.title}
                        onChange={(e) => setEditingOpp({ ...editingOpp, title: e.target.value })}
                        placeholder="Ex: Master no Peito do Uniforme"
                        className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Propriedade</label>
                      <select
                        value={editingOpp.property}
                        onChange={(e) => setEditingOpp({ ...editingOpp, property: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                      >
                        <option value="UNIFORME">Uniforme</option>
                        <option value="ESPACO_FISICO">Espaço Físico / Quadra</option>
                        <option value="BANNERS">Banners / Backdrop</option>
                        <option value="REDES_SOCIAIS">Redes Sociais</option>
                        <option value="NAMING_RIGHTS">Naming Rights</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Valor / Cota Estimada</label>
                      <input
                        type="text"
                        value={editingOpp.tierOrValue || ''}
                        onChange={(e) => setEditingOpp({ ...editingOpp, tierOrValue: e.target.value })}
                        placeholder="Ex: Cota Master / R$ 10.000"
                        className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={editingOpp.description}
                      onChange={(e) => setEditingOpp({ ...editingOpp, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#111111]">
                    <button type="submit" className="px-4 py-2 bg-[#111111] text-[#fdfdfd] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer">
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingOpp(null)}
                      className="px-3 py-2 border border-[#111111] text-xs font-mono uppercase text-[#666666] hover:bg-[#f4f3ef] hover:text-[#111111] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {data.opportunities.map((opp) => (
                  <div key={opp.id} className="p-4 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base text-[#111111]">{opp.title}</h4>
                      <p className="text-xs text-[#666666] font-mono">{opp.property} • <span className="text-[#C2410C] font-bold">{opp.tierOrValue || 'Cota Aberta'}</span></p>
                    </div>
                    <button onClick={() => handleDeleteOpportunity(opp.id)} className="text-[#C2410C] p-1.5 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] cursor-pointer transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 7: STORIES & METRICS                             */}
        {/* ==================================================== */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <h2 className="font-serif text-2xl text-[#111111]">
                Histórias Reais (Por Trás da Competição)
              </h2>
              <button
                onClick={() => {
                  setEditingStory({
                    id: `story_${Date.now()}`,
                    slug: `historia-${Date.now()}`,
                    title: '',
                    subjectName: '',
                    subjectRole: 'PARTICIPANTE',
                    content: '',
                    publishStatus: 'published',
                    createdAt: new Date().toISOString()
                  });
                  setIsCreatingStory(true);
                }}
                className="px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                + Nova História
              </button>
            </div>

            {editingStory && (
              <form onSubmit={handleSaveStory} className="p-6 bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Título da História</label>
                    <input
                      type="text"
                      required
                      value={editingStory.title}
                      onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Nome do Personagem</label>
                    <input
                      type="text"
                      required
                      value={editingStory.subjectName}
                      onChange={(e) => setEditingStory({ ...editingStory, subjectName: e.target.value })}
                      placeholder="Ex: Carlos Silva"
                      className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Conteúdo Real</label>
                  <textarea
                    rows={4}
                    required
                    value={editingStory.content}
                    onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                  />
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#111111]">
                  <button type="submit" className="px-4 py-2 bg-[#111111] text-[#fdfdfd] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditingStory(null)} className="px-3 py-2 border border-[#111111] text-xs font-mono uppercase text-[#666666] hover:bg-[#f4f3ef] hover:text-[#111111] cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {data.stories.map((s) => (
                <div key={s.id} className="p-4 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-[#111111]">{s.title}</h4>
                    <p className="text-xs text-[#666666] font-mono">{s.subjectName} ({s.subjectRole})</p>
                  </div>
                  <button onClick={() => handleDeleteStory(s.id)} className="text-[#C2410C] p-1.5 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] cursor-pointer transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 8: METRICS                                       */}
        {/* ==================================================== */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <div>
                <h2 className="font-serif text-2xl text-[#111111]">
                  Indicadores de Impacto Verificados
                </h2>
                <p className="text-xs text-[#666666] font-sans">
                  Atenção: Apenas números reais homologados devem ser adicionados aqui.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingMetric({
                    id: `met_${Date.now()}`,
                    label: '',
                    value: 0,
                    order: data.metrics.length + 1,
                    verified: true,
                    publishStatus: 'published'
                  });
                  setIsCreatingMetric(true);
                }}
                className="px-4 py-2 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                + Novo Indicador
              </button>
            </div>

            {editingMetric && (
              <form onSubmit={handleSaveMetric} className="p-6 bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Rótulo / Descrição</label>
                    <input
                      type="text"
                      required
                      value={editingMetric.label}
                      onChange={(e) => setEditingMetric({ ...editingMetric, label: e.target.value })}
                      placeholder="Ex: Equipes Confirmadas"
                      className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Valor Real</label>
                    <input
                      type="text"
                      required
                      value={editingMetric.value}
                      onChange={(e) => setEditingMetric({ ...editingMetric, value: e.target.value })}
                      placeholder="Ex: 16"
                      className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Unidade (Opcional)</label>
                    <input
                      type="text"
                      value={editingMetric.unit || ''}
                      onChange={(e) => setEditingMetric({ ...editingMetric, unit: e.target.value })}
                      placeholder="Ex: Cidades, Atletas"
                      className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#111111]">
                  <button type="submit" className="px-4 py-2 bg-[#111111] text-[#fdfdfd] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditingMetric(null)} className="px-3 py-2 border border-[#111111] text-xs font-mono uppercase text-[#666666] hover:bg-[#f4f3ef] hover:text-[#111111] cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.metrics.map((m) => (
                <div key={m.id} className="p-4 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between">
                  <div>
                    <div className="font-serif text-2xl text-[#C2410C] font-bold">{m.value} {m.unit || ''}</div>
                    <span className="text-xs font-mono uppercase text-[#666666]">{m.label}</span>
                  </div>
                  <button onClick={() => handleDeleteMetric(m.id)} className="text-[#C2410C] p-1.5 border border-[#C2410C] hover:bg-[#C2410C] hover:text-[#fdfdfd] cursor-pointer transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 9: CONTACT MESSAGES                              */}
        {/* ==================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#111111] border-b border-[#111111] pb-3">
              Mensagens Oficiais de Contato ({data.contactMessages.length})
            </h2>

            {data.contactMessages.length === 0 ? (
              <p className="p-8 text-center text-xs text-[#777777] font-mono bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111]">
                Nenhuma mensagem direta recebida.
              </p>
            ) : (
              <div className="space-y-4">
                {data.contactMessages.map((msg) => (
                  <div key={msg.id} className="p-5 bg-[#ffffff] border border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base text-[#111111]">{msg.subject}</h4>
                      <span className="text-xs font-mono text-[#777777]">{new Date(msg.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-[#666666] font-sans">De: <strong className="text-[#111111]">{msg.name}</strong> ({msg.email}) {msg.phone ? `• Tel: ${msg.phone}` : ''}</p>
                    <p className="text-xs text-[#444444] p-3 bg-[#fdfdfd] border border-[#e5e5e5] leading-relaxed font-sans">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 10: SETTINGS                                     */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-[#ffffff] border border-[#111111] shadow-[4px_4px_0px_#111111] p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl text-[#111111] border-b border-[#111111] pb-3">
              Configurações Institucionais Oficiais
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Nome da Plataforma</label>
                <input
                  type="text"
                  value={settingsForm.platformName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platformName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Entidade / Organização Responsável</label>
                <input
                  type="text"
                  value={settingsForm.organizationName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, organizationName: e.target.value })}
                  placeholder="Ex: Liga Metropolitana de Desportos"
                  className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">E-mail Oficial</label>
                <input
                  type="email"
                  value={settingsForm.officialEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, officialEmail: e.target.value })}
                  placeholder="contato@organizacao.com"
                  className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={settingsForm.officialPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, officialPhone: e.target.value })}
                  placeholder="+55 (11) 90000-0000"
                  className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Endereço / Sede</label>
                <input
                  type="text"
                  value={settingsForm.officialAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, officialAddress: e.target.value })}
                  placeholder="São Paulo - SP"
                  className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">Texto 'Sobre Nós' / Trajetória Oficial</label>
              <textarea
                rows={3}
                value={settingsForm.aboutText}
                onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                placeholder="Histórico institucional real..."
                className="w-full px-3 py-2 bg-[#fdfdfd] border border-[#111111] text-[#111111] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#C2410C]"
              />
            </div>

            <div className="pt-4 border-t border-[#111111]">
              <button
                type="submit"
                className="px-6 py-3 bg-[#111111] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold hover:bg-[#C2410C] transition-colors shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                Salvar Configurações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
