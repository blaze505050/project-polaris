import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

export default function ToastNotification() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-[#061812]/90';
      case 'warning':
        return 'border-amber-500/30 bg-[#191306]/90';
      case 'error':
        return 'border-red-500/30 bg-[#1a0808]/90';
      default:
        return 'border-cyan-500/30 bg-[#081320]/90';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded-lg border shadow-xl backdrop-blur-md ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white/90 font-mono tracking-tight">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] text-white/60 leading-normal mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
