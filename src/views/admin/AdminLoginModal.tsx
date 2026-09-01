import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, KeyRound, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, navigateTo } = useApp();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    const success = await loginAdmin(password);
    setLoading(false);
    if (success) {
      setPassword('');
      onClose();
      navigateTo('admin');
    }
  };

  return (
    <div
      id="admin-login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="admin-login-modal-content"
        className="relative w-full max-w-md bg-[#ffffff] border-2 border-[#111111] shadow-[8px_8px_0px_#111111] p-6 sm:p-8 text-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-admin-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#888888] hover:text-[#111111] transition-colors p-1 cursor-pointer"
          aria-label="Fechar modal de acesso"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-[#111111] pb-4">
          <div className="w-10 h-10 bg-[#f4f3ef] border border-[#111111] text-[#C2410C] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#111111] tracking-tight">
              Acesso Administrativo
            </h3>
            <p className="text-xs text-[#666666] font-sans">
              Gestão de competições, equipes e patrocínios
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" id="form-admin-login">
          <div>
            <label
              htmlFor="input-admin-password"
              className="block text-xs font-mono uppercase tracking-wider text-[#666666] mb-1.5"
            >
              Senha do Administrador
            </label>
            <div className="relative">
              <input
                id="input-admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#ffffff] border border-[#111111] text-[#111111] text-sm focus:outline-none focus:ring-1 focus:ring-[#C2410C] font-mono text-xs"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-[#777777] font-mono">
              <span>Senha padrão: <code className="text-[#C2410C] font-bold">admin</code> ou <code className="text-[#C2410C] font-bold">admin2026</code></span>
            </div>
          </div>

          <button
            id="btn-submit-admin-login"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#111111] hover:bg-[#C2410C] text-[#fdfdfd] font-mono uppercase tracking-wider text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-[3px_3px_0px_#111111]"
          >
            {loading ? 'Verificando...' : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
