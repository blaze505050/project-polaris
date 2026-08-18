import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, ExternalLink, ShieldCheck, Cpu, Database, FileText, CheckCircle2, Lock } from 'lucide-react';
import { ModelCard } from '@/types/physicsAi';

interface Props {
  model: ModelCard | null;
  isOpen: boolean;
  onClose: () => void;
  onRunInAeroForge: (modelId: string) => void;
}

export default function ModelInspectionModal({ model, isOpen, onClose, onRunInAeroForge }: Props) {
  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0A1020] border border-cyan-500/40 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-white"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                {model.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                model.status === 'LIVE'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              }`}>
                {model.status === 'LIVE' ? 'LIVE IN AEROFORGE' : model.status}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-mono text-white flex items-center gap-2">
              {model.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Execution Banner */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-4 flex-wrap font-mono text-xs">
          <div className="space-y-1">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              EMBEDDED AEROFORGE ENGINE
            </span>
            <p className="text-white/60 font-sans text-xs">
              This model runs directly inside AeroForge via local Python/PyTorch backend API. No external workflow redirection required.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onRunInAeroForge(model.id);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl transition-all shadow-lg flex items-center gap-2 text-xs uppercase"
          >
            <Play className="w-4 h-4 fill-black" />
            Run in AeroForge
          </button>
        </div>

        {/* Checkpoint Verification Grid */}
        {model.checkpointInfo && (
          <div className="bg-[#060B18] border border-white/10 rounded-xl p-4 space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Verified PyTorch State-Dict Checkpoint
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-white/40 block">CHECKPOINT FILE:</span>
                <span className="text-cyan-300 font-bold">{model.checkpointInfo.name}</span>
              </div>

              <div>
                <span className="text-[10px] text-white/40 block">FILE SIZE & PARAMS:</span>
                <span className="text-purple-300 font-bold">
                  {model.checkpointInfo.fileSizeKb} KB ({model.checkpointInfo.parameterCount?.toLocaleString()} parameters)
                </span>
              </div>

              <div className="md:col-span-2">
                <span className="text-[10px] text-white/40 block">SHA256 CHECKSUM (VERIFIED):</span>
                <span className="text-emerald-400 font-bold break-all bg-black/50 p-1.5 rounded block text-[10px]">
                  {model.checkpointInfo.checksum}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Architecture Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block font-bold">ARCHITECTURE</span>
            <p className="text-white/80">{model.architecture}</p>
          </div>

          <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block font-bold">TRAINING DATASET</span>
            <p className="text-cyan-300">{model.trainingDataType}</p>
          </div>

          <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block font-bold">INPUT DOMAIN</span>
            <p className="text-white/80">{model.inputType}</p>
          </div>

          <div className="bg-[#060B18] p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block font-bold">OUTPUT PREDICTION</span>
            <p className="text-purple-300">{model.outputType}</p>
          </div>
        </div>

        {/* Source Attribution Box */}
        <div className="p-4 bg-[#060B18] border border-white/10 rounded-xl space-y-2 font-mono text-xs">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Upstream Academic Attribution & Source Reference
          </h4>

          <div className="space-y-1 text-[11px] text-white/70">
            <p><span className="text-white/40">Paper:</span> {model.citation}</p>
            <p><span className="text-white/40">License:</span> <span className="text-purple-300 font-bold">{model.license}</span></p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={model.repository}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 rounded flex items-center gap-1 font-bold text-[11px]"
            >
              View Upstream Source Code
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/10 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
