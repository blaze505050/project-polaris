import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import { equatorialToHorizontal, dateToJulianDate, computeGMST } from '@/services/physicsEngine';

const OBSERVER_PRESETS = [
  { name: 'Greenwich, UK', lat: 51.4769, lon: 0.0005 },
  { name: 'Mauna Kea, HI', lat: 19.8207, lon: -155.4681 },
  { name: 'ESO Paranal, Chile', lat: -24.6253, lon: -70.4033 },
  { name: 'ALMA, Chile', lat: -23.0193, lon: -67.7532 },
  { name: 'Arecibo, PR', lat: 18.3464, lon: -66.7528 },
  { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
];

const STAR_PRESETS = [
  { name: 'Polaris (α UMi)', ra: 2.5302, dec: 89.2641 },
  { name: 'Sirius (α CMa)', ra: 6.7525, dec: -16.7161 },
  { name: 'Betelgeuse (α Ori)', ra: 5.9195, dec: 7.4071 },
  { name: 'Vega (α Lyr)', ra: 18.6157, dec: 38.7837 },
  { name: 'Rigel (β Ori)', ra: 5.2423, dec: -8.2017 },
  { name: 'M31 (Andromeda)', ra: 0.7123, dec: 41.2689 },
];

export default function Coordinates() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);
  const [copied, setCopied] = useState(false);

  // Input state
  const [ra, setRa] = useState(5.9195); // hours
  const [dec, setDec] = useState(7.4071); // degrees
  const [lat, setLat] = useState(51.4769);
  const [lon, setLon] = useState(0.0005);
  const [utcDate, setUtcDate] = useState(new Date());
  const [liveTime, setLiveTime] = useState(true);

  // Live time update
  useEffect(() => {
    if (!liveTime) return;
    const interval = setInterval(() => setUtcDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, [liveTime]);

  // Compute coordinate transform
  const result = useMemo(
    () => equatorialToHorizontal(ra, dec, lat, lon, utcDate),
    [ra, dec, lat, lon, utcDate]
  );

  const jd = useMemo(() => dateToJulianDate(utcDate), [utcDate]);
  const gmst = useMemo(() => computeGMST(jd), [jd]);

  // Alt/Az polar plot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size * 0.42;

    // Clear
    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, size, size);

    // Altitude circles (0°, 30°, 60°, 90° zenith)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    [0, 30, 60, 90].forEach((alt) => {
      const r = maxR * (1 - alt / 90);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`${alt}°`, cx + 3, cy - r + 12);
    });

    // Azimuth lines and labels
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 - 90) * Math.PI / 180;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
      ctx.stroke();

      ctx.fillStyle = i === 0 ? '#FF007A' : 'rgba(255,255,255,0.25)';
      ctx.font = `${i % 2 === 0 ? '11' : '9'}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(directions[i], cx + (maxR + 15) * Math.cos(angle), cy + (maxR + 15) * Math.sin(angle) + 4);
    }

    // Horizon circle
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.stroke();

    // Below horizon fill
    if (!result.isAboveHorizon) {
      ctx.fillStyle = 'rgba(239,68,68,0.03)';
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Target position
    const altFrac = Math.max(0, result.altitude) / 90;
    const targetR = maxR * (1 - altFrac);
    const azRad = (result.azimuth - 90) * Math.PI / 180;
    const tx = cx + targetR * Math.cos(azRad);
    const ty = cy + targetR * Math.sin(azRad);

    if (result.isAboveHorizon) {
      // Glow
      const glow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 15);
      glow.addColorStop(0, '#00F0FF80');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(tx, ty, 15, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair
      ctx.strokeStyle = 'rgba(0,240,255,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(tx - 12, ty); ctx.lineTo(tx + 12, ty);
      ctx.moveTo(tx, ty - 12); ctx.lineTo(tx, ty + 12);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = '#EF4444';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Below Horizon', cx, cy + 8);
    }

    ctx.textAlign = 'start';
  }, [result]);

  const copyResults = () => {
    const text = `RA: ${ra}h, Dec: ${dec}°\nLat: ${lat}°, Lon: ${lon}°\nAlt: ${result.altitude.toFixed(4)}°, Az: ${result.azimuth.toFixed(4)}°\nJD: ${jd.toFixed(6)}\nGMST: ${gmst.toFixed(6)}h\nLST: ${result.lst.toFixed(6)}h\nHA: ${result.hourAngle.toFixed(6)}h`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Celestial Coordinate Calculator
            </h1>
            <p className="text-sm text-white/50 font-mono">RA/Dec → Alt/Az · Julian Date · GMST · Local Sidereal Time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            {/* Target Coordinates */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3">Target (Equatorial)</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Right Ascension (hours)</label>
                  <input type="number" step="0.001" min={0} max={24} value={ra}
                    onChange={(e) => setRa(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white/80 focus:border-blue-500/30 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Declination (degrees)</label>
                  <input type="number" step="0.001" min={-90} max={90} value={dec}
                    onChange={(e) => setDec(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white/80 focus:border-blue-500/30 focus:outline-none" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {STAR_PRESETS.map((s) => (
                  <button key={s.name} onClick={() => { setRa(s.ra); setDec(s.dec); }}
                    className="px-2 py-1 text-[10px] font-mono rounded bg-white/5 border border-white/5 hover:border-blue-500/30 text-white/40 hover:text-blue-400 transition-all">
                    {s.name.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Observer Location */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> Observer
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Latitude (°N)</label>
                  <input type="number" step="0.01" min={-90} max={90} value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white/80 focus:border-blue-500/30 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Longitude (°E)</label>
                  <input type="number" step="0.01" min={-180} max={180} value={lon}
                    onChange={(e) => setLon(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white/80 focus:border-blue-500/30 focus:outline-none" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {OBSERVER_PRESETS.map((p) => (
                  <button key={p.name} onClick={() => { setLat(p.lat); setLon(p.lon); }}
                    className="px-2 py-1 text-[10px] font-mono rounded bg-white/5 border border-white/5 hover:border-blue-500/30 text-white/40 hover:text-blue-400 transition-all">
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* UTC Time */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> UTC Time
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm text-blue-400 flex-1">{utcDate.toISOString().replace('T', ' ').slice(0, 19)}</span>
                <button onClick={() => setLiveTime(!liveTime)}
                  className={`px-2 py-1 text-xs font-mono rounded transition-all ${liveTime ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                  {liveTime ? 'LIVE' : 'MANUAL'}
                </button>
              </div>
              {!liveTime && (
                <input type="datetime-local" value={utcDate.toISOString().slice(0, 16)}
                  onChange={(e) => setUtcDate(new Date(e.target.value))}
                  className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm font-mono text-white/80 focus:outline-none" />
              )}
            </div>
          </div>

          {/* Alt/Az Plot */}
          <div className="flex flex-col items-center">
            <div className="rounded-xl overflow-hidden border border-white/10 w-full" style={{ boxShadow: '0 0 40px rgba(59,130,246,0.05)' }}>
              <canvas ref={canvasRef} className="w-full aspect-square" />
            </div>
            <div className="mt-3 text-center">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${
                result.isAboveHorizon ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                <div className={`w-2 h-2 rounded-full ${result.isAboveHorizon ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {result.isAboveHorizon ? 'Above Horizon' : 'Below Horizon'}
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-blue-400">Computed Results</h3>
                <button onClick={copyResults} className="p-1.5 rounded hover:bg-white/5 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/30" />}
                </button>
              </div>
              <div className="space-y-1.5">
                {[
                  { l: 'Altitude', v: `${result.altitude.toFixed(4)}°`, highlight: true },
                  { l: 'Azimuth', v: `${result.azimuth.toFixed(4)}°`, highlight: true },
                  { l: 'Julian Date', v: jd.toFixed(6), highlight: false },
                  { l: 'GMST', v: `${gmst.toFixed(6)} h`, highlight: false },
                  { l: 'LST', v: `${result.lst.toFixed(6)} h`, highlight: false },
                  { l: 'Hour Angle', v: `${result.hourAngle.toFixed(6)} h`, highlight: false },
                ].map((row) => (
                  <div key={row.l} className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-xs text-white/40">{row.l}</span>
                    <span className={`font-mono text-sm ${row.highlight ? 'text-blue-400 font-bold' : 'text-white/70'}`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {userMode === 'professional' && (
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
                <h3 className="text-xs font-semibold text-white/40 mb-2">Formulas</h3>
                <div className="space-y-2 text-xs font-mono text-white/30 leading-relaxed">
                  <p>JD = JDN + (UT - 12)/24</p>
                  <p>GMST = 280.460618 + 360.985647·(JD - 2451545)</p>
                  <p>LST = GMST + λ/15</p>
                  <p>HA = LST - α</p>
                  <p>sin(alt) = sin(δ)sin(φ) + cos(δ)cos(φ)cos(HA)</p>
                  <p>cos(A) = [sin(δ) - sin(alt)sin(φ)] / [cos(alt)cos(φ)]</p>
                </div>
              </div>
            )}

            {userMode === 'student' && (
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-blue-400/80">
                  💡 <strong>RA/Dec → Alt/Az:</strong> Right Ascension and Declination are fixed sky coordinates. Altitude and Azimuth depend on WHERE and WHEN you observe. The Hour Angle tells you how far the object is from the meridian. Objects with negative altitude are below the horizon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
