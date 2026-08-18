import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FolderOpen,
  Cpu,
  BookOpen,
  Microscope,
  Database,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Wind,
  Wrench,
  Rocket,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';
import { useUnitStore, UnitSystem } from '@/stores/unitStore';
import { useToastStore } from '@/stores/toastStore';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Tools' | 'Settings';
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { unitSystem, setUnitSystem } = useUnitStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Go to Command Center Dashboard',
      description: 'Overview of active projects, compute, and status',
      icon: FolderOpen,
      action: () => {
        navigate('/dashboard');
        setIsOpen(false);
      },
      keywords: ['dashboard', 'home', 'main', 'overview'],
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Open Projects Hub',
      description: 'Manage active engineering projects and workspaces',
      icon: FolderOpen,
      action: () => {
        navigate('/projects');
        setIsOpen(false);
      },
      keywords: ['projects', 'workspace', 'uav', 'wing'],
    },
    {
      id: 'nav-simulations',
      category: 'Navigation',
      title: 'Open Simulation Manager',
      description: 'Compute center, active jobs, and convergence logs',
      icon: Cpu,
      action: () => {
        navigate('/projects/1?tab=simulations');
        setIsOpen(false);
      },
      keywords: ['simulations', 'cfd', 'fea', 'openfoam', 'solver', 'jobs'],
    },
    {
      id: 'nav-aerolab',
      category: 'Navigation',
      title: 'Open Aerodynamics Laboratory',
      description: 'CFD wind tunnel, compressible flow & airfoil analysis',
      icon: Wind,
      action: () => {
        navigate('/labs/aerodynamics');
        setIsOpen(false);
      },
      keywords: ['aerodynamics', 'cfd', 'wind tunnel', 'mach', 'drag', 'lift'],
    },
    {
      id: 'nav-astrolab',
      category: 'Navigation',
      title: 'Open AstroLab Suite',
      description: 'Orbital mechanics, photometry, exoplanet discovery',
      icon: Globe,
      action: () => {
        navigate('/astrolab');
        setIsOpen(false);
      },
      keywords: ['astrolab', 'space', 'orbit', 'astronomy', 'satellites'],
    },
    {
      id: 'nav-flagship-workflow',
      category: 'Navigation',
      title: 'Open Aerodynamic Research Workflow',
      description: 'Guided 8-step aerodynamic design, analysis & optimization workflow',
      icon: Cpu,
      action: () => {
        navigate('/flagship-workflow');
        setIsOpen(false);
      },
      keywords: ['workflow', 'flagship', 'airfoil', 'aerodynamics', 'optimization', 'guided'],
    },
    {
      id: 'nav-validation',
      category: 'Navigation',
      title: 'Open Validation Center',
      description: 'Physics benchmark comparisons against published experimental data',
      icon: Microscope,
      action: () => {
        navigate('/validation');
        setIsOpen(false);
      },
      keywords: ['validation', 'benchmark', 'accuracy', 'credibility', 'naca 0012', 'isa'],
    },
    {
      id: 'nav-trust',
      category: 'Navigation',
      title: 'Open Trust & Security Center',
      description: 'Data privacy practices, AI context boundaries & disclaimers',
      icon: Compass,
      action: () => {
        navigate('/trust');
        setIsOpen(false);
      },
      keywords: ['trust', 'security', 'privacy', 'disclaimer', 'ai privacy'],
    },
    {
      id: 'nav-mechlab',
      category: 'Navigation',
      title: 'Open MechLab Suite',
      description: 'Structural FEA, kinematics & material stress analysis',
      icon: Wrench,
      action: () => {
        navigate('/mechlab');
        setIsOpen(false);
      },
      keywords: ['mechlab', 'fea', 'structures', 'stress', 'von mises'],
    },
    {
      id: 'action-new-sim',
      category: 'Actions',
      title: 'Create New Simulation',
      description: 'Launch a new CFD, FEA, or Thermal solver job',
      icon: Zap,
      action: () => {
        navigate('/projects/1?tab=simulations');
        addToast({
          title: 'Simulation Launcher Ready',
          description: 'Specify mesh and solver parameters to queue job.',
          type: 'info',
        });
        setIsOpen(false);
      },
      keywords: ['new simulation', 'run', 'launch', 'cfd', 'solve'],
    },
    {
      id: 'action-new-notebook',
      category: 'Actions',
      title: 'Open Engineering Notebook',
      description: 'Jupyter-style markdown, LaTeX & code logbook',
      icon: BookOpen,
      action: () => {
        navigate('/projects/1?tab=notebook');
        setIsOpen(false);
      },
      keywords: ['notebook', 'notes', 'equations', 'latex', 'python', 'journal'],
    },
    {
      id: 'unit-si',
      category: 'Settings',
      title: 'Set Unit System to SI (m, Pa, K, N, kg)',
      description: `Current unit system is ${unitSystem}`,
      icon: Sliders,
      action: () => {
        setUnitSystem('SI');
        addToast({
          title: 'Units Standardized: SI',
          description: 'All values updated to SI metric standards.',
          type: 'success',
        });
        setIsOpen(false);
      },
      keywords: ['si', 'units', 'pascal', 'kelvin', 'meters'],
    },
    {
      id: 'unit-imperial',
      category: 'Settings',
      title: 'Set Unit System to Imperial (ft, psi, °F, lbf, lb)',
      description: `Current unit system is ${unitSystem}`,
      icon: Sliders,
      action: () => {
        setUnitSystem('Imperial');
        addToast({
          title: 'Units Standardized: Imperial',
          description: 'All values updated to Imperial units.',
          type: 'info',
        });
        setIsOpen(false);
      },
      keywords: ['imperial', 'units', 'psi', 'fahrenheit', 'feet', 'lbs'],
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = cmd.title.toLowerCase().includes(q);
    const descMatch = cmd.description.toLowerCase().includes(q);
    const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(q));
    return titleMatch || descMatch || keywordMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div
        className="w-full max-w-2xl bg-[#080E1C] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/10 bg-[#0A1224]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command, search projects, tools, or change units (⌘K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/50 border border-white/10">
            ESC
          </span>
        </div>

        {/* Command List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 divide-y divide-white/5">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-white/40">
              No matching commands or resources found for "{query}"
            </div>
          ) : (
            (['Navigation', 'Actions', 'Tools', 'Settings'] as const).map(
              (cat) => {
                const catCommands = filteredCommands.filter(
                  (c) => c.category === cat
                );
                if (catCommands.length === 0) return null;

                return (
                  <div key={cat} className="pt-2 first:pt-0">
                    <div className="px-3 py-1 text-[10px] font-mono font-semibold tracking-wider text-cyan-400/70 uppercase">
                      {cat}
                    </div>
                    <div className="mt-1 space-y-1">
                      {catCommands.map((cmd) => {
                        const Icon = cmd.icon;
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-cyan-500/10 hover:border hover:border-cyan-500/30 text-left group transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-1.5 rounded-md bg-white/5 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <span className="block text-xs font-semibold text-white/90 group-hover:text-cyan-300">
                                  {cmd.title}
                                </span>
                                <span className="block text-[10px] text-white/40 truncate">
                                  {cmd.description}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>

        {/* Footer shortcuts tip */}
        <div className="px-4 py-2 bg-[#060B16] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
          <span>AeroForge Command Palette</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
