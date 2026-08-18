import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FlaskConical,
  Copy,
  Trash2,
  Eye,
  X,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import FeatureStatusBadge from '@/components/ui/FeatureStatusBadge';

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  variables: string[];
  method: string;
  status: 'planned' | 'running' | 'completed' | 'failed';
  linkedSimulations: string[];
  createdAt: Date;
  notes: string;
}

interface ExperimentManagerProps {
  projectId?: string;
}

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-white/5 text-white/60 border-white/10',
  running: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  planned: Clock,
  running: FlaskConical,
  completed: CheckCircle2,
  failed: AlertTriangle,
};

export default function ExperimentManager({ projectId }: ExperimentManagerProps) {
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 'exp_1',
      name: 'Baseline Aerodynamic Performance',
      hypothesis: 'NACA 2412 achieves L/D > 14 at α=5° and Re=3×10⁶',
      variables: ['angle_of_attack', 'reynolds_number', 'airfoil_profile'],
      method: 'Parametric sweep of AoA from 0° to 15° at fixed Re',
      status: 'completed',
      linkedSimulations: ['sim_001'],
      createdAt: new Date(Date.now() - 86400000 * 3),
      notes: 'Max L/D of 15.2 achieved at α=6.5°. Exceeded target.',
    },
    {
      id: 'exp_2',
      name: 'Morphing Trailing Edge Optimization',
      hypothesis: 'Adaptive trailing edge deflection improves Cl by >12% in cruise',
      variables: ['deflection_angle', 'hinge_position', 'flap_chord_ratio'],
      method: 'DOE with 3-level factorial design, 27 combinations',
      status: 'running',
      linkedSimulations: ['sim_002', 'sim_003'],
      createdAt: new Date(Date.now() - 86400000),
      notes: 'Initial results show 8% improvement. Continuing optimization.',
    },
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  // New experiment form state
  const [newName, setNewName] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [newVariables, setNewVariables] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;

    const newExp: Experiment = {
      id: `exp_${Date.now()}`,
      name: newName,
      hypothesis: newHypothesis,
      variables: newVariables.split(',').map((v) => v.trim()).filter(Boolean),
      method: newMethod,
      status: 'planned',
      linkedSimulations: [],
      createdAt: new Date(),
      notes: '',
    };

    setExperiments([newExp, ...experiments]);
    setNewName('');
    setNewHypothesis('');
    setNewMethod('');
    setNewVariables('');
    setShowNewForm(false);
  };

  const handleDuplicate = (exp: Experiment) => {
    const dup: Experiment = {
      ...exp,
      id: `exp_${Date.now()}`,
      name: `${exp.name} (Copy)`,
      status: 'planned',
      linkedSimulations: [],
      createdAt: new Date(),
      notes: '',
    };
    setExperiments([dup, ...experiments]);
  };

  const handleDelete = (id: string) => {
    setExperiments(experiments.filter((e) => e.id !== id));
  };

  const selected = experiments.find((e) => e.id === selectedExperiment);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            EXPERIMENT TRACKER
          </h3>
          <FeatureStatusBadge status="beta" />
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 text-black rounded-lg font-mono font-bold text-[10px] hover:bg-cyan-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Experiment
        </button>
      </div>

      {/* New Experiment Form */}
      {showNewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[#080E1C] border border-cyan-500/30 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-cyan-400 font-mono">NEW EXPERIMENT</h4>
            <button onClick={() => setShowNewForm(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Experiment Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-mono"
            autoFocus
          />
          <textarea
            placeholder="Hypothesis — What do you expect to find?"
            value={newHypothesis}
            onChange={(e) => setNewHypothesis(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 resize-none font-sans"
          />
          <input
            type="text"
            placeholder="Variables (comma separated)"
            value={newVariables}
            onChange={(e) => setNewVariables(e.target.value)}
            className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <textarea
            placeholder="Method — How will you test the hypothesis?"
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-[#050914] border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 resize-none font-sans"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewForm(false)}
              className="flex-1 px-3 py-2 bg-[#050914] border border-white/15 text-white/60 rounded-lg font-mono text-xs font-bold hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="flex-1 px-3 py-2 bg-cyan-500 text-black rounded-lg font-mono text-xs font-bold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create Experiment
            </button>
          </div>
        </motion.div>
      )}

      {/* Experiment List */}
      <div className="space-y-2">
        {experiments.map((exp) => {
          const StatusIcon = STATUS_ICONS[exp.status];
          const isSelected = selectedExperiment === exp.id;

          return (
            <div
              key={exp.id}
              className={`bg-[#080E1C] border rounded-lg transition-colors ${
                isSelected ? 'border-cyan-500/40' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setSelectedExperiment(isSelected ? null : exp.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${
                      exp.status === 'completed' ? 'text-emerald-400' :
                      exp.status === 'running' ? 'text-cyan-400' :
                      exp.status === 'failed' ? 'text-red-400' : 'text-white/40'
                    }`} />
                    <h4 className="text-xs font-bold text-white font-mono">{exp.name}</h4>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${STATUS_STYLES[exp.status]}`}>
                    {exp.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-white/60 font-sans line-clamp-1">{exp.hypothesis}</p>
              </div>

              {/* Expanded Detail */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3"
                >
                  <div>
                    <span className="text-[9px] text-white/40 font-mono uppercase">HYPOTHESIS</span>
                    <p className="text-xs text-white/80 font-sans mt-0.5">{exp.hypothesis}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 font-mono uppercase">METHOD</span>
                    <p className="text-xs text-white/80 font-sans mt-0.5">{exp.method || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 font-mono uppercase">VARIABLES</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exp.variables.map((v) => (
                        <span key={v} className="text-[9px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-mono">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  {exp.notes && (
                    <div>
                      <span className="text-[9px] text-white/40 font-mono uppercase">NOTES</span>
                      <p className="text-xs text-white/70 font-sans mt-0.5">{exp.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDuplicate(exp)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#050914] border border-white/10 rounded text-[10px] text-white/60 hover:text-white font-mono transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#050914] border border-red-500/20 rounded text-[10px] text-red-400/60 hover:text-red-400 font-mono transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {experiments.length === 0 && (
          <div className="text-center py-8 bg-[#080E1C] border border-white/10 rounded-lg">
            <FlaskConical className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-xs text-white/50">No experiments yet</p>
            <p className="text-[10px] text-white/30 mt-1">Create your first experiment to track hypotheses and results</p>
          </div>
        )}
      </div>
    </div>
  );
}
