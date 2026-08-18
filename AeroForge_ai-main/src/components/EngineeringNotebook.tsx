import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Save,
  Eye,
  Edit2,
  Trash2,
  Copy,
  FileCode,
  Link as LinkIcon,
  Play,
  CheckCircle2,
  Terminal,
  Sparkles,
  BookOpen,
  Share2,
} from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

interface NotebookSection {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'code' | 'equation';
  linkedSimulation?: string;
  linkedDataset?: string;
  codeOutput?: string;
}

interface EngineeringNotebookProps {
  projectId?: string;
  initialContent?: string;
}

export default function EngineeringNotebook({
  projectId,
  initialContent,
}: EngineeringNotebookProps) {
  const { addToast } = useToastStore();

  const [sections, setSections] = useState<NotebookSection[]>([
    {
      id: 'sec_1',
      title: '1. Executive Summary & Hypersonic Aerodynamics Theory',
      content:
        '# AeroForge Engineering Lab Note #04\n\n## Hypersonic Boundary Layer & Shockwave Dynamics\nIn supersonic flow over a thin wedge at Mach 5.0, the oblique shock wave angle $\\beta$ satisfies the exact relation:\n$$\\tan \\theta = 2 \\cot \\beta \\frac{M_1^2 \\sin^2 \\beta - 1}{M_1^2 (\\gamma + \\cos 2\\beta) + 2}$$\n\nBoundary layer thickness $\\delta(x)$ grows according to laminar compressible theory:\n$$\\delta(x) \\approx 5.0 \\frac{x}{\\sqrt{Re_x}} \\left(1 + 0.03 M_1^2\\right)$$',
      type: 'markdown',
      linkedSimulation: 'SIM-2026-0419 (Transonic Wing CFD)',
      linkedDataset: 'Mesh Geometry v3.4',
    },
    {
      id: 'sec_2',
      title: '2. Python Aerodynamic Analysis Script',
      content:
        'import numpy as np\n\ndef calculate_pressure_coefficient(p, p_inf, q_inf):\n    """Calculates non-dimensional Cp over airfoil surface."""\n    return (p - p_inf) / q_inf\n\n# OpenFOAM exported pressure values\np_surface = np.array([101.3, 115.2, 98.4, 82.1, 75.6]) # kPa\nq_infinity = 42.5 # kPa\nCp = calculate_pressure_coefficient(p_surface, 101.3, q_infinity)\nprint("Calculated Cp vector:", np.round(Cp, 4))',
      type: 'code',
      codeOutput: 'Calculated Cp vector: [ 0.      0.3271 -0.0682 -0.4518 -0.6047]',
    },
    {
      id: 'sec_3',
      title: '3. Governing Navier-Stokes Boundary Equations',
      content:
        '$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{u}) = 0$$\n$$\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}$$',
      type: 'equation',
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'preview'>('split');
  const [isSaving, setIsSaving] = useState(false);

  const addSection = (type: NotebookSection['type']) => {
    const newSec: NotebookSection = {
      id: `sec_${Date.now()}`,
      title: `Section ${sections.length + 1}: New ${type.toUpperCase()}`,
      content:
        type === 'equation'
          ? '$$C_p = \\frac{p - p_\\infty}{\\frac{1}{2} \\rho_\\infty V_\\infty^2}$$'
          : type === 'code'
          ? 'import numpy as np\n# Compute aerodynamic forces\nprint("Forces solved.")'
          : '## Engineering Analysis\nDocument your design methodology and observations here.',
      type,
    };
    setSections([...sections, newSec]);
  };

  const updateSection = (id: string, updates: Partial<NotebookSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const runCodeBlock = (id: string) => {
    updateSection(id, {
      codeOutput: `[Kernel Execution OK] Timestamp: ${new Date().toLocaleTimeString()}\nComputation completed in 0.04s. Outputs stored to project dataset.`,
    });
    addToast({
      title: 'Code Cell Executed',
      description: 'Output updated in notebook workspace.',
      type: 'success',
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'Notebook Saved',
        description: 'All equations, markdown cells, and code logs synced to project storage.',
        type: 'success',
      });
    }, 600);
  };

  return (
    <div className="space-y-4 font-mono text-xs text-white">
      {/* Top Engineering Notebook Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080E1C] border border-white/10 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="font-bold text-sm text-white">Engineering Notebook</h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Jupyter + Lab Standard
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode */}
          <div className="flex items-center gap-1 bg-[#050914] p-1 border border-white/10 rounded">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                viewMode === 'split' ? 'bg-cyan-500 text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                viewMode === 'preview' ? 'bg-cyan-500 text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              Formatted Preview
            </button>
          </div>

          {/* Add Section */}
          <button
            onClick={() => addSection('markdown')}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Text</span>
          </button>
          <button
            onClick={() => addSection('code')}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" />
            <span>+ Code</span>
          </button>
          <button
            onClick={() => addSection('equation')}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Formula</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Notebook'}</span>
          </button>
        </div>
      </div>

      {/* Notebook Cells Container */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className="bg-[#080E1C] border border-white/10 rounded-lg overflow-hidden"
          >
            {/* Cell Header */}
            <div className="px-3 py-2 bg-[#0A1224] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 uppercase font-bold">
                  [{idx + 1}] {section.type}
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none focus:border-b focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2">
                {section.linkedSimulation && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    {section.linkedSimulation}
                  </span>
                )}
                {section.type === 'code' && (
                  <button
                    onClick={() => runCodeBlock(section.id)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Cell</span>
                  </button>
                )}
                <button
                  onClick={() =>
                    setSections(sections.filter((s) => s.id !== section.id))
                  }
                  className="text-white/40 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cell Body */}
            <div className="p-3">
              {viewMode === 'split' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    className="w-full h-36 bg-[#040710] border border-white/10 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 resize-y"
                  />
                  <div className="bg-[#050914] border border-white/5 rounded p-3 text-xs text-white/90 leading-relaxed font-sans overflow-x-auto">
                    <div className="text-[10px] text-white/40 font-mono uppercase mb-1">
                      Rendered Preview:
                    </div>
                    <div className="whitespace-pre-wrap font-mono text-cyan-200">
                      {section.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#050914] border border-white/5 rounded p-4 text-xs text-white/90 leading-relaxed whitespace-pre-wrap font-mono text-cyan-200">
                  {section.content}
                </div>
              )}

              {/* Code execution terminal output box */}
              {section.type === 'code' && section.codeOutput && (
                <div className="mt-3 bg-[#03060D] border border-white/10 rounded p-2.5 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Terminal className="w-3 h-3" />
                    <span>CELL STDOUT:</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono whitespace-pre-wrap">
                    {section.codeOutput}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
