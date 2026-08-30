import React from "react";
import { ShieldCheck, CheckCircle2, Lock, GitBranch, Terminal, FileCheck } from "lucide-react";

export default function StandardsAndPractices() {
  const practices = [
    {
      title: "Reproducible Workflows",
      badge: "AS9100 Rev D Aligned",
      desc: "Full digital thread provenance tracing Result → Experiment → Simulation → Mesh → Dataset with 1-click JSON reproducibility packages.",
      icon: GitBranch,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      title: "Accessibility Conformance",
      badge: "WCAG 2.1 AA Aligned",
      desc: "High contrast JetBrains Mono data typography, full keyboard navigation, explicit focus indicators, and screen reader labels.",
      icon: CheckCircle2,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "Data Sovereignty & Security",
      badge: "Transparent Privacy",
      desc: "TLS 1.3 transit encryption, AES-256 storage, zero third-party AI model training, and 1-click export of STL, CSV, and JSON data.",
      icon: Lock,
      color: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    },
    {
      title: "Transparent Physics Methodology",
      badge: "Verifiable Solvers",
      desc: "Open-source solver support (OpenFOAM, SU2, CalculiX), documented US Standard Atmosphere models, and explicit unit conversions.",
      icon: Terminal,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
  ];

  return (
    <div className="w-full bg-[#080E1C] border border-white/10 rounded-xl p-6 font-mono text-white space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white tracking-tight uppercase">
              STANDARDS & ENGINEERING PRACTICES
            </h3>
          </div>
          <p className="text-xs text-white/60 font-sans mt-0.5 max-w-2xl">
            AeroForge operates on evidence-based engineering practices, reproducible data pipelines,
            and transparent data sovereignty.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {practices.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={i}
              className="bg-[#050914] border border-white/10 rounded-lg p-4 space-y-2 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-xs text-white">{p.title}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.color}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
