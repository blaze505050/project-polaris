import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Database, Server, X, MessageSquare, Terminal } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import BetaFeedbackModal from './BetaFeedbackModal';

export default function BetaDiagnosticOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { currentProject } = useProjectStore();
  const [storageKb, setStorageKb] = useState<number>(0);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  useEffect(() => {
    // Keyboard shortcut handler: Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Calculate local storage size
      let totalBytes = 0;
      try {
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalBytes += (localStorage[key].length + key.length) * 2;
          }
        }
        setStorageKb(Math.round((totalBytes / 1024) * 10) / 10);
      } catch {
        setStorageKb(0);
      }

      // Check FastAPI backend status
      const API_BASE = (import.meta as any).env?.VITE_PHYSICS_AI_API_URL || 'http://localhost:8000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      fetch(`${API_BASE}/health`, { signal: controller.signal })
        .then((res) => {
          clearTimeout(timeoutId);
          setBackendStatus(res.ok ? 'connected' : 'offline');
        })
        .catch(() => {
          setBackendStatus('offline');
        });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 bg-[#050914]/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl font-mono text-[11px] text-white w-80 space-y-2.5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Beta Diagnostic Overlay</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-white/80">
            <div className="flex justify-between">
              <span className="text-white/40">Active Route:</span>
              <span className="text-cyan-300 font-bold truncate max-w-[170px]">{window.location.pathname}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/40">Active Project:</span>
              <span className="text-emerald-300 truncate max-w-[170px]">{currentProject?.name || 'Default Project'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/40">Local Storage:</span>
              <span className="text-purple-300">{storageKb} KB</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/40">FastAPI Backend:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {backendStatus}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[9px] text-white/40">Press Ctrl+Shift+D to toggle</span>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Feedback</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <BetaFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
}
