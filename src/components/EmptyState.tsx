import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Bot } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  adminActionTab?: string;
  icon?: React.ReactNode;
  id?: string;
  type?: 'competitions' | 'teams' | 'results' | 'default';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum registro localizado',
  description = 'Não foram encontrados dados que correspondam aos filtros selecionados.',
  actionText,
  onAction,
  adminActionTab,
  icon,
  id = 'empty-state-section',
  type = 'default'
}) => {
  const { isAdmin, navigateTo } = useApp();

  return (
    <div
      id={id}
      className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center my-6 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        {icon || <Bot className="w-6 h-6 text-[#0066B2]" />}
      </div>
      <h3 className="font-heading text-lg sm:text-xl font-bold text-[#002B49] mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 bg-[#0066B2] text-white uppercase tracking-wider text-xs font-bold rounded-lg hover:bg-[#004C85] transition-all"
          >
            {actionText}
          </button>
        )}

        {isAdmin && adminActionTab && (
          <button
            onClick={() => navigateTo('admin', adminActionTab)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#002B49] text-[#002B49] uppercase tracking-wider text-xs font-bold rounded-lg hover:bg-[#002B49] hover:text-white transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Cadastrar no Painel Admin
          </button>
        )}
      </div>
    </div>
  );
};
