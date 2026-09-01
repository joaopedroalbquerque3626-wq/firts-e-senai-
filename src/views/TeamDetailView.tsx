import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Users,
  MapPin,
  Globe,
  Instagram,
  Award,
  Bot,
  ShieldCheck,
  Zap,
  Calendar
} from 'lucide-react';

export const TeamDetailView: React.FC = () => {
  const { data, routeParam, navigateTo, openLeadModal } = useApp();

  const team = data.teams.find(
    (t) => t.slug === routeParam || t.id === routeParam
  );

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-[#002B49] mb-4">
          Equipe não encontrada
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Esta equipe pode ter sido arquivada ou o número/slug informado está incorreto.
        </p>
        <button
          onClick={() => navigateTo('equipes')}
          className="px-6 py-2.5 bg-[#002B49] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#001D33] transition-colors"
        >
          Voltar para Equipes
        </button>
      </div>
    );
  }

  // Linked current competition
  const currentCompetition = team.currentCompetitionId
    ? data.competitions.find((c) => c.id === team.currentCompetitionId)
    : null;

  // Linked sponsors
  const teamSponsors = data.sponsors.filter(
    (s) => s.active && team.sponsorIds && team.sponsorIds.includes(s.id)
  );

  return (
    <div id="team-detail-view" className="w-full bg-slate-50 text-slate-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          id="btn-back-to-teams"
          onClick={() => navigateTo('equipes')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0066B2] hover:text-[#002B49] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para todas as equipes</span>
        </button>

        {/* Team Hero Header */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-10 shadow-sm">
          {team.bannerUrl && (
            <div className="relative h-48 sm:h-72 w-full overflow-hidden bg-slate-900">
              <img
                src={team.bannerUrl}
                alt={team.name}
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {team.crestUrl ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden shrink-0 -mt-16 sm:-mt-20 relative z-10">
                    <img
                      src={team.crestUrl}
                      alt={team.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#002B49] text-white flex items-center justify-center font-heading font-black text-2xl shadow-md -mt-16 sm:-mt-20 relative z-10">
                    {team.teamNumber || team.name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-[#002B49] text-white text-xs font-mono font-bold uppercase rounded">
                      {team.teamNumber || '#0000'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-[#0066B2] text-xs font-bold uppercase rounded border border-blue-200">
                      {team.division || team.modality}
                    </span>
                    {team.location && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {team.location}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#002B49]">
                    {team.name}
                  </h1>
                </div>
              </div>

              {team.seekingSponsors && (
                <div className="sm:self-center shrink-0">
                  <button
                    id="btn-sponsor-this-team-hero"
                    onClick={() => openLeadModal(undefined, undefined, team.id, team.name)}
                    className="px-6 py-3 bg-[#ED1C24] hover:bg-[#C91319] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <span>Patrocinar Esta Equipe</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Social & Contact Links */}
            {(team.instagram || team.website || team.contactEmail) && (
              <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-slate-100 text-xs">
                {team.instagram && (
                  <a
                    href={`https://instagram.com/${team.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-600 hover:text-[#0066B2] font-medium"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>@{team.instagram.replace('@', '')}</span>
                  </a>
                )}

                {team.website && (
                  <a
                    href={team.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-600 hover:text-[#0066B2] font-medium"
                  >
                    <Globe className="w-4 h-4 text-[#0066B2]" />
                    <span>{team.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* History / Bio */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm space-y-3">
          <h2 className="text-xl font-heading font-bold text-[#002B49]">
            História da Equipe & Filosofia Gracious Professionalism®
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {team.historyBio ||
              'Equipe ativa no ecossistema FIRST® Brasil, dedicada à capacitação de jovens estudantes em robótica avançada, engenharia, inovação social e liderança colaborativa.'}
          </p>
        </div>

        {/* Current Active Competition */}
        {currentCompetition && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0066B2]">
                  Torneio da Temporada
                </span>
                <h3 className="text-lg font-heading font-bold text-[#002B49] mt-0.5">
                  {currentCompetition.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentCompetition.startDate} a {currentCompetition.endDate} • {currentCompetition.location}
                </p>
              </div>

              <button
                onClick={() => navigateTo('competition-detail', currentCompetition.slug || currentCompetition.id)}
                className="px-4 py-2 bg-blue-50 text-[#0066B2] text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <span>Ver Hub do Evento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Awards & Blue Banners */}
        {team.achievements && team.achievements.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-[#002B49] mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFC72C]" />
              <span>Conquistas, Prêmios & Blue Banners</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#0066B2]">
                      {ach.year}
                    </span>
                    <Award className="w-4 h-4 text-[#FFC72C]" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#002B49]">
                    {ach.title}
                  </h4>
                  {ach.competition && (
                    <div className="text-xs text-slate-500">{ach.competition}</div>
                  )}
                  {ach.description && (
                    <p className="text-xs text-slate-600 pt-1">{ach.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Members & Mentors Roster */}
        {team.members && team.members.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-[#002B49] mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0066B2]" />
              <span>Estudantes & Mentores Voluntários</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                >
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#002B49] text-white flex items-center justify-center font-bold text-sm">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="font-heading font-bold text-xs text-slate-900">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-[#0066B2] font-semibold">
                      {member.role}
                    </div>
                    {member.number && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        #{member.number}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Sponsors */}
        {teamSponsors.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#002B49] mb-4">
              Patrocinadores Oficiais Desta Equipe
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              {teamSponsors.map((sp) => (
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
