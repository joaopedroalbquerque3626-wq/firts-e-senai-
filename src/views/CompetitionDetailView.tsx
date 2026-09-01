import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  FileText,
  Download,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { CompetitionStatus } from '../types';

export const CompetitionDetailView: React.FC = () => {
  const { data, routeParam, navigateTo, openLeadModal } = useApp();

  const competition = data.competitions.find(
    (c) => c.slug === routeParam || c.id === routeParam
  );

  if (!competition) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-[#002B49] mb-4">
          Competição não encontrada
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Este torneio pode ter sido arquivado ou o endereço informado está incorreto.
        </p>
        <button
          onClick={() => navigateTo('competicoes')}
          className="px-6 py-2.5 bg-[#002B49] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#001D33] transition-colors"
        >
          Voltar para Competições
        </button>
      </div>
    );
  }

  // Linked teams
  const registeredTeams = data.teams.filter(
    (t) =>
      t.publishStatus === 'published' &&
      ((competition.registeredTeamIds && competition.registeredTeamIds.includes(t.id)) ||
        t.currentCompetitionId === competition.id)
  );

  // Linked results
  const competitionResults = data.results.filter(
    (r) => r.publishStatus === 'published' && r.competitionId === competition.id
  );

  // Linked sponsors
  const compSponsors = data.sponsors.filter(
    (s) => s.active && competition.sponsorIds && competition.sponsorIds.includes(s.id)
  );

  const getStatusBadge = (status: CompetitionStatus) => {
    switch (status) {
      case 'INSCRICOES_ABERTAS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold uppercase rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Inscrições Abertas
          </span>
        );
      case 'EM_ANDAMENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0066B2] border border-blue-200 text-xs font-bold uppercase rounded-full">
            <span className="w-2 h-2 bg-[#0066B2] rounded-full animate-ping"></span>
            Em Andamento
          </span>
        );
      case 'EM_BREVE':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold uppercase rounded-full">
            Em Breve
          </span>
        );
      case 'FINALIZADA':
        return (
          <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-200 text-xs font-medium uppercase rounded-full">
            Finalizada
          </span>
        );
    }
  };

  return (
    <div id="competition-detail-view" className="w-full bg-slate-50 text-slate-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          id="btn-back-to-competitions"
          onClick={() => navigateTo('competicoes')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0066B2] hover:text-[#002B49] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para todas as competições</span>
        </button>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-10 shadow-sm">
          {competition.bannerUrl && (
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
              <img
                src={competition.bannerUrl}
                alt={competition.name}
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-[#002B49] text-white text-xs font-bold uppercase rounded shadow">
                    {competition.modality}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-mono font-bold rounded">
                    {competition.season}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white">
                  {competition.name}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>{getStatusBadge(competition.status)}</div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openLeadModal({ type: 'COMPETITION', id: competition.id, name: competition.name })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#002B49] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#001D33] transition-all"
                >
                  <span>Patrocinar Evento</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/60 text-[#0066B2] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Datas Oficiais</div>
                  <div className="text-xs font-bold text-slate-800">
                    {competition.startDate} a {competition.endDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/60 text-[#0066B2] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Local & Cidade</div>
                  <div className="text-xs font-bold text-slate-800">
                    {competition.location}, {competition.city}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/60 text-[#0066B2] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Equipes Inscritas</div>
                  <div className="text-xs font-bold text-slate-800">
                    {registeredTeams.length > 0 ? registeredTeams.length : competition.teamsCount} Times Homologados
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/60 text-[#0066B2] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Organização</div>
                  <div className="text-xs font-bold text-slate-800">
                    {competition.organization || 'Organização não informada'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <h3 className="text-base font-heading font-bold text-[#002B49]">
                Sobre o Desafio & Regras da Temporada
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {competition.description}
              </p>
            </div>

            {/* Regulation & Game Manual */}
            {competition.regulationUrl && (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0066B2] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Manual e regulamento técnico
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Consulte as dimensões de arena, regras de segurança, inspeção de robôs e pontuação.
                    </p>
                  </div>
                </div>

                <a
                  href={competition.regulationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0066B2] hover:bg-[#004C85] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Manual (PDF)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Stages */}
        {competition.schedule && competition.schedule.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-[#002B49] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0066B2]" />
              <span>Cronograma e etapas do torneio</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competition.schedule.map((stage) => (
                <div
                  key={stage.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="text-[11px] font-mono font-bold text-[#0066B2]">
                    {stage.date}
                  </div>
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    {stage.title}
                  </h3>
                  {stage.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {stage.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match Results */}
        {competitionResults.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-[#002B49] mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFC72C]" />
              <span>Súmulas & Placar de Alianças Homologado</span>
            </h2>

            <div className="space-y-4">
              {competitionResults.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {res.stage}
                    </span>
                    <span className="font-mono">{res.date}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                    <div className="md:col-span-4 p-3 bg-red-50 rounded-lg border border-red-200 text-xs font-bold text-slate-900">
                      <span className="text-[10px] font-bold text-[#ED1C24] uppercase block">
                        Aliança Vermelha
                      </span>
                      {res.teamAName}
                    </div>

                    <div className="md:col-span-3 text-center">
                      <span className="text-2xl font-mono font-black text-[#002B49]">
                        <span className="text-[#ED1C24]">{res.scoreA ?? '-'}</span>
                        <span className="mx-2 text-slate-300">:</span>
                        <span className="text-[#0066B2]">{res.scoreB ?? '-'}</span>
                      </span>
                    </div>

                    <div className="md:col-span-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs font-bold text-slate-900 text-right">
                      <span className="text-[10px] font-bold text-[#0066B2] uppercase block">
                        Aliança Azul
                      </span>
                      {res.teamBName}
                    </div>
                  </div>

                  {res.winnerName && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Aliança Vencedora: {res.winnerName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registered Teams */}
        {registeredTeams.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-[#002B49] mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0066B2]" />
              <span>Equipes Homologadas & Pits da Arena</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {registeredTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0066B2] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => navigateTo('team-detail', team.slug)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        team.crestUrl ||
                        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={team.name}
                      className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200"
                    />
                    <div>
                      <div className="text-[10px] font-mono font-bold text-[#0066B2]">
                        {team.modality}
                      </div>
                      <div className="font-heading font-bold text-xs text-slate-900 group-hover:text-[#0066B2]">
                        {team.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{team.location}</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0066B2]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Sponsors */}
        {compSponsors.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#002B49] mb-4">
              Patrocinadores Oficiais Deste Evento
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              {compSponsors.map((sp) => (
                <div key={sp.id} className="flex items-center gap-2">
                  {sp.logoUrl ? (
                    <img src={sp.logoUrl} alt={sp.name} className="h-8 object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-slate-700">{sp.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
