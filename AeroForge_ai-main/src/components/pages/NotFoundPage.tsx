import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Compass, FolderOpen, Wind, Wrench, Radio, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('404 — Signal Lost', 'Requested telemetry channel not found or out of range.');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radar grid lines
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;

      const step = 40;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Sweeping radar arc
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) * 0.8;

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Sweeping line
      const angle = t * 0.02;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060B18] flex flex-col relative overflow-hidden">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg relative z-20"
        >
          {/* Telemetry Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono mb-6">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            TELEMETRY SIGNAL LOST // ERROR 404
          </div>

          <h1 className="text-7xl font-extrabold text-white mb-2 font-mono tracking-tighter">
            404
          </h1>
          <h2 className="text-xl font-bold text-white/80 mb-3">
            Vector Not Found
          </h2>
          <p className="text-sm text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
            The target coordinates or telemetry path do not exist in the active domain. Check parameters or return to mission control.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link to="/">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-mono transition-all">
                <Home className="w-4 h-4" />
                Return to Mission Control
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-xs font-mono transition-all">
                <Compass className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
          </div>

          {/* Quick Navigation Card */}
          <div className="p-5 bg-[#0A1020]/90 backdrop-blur border border-white/10 rounded-xl text-left">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-white/70 font-mono uppercase tracking-wider">Available Laboratories</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/aerolab" className="flex items-center gap-2 p-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-cyan-300 font-mono transition-all">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                AeroLab (20 Tools)
              </Link>
              <Link to="/mechlab" className="flex items-center gap-2 p-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-amber-300 font-mono transition-all">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                MechLab (20 Tools)
              </Link>
              <Link to="/astrolab" className="flex items-center gap-2 p-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-purple-300 font-mono transition-all">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                AstroLab (14 Tools)
              </Link>
              <Link to="/projects" className="flex items-center gap-2 p-2 rounded bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-green-300 font-mono transition-all">
                <FolderOpen className="w-3.5 h-3.5 text-green-400" />
                Projects System
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

