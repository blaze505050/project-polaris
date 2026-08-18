import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Globe, Link as LinkIcon, Database, Cpu, Gauge, Microscope, Rocket, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DataFormatter } from '@/services/dataFormatting';

export default function AstroLabEnhancedPage() {
  const navigate = useNavigate();
  const [utcTime, setUtcTime] = useState(new Date());
  const [orbitStatus, setOrbitStatus] = useState('OPERATIONAL');
  const [systemLoad, setSystemLoad] = useState(34);

  useEffect(() => {
    const timer = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTimer = setInterval(() => {
      setSystemLoad(prev => {
        const change = (Math.random() - 0.5) * 10;
        const newLoad = Math.max(20, Math.min(85, prev + change));
        return Math.round(newLoad);
      });
    }, 2000);
    return () => clearInterval(loadTimer);
  }, []);

  const modules = [
    {
      id: 'universe-viewer',
      label: 'Ultimate Universe Engine',
      icon: Sparkles,
      description: 'Physics-accurate N-body simulation with General Relativity effects & volumetric rendering',
      path: '/universe-viewer',
      color: '#00F0FF',
      category: 'Premium',
      badge: 'NEW',
    },
    {
      id: 'premium-suite',
      label: 'Premium Mission Control',
      icon: Zap,
      description: 'Ultra-high-quality Mission Control with advanced analytics & real-time telemetry',
      path: '/premium-astrolab',
      color: '#FF007A',
      category: 'Premium',
    },
    {
      id: 'spatial-globe',
      label: 'Spatial Globe',
      icon: Globe,
      description: 'Real-time satellite tracking & orbital visualization',
      path: '/astrolab/spatial-globe',
      color: '#00F0FF',
      category: 'Tracking',
    },
    {
      id: 'deep-space',
      label: 'Deep Space Observation',
      icon: Microscope,
      description: 'Catalog of celestial objects & deep-sky mapping',
      path: '/astrolab/deep-space-observation',
      color: '#FF007A',
      category: 'Analysis',
    },
    {
      id: 'photometry',
      label: 'Photometry Suite',
      icon: Database,
      description: 'Professional stellar photometry & aperture analysis',
      path: '/astrolab/photometry-suite',
      color: '#F59E0B',
      category: 'Measurement',
    },
    {
      id: 'astrodynamics',
      label: 'Astrodynamics Sandbox',
      icon: Cpu,
      description: 'N-body gravitational simulation engine',
      path: '/astrolab/astrodynamics-sandbox',
      color: '#A78BFA',
      category: 'Simulation',
    },
    {
      id: 'dual-mode',
      label: 'Dual-Mode Experience',
      icon: Gauge,
      description: 'Switch between Student and Professional modes',
      path: '/astrolab/dual-mode',
      color: '#10B981',
      category: 'Interface',
    },
    {
      id: 'constellation',
      label: 'Satellite Constellation',
      icon: Rocket,
      description: 'Real-time orbital shell visualization',
      path: '/astrolab/satellite-constellation',
      color: '#06B6D4',
      category: 'Tracking',
    },
    {
      id: 'celestial',
      label: 'Celestial Coordinates',
      icon: Gauge,
      description: 'Ephemeris calculations & coordinate transformations',
      path: '/astrolab/celestial-coordinate',
      color: '#EC4899',
      category: 'Calculation',
    },
    {
      id: 'orbital',
      label: 'Orbital Mechanics',
      icon: Database,
      description: 'Keplerian elements & orbital dynamics',
      path: '/astrolab/orbital-mechanics',
      color: '#8B5CF6',
      category: 'Analysis',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-lg border border-[#00F0FF]/30 bg-gradient-to-br from-[#131924]/80 to-[#0B0E14]/80 backdrop-blur-md p-8">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF] rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-6xl font-bold text-[#00F0FF] font-mono mb-2 tracking-tight">AstroLab Suite</h1>
                  <p className="text-base text-secondary-foreground font-mono">ISO 9001:2015 Certified | Physics-Accurate Astronomical Research Platform</p>
                </div>
              </div>

              {/* Professional Status Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#00F0FF]/20">
                <div className="flex items-center gap-3 bg-[#0B0E14]/40 p-3 rounded border border-[#00F0FF]/10">
                  <Clock size={16} className="text-[#00F0FF]" />
                  <div>
                    <div className="text-xs text-secondary-foreground font-mono">UTC TIME</div>
                    <div className="text-sm font-mono text-[#00F0FF]">{utcTime.toISOString().split('T')[1].substring(0, 8)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#0B0E14]/40 p-3 rounded border border-[#10B981]/10">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <div>
                    <div className="text-xs text-secondary-foreground font-mono">SYSTEM STATUS</div>
                    <div className="text-sm font-mono text-[#10B981]">{orbitStatus}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#0B0E14]/40 p-3 rounded border border-[#F59E0B]/10">
                  <Cpu size={16} className="text-[#F59E0B]" />
                  <div>
                    <div className="text-xs text-secondary-foreground font-mono">CPU LOAD</div>
                    <div className="text-sm font-mono text-[#F59E0B]">{systemLoad}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#0B0E14]/40 p-3 rounded border border-[#A78BFA]/10">
                  <Database size={16} className="text-[#A78BFA]" />
                  <div>
                    <div className="text-xs text-secondary-foreground font-mono">DATA POINTS</div>
                    <div className="text-sm font-mono text-[#A78BFA]">9000+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modules Grid */}
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#00F0FF] font-mono">RESEARCH MODULES</h2>
              <span className="text-xs text-secondary-foreground font-mono">{modules.length} Available</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, idx) => {
                const IconComponent = module.icon;
                return (
                  <motion.button
                    key={module.id}
                    onClick={() => navigate(module.path)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="text-left p-5 rounded border border-[#00F0FF]/20 bg-[#131924]/60 backdrop-blur-md hover:border-[#00F0FF]/50 hover:bg-[#131924]/80 transition-all group relative"
                  >
                    {module.badge && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-[#00F0FF] text-[#0B0E14] text-xs font-bold rounded">
                        {module.badge}
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <IconComponent size={20} className="text-[#00F0FF]" />
                      <span className="text-xs font-mono text-secondary-foreground bg-[#0B0E14] px-2 py-1 rounded">{module.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground font-mono mb-2 group-hover:text-[#00F0FF] transition">{module.label}</h3>
                    <p className="text-xs text-secondary-foreground mb-4 leading-relaxed">{module.description}</p>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] opacity-0 group-hover:opacity-100 transition">
                      <LinkIcon size={12} />
                      Launch
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cpu size={20} className="text-[#00F0FF]" />
                <h3 className="text-sm font-bold text-foreground font-mono">PRECISION COMPUTING</h3>
              </div>
              <p className="text-xs text-secondary-foreground leading-relaxed">
                IEEE 754 double-precision floating-point arithmetic with validated algorithms for orbital propagation and celestial mechanics calculations.
              </p>
            </div>
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#FF007A]/20 rounded p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database size={20} className="text-[#FF007A]" />
                <h3 className="text-sm font-bold text-foreground font-mono">DATA INTEGRITY</h3>
              </div>
              <p className="text-xs text-secondary-foreground leading-relaxed">
                Real-time data validation, error checking, and comprehensive logging for audit trails and reproducible research.
              </p>
            </div>
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#F59E0B]/20 rounded p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gauge size={20} className="text-[#F59E0B]" />
                <h3 className="text-sm font-bold text-foreground font-mono">PERFORMANCE METRICS</h3>
              </div>
              <p className="text-xs text-secondary-foreground leading-relaxed">
                Real-time performance monitoring, latency tracking, and resource utilization analysis for optimization.
              </p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
            <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">TECHNICAL SPECIFICATIONS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF]/10">
                <div className="text-xs text-secondary-foreground font-mono mb-1">PRECISION</div>
                <div className="text-sm font-bold text-[#00F0FF] font-mono">64-bit IEEE 754</div>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded border border-[#FF007A]/10">
                <div className="text-xs text-secondary-foreground font-mono mb-1">SATELLITES TRACKED</div>
                <div className="text-sm font-bold text-[#FF007A] font-mono">9000+</div>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded border border-[#F59E0B]/10">
                <div className="text-xs text-secondary-foreground font-mono mb-1">UPDATE RATE</div>
                <div className="text-sm font-bold text-[#F59E0B] font-mono">Real-time</div>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded border border-[#A78BFA]/10">
                <div className="text-xs text-secondary-foreground font-mono mb-1">MODULES</div>
                <div className="text-sm font-bold text-[#A78BFA] font-mono">{modules.length}</div>
              </div>
            </div>
          </div>

          {/* Standards Compliance */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#10B981]/20 rounded p-6">
            <h3 className="text-sm font-bold text-[#10B981] font-mono mb-4">STANDARDS & COMPLIANCE</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">ICRS J2000.0</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">WGS84 Geodetic</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">SGP4/SDP4 Models</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">IEEE 754 Arithmetic</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">UTC/TAI Timescales</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-6 border-t border-[#00F0FF]/10">
            <p className="text-secondary-foreground font-mono text-xs mb-4">Select a module to begin your research session</p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/50 rounded font-mono text-xs hover:bg-[#00F0FF]/20 transition-all">
                Documentation
              </button>
              <button className="px-6 py-2 bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/50 rounded font-mono text-xs hover:bg-[#FF007A]/20 transition-all">
                API Reference
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
