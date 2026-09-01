import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { InterestType } from '../types';

export const LeadModal: React.FC = () => {
  const {
    showLeadModal,
    closeLeadModal,
    leadModalInitialTarget,
    data,
    submitLead
  } = useApp();

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
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (leadModalInitialTarget) {
      if (leadModalInitialTarget.type === 'COMPETITION') {
        setInterestType('PATROCINAR_COMPETICAO');
        if (leadModalInitialTarget.id) setTargetCompetitionId(leadModalInitialTarget.id);
      } else if (leadModalInitialTarget.type === 'TEAM') {
        setInterestType('PATROCINAR_EQUIPE');
        if (leadModalInitialTarget.id) setTargetTeamId(leadModalInitialTarget.id);
      } else {
        setInterestType('PARCERIA_INSTITUCIONAL');
      }
    }
  }, [leadModalInitialTarget]);

  if (!showLeadModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email || !phone || !message || !privacyConsent) {
      return;
    }

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

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsite('');
    setMessage('');
    setTargetCompetitionId('');
    setTargetTeamId('');
    setPrivacyConsent(false);
    closeLeadModal();
  };

  return (
    <div
      id="lead-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        id="lead-modal-content"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#002B49] text-white p-6 flex items-center justify-between border-b border-[#001D33]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#00A3E0]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 id="lead-modal-title" className="text-lg font-heading font-bold text-white">
                Proposta de Patrocínio & Apoio
              </h3>
              <p className="text-xs text-slate-300">
                Conecte sua marca a competições, projetos e equipes.
              </p>
            </div>
          </div>

          <button
            id="close-lead-modal-btn"
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fechar formulário de patrocínio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-in zoom-in-50 duration-300" />
              <h4 className="text-2xl font-heading font-bold text-slate-900">
                Manifestação de Interesse Registrada!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Agradecemos o apoio à ciência, robótica e educação. A equipe responsável entrará em contato por e-mail ou telefone.
              </p>
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Concluir & Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Empresa / Marca *
                  </label>
                  <input
                    id="lead-company-name"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Rockwell Automation, Gerdau..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome do Responsável *
                  </label>
                  <input
                    id="lead-contact-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Beatriz Lima"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (11) 98765-4321"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Interesse
                  </label>
                  <select
                    id="lead-interest-type"
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value as InterestType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                  >
                    <option value="PATROCINAR_COMPETICAO">Patrocinar competição</option>
                    <option value="PATROCINAR_EQUIPE">Patrocinar Equipe / Robô</option>
                    <option value="PARCERIA_INSTITUCIONAL">Parceria Institucional / Doação de Kits</option>
                  </select>
                </div>

                {interestType === 'PATROCINAR_COMPETICAO' && data.competitions.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selecionar Torneio Específico
                    </label>
                    <select
                      value={targetCompetitionId}
                      onChange={(e) => setTargetCompetitionId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                    >
                      <option value="">Geral / Todas as Etapas</option>
                      {data.competitions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {interestType === 'PATROCINAR_EQUIPE' && data.teams.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selecionar Equipe Específica
                    </label>
                    <select
                      value={targetTeamId}
                      onChange={(e) => setTargetTeamId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                    >
                      <option value="">Geral / Equipes em Vulnerabilidade</option>
                      {data.teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mensagem / Objetivos de Patrocínio *
                </label>
                <textarea
                  id="lead-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva as metas de patrocínio, orçamento estimado ou requisitos da sua empresa..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066B2]"
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="lead-privacy-consent"
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={(event) => setPrivacyConsent(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#0066B2]"
                />
                <label htmlFor="lead-privacy-consent" className="text-xs text-slate-600">
                  Autorizo o uso destes dados exclusivamente para receber retorno sobre esta solicitação.
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>

                <button
                  id="submit-lead-modal-btn"
                  type="submit"
                  disabled={isSubmitting || !privacyConsent}
                  className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#C91319] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
