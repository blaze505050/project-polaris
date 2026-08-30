import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Lock,
  Brain,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Terminal,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandCenterSidebar from "@/components/CommandCenterSidebar";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<
    "disclaimer" | "privacy" | "terms" | "ai-transparency" | "security"
  >("disclaimer");

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="border-b border-white/10 pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-tight uppercase">
                LEGAL, TRUST & COMPLIANCE CENTER
              </h1>
            </div>
            <p className="text-xs text-white/60 font-sans max-w-2xl">
              Transparent engineering disclaimers, data practices, AI boundary notices, and terms of
              service.
            </p>
          </div>

          {/* Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
            {[
              { id: "disclaimer", label: "Engineering Disclaimer", icon: AlertTriangle },
              { id: "privacy", label: "Privacy & Data Policy", icon: Lock },
              { id: "terms", label: "Terms of Service", icon: FileText },
              { id: "ai-transparency", label: "AI Transparency Notice", icon: Brain },
              { id: "security", label: "Security Practices", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="bg-[#080E1C] border border-white/10 rounded-xl p-6 space-y-4 font-sans text-xs text-white/80 leading-relaxed">
            {/* 1. ENGINEERING DISCLAIMER */}
            {activeTab === "disclaimer" && (
              <div className="space-y-4 font-mono">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>CRITICAL ENGINEERING DISCLAIMER</span>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs space-y-2 leading-relaxed">
                  <p>
                    <strong>1. Verification Required:</strong> AeroForge numerical outputs,
                    computational fluid dynamics (CFD) estimates, finite element analysis (FEA)
                    stress margins, orbital propagations, and AI-generated insights are provided for
                    research, conceptual design, and educational evaluation purposes.
                  </p>
                  <p>
                    <strong>2. Not a Replacement for Professional Engineering Sign-off:</strong> All
                    calculations MUST be independently reviewed, benchmarked, and validated by
                    qualified aerospace or mechanical engineering professionals before use in flight
                    hardware, structural manufacturing, or life-critical applications.
                  </p>
                  <p>
                    <strong>3. Boundary & Physical Limitations:</strong> Numerical approximations
                    rely on empirical atmospheric models (US Standard Atmosphere 1976), boundary
                    layer turbulence closures (k-omega SST), and linear elasticity assumptions.
                    Unmodeled real-world phenomena (e.g. non-equilibrium chemistry, material
                    fatigue, manufacturing flaws) may affect real hardware performance.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PRIVACY & DATA POLICY */}
            {activeTab === "privacy" && (
              <div className="space-y-3 font-sans">
                <h3 className="font-mono text-sm font-bold text-white">
                  Privacy & Data Governance Policy
                </h3>
                <p>
                  AeroForge respects your research data sovereignty. Your engineering projects,
                  geometry files (`STL`, `STEP`), simulation meshes, parameters, and custom notebook
                  scripts belong exclusively to you.
                </p>
                <div className="space-y-2 font-mono text-[11px] pt-2">
                  <div className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-white">Zero Third-Party AI Model Training:</span>
                    <span className="text-emerald-400 font-bold">GUARANTEED</span>
                  </div>
                  <div className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-white">Data Export Rights:</span>
                    <span className="text-cyan-400 font-bold">1-Click STL / CSV / JSON</span>
                  </div>
                  <div className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-white">Account Deletion:</span>
                    <span className="text-white/80">Complete Data Purge On Request</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TERMS OF SERVICE */}
            {activeTab === "terms" && (
              <div className="space-y-3 font-sans">
                <h3 className="font-mono text-sm font-bold text-white">Terms of Service</h3>
                <p>
                  By accessing the AeroForge platform, users agree to utilize compute resources
                  responsibly, abide by export control laws (ITAR/EAR compliance guidelines), and
                  maintain standard computer security.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-white/70">
                  <li>Compute resources are subject to fair usage monitoring.</li>
                  <li>
                    Users retain full intellectual property over custom code, airfoils, and CAD
                    geometries created within AeroForge.
                  </li>
                  <li>
                    Platform uptime metrics represent current system state and are monitored via our
                    status dashboard.
                  </li>
                </ul>
              </div>
            )}

            {/* 4. AI TRANSPARENCY NOTICE */}
            {activeTab === "ai-transparency" && (
              <div className="space-y-3 font-sans">
                <h3 className="font-mono text-sm font-bold text-white">
                  AI Transparency & Copilot Guidelines
                </h3>
                <p>
                  AeroForge AI Copilot utilizes large language models fine-tuned on aerospace
                  engineering literature, OpenFOAM dictionary syntax, and fluid dynamics equations.
                </p>
                <div className="p-3 bg-[#050914] border border-white/10 rounded-lg space-y-2 font-mono text-[11px]">
                  <div className="text-cyan-400 font-bold">BOUNDARIES & BEHAVIOR:</div>
                  <div className="text-white/80">
                    • AI suggestions offer heuristic troubleshooting for mesh divergence, Courant
                    number spikes, and parameter tuning.
                  </div>
                  <div className="text-white/80">
                    • The AI does NOT perform autonomous physics calculations; all numerical values
                    are generated by verified WASM or C++ solver engines.
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECURITY PRACTICES */}
            {activeTab === "security" && (
              <div className="space-y-3 font-sans">
                <h3 className="font-mono text-sm font-bold text-white">
                  Security Architecture & Practices
                </h3>
                <p>
                  AeroForge employs multi-tenant data isolation, TLS 1.3 encryption in transit, and
                  AES-256 encryption at rest.
                </p>
                <div className="space-y-2 font-mono text-[11px] pt-2">
                  <div className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-white">Encryption in Transit:</span>
                    <span className="text-cyan-400 font-bold">TLS 1.3 / HTTPS</span>
                  </div>
                  <div className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-white">Encryption at Rest:</span>
                    <span className="text-cyan-400 font-bold">AES-256</span>
                  </div>
                  <div className="p-2.5 bg-[#050914] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-white">Responsible Disclosure Contact:</span>
                    <span className="text-emerald-400 font-bold">security@aeroforge.io</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
