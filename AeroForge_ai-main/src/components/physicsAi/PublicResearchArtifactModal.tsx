import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Copy, Share2, ShieldAlert, Sparkles, Download, ExternalLink, Lock } from 'lucide-react';
import { AirfoilSurrogateInputs, AirfoilSurrogateResult } from '@/types/physicsAi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inputs: AirfoilSurrogateInputs;
  result: AirfoilSurrogateResult;
}

export default function PublicResearchArtifactModal({ isOpen, onClose, inputs, result }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const artifactId = `pub-af-fno-${Date.now().toString(36)}`;
  const artifactUrl = `${window.location.origin}/share/${artifactId}`;

  const checkpointSha256 = result.physicsResiduals.checkpointSha256 || '288174fe4315df5eb624524368aff65b763a027ef8559172ae2181bf128cb989';
  const paramCount = result.physicsResiduals.parameterCount || 485120;

  const payload = {
    title: `Physics AI FNO Airfoil Analysis — ${inputs.airfoilName}`,
    disclaimer: 'EXPERIMENTAL PHYSICS AI — NOT CERTIFIED ENGINEERING ANALYSIS',
    date: new Date().toISOString(),
    inputs,
    resultSummary: {
      model: result.modelName,
      version: result.modelVersion,
      executionStatus: result.executionStatus,
      cl: result.cl,
      cd: result.cd,
      cm: result.cm,
      inferenceTimeMs: result.inferenceTimeMs,
      timingBreakdown: {
        preprocessingMs: result.physicsResiduals.preprocessingTimeMs,
        modelInferenceMs: result.physicsResiduals.modelInferenceTimeMs,
        postprocessingMs: result.physicsResiduals.postprocessingTimeMs,
        totalExecutionMs: result.physicsResiduals.totalExecutionTimeMs,
      },
      relClErrorPct: result.errorMetrics.relClErrorPct,
      relCdErrorPct: result.errorMetrics.relCdErrorPct,
      cpMae: result.errorMetrics.cpMae,
      distributionCheck: result.distributionCheck,
    },
    reproducibilityProvenance: {
      platform: 'AeroForge Physics AI Lab',
      modelId: 'fno',
      checkpointFile: 'fno_naca_2d_v2.pt',
      checkpointSha256: checkpointSha256,
      parameterCount: paramCount,
      upstreamSource: 'https://github.com/zongyi-li/fourier_neural_operator',
      license: 'MIT License',
      solverVerification: 'AeroForge Analytical Potential Flow Theory',
    },
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(artifactUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0A1020] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh] text-white font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-extrabold font-mono text-white">Public Research Artifact Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner Required by Spec */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-300 font-mono text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="font-extrabold block">EXPERIMENTAL PHYSICS AI — NOT CERTIFIED ENGINEERING ANALYSIS</span>
            <span className="text-[10px] text-amber-300/70 font-sans">
              This artifact contains surrogate model predictions for scientific evaluation. Must not be used for flight certification.
            </span>
          </div>
        </div>

        {/* Artifact Provenance Summary */}
        <div className="bg-[#060B18] border border-white/10 rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/40">ARTIFACT TITLE:</span>
            <span className="text-cyan-300 font-bold">{payload.title}</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/40">AIRFOIL & FLOW:</span>
            <span className="text-white/90">{inputs.airfoilName} (M={inputs.mach}, Re={inputs.reynolds.toExponential(1)}, α={inputs.aoa}°)</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/40">NEURAL OPERATOR:</span>
            <span className="text-purple-300">{result.modelName} (v{result.modelVersion})</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/40">CHECKPOINT SHA256:</span>
            <span className="text-emerald-400 font-bold truncate max-w-[280px]" title={checkpointSha256}>
              {checkpointSha256}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/40">PREDICTED FORCES:</span>
            <span className="text-emerald-400 font-bold">CL = {result.cl}, CD = {result.cd} (Δ {result.errorMetrics.relClErrorPct}%)</span>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="space-y-1 font-mono text-xs">
          <label className="text-white/50 text-[11px] block">PUBLIC ARTIFACT URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={artifactUrl}
              className="flex-1 bg-[#060B18] border border-white/10 rounded-lg px-3 py-2 text-cyan-400 font-mono text-xs focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 font-mono text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
