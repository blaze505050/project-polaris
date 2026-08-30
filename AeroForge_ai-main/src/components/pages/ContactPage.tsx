import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, MessageSquare, Send, ShieldCheck, Cpu } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ContactPage() {
  usePageMeta(
    "Contact Research Lab",
    "Get in touch with the AeroForge engineering and research team.",
  );
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Research Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate("/thank-you");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block mb-3">
            RESEARCH & SUPPORT DISPATCH
          </span>
          <h1 className="text-3xl font-extrabold text-white mb-2">Contact AeroForge Engineering</h1>
          <p className="text-xs text-white/50 max-w-lg mx-auto">
            Questions regarding tool accuracy, mathematical models, feature requests, or
            institutional collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Info Panel */}
          <div className="space-y-4">
            <div className="bg-[#0A1020] border border-white/8 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Mail className="w-4 h-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Direct Channel
                </h3>
              </div>
              <p className="text-xs text-white/60 font-mono">contact@aeroforge.io</p>
              <p className="text-xs text-white/60 font-mono">security@aeroforge.io</p>
            </div>

            <div className="bg-[#0A1020] border border-white/8 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Cpu className="w-4 h-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Technical Audits
                </h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                For peer review of physics engine solvers or custom tool integrations, include your
                technical specifications.
              </p>
            </div>

            <div className="bg-[#0A1020] border border-white/8 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-green-400">
                <ShieldCheck className="w-4 h-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Security
                </h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Vulnerability disclosures are acknowledged within 48 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-[#0A1020] border border-white/10 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Alex Vance"
                    className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@institution.edu"
                    className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/70 block mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                >
                  <option value="Research Inquiry">Research / Technical Inquiry</option>
                  <option value="Tool Feedback">Tool Feedback / Model Validation</option>
                  <option value="Bug Report">Bug / Anomaly Report</option>
                  <option value="Institutional Access">Institutional Access</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-white/70 block mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, calculation edge case, or feedback..."
                  className="w-full bg-[#060B18] border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-cyan-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Transmitting..." : "Send Dispatch"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
