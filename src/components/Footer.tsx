import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, ShieldCheck, Mail, Phone, MapPin, Award, ExternalLink, HeartHandshake } from 'lucide-react';
import { FirstLogo, SenaiLogo } from './Logos';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { data, navigateTo, openLeadModal, isAdmin } = useApp();
  const settings = data.settings;

  return (
    <footer id="main-footer" className="bg-[#001A2E] border-t border-slate-800 text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Call to Action Row */}
        <div className="bg-[#002B49] rounded-2xl p-6 sm:p-8 mb-12 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#00A3E0]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#78BE20]" />
              Invista no Futuro de Jovens Inovadores
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Pronto para transformar a educação STEM e a indústria no Brasil?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Patrocine equipes locais, subsidie kits de robótica para escolas públicas ou torne-se um mentor voluntário oficial da FIRST® em parceria com o SENAI.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => openLeadModal()}
              className="px-6 py-3 bg-[#0066B2] hover:bg-[#005596] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md"
            >
              Quero Patrocinar
            </button>
            <button
              onClick={() => navigateTo('contato')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all border border-white/15"
            >
              Fale Conosco
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Mission & Co-branding with SENAI */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <FirstLogo className="h-10 w-auto" variant="light" />
              <div className="h-8 w-px bg-slate-700 hidden sm:block" />
              <div className="flex flex-col">
                <SenaiLogo className="h-6 w-auto" variant="white" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#78BE20]">
                  Operador Oficial Brasil
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              A FIRST® (For Inspiration and Recognition of Science and Technology) é uma organização global que prepara jovens dos 4 aos 18 anos para o futuro através de desafios empolgantes de robótica, operados no Brasil em parceria com o SENAI e SESI.
            </p>
            <div className="pt-2 text-xs text-[#00A3E0] font-medium italic">
              "We don't use kids to build robots. We use robots to build kids."
              <span className="block not-italic text-slate-400 text-[11px] mt-0.5">— Dean Kamen, Fundador da FIRST®</span>
            </div>
          </div>

          {/* Column 2: Programs (The Progression) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white border-b border-slate-800 pb-2">
              Programas Oficiais FIRST®
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => navigateTo('competicoes')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-left group"
                >
                  <span>FIRST® Robotics Competition (FRC)</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-[#00A3E0]">14-18 anos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('competicoes')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-left group"
                >
                  <span>FIRST® Tech Challenge (FTC)</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-[#00A3E0]">12-18 anos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('competicoes')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-left group"
                >
                  <span>FIRST® LEGO® League (FLL)</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-[#00A3E0]">4-16 anos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('sobre')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full text-left group"
                >
                  <span>FIRST® Alumni & Bolsas de Estudo</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-[#00A3E0]">$80M+</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white border-b border-slate-800 pb-2">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => navigateTo('competicoes')} className="hover:text-white transition-colors">
                  Torneios & Arenas
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('equipes')} className="hover:text-white transition-colors">
                  Equipes & Robôs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('resultados')} className="hover:text-white transition-colors">
                  Súmulas & Placares
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('patrocinio')} className="hover:text-white transition-colors">
                  Cotas de Patrocínio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('sobre')} className="hover:text-white transition-colors">
                  Core Values & História
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contato')} className="hover:text-white transition-colors">
                  Canais Oficiais
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white border-b border-slate-800 pb-2">
              Contato & Localização
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00A3E0] shrink-0 mt-0.5" />
                <span>{settings.officialAddress || 'São Paulo, SP - Brasil | Manchester, NH - USA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00A3E0] shrink-0" />
                <a href={`mailto:${settings.officialEmail || 'contato@firstinspires.org.br'}`} className="hover:text-white transition-colors">
                  {settings.officialEmail || 'contato@firstinspires.org.br'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00A3E0] shrink-0" />
                <span>{settings.officialPhone || '+55 (11) 3322-0000'}</span>
              </div>
            </div>

            <div className="pt-2">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#78BE20]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Modo Administrador Ativo
                </span>
              ) : (
                <button
                  id="footer-admin-login"
                  onClick={onOpenAdminLogin}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
                >
                  Acesso Administrativo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Trademarks Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} FIRST® Inspires. Todos os direitos reservados. FIRST®, More Than Robots®, Gracious Professionalism®, Coopertition®, FIRST® Robotics Competition (FRC®), FIRST® Tech Challenge (FTC®) e FIRST® LEGO® League (FLL®) são marcas registradas da FOR INSPIRATION AND RECOGNITION OF SCIENCE AND TECHNOLOGY. LEGO® é uma marca registrada do LEGO Group.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <a href="https://www.firstinspires.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 inline-flex items-center gap-1 transition-colors">
              firstinspires.org oficial <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
