import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Instagram, Youtube, Linkedin, HeartHandshake, Award, Bot } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { data, submitContact } = useApp();
  const settings = data.settings;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    const res = await submitContact({
      name,
      email,
      phone: phone || undefined,
      subject,
      message
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div id="contact-view" className="w-full bg-[#f8fafc] text-slate-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3 text-xs font-bold text-[#0066B2]">
            <Mail className="w-3.5 h-3.5 text-[#0066B2]" />
            <span>Suporte Técnico, Inscrições & Voluntariado FIRST®</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#002B49] tracking-tight leading-tight">
            Canais Oficiais de Atendimento
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed">
            Entre em contato com os coordenadores operacionais da FIRST®, envie dúvidas sobre regras de arena (Game Manuals), registre novas equipes ou voluntarie-se como juiz e árbitro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Official Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="font-heading font-bold text-xl text-[#002B49] border-b border-slate-100 pb-3">
                Informações Institucionais
              </h2>

              <div className="space-y-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Entidade / Organização
                  </span>
                  <p className="text-[#002B49] font-bold text-sm">
                    {settings.organizationName || 'FIRST® Inspires / FIRST® Brasil'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#0066B2] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      E-mail de Suporte
                    </span>
                    <a
                      href={`mailto:${settings.officialEmail || 'suporte@firstinspires.org.br'}`}
                      className="text-[#0066B2] font-semibold hover:underline"
                    >
                      {settings.officialEmail || 'suporte@firstinspires.org.br'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#0066B2] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Telefone & WhatsApp Oficial
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {settings.officialPhone || '+55 (11) 3322-0000'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0066B2] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Sede & Coordenação Operacional
                    </span>
                    <span className="text-slate-800">
                      {settings.officialAddress || 'São Paulo, SP - Brasil | Manchester, NH - USA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Redes Sociais & Transmissões
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com/firstinspires"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl transition-colors"
                    title="Instagram FIRST"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com/firstinspires"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl transition-colors"
                    title="YouTube FIRST"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/firstinspires"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl transition-colors"
                    title="LinkedIn FIRST"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Volunteer & Mentorship Card */}
            <div className="bg-gradient-to-br from-[#002B49] to-[#001A2E] text-white rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-[#78BE20] text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>Voluntariado FIRST®</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Seja um Mentor, Juiz ou Árbitro Oficial
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toda a magia dos torneios acontece graças a mais de 200.000 voluntários ao redor do mundo. Compartilhe sua experiência de engenharia ou pedagogia com os jovens.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="font-heading font-bold text-xl text-[#002B49] mb-6">
                Envie sua Mensagem
              </h2>

              {isSuccess ? (
                <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-[#78BE20] mx-auto" />
                  <h3 className="font-heading font-bold text-xl text-green-950">
                    Mensagem Enviada com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-green-800">
                    Sua mensagem foi protocolada. Nossa equipe retornará o contato o mais breve possível.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-5 py-2 bg-[#0066B2] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                  >
                    Enviar Outra Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Mariana Silva"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                        Seu E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mariana@exemplo.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+55 (11) 99999-9999"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                        Assunto Principal *
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Ex: Inscrição de Equipe FRC, Voluntariado ou Dúvida Técnica"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#0066B2] focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-[#0066B2] hover:bg-[#004C85] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando Mensagem...' : 'Enviar Mensagem Oficial'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
