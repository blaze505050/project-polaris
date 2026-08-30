import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Database,
  ShieldCheck,
  ExternalLink,
  FileCode,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { DATASET_REGISTRY } from "@/services/physicsAi/datasetRegistryData";
import { DatasetCard } from "@/types/physicsAi";

export default function DatasetRegistryView() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDataset, setSelectedDataset] = useState<DatasetCard | null>(null);

  const filteredDatasets = DATASET_REGISTRY.filter((d) => {
    return (
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.physics.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Disclaimer Box Required by Spec */}
      <div className="p-4 bg-[#0A1020] border border-cyan-500/20 rounded-xl flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-mono font-bold text-white">Dataset License & Attribution Policy</h4>
          <p className="text-white/60 leading-relaxed font-sans">
            AeroForge does not own or claim copyright over third-party research datasets listed
            below. Every dataset retains its native license (CC-BY, MIT, Apache 2.0, Open Data).
            Users must verify licensing terms before redistributing or conducting commercial
            fine-tuning.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#0A1020] p-4 rounded-xl border border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search simulation datasets (AirfRANS, PDEBench, DrivAerML, etc)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#060B18] border border-white/10 rounded-lg text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDatasets.map((ds) => (
          <motion.div
            key={ds.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A1020] border border-white/10 rounded-xl p-5 shadow-xl hover:border-cyan-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                    {ds.source}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{ds.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  {ds.license}
                </div>
              </div>

              <p className="text-xs text-white/60 mb-3 leading-relaxed font-sans">
                {ds.description}
              </p>

              <div className="space-y-2 bg-[#060B18] p-3 rounded-lg border border-white/5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Physics:</span>
                  <span className="text-white/80">{ds.physics}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Size & Domain:</span>
                  <span className="text-cyan-300">{ds.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Resolution:</span>
                  <span className="text-purple-300">{ds.resolution}</span>
                </div>
              </div>

              {/* Variables */}
              <div className="mt-3">
                <span className="text-[10px] font-mono text-white/40 block mb-1">
                  KEY VARIABLES:
                </span>
                <div className="flex flex-wrap gap-1">
                  {ds.variables.map((v, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono text-[10px]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span
                className="text-[10px] text-white/40 truncate max-w-[200px]"
                title={ds.useInAeroForge}
              >
                Use: {ds.useInAeroForge}
              </span>
              {ds.url && (
                <a
                  href={ds.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded transition-all font-bold text-[11px] flex items-center gap-1"
                >
                  Access Dataset
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
