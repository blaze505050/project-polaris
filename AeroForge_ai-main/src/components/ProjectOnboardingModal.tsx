import React, { useState } from 'react';
import {
  Sparkles,
  Wind,
  Plus,
  Upload,
  FolderOpen,
  Rocket,
  Layers,
  Thermometer,
  ArrowRight,
  X,
  Play,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/stores/toastStore';

interface ProjectOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemo?: () => void;
}

export default function ProjectOnboardingModal({
  isOpen,
  onClose,
  onLaunchDemo,
}: ProjectOnboardingModalProps) {
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const templates = [
    {
      title: 'Morphing Airfoil Aerodynamic Study',
      category: 'Aerodynamics & CFD',
      icon: Wind,
      desc: 'Compressible pressure coefficient, drag polar & shape optimization.',
    },
    {
      title: 'Hypersonic Re-entry Aerothermal Corridor',
      category: 'Thermal & Space',
      icon: Rocket,
      desc: 'Sutton-Graves heat flux prediction & non-equilibrium shock boundaries.',
    },
    {
      title: 'Wing Root Structural FEA Stress Analysis',
      category: 'Structures & FEA',
      icon: Layers,
      desc: 'CalculiX non-linear yield margin, buckling & mass optimization.',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono text-white">
      <div className="w-full max-w-2xl bg-[#080E1C] border border-cyan-500/30 rounded-xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                WELCOME TO AEROFORGE OS
              </h2>
            </div>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Choose an entry pathway to experience the unified engineering workspace.
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Entry Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pathway 1: Explore Guided Demo */}
          <button
            onClick={() => {
              onClose();
              if (onLaunchDemo) onLaunchDemo();
            }}
            className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-left space-y-2 transition-all group"
          >
            <div className="p-2 rounded-lg bg-cyan-500 text-black font-bold w-fit">
              <Play className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-cyan-300">5-Min Guided Demo</h3>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Step-by-step morphing airfoil CFD, optimization, notebook sync & report.
            </p>
            <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch Demo <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Pathway 2: Start From Scratch */}
          <button
            onClick={() => {
              onClose();
              navigate('/projects');
              addToast({
                title: 'New Project Creator Ready',
                description: 'Specify project title and target engineering requirements.',
                type: 'info',
              });
            }}
            className="p-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-left space-y-2 transition-all group"
          >
            <div className="p-2 rounded-lg bg-white/10 text-white font-bold w-fit">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">Start From Scratch</h3>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Initialize a clean engineering project workspace with empty requirements matrix.
            </p>
            <span className="text-[10px] text-white/70 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Create Blank Project <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Pathway 3: Import Existing Data */}
          <button
            onClick={() => {
              onClose();
              navigate('/projects/1?tab=datasets');
              addToast({
                title: 'Data Importer Active',
                description: 'Drag and drop STL, STEP, CSV, or OpenFOAM datasets.',
                type: 'info',
              });
            }}
            className="p-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-left space-y-2 transition-all group"
          >
            <div className="p-2 rounded-lg bg-white/10 text-white font-bold w-fit">
              <Upload className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-white">Import Existing Data</h3>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Import CSV telemetry, STL geometry, or OpenFOAM result files.
            </p>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Import Workspace <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* Pre-built Project Templates */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <span className="text-[10px] text-white/40 uppercase font-bold">
            PRE-BUILT ENGINEERING PROJECT TEMPLATES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templates.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    onClose();
                    navigate('/projects/1');
                    addToast({
                      title: `Template Loaded: ${tpl.title}`,
                      description: 'Pre-configured geometry and solver pipeline instantiated.',
                      type: 'success',
                    });
                  }}
                  className="p-3 rounded-lg border border-white/10 bg-[#050914] hover:border-cyan-500/30 text-left space-y-1 transition-all"
                >
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase">{tpl.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{tpl.title}</h4>
                  <p className="text-[10px] text-white/50 font-sans line-clamp-2">{tpl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
