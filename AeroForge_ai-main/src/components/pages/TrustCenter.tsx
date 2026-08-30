import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Eye,
  Cpu,
  Database,
  FileText,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Users,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function TrustCenter() {
  usePageMeta(
    "Trust & Scientific Governance Center",
    "Project Polaris institutional transparency, open physics equations, local data sovereignty, and security policies.",
  );

  return (
    <div className="min-h-screen bg-[var(--af-bg)] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--af-accent)] px-3 py-1 rounded bg-[var(--af-surface-1)] border border-[var(--af-border-accent)] inline-block">
            PROJECT POLARIS SCIENTIFIC GOVERNANCE
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            Trust, Transparency & Security Center
          </h1>
          <p className="text-xs text-white/60 max-w-lg mx-auto leading-relaxed">
            Our unwavering commitment to engineering data sovereignty, transparent mathematical
            formulations, student privacy, and open scientific inquiry.
          </p>
        </div>

        {/* Project Polaris Institutional Connection Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--af-surface-1)] to-[#09152C] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/polaris-logo.png"
              alt="Project Polaris Logo"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                A Project Polaris Open Science Initiative
              </h3>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                AeroForge AI is student-led, mentor-supported, and built to democratize high-grade
                aerospace and mechanical simulation tools.
              </p>
            </div>
          </div>
          <a
            href="/"
            target="_top"
            className="px-4 py-2 rounded-lg bg-[var(--af-accent)] hover:bg-sky-400 text-black text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Polaris Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-4">
          {/* Section 1: Data Privacy & Security */}
          <div className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono">
              <Lock className="w-4 h-4" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                1. Local-First Data Sovereignty
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Your engineering projects, geometry files, simulation outputs, and notebooks belong
              entirely to you. All 40+ local reduced-order solvers execute 100% in-browser on client
              devices with zero cloud telemetry. Proprietary CAD models never leave your machine.
            </p>
          </div>

          {/* Section 2: SHA-256 Digital Thread Audit Hashes */}
          <div className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2.5 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                2. Cryptographic Digital Thread Audit Hashes
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Every design iteration automatically generates a deterministic digital thread record
              linking Mission Requirements → Airfoil Geometry → Solver Output → Public Verification
              Artifact. This ensures tamper-proof audit trails for student competitions and
              engineering reviews.
            </p>
          </div>

          {/* Section 3: AI Copilot Context */}
          <div className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2.5 text-purple-400 font-mono">
              <Cpu className="w-4 h-4" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                3. AI Copilot Boundaries & Zero Training Guarantee
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              The AI Copilot operates strictly on explicit project context. Your proprietary
              engineering calculations, custom geometry arrays, and equations are never fed into
              foundation model training sets.
            </p>
          </div>

          {/* Section 4: Engineering Accuracy & Disclaimers */}
          <div className="bg-[var(--af-surface-1)] border border-white/10 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2.5 text-amber-400 font-mono">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                4. Engineering Accuracy & Limitations
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              All tools state their mathematical assumptions, flow regimes, and analytical limits.
              AeroForge calculations are reduced-order conceptual tools and must be independently
              verified by qualified engineering professionals before use in certified flight
              hardware.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 flex justify-center gap-4 flex-wrap">
          <Link to="/legal">
            <button className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-mono transition-all">
              View Legal Policies
            </button>
          </Link>
          <Link to="/validation">
            <button className="px-5 py-2.5 rounded-lg bg-[var(--af-accent)] hover:bg-sky-400 text-black text-xs font-mono font-bold transition-all flex items-center gap-1.5">
              Explore Validation Center
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
