import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import { solveKeplerianOrbit, CENTRAL_BODIES, type KeplerianSolution } from '@/services/physicsEngine';

export default function OrbitalMechanics() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [semiMajorAxis, setSemiMajorAxis] = useState(7000); // km
  const [eccentricity, setEccentricity] = useState(0.1);
  const [inclination, setInclination] = useState(28.5); // degrees
  const [centralBody, setCentralBody] = useState<keyof typeof CENTRAL_BODIES>('Earth');
  const [animAngle, setAnimAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Solve orbit
  const solution = useMemo(() =>
    solveKeplerianOrbit(semiMajorAxis * 1000, eccentricity, centralBody, inclination),
    [semiMajorAxis, eccentricity, centralBody, inclination]
  );

  // Animate orbiting body
  useEffect(() => {
    if (!isAnimating || !solution) return;
    const interval = setInterval(() => {
      setAnimAngle((a) => (a + solution.meanMotion * 500) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(interval);
  }, [isAnimating, solution]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !solution) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;

    // Clear
    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Scale to fit
    const maxDist = solution.apoapsis;
    const scale = (Math.min(w, h) * 0.38) / maxDist;

    const body = CENTRAL_BODIES[centralBody];
    const bodyScreenR = Math.max(8, body.radius * scale);

    // Central body
    const bodyGrad = ctx.createRadialGradient(cx - bodyScreenR * 0.3, cy - bodyScreenR * 0.3, 0, cx, cy, bodyScreenR);
    bodyGrad.addColorStop(0, '#3a7cc8');
    bodyGrad.addColorStop(1, '#1a3a6c');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, bodyScreenR, 0, Math.PI * 2);
    ctx.fill();

    // Atmosphere glow
    const atmoGrad = ctx.createRadialGradient(cx, cy, bodyScreenR, cx, cy, bodyScreenR * 1.3);
    atmoGrad.addColorStop(0, 'rgba(0,180,255,0.15)');
    atmoGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = atmoGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, bodyScreenR * 1.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(body.name, cx, cy + 3);

    // Draw orbital ellipse
    ctx.strokeStyle = 'rgba(0,240,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const pts = solution.ellipsePoints;
    for (let i = 0; i < pts.length; i++) {
      const sx = cx + pts[i].x * scale;
      const sy = cy - pts[i].y * scale;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.stroke();

    // Periapsis marker
    const periX = cx + solution.periapsis * scale;
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(periX, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10B981';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Pe', periX + 8, cy - 5);

    // Apoapsis marker
    const apoX = cx - solution.apoapsis * scale;
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(apoX, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'right';
    ctx.fillText('Ap', apoX - 8, cy - 5);

    // Semi-major axis line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(apoX, cy);
    ctx.lineTo(periX, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated orbiting body
    const a = solution.semiMajorAxis;
    const e = solution.eccentricity;
    const b = a * Math.sqrt(1 - e * e);
    const f = a * e;
    const bx = a * Math.cos(animAngle) - f;
    const by = b * Math.sin(animAngle);
    const satX = cx + bx * scale;
    const satY = cy - by * scale;

    // Velocity vector
    const r = Math.sqrt(bx * bx + by * by);
    const mu = CENTRAL_BODIES[centralBody].mu;
    const vMag = Math.sqrt(mu * (2 / r - 1 / a));
    const vAngle = animAngle + Math.PI / 2 + e * Math.sin(animAngle) * 0.3;
    const vScale = Math.min(30, vMag / 2000);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(satX, satY);
    ctx.lineTo(satX + Math.cos(vAngle) * vScale, satY - Math.sin(vAngle) * vScale);
    ctx.stroke();

    // Arrowhead
    const arrowAngle = Math.PI / 6;
    const arrowLen = 6;
    const ax = satX + Math.cos(vAngle) * vScale;
    const ay = satY - Math.sin(vAngle) * vScale;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - arrowLen * Math.cos(vAngle - arrowAngle), ay + arrowLen * Math.sin(vAngle - arrowAngle));
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - arrowLen * Math.cos(vAngle + arrowAngle), ay + arrowLen * Math.sin(vAngle + arrowAngle));
    ctx.stroke();

    // Satellite glow
    const satGlow = ctx.createRadialGradient(satX, satY, 0, satX, satY, 12);
    satGlow.addColorStop(0, '#00F0FF80');
    satGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = satGlow;
    ctx.beginPath();
    ctx.arc(satX, satY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00F0FF';
    ctx.beginPath();
    ctx.arc(satX, satY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'start';
  }, [solution, animAngle, centralBody]);

  const formatTime = (seconds: number): string => {
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} hr`;
    return `${(seconds / 86400).toFixed(2)} days`;
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/astrolab')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Orbital Mechanics — Keplerian Solver
            </h1>
            <p className="text-sm text-white/50 font-mono">Complete orbital elements · Vis-viva velocity · Dynamic 2D ellipse</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            {/* Keplerian Elements */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3">Orbital Elements</h3>
              
              <div className="mb-4">
                <label className="text-xs text-white/40 block mb-1">Central Body</label>
                <div className="grid grid-cols-5 gap-1">
                  {(Object.keys(CENTRAL_BODIES) as Array<keyof typeof CENTRAL_BODIES>).map((b) => (
                    <button key={b} onClick={() => setCentralBody(b)}
                      className={`px-2 py-1.5 text-xs font-mono rounded transition-all ${
                        centralBody === b ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white/40 border border-white/5'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Semi-Major Axis (km)', value: semiMajorAxis, set: setSemiMajorAxis, min: CENTRAL_BODIES[centralBody].radius / 1000 + 100, max: centralBody === 'Sun' ? 1e9 : 100000, step: 100 },
                { label: 'Eccentricity', value: eccentricity, set: setEccentricity, min: 0, max: 0.99, step: 0.01 },
                { label: 'Inclination (°)', value: inclination, set: setInclination, min: 0, max: 180, step: 0.5 },
              ].map((param) => (
                <div key={param.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">{param.label}</span>
                    <span className="font-mono text-cyan-400">{typeof param.value === 'number' && param.value < 1 ? param.value.toFixed(3) : param.value.toLocaleString()}</span>
                  </div>
                  <input type="range" min={param.min} max={param.max} step={param.step} value={param.value}
                    onChange={(e) => param.set(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer" />
                </div>
              ))}
            </div>

            {/* Animation Control */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Animation</span>
                <button onClick={() => setIsAnimating(!isAnimating)}
                  className={`w-10 h-5 rounded-full transition-all ${isAnimating ? 'bg-cyan-500' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAnimating ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {userMode === 'student' && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-xs text-emerald-400/80">
                  💡 <strong>Keplerian Orbits:</strong> The semi-major axis determines the orbit size and period. Eccentricity controls the shape (0 = circle, close to 1 = very elongated). The yellow arrow shows the velocity vector — it's fastest at periapsis (closest approach) and slowest at apoapsis.
                </p>
              </div>
            )}
          </div>

          {/* Orbital Ellipse Canvas */}
          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden border border-white/10" style={{ boxShadow: '0 0 40px rgba(0,240,255,0.05)' }}>
              <canvas ref={canvasRef} className="w-full aspect-square" />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {solution ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
                <h3 className="text-sm font-semibold text-cyan-400 mb-3">Orbital Parameters</h3>
                <div className="space-y-1.5">
                  {[
                    { l: 'Perigee Altitude', v: `${(solution.periapsisAltitude / 1000).toFixed(1)} km`, c: '#10B981' },
                    { l: 'Apogee Altitude', v: `${(solution.apoapsisAltitude / 1000).toFixed(1)} km`, c: '#EF4444' },
                    { l: 'Orbital Period', v: formatTime(solution.orbitalPeriod), c: '#00F0FF' },
                    { l: 'Periapsis Velocity', v: `${(solution.periapsisVelocity / 1000).toFixed(3)} km/s`, c: '#10B981' },
                    { l: 'Apoapsis Velocity', v: `${(solution.apoapsisVelocity / 1000).toFixed(3)} km/s`, c: '#EF4444' },
                    { l: 'Specific Energy', v: `${solution.specificEnergy.toExponential(4)} J/kg`, c: '#F59E0B' },
                    { l: 'Angular Momentum', v: `${solution.angularMomentum.toExponential(4)} m²/s`, c: '#A78BFA' },
                    { l: 'Mean Motion', v: `${(solution.meanMotion * 180 / Math.PI).toFixed(6)} °/s`, c: '#06B6D4' },
                  ].map((row) => (
                    <div key={row.l} className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-xs text-white/40">{row.l}</span>
                      <span className="font-mono text-sm font-bold" style={{ color: row.c }}>{row.v}</span>
                    </div>
                  ))}
                </div>

                {solution.periapsisAltitude < 0 && (
                  <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400">⚠️ Periapsis is below the surface! This orbit would impact {centralBody}.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-6 text-center">
                <p className="text-sm text-white/40">Invalid orbital parameters</p>
              </div>
            )}

            {userMode === 'professional' && solution && (
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
                <h3 className="text-xs font-semibold text-white/40 mb-2">Vis-Viva & Kepler</h3>
                <div className="text-xs font-mono text-white/30 leading-relaxed space-y-1">
                  <p>v² = μ(2/r − 1/a)</p>
                  <p>T = 2π√(a³/μ)</p>
                  <p>ε = −μ/2a = {solution.specificEnergy.toExponential(4)} J/kg</p>
                  <p>h = √(μa(1−e²)) = {solution.angularMomentum.toExponential(4)} m²/s</p>
                  <p>r_p = a(1−e) = {(solution.periapsis / 1000).toFixed(1)} km</p>
                  <p>r_a = a(1+e) = {(solution.apoapsis / 1000).toFixed(1)} km</p>
                  <p>v_p = {(solution.periapsisVelocity).toFixed(2)} m/s</p>
                  <p>v_a = {(solution.apoapsisVelocity).toFixed(2)} m/s</p>
                  <p>n = 2π/T = {solution.meanMotion.toExponential(6)} rad/s</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
