import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { Calendar, MapPin, Users, ArrowRight, Search, Trophy, ArrowUpRight, Bot, Sparkles } from 'lucide-react';
import { CompetitionStatus } from '../types';
import { formatDate } from '../utils/formatters';

export const CompetitionsView: React.FC = () => {
  const { data, navigateTo, openLeadModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedModality, setSelectedModality] = useState<string>('ALL');

  const publishedCompetitions = useMemo(() => {
    return data.competitions.filter((c) => c.publishStatus === 'published');
  }, [data.competitions]);

  const modalities = useMemo(() => {
    const set = new Set<string>();
    publishedCompetitions.forEach((c) => {
      if (c.modality) set.add(c.modality);
    });
    return Array.from(set);
  }, [publishedCompetitions]);

  const filteredCompetitions = useMemo(() => {
    return publishedCompetitions.filter((c) => {
      const matchSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.modality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
      const matchModality = selectedModality === 'ALL' || c.modality === selectedModality;

      return matchSearch && matchStatus && matchModality;
    });
  }, [publishedCompetitions, searchQuery, selectedStatus, selectedModality]);

  const getStatusBadge = (status: CompetitionStatus) => {
    switch (status) {
      case 'INSCRICOES_ABERTAS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#78BE20]/15 text-[#2e5d03] border border-[#78BE20]/40 text-xs font-bold rounded-full">
            <span className="w-2 h-2 bg-[#78BE20] rounded-full animate-pulse"></span>
            Inscrições Abertas
          </span>
        );
      case 'EM_ANDAMENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0066B2]/15 text-[#0066B2] border border-[#0066B2]/40 text-xs font-bold rounded-full">
            <span className="w-2 h-2 bg-[#0066B2] rounded-full animate-ping"></span>
            Em Andamento
          </span>
        );
      case 'EM_BREVE':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-full">
            Em Breve
          </span>
        );
      case 'FINALIZADA':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium rounded-full">
            Finalizada
          </span>
        );
    }
  };

  return (
    <div id="competitions-view" className="w-full bg-[#f8fafc] text-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3 text-xs font-bold text-[#0066B2]">
            <Trophy className="w-3.5 h-3.5 text-[#0066B2]" />
            <span>Calendário de competições e arenas</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#002B49] tracking-tight leading-tight">
            Competições & Torneios
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed">
            Explore o calendário demonstrativo, as modalidades, os regulamentos de referência e as equipes vinculadas a cada evento.
          </p>
        </div>

        {/* Filters and Search Bar */}
        {publishedCompetitions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search input */}
              <div className="md:col-span-6 relative">
                <input
                  id="search-competitions-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por torneio, modalidade (FRC, FTC, FLL) ou cidade..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              {/* Status filter */}
              <div className="md:col-span-3">
                <select
                  id="filter-competition-status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="INSCRICOES_ABERTAS">Inscrições Abertas</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="EM_BREVE">Em Breve</option>
                  <option value="FINALIZADA">Finalizadas</option>
                </select>
              </div>

              {/* Modality filter */}
              {modalities.length > 0 && (
                <div className="md:col-span-3">
                  <select
                    id="filter-competition-modality"
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  >
                    <option value="ALL">Todas as Modalidades (FLL, FTC, FRC)</option>
                    {modalities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Competitions Grid or Zero-State */}
        {publishedCompetitions.length === 0 ? (
          <EmptyState
            title="Nenhum torneio publicado no momento"
            description="Ainda não há competições publicadas. O administrador pode cadastrar um evento ou restaurar o cenário demonstrativo."
            adminActionTab="competitions"
          />
        ) : filteredCompetitions.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-600 mb-4">Nenhuma competição encontrada para os filtros selecionados.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedModality('ALL');
              }}
              className="px-5 py-2.5 bg-[#0066B2] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#004C85] transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp) => (
              <article
                key={comp.id}
                id={`competition-card-${comp.id}`}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                {/* Banner Header */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={comp.bannerUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'}
                    alt={comp.name}
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(comp.status)}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 bg-[#002B49]/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider rounded-md border border-white/10">
                      {comp.modality}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#002B49] mb-2 leading-snug">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0066B2]" />
                        <span>{formatDate(comp.startDate, 'Data a confirmar')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0066B2]" />
                        <span>{comp.city ? `${comp.city} - ${comp.location}` : comp.location || 'Local não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#0066B2]" />
                        <span>{comp.teamsCount ? `${comp.teamsCount} equipes inscritas` : 'Inscrições abertas'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('competition-detail', comp.slug || comp.id)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-[#0066B2] text-[#002B49] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>Ver Súmula, Regulamento & Pits</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openLeadModal({ type: 'COMPETITION', id: comp.id, name: comp.name })}
                      className="w-full py-2 text-center text-xs font-bold text-[#0066B2] hover:text-[#004C85] transition-colors"
                    >
                      Patrocinar esta Etapa / Arena
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
