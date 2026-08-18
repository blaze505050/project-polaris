import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, ExternalLink, BookOpen, FileText } from 'lucide-react';
import { MODEL_REGISTRY } from '@/services/physicsAi/modelRegistryData';
import { DATASET_REGISTRY } from '@/services/physicsAi/datasetRegistryData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThirdPartyLicensesModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0A1020] border border-cyan-500/30 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-white"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-extrabold font-mono text-white">
              Third-Party Open-Source Models, Checkpoints & Datasets Attribution
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* License Policy Banner */}
        <div className="p-4 bg-[#060B18] border border-white/10 rounded-xl space-y-2 text-xs">
          <h4 className="font-mono font-bold text-cyan-400">License Compliance & Commercial Use Notice</h4>
          <p className="text-white/70 leading-relaxed font-sans">
            AeroForge AI incorporates open-source scientific neural operator architectures and datasets developed by academic institutions, research centers, and open-source communities. All original copyrights, licenses, and academic citations are strictly preserved.
          </p>
        </div>

        {/* Models License Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Integrated Neural Operator Models & Architectures
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-[#060B18] text-white/50 border-b border-white/10 text-[11px]">
                <tr>
                  <th className="p-2.5">MODEL NAME</th>
                  <th className="p-2.5">ORIGINAL CREATOR / REPO</th>
                  <th className="p-2.5">LICENSE</th>
                  <th className="p-2.5">COMMERCIAL RESTRICTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MODEL_REGISTRY.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5">
                    <td className="p-2.5 font-bold text-cyan-300">{m.name}</td>
                    <td className="p-2.5 text-white/70 text-[11px] max-w-[200px] truncate">{m.citation}</td>
                    <td className="p-2.5 font-bold text-purple-300">{m.license}</td>
                    <td className="p-2.5 text-white/50 text-[11px]">
                      {m.license.includes('NC') ? 'Non-Commercial Research Only' : 'Permissive / Commercial Allowed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Datasets License Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Curated Physics & Simulation Datasets
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-[#060B18] text-white/50 border-b border-white/10 text-[11px]">
                <tr>
                  <th className="p-2.5">DATASET</th>
                  <th className="p-2.5">RESEARCH INSTITUTION</th>
                  <th className="p-2.5">LICENSE</th>
                  <th className="p-2.5">ACCESS METHOD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DATASET_REGISTRY.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5">
                    <td className="p-2.5 font-bold text-emerald-400">{d.name}</td>
                    <td className="p-2.5 text-white/70 text-[11px]">{d.source}</td>
                    <td className="p-2.5 font-bold text-purple-300">{d.license}</td>
                    <td className="p-2.5 text-white/50 text-[11px]">{d.accessMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold rounded-lg transition-colors"
          >
            Close Licensing Modal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
