import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Plus, Trash2, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Body {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

const GRAVITATIONAL_CONSTANT = 6.674e-11;
const SCALE = 1e-8;
const TIME_STEP = 0.01;

export default function AstroLabAstrodynamicsSandboxPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [selectedBody, setSelectedBody] = useState<Body | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [preset, setPreset] = useState<'solar' | 'binary' | 'three' | 'custom'>('solar');
  const [bodies, setBodies] = useState<Body[]>([
    {
      id: 'sun',
      name: 'Sun',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      mass: 1.989e30,
      radius: 696000,
      color: '#F59E0B',
      trail: [],
    },
    {
      id: 'earth',
      name: 'Earth',
      x: 1.496e11,
      y: 0,
      vx: 0,
      vy: 29780,
      mass: 5.972e24,
      radius: 6371,
      color: '#00F0FF',
      trail: [],
    },
    {
      id: 'mars',
      name: 'Mars',
      x: 2.279e11,
      y: 0,
      vx: 0,
      vy: 24070,
      mass: 6.417e23,
      radius: 3389,
      color: '#FF007A',
      trail: [],
    },
  ]);

  const calculateForces = (bodies: Body[]): Array<{ ax: number; ay: number }> => {
    return bodies.map((body, i) => {
      let ax = 0, ay = 0;
      
      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;
        
        const other = bodies[j];
        const dx = other.x - body.x;
        const dy = other.y - body.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        
        if (dist < body.radius + other.radius) continue;
        
        const force = (GRAVITATIONAL_CONSTANT * body.mass * other.mass) / distSq;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        
        ax += fx / body.mass;
        ay += fy / body.mass;
      }
      
      return { ax, ay };
    });
  };

  const updateBodies = (bodies: Body[]): Body[] => {
    const forces = calculateForces(bodies);
    
    return bodies.map((body, i) => {
      const { ax, ay } = forces[i];
      const newVx = body.vx + ax * TIME_STEP;
      const newVy = body.vy + ay * TIME_STEP;
      const newX = body.x + newVx * TIME_STEP;
      const newY = body.y + newVy * TIME_STEP;
      
      const newTrail = [...body.trail, { x: body.x, y: body.y }];
      if (newTrail.length > 300) newTrail.shift();
      
      return {
        ...body,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        trail: newTrail,
      };
    });
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      setBodies(updateBodies);
    }, 30);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0B0E14');
    bgGradient.addColorStop(1, '#131924');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Stars
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 200; i++) {
      const x = Math.sin(i * 12.9898) * 43758.5453 % width;
      const y = Math.cos(i * 78.233) * 43758.5453 % height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    // Draw trails
    if (showTrails) {
      bodies.forEach(body => {
        ctx.strokeStyle = body.color;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        body.trail.forEach((point, idx) => {
          const x = centerX + (point.x * SCALE) / zoomLevel;
          const y = centerY - (point.y * SCALE) / zoomLevel;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    // Draw bodies
    bodies.forEach(body => {
      const x = centerX + (body.x * SCALE) / zoomLevel;
      const y = centerY - (body.y * SCALE) / zoomLevel;
      const radius = Math.max(3, (body.radius * SCALE) / zoomLevel);

      // Glow
      ctx.fillStyle = body.color;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = body.color;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Selection highlight
      if (selectedBody?.id === body.id) {
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = body.color;
      ctx.font = 'bold 11px monospace';
      ctx.globalAlpha = 0.9;
      ctx.fillText(body.name, x + radius + 5, y - 5);
    });

    ctx.globalAlpha = 1;
  }, [bodies, selectedBody, showTrails, zoomLevel]);

  const loadPreset = (presetName: string) => {
    setPreset(presetName as any);
    setTime(0);
    
    if (presetName === 'binary') {
      setBodies([
        {
          id: 'star1',
          name: 'Star A',
          x: -1e11,
          y: 0,
          vx: 0,
          vy: 50000,
          mass: 1.989e30,
          radius: 696000,
          color: '#F59E0B',
          trail: [],
        },
        {
          id: 'star2',
          name: 'Star B',
          x: 1e11,
          y: 0,
          vx: 0,
          vy: -50000,
          mass: 1.989e30,
          radius: 696000,
          color: '#FF007A',
          trail: [],
        },
      ]);
    } else if (presetName === 'three') {
      setBodies([
        {
          id: 'body1',
          name: 'Body 1',
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          mass: 1e30,
          radius: 500000,
          color: '#00F0FF',
          trail: [],
        },
        {
          id: 'body2',
          name: 'Body 2',
          x: 1e11,
          y: 0,
          vx: 0,
          vy: 30000,
          mass: 5e29,
          radius: 400000,
          color: '#F59E0B',
          trail: [],
        },
        {
          id: 'body3',
          name: 'Body 3',
          x: -1e11,
          y: 0,
          vx: 0,
          vy: -30000,
          mass: 5e29,
          radius: 400000,
          color: '#FF007A',
          trail: [],
        },
      ]);
    } else {
      setBodies([
        {
          id: 'sun',
          name: 'Sun',
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          mass: 1.989e30,
          radius: 696000,
          color: '#F59E0B',
          trail: [],
        },
        {
          id: 'earth',
          name: 'Earth',
          x: 1.496e11,
          y: 0,
          vx: 0,
          vy: 29780,
          mass: 5.972e24,
          radius: 6371,
          color: '#00F0FF',
          trail: [],
        },
        {
          id: 'mars',
          name: 'Mars',
          x: 2.279e11,
          y: 0,
          vx: 0,
          vy: 24070,
          mass: 6.417e23,
          radius: 3389,
          color: '#FF007A',
          trail: [],
        },
      ]);
    }
  };

  const stats = selectedBody ? {
    velocity: Math.sqrt(selectedBody.vx ** 2 + selectedBody.vy ** 2),
    distance: Math.sqrt(selectedBody.x ** 2 + selectedBody.y ** 2),
    kineticEnergy: 0.5 * selectedBody.mass * (selectedBody.vx ** 2 + selectedBody.vy ** 2),
  } : null;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/astrolab')} className="p-2 hover:bg-[#131924] rounded-lg transition">
                <ArrowLeft size={20} className="text-[#00F0FF]" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Astrodynamics Sandbox</h1>
                <p className="text-secondary-foreground text-sm">N-body gravitational simulation engine</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  onClick={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = 400;
                    const centerY = 300;
                    
                    bodies.forEach(body => {
                      const bodyX = centerX + (body.x * SCALE) / zoomLevel;
                      const bodyY = centerY - (body.y * SCALE) / zoomLevel;
                      if (Math.hypot(x - bodyX, y - bodyY) < 20) {
                        setSelectedBody(body);
                      }
                    });
                  }}
                  className="w-full cursor-crosshair"
                />
              </div>

              {/* Controls */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/30 transition font-mono text-sm"
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isRunning ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => {
                    setTime(0);
                    setBodies(b => b.map(body => ({ ...body, trail: [] })));
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] rounded-lg hover:bg-[#FF007A]/30 transition font-mono text-sm"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={() => setShowTrails(!showTrails)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition font-mono text-sm ${
                    showTrails
                      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
                      : 'bg-[#475569]/20 text-secondary-foreground border-[#475569]'
                  }`}
                >
                  Trails
                </button>
                <button
                  onClick={() => setZoomLevel(Math.min(5, zoomLevel + 0.5))}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA] rounded-lg hover:bg-[#A78BFA]/30 transition font-mono text-sm"
                >
                  Zoom: {zoomLevel.toFixed(1)}x
                </button>
              </div>

              {/* Presets */}
              <div className="mt-4 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Simulation Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['solar', 'binary', 'three', 'custom'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => loadPreset(p)}
                      className={`px-3 py-2 rounded text-xs font-mono transition ${
                        preset === p
                          ? 'bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]'
                          : 'bg-[#0B0E14]/50 text-secondary-foreground border border-[#475569] hover:border-[#00F0FF]'
                      }`}
                    >
                      {p === 'solar' && 'Solar System'}
                      {p === 'binary' && 'Binary Stars'}
                      {p === 'three' && 'Three Body'}
                      {p === 'custom' && 'Custom'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* Bodies List */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Bodies</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bodies.map(body => (
                    <button
                      key={body.id}
                      onClick={() => setSelectedBody(body)}
                      className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition ${
                        selectedBody?.id === body.id
                          ? 'bg-[#00F0FF]/30 border border-[#00F0FF] text-[#00F0FF]'
                          : 'bg-[#0B0E14]/50 border border-[#475569] text-secondary-foreground hover:border-[#00F0FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: body.color }} />
                        <span>{body.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Body Details */}
              {selectedBody && stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4"
                >
                  <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">{selectedBody.name}</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Mass:</span>
                      <span className="text-[#00F0FF]">{(selectedBody.mass / 1e24).toFixed(2)}e24 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Velocity:</span>
                      <span className="text-[#FF007A]">{(stats.velocity / 1000).toFixed(1)} km/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">Distance:</span>
                      <span className="text-[#F59E0B]">{(stats.distance / 1e11).toFixed(2)} AU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-foreground">KE:</span>
                      <span className="text-[#A78BFA]">{(stats.kineticEnergy / 1e33).toFixed(2)}e33 J</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Simulation Stats */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                  <BarChart3 size={14} />
                  Simulation
                </h3>
                <div className="space-y-2 text-xs font-mono text-secondary-foreground">
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="text-[#00F0FF]">{(time * 0.03).toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bodies:</span>
                    <span className="text-[#00F0FF]">{bodies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-[#10B981]">{isRunning ? 'Running' : 'Paused'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
