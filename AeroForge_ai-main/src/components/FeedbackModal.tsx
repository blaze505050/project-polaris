import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Bug,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useFeedbackStore, FeedbackCategory } from "@/services/feedbackStore";
import { useToastStore } from "@/stores/toastStore";
import { analytics } from "@/services/productAnalytics";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToolId?: string;
  initialSolverClassification?: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  initialToolId,
  initialSolverClassification,
}: FeedbackModalProps) {
  const { submitFeedback } = useFeedbackStore();
  const { addToast } = useToastStore();

  const [category, setCategory] = useState<FeedbackCategory>("bug");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: FeedbackCategory; label: string; icon: any }[] = [
    { id: "bug", label: "Bug Report", icon: Bug },
    { id: "wrong_result", label: "Wrong Physics Result", icon: AlertTriangle },
    { id: "confusing_ux", label: "Confusing UX", icon: HelpCircle },
    { id: "missing_feature", label: "Missing Capability", icon: Info },
    { id: "scientific_concern", label: "Scientific Concern", icon: ShieldCheck },
    { id: "general", label: "General Feedback", icon: MessageSquare },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      submitFeedback({
        category,
        message,
        contactEmail: contactEmail.trim() || undefined,
        diagnostics: {
          pageUrl: window.location.pathname,
          toolId: initialToolId || "general-app",
          solverClassification: initialSolverClassification || "N/A",
          appVersion: "v1.0.0-beta",
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
        },
      });

      analytics.track("report_exported", { type: "beta_feedback", category });

      addToast({
        type: "success",
        title: "Feedback Received",
        description: "Thank you for helping improve AeroForge AI!",
      });

      setIsSubmitting(false);
      setMessage("");
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0A1020] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Beta Feedback & Problem Report
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selector */}
            <div>
              <label className="text-[11px] text-white/60 uppercase font-bold block mb-2">
                Select Report Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-lg text-left text-xs transition-all border ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="text-[11px] text-white/60 uppercase font-bold block mb-1">
                Your Feedback or Issue Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what happened, what expected result differed, or what feature would help your engineering investigation..."
                rows={4}
                required
                className="w-full bg-[#050914] border border-white/15 rounded-lg p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Optional Email */}
            <div>
              <label className="text-[11px] text-white/60 uppercase font-bold block mb-1">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="engineer@institution.edu"
                className="w-full bg-[#050914] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Auto Diagnostics Disclosure */}
            <div className="bg-[#050914] p-3 rounded-lg border border-white/5 text-[10px] text-white/40 space-y-1">
              <span className="font-bold uppercase text-white/60 block">
                Non-Sensitive Technical Diagnostics Attached:
              </span>
              <p>
                Page: {window.location.pathname} • Tool ID: {initialToolId || "general"} • App
                Version: v1.0.0-beta
              </p>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
