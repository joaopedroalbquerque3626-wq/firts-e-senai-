import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  ArrowRight,
  HeartHandshake,
  Bot,
  GraduationCap,
  Sparkles,
  Award
} from 'lucide-react';
import { InterestType } from '../types';
import { FirstLogo, SenaiLogo } from '../components/Logos';

export const SponsorshipView: React.FC = () => {
  const { data, submitLead, openLeadModal } = useApp();

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [interestType, setInterestType] = useState<InterestType>('PATROCINAR_COMPETICAO');
  const [targetCompetitionId, setTargetCompetitionId] = useState('');
  const [targetTeamId, setTargetTeamId] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableOpportunities = data.opportunities.filter((o) => o.available);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email || !phone || !message) return;

    setIsSubmitting(true);
    let targetName = '';
    if (interestType === 'PATROCINAR_COMPETICAO' && targetCompetitionId) {
      const comp = data.competitions.find((c) => c.id === targetCompetitionId);
      if (comp) targetName = comp.name;
    } else if (interestType === 'PATROCINAR_EQUIPE' && targetTeamId) {
      const team = data.teams.find((t) => t.id === targetTeamId);
      if (team) targetName = team.name;
    }

    const res = await submitLead({
      companyName,
      contactName,
      email,
      phone,
      website: website || undefined,
      interestType,
      targetCompetitionId: targetCompetitionId || undefined,
      targetTeamId: targetTeamId || undefined,
      targetName: targetName || undefined,
      investmentRange: investmentRange || undefined,
      message,
      privacyConsent
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
    }
  };

  return (
    <div id="sponsorship-view" className="w-full bg-[#f8fafc] text-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Commercial Hero */}
        <div className="border-b border-slate-200 pb-12 mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-4 text-xs font-bold text-[#0066B2]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#78BE20]" />
              <span>Investimento Social & Parcerias Corporativas STEM</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#002B49] tracking-tight leading-tight max-w-5xl mb-6">
              Não coloque apenas sua marca.<br />
              <span className="text-[#0066B2]">Forme a próxima geração de engenheiros e líderes.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Apoiando a FIRST® e o SENAI, sua empresa investe diretamente no desenvolvimento de talentos de alta performance, diversidade na tecnologia e inovação para a indústria brasileira.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 shrink-0">
            <FirstLogo className="h-9 w-auto" variant="color" />
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col">
              <SenaiLogo className="h-6 w-auto" variant="green" />
              <span className="text-[9px] font-bold uppercase text-[#00884A] mt-0.5">Operador Brasil</span>
            </div>
          </div>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs hover:border-[#0066B2] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066B2] flex items-center justify-center font-heading font-black">
              01
            </div>
            <h3 className="font-heading font-bold text-xl text-[#002B49]">
              Atração de Talentos Técnicos
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Conexão prioritária com estudantes e Alumni treinados em programação Java, controle industrial CAN/Swerve, manufatura CNC e liderança de projetos.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs hover:border-[#78BE20] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-[#78BE20] flex items-center justify-center font-heading font-black">
              02
            </div>
            <h3 className="font-heading font-bold text-xl text-[#002B49]">
              Visibilidade em Arenas & Transmissões
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Presença de marca na carcaça de robôs de 57kg, banners de arena, coletes de pit e transmissões ao vivo com milhares de espectadores apaixonados por tecnologia.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs hover:border-[#00A3E0] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#00A3E0] flex items-center justify-center font-heading font-black">
              03
            </div>
            <h3 className="font-heading font-bold text-xl text-[#002B49]">
              Impacto ESG & Diversidade STEM
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fortaleça suas metas de responsabilidade social corporativa subsidiando kits de robótica e bolsas de estudo para jovens de escolas públicas e periferias.
            </p>
          </div>
        </div>

        {/* Available Sponsorship Opportunities / Cotas */}
        {availableOpportunities.length > 0 && (
          <div className="mb-16">
            <div className="border-b border-slate-200 pb-4 mb-8">
              <h2 className="font-heading text-2xl font-bold text-[#002B49]">
                Cotas Oficiais de Patrocínio
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Selecione uma modalidade de patrocínio ou solicite uma proposta personalizada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <span className="px-3 py-1 bg-blue-50 text-[#0066B2] text-xs font-bold rounded-full inline-block mb-3">
                      {opp.quotaName}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-[#002B49] mb-2">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {opp.description}
                    </p>
                    {opp.priceValue && (
                      <div className="text-lg font-heading font-black text-[#0066B2] mb-4">
                        {opp.priceValue}
                      </div>
                    )}
                    {opp.deliverables && opp.deliverables.length > 0 && (
                      <div className="space-y-2 mb-6">
                        <span className="text-[11px] font-bold uppercase text-slate-400 block">
                          Entregas Incluídas:
                        </span>
                        {opp.deliverables.map((del, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle className="w-3.5 h-3.5 text-[#78BE20] shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openLeadModal({ type: 'INSTITUTIONAL', name: `${opp.quotaName} - ${opp.title}` })}
                    className="w-full py-2.5 bg-[#0066B2] hover:bg-[#004C85] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Solicitar esta Cota
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead Direct Contact Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-md">
          <div className="max-w-2xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#002B49]">
              Fale com o Comitê de Parcerias & Patrocínio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Preencha os dados da sua empresa abaixo para receber a apresentação executiva e agendar uma reunião com nossa equipe de relações institucionais.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-[#78BE20] mx-auto" />
              <h3 className="font-heading font-bold text-xl text-green-950">
                Proposta Recebida com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-green-800 max-w-md mx-auto">
                Agradecemos o interesse da sua empresa em investir na FIRST®. Um coordenador entrará em contato em até 24 horas úteis.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-5 py-2 bg-[#0066B2] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Enviar Nova Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                    Empresa / Organização *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Rockwell, Qualcomm, Embraer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Carlos Mendes"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@empresa.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (11) 98765-4321"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                    Tipo de Interesse
                  </label>
                  <select
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value as InterestType)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                  >
                    <option value="PATROCINAR_COMPETICAO">Patrocinar Torneio / Arena Oficial</option>
                    <option value="PATROCINAR_EQUIPE">Patrocinar Equipe Específica de Robótica</option>
                    <option value="APOIO_INSTITUCIONAL">Fundo de Bolsas & Doação de Kits STEM</option>
                    <option value="ANUNCIAR_MARCA">Exposição de Marca & Estande nos Pits</option>
                    <option value="DUVIDA_GERAL">Outro / Parceria Educacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                    Faixa Estimada de Investimento
                  </label>
                  <select
                    value={investmentRange}
                    onChange={(e) => setInvestmentRange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                  >
                    <option value="">Selecione uma faixa...</option>
                    <option value="R$ 5.000 a R$ 15.000">R$ 5.000 a R$ 15.000 (Apoio a Kit de Equipe)</option>
                    <option value="R$ 15.000 a R$ 50.000">R$ 15.000 a R$ 50.000 (Cota Prata / Viagens)</option>
                    <option value="R$ 50.000 a R$ 150.000">R$ 50.000 a R$ 150.000 (Cota Ouro / Temporada)</option>
                    <option value="Acima de R$ 150.000">Acima de R$ 150.000 (Naming Rights Arena / Master)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                  Mensagem / Objetivos do Patrocínio *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva seus objetivos de patrocínio, regiões de interesse ou preferências por modalidade (FRC, FTC, FLL)..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="accent-[#0066B2] w-4 h-4 cursor-pointer rounded"
                />
                <label htmlFor="privacy" className="text-xs text-slate-600 cursor-pointer">
                  Concordo com a política de privacidade e em receber o contato da comissão organizadora.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#0066B2] hover:bg-[#004C85] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando Proposta...' : 'Enviar Solicitação de Patrocínio'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
