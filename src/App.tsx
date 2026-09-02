import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { ToastContainer } from './components/ToastContainer';
import { AdminLoginModal } from './views/admin/AdminLoginModal';
import { HomeView } from './views/HomeView';
import { CompetitionsView } from './views/CompetitionsView';
import { CompetitionDetailView } from './views/CompetitionDetailView';
import { TeamsView } from './views/TeamsView';
import { TeamDetailView } from './views/TeamDetailView';
import { ResultsView } from './views/ResultsView';
import { SponsorshipView } from './views/SponsorshipView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminDashboard } from './views/admin/AdminDashboard';

export const AppContent: React.FC = () => {
  const { activeRoute, isAdmin, isLoading } = useApp();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeRoute]);

  useEffect(() => {
    if (activeRoute === 'admin' && !isAdmin && !isLoading) {
      setShowAdminLogin(true);
    }
  }, [activeRoute, isAdmin, isLoading]);

  const renderActiveView = () => {
    switch (activeRoute) {
      case 'home':
        return <HomeView />;
      case 'competicoes':
        return <CompetitionsView />;
      case 'competition-detail':
        return <CompetitionDetailView />;
      case 'equipes':
        return <TeamsView />;
      case 'team-detail':
        return <TeamDetailView />;
      case 'resultados':
        return <ResultsView />;
      case 'patrocinio':
        return <SponsorshipView />;
      case 'sobre':
        return <AboutView />;
      case 'contato':
        return <ContactView />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <HomeView />;
      default:
        return <HomeView />;
    }
  };

  const isAdminView = activeRoute === 'admin' && isAdmin;

  return (
    <div className="min-h-screen bg-[#151515] text-[#F1EDE4] flex flex-col font-sans selection:bg-[#E95D2A] selection:text-white">
      {/* Global Header (Rendered across the application) */}
      <Header onOpenAdminLogin={() => setShowAdminLogin(true)} />

      {/* Main Page Content */}
      <main className="flex-1 w-full" aria-busy={isLoading}>
        {isLoading ? (
          <div className="min-h-[55vh] bg-slate-50 flex items-center justify-center px-4">
            <div className="flex items-center gap-3 text-[#002B49]" role="status">
              <span className="w-4 h-4 rounded-full border-2 border-[#0066B2] border-t-transparent animate-spin" />
              <span className="text-sm font-semibold">Carregando o protótipo...</span>
            </div>
          </div>
        ) : renderActiveView()}
      </main>

      {/* Global Footer (Rendered except in deep admin view) */}
      {!isAdminView && <Footer onOpenAdminLogin={() => setShowAdminLogin(true)} />}

      {/* Modals & Global Overlays */}
      <LeadModal />
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
