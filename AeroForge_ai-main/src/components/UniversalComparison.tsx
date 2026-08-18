import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowUpRight, ArrowDownRight, Check, Sliders } from 'lucide-react';

export interface ComparisonItem {
  id: string;
  name: string;
  category: string;
  metrics: {
    liftToDrag: number;
    massKg: number;
    maxStressMPa: number;
    maxTempK: number;
    costDollars: number;
  };
}

export default function UniversalComparison() {
  const [designA, setDesignA] = useState<ComparisonItem>({
    id: 'des_a',
    name: 'Design v0.4 (Baseline Airfoil)',
    category: 'Subsonic Baseline',
    metrics: {
      liftToDrag: 12.4,
      massKg: 1420,
      maxStressMPa: 240,
      maxTempK: 310,
      costDollars: 45000,
    },
  });

  const [designB, setDesignB] = useState<ComparisonItem>({
    id: 'des_b',
    name: 'Design v0.8 (Morphing Flap Opt)',
    category: 'Optimized Morphing',
    metrics: {
      liftToDrag: 15.2,
      massKg: 1380,
      maxStressMPa: 215,
      maxTempK: 305,
      costDollars: 42000,
    },
  });

  const calculateDelta = (valA: number, valB: number, higherIsBetter = true) => {
    const diff = valB - valA;
    const pct = (diff / valA) * 100;
    const isGood = higherIsBetter ? diff > 0 : diff < 0;

    return {
      diff,
      pct: pct.toFixed(1),
      isGood,
    };
  };

  const ldDelta = calculateDelta(designA.metrics.liftToDrag, designB.metrics.liftToDrag, true);
  const massDelta = calculateDelta(designA.metrics.massKg, designB.metrics.massKg, false);
  const stressDelta = calculateDelta(designA.metrics.maxStressMPa, designB.metrics.maxStressMPa, false);
  const costDelta = calculateDelta(designA.metrics.costDollars, designB.metrics.costDollars, false);

  return (
    <div className="w-full bg-[#080E1C] border border-white/10 rounded-xl p-5 font-mono text-xs text-white space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Universal Design Comparison Matrix</h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            A vs B Multi-Physics
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Design A Card */}
        <div className="bg-[#050914] border border-white/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-bold uppercase">VARIANT A (BASELINE)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/70">{designA.category}</span>
          </div>
          <h4 className="text-sm font-bold text-white">{designA.name}</h4>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span className="text-white/60">Lift-to-Drag L/D:</span>
              <span className="font-bold text-cyan-400">{designA.metrics.liftToDrag}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Structural Mass:</span>
              <span className="font-bold">{designA.metrics.massKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Max Stress:</span>
              <span className="font-bold">{designA.metrics.maxStressMPa} MPa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Estimated Cost:</span>
              <span className="font-bold">${designA.metrics.costDollars.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Design B Card */}
        <div className="bg-[#050914] border border-cyan-500/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">VARIANT B (CANDIDATE)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {designB.category}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">{designB.name}</h4>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span className="text-white/60">Lift-to-Drag L/D:</span>
              <div className="flex items-center gap-1 font-bold">
                <span className="text-cyan-300">{designB.metrics.liftToDrag}</span>
                <span className={`text-[10px] ${ldDelta.isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                  ({ldDelta.pct > '0' ? '+' : ''}{ldDelta.pct}%)
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Structural Mass:</span>
              <div className="flex items-center gap-1 font-bold">
                <span>{designB.metrics.massKg} kg</span>
                <span className={`text-[10px] ${massDelta.isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                  ({massDelta.pct}%)
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Max Stress:</span>
              <div className="flex items-center gap-1 font-bold">
                <span>{designB.metrics.maxStressMPa} MPa</span>
                <span className={`text-[10px] ${stressDelta.isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                  ({stressDelta.pct}%)
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Estimated Cost:</span>
              <div className="flex items-center gap-1 font-bold">
                <span>${designB.metrics.costDollars.toLocaleString()}</span>
                <span className={`text-[10px] ${costDelta.isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                  ({costDelta.pct}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
