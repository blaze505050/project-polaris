import React from "react";
import { motion } from "framer-motion";
import { GitBranch, ChevronRight } from "lucide-react";
import FeatureStatusBadge from "@/components/ui/FeatureStatusBadge";

interface VersionEntry {
  version: string;
  date: string;
  summary: string;
  author?: string;
  changes: string[];
}

interface VersionHistoryProps {
  entries?: VersionEntry[];
  className?: string;
}

const DEFAULT_ENTRIES: VersionEntry[] = [
  {
    version: "v0.1",
    date: "Initial",
    summary: "Project created with initial requirements",
    changes: ["Project workspace initialized", "Requirements matrix created"],
  },
  {
    version: "v0.2",
    date: "Design",
    summary: "Baseline geometry and mesh generated",
    changes: [
      "NACA 2412 airfoil selected",
      "Computational mesh generated (structured, 200K cells)",
    ],
  },
  {
    version: "v0.3",
    date: "Analysis",
    summary: "First simulation run completed",
    changes: [
      "CFD run at α=5°, Re=3×10⁶",
      "L/D = 15.2 — exceeds REQ-AERO-01 target",
      "Pressure distribution captured",
    ],
  },
];

export default function VersionHistory({
  entries = DEFAULT_ENTRIES,
  className = "",
}: VersionHistoryProps) {
  return (
    <div className={`bg-[#080E1C] border border-white/10 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          VERSION HISTORY
        </h4>
        <FeatureStatusBadge status="beta" />
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10" />

        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-6"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                  idx === entries.length - 1
                    ? "bg-cyan-400 border-cyan-400"
                    : "bg-[#050914] border-white/20"
                }`}
              />

              <div className="bg-[#050914] border border-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-cyan-400 font-mono">
                    {entry.version}
                  </span>
                  <span className="text-[9px] text-white/30 font-mono">{entry.date}</span>
                </div>
                <p className="text-[11px] text-white/70 font-sans mb-1.5">{entry.summary}</p>
                <div className="space-y-0.5">
                  {entry.changes.map((change, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 text-[9px] text-white/50 font-sans"
                    >
                      <ChevronRight className="w-2.5 h-2.5 text-cyan-400/40 mt-0.5 shrink-0" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
