import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, ArrowUpRight, ShieldCheck, Lock, Award, Globe, HeartHandshake } from 'lucide-react';
import { FirstLogo, SenaiLogo } from './Logos';

interface HeaderProps {
  onOpenAdminLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdminLogin }) => {
  const { activeRoute, navigateTo, openLeadModal, isAdmin, logoutAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'competicoes', label: 'Competições & Torneios' },
    { id: 'equipes', label: 'Equipes & Pits' },
    { id: 'resultados', label: 'Resultados & Súmulas' },
    { id: 'patrocinio', label: 'Apoie / Patrocínio' },
    { id: 'sobre', label: 'Valores & Sobre' },
    { id: 'contato', label: 'Contato' }
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#002B49] shadow-xs"
    >
      {/* Top FIRST Inspires Official Banner */}
      <div className="border-b border-slate-100 bg-[#002B49] text-white text-[11px] font-medium py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs text-[#00A3E0]">
              <span className="w-2 h-2 rounded-full bg-[#78BE20] animate-pulse"></span>
              FIRST® Inspires
            </span>
            <span className="hidden sm:inline-block text-slate-300 text-xs">|</span>
            <span className="hidden sm:inline-block text-slate-200 text-xs font-medium">
              More Than Robots® • Temporada Oficial de Robótica 2026
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] tracking-wide text-slate-300">
            <span className="hidden md:inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer" onClick={() => navigateTo('sobre')}>
              <Award className="w-3 h-3 text-[#ED1C24]" />
              Gracious Professionalism®
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <button
              onClick={() => openLeadModal({ type: 'INSTITUTIONAL', name: 'Bolsas & Patrocínio STEM' })}
              className="text-[#78BE20] hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Seja Patrocinador / Mentor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Official FIRST + SENAI Verde Logos */}
        <div className="flex items-center gap-3">
          <button
            id="btn-brand-logo"
            onClick={() => handleNavClick('home')}
            className="text-left group flex items-center gap-3 sm:gap-4 py-1"
          >
            {/* Official FIRST Primary Logo */}
            <FirstLogo className="h-9 sm:h-11 w-auto transition-transform group-hover:scale-105" variant="color" />
            
            {/* Elegant Divider */}
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* Official SENAI Green Logo */}
            <div className="hidden sm:flex flex-col justify-center">
              <SenaiLogo className="h-5 sm:h-6 w-auto" variant="green" />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#00884A] leading-none mt-0.5">
                Operador Oficial Brasil
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive =
              activeRoute === item.id ||
              (item.id === 'competicoes' && activeRoute === 'competition-detail') ||
              (item.id === 'equipes' && activeRoute === 'team-detail');

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-xs font-semibold transition-all relative rounded-md ${
                  isActive
                    ? 'text-[#0066B2] bg-blue-50/70 font-bold'
                    : 'text-slate-700 hover:text-[#002B49] hover:bg-slate-50'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#0066B2] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-admin-dashboard"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors ${
                  activeRoute === 'admin'
                    ? 'border-[#002B49] bg-[#002B49] text-white'
                    : 'border-[#002B49] text-[#002B49] hover:bg-[#002B49] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Painel Admin
              </button>
              <button
                id="btn-header-admin-logout"
                onClick={logoutAdmin}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
                title="Sair do modo administrador"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              id="btn-header-admin-login"
              onClick={onOpenAdminLogin}
              className="text-slate-400 hover:text-[#002B49] p-2 transition-colors rounded-lg hover:bg-slate-100"
              title="Acesso Administrativo"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          <button
            id="btn-header-lead-cta"
            onClick={() => openLeadModal()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0066B2] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#004C85] transition-all shadow-sm hover:shadow-md"
          >
            <span>Apoiar / Patrocinar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#002B49] border border-slate-200 rounded-lg hover:bg-slate-100"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl"
        >
          {navItems.map((item) => {
            const isActive =
              activeRoute === item.id ||
              (item.id === 'competicoes' && activeRoute === 'competition-detail') ||
              (item.id === 'equipes' && activeRoute === 'team-detail');

            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-50 text-[#0066B2] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#0066B2]"></span>}
              </button>
            );
          })}

          <div className="pt-4 mt-2 border-t border-slate-200 space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <FirstLogo className="h-7 w-auto" variant="color" />
              <div className="flex flex-col items-end">
                <SenaiLogo className="h-5 w-auto" variant="green" />
                <span className="text-[8px] font-bold uppercase text-[#00884A]">Operador Brasil</span>
              </div>
            </div>

            <button
              id="mobile-btn-lead-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                openLeadModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0066B2] text-white uppercase tracking-wider text-xs font-bold rounded-lg shadow-sm"
            >
              <span>Apoiar / Patrocinar Equipes</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {isAdmin ? (
              <button
                id="mobile-btn-admin"
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#002B49] text-[#002B49] rounded-lg text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                Painel Administrativo
              </button>
            ) : (
              <button
                id="mobile-btn-admin-login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-slate-500 hover:text-[#002B49] text-xs font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                Acesso do Organizador / Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
