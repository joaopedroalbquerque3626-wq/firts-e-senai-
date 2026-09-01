import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { Search, ArrowRight, ArrowUpRight, Users, Bot, MapPin, HeartHandshake, Award } from 'lucide-react';

export const TeamsView: React.FC = () => {
  const { data, navigateTo, openLeadModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('ALL');
  const [onlySeekingSponsors, setOnlySeekingSponsors] = useState(false);

  const publishedTeams = useMemo(() => {
    return data.teams.filter((t) => t.publishStatus === 'published');
  }, [data.teams]);

  const modalities = useMemo(() => {
    const set = new Set<string>();
    publishedTeams.forEach((t) => {
      if (t.modality) set.add(t.modality);
    });
    return Array.from(set);
  }, [publishedTeams]);

  const filteredTeams = useMemo(() => {
    return publishedTeams.filter((t) => {
      const matchSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.modality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.city && t.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchModality = selectedModality === 'ALL' || t.modality === selectedModality;
      const matchSponsorFilter = !onlySeekingSponsors || t.seekingSponsors;

      return matchSearch && matchModality && matchSponsorFilter;
    });
  }, [publishedTeams, searchQuery, selectedModality, onlySeekingSponsors]);

  return (
    <div id="teams-view" className="w-full bg-[#f8fafc] text-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3 text-xs font-bold text-[#0066B2]">
            <Bot className="w-3.5 h-3.5 text-[#0066B2]" />
            <span>Diretório Oficial de Equipes, Robôs & Pits FIRST®</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#002B49] tracking-tight leading-tight">
            Equipes Oficiais da Temporada
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed">
            Conheça as equipes homologadas (FRC®, FTC®, FLL®), seus robôs industriais, projetos de impacto social e conecte sua empresa para apoiar o financiamento da temporada.
          </p>
        </div>

        {/* Filters and Search Bar */}
        {publishedTeams.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search */}
              <div className="md:col-span-6 relative">
                <input
                  id="search-teams-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome da equipe, número (#), modalidade ou cidade..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              {/* Modality Filter */}
              {modalities.length > 0 && (
                <div className="md:col-span-3">
                  <select
                    id="filter-team-modality"
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  >
                    <option value="ALL">Todas as Modalidades</option>
                    {modalities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggle Seeking Sponsors */}
              <div className="md:col-span-3 flex items-center">
                <label className="flex items-center gap-2 text-xs font-bold text-[#002B49] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlySeekingSponsors}
                    onChange={(e) => setOnlySeekingSponsors(e.target.checked)}
                    className="accent-[#0066B2] w-4 h-4 cursor-pointer rounded"
                  />
                  <span>Buscando Patrocínio Aberto</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Teams Grid or Empty State */}
        {publishedTeams.length === 0 ? (
          <EmptyState
            title="Nenhuma equipe cadastrada no momento"
            description="Os perfis oficiais das equipes estão sendo homologados pela comissão técnica da FIRST®."
            adminActionTab="teams"
          />
        ) : filteredTeams.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-600 mb-4">Nenhuma equipe encontrada para os filtros selecionados.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedModality('ALL');
                setOnlySeekingSponsors(false);
              }}
              className="px-5 py-2.5 bg-[#0066B2] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#004C85] transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <article
                key={team.id}
                id={`team-card-${team.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Team Header & Crest */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={team.crestUrl || 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=150&q=80'}
                        alt={team.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                      />
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#0066B2] block">
                          {team.modality}
                        </span>
                        <h3 className="font-heading font-bold text-lg text-[#002B49] leading-tight">
                          {team.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {team.historyBio}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0066B2]" />
                    <span>{team.city ? `${team.city} - ${team.location}` : team.location || 'Localização Oficial'}</span>
                  </div>

                  {team.seekingSponsors && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg w-full">
                      <HeartHandshake className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Cotas de Patrocínio Abertas</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => navigateTo('team-detail', team.slug || team.id)}
                    className="text-xs font-bold text-[#0066B2] hover:text-[#004C85] inline-flex items-center gap-1"
                  >
                    <span>Ver Pit & Conquistas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openLeadModal({ type: 'TEAM', id: team.id, name: team.name })}
                    className="px-3.5 py-1.5 bg-[#0066B2] hover:bg-[#004C85] text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Patrocinar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
