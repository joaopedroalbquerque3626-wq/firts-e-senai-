import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Target,
  Award,
  ArrowRight,
  HeartHandshake,
  Lightbulb,
  Compass,
  Users,
  Layers,
  Smile,
  GraduationCap,
  Quote,
  Sparkles,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { FirstLogo, SenaiLogo } from '../components/Logos';

export const AboutView: React.FC = () => {
  const { data, navigateTo, openLeadModal } = useApp();
  const settings = data.settings;

  return (
    <div id="about-view" className="w-full bg-[#f8fafc] text-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Co-branding */}
        <div className="border-b border-slate-200 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3 text-xs font-bold text-[#0066B2]">
              <Award className="w-3.5 h-3.5" />
              <span>Missão, valores e referências</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#002B49] tracking-tight">
              Sobre o projeto
            </h1>

            <p className="text-base text-slate-600 max-w-3xl mt-3 leading-relaxed">
              {settings.missionText || 'Este portal divulga competições de robótica, equipes, resultados e oportunidades de apoio.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 shrink-0">
            <FirstLogo className="h-9 w-auto" variant="color" />
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col">
              <SenaiLogo className="h-6 w-auto" variant="green" />
              <span className="text-[9px] font-bold uppercase text-[#00884A] mt-0.5">Projeto independente</span>
            </div>
          </div>
        </div>

        {/* Co-Founders Tribute */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#002B49] text-white flex items-center justify-center font-heading font-black text-xl">
                  DK
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#002B49]">Dean Kamen</h3>
                  <span className="text-xs font-semibold text-[#0066B2]">Fundador da FIRST® & Inventor</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Inventor do Segway, da bomba de infusão de insulina móvel e de próteses robóticas avançadas. Dean fundou a FIRST® com a visão de que a ciência e a tecnologia deveriam ser celebradas com o mesmo entusiasmo que os esportes e o entretenimento da cultura pop.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
              "Para ter sucesso no século XXI, os jovens precisam ser solucionadores de problemas, pensadores críticos e colaboradores éticos."
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0066B2] text-white flex items-center justify-center font-heading font-black text-xl">
                  WF
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#002B49]">Dr. Woodie Flowers</h3>
                  <span className="text-xs font-semibold text-[#0066B2]">Co-fundador & Professor Emérito do MIT</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Pioneiro no ensino de engenharia no MIT e co-fundador da FIRST®. Criador do termo <strong>Gracious Professionalism®</strong>, Woodie inspirou gerações a entenderem que a verdadeira nobreza está em competir no mais alto nível mantendo a empatia e a integridade humana.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
              "Gracious Professionalism® é parte do ethos da FIRST. É uma forma de fazer as coisas que encoraja o trabalho de alta qualidade e valoriza a todos."
            </div>
          </div>
        </div>

        {/* The Two Guiding Philosophies */}
        <div className="bg-gradient-to-br from-[#002B49] to-[#001A2E] text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A3E0]">
              O Código de Conduta
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
              As Duas Filosofias que Guiam a FIRST®
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-white/15">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#00A3E0] text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Gracious Professionalism®
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Uma atitude que combina conhecimento feroz, competição saudável e respeito genuíno pela comunidade. Quem pratica Gracious Professionalism compete com paixão, mas nunca às custas da dignidade do outro.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-white/15">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#78BE20] text-white flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Coopertition®
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Produzir inovação através da cooperação mesmo no meio da competição. As equipes aprendem que ao ajudarem os concorrentes a repararem seus robôs, o nível de todo o torneio sobe e a experiência se torna extraordinária para todos.
              </p>
            </div>
          </div>
        </div>

        {/* The 6 Core Values Detailed */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0066B2]">
              Pilares de Formação
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49] mt-1">
              Os 6 FIRST® Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066B2] flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#002B49] mb-1">Descoberta (Discovery)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Exploramos novas habilidades e ideias através de experimentação prática.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-[#78BE20] flex items-center justify-center mb-3">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#002B49] mb-1">Inovação (Innovation)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Usamos criatividade e persistência para resolver problemas reais.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#ED1C24] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#002B49] mb-1">Impacto (Impact)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Aplicamos o aprendizado para melhorar nossa comunidade e nosso mundo.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#00A3E0] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#002B49] mb-1">Inclusão (Inclusion)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Respeitamos uns aos outros e abraçamos nossas diferenças.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F57E25] flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#002B49] mb-1">Trabalho em Equipe (Teamwork)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Somos mais fortes quando trabalhamos juntos em harmonia.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Smile className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#002B49] mb-1">Diversão (Fun)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Celebramos e nos divertimos com o que fazemos!</p>
            </div>
          </div>
        </div>

        {/* 04: BRAZILIAN ALLIANCE: FIRST + SENAI */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 mb-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-flex items-center gap-4">
                <FirstLogo className="h-10 w-auto" variant="color" />
                <div className="h-8 w-px bg-slate-200" />
                <SenaiLogo className="h-8 w-auto" variant="green" withSubtitle={true} />
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#002B49]">
                Referências em robótica educacional
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A FIRST®, o SENAI e o SESI são referências citadas neste projeto. Calendários, vínculos institucionais e regras devem ser confirmados diretamente em seus canais oficiais.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-[#00884A] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#002B49]">Infraestrutura de Laboratórios</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Laboratórios, impressão 3D, eletrônica e fabricação digital podem apoiar a construção e manutenção de robôs.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0066B2] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#002B49]">Arenas e Festivais Nacionais</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eventos, arenas e transmissões devem ser cadastrados somente depois da verificação das informações pela equipe responsável.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships & Alumni Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 mb-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              Educação e oportunidades
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#002B49]">
              Formação além das competições
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              O portal pode divulgar bolsas, mentorias e oportunidades acadêmicas quando houver fonte verificável e autorização para publicação.
            </p>
          </div>
          <button
            onClick={() => openLeadModal({ type: 'INSTITUTIONAL', name: 'Bolsas & Parcerias Acadêmicas' })}
            className="px-6 py-3 bg-[#0066B2] hover:bg-[#004C85] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
          >
            Apoiar Fundo de Bolsas
          </button>
        </div>

        {/* Bottom Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 bg-slate-100 rounded-2xl border border-slate-200">
          <div>
            <h4 className="font-heading font-bold text-lg text-[#002B49]">
              Deseja cadastrar uma equipe?
            </h4>
            <p className="text-xs text-slate-600">
              Envie as informações para análise antes da publicação.
            </p>
          </div>
          <button
            onClick={() => navigateTo('contato')}
            className="px-6 py-2.5 bg-[#002B49] hover:bg-[#001A2E] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Falar com a Coordenação
          </button>
        </div>
      </div>
    </div>
  );
};
