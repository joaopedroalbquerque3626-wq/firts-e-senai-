import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppStateData,
  Competition,
  Team,
  ResultRecord,
  Sponsor,
  SponsorshipOpportunity,
  SponsorshipLead,
  Story,
  ImpactMetric,
  SiteSettings,
  ContactMessage
} from '../types';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface AppContextType {
  data: AppStateData;
  isLoading: boolean;
  isAdmin: boolean;
  activeRoute: string;
  routeParam: string | null;
  toasts: ToastMessage[];
  showLeadModal: boolean;
  leadModalInitialTarget?: { type: 'COMPETITION' | 'TEAM' | 'INSTITUTIONAL'; id?: string; name?: string };
  navigateTo: (route: string, param?: string) => void;
  openLeadModal: (target?: { type: 'COMPETITION' | 'TEAM' | 'INSTITUTIONAL'; id?: string; name?: string }) => void;
  closeLeadModal: () => void;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  submitLead: (leadData: Partial<SponsorshipLead>) => Promise<{ success: boolean; error?: string }>;
  submitContact: (contactData: Partial<ContactMessage>) => Promise<{ success: boolean; error?: string }>;
  syncAdminData: (updatedState: Partial<AppStateData>) => Promise<boolean>;
  seedSampleData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
}

const defaultInitialState: AppStateData = {
  competitions: [],
  teams: [],
  results: [],
  sponsors: [],
  opportunities: [],
  leads: [],
  stories: [],
  metrics: [],
  settings: {
    platformName: 'Plataforma de Competições e Patrocínio',
    tagline: 'Não assista de fora. Acompanhe, conheça e patrocine.',
    missionText: 'Um espaço para descobrir competições, conhecer as equipes que estão fazendo acontecer e aproximar marcas de quem merece ser visto.',
    aboutText: '',
    organizationName: '',
    officialEmail: '',
    officialPhone: '',
    officialAddress: '',
    socialLinks: {},
    allowPublicLeads: true,
  },
  contactMessages: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppStateData>(defaultInitialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [leadModalInitialTarget, setLeadModalInitialTarget] = useState<{
    type: 'COMPETITION' | 'TEAM' | 'INSTITUTIONAL';
    id?: string;
    name?: string;
  } | undefined>(undefined);

  // Check stored admin session
  useEffect(() => {
    const session = localStorage.getItem('admin_authenticated');
    if (session === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Parse URL hash or path on load
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setActiveRoute('home');
        setRouteParam(null);
        return;
      }

      const parts = hash.split('/');
      const main = parts[0];
      const sub = parts[1] || null;

      if (main === 'competicoes' && sub) {
        setActiveRoute('competition-detail');
        setRouteParam(sub);
      } else if (main === 'equipes' && sub) {
        setActiveRoute('team-detail');
        setRouteParam(sub);
      } else {
        setActiveRoute(main || 'home');
        setRouteParam(sub);
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, []);

  const navigateTo = (route: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (route === 'home') {
      window.location.hash = '';
      setActiveRoute('home');
      setRouteParam(null);
    } else if (route === 'competition-detail' && param) {
      window.location.hash = `competicoes/${param}`;
      setActiveRoute('competition-detail');
      setRouteParam(param);
    } else if (route === 'team-detail' && param) {
      window.location.hash = `equipes/${param}`;
      setActiveRoute('team-detail');
      setRouteParam(param);
    } else {
      window.location.hash = param ? `${route}/${param}` : route;
      setActiveRoute(route);
      setRouteParam(param || null);
    }
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = isAdmin ? '/api/admin/data' : '/api/data';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData((prev) => ({
          ...prev,
          ...json,
          settings: { ...prev.settings, ...(json.settings || {}) }
        }));
      }
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAdmin(true);
        localStorage.setItem('admin_authenticated', 'true');
        showToast('Acesso administrativo autorizado.', 'success');
        fetchData();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Senha incorreta', 'error');
        return false;
      }
    } catch (err) {
      showToast('Erro ao conectar ao servidor.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_authenticated');
    showToast('Sessão administrativa encerrada.', 'info');
    fetchData();
  };

  const submitLead = async (leadData: Partial<SponsorshipLead>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      const resJson = await res.json();
      if (res.ok) {
        showToast('Solicitação de patrocínio enviada com sucesso! Entraremos em contato.', 'success');
        if (isAdmin) {
          fetchData();
        }
        return { success: true };
      } else {
        showToast(resJson.error || 'Erro ao enviar solicitação.', 'error');
        return { success: false, error: resJson.error };
      }
    } catch (err) {
      showToast('Erro de conexão ao enviar solicitação.', 'error');
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const submitContact = async (contactData: Partial<ContactMessage>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      const resJson = await res.json();
      if (res.ok) {
        showToast('Mensagem enviada com sucesso!', 'success');
        if (isAdmin) {
          fetchData();
        }
        return { success: true };
      } else {
        showToast(resJson.error || 'Erro ao enviar mensagem.', 'error');
        return { success: false, error: resJson.error };
      }
    } catch (err) {
      showToast('Erro de conexão ao enviar mensagem.', 'error');
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const syncAdminData = async (updatedState: Partial<AppStateData>): Promise<boolean> => {
    try {
      const merged = { ...data, ...updatedState };
      setData(merged);
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      if (res.ok) {
        showToast('Alterações salvas e publicadas com sucesso!', 'success');
        return true;
      }
      showToast('Erro ao sincronizar com o servidor.', 'error');
      return false;
    } catch (err) {
      showToast('Falha na conexão ao salvar dados.', 'error');
      return false;
    }
  };

  const seedSampleData = async () => {
    try {
      const res = await fetch('/api/admin/seed-sample', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setData(json.state);
        showToast('Dados de demonstração carregados com sucesso!', 'success');
      }
    } catch (err) {
      showToast('Erro ao carregar dados de exemplo.', 'error');
    }
  };

  const clearAllData = async () => {
    try {
      const res = await fetch('/api/admin/clear-all', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setData(json.state);
        showToast('Todos os registros foram zerados. Estado vazio ativo.', 'info');
      }
    } catch (err) {
      showToast('Erro ao limpar dados.', 'error');
    }
  };

  const openLeadModal = (target?: { type: 'COMPETITION' | 'TEAM' | 'INSTITUTIONAL'; id?: string; name?: string }) => {
    setLeadModalInitialTarget(target);
    setShowLeadModal(true);
  };

  const closeLeadModal = () => {
    setShowLeadModal(false);
    setLeadModalInitialTarget(undefined);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        isAdmin,
        activeRoute,
        routeParam,
        toasts,
        showLeadModal,
        leadModalInitialTarget,
        navigateTo,
        openLeadModal,
        closeLeadModal,
        loginAdmin,
        logoutAdmin,
        submitLead,
        submitContact,
        syncAdminData,
        seedSampleData,
        clearAllData,
        showToast,
        removeToast,
        refreshData: fetchData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
