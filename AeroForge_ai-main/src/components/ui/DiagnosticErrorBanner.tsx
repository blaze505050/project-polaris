import React from 'react';
import { AlertOctagon, Wrench, RefreshCw, ChevronRight } from 'lucide-react';

interface DiagnosticErrorBannerProps {
  title: string;
  reason: string;
  recommendedAction: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export default function DiagnosticErrorBanner({
  title,
  reason,
  recommendedAction,
  actionLabel = 'Repair Geometry',
  onAction,
  onDismiss,
}: DiagnosticErrorBannerProps) {
  return (
    <div className="w-full bg-[#1A0A0C] border border-red-500/40 rounded-xl p-5 shadow-2xl space-y-3 font-mono">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 mt-0.5">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-red-300 tracking-tight">
            {title}
          </h3>
          <div className="mt-2 space-y-1.5 text-xs">
            <div>
              <span className="text-white/40 uppercase text-[10px] tracking-wider block">
                REASON / DIAGNOSIS:
              </span>
              <span className="text-white/80">{reason}</span>
            </div>
            <div>
              <span className="text-white/40 uppercase text-[10px] tracking-wider block">
                RECOMMENDED ACTION:
              </span>
              <span className="text-cyan-300">{recommendedAction}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-red-500/20">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded text-xs text-white/50 hover:text-white transition-colors"
          >
            Dismiss
          </button>
        )}
        {onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold text-xs transition-all shadow-md shadow-red-500/20"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
