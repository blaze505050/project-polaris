import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CorePhilosophy, ArchitecturePrinciples, AntiGoals } from '@/entities';
import { Code2, CheckCircle2, AlertTriangle, Server, Database, Lock, ArrowRight, Check, X, Download, Copy, AlertCircle } from 'lucide-react';

import { freeResearchService, ResearchPaper } from '@/services/freeResearchService';
import { Search, BookOpen, ExternalLink, FileText, Quote, Sparkles } from 'lucide-react';

export default function DocumentationPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'architecture' | 'solvers' | 'api' | 'research' | 'roadmaps' | 'dsl' | 'results' | 'manual'>('architecture');
  const [philosophies, setPhilosophies] = useState<CorePhilosophy[]>([]);
  const [principles, setPrinciples] = useState<ArchitecturePrinciples[]>([]);
  const [antiGoals, setAntiGoals] = useState<AntiGoals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Global Docs Search State
  const [docSearch, setDocSearch] = useState('');

  // Research Hub State
  const [searchQuery, setSearchQuery] = useState('aerodynamics NACA airfoil');
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [copiedCite, setCopiedCite] = useState<'bibtex' | 'ieee' | 'apa' | null>(null);

  const { result, isValid, errors: passedErrors, warnings } = location.state || { 
    result: null, 
    isValid: false, 
    errors: [], 
    warnings: []
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [philoResult, principlesResult, antiGoalsResult] = await Promise.all([
        BaseCrudService.getAll<CorePhilosophy>('corephilosophy'),
        BaseCrudService.getAll<ArchitecturePrinciples>('architectureprinciples'),
        BaseCrudService.getAll<AntiGoals>('antigoals'),
      ]);

      const sortedPhilosophies = [...philoResult.items].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );

      setPhilosophies(sortedPhilosophies);
      setPrinciples(principlesResult.items);
      setAntiGoals(antiGoalsResult.items);
    } catch (error) {
      console.error('Failed to load architecture data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const jsonString = result ? JSON.stringify(result, null, 2) : '';
  const errors = passedErrors || (result?.errors) || (result?.error ? [result.error] : []);

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeroforge-dsl-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        {/* Minimalist Top Header & Search */}
        <section className="w-full bg-[#050A16] border-b border-white/10 py-8 px-[6%]">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block mb-2">
                  AEROFORGE DOCUMENTATION HUB
                </span>
                <h1 className="font-heading text-3xl font-extrabold text-white">Engineering & API Technical Reference</h1>
              </div>

              {/* Minimalist Search Bar */}
              <div className="relative w-full sm:w-80 font-mono">
                <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Search solvers, equations, APIs..."
                  className="w-full bg-[#0A1020] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* 4 Minimalist Tabs */}
            <div className="flex gap-2 pt-2 overflow-x-auto border-t border-white/5">
              {[
                { id: 'architecture', label: '1. Architecture & Real-World Problem' },
                { id: 'solvers', label: '2. Engineering Solver Manual' },
                { id: 'api', label: '3. API & Neural Operators' },
                { id: 'research', label: '4. Research & Benchmarks' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Complete Engineering Solver Manual Tab */}
          {(activeTab === 'solvers' || activeTab === 'manual') && (
            <motion.section
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-12 font-mono text-white"
            >
              <div className="max-w-5xl space-y-10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block mb-2">
                    PRODUCTION REFERENCE MANUAL & API SPECIFICATION
                  </span>
                  <h1 className="font-heading text-4xl font-bold text-white">AeroForge AI Engineering Manual</h1>
                  <p className="font-sans text-sm text-white/60 mt-1">
                    Exhaustive reference manual detailing physics governing equations, solver taxonomies, REST API endpoints, and Physics AI neural operator models.
                  </p>
                </div>

                {/* Manual Section 1: AeroLab Aerodynamics */}
                <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h2 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                      <Code2 className="w-5 h-5" />
                      1. AeroLab Aerodynamics Solvers
                    </h2>
                    <Link to="/aerolab" className="text-xs text-cyan-300 hover:underline flex items-center gap-1 font-bold">
                      <span>Launch AeroLab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-white/70">
                    <div className="bg-[#050914] p-4 rounded-lg border border-white/5 space-y-2 font-mono">
                      <span className="text-cyan-300 font-bold block text-sm">1.1 Thin Airfoil Theory Solver</span>
                      <p className="text-white/60 text-xs font-sans">
                        Calculates linear lift coefficient, pitching moment, and zero-lift angle of attack for thin 2D section profiles under subcritical flow.
                      </p>
                      <div className="bg-[#02050C] p-3 rounded border border-white/10 text-emerald-400 text-xs font-mono">
                        C_L = 2 * pi * (alpha - alpha_0)
                      </div>
                      <p className="text-[11px] text-white/40 font-sans">Assumptions: Incompressible, inviscid flow, t/c &lt; 0.12, small alpha &lt; 12 deg.</p>
                    </div>

                    <div className="bg-[#050914] p-4 rounded-lg border border-white/5 space-y-2 font-mono">
                      <span className="text-cyan-300 font-bold block text-sm">1.2 Prandtl-Glauert Compressibility Correction</span>
                      <p className="text-white/60 text-xs font-sans">
                        Applies linearized subsonic Mach number scaling to static pressure coefficients.
                      </p>
                      <div className="bg-[#02050C] p-3 rounded border border-white/10 text-emerald-400 text-xs font-mono">
                        C_p = C_p0 / sqrt(1 - Mach^2)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Section 2: MechLab Structural Mechanics */}
                <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      2. MechLab Structural Mechanics Solvers
                    </h2>
                    <Link to="/mechlab" className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-bold">
                      <span>Launch MechLab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-white/70">
                    <div className="bg-[#050914] p-4 rounded-lg border border-white/5 space-y-2 font-mono">
                      <span className="text-amber-300 font-bold block text-sm">2.1 Euler-Bernoulli Beam Bending Solver</span>
                      <p className="text-white/60 text-xs font-sans">
                        Calculates maximum deflection and von Mises bending stress for cantilevered and simply supported engineering beams.
                      </p>
                      <div className="bg-[#02050C] p-3 rounded border border-white/10 text-amber-300 text-xs font-mono">
                        deflection_max = (F * L^3) / (3 * E * I)  |  sigma = (M * y) / I
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Section 3: AstroLab Space Systems */}
                <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h2 className="text-base font-bold text-purple-400 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      3. AstroLab Space Systems Solvers
                    </h2>
                    <Link to="/astrolab" className="text-xs text-purple-300 hover:underline flex items-center gap-1 font-bold">
                      <span>Launch AstroLab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-white/70">
                    <div className="bg-[#050914] p-4 rounded-lg border border-white/5 space-y-2 font-mono">
                      <span className="text-purple-300 font-bold block text-sm">3.1 Vis-Viva Orbital Velocity & Escape Solver</span>
                      <p className="text-white/60 text-xs font-sans">
                        Solves 2-body Keplerian orbital velocities, period, and parabolic escape velocity.
                      </p>
                      <div className="bg-[#02050C] p-3 rounded border border-white/10 text-purple-300 text-xs font-mono">
                        v = sqrt(mu * (2/r - 1/a))  |  v_esc = sqrt(2 * mu / r)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <motion.section
              key="architecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                <h1 className="font-heading text-4xl text-foreground mb-3">How It Works</h1>
                <p className="font-paragraph text-lg text-foreground/70 mb-12">
                  Understanding the core architecture and design principles.
                </p>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/60">Loading architecture data...</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Core Philosophy */}
                    {philosophies.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Core Philosophy</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {philosophies.map((philo) => (
                            <div key={philo._id} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                              <h3 className="font-heading text-lg font-bold text-accent mb-2">
                                {philo.philosophyTitle}
                              </h3>
                              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                                {philo.description}
                              </p>
                              {philo.emphasisKeyword && (
                                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-mono rounded">
                                  {philo.emphasisKeyword}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Architecture Principles */}
                    {principles.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Architecture Principles</h2>
                        <div className="space-y-4">
                          {principles.map((principle) => (
                            <div key={principle._id} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                              <h3 className="font-heading text-lg font-bold text-accent mb-2">
                                {principle.principleTitle}
                              </h3>
                              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                                {principle.detailedExplanation}
                              </p>
                              {principle.analogyUsed && (
                                <div className="mt-3 p-3 bg-secondary/10 rounded border border-secondary/20">
                                  <p className="font-mono text-xs text-foreground/60 mb-1">Analogy:</p>
                                  <p className="font-paragraph text-sm text-foreground/80">{principle.analogyUsed}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Anti-Goals */}
                    {antiGoals.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Anti-Goals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {antiGoals.map((goal) => (
                            <div key={goal._id} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                                {goal.statement}
                              </h3>
                              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                                {goal.rationale}
                              </p>
                              {goal.consequence && (
                                <div className="mt-3 p-3 bg-secondary/10 rounded">
                                  <p className="font-mono text-xs text-foreground/60 mb-1">Consequence:</p>
                                  <p className="font-paragraph text-sm text-foreground/80">{goal.consequence}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Roadmaps Tab */}
          {activeTab === 'roadmaps' && (
            <motion.section
              key="roadmaps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20 font-mono text-white"
            >
              <div className="max-w-5xl space-y-12">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                    TECHNICAL SPECIFICATION & HARDENING ROADMAPS
                  </span>
                  <h1 className="font-heading text-4xl text-white mt-2 font-bold">System Migration & Solver Adapters</h1>
                  <p className="font-sans text-sm text-white/60 mt-1">
                    Architectural specifications for Data Persistence migration (Zustand → PostgreSQL) and Real External Physics Solvers (XFOIL, OpenFOAM, SU2).
                  </p>
                </div>

                {/* Section 1: Data Persistence Roadmap */}
                <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Database className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h2 className="text-lg font-bold text-white">1. Data Persistence Migration Roadmap</h2>
                      <p className="text-xs text-white/50 font-sans">Transition path from Local-First Zustand + localStorage to Cloud Multi-Tenant Architecture.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#060B18] p-4 rounded-lg border border-cyan-500/30 space-y-2">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase">PHASE 1: CURRENT STATE</span>
                      <h3 className="font-bold text-white text-sm">Zustand + localStorage</h3>
                      <p className="text-white/60 font-sans leading-relaxed">
                        Local browser storage. Fast zero-latency offline performance. Limited to 5MB quota per origin. Single user sandbox.
                      </p>
                    </div>

                    <div className="bg-[#060B18] p-4 rounded-lg border border-amber-500/30 space-y-2">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">PHASE 2: AUTH & DB</span>
                      <h3 className="font-bold text-white text-sm">Supabase / PostgreSQL</h3>
                      <p className="text-white/60 font-sans leading-relaxed">
                        User authentication via OAuth 2.0. Relational schema for Projects, Experiments, Notebooks, and Digital Thread provenance logs.
                      </p>
                    </div>

                    <div className="bg-[#060B18] p-4 rounded-lg border border-emerald-500/30 space-y-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">PHASE 3: OBJECT & REALTIME</span>
                      <h3 className="font-bold text-white text-sm">S3 / Cloud Storage + WS</h3>
                      <p className="text-white/60 font-sans leading-relaxed">
                        Blob storage for binary STL/CAD geometries, large CFD mesh files, and result plots. Realtime WebSocket sync for team collaboration.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#060B18] p-4 rounded-lg border border-white/5 space-y-2 font-mono text-xs">
                    <span className="text-[10px] text-white/40 uppercase font-bold">EXACT DATABASE SCHEMA SPECIFICATION</span>
                    <pre className="text-[11px] text-cyan-300 bg-black/40 p-3 rounded overflow-x-auto">
{`-- SQL Schema Target for AeroForge Cloud
CREATE TABLE users (id UUID PRIMARY KEY, email TEXT UNIQUE, role TEXT);
CREATE TABLE projects (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), name TEXT, metadata JSONB);
CREATE TABLE experiments (id UUID PRIMARY KEY, project_id UUID REFERENCES projects(id), module TEXT, parameters JSONB, results JSONB);
CREATE TABLE digital_thread (id UUID PRIMARY KEY, experiment_id UUID REFERENCES experiments(id), hash TEXT, provenance_data JSONB);`}
                    </pre>
                  </div>
                </div>

                {/* Section 2: Real Solver Roadmap */}
                <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Server className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h2 className="text-lg font-bold text-white">2. Real SolverAdapter Architecture Roadmap</h2>
                      <p className="text-xs text-white/50 font-sans">Integration roadmap for external viscous, high-fidelity CFD, and FEA solvers.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: 'AeroForge Subsonic Thin-Airfoil Solver',
                        id: 'reduced-order-airfoil',
                        status: 'Available now',
                        fidelity: 'Reduced-order',
                        desc: '2D thin airfoil theory with Prandtl-Glauert compressibility correction. Executes directly inside client JavaScript engine with zero latency.',
                        tech: 'TypeScript / Canvas / In-browser JS',
                      },
                      {
                        name: 'XFOIL Viscous Boundary Layer Solver',
                        id: 'xfoil-wasm-adapter',
                        status: 'Prototype',
                        fidelity: 'Reduced-order (Viscous)',
                        desc: 'Full Mark Drela XFOIL boundary layer solver compiled to WebAssembly (WASM). Computes viscous drag polar curves & transition locations.',
                        tech: 'C/Fortran -> Emscripten WebAssembly (WASM)',
                      },
                      {
                        name: 'OpenFOAM RANS CFD Cloud Solver',
                        id: 'openfoam-cloud-adapter',
                        status: 'Planned',
                        fidelity: 'High-fidelity CFD',
                        desc: 'Full 3D incompressible/compressible Navier-Stokes solver cluster gateway. Dispatches OpenFOAM case files to cloud HPC nodes.',
                        tech: 'Docker / MPI / AWS EC2 Compute / WebSockets',
                      },
                      {
                        name: 'SU2 Compressible/Hypersonic Solver',
                        id: 'su2-cloud-adapter',
                        status: 'Planned',
                        fidelity: 'High-fidelity Aerothermal',
                        desc: 'Stanford University Unstructured (SU2) open-source multiphysics solver for supersonic/hypersonic aerothermal flow fields.',
                        tech: 'C++ SU2 Core / Slurm HPC Adapter / S3 Artifacts',
                      },
                    ].map((solver) => (
                      <div key={solver.id} className="p-4 bg-[#060B18] rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">{solver.name}</h3>
                            <span className="text-[10px] text-white/40 font-mono">({solver.id})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                              {solver.fidelity}
                            </span>
                            <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded border ${
                              solver.status === 'Available now'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : solver.status === 'Prototype'
                                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}>
                              {solver.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-white/60 font-sans leading-relaxed">{solver.desc}</p>
                        <div className="text-[10px] text-cyan-400/80 font-mono">Technology Stack: {solver.tech}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* DSL Docs Tab */}
          {activeTab === 'dsl' && (
            <motion.section
              key="dsl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-accent" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                      Language Reference
                    </span>
                  </div>
                  <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                    Design Language Specification
                  </h1>
                  <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
                    Complete reference for the AeroForge design language. Deterministic, versioned, and fully validated.
                  </p>
                </div>

                <div className="mb-16">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-8">Core Principles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Explicit Units',
                        desc: 'Every dimension carries its unit. No implicit conversions.',
                      },
                      {
                        title: 'Deterministic Ordering',
                        desc: 'Features execute in strict sequence. No parallel or implicit dependencies.',
                      },
                      {
                        title: 'Named Features',
                        desc: 'Every feature has a unique ID and human-readable name for traceability.',
                      },
                      {
                        title: 'No Implicit Geometry',
                        desc: 'All geometry is explicit. No auto-repair or heuristic inference.',
                      },
                    ].map((principle, idx) => (
                      <div key={idx} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                        <h3 className="font-heading text-lg font-bold text-accent mb-2">{principle.title}</h3>
                        <p className="font-paragraph text-sm text-foreground/70">{principle.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-16">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-8">Language Features</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Sketches', desc: 'Define 2D profiles with explicit constraints' },
                      { name: 'Features', desc: 'Parametric operations (Pad, Pocket, Hole, etc.)' },
                      { name: 'Assemblies', desc: 'Combine parts with defined relationships' },
                      { name: 'Constraints', desc: 'Geometric and dimensional constraints' },
                    ].map((feature, idx) => (
                      <div key={idx} className="p-4 bg-primary border border-secondary/20 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-heading font-bold text-foreground">{feature.name}</h3>
                          <p className="font-paragraph text-sm text-foreground/70">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* API Reference Tab */}
          {activeTab === 'api' && (
            <motion.section
              key="api"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-accent" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                      REST API Specification
                    </span>
                  </div>
                  <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                    API Reference
                  </h1>
                  <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
                    Complete API documentation for design compilation and integration.
                  </p>
                </div>

                <div className="mb-12 p-6 border border-accent/20 bg-accent/5 rounded">
                  <div className="flex gap-3">
                    <Server className="w-6 h-6 text-accent shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-lg text-primary mb-2">API Specification Defined</h3>
                      <p className="font-paragraph text-base text-foreground/80">
                        The following API contract is defined for backend implementation. Execution backend runs locally or in private infrastructure. No public endpoints are currently available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-6">Base URL</h2>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-sm">
                    <code className="text-foreground">https://api.aeroforge.local/v1</code>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70 mt-3">
                    Private infrastructure. Authentication via API key in Authorization header.
                  </p>
                </div>

                <div className="mb-12">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-6">Endpoints</h2>
                  <div className="space-y-6">
                    {[
                      {
                        method: 'POST',
                        path: '/compile',
                        desc: 'Compile design from DSL input',
                        params: 'input (string), units (mm|cm|in|ft)',
                      },
                      {
                        method: 'GET',
                        path: '/validate/:designId',
                        desc: 'Validate compiled design',
                        params: 'designId (string)',
                      },
                      {
                        method: 'POST',
                        path: '/export',
                        desc: 'Export design to CAD format',
                        params: 'designId (string), format (step|iges|stl)',
                      },
                    ].map((endpoint, idx) => (
                      <div key={idx} className="p-6 bg-primary border border-secondary/20 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded font-mono text-xs font-bold ${
                            endpoint.method === 'POST' ? 'bg-accent/20 text-accent' : 'bg-aerospace-success/20 text-aerospace-success'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="font-mono text-sm text-foreground">{endpoint.path}</code>
                        </div>
                        <p className="font-paragraph text-sm text-foreground/70 mb-3">{endpoint.desc}</p>
                        <p className="font-mono text-xs text-foreground/60">Parameters: {endpoint.params}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-20"
            >
              <div className="max-w-5xl">
                {!result ? (
                  <div className="text-center py-12">
                    <p className="font-paragraph text-base text-foreground mb-6">No compilation results available.</p>
                    <Link 
                      to="/tools"
                      className="inline-block bg-accent text-accent-foreground font-paragraph text-base font-semibold px-6 py-3 rounded transition-colors duration-200 hover:opacity-90"
                    >
                      Go to Tools
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Status */}
                    <div className={`p-6 rounded-lg border ${
                      isValid 
                        ? 'bg-aerospace-success/10 border-aerospace-success/30' 
                        : 'bg-aerospace-danger/10 border-aerospace-danger/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        {isValid ? (
                          <CheckCircle2 className="w-6 h-6 text-aerospace-success" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-aerospace-danger" />
                        )}
                        <div>
                          <h3 className="font-heading font-bold text-foreground">
                            {isValid ? 'Compilation Successful' : 'Compilation Failed'}
                          </h3>
                          <p className="font-paragraph text-sm text-foreground/70">
                            {isValid ? 'Design compiled without errors' : `${errors.length} error(s) found`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Errors</h3>
                        <div className="space-y-2">
                          {errors.map((error, idx) => (
                            <div key={idx} className="p-4 bg-aerospace-danger/10 border border-aerospace-danger/30 rounded-lg flex items-start gap-3">
                              <X className="w-5 h-5 text-aerospace-danger flex-shrink-0 mt-0.5" />
                              <p className="font-paragraph text-sm text-foreground/80">{error}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {warnings && warnings.length > 0 && (
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-4">Warnings</h3>
                        <div className="space-y-2">
                          {warnings.map((warning, idx) => (
                            <div key={idx} className="p-4 bg-aerospace-warning/10 border border-aerospace-warning/30 rounded-lg flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-aerospace-warning flex-shrink-0 mt-0.5" />
                              <p className="font-paragraph text-sm text-foreground/80">{warning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* JSON Output */}
                    {result && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-lg font-bold text-foreground">Compiled Result</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCopy}
                              className="px-3 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded transition-colors flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                              onClick={handleDownload}
                              className="px-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                        <pre className="bg-json-background p-4 rounded border border-secondary/20 overflow-x-auto text-sm text-foreground font-mono max-h-96">
                          {jsonString}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Research Discovery Tab */}
          {activeTab === 'research' && (
            <motion.section
              key="research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[120rem] mx-auto px-[8%] py-12"
            >
              <div className="max-w-5xl space-y-6">
                <div>
                  <h1 className="font-heading text-3xl text-foreground mb-2">Zero-Cost Research Discovery Layer</h1>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Search peer-reviewed literature across public <strong>arXiv</strong> and <strong>OpenAlex</strong> REST APIs with instant BibTeX, IEEE, and APA citation generation.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsSearching(true);
                          freeResearchService.searchResearch(searchQuery).then((res) => {
                            setPapers(res);
                            setIsSearching(false);
                          });
                        }
                      }}
                      placeholder="Search aerospace, CFD, orbits, materials..."
                      className="w-full bg-[#050A16] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsSearching(true);
                      freeResearchService.searchResearch(searchQuery).then((res) => {
                        setPapers(res);
                        setIsSearching(false);
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all flex items-center gap-2"
                  >
                    {isSearching ? 'Searching APIs...' : 'Search'}
                  </button>
                </div>

                {/* Papers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(papers.length > 0 ? papers : [
                    {
                      id: 'paper-abbott',
                      title: 'Theory of Wing Sections: Summary of Airfoil Data',
                      authors: ['I. H. Abbott', 'A. E. von Doenhoff'],
                      year: 1959,
                      doi: '10.1015/dover.0486605861',
                      journal: 'NACA Technical Reports',
                      abstract: 'Comprehensive experimental and theoretical summary of NACA airfoils.',
                      source: 'AeroForge Benchmark Archive' as const,
                      citationsCount: 14200
                    },
                    {
                      id: 'paper-tsiolkovsky',
                      title: 'Exploration of Outer Space by Means of Rocket Devices',
                      authors: ['K. E. Tsiolkovsky'],
                      year: 1903,
                      journal: 'Nauchnoe Obozrenie',
                      abstract: 'Derivation of the ideal rocket equation relating delta-v to mass ratio.',
                      source: 'AeroForge Benchmark Archive' as const,
                      citationsCount: 8900
                    }
                  ]).map((paper) => (
                    <div key={paper.id} className="p-4 bg-[#080E1C] border border-white/10 rounded-xl space-y-3 font-mono">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {paper.source}
                        </span>
                        <span className="text-[10px] text-white/40">{paper.year}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-2">{paper.title}</h3>
                      <p className="text-[11px] text-white/60 font-sans">{paper.authors.join(', ')}</p>
                      <p className="text-[11px] text-white/40 font-sans line-clamp-2">{paper.abstract}</p>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[10px]">
                        <button
                          onClick={() => {
                            const bib = freeResearchService.generateBibTeX(paper);
                            navigator.clipboard.writeText(bib);
                            setCopiedCite('bibtex');
                            setTimeout(() => setCopiedCite(null), 2000);
                          }}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-cyan-400 border border-cyan-500/20"
                        >
                          {copiedCite === 'bibtex' ? 'BibTeX Copied!' : 'Copy BibTeX'}
                        </button>
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/40 hover:text-white flex items-center gap-1 ml-auto"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
