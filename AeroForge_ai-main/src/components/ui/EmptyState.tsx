import React from 'react';
import { LucideIcon, Plus, FileText, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  suggestedTemplate?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  suggestedTemplate,
}: EmptyStateProps) {
  return (
    <div className="w-full border border-dashed border-white/20 rounded-xl p-8 md:p-12 text-center bg-[#070D1B]/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
      <div className="p-3.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
        <Icon className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-white font-mono tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-white/60 leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {suggestedTemplate && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-cyan-300">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Template: {suggestedTemplate}</span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold text-xs tracking-wide transition-all"
          >
            {secondaryActionLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
