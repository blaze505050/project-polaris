import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Info, ShieldCheck, AlertCircle } from 'lucide-react';

export interface UnitDefinition {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface SimulationMetadata {
  title: string;
  governingEquations: string[];
  assumptions: string[];
  validityBounds: string[];
  unitsTable: UnitDefinition[];
  references: string[];
  solverName: string;
  version: string;
}

interface SimulationMetadataPanelProps {
  metadata: SimulationMetadata;
  className?: string;
}

export default function SimulationMetadataPanel({ metadata, className = '' }: SimulationMetadataPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-xl border border-white/10 bg-[#080d1a] overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider">Engineering Model & Physics Documentation</span>
          <span className="text-[10px] text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/5">
            {metadata.solverName} (v{metadata.version})
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-white/10 space-y-4 text-xs font-mono text-white/70 bg-[#060a14]">
          {/* Governing Equations */}
          <div>
            <h4 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Governing Equations
            </h4>
            <div className="space-y-1 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-cyan-300">
              {metadata.governingEquations.map((eq, i) => (
                <div key={i} className="leading-relaxed">{eq}</div>
              ))}
            </div>
          </div>

          {/* Model Assumptions & Validity Bounds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
                Physical Assumptions
              </h4>
              <ul className="list-disc list-inside space-y-1 text-white/60">
                {metadata.assumptions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Model Validity Bounds
              </h4>
              <ul className="list-disc list-inside space-y-1 text-white/60">
                {metadata.validityBounds.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Units Data Dictionary */}
          <div>
            <h4 className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Units & Data Dictionary
            </h4>
            <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/20">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
                    <th className="px-3 py-1.5">Symbol</th>
                    <th className="px-3 py-1.5">Parameter</th>
                    <th className="px-3 py-1.5">Explicit Unit</th>
                    <th className="px-3 py-1.5">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {metadata.unitsTable.map((u, i) => (
                    <tr key={i} className="border-b border-white/5 text-white/70">
                      <td className="px-3 py-1 font-bold text-cyan-400">{u.symbol}</td>
                      <td className="px-3 py-1">{u.name}</td>
                      <td className="px-3 py-1 font-bold text-amber-400">[{u.unit}]</td>
                      <td className="px-3 py-1 text-white/40">{u.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* References */}
          <div>
            <h4 className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1">
              Literature References & Sources
            </h4>
            <div className="space-y-0.5 text-[10px] text-white/40 italic">
              {metadata.references.map((ref, i) => (
                <div key={i}>[{i + 1}] {ref}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
