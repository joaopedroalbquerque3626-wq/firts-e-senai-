import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div 
      id="toast-container" 
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-start gap-3 p-4 border bg-white shadow-xl transition-all duration-200 ${
            toast.type === 'success'
              ? 'border-neutral-900 border-l-4 border-l-[#65A30D] text-[#111111]'
              : toast.type === 'error'
              ? 'border-neutral-900 border-l-4 border-l-[#C2410C] text-[#111111]'
              : 'border-[#e5e5e5] text-[#111111]'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-[#65A30D] shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-[#C2410C] shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs font-serif font-medium leading-tight">
            {toast.text}
          </div>
          <button
            id={`btn-close-toast-${toast.id}`}
            onClick={() => removeToast(toast.id)}
            className="text-[#888888] hover:text-[#111111] transition-colors p-1"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
