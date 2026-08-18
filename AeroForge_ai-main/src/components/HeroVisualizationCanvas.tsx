import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Sliders } from 'lucide-react';
import { generateNACA4Digit } from '@/services/physicsEngine';

export default function HeroVisualizationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aoa, setAoa] = useState(4); // degrees
  const [speed, setSpeed] = useState(60); // m/s
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };

    // Dynamic AoA adjustment based on mouse Y relative to center
    const centerY = rect.height / 2;
    const normY = (centerY - y) / centerY; // -1 to 1
    const dynamicAoA = Math.round(normY * 12);
    setAoa(Math.max(-4, Math.min(16, dynamicAoA)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Streamline particles
    const numStreamlines = 28;
    interface StreamParticle {
      x: number;
      y: number;
      speedMult: number;
      lineIdx: number;
    }
    const particles: StreamParticle[] = [];

    for (let i = 0; i < 220; i++) {
      particles.push({
        x: Math.random() * w,
        y: (Math.floor(Math.random() * numStreamlines) / numStreamlines) * h,
        speedMult: 0.85 + Math.random() * 0.35,
        lineIdx: Math.floor(Math.random() * numStreamlines),
      });
    }

    const nacaGeo = generateNACA4Digit('2412', 60);

    const draw = () => {
      ctx.fillStyle = '#050914';
      ctx.fillRect(0, 0, w, h);

      // Engineering grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 0.5;
      const step = 32;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Airfoil parameters
      const cx = w * 0.45;
      const cy = h * 0.52;
      const chordLen = Math.min(w * 0.35, 230);
      const radAoa = (aoa * Math.PI) / 180;

      // Draw streamlines
      const flowVx = (speed / 40) * 2;
      for (let i = 0; i < numStreamlines; i++) {
        const baseY = (i / numStreamlines) * h + 8;
        ctx.beginPath();
        ctx.strokeStyle = i < numStreamlines / 2 ? 'rgba(0, 240, 255, 0.22)' : 'rgba(59, 130, 246, 0.22)';
        ctx.lineWidth = 1;

        for (let x = 0; x <= w; x += 12) {
          // Deflection around airfoil
          const dx = x - cx;
          const dy = baseY - cy;
          const distSq = dx * dx + dy * dy;
          let defY = 0;

          if (distSq < chordLen * chordLen * 1.6) {
            const influence = Math.exp(-distSq / (chordLen * chordLen * 0.42));
            defY = -Math.sin(radAoa) * influence * 42 - (baseY < cy ? 16 : -16) * influence;
          }

          const y = baseY + defY;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Update & draw particles
      if (!isPaused) t += 1;

      for (const p of particles) {
        if (!isPaused) {
          p.x += flowVx * p.speedMult;
          if (p.x > w) p.x = 0;
        }

        const baseY = (p.lineIdx / numStreamlines) * h + 8;
        const dx = p.x - cx;
        const dy = baseY - cy;
        const distSq = dx * dx + dy * dy;
        let defY = 0;

        if (distSq < chordLen * chordLen * 1.6) {
          const influence = Math.exp(-distSq / (chordLen * chordLen * 0.42));
          defY = -Math.sin(radAoa) * influence * 42 - (baseY < cy ? 16 : -16) * influence;
        }

        const py = baseY + defY;

        ctx.fillStyle = baseY < cy ? '#00F0FF' : '#3B82F6';
        ctx.beginPath();
        ctx.arc(p.x, py, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Airfoil
      if (nacaGeo) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-radAoa);

        // Pressure distribution glow
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, chordLen);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, chordLen * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Upper surface (Suction side - Cyan)
        ctx.beginPath();
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2.5;
        nacaGeo.upper.forEach((pt, idx) => {
          const px = (pt.x - 0.25) * chordLen;
          const py = -pt.y * chordLen;
          idx === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Lower surface (Pressure side - Blue)
        ctx.beginPath();
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2.5;
        nacaGeo.lower.forEach((pt, idx) => {
          const px = (pt.x - 0.25) * chordLen;
          const py = -pt.y * chordLen;
          idx === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Chord reference line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(-0.25 * chordLen, 0);
        ctx.lineTo(0.75 * chordLen, 0);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      // Telemetry Overlay
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`FLOW VECTOR: ${speed} m/s`, 16, 24);
      ctx.fillText(`ANGLE OF ATTACK: ${aoa}° ${isHovered ? '(CURSOR DYNAMIC)' : ''}`, 16, 38);
      ctx.fillText(`AIRFOIL: NACA 2412`, 16, 52);

      // Scientific Disclaimer Label
      ctx.fillStyle = '#F59E0B';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`REDUCED-ORDER POTENTIAL FLOW SIMULATION`, w - 230, 24);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [aoa, speed, isPaused, isHovered]);

  return (
    <div className="bg-[#0B1220] border border-white/10 rounded-xl overflow-hidden relative shadow-2xl">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full block cursor-crosshair"
        style={{ height: 340 }}
      />

      {/* Control Bar */}
      <div className="bg-[#060B18]/90 border-t border-white/10 px-4 py-3 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-white/50">AoA (α):</span>
            <input
              type="range"
              min="-5"
              max="18"
              value={aoa}
              onChange={(e) => setAoa(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span className="text-cyan-300 font-bold w-8">{aoa}°</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/50">Speed:</span>
            <input
              type="range"
              min="10"
              max="150"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span className="text-cyan-300 font-bold w-12">{speed} m/s</span>
          </div>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 transition-colors"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
}
