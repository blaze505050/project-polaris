import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Code2, Database, Lightbulb, Award, TrendingUp, Brain, Wind, Users, Microscope,
  Cloud, Gauge, Workflow, Lock, Globe, BarChart3, GitBranch, Target, ArrowRight,
  Cpu, Rocket, Sparkles, Layers, ShieldCheck, CheckCircle2, Terminal, Flame,
  Radio, Compass, Hexagon, Wand2, Sigma, Infinity, Beaker, Radar, Satellite,
  Zap as Lightning, Droplet, Thermometer, Waves, Crosshair, Sliders, Download, X, ExternalLink, AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { CFDDatasets, Simulations } from '@/entities';

interface AdvancedTool {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'Expert' | 'Advanced';
  features: string[];
  icon: any;
  color: string;
  applications: string[];
  performanceMetrics?: {
    speed: number;
    accuracy: number;
    scalability: number;
  };
  requirements?: string[];
}

const ADVANCED_TOOLS: AdvancedTool[] = [
  {
    id: 'cfd-solver',
    name: 'Advanced CFD Solver',
    category: 'Computational Fluid Dynamics',
    description: 'High-fidelity computational fluid dynamics with turbulence modeling, multiphase flow, and real-time visualization for aerospace applications.',
    difficulty: 'Expert',
    features: [
      'RANS/LES Turbulence Models',
      'Multiphase Flow Simulation',
      'Real-time Convergence Monitoring',
      'Parallel Processing (GPU/CPU)',
      'Mesh Adaptation',
      'Post-processing Suite'
    ],
    icon: Wind,
    color: 'from-blue-500 to-cyan-500',
    applications: [
      'Aircraft aerodynamics',
      'Engine inlet design',
      'Hypersonic flow analysis',
      'Thermal management'
    ],
    performanceMetrics: {
      speed: 95,
      accuracy: 98,
      scalability: 96
    },
    requirements: ['GPU acceleration recommended', 'Min 16GB RAM', 'CUDA 11.0+']
  },
  {
    id: 'structural-fem',
    name: 'Structural FEM Suite',
    category: 'Finite Element Analysis',
    description: 'Enterprise-grade finite element analysis with nonlinear dynamics, composite materials, and fatigue analysis for aerospace structures.',
    difficulty: 'Expert',
    features: [
      'Nonlinear Dynamics',
      'Composite Material Library',
      'Fatigue & Damage Analysis',
      'Multi-body Dynamics',
      'Optimization Framework',
      'Automated Meshing'
    ],
    icon: Layers,
    color: 'from-purple-500 to-pink-500',
    applications: [
      'Wing structure optimization',
      'Fuselage stress analysis',
      'Landing gear design',
      'Composite panel analysis'
    ],
    performanceMetrics: {
      speed: 92,
      accuracy: 99,
      scalability: 94
    },
    requirements: ['Min 32GB RAM', 'Multi-core processor', 'SSD storage']
  },
  {
    id: 'propulsion-design',
    name: 'Propulsion System Designer',
    category: 'Engine & Propulsion',
    description: 'Integrated turbomachinery design tool with thermodynamic cycle analysis, blade design, and performance prediction.',
    difficulty: 'Expert',
    features: [
      'Thermodynamic Cycle Analysis',
      'Blade Design & Optimization',
      'Performance Maps',
      'Compressor/Turbine Modeling',
      'Combustor Analysis',
      'Noise Prediction'
    ],
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
    applications: [
      'Jet engine design',
      'Turboprop optimization',
      'Hypersonic propulsion',
      'Electric motor design'
    ],
    performanceMetrics: {
      speed: 88,
      accuracy: 97,
      scalability: 90
    },
    requirements: ['Thermodynamic database', 'Min 24GB RAM', 'GPU optional']
  },
  {
    id: 'controls-sim',
    name: 'Flight Control Simulator',
    category: 'Control Systems',
    description: 'Real-time flight dynamics simulation with control law development, stability analysis, and hardware-in-the-loop testing.',
    difficulty: 'Expert',
    features: [
      '6-DOF Flight Dynamics',
      'Control Law Development',
      'Stability Analysis',
      'Hardware-in-Loop Support',
      'Real-time Visualization',
      'Autopilot Design Tools'
    ],
    icon: Compass,
    color: 'from-green-500 to-emerald-500',
    applications: [
      'Aircraft autopilot design',
      'Stability augmentation',
      'Flight envelope protection',
      'Autonomous flight systems'
    ],
    performanceMetrics: {
      speed: 99,
      accuracy: 96,
      scalability: 92
    },
    requirements: ['Real-time OS support', 'Min 16GB RAM', 'Network interface']
  },
  {
    id: 'materials-ai',
    name: 'AI Materials Analyzer',
    category: 'Materials Science',
    description: 'Machine learning-powered materials selection and property prediction for aerospace applications with database of 50,000+ materials.',
    difficulty: 'Advanced',
    features: [
      'Material Property Prediction',
      'Composition Optimization',
      'Failure Mode Analysis',
      'Temperature Effects',
      'Cost Optimization',
      'Sustainability Scoring'
    ],
    icon: Beaker,
    color: 'from-indigo-500 to-blue-500',
    applications: [
      'Composite material selection',
      'Alloy optimization',
      'Thermal protection systems',
      'Lightweight design'
    ],
    performanceMetrics: {
      speed: 94,
      accuracy: 93,
      scalability: 95
    },
    requirements: ['ML framework installed', 'Min 8GB RAM', 'Material database']
  },
  {
    id: 'trajectory-opt',
    name: 'Trajectory Optimization Engine',
    category: 'Mission Planning',
    description: 'Advanced trajectory optimization with fuel efficiency, obstacle avoidance, and multi-objective optimization for flight paths.',
    difficulty: 'Expert',
    features: [
      'Multi-objective Optimization',
      'Fuel Efficiency Analysis',
      'Obstacle Avoidance',
      'Weather Integration',
      'Real-time Replanning',
      'Constraint Handling'
    ],
    icon: Satellite,
    color: 'from-yellow-500 to-orange-500',
    applications: [
      'Flight path planning',
      'Fuel optimization',
      'Autonomous navigation',
      'Drone mission planning'
    ],
    performanceMetrics: {
      speed: 91,
      accuracy: 94,
      scalability: 93
    },
    requirements: ['Optimization solver', 'GPS/INS data', 'Weather API access']
  },
  {
    id: 'thermal-analysis',
    name: 'Thermal Management Suite',
    category: 'Thermal Analysis',
    description: 'Comprehensive thermal analysis including radiation, convection, conduction, and transient heat transfer for hypersonic vehicles.',
    difficulty: 'Expert',
    features: [
      'Radiation Heat Transfer',
      'Transient Analysis',
      'Phase Change Materials',
      'Thermal Stress Coupling',
      'Ablation Modeling',
      'Real-time Monitoring'
    ],
    icon: Thermometer,
    color: 'from-red-500 to-pink-500',
    applications: [
      'Hypersonic vehicle design',
      'Thermal protection systems',
      'Engine cooling',
      'Reentry vehicle analysis'
    ],
    performanceMetrics: {
      speed: 87,
      accuracy: 99,
      scalability: 88
    },
    requirements: ['Radiation solver', 'Min 24GB RAM', 'GPU acceleration']
  },
  {
    id: 'vibration-analysis',
    name: 'Advanced Vibration Analysis',
    category: 'Dynamics & Vibration',
    description: 'Modal analysis, harmonic response, random vibration, and shock response spectrum analysis for aerospace structures.',
    difficulty: 'Advanced',
    features: [
      'Modal Analysis',
      'Harmonic Response',
      'Random Vibration',
      'Shock Response Spectrum',
      'Damping Optimization',
      'Fatigue Prediction'
    ],
    icon: Waves,
    color: 'from-teal-500 to-cyan-500',
    applications: [
      'Launch vehicle analysis',
      'Vibration isolation design',
      'Component durability',
      'Acoustic analysis'
    ],
    performanceMetrics: {
      speed: 93,
      accuracy: 97,
      scalability: 91
    },
    requirements: ['Modal solver', 'Min 16GB RAM', 'Frequency domain tools']
  },
  {
    id: 'radar-design',
    name: 'Radar & Sensor Design',
    category: 'Avionics & Sensors',
    description: 'Integrated radar design, antenna optimization, and sensor fusion for aerospace navigation and detection systems.',
    difficulty: 'Expert',
    features: [
      'Antenna Design & Optimization',
      'Radar Performance Analysis',
      'Sensor Fusion Algorithms',
      'Signal Processing',
      'Clutter Rejection',
      'Target Tracking'
    ],
    icon: Radar,
    color: 'from-lime-500 to-green-500',
    applications: [
      'Weather radar design',
      'Collision avoidance systems',
      'Terrain mapping',
      'Autonomous landing systems'
    ],
    performanceMetrics: {
      speed: 96,
      accuracy: 98,
      scalability: 94
    },
    requirements: ['Signal processing library', 'Min 12GB RAM', 'FPGA support optional']
  },
  {
    id: 'composite-design',
    name: 'Composite Laminate Designer',
    category: 'Composite Materials',
    description: 'Advanced composite layup design with failure criteria, micromechanics, and manufacturing process simulation.',
    difficulty: 'Expert',
    features: [
      'Laminate Optimization',
      'Failure Criteria (Tsai-Wu, Hashin)',
      'Micromechanics Analysis',
      'Manufacturing Simulation',
      'Damage Tolerance',
      'Cost Analysis'
    ],
    icon: Hexagon,
    color: 'from-violet-500 to-purple-500',
    applications: [
      'Wing composite design',
      'Fuselage optimization',
      'Control surface design',
      'Landing gear composites'
    ],
    performanceMetrics: {
      speed: 90,
      accuracy: 99,
      scalability: 89
    },
    requirements: ['Composite database', 'Min 20GB RAM', 'Optimization solver']
  },
  {
    id: 'noise-prediction',
    name: 'Aeroacoustic Prediction',
    category: 'Acoustics',
    description: 'Comprehensive noise prediction including jet noise, airframe noise, and community noise impact assessment.',
    difficulty: 'Expert',
    features: [
      'Jet Noise Modeling',
      'Airframe Noise',
      'Noise Propagation',
      'Community Impact Maps',
      'Noise Reduction Strategies',
      'Certification Compliance'
    ],
    icon: Radio,
    color: 'from-fuchsia-500 to-pink-500',
    applications: [
      'Engine noise reduction',
      'Airport noise planning',
      'Helicopter noise analysis',
      'Drone noise compliance'
    ],
    performanceMetrics: {
      speed: 85,
      accuracy: 96,
      scalability: 87
    },
    requirements: ['Acoustics library', 'Min 16GB RAM', 'Frequency domain analysis']
  },
  {
    id: 'multidisciplinary-opt',
    name: 'Multidisciplinary Optimization',
    category: 'System Optimization',
    description: 'Integrated multidisciplinary design optimization combining aerodynamics, structures, propulsion, and controls.',
    difficulty: 'Expert',
    features: [
      'MDO Framework',
      'Parametric Sensitivity',
      'Surrogate Modeling',
      'Parallel Optimization',
      'Constraint Management',
      'Trade-off Analysis'
    ],
    icon: Infinity,
    color: 'from-cyan-500 to-blue-500',
    applications: [
      'Aircraft concept design',
      'System-level optimization',
      'Cost-performance trade-offs',
      'Sustainability optimization'
    ],
    performanceMetrics: {
      speed: 89,
      accuracy: 95,
      scalability: 97
    },
    requirements: ['Optimization framework', 'Min 32GB RAM', 'Cluster support']
  },
  {
    id: 'digital-twin',
    name: 'Digital Twin Platform',
    category: 'Industry 4.0',
    description: 'Real-time digital twin creation with sensor integration, predictive maintenance, and performance monitoring.',
    difficulty: 'Advanced',
    features: [
      'Real-time Synchronization',
      'Sensor Data Integration',
      'Predictive Maintenance',
      'Performance Analytics',
      'Anomaly Detection',
      'Cloud Integration'
    ],
    icon: Cloud,
    color: 'from-sky-500 to-blue-500',
    applications: [
      'Aircraft health monitoring',
      'Predictive maintenance',
      'Performance optimization',
      'Fleet management'
    ],
    performanceMetrics: {
      speed: 98,
      accuracy: 94,
      scalability: 99
    },
    requirements: ['Cloud platform', 'IoT framework', 'Real-time database']
  }
];

interface DatasetModal {
  id: string;
  name: string;
  description: string;
  category: string;
  modelFile?: string;
  downloadUrl?: string;
  parameters?: string;
}

function DatasetDetailModal({ dataset, onClose }: { dataset: DatasetModal | null; onClose: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  if (!dataset) return null;

  const handleDownload = async (url: string) => {
    if (!url) return;
    
    setIsDownloading(true);
    setDownloadStatus('downloading');
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const urlObj = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObj;
      a.download = `${dataset.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(urlObj);
      document.body.removeChild(a);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {dataset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primary border border-aerospace-blue/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-aerospace-blue/20 bg-primary/95 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-aerospace-blue/15 rounded-lg">
                  <Database className="w-5 h-5 text-aerospace-blue" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{dataset.name}</h2>
                  <p className="font-mono text-xs text-aerospace-blue uppercase tracking-widest">{dataset.category}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-aerospace-blue/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-heading text-sm font-bold text-aerospace-blue uppercase tracking-widest mb-2">
                  Description
                </h3>
                <p className="font-paragraph text-foreground/80 leading-relaxed">
                  {dataset.description || 'No description available'}
                </p>
              </div>

              {dataset.parameters && (
                <div className="p-4 bg-aerospace-blue/10 border border-aerospace-blue/20 rounded-lg">
                  <h3 className="font-heading text-sm font-bold text-aerospace-blue uppercase tracking-widest mb-2">
                    Simulation Parameters
                  </h3>
                  <p className="font-mono text-xs text-foreground/70 whitespace-pre-wrap">{dataset.parameters}</p>
                </div>
              )}

              <div className="pt-4 border-t border-aerospace-blue/20 flex gap-3">
                {dataset.modelFile && (
                  <button
                    onClick={() => handleDownload(dataset.modelFile!)}
                    disabled={isDownloading}
                    className={`flex-1 px-4 py-3 font-mono text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      downloadStatus === 'success'
                        ? 'bg-aerospace-success text-white'
                        : downloadStatus === 'error'
                        ? 'bg-aerospace-danger text-white'
                        : 'bg-aerospace-blue text-white hover:bg-aerospace-accent'
                    } ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {downloadStatus === 'downloading' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {downloadStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {downloadStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                    {downloadStatus === 'idle' && <Download className="w-4 h-4" />}
                    {downloadStatus === 'downloading' ? 'Downloading...' : downloadStatus === 'success' ? 'Downloaded!' : downloadStatus === 'error' ? 'Failed' : 'Download Model'}
                  </button>
                )}
                {dataset.downloadUrl && (
                  <a
                    href={dataset.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue font-mono text-sm font-semibold rounded-lg hover:bg-aerospace-blue/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Data
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdvancedToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [cfdDatasets, setCfdDatasets] = useState<DatasetModal[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetModal | null>(null);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const result = await BaseCrudService.getAll<CFDDatasets>('cfddatasets', [], { limit: 50 });
        const datasets = result.items.map((item) => ({
          id: item._id,
          name: item.datasetName || 'CFD Dataset',
          description: item.description || '',
          category: item.category || 'General',
          modelFile: item.modelFile,
          downloadUrl: item.dataDownloadUrl,
          parameters: item.simulationParameters,
        }));
        setCfdDatasets(datasets);
      } catch (error) {
        console.error('Error loading CFD datasets:', error);
      } finally {
        setIsLoadingDatasets(false);
      }
    };
    loadDatasets();
  }, []);

  const categories = useMemo(
    () => [...new Set(ADVANCED_TOOLS.map((t) => t.category))],
    []
  );

  const filteredTools = useMemo(() => {
    if (!selectedCategory) return ADVANCED_TOOLS;
    return ADVANCED_TOOLS.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-32 bg-gradient-to-b from-primary to-aerospace-dark border-b border-aerospace-blue/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-aerospace-blue/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aerospace-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-aerospace-blue animate-pulse" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Next Generation
                </span>
                <Sparkles className="w-6 h-6 text-aerospace-blue animate-pulse" />
              </div>

              <h1 className="font-heading text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Advanced Aerospace
                <br />
                <span className="bg-gradient-to-r from-aerospace-blue via-aerospace-accent to-aerospace-blue bg-clip-text text-transparent">
                  Engineering Tools
                </span>
              </h1>

              <p className="font-paragraph text-xl text-secondary-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
                Enterprise-grade simulation, optimization, and analysis tools designed for aerospace engineers who demand precision, performance, and innovation. Master the most advanced computational tools in the industry.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-4 bg-aerospace-blue text-aerospace-dark font-bold rounded-lg hover:bg-aerospace-accent transition-all duration-300 flex items-center gap-2 group">
                  Explore Tools
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 font-bold rounded-lg transition-all duration-300">
                  View Documentation
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="w-full py-12 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-aerospace-blue text-aerospace-dark'
                    : 'bg-secondary/20 text-foreground hover:bg-secondary/40'
                }`}
              >
                All Tools
              </motion.button>

              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-aerospace-blue text-aerospace-dark'
                      : 'bg-secondary/20 text-foreground hover:bg-secondary/40'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full py-24 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, idx) => {
                const IconComponent = tool.icon;
                const isHovered = hoveredTool === tool.id;

                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredTool(tool.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                    className="group relative"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl blur-xl`}
                    />

                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-primary/80 to-primary/40 border border-aerospace-blue/20 group-hover:border-aerospace-blue/60 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col h-full p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-br ${tool.color} rounded-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-mono text-xs px-2 py-1 bg-aerospace-blue/20 text-aerospace-blue rounded-full">
                          {tool.difficulty}
                        </span>
                      </div>

                      {/* Title & Category */}
                      <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-aerospace-blue transition-colors">
                        {tool.name}
                      </h3>
                      <p className="font-mono text-xs text-aerospace-accent uppercase tracking-widest mb-3">
                        {tool.category}
                      </p>

                      {/* Description */}
                      <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1 line-clamp-3">
                        {tool.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4 pt-4 border-t border-secondary/20">
                        <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                          Key Features
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tool.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="font-mono text-xs px-2 py-1 bg-aerospace-success/10 text-aerospace-success rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {tool.features.length > 3 && (
                            <span className="font-mono text-xs px-2 py-1 bg-secondary/20 text-foreground/60 rounded">
                              +{tool.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      {tool.performanceMetrics && (
                        <div className="mb-4 pt-4 border-t border-secondary/20">
                          <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                            Performance
                          </p>
                          <div className="space-y-1">
                            {Object.entries(tool.performanceMetrics).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="font-mono text-xs text-foreground/60 capitalize">
                                  {key}
                                </span>
                                <div className="w-20 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${value}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Applications */}
                      <div className="mb-4 pt-4 border-t border-secondary/20">
                        <p className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-2">
                          Applications
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tool.applications.slice(0, 2).map((app) => (
                            <span
                              key={app}
                              className="font-mono text-xs px-2 py-1 bg-aerospace-warning/10 text-aerospace-warning rounded"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <button className="w-full px-4 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 hover:border-aerospace-blue/60 transition-all rounded-lg font-mono text-sm font-semibold flex items-center justify-center gap-2 group/btn">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CFD Datasets Section */}
        {!isLoadingDatasets && cfdDatasets.length > 0 && (
          <section className="w-full py-24 bg-primary border-t border-secondary/20">
            <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-aerospace-blue" />
                  <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                    Datasets & Resources
                  </span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                  CFD Datasets & Models
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  Download and explore real-world CFD datasets, simulation models, and benchmark cases for your research and development.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cfdDatasets.map((dataset, idx) => (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg overflow-hidden hover:border-aerospace-blue/60 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-aerospace-blue/15 rounded-lg group-hover:bg-aerospace-blue/30 transition-colors">
                        <Database className="w-6 h-6 text-aerospace-blue" />
                      </div>
                      <span className="font-mono text-xs px-2 py-1 bg-aerospace-accent/20 text-aerospace-accent rounded-full">
                        {dataset.category}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors line-clamp-2">
                      {dataset.name}
                    </h3>

                    <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-1 line-clamp-3">
                      {dataset.description}
                    </p>

                    <button
                      onClick={() => setSelectedDataset(dataset)}
                      className="w-full px-4 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 hover:border-aerospace-blue/60 transition-all rounded-lg font-mono text-sm font-semibold flex items-center justify-center gap-2 group/btn"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Capabilities Section */}
        <section className="w-full py-24 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">
                  Capabilities
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Choose Our Advanced Tools?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Industry-Leading Accuracy',
                  description: 'Validated against real-world aerospace data with 99%+ accuracy rates',
                  icon: CheckCircle2,
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  title: 'Extreme Performance',
                  description: 'GPU-accelerated computing for 10-100x faster simulations',
                  icon: Lightning,
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  title: 'Scalable Architecture',
                  description: 'From laptop to supercomputer, seamless scaling',
                  icon: Cloud,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Certification Ready',
                  description: 'Compliant with DO-178C, DO-254, and aerospace standards',
                  icon: ShieldCheck,
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((capability, idx) => {
                const CapIcon = capability.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300"
                  >
                    <div className={`p-3 bg-gradient-to-br ${capability.color} rounded-lg w-fit mb-4`}>
                      <CapIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      {capability.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70">
                      {capability.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-aerospace-dark border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-r from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/40 rounded-xl p-12 text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-aerospace-blue rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Ready to Master Advanced Aerospace Engineering?
                </h2>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl mx-auto mb-8">
                  Join thousands of aerospace engineers using our tools to design the future of aviation and space exploration.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="px-8 py-4 bg-aerospace-blue text-aerospace-dark font-bold rounded-lg hover:bg-aerospace-accent transition-all duration-300 flex items-center gap-2 group">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 border-2 border-aerospace-blue text-aerospace-blue hover:bg-aerospace-blue/10 font-bold rounded-lg transition-all duration-300">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Dataset Modal */}
      <DatasetDetailModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
    </div>
  );
}
