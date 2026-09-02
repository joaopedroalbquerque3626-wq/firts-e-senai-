import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { Trophy, Calendar, Filter, Award, Bot } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ResultsView: React.FC = () => {
  const { data, navigateTo } = useApp();
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>('ALL');

  const publishedResults = useMemo(() => {
    return data.results.filter((r) => r.publishStatus === 'published');
  }, [data.results]);

  const filteredResults = useMemo(() => {
    if (selectedCompetitionId === 'ALL') return publishedResults;
    return publishedResults.filter((r) => r.competitionId === selectedCompetitionId);
  }, [publishedResults, selectedCompetitionId]);

  return (
    <div id="results-view" className="w-full bg-[#f8fafc] text-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3 text-xs font-bold text-[#0066B2]">
            <Trophy className="w-3.5 h-3.5 text-[#0066B2]" />
            <span>Súmulas, placares de arena e resultados</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#002B49] tracking-tight leading-tight">
            Resultados & Prêmios
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed">
            Consulte pontuações demonstrativas de alianças, etapas, vencedores e observações técnicas cadastradas no painel.
          </p>
        </div>

        {/* Competition Filter */}
        {publishedResults.length > 0 && data.competitions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-10 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#002B49] shrink-0">
              <Filter className="w-4 h-4 text-[#0066B2]" />
              <span>Filtrar por Torneio:</span>
            </div>
            <select
              id="select-filter-result-competition"
              value={selectedCompetitionId}
              onChange={(e) => setSelectedCompetitionId(e.target.value)}
              className="w-full sm:max-w-md px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
            >
              <option value="ALL">Todos os Torneios da Temporada</option>
              {data.competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} ({comp.modality})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results List or Empty State */}
        {publishedResults.length === 0 ? (
          <EmptyState
            title="Nenhuma súmula de arena publicada ainda"
            description="Ainda não há resultados publicados. O administrador pode registrar uma súmula no painel."
            adminActionTab="results"
          />
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-600 mb-4">Nenhum resultado registrado para este torneio ainda.</p>
            <button
              onClick={() => setSelectedCompetitionId('ALL')}
              className="px-5 py-2.5 bg-[#0066B2] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#004C85] transition-colors"
            >
              Ver Todas as Súmulas
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredResults.map((result) => {
              const comp = data.competitions.find((c) => c.id === result.competitionId);

              return (
                <article
                  key={result.id}
                  id={`result-card-${result.id}`}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    {/* Top match meta */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-xs">
                        {comp && (
                          <button
                            onClick={() => navigateTo('competition-detail', comp.slug || comp.id)}
                            className="font-bold text-[#0066B2] hover:underline"
                          >
                            {comp.name}
                          </button>
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                          {result.stage}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(result.date)}</span>
                      </div>
                    </div>

                    {/* Official Alliance Scoreboard Display */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                      {/* Red Alliance Side */}
                      <div className="md:col-span-5 p-4 rounded-xl bg-red-50/80 border border-red-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 block">
                            Aliança Vermelha (Red Alliance)
                          </span>
                          <span className="font-heading font-bold text-sm sm:text-base text-red-950">
                            {result.teamAName}
                          </span>
                        </div>
                        <div className="font-heading font-black text-2xl sm:text-3xl text-red-700 ml-4">
                          {result.scoreA !== undefined ? result.scoreA : '-'}
                        </div>
                      </div>

                      {/* VS Center Marker */}
                      <div className="md:col-span-2 text-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-black uppercase rounded-full border border-slate-200">
                          VS
                        </span>
                      </div>

                      {/* Blue Alliance Side */}
                      <div className="md:col-span-5 p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#0066B2] block">
                            Aliança Azul (Blue Alliance)
                          </span>
                          <span className="font-heading font-bold text-sm sm:text-base text-[#002B49]">
                            {result.teamBName || 'Aliança Desafiante'}
                          </span>
                        </div>
                        <div className="font-heading font-black text-2xl sm:text-3xl text-[#0066B2] ml-4">
                          {result.scoreB !== undefined ? result.scoreB : '-'}
                        </div>
                      </div>
                    </div>

                    {/* Technical Notes / Match Breakdown */}
                    {result.notes && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                        <Bot className="w-4 h-4 text-[#0066B2] shrink-0 mt-0.5" />
                        <span>{result.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Winner Banner / Blue Banner Status */}
                  {result.winnerName && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#78BE20]" />
                        <span className="text-xs font-bold text-[#002B49]">
                          Vencedor da Partida: <span className="text-[#0066B2]">{result.winnerName}</span>
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#002B49] text-white text-xs font-bold rounded-lg shadow-xs">
                        <Award className="w-3.5 h-3.5 text-[#00A3E0]" />
                        <span>Resultado publicado</span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
