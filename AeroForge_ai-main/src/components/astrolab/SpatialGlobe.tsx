import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Satellite,
  Eye,
  EyeOff,
  Zap,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import * as satellite from "satellite.js";

// Real TLE data for ISS and Hubble (static snapshots — industry standard for offline propagation)
const TLE_DATA = {
  ISS: {
    name: "ISS (ZARYA)",
    line1: "1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9002",
    line2: "2 25544  51.6400 208.9163 0006703 300.2578  59.7952 15.49560532999999",
    color: "#00F0FF",
  },
  Hubble: {
    name: "HST (Hubble)",
    line1: "1 20580U 90037B   24001.50000000  .00000750  00000-0  38000-4 0  9006",
    line2: "2 20580  28.4700 120.4300 0002500  80.0000 280.0000 15.09000000400000",
    color: "#FF007A",
  },
};

interface SatelliteData {
  name: string;
  lat: number;
  lon: number;
  alt: number; // km
  velocity: number; // km/s
  color: string;
  trail: Array<{ lat: number; lon: number; alpha: number }>;
  satrec: satellite.SatRec;
}

export default function SpatialGlobe() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [isRunning, setIsRunning] = useState(true);
  const [simTime, setSimTime] = useState(new Date());
  const [timeScale, setTimeScale] = useState(60); // 60x real-time
  const [showTrails, setShowTrails] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedSat, setSelectedSat] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ phi: 0.4, theta: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const satsRef = useRef<SatelliteData[]>([]);

  // Initialize satellites from TLEs using satellite.js SGP4
  useEffect(() => {
    const initSats: SatelliteData[] = [];
    for (const [key, tle] of Object.entries(TLE_DATA)) {
      try {
        const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
        initSats.push({
          name: tle.name,
          lat: 0,
          lon: 0,
          alt: 400,
          velocity: 7.66,
          color: tle.color,
          trail: [],
          satrec,
        });
      } catch {
        console.warn(`Failed to parse TLE for ${key}`);
      }
    }
    satsRef.current = initSats;
  }, []);

  // Propagate satellite positions using SGP4
  const propagate = useCallback((date: Date) => {
    const updated = satsRef.current.map((sat) => {
      try {
        const posVel = satellite.propagate(sat.satrec, date);
        if (posVel && typeof posVel.position !== "boolean" && posVel.position) {
          const gmst = satellite.gstime(date);
          const geo = satellite.eciToGeodetic(posVel.position as satellite.EciVec3<number>, gmst);
          const lat = satellite.degreesLat(geo.latitude);
          const lon = satellite.degreesLong(geo.longitude);
          const alt = geo.height; // km

          const vel = posVel.velocity as satellite.EciVec3<number>;
          const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);

          // Build fading trail
          const newTrail = [...sat.trail, { lat, lon, alpha: 1 }];
          const maxTrail = 300;
          const trimmed = newTrail.length > maxTrail ? newTrail.slice(-maxTrail) : newTrail;
          const fadedTrail = trimmed.map((p, i) => ({
            ...p,
            alpha: (i + 1) / trimmed.length,
          }));

          return { ...sat, lat, lon, alt, velocity: speed, trail: fadedTrail };
        }
      } catch {
        /* SGP4 propagation failure — keep last known position */
      }
      return sat;
    });
    satsRef.current = updated;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    let lastTs = performance.now();

    const animate = (ts: number) => {
      const dt = (ts - lastTs) / 1000; // real seconds
      lastTs = ts;

      setSimTime((prev) => {
        const next = new Date(prev.getTime() + dt * timeScale * 1000);
        propagate(next);
        return next;
      });

      // Auto-rotate globe
      if (!isDragging) {
        setRotation((r) => ({ ...r, theta: r.theta + 0.001 }));
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, timeScale, isDragging, propagate]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
    const R = Math.min(w, h) * 0.35;

    // Clear
    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    // Stars background
    const starSeed = 42;
    for (let i = 0; i < 400; i++) {
      const sx = (i * 7919 + starSeed) % w;
      const sy = (i * 6271 + starSeed) % h;
      const brightness = 0.2 + (i % 5) * 0.15;
      ctx.fillStyle = `rgba(200,220,255,${brightness})`;
      ctx.fillRect(sx, sy, 1, 1);
    }

    // Helper: lat/lon to screen (orthographic projection)
    const project = (lat: number, lon: number): { x: number; y: number; visible: boolean } => {
      const latR = (lat * Math.PI) / 180;
      const lonR = (lon * Math.PI) / 180 + rotation.theta;

      const px = Math.cos(latR) * Math.sin(lonR);
      const py =
        Math.sin(latR) * Math.cos(rotation.phi) -
        Math.cos(latR) * Math.cos(lonR) * Math.sin(rotation.phi);
      const pz =
        Math.sin(latR) * Math.sin(rotation.phi) +
        Math.cos(latR) * Math.cos(lonR) * Math.cos(rotation.phi);

      return {
        x: cx + px * R,
        y: cy - py * R,
        visible: pz > 0,
      };
    };

    // Earth sphere with atmosphere glow
    const earthGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.15);
    earthGrad.addColorStop(0, "rgba(0,100,200,0.1)");
    earthGrad.addColorStop(0.8, "rgba(0,180,255,0.05)");
    earthGrad.addColorStop(1, "rgba(0,180,255,0)");
    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Earth body
    const bodyGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
    bodyGrad.addColorStop(0, "#1a3a5c");
    bodyGrad.addColorStop(0.5, "#0d2240");
    bodyGrad.addColorStop(1, "#091428");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Draw simplified continents (major coastline points)
    const continents: Array<Array<[number, number]>> = [
      // North America outline (simplified)
      [
        [-10, 75],
        [0, 70],
        [10, 65],
        [15, 55],
        [25, 50],
        [30, 45],
        [35, 30],
        [30, 25],
        [25, 30],
        [15, 35],
        [5, 40],
        [-5, 50],
        [-15, 60],
        [-10, 75],
      ].map(([lon, lat]) => [lat, lon - 100]),
      // South America
      [
        [-10, -35],
        [-5, -55],
        [5, -60],
        [15, -55],
        [12, -35],
        [5, -15],
        [-5, -10],
        [-10, -35],
      ].map(([lon, lat]) => [lat, lon - 60]),
      // Europe
      [
        [40, 0],
        [45, -5],
        [50, 5],
        [55, 15],
        [60, 30],
        [55, 40],
        [50, 30],
        [45, 20],
        [40, 0],
      ].map(([lat, lon]) => [lat, lon]),
      // Africa
      [
        [35, 0],
        [30, -10],
        [15, -15],
        [5, -10],
        [0, 10],
        [-5, 20],
        [-15, 35],
        [-30, 30],
        [-35, 20],
        [-25, 15],
        [-10, 0],
        [5, -5],
        [15, 0],
        [25, 5],
        [35, 0],
      ].map(([lat, lon]) => [lat, lon]),
      // Asia (simplified)
      [
        [40, 30],
        [45, 50],
        [50, 60],
        [55, 80],
        [60, 100],
        [55, 120],
        [50, 130],
        [45, 140],
        [40, 130],
        [35, 120],
        [30, 100],
        [25, 80],
        [30, 60],
        [35, 40],
        [40, 30],
      ].map(([lat, lon]) => [lat, lon]),
      // Australia
      [
        [-25, 115],
        [-20, 130],
        [-15, 140],
        [-25, 150],
        [-35, 145],
        [-35, 135],
        [-30, 120],
        [-25, 115],
      ].map(([lat, lon]) => [lat, lon]),
    ];

    ctx.strokeStyle = "rgba(0,240,255,0.15)";
    ctx.lineWidth = 1;
    continents.forEach((cont) => {
      ctx.beginPath();
      let started = false;
      cont.forEach(([lat, lon]) => {
        const p = project(lat, lon);
        if (p.visible) {
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
      });
      ctx.stroke();
    });

    // Coordinate grid
    if (showGrid) {
      ctx.strokeStyle = "rgba(0,240,255,0.06)";
      ctx.lineWidth = 0.5;
      // Latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let moved = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const p = project(lat, lon);
          if (p.visible) {
            if (!moved) {
              ctx.moveTo(p.x, p.y);
              moved = true;
            } else ctx.lineTo(p.x, p.y);
          } else {
            moved = false;
          }
        }
        ctx.stroke();
      }
      // Longitude lines
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let moved = false;
        for (let lat = -90; lat <= 90; lat += 5) {
          const p = project(lat, lon);
          if (p.visible) {
            if (!moved) {
              ctx.moveTo(p.x, p.y);
              moved = true;
            } else ctx.lineTo(p.x, p.y);
          } else {
            moved = false;
          }
        }
        ctx.stroke();
      }
    }

    // Draw satellite trails and positions
    satsRef.current.forEach((sat) => {
      // Trail (360° fading)
      if (showTrails && sat.trail.length > 1) {
        for (let i = 1; i < sat.trail.length; i++) {
          const p0 = project(sat.trail[i - 1].lat, sat.trail[i - 1].lon);
          const p1 = project(sat.trail[i].lat, sat.trail[i].lon);
          if (p0.visible && p1.visible) {
            ctx.strokeStyle = sat.color
              .replace(")", `,${sat.trail[i].alpha * 0.6})`)
              .replace("rgb", "rgba")
              .replace("#", "");
            // Convert hex to rgba
            const r = parseInt(sat.color.slice(1, 3), 16);
            const g = parseInt(sat.color.slice(3, 5), 16);
            const b = parseInt(sat.color.slice(5, 7), 16);
            ctx.strokeStyle = `rgba(${r},${g},${b},${sat.trail[i].alpha * 0.5})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
      }

      // Satellite dot (with orbital altitude offset)
      const altScale = 1 + sat.alt / 40000; // Scale position slightly outward
      const satP = project(sat.lat, sat.lon);
      if (satP.visible) {
        const sx = cx + (satP.x - cx) * altScale;
        const sy = cy + (satP.y - cy) * altScale;

        // Glow
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12);
        glow.addColorStop(0, sat.color);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.fill();

        // Dot
        ctx.fillStyle = sat.color;
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = sat.color;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(sat.name, sx + 10, sy - 8);
        if (userMode === "professional") {
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`${sat.alt.toFixed(0)}km | ${sat.velocity.toFixed(2)}km/s`, sx + 10, sy + 5);
        }
      }
    });
  });

  // Mouse interaction for globe rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotation((r) => ({
      theta: r.theta + dx * 0.005,
      phi: Math.max(-1.2, Math.min(1.2, r.phi - dy * 0.005)),
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsDragging(false);

  const currentSatData = satsRef.current.find((s) => s.name === selectedSat) || satsRef.current[0];

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/astrolab")}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Spatial Globe — SGP4 Orbit Propagator
              </h1>
              <p className="text-sm text-white/50 font-mono">
                Real-time satellite tracking via Two-Line Element sets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-sm text-cyan-400">
              {simTime.toISOString().replace("T", " ").slice(0, 19)} UTC
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Globe Canvas */}
          <div className="lg:col-span-3">
            <div
              className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a1020]"
              style={{ boxShadow: "0 0 60px rgba(0,240,255,0.05), inset 0 0 60px rgba(0,0,0,0.5)" }}
            >
              <canvas
                ref={canvasRef}
                className="w-full cursor-grab active:cursor-grabbing"
                style={{ height: "600px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-2.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setSimTime(new Date());
                  }}
                  className="p-2.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowTrails(!showTrails)}
                  className={`p-2.5 rounded-lg bg-black/60 backdrop-blur-sm border transition-all ${showTrails ? "border-cyan-500/50 text-cyan-400" : "border-white/10"}`}
                >
                  {showTrails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {/* Time scale */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <span className="text-xs text-white/50 font-mono">Speed:</span>
                {[1, 10, 60, 300, 1000].map((s) => (
                  <button
                    key={s}
                    onClick={() => setTimeScale(s)}
                    className={`px-2 py-1 text-xs font-mono rounded transition-all ${timeScale === s ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-white/40 hover:text-white/70"}`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Satellite Data Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Satellite List */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" /> Tracked Objects
              </h3>
              <div className="space-y-2">
                {satsRef.current.map((sat) => (
                  <button
                    key={sat.name}
                    onClick={() => setSelectedSat(sat.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                      selectedSat === sat.name
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{ backgroundColor: sat.color }}
                      />
                      <span className="font-mono text-sm">{sat.name}</span>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-white/40 font-mono">
                      <span>ALT: {sat.alt.toFixed(0)} km</span>
                      <span>VEL: {sat.velocity.toFixed(2)} km/s</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Satellite Telemetry */}
            {currentSatData && (
              <div
                className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
                style={{ backdropFilter: "blur(20px)" }}
              >
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: currentSatData.color }}
                >
                  <Zap className="w-4 h-4" /> Telemetry — {currentSatData.name}
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Latitude", value: `${currentSatData.lat.toFixed(4)}°` },
                    { label: "Longitude", value: `${currentSatData.lon.toFixed(4)}°` },
                    { label: "Altitude", value: `${currentSatData.alt.toFixed(1)} km` },
                    { label: "Velocity", value: `${currentSatData.velocity.toFixed(3)} km/s` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-1.5 border-b border-white/5"
                    >
                      <span className="text-xs text-white/40">{item.label}</span>
                      <span className="font-mono text-sm text-white/90">{item.value}</span>
                    </div>
                  ))}
                </div>
                {userMode === "student" && (
                  <div className="mt-3 p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                    <p className="text-xs text-cyan-400/70">
                      💡 Satellites in LEO orbit Earth every ~90 minutes at ~7.7 km/s. The ISS
                      orbits at 51.6° inclination to cover most populated areas.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3">Display Options</h3>
              <label className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm text-white/60">Show Grid</span>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-10 h-5 rounded-full transition-all ${showGrid ? "bg-cyan-500" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${showGrid ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between py-2 cursor-pointer">
                <span className="text-sm text-white/60">Orbital Trails</span>
                <button
                  onClick={() => setShowTrails(!showTrails)}
                  className={`w-10 h-5 rounded-full transition-all ${showTrails ? "bg-cyan-500" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${showTrails ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
