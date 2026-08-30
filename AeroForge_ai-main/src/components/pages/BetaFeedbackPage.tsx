import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
  Send,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function BetaFeedbackPage() {
  usePageMeta(
    "Beta Feedback & Bug Report",
    "Submit engineering research feedback, report issues, and view submitted beta items.",
  );

  const { feedbackList, clearFeedback } = useFeedbackStore();

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block font-bold">
            COMMUNITY & RESEARCH FEEDBACK
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-mono">
            Beta Feedback Hub
          </h1>
          <p className="text-xs md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
            Your feedback directly shapes the precision, reliability, and usability of AeroForge AI.
          </p>
        </div>

        {/* Feedback List */}
        <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Submitted Local Feedback ({feedbackList.length})</span>
            </h2>
            {feedbackList.length > 0 && (
              <button
                onClick={clearFeedback}
                className="text-xs font-mono text-white/40 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {feedbackList.length === 0 ? (
            <div className="text-center py-12 text-white/40 space-y-2 font-mono text-xs">
              <p>No feedback items submitted locally yet.</p>
              <p className="text-[11px] text-white/30">
                Use the "Beta Feedback" button in the header or footer to submit thoughts anytime!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#050914] border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase font-bold text-[9px]">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded uppercase text-[9px] font-bold ${
                          item.severity === "critical" || item.severity === "high"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-white/5 text-white/70 border border-white/10"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <span className="text-white/40 text-[10px]">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-white/80 font-sans text-xs leading-relaxed">{item.message}</p>

                  <div className="flex items-center justify-between text-[10px] text-white/40 border-t border-white/5 pt-2">
                    <span>Route: {item.route}</span>
                    {item.contactEmail && <span>Contact: {item.contactEmail}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
