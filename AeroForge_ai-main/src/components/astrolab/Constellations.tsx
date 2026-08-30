import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Satellite, Radio, Globe2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";

interface ConstellationShell {
  name: string;
  operator: string;
  regime: "LEO" | "MEO" | "GEO";
  color: string;
  altitudeMin: number; // km
  altitudeMax: number; // km
  altitudeAvg: number; // km
  activePayloads: number;
  inclination: number; // degrees
  planes: number;
  satsPerPlane: number;
}

const CONSTELLATIONS: ConstellationShell[] = [
  {
    name: "Starlink",
    operator: "SpaceX",
    regime: "LEO",
    color: "#00F0FF",
    altitudeMin: 340,
    altitudeMax: 614,
    altitudeAvg: 550,
    activePayloads: 5600,
    inclination: 53,
    planes: 72,
    satsPerPlane: 22,
  },
  {
    name: "OneWeb",
    operator: "Eutelsat OneWeb",
    regime: "LEO",
    color: "#06B6D4",
    altitudeMin: 1200,
    altitudeMax: 1200,
    altitudeAvg: 1200,
    activePayloads: 634,
    inclination: 87.9,
    planes: 18,
    satsPerPlane: 36,
  },
  {
    name: "Iridium NEXT",
    operator: "Iridium",
    regime: "LEO",
    color: "#22D3EE",
    altitudeMin: 780,
    altitudeMax: 780,
    altitudeAvg: 780,
    activePayloads: 66,
    inclination: 86.4,
    planes: 6,
    satsPerPlane: 11,
  },
  {
    name: "GPS",
    operator: "US Space Force",
    regime: "MEO",
    color: "#F59E0B",
    altitudeMin: 20180,
    altitudeMax: 20220,
    altitudeAvg: 20200,
    activePayloads: 31,
    inclination: 55,
    planes: 6,
    satsPerPlane: 4,
  },
  {
    name: "Galileo",
    operator: "ESA",
    regime: "MEO",
    color: "#D97706",
    altitudeMin: 23222,
    altitudeMax: 23222,
    altitudeAvg: 23222,
    activePayloads: 28,
    inclination: 56,
    planes: 3,
    satsPerPlane: 10,
  },
  {
    name: "GLONASS",
    operator: "Roscosmos",
    regime: "MEO",
    color: "#FBBF24",
    altitudeMin: 19100,
    altitudeMax: 19100,
    altitudeAvg: 19100,
    activePayloads: 24,
    inclination: 64.8,
    planes: 3,
    satsPerPlane: 8,
  },
  {
    name: "Inmarsat",
    operator: "Inmarsat/Viasat",
    regime: "GEO",
    color: "#A78BFA",
    altitudeMin: 35786,
    altitudeMax: 35786,
    altitudeAvg: 35786,
    activePayloads: 14,
    inclination: 0,
    planes: 1,
    satsPerPlane: 14,
  },
  {
    name: "SES",
    operator: "SES S.A.",
    regime: "GEO",
    color: "#8B5CF6",
    altitudeMin: 35786,
    altitudeMax: 35786,
    altitudeAvg: 35786,
    activePayloads: 50,
    inclination: 0,
    planes: 1,
    satsPerPlane: 50,
  },
  {
    name: "TDRS",
    operator: "NASA",
    regime: "GEO",
    color: "#C084FC",
    altitudeMin: 35786,
    altitudeMax: 35786,
    altitudeAvg: 35786,
    activePayloads: 9,
    inclination: 0,
    planes: 1,
    satsPerPlane: 9,
  },
];

const REGIME_CONFIG = {
  LEO: { label: "Low Earth Orbit", range: "160 – 2,000 km", color: "#00F0FF" },
  MEO: { label: "Medium Earth Orbit", range: "2,000 – 35,786 km", color: "#F59E0B" },
  GEO: { label: "Geostationary Orbit", range: "35,786 km", color: "#A78BFA" },
};

export default function Constellations() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);
  const [selectedRegime, setSelectedRegime] = useState<"LEO" | "MEO" | "GEO" | "ALL">("ALL");
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  const [animTime, setAnimTime] = useState(0);

  // Animation
  useEffect(() => {
    const interval = setInterval(() => setAnimTime((t) => t + 0.02), 50);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const stats = useMemo(() => {
    const byRegime = {
      LEO: { count: 0, payloads: 0 },
      MEO: { count: 0, payloads: 0 },
      GEO: { count: 0, payloads: 0 },
    };
    CONSTELLATIONS.forEach((c) => {
      byRegime[c.regime].count++;
      byRegime[c.regime].payloads += c.activePayloads;
    });
    return byRegime;
  }, []);

  const filteredConstellations =
    selectedRegime === "ALL"
      ? CONSTELLATIONS
      : CONSTELLATIONS.filter((c) => c.regime === selectedRegime);

  // Canvas: Side-view orbital shell visualization
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
    const cy = h * 0.55;
    const earthR = 50;

    // Clear
    ctx.fillStyle = "#060B18";
    ctx.fillRect(0, 0, w, h);

    // Earth
    const earthGrad = ctx.createRadialGradient(cx - 10, cy - 10, 0, cx, cy, earthR);
    earthGrad.addColorStop(0, "#1a4a7a");
    earthGrad.addColorStop(1, "#0d2240");
    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("EARTH", cx, cy + 3);

    // Draw shells
    const maxAlt = 40000;
    const altToRadius = (alt: number) => earthR + (alt / maxAlt) * (Math.min(w, h) * 0.4 - earthR);

    filteredConstellations.forEach((c) => {
      const r = altToRadius(c.altitudeAvg);
      const regimeColor = REGIME_CONFIG[c.regime].color;
      const isSelected = selectedConstellation === c.name;

      // Orbital ring
      ctx.strokeStyle = isSelected ? regimeColor : regimeColor + "30";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.setLineDash(c.regime === "GEO" ? [] : [4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite dots
      const numDots = Math.min(c.activePayloads, 60);
      for (let i = 0; i < numDots; i++) {
        const angle = (i / numDots) * Math.PI * 2 + animTime * (0.5 / (c.altitudeAvg / 1000));
        const sx = cx + r * Math.cos(angle);
        const sy = cy + r * Math.sin(angle);

        if (isSelected) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5);
          glow.addColorStop(0, regimeColor);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = regimeColor + (isSelected ? "ff" : "80");
        ctx.beginPath();
        ctx.arc(sx, sy, isSelected ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Label
      ctx.fillStyle = regimeColor + (isSelected ? "ff" : "60");
      ctx.font = `${isSelected ? "11" : "9"}px "JetBrains Mono", monospace`;
      ctx.textAlign = "left";
      ctx.fillText(
        `${c.name} (${(c.altitudeAvg / 1000).toFixed(0)}k km)`,
        cx + r + 8,
        cy - r * 0.1,
      );
    });

    ctx.textAlign = "start";
  }, [filteredConstellations, selectedConstellation, animTime]);

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/astrolab")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-amber-400 to-violet-400 bg-clip-text text-transparent">
              Satellite Constellation Tracker
            </h1>
            <p className="text-sm text-white/50 font-mono">
              Multi-shell LEO/MEO/GEO tracking · Active payload counts
            </p>
          </div>
        </div>

        {/* Regime Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => setSelectedRegime("ALL")}
            className={`p-3 rounded-xl border transition-all text-center ${selectedRegime === "ALL" ? "border-white/20 bg-white/5" : "border-white/5 bg-white/[0.02]"}`}
          >
            <Globe2 className="w-5 h-5 mx-auto mb-1 text-white/40" />
            <span className="text-xs text-white/50">All Orbits</span>
            <span className="block text-lg font-bold font-mono text-white/80 mt-1">
              {CONSTELLATIONS.reduce((s, c) => s + c.activePayloads, 0).toLocaleString()}
            </span>
          </button>
          {(
            Object.entries(REGIME_CONFIG) as [
              keyof typeof REGIME_CONFIG,
              (typeof REGIME_CONFIG)[keyof typeof REGIME_CONFIG],
            ][]
          ).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedRegime(key)}
              className={`p-3 rounded-xl border transition-all text-center ${selectedRegime === key ? `border-[${cfg.color}]/30 bg-[${cfg.color}]/5` : "border-white/5 bg-white/[0.02]"}`}
              style={
                selectedRegime === key
                  ? { borderColor: cfg.color + "40", backgroundColor: cfg.color + "08" }
                  : {}
              }
            >
              <Satellite className="w-5 h-5 mx-auto mb-1" style={{ color: cfg.color }} />
              <span className="text-xs" style={{ color: cfg.color + "80" }}>
                {key}
              </span>
              <span className="block text-lg font-bold font-mono mt-1" style={{ color: cfg.color }}>
                {stats[key].payloads.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/30">{cfg.range}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orbital Shell Visualization */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl overflow-hidden border border-white/10"
              style={{ boxShadow: "0 0 40px rgba(0,0,0,0.3)" }}
            >
              <canvas ref={canvasRef} className="w-full" style={{ height: "500px" }} />
            </div>
          </div>

          {/* Constellation List */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredConstellations.map((c) => (
              <motion.button
                key={c.name}
                onClick={() =>
                  setSelectedConstellation(selectedConstellation === c.name ? null : c.name)
                }
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selectedConstellation === c.name
                    ? "border-white/20 bg-white/[0.05]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
                style={selectedConstellation === c.name ? { borderColor: c.color + "40" } : {}}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-semibold text-sm">{c.name}</span>
                  </div>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: REGIME_CONFIG[c.regime].color + "15",
                      color: REGIME_CONFIG[c.regime].color,
                    }}
                  >
                    {c.regime}
                  </span>
                </div>
                <div className="text-xs text-white/40 mb-2">{c.operator}</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/30">Payloads</span>
                    <span className="text-white/70">{c.activePayloads.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Altitude</span>
                    <span className="text-white/70">{c.altitudeAvg.toLocaleString()} km</span>
                  </div>
                  {selectedConstellation === c.name && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/30">Inclination</span>
                        <span className="text-white/70">{c.inclination}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">Planes</span>
                        <span className="text-white/70">{c.planes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">Sats/Plane</span>
                        <span className="text-white/70">{c.satsPerPlane}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">Alt Range</span>
                        <span className="text-white/70">
                          {c.altitudeMin}–{c.altitudeMax} km
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {userMode === "student" && (
          <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 max-w-3xl">
            <p className="text-sm text-violet-400/80">
              💡 <strong>Orbital Regimes:</strong> LEO satellites (cyan) orbit below 2,000 km for
              low-latency comms and Earth observation. MEO satellites (amber) at ~20,000 km provide
              navigation (GPS/Galileo). GEO satellites (violet) at 35,786 km appear stationary,
              ideal for broadcast TV and weather monitoring.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
