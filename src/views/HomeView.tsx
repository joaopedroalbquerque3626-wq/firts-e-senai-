import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Users,
  Trophy,
  CheckCircle2,
  Bot,
  Layers,
  HeartHandshake,
  Compass,
  Lightbulb,
  Globe2,
  Smile,
  ExternalLink,
  Quote
} from 'lucide-react';
import { CompetitionStatus } from '../types';
import { FirstLogo, SenaiLogo } from '../components/Logos';
import { formatDate } from '../utils/formatters';

export const HomeView: React.FC = () => {
  const { data, navigateTo, openLeadModal } = useApp();
  const [activeProgressionTab, setActiveProgressionTab] = useState<'all' | 'fll' | 'ftc' | 'frc' | 'alumni'>('all');

  const publishedCompetitions = data.competitions.filter((c) => c.publishStatus === 'published');
  const publishedTeams = data.teams.filter((t) => t.publishStatus === 'published');
  const publishedStories = data.stories.filter((s) => s.publishStatus === 'published');
  const verifiedMetrics = data.metrics.filter((m) => m.publishStatus === 'published' && m.verified);
  const activeSponsors = data.sponsors.filter((s) => s.active);
  const featuredCompetition = publishedCompetitions[0];

  const getStatusBadge = (status: CompetitionStatus) => {
    switch (status) {
      case 'INSCRICOES_ABERTAS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#78BE20]/15 text-[#3b7107] border border-[#78BE20]/30 text-xs font-bold rounded-full">
            <span className="w-2 h-2 bg-[#78BE20] rounded-full animate-pulse"></span>
            Inscrições Abertas
          </span>
        );
      case 'EM_ANDAMENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0066B2]/15 text-[#0066B2] border border-[#0066B2]/30 text-xs font-bold rounded-full">
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

  const programs = [
    {
      id: 'fll',
      tag: 'FLL®',
      title: 'FIRST® LEGO® League',
      age: 'Aprendizagem com LEGO® Education',
      description: 'Programa de robótica educacional com atividades de pesquisa, projeto, construção e programação em equipe.',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      features: ['Construção e programação', 'Projeto de inovação', 'Trabalho em equipe', 'Resolução de problemas']
    },
    {
      id: 'ftc',
      tag: 'FTC®',
      title: 'FIRST® Tech Challenge',
      age: 'Desafio intermediário de engenharia',
      description: 'Equipes projetam, constroem e programam robôs para desafios de arena, documentando decisões técnicas e aprendizados.',
      color: 'from-blue-600 to-cyan-700',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      features: ['Projeto mecânico', 'Programação e sensores', 'Estratégia de arena', 'Documentação de engenharia']
    },
    {
      id: 'frc',
      tag: 'FRC®',
      title: 'FIRST® Robotics Competition',
      age: 'Robótica de maior escala',
      description: 'Equipes multidisciplinares desenvolvem robôs de maior porte para desafios anuais, combinando engenharia, programação, gestão e comunicação.',
      color: 'from-red-600 to-rose-700',
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
      features: ['Engenharia integrada', 'Programação e automação', 'Estratégia e cooperação', 'Gestão de equipe']
    },
    {
      id: 'alumni',
      tag: 'Alumni & Bolsas',
      title: 'FIRST® Alumni & Bolsas de Estudo',
      age: 'Universitários e Profissionais',
      description: 'Uma rede de ex-participantes que mantém conexões com educação, mentoria e oportunidades profissionais divulgadas pelos canais oficiais.',
      color: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      features: ['Comunidade de ex-participantes', 'Mentoria', 'Oportunidades educacionais', 'Desenvolvimento profissional']
    }
  ];

  const filteredPrograms = activeProgressionTab === 'all'
    ? programs
    : programs.filter(p => p.id === activeProgressionTab);

  return (
    <div id="home-view" className="w-full bg-[#f8fafc] text-slate-900">
      {/* 01: HERO SECTION - FIRST INSPIRES STYLE */}
      <section
        id="hero-section"
        className="relative bg-gradient-to-br from-[#001A2E] via-[#002B49] to-[#003B66] text-white pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 overflow-hidden"
      >
        {/* Abstract Geometry Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#0066B2]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#78BE20]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Master Headline & Call to Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Co-Branding Badge: FIRST + SENAI Verde */}
              <div className="inline-flex items-center gap-3 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <FirstLogo className="h-7 w-auto" variant="light" />
                <span className="h-6 w-px bg-white/30" />
                <div className="flex flex-col text-left">
                  <SenaiLogo className="h-4 sm:h-5 w-auto" variant="white" />
                  <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#78BE20]">
                    Projeto independente
                  </span>
                </div>
              </div>

              <h1
                id="hero-master-headline"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-white"
              >
                Inspirando Jovens a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] via-white to-[#78BE20]">
                  Transformar o Futuro.
                </span>
              </h1>

              <p
                id="hero-description"
                className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-sans"
              >
                Um portal independente para acompanhar competições de robótica, conhecer equipes e aproximar projetos de possíveis patrocinadores. Informações institucionais devem ser confirmadas nos canais oficiais da <strong className="text-white font-bold">FIRST®</strong> e do <strong className="text-[#78BE20] font-bold">SENAI</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-btn-explore-competitions"
                  onClick={() => navigateTo('competicoes')}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-[#0066B2] hover:bg-[#005596] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Trophy className="w-4 h-4 text-[#78BE20]" />
                  <span>Ver Torneios & Arenas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-btn-sponsorship"
                  onClick={() => openLeadModal()}
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <HeartHandshake className="w-4 h-4 text-[#00A3E0]" />
                  <span>Seja um Patrocinador</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Motto highlight */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#78BE20]" />
                  <span>More Than Robots®</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A3E0]" />
                  <span>Gracious Professionalism®</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ED1C24]" />
                  <span>Coopertition®</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Spotlight Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-white/15 text-white shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#00A3E0] font-bold flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#78BE20]" />
                    Competição em destaque
                  </span>
                  {featuredCompetition && getStatusBadge(featuredCompetition.status)}
                </div>
                {featuredCompetition ? (
                  <>
                    <h3 className="font-heading font-bold text-xl text-white mb-2">{featuredCompetition.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {featuredCompetition.description || 'Consulte os detalhes cadastrados desta competição.'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-black/20 p-3 rounded-xl mb-4 border border-white/5">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Data:</span>
                        <span className="font-semibold text-white">{formatDate(featuredCompetition.startDate)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Modalidade:</span>
                        <span className="font-semibold text-[#00A3E0]">{featuredCompetition.modality}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateTo('competition-detail', featuredCompetition.slug || featuredCompetition.id)}
                      className="w-full py-2.5 bg-white text-[#002B49] hover:bg-slate-100 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                    >
                      <span>Ver detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-sm text-slate-300">
                    Nenhuma competição verificada foi publicada ainda.
                  </div>
                )}
              </div>

              {/* Project positioning card */}
              <div className="bg-gradient-to-r from-[#002B49]/80 to-[#001A2E]/80 border border-white/10 rounded-2xl p-5 text-slate-300 text-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0066B2] text-white flex items-center justify-center shrink-0 font-heading font-black text-lg">
                  FIRST
                </div>
                <div>
                  <p className="text-slate-200">
                    Robótica como ferramenta de aprendizagem, trabalho em equipe e inovação.
                  </p>
                  <span className="text-[11px] font-semibold text-[#00A3E0] mt-1 block">
                    Conteúdo educacional e informativo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02: IMPACT NUMBERS & OFFICIAL METRICS (FIRST Inspires Study) */}
      <section id="metrics-section" className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
              Indicadores publicados
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49] mt-1">
              O Alcance Global da FIRST®
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Somente dados marcados como verificados pela equipe responsável aparecem nesta área.
            </p>
          </div>

          {verifiedMetrics.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {verifiedMetrics.slice(0, 4).map((metric) => (
                <div key={metric.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:border-[#0066B2] transition-colors shadow-xs">
                  <div className="text-3xl sm:text-4xl font-heading font-black text-[#0066B2] mb-1">
                    {metric.value}{metric.unit || ''}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#002B49] block">{metric.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500">Nenhum indicador verificado foi publicado.</p>
          )}
        </div>
      </section>

      {/* 03: THE FIRST PROGRESSION OF PROGRAMS (K-12 Pathways) */}
      <section id="programs-section" className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
                Da Educação Infantil ao Ensino Médio
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#002B49] mt-1">
                A Progressão de Programas FIRST®
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-2">
                Uma trilha de aprendizagem contínua para desenvolver curiosidade, habilidades práticas de engenharia e espírito de liderança em cada faixa etária.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex w-full md:w-auto items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActiveProgressionTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeProgressionTab === 'all' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveProgressionTab('fll')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeProgressionTab === 'fll' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FLL®
              </button>
              <button
                onClick={() => setActiveProgressionTab('ftc')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeProgressionTab === 'ftc' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FTC®
              </button>
              <button
                onClick={() => setActiveProgressionTab('frc')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeProgressionTab === 'frc' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FRC®
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${program.badgeColor}`}>
                      {program.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{program.age}</span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#002B49] mb-3">
                    {program.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Destaques do Programa:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {program.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78BE20] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <button
                    onClick={() => navigateTo('competicoes')}
                    className="text-xs font-bold text-[#0066B2] hover:text-[#004C85] inline-flex items-center gap-1.5"
                  >
                    <span>Ver Competições {program.tag.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openLeadModal({ type: 'INSTITUTIONAL', name: `Apoio ao Programa ${program.title}` })}
                    className="text-xs font-semibold text-slate-500 hover:text-[#002B49]"
                  >
                    Patrocinar Programa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04: CORE VALUES (O Coração da FIRST®) */}
      <section id="core-values-section" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
              Filosofia & Valores
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#002B49] mt-1">
              Os Valores Fundamentais da FIRST®
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              O que faz da FIRST® uma experiência única no mundo não é apenas o hardware, mas a formação de caráter ético, respeito e colaboração através de <strong className="text-[#002B49]">Gracious Professionalism®</strong> e <strong className="text-[#002B49]">Coopertition®</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Value 1: Discovery */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#0066B2] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066B2] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#002B49] mb-1">
                Descoberta (Discovery)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exploramos novas habilidades e ideias, estimulando a curiosidade científica e o aprendizado contínuo através da experimentação.
              </p>
            </div>

            {/* Value 2: Innovation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#78BE20] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-[#78BE20] flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#002B49] mb-1">
                Inovação (Innovation)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Usamos criatividade e persistência para resolver problemas reais de engenharia e criar projetos sustentáveis para a humanidade.
              </p>
            </div>

            {/* Value 3: Impact */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#ED1C24] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#ED1C24] flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#002B49] mb-1">
                Impacto (Impact)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplicamos tudo o que aprendemos para melhorar nossa comunidade local e construir um mundo mais justo, inclusivo e sustentável.
              </p>
            </div>

            {/* Value 4: Inclusion */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#00A3E0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#00A3E0] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#002B49] mb-1">
                Inclusão (Inclusion)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Respeitamos uns aos outros e abraçamos nossas diferenças. Todas as vozes são ouvidas e valorizadas dentro e fora da arena.
              </p>
            </div>

            {/* Value 5: Teamwork */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-[#F57E25] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F57E25] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#002B49] mb-1">
                Trabalho em Equipe (Teamwork)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Somos muito mais fortes quando trabalhamos juntos em alianças colaborativas onde cada estudante traz seu talento único.
              </p>
            </div>

            {/* Value 6: Fun */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-purple-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Smile className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#002B49] mb-1">
                Diversão (Fun)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Celebramos nossas conquistas, cantamos nos pits e nos divertimos a cada rodada da temporada. A ciência é uma grande festa!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05: UPCOMING COMPETITIONS & ARENA CALENDAR */}
      <section id="competitions-calendar-section" className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
                Calendário da Temporada
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49] mt-1">
                Torneios Regionais & Finais
              </h2>
            </div>

            <button
              onClick={() => navigateTo('competicoes')}
              className="text-xs font-bold text-[#0066B2] hover:text-[#004C85] inline-flex items-center gap-1.5"
            >
              <span>Ver todas as competições</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {publishedCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedCompetitions.slice(0, 3).map((comp) => (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={comp.bannerUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'}
                    alt={comp.name}
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(comp.status)}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-md">
                      {comp.modality}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#002B49] mb-2 leading-snug">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {comp.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0066B2]" />
                        <span>{formatDate(comp.startDate, 'Data a confirmar')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0066B2]" />
                        <span>{comp.city || 'Local não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#0066B2]" />
                        <span>{comp.teamsCount ? `${comp.teamsCount} equipes inscritas` : 'Inscrições abertas'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('competition-detail', comp.slug || comp.id)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-[#0066B2] text-[#002B49] hover:text-white rounded-lg text-xs font-bold transition-all text-center"
                  >
                    Ver Súmula e Pits do Torneio
                  </button>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              Nenhuma competição foi publicada neste cenário.
            </div>
          )}
        </div>
      </section>

      {/* 06: SPOTLIGHT TEAMS & ROBOTS */}
      <section id="teams-section" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
                Pit Directory
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49] mt-1">
                Equipes do Cenário
              </h2>
            </div>

            <button
              onClick={() => navigateTo('equipes')}
              className="text-xs font-bold text-[#0066B2] hover:text-[#004C85] inline-flex items-center gap-1.5"
            >
              <span>Ver todas as equipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {publishedTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedTeams.slice(0, 3).map((team) => (
              <div
                key={team.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={team.crestUrl || 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=150&q=80'}
                        alt={team.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                      />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#0066B2]">
                          {team.modality}
                        </span>
                        <h4 className="font-heading font-bold text-base text-[#002B49]">
                          {team.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {team.historyBio}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{team.city || team.location}</span>
                  </div>

                  {team.seekingSponsors && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold rounded-lg">
                      <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                      Buscando Patrocínio para a Temporada
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <button
                    onClick={() => navigateTo('team-detail', team.slug || team.id)}
                    className="text-xs font-bold text-[#0066B2] hover:text-[#004C85]"
                  >
                    Ver Perfil & Conquistas
                  </button>

                  <button
                    onClick={() => openLeadModal({ type: 'TEAM', id: team.id, name: team.name })}
                    className="px-3 py-1.5 bg-[#0066B2] text-white text-xs font-bold rounded-lg hover:bg-[#004C85]"
                  >
                    Patrocinar Equipe
                  </button>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
              Nenhuma equipe foi publicada neste cenário.
            </div>
          )}
        </div>
      </section>

      {publishedStories.length > 0 && (
        <section id="stories-section" className="py-16 sm:py-20 bg-[#f8fafc] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">Histórias do cenário</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49] mt-1">Pessoas por trás dos robôs</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Relatos demonstrativos publicados pelo painel administrativo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedStories.slice(0, 3).map((story) => (
                <article key={story.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <Quote className="w-6 h-6 text-[#00A3E0] mb-4" />
                  <h3 className="font-heading font-bold text-lg text-[#002B49] leading-snug">{story.title}</h3>
                  {story.subtitle && <p className="text-xs text-slate-500 mt-2">{story.subtitle}</p>}
                  <p className="text-sm text-slate-700 leading-relaxed mt-4 line-clamp-5">{story.content}</p>
                  <div className="mt-5 pt-4 border-t border-slate-100 text-xs">
                    <strong className="text-[#002B49]">{story.subjectName}</strong>
                    <span className="text-slate-500"> · {story.subjectRole.toLowerCase()}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 07: CORPORATE SPONSORS & PARTNERS (SENAI, SESI, Qualcomm, Rockwell, Apple, Boeing) */}
      <section id="sponsors-section" className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Strategic Operator Highlight: SENAI */}
          <div className="mb-12 bg-gradient-to-r from-emerald-900/90 via-[#002B49] to-[#001A2E] text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="bg-white p-3.5 rounded-2xl shadow-md shrink-0">
                <SenaiLogo className="h-10 w-auto" variant="green" withSubtitle={true} />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#78BE20]/20 text-[#78BE20] text-[10px] font-bold uppercase tracking-wider rounded-full">
                  <span>Referências educacionais</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white">
                  SENAI: Formando a Indústria 4.0 no Brasil
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Este projeto reúne conteúdos sobre robótica educacional. Relações institucionais e calendários devem ser confirmados diretamente nos canais oficiais das organizações citadas.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('sobre')}
              className="px-5 py-2.5 bg-[#00884A] hover:bg-[#00703C] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
            >
              Entender o projeto
            </button>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
              Cenário demonstrativo
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49] mt-1">
              Apoiadores e parceiros cadastrados
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Organizações fictícias usadas para demonstrar como os parceiros podem aparecer no portal.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {activeSponsors.map((sponsor) => (
              sponsor.websiteUrl ? (
                <a
                  key={sponsor.id}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center h-28 hover:shadow-md hover:border-[#0066B2] transition-all"
                >
                  <img src={sponsor.logoUrl} alt="" className="max-h-10 max-w-full object-contain mb-2 grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[11px] font-bold text-slate-700 truncate w-full inline-flex items-center justify-center gap-1">
                    {sponsor.name} <ExternalLink className="w-3 h-3 shrink-0" />
                  </span>
                </a>
              ) : (
                <div key={sponsor.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center h-28">
                  <img src={sponsor.logoUrl} alt="" className="max-h-10 max-w-full object-contain mb-2 grayscale" />
                  <span className="text-[11px] font-bold text-slate-700 truncate w-full">{sponsor.name}</span>
                </div>
              )
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => openLeadModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#002B49] hover:bg-[#001A2E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <span>Junte sua Empresa à Comunidade FIRST®</span>
              <ArrowUpRight className="w-4 h-4 text-[#78BE20]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
