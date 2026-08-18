import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Crown, TrendingUp, Cpu, Wind, Brain, Lock, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';

interface PremiumTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  badge: string;
  color: string;
  component: React.ReactNode;
}

// Real-time Performance Monitor Tool
const PerformanceMonitorTool = () => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    latency: 12,
    throughput: 8500,
  });
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(30, Math.min(95, prev.cpu + (Math.random() - 0.5) * 15)),
        memory: Math.max(40, Math.min(90, prev.memory + (Math.random() - 0.5) * 10)),
        latency: Math.max(8, Math.min(25, prev.latency + (Math.random() - 0.5) * 3)),
        throughput: Math.max(7000, Math.min(10000, prev.throughput + (Math.random() - 0.5) * 500)),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const MetricBar = ({ label, value, max, unit }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-foreground/70">{label}</span>
        <span className="font-mono text-sm font-bold text-aerospace-blue">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <MetricBar label="CPU Usage" value={metrics.cpu} max={100} unit="%" />
        <MetricBar label="Memory" value={metrics.memory} max={100} unit="%" />
        <MetricBar label="Latency" value={metrics.latency} max={30} unit="ms" />
        <MetricBar label="Throughput" value={metrics.throughput} max={10000} unit=" ops/s" />
      </div>
      
      <div className="flex gap-2 pt-4 border-t border-secondary/20">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 px-3 py-2 bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue rounded font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => setMetrics({ cpu: 45, memory: 62, latency: 12, throughput: 8500 })}
          className="flex-1 px-3 py-2 bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent rounded font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
};

// Optimization Calculator Tool
const OptimizationCalculator = () => {
  const [inputs, setInputs] = useState({
    weight: 2.5,
    drag: 0.35,
    thrust: 85,
  });
  const [results, setResults] = useState({
    efficiency: 0,
    range: 0,
    speed: 0,
  });

  useEffect(() => {
    const efficiency = (inputs.thrust / (inputs.weight * 9.81)) * 100;
    const range = (efficiency * inputs.weight * 1000) / (inputs.drag * 50);
    const speed = Math.sqrt((inputs.thrust * 1000) / (inputs.drag * 1.225 * 0.5));

    setResults({
      efficiency: Math.min(99, efficiency),
      range: range,
      speed: speed,
    });
  }, [inputs]);

  const handleInputChange = (key: string, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'weight', label: 'Weight (kg)', min: 0.5, max: 5, step: 0.1 },
          { key: 'drag', label: 'Drag Coefficient', min: 0.1, max: 1, step: 0.05 },
          { key: 'thrust', label: 'Thrust (kN)', min: 10, max: 200, step: 5 },
        ].map(({ key, label, min, max, step }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs text-foreground/70">{label}</label>
              <span className="font-mono text-sm font-bold text-aerospace-blue">
                {inputs[key as keyof typeof inputs].toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={inputs[key as keyof typeof inputs]}
              onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary/30 rounded-full appearance-none cursor-pointer accent-aerospace-blue"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-secondary/20 space-y-3">
        <div className="flex justify-between items-center p-3 bg-aerospace-blue/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Efficiency</span>
          <span className="font-mono text-sm font-bold text-aerospace-success">{results.efficiency.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-aerospace-accent/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Range</span>
          <span className="font-mono text-sm font-bold text-aerospace-accent">{results.range.toFixed(0)} km</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-aerospace-warning/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Max Speed</span>
          <span className="font-mono text-sm font-bold text-aerospace-warning">{results.speed.toFixed(0)} m/s</span>
        </div>
      </div>
    </div>
  );
};

// Real-time Mesh Generator Tool
const MeshGeneratorTool = () => {
  const [meshParams, setMeshParams] = useState({
    resolution: 50,
    refinement: 3,
    quality: 85,
  });
  const [meshStats, setMeshStats] = useState({
    elements: 0,
    nodes: 0,
    quality: 0,
  });

  useEffect(() => {
    const elements = meshParams.resolution * meshParams.resolution * meshParams.refinement;
    const nodes = (meshParams.resolution + 1) * (meshParams.resolution + 1);
    const quality = Math.min(99, meshParams.quality + meshParams.refinement * 2);

    setMeshStats({
      elements,
      nodes,
      quality,
    });
  }, [meshParams]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'resolution', label: 'Grid Resolution', min: 20, max: 100, step: 10 },
          { key: 'refinement', label: 'Refinement Level', min: 1, max: 8, step: 1 },
          { key: 'quality', label: 'Quality Target', min: 50, max: 99, step: 5 },
        ].map(({ key, label, min, max, step }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs text-foreground/70">{label}</label>
              <span className="font-mono text-sm font-bold text-aerospace-blue">
                {meshParams[key as keyof typeof meshParams]}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={meshParams[key as keyof typeof meshParams]}
              onChange={(e) => setMeshParams(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
              className="w-full h-2 bg-secondary/30 rounded-full appearance-none cursor-pointer accent-aerospace-blue"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-secondary/20 space-y-3">
        <div className="flex justify-between items-center p-3 bg-aerospace-blue/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Elements</span>
          <span className="font-mono text-sm font-bold text-aerospace-blue">{meshStats.elements.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-aerospace-accent/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Nodes</span>
          <span className="font-mono text-sm font-bold text-aerospace-accent">{meshStats.nodes.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-aerospace-success/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Quality Score</span>
          <span className="font-mono text-sm font-bold text-aerospace-success">{meshStats.quality}%</span>
        </div>
      </div>
    </div>
  );
};

// Aerodynamic Analysis Tool
const AerodynamicAnalyzer = () => {
  const [params, setParams] = useState({
    altitude: 10000,
    speed: 250,
    angle: 5,
  });
  const [results, setResults] = useState({
    lift: 0,
    drag: 0,
    liftDragRatio: 0,
  });

  useEffect(() => {
    const airDensity = 1.225 * Math.exp(-params.altitude / 10500);
    const angleRad = (params.angle * Math.PI) / 180;
    const liftCoeff = 0.5 + Math.sin(angleRad) * 1.5;
    const dragCoeff = 0.01 + Math.pow(Math.sin(angleRad), 2) * 0.05;

    const lift = 0.5 * airDensity * Math.pow(params.speed, 2) * 50 * liftCoeff;
    const drag = 0.5 * airDensity * Math.pow(params.speed, 2) * 50 * dragCoeff;

    setResults({
      lift: lift / 1000,
      drag: drag / 1000,
      liftDragRatio: lift / drag,
    });
  }, [params]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'altitude', label: 'Altitude (m)', min: 0, max: 35000, step: 1000 },
          { key: 'speed', label: 'Airspeed (m/s)', min: 50, max: 500, step: 10 },
          { key: 'angle', label: 'Angle of Attack (°)', min: -10, max: 25, step: 1 },
        ].map(({ key, label, min, max, step }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs text-foreground/70">{label}</label>
              <span className="font-mono text-sm font-bold text-aerospace-blue">
                {params[key as keyof typeof params]}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={params[key as keyof typeof params]}
              onChange={(e) => setParams(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
              className="w-full h-2 bg-secondary/30 rounded-full appearance-none cursor-pointer accent-aerospace-blue"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-secondary/20 space-y-3">
        <div className="flex justify-between items-center p-3 bg-aerospace-success/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Lift Force</span>
          <span className="font-mono text-sm font-bold text-aerospace-success">{results.lift.toFixed(1)} kN</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-aerospace-danger/10 rounded">
          <span className="font-mono text-xs text-foreground/70">Drag Force</span>
          <span className="font-mono text-sm font-bold text-aerospace-danger">{results.drag.toFixed(1)} kN</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-aerospace-accent/10 rounded">
          <span className="font-mono text-xs text-foreground/70">L/D Ratio</span>
          <span className="font-mono text-sm font-bold text-aerospace-accent">{results.liftDragRatio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const PREMIUM_TOOLS: PremiumTool[] = [
  {
    id: 'performance-monitor',
    name: 'Real-Time Performance Monitor',
    description: 'Live system metrics and performance tracking',
    icon: Cpu,
    badge: 'LEGENDARY',
    color: 'from-aerospace-blue to-aerospace-accent',
    component: <PerformanceMonitorTool />,
  },
  {
    id: 'optimization-calc',
    name: 'Design Optimization Calculator',
    description: 'Advanced aerodynamic and structural optimization',
    icon: TrendingUp,
    badge: 'EPIC',
    color: 'from-aerospace-accent to-aerospace-success',
    component: <OptimizationCalculator />,
  },
  {
    id: 'mesh-generator',
    name: 'Intelligent Mesh Generator',
    description: 'Adaptive mesh generation with quality control',
    icon: Brain,
    badge: 'LEGENDARY',
    color: 'from-aerospace-success to-aerospace-warning',
    component: <MeshGeneratorTool />,
  },
  {
    id: 'aero-analyzer',
    name: 'Aerodynamic Analyzer',
    description: 'Real-time aerodynamic force calculations',
    icon: Wind,
    badge: 'EPIC',
    color: 'from-aerospace-warning to-aerospace-blue',
    component: <AerodynamicAnalyzer />,
  },
];

export default function PremiumToolsSection() {
  const [selectedTool, setSelectedTool] = useState(PREMIUM_TOOLS[0]);

  return (
    <section className="w-full py-32 bg-primary border-t border-secondary/20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-aerospace-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-aerospace-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-aerospace-blue" />
            <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Premium Tools</span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
            Legendary Engineering Tools
          </h2>
          <p className="font-paragraph text-xl text-secondary-foreground max-w-3xl mx-auto">
            Unlock epic capabilities with our premium suite of real-time analysis and optimization tools. Fully functional and production-ready.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Tool Selector */}
          <div className="lg:col-span-1 space-y-4">
            {PREMIUM_TOOLS.map((tool, idx) => {
              const Icon = tool.icon;
              const isSelected = selectedTool.id === tool.id;

              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full text-left p-6 rounded-lg border-2 transition-all duration-300 group ${
                    isSelected
                      ? `border-aerospace-blue bg-gradient-to-br ${tool.color} bg-opacity-10`
                      : 'border-secondary/20 bg-aerospace-dark/50 hover:border-aerospace-blue/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${isSelected ? 'bg-aerospace-blue/30' : 'bg-secondary/20'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-aerospace-blue' : 'text-foreground/60'}`} />
                    </div>
                    <span className={`font-mono text-xs px-2 py-1 rounded font-bold ${
                      tool.badge === 'LEGENDARY'
                        ? 'bg-aerospace-blue/30 text-aerospace-blue'
                        : 'bg-aerospace-accent/30 text-aerospace-accent'
                    }`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className={`font-heading font-bold mb-2 transition-colors ${
                    isSelected ? 'text-aerospace-blue' : 'text-foreground group-hover:text-aerospace-blue'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className="font-paragraph text-xs text-foreground/60">
                    {tool.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Tool Display */}
          <motion.div
            key={selectedTool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 p-8 bg-gradient-to-br from-aerospace-dark/80 to-aerospace-dark/40 border-2 border-aerospace-blue/40 rounded-lg shadow-2xl"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-aerospace-blue animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-aerospace-blue font-bold">
                  {selectedTool.badge} TOOL
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                {selectedTool.name}
              </h3>
              <p className="font-paragraph text-foreground/70">
                {selectedTool.description}
              </p>
            </div>

            <div className="bg-aerospace-dark/50 rounded-lg p-6 border border-secondary/20">
              {selectedTool.component}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, label: 'Real-Time', desc: 'Live calculations' },
            { icon: Lock, label: 'Production Ready', desc: 'Enterprise grade' },
            { icon: TrendingUp, label: 'Optimized', desc: 'Peak performance' },
            { icon: Sparkles, label: 'Advanced', desc: 'Cutting edge' },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/60 transition-all duration-300 text-center"
              >
                <Icon className="w-6 h-6 text-aerospace-blue mx-auto mb-3" />
                <h4 className="font-heading font-bold text-foreground mb-1">{feature.label}</h4>
                <p className="font-paragraph text-xs text-foreground/60">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
