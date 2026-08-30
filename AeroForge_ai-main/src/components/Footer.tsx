import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, AlertTriangle, Cpu, Mail, CheckCircle2, Shield } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const footerSections = [
    {
      title: "Project Polaris",
      links: [
        { label: "Polaris Portal Home", href: "/", externalTab: true },
        { label: "Student Programs", href: "/programs", externalTab: true },
        { label: "Innovation Projects", href: "/projects", externalTab: true },
        { label: "Community Learning", href: "/community", externalTab: true },
        { label: "Contact Team", href: "/contact", externalTab: true },
      ],
    },
    {
      title: "AeroForge Labs",
      links: [
        { label: "AeroLab Aerodynamics", path: "/aerolab" },
        { label: "MechLab Structures", path: "/mechlab" },
        { label: "AstroLab Orbital Suite", path: "/astrolab" },
        { label: "Physics AI Lab", path: "/physics-ai" },
        { label: "Validation Center", path: "/validation" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation Hub", path: "/documentation" },
        { label: "Engineering Demo", path: "/demo" },
        { label: "Public Artifacts", path: "/share/EXP-2026-NACA2412" },
        { label: "System Settings", path: "/settings" },
        { label: "Platform Changelog", path: "/changelog" },
      ],
    },
    {
      title: "Governance & Trust",
      links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Security Practices", path: "/legal" },
        { label: "Scientific Disclaimer", path: "/legal" },
        { label: "Trust Center", path: "/trust" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[var(--af-bg)] border-t border-white/10 mt-auto font-mono text-white">
      {/* Newsletter / Polaris Ecosystem Bar */}
      <div className="border-b border-white/10 bg-[var(--af-surface-1)] py-8 px-6 md:px-[6%]">
        <div className="max-w-[120rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--af-accent)] bg-[var(--af-accent)]/10 px-2 py-0.5 rounded border border-[var(--af-border-accent)]">
                Project Polaris Ecosystem
              </span>
            </div>
            <h4 className="text-base font-bold text-white font-sans">
              Stay in the loop with Project Polaris
            </h4>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Updates on AeroForge releases, aerospace research, open workshops, and student
              engineering challenges.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex items-center gap-2 w-full md:w-auto max-w-md"
          >
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg font-sans">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for subscribing to Project Polaris updates!</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student or work email"
                  required
                  className="bg-[#050914] border border-white/15 focus:border-[var(--af-accent)] rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none flex-1 md:w-64 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--af-accent)] hover:bg-sky-400 text-black text-xs font-bold font-sans transition-all shrink-0"
                >
                  Join Newsletter
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[120rem] mx-auto px-6 md:px-[6%] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/polaris-logo.png"
                alt="Project Polaris Logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight">
                  AERO<span className="text-[var(--af-accent)]">FORGE</span> AI
                </span>
                <span className="text-[8.5px] text-white/50 tracking-wider">
                  A PROJECT POLARIS INITIATIVE
                </span>
              </div>
            </Link>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Browser-based engineering operating system for aerospace aerodynamics, CFD simulation,
              structural FEA, and orbital research.
            </p>
            <div className="inline-flex items-center gap-2 text-[10px] text-[var(--af-accent)] bg-[var(--af-surface-1)] px-2.5 py-1 rounded border border-[var(--af-border-accent)]">
              <Cpu className="w-3 h-3" />
              <span>40+ NUMERICAL SOLVERS LOADED</span>
            </div>
          </div>

          {/* Footer Links (4 columns) */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2 text-xs">
                {section.links.map((link: any) => (
                  <li key={link.label}>
                    {link.externalTab ? (
                      <a
                        href={link.href}
                        target="_top"
                        className="text-white/60 hover:text-[var(--af-accent)] transition-colors flex items-center gap-1 group"
                      >
                        <span>{link.label}</span>
                        <span className="text-[10px] text-white/30 group-hover:text-[var(--af-accent)]">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-white/60 hover:text-[var(--af-accent)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Engineering Disclaimer Bar */}
        <div className="p-4 bg-[var(--af-surface-1)] border border-amber-500/20 rounded-lg text-[11px] text-white/70 space-y-1.5 font-sans relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500/80" />
          <div className="flex items-center gap-2 font-mono text-amber-400 font-bold text-xs pl-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>ENGINEERING DISCLAIMER & VERIFICATION NOTICE:</span>
          </div>
          <p className="pl-1">
            AeroForge numerical outputs, computational fluid dynamics (CFD) estimates, finite
            element structural stresses, and AI recommendations are provided for research and
            educational evaluation purposes. All critical results must be independently verified by
            qualified aerospace or mechanical engineering professionals before use in production
            hardware, flight systems, or safety-critical infrastructure.
          </p>
        </div>

        {/* Copyright & Telemetry */}
        <div className="border-t border-white/10 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/40 gap-3">
          <div>© {currentYear} Project Polaris. AeroForge AI — Built by Project Polaris.</div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/changelog" className="hover:text-white transition-colors">
              Changelog (v1.0.0)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
