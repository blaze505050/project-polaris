import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Tag, Sparkles, Cpu, Layers, Bug, CheckCircle2, Sliders } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';

interface ReleaseNote {
  version: string;
  date: string;
  badge: 'STABLE' | 'BETA' | 'PATCH';
  highlights: string[];
  features: string[];
  improvements: string[];
  fixes: string[];
}

export default function ChangelogPage() {
  const releases: ReleaseNote[] = [
    {
      version: 'v0.9.4',
      date: 'August 12, 2026',
      badge: 'STABLE',
      highlights: [
        '5-Minute Guided Engineering Demo ("Morphing Airfoil Research")',
        'Central Engineering Unit Store (SI, Metric, Imperial converters)',
        'Global Command Palette (⌘K) keyboard shortcut navigation',
      ],
      features: [
        'Browser-native ASCII STL geometry exporter in CAD service',
        'Digital Thread Provenance tree & 1-Click Reproduce Run modal',
        'Universal Design Comparison matrix with Lift, Drag & Stress delta indicators',
        'Project Health Index (84% score tracking requirement matrix verification)',
      ],
      improvements: [
        'HPC Simulation Manager stdout/stderr live log viewer drawer',
        'High-density JetBrains Mono data typography across all engineering tables',
        'Actionable empty states with template guidance & direct CTAs',
      ],
      fixes: [
        'Fixed WebGL renderer aspect ratio handling in fullscreen preview modal',
        'Resolved parameter reactivity in US Standard Atmosphere viscosity solver',
      ],
    },
    {
      version: 'v0.9.0',
      date: 'July 28, 2026',
      badge: 'BETA',
      highlights: [
        'AstroLab & AeroLab multi-physics calculation engine launch',
        'Jupyter + Obsidian style Engineering Notebook with LaTeX math rendering',
      ],
      features: [
        'Compressible aerodynamic solver for NACA 4-digit airfoils',
        'Oblique shockwave & Sutton-Graves hypersonics calculator',
        'Porkchop plot interplanetary trajectory architect',
      ],
      improvements: [
        'Added dark mode aerospace command center design language',
        'Optimized WebGL Three.js render loop to 60 FPS on mobile GPUs',
      ],
      fixes: [
        'Fixed state persistence key collisions in Zustands storage',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="border-b border-white/10 pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-tight uppercase">
                ENGINEERING CHANGELOG & RELEASES
              </h1>
            </div>
            <p className="text-xs text-white/60 font-sans max-w-2xl">
              Platform updates, solver additions, performance optimizations, and bug fixes.
            </p>
          </div>

          {/* Release Timeline */}
          <div className="space-y-8">
            {releases.map((rel, idx) => (
              <div key={idx} className="bg-[#080E1C] border border-white/10 rounded-xl p-6 space-y-4 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-base font-bold text-white tracking-tight">{rel.version}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                      {rel.badge}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">{rel.date}</span>
                </div>

                {/* Highlights */}
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg space-y-1.5 text-xs">
                  <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>RELEASE HIGHLIGHTS</span>
                  </div>
                  <ul className="space-y-1 text-cyan-100 font-sans">
                    {rel.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      NEW FEATURES & CAPABILITIES
                    </span>
                    <ul className="space-y-1 text-white/80">
                      {rel.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                      PERFORMANCE & UI POLISH
                    </span>
                    <ul className="space-y-1 text-white/80">
                      {rel.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fixes */}
                {rel.fixes.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs font-sans">
                    <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider block">
                      BUG FIXES & RESOLUTIONS
                    </span>
                    <ul className="space-y-1 text-white/70">
                      {rel.fixes.map((fix, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Bug className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
