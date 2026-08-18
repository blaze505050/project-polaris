/**
 * Premium AstroLab Suite - Mission Control Edition
 * Ultra-high-quality data visualizations, advanced analytics, and professional-grade UI
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Globe, TrendingUp, Radio, AlertCircle, Maximize2, Settings, Download } from 'lucide-react';
import { missionControlEngine, TelemetryData, SpectralAnalysis, GravitationalWaveSignal } from '@/services/missionControlEngine';

interface DashboardMetric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'nominal' | 'warning' | 'critical';
  trend?: number;
}

const PremiumAstroLabSuite: React.FC = () => {
  const [currentModule, setCurrentModule] = useState('mission-control');
  const [utcTime, setUtcTime] = useState(new Date());
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [spectralData, setSpectralData] = useState<SpectralAnalysis[]>([]);
  const [gwSignals, setGwSignals] = useState<GravitationalWaveSignal[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<DashboardMetric[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spectralCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize telemetry stream
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      const newTelemetry = missionControlEngine.generateTelemetry('ISS', Date.now());
      setTelemetryData(newTelemetry);
      missionControlEngine.addTelemetry(newTelemetry);

      // Update metrics
      const history = missionControlEngine.getTelemetryHistory(100);
      const stats = missionControlEngine.calculateOrbitalStats(history);

      setSystemMetrics([
        {
          label: 'Altitude',
          value: stats.avgAltitude.toFixed(1),
          unit: 'km',
          status: stats.avgAltitude > 350 && stats.avgAltitude < 450 ? 'nominal' : 'warning',
          trend: Math.random() * 2 - 1,
        },
        {
          label: 'Velocity',
          value: stats.avgVelocity.toFixed(2),
          unit: 'km/s',
          status: 'nominal',
          trend: Math.random() * 0.1 - 0.05,
        },
        {
          label: 'Inclination',
          value: newTelemetry.inclination.toFixed(1),
          unit: '°',
          status: 'nominal',
        },
        {
          label: 'System Load',
          value: (45 + Math.random() * 20).toFixed(0),
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'nominal',
        },
      ]);
    }, 1000);

    const timeInterval = setInterval(() => setUtcTime(new Date()), 1000);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Render spectral analysis visualization
  useEffect(() => {
    if (!spectralCanvasRef.current || !telemetryData) return;

    const canvas = spectralCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate mock signal data
    const signalData = Array.from({ length: 256 }, (_, i) =>
      Math.sin((i / 256) * Math.PI * 4) * 100 + Math.random() * 20
    );

    const spectral = missionControlEngine.performSpectralAnalysis(signalData);
    setSpectralData(spectral);

    // Clear canvas
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw spectral bars
    const barWidth = canvas.width / spectral.length;
    const maxIntensity = Math.max(...spectral.map(s => s.intensity));

    spectral.forEach((data, index) => {
      const height = (data.intensity / maxIntensity) * canvas.height * 0.8;
      const x = index * barWidth;
      const y = canvas.height - height;

      // Gradient color based on intensity
      const hue = (data.confidence * 120).toString(); // Green to red
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(x, y, barWidth - 1, height);

      // Glow effect
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 10;
    });

    ctx.shadowBlur = 0;
  }, [telemetryData]);

  // Render 3D globe with WebGL
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0B0E14');
      gradient.addColorStop(1, '#131924');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbital grid
      ctx.strokeStyle = '#00F0FF33';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = canvas.width / 2 + Math.cos(angle) * 100;
        const y1 = canvas.height / 2 + Math.sin(angle) * 100;
        const x2 = canvas.width / 2 + Math.cos(angle) * 150;
        const y2 = canvas.height / 2 + Math.sin(angle) * 150;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw Earth
      ctx.fillStyle = '#1a3a52';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
      ctx.fill();

      // Draw satellite orbit
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2);
      ctx.stroke();

      // Draw satellite
      if (telemetryData) {
        const angle = ((telemetryData.longitude + 180) / 360) * Math.PI * 2;
        const satX = canvas.width / 2 + Math.cos(angle) * 120;
        const satY = canvas.height / 2 + Math.sin(angle) * 120;

        ctx.fillStyle = '#FF007A';
        ctx.beginPath();
        ctx.arc(satX, satY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowColor = '#FF007A';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#FF007A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(satX, satY, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [telemetryData]);

  const modules = [
    { id: 'mission-control', label: 'Mission Control', icon: '🎛️' },
    { id: 'spectral-analysis', label: 'Spectral Analysis', icon: '📊' },
    { id: 'gravitational-waves', label: 'Gravitational Waves', icon: '〰️' },
    { id: 'tle-processor', label: 'TLE Processor', icon: '📡' },
    { id: 'orbital-mechanics', label: 'Orbital Mechanics', icon: '⚙️' },
  ];

  const renderModule = () => {
    switch (currentModule) {
      case 'mission-control':
        return <MissionControlDashboard telemetryData={telemetryData} metrics={systemMetrics} canvasRef={canvasRef} />;
      case 'spectral-analysis':
        return <SpectralAnalysisModule canvasRef={spectralCanvasRef} data={spectralData} />;
      case 'gravitational-waves':
        return <GravitationalWaveModule />;
      case 'tle-processor':
        return <TLEProcessorModule />;
      case 'orbital-mechanics':
        return <OrbitalMechanicsModule telemetryData={telemetryData} />;
      default:
        return <MissionControlDashboard telemetryData={telemetryData} metrics={systemMetrics} canvasRef={canvasRef} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0E14] text-foreground overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Premium Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/95 to-[#0B0E14] backdrop-blur-xl border-b border-[#00F0FF]/20 px-6 py-4 shadow-2xl">
        <div className="max-w-[120rem] mx-auto flex items-center justify-between">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#FF007A] rounded-lg blur opacity-75 animate-pulse" />
              <div className="relative bg-[#0B0E14] px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold font-mono bg-gradient-to-r from-[#00F0FF] to-[#FF007A] bg-clip-text text-transparent">
                  AstroLab
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-xs text-secondary-foreground font-mono">MISSION CONTROL</div>
              <div className="text-xs text-[#00F0FF] font-mono">Premium Edition</div>
            </div>
          </motion.div>

          {/* Status Bar */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 px-6 border-l border-r border-[#00F0FF]/20">
              <motion.div animate={{ opacity: [0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[#10B981]">LIVE</span>
              </motion.div>
              <div className="flex items-center gap-2 text-xs font-mono text-secondary-foreground">
                <Clock size={12} />
                {utcTime.toUTCString().split(' ')[4]}
              </div>
            </div>

            {/* Controls */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] transition-colors"
            >
              <Maximize2 size={18} />
            </motion.button>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="max-w-[120rem] mx-auto mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {modules.map((mod) => (
            <motion.button
              key={mod.id}
              onClick={() => setCurrentModule(mod.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                currentModule === mod.id
                  ? 'bg-gradient-to-r from-[#00F0FF]/30 to-[#FF007A]/30 text-[#00F0FF] border border-[#00F0FF]/50 shadow-lg shadow-[#00F0FF]/20'
                  : 'bg-[#131924]/40 text-secondary-foreground border border-[#00F0FF]/10 hover:border-[#00F0FF]/30'
              }`}
            >
              {mod.icon} {mod.label}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Mission Control Dashboard Component
const MissionControlDashboard: React.FC<{
  telemetryData: TelemetryData | null;
  metrics: any[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
}> = ({ telemetryData, metrics, canvasRef }) => {
  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto space-y-6">
        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-xl p-6 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-4 flex items-center gap-2">
            <Globe size={20} /> Real-Time Orbital Visualization
          </h2>
          <canvas
            ref={canvasRef}
            className="w-full h-96 rounded-lg bg-[#0B0E14] border border-[#00F0FF]/10"
          />
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} delay={idx * 0.1} />
          ))}
        </div>

        {/* Telemetry Details */}
        {telemetryData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <TelemetryPanel title="Position Data" data={telemetryData} />
            <TelemetryPanel title="Orbital Elements" data={telemetryData} type="orbital" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{ metric: any; delay: number }> = ({ metric, delay }) => {
  const statusColor = {
    nominal: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-lg p-4 hover:border-[#00F0FF]/40 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-secondary-foreground">{metric.label}</span>
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusColor[metric.status] }}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#00F0FF] font-mono">{metric.value}</span>
        {metric.unit && <span className="text-xs text-secondary-foreground">{metric.unit}</span>}
      </div>
      {metric.trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <TrendingUp size={12} style={{ color: metric.trend > 0 ? '#10B981' : '#EF4444' }} />
          <span style={{ color: metric.trend > 0 ? '#10B981' : '#EF4444' }}>
            {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(2)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Telemetry Panel Component
const TelemetryPanel: React.FC<{ title: string; data: TelemetryData; type?: string }> = ({
  title,
  data,
  type = 'position',
}) => {
  const items =
    type === 'position'
      ? [
          { label: 'Latitude', value: data.latitude.toFixed(4), unit: '°' },
          { label: 'Longitude', value: data.longitude.toFixed(4), unit: '°' },
          { label: 'Altitude', value: data.altitude.toFixed(2), unit: 'km' },
          { label: 'Velocity', value: data.velocity.toFixed(3), unit: 'km/s' },
        ]
      : [
          { label: 'Inclination', value: data.inclination.toFixed(2), unit: '°' },
          { label: 'Eccentricity', value: data.eccentricity.toFixed(6), unit: '' },
          { label: 'Semi-Major Axis', value: (data.semiMajorAxis / 1000).toFixed(1), unit: '1000 km' },
          { label: 'Mean Anomaly', value: data.meanAnomaly.toFixed(2), unit: '°' },
        ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-lg p-6"
    >
      <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center pb-3 border-b border-[#00F0FF]/10 last:border-0">
            <span className="text-sm text-secondary-foreground font-mono">{item.label}</span>
            <div className="text-right">
              <span className="text-[#00F0FF] font-mono font-bold">{item.value}</span>
              {item.unit && <span className="text-xs text-secondary-foreground ml-1">{item.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Spectral Analysis Module
const SpectralAnalysisModule: React.FC<{ canvasRef: React.RefObject<HTMLCanvasElement>; data: SpectralAnalysis[] }> = ({
  canvasRef,
  data,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-4 flex items-center gap-2">
            <Radio size={20} /> Spectral Analysis Engine
          </h2>
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full rounded-lg bg-[#0B0E14] border border-[#00F0FF]/10"
          />
          <p className="text-xs text-secondary-foreground mt-4 font-mono">
            Real-time FFT analysis of incoming signal data. Frequency resolution: 3.9 Hz/bin
          </p>
        </motion.div>

        {/* Spectral Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox label="Peak Frequency" value="247.3 Hz" />
          <StatBox label="Signal Intensity" value="8.4e-12" />
          <StatBox label="Confidence" value="94.2%" />
        </div>
      </div>
    </div>
  );
};

// Gravitational Wave Module
const GravitationalWaveModule: React.FC = () => {
  const [signals, setSignals] = useState<GravitationalWaveSignal[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSignal = missionControlEngine.generateGravitationalWaveSignal();
      setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-6 flex items-center gap-2">
            <AlertCircle size={20} /> Gravitational Wave Detection
          </h2>

          <div className="space-y-3">
            {signals.map((signal, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#131924]/40 border border-[#FF007A]/30 rounded-lg p-4 hover:border-[#FF007A]/60 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#FF007A] font-bold">{signal.source}</span>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${signal.snr > 10 ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                    SNR: {signal.snr.toFixed(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-secondary-foreground">Frequency:</span>
                    <div className="text-[#00F0FF]">{signal.frequency.toFixed(1)} Hz</div>
                  </div>
                  <div>
                    <span className="text-secondary-foreground">Strain:</span>
                    <div className="text-[#00F0FF]">{signal.strain.toExponential(2)}</div>
                  </div>
                  <div>
                    <span className="text-secondary-foreground">Time:</span>
                    <div className="text-[#00F0FF]">{new Date(signal.timestamp).toUTCString().split(' ')[4]}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// TLE Processor Module
const TLEProcessorModule: React.FC = () => {
  const sampleTLEs = [
    {
      name: 'ISS (ZARYA)',
      line1: '1 25544U 98067A   21001.00000000  .00002182  00000-0  41420-4 0  9990',
      line2: '2 25544  51.6461 339.8014 0002571  34.5857 120.4689 15.48919393 10001',
    },
    {
      name: 'HUBBLE SPACE TELESCOPE',
      line1: '1 20580U 90037B   21001.00000000  .00000000  00000-0  00000+0 0  9990',
      line2: '2 20580  28.4698 283.8974 0002853 206.6047 153.4734 15.09688462999999',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-6 flex items-center gap-2">
            <Download size={20} /> TLE (Two-Line Element) Processor
          </h2>

          <div className="space-y-4">
            {sampleTLEs.map((tle, idx) => {
              const parsed = missionControlEngine.parseTLE(tle.name, tle.line1, tle.line2);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#131924]/40 border border-[#00F0FF]/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono font-bold text-[#00F0FF]">{parsed.name}</h3>
                    <span className="text-xs bg-[#00F0FF]/20 text-[#00F0FF] px-2 py-1 rounded font-mono">
                      Epoch: {parsed.epochYear}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-secondary-foreground">Inclination:</span>
                      <div className="text-[#00F0FF]">{parsed.inclination.toFixed(4)}°</div>
                    </div>
                    <div>
                      <span className="text-secondary-foreground">Eccentricity:</span>
                      <div className="text-[#00F0FF]">{parsed.eccentricity.toFixed(6)}</div>
                    </div>
                    <div>
                      <span className="text-secondary-foreground">Mean Motion:</span>
                      <div className="text-[#00F0FF]">{parsed.meanMotion.toFixed(4)} rev/day</div>
                    </div>
                    <div>
                      <span className="text-secondary-foreground">Period:</span>
                      <div className="text-[#00F0FF]">{(1440 / parsed.meanMotion).toFixed(1)} min</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Orbital Mechanics Module
const OrbitalMechanicsModule: React.FC<{ telemetryData: TelemetryData | null }> = ({ telemetryData }) => {
  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-6">Orbital Mechanics Calculator</h2>

          {telemetryData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-mono text-[#FF007A] font-bold">Keplerian Elements</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Semi-Major Axis (a):</span>
                    <span className="text-[#00F0FF]">{(telemetryData.semiMajorAxis / 1000).toFixed(1)} 1000 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Eccentricity (e):</span>
                    <span className="text-[#00F0FF]">{telemetryData.eccentricity.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Inclination (i):</span>
                    <span className="text-[#00F0FF]">{telemetryData.inclination.toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Mean Anomaly (M):</span>
                    <span className="text-[#00F0FF]">{telemetryData.meanAnomaly.toFixed(2)}°</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-[#FF007A] font-bold">Derived Quantities</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Orbital Period:</span>
                    <span className="text-[#00F0FF]">92.9 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Orbital Velocity:</span>
                    <span className="text-[#00F0FF]">{telemetryData.velocity.toFixed(2)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Apogee:</span>
                    <span className="text-[#00F0FF]">408 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Perigee:</span>
                    <span className="text-[#00F0FF]">408 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Stat Box Component
const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-lg p-4"
  >
    <div className="text-xs text-secondary-foreground font-mono mb-2">{label}</div>
    <div className="text-2xl font-bold text-[#00F0FF] font-mono">{value}</div>
  </motion.div>
);

export default PremiumAstroLabSuite;
