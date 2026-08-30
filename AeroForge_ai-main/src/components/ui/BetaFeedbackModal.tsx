import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useFeedbackStore, FeedbackItem } from "@/stores/feedbackStore";
import { useToastStore } from "@/stores/toastStore";

interface BetaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BetaFeedbackModal({ isOpen, onClose }: BetaFeedbackModalProps) {
  const { addFeedback } = useFeedbackStore();
  const { addToast } = useToastStore();

  const [category, setCategory] = useState<FeedbackItem["category"]>("bug");
  const [severity, setSeverity] = useState<FeedbackItem["severity"]>("medium");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addFeedback({
        category,
        severity,
        message,
        contactEmail: contactEmail.trim() || undefined,
        route: window.location.pathname,
      });

      addToast({
        type: "success",
        title: "Feedback Submitted",
        description: "Thank you for helping us improve AeroForge AI!",
      });

      setIsSubmitting(false);
      setMessage("");
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#080E1C] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl font-sans text-white space-y-5"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold font-mono text-white">Send Beta Feedback</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-mono text-white/70 mb-2 uppercase tracking-wider">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: "bug", label: "Bug Report", icon: AlertTriangle },
                  { id: "ux", label: "UX Friction", icon: MessageSquare },
                  { id: "accuracy", label: "Accuracy Check", icon: ShieldAlert },
                  { id: "feature", label: "Idea / Feature", icon: Lightbulb },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id as FeedbackItem["category"])}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold"
                          : "bg-[#050914] border-white/10 text-white/60 hover:border-white/20"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity selection */}
            <div>
              <label className="block text-xs font-mono text-white/70 mb-2 uppercase tracking-wider">
                Severity
              </label>
              <div className="flex items-center gap-2 text-xs font-mono">
                {(["low", "medium", "high", "critical"] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-1.5 rounded-lg border text-center uppercase text-[10px] font-bold transition-all ${
                      severity === sev
                        ? sev === "critical" || sev === "high"
                          ? "bg-rose-500/20 border-rose-500 text-rose-300"
                          : "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                        : "bg-[#050914] border-white/10 text-white/50 hover:border-white/20"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block text-xs font-mono text-white/70 mb-1 uppercase tracking-wider">
                Description / Details
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What happened? What was expected? Any context helps us refine the beta..."
                rows={4}
                required
                className="w-full p-3 bg-[#040710] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
              />
            </div>

            {/* Optional Email */}
            <div>
              <label className="block text-xs font-mono text-white/70 mb-1 uppercase tracking-wider">
                Contact Email <span className="text-white/30">(Optional)</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="researcher@university.edu"
                className="w-full px-3 py-2 bg-[#040710] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs font-mono transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
