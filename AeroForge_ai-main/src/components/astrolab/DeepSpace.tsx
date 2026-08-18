import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Grid3X3, Search, Crosshair, ZoomIn, ZoomOut, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';

interface DeepSkyObject {
  id: string;
  name: string;
  catalog: string;
  type: string;
  ra: number;    // hours
  dec: number;   // degrees
  magnitude: number;
  distance: string;
  angularSize: string;
  color: string;
  description: string;
}

const DEEP_SKY_CATALOG: DeepSkyObject[] = [
  { id: 'm31', name: 'Andromeda Galaxy', catalog: 'M31 / NGC 224', type: 'Spiral Galaxy', ra: 0.712, dec: 41.269, magnitude: 3.4, distance: '2.537 Mly', angularSize: '3.167° × 1°', color: '#00F0FF', description: 'Nearest major galaxy to the Milky Way. Contains ~1 trillion stars. Approaching at 110 km/s — will merge with Milky Way in ~4.5 Gyr.' },
  { id: 'm42', name: 'Orion Nebula', catalog: 'M42 / NGC 1976', type: 'Emission Nebula', ra: 5.588, dec: -5.391, magnitude: 4.0, distance: '1,344 ly', angularSize: '65′ × 60′', color: '#FF007A', description: 'Massive stellar nursery with ~700 stars in various stages of formation. Contains the Trapezium Cluster of hot, young O-type and B-type stars.' },
  { id: 'm45', name: 'Pleiades', catalog: 'M45', type: 'Open Cluster', ra: 3.791, dec: 24.105, magnitude: 1.6, distance: '444 ly', angularSize: '110′', color: '#F59E0B', description: 'Young open cluster (~100 Myr). Contains >1,000 confirmed members. Blue reflection nebulosity from interstellar dust.' },
  { id: 'm1', name: 'Crab Nebula', catalog: 'M1 / NGC 1952', type: 'Supernova Remnant', ra: 5.575, dec: 22.014, magnitude: 8.4, distance: '6,500 ly', angularSize: '7′ × 5′', color: '#A78BFA', description: 'Remnant of SN 1054 supernova observed by Chinese astronomers. Contains a 33 ms pulsar (PSR B0531+21) spinning at 30.2 Hz.' },
  { id: 'm87', name: 'Virgo A', catalog: 'M87 / NGC 4486', type: 'Elliptical Galaxy', ra: 12.514, dec: 12.391, magnitude: 8.6, distance: '53.5 Mly', angularSize: '8.3′ × 6.6′', color: '#10B981', description: 'Supergiant elliptical galaxy with ~12,000 globular clusters. Central SMBH (M87*) imaged by EHT in 2019 — mass 6.5×10⁹ M☉.' },
  { id: 'm13', name: 'Hercules Cluster', catalog: 'M13 / NGC 6205', type: 'Globular Cluster', ra: 16.695, dec: 36.461, magnitude: 5.8, distance: '22,200 ly', angularSize: '20′', color: '#06B6D4', description: 'Contains ~300,000 stars in a sphere ~145 ly across. One of the brightest northern globular clusters. Age ~11.65 Gyr.' },
  { id: 'ngc7000', name: 'North America Nebula', catalog: 'NGC 7000', type: 'Emission Nebula', ra: 20.982, dec: 44.333, magnitude: 4.0, distance: '2,590 ly', angularSize: '120′ × 100′', color: '#EF4444', description: 'Large emission nebula resembling the North American continent. Ionized by hot star HD 199579 (O-type). Part of the Cygnus Wall complex.' },
  { id: 'm57', name: 'Ring Nebula', catalog: 'M57 / NGC 6720', type: 'Planetary Nebula', ra: 18.893, dec: 33.029, magnitude: 8.8, distance: '2,570 ly', angularSize: '1.4′ × 1′', color: '#EC4899', description: 'Archetypal planetary nebula. Central white dwarf (T ~120,000 K) illuminates ejected stellar envelope. True shape is a barrel, not a ring.' },
];

export default function DeepSpace() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  const [showGrid, setShowGrid] = useState(true);
  const [selectedObject, setSelectedObject] = useState<DeepSkyObject | null>(null);
  const [viewCenter, setViewCenter] = useState({ ra: 12, dec: 30 });
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Star catalog (procedural)
  const starField = useMemo(() => {
    const stars: Array<{ ra: number; dec: number; mag: number; temp: number }> = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const rand = rng(12345);
    for (let i = 0; i < 2000; i++) {
      stars.push({
        ra: rand() * 24,
        dec: (rand() - 0.5) * 180,
        mag: 2 + rand() * 8,
        temp: 3000 + rand() * 27000, // K
      });
    }
    return stars;
  }, []);

  // Snap to object
  const snapToObject = useCallback((obj: DeepSkyObject) => {
    setSelectedObject(obj);
    setViewCenter({ ra: obj.ra, dec: obj.dec });
    setZoom(Math.max(zoom, 2));
  }, [zoom]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Clear background
    ctx.fillStyle = '#040810';
    ctx.fillRect(0, 0, w, h);

    // Milky Way band (very subtle)
    const mwGrad = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.7);
    mwGrad.addColorStop(0, 'rgba(100,120,180,0)');
    mwGrad.addColorStop(0.5, 'rgba(100,120,180,0.03)');
    mwGrad.addColorStop(1, 'rgba(100,120,180,0)');
    ctx.fillStyle = mwGrad;
    ctx.fillRect(0, 0, w, h);

    // Coordinate transform: RA/Dec to screen
    const fovRA = 24 / zoom;   // hours visible
    const fovDec = 180 / zoom; // degrees visible
    const raToX = (ra: number): number => {
      let dra = ra - viewCenter.ra;
      if (dra > 12) dra -= 24;
      if (dra < -12) dra += 24;
      return w / 2 + (dra / fovRA) * w;
    };
    const decToY = (dec: number): number => {
      return h / 2 - ((dec - viewCenter.dec) / fovDec) * h;
    };

    // RA/Dec Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0,240,255,0.08)';
      ctx.lineWidth = 0.5;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(0,240,255,0.2)';

      // RA lines (every 2 hours)
      for (let ra = 0; ra < 24; ra += 2) {
        const x = raToX(ra);
        if (x > -50 && x < w + 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
          ctx.fillText(`${ra}h`, x + 3, 14);
        }
      }

      // Dec lines (every 20°)
      for (let dec = -80; dec <= 80; dec += 20) {
        const y = decToY(dec);
        if (y > -50 && y < h + 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
          ctx.fillText(`${dec > 0 ? '+' : ''}${dec}°`, 5, y - 3);
        }
      }
    }

    // Draw stars
    starField.forEach((star) => {
      const x = raToX(star.ra);
      const y = decToY(star.dec);
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) return;

      const brightness = Math.max(0.1, 1 - (star.mag - 2) / 8);
      const size = Math.max(0.5, (10 - star.mag) / 3) * Math.sqrt(zoom);

      // Color from temperature
      let r = 255, g = 255, b = 255;
      if (star.temp < 5000) { r = 255; g = 180 + star.temp / 50; b = 150; }
      else if (star.temp > 10000) { r = 180; g = 200; b = 255; }

      ctx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw deep-sky objects
    DEEP_SKY_CATALOG.forEach((obj) => {
      const x = raToX(obj.ra);
      const y = decToY(obj.dec);
      if (x < -30 || x > w + 30 || y < -30 || y > h + 30) return;

      const isSelected = selectedObject?.id === obj.id;
      const objSize = (12 - obj.magnitude) * Math.sqrt(zoom) * 1.5;

      // Glow halo
      const glow = ctx.createRadialGradient(x, y, 0, x, y, objSize * 2);
      glow.addColorStop(0, obj.color + (isSelected ? '60' : '30'));
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, objSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = obj.color + (isSelected ? 'ff' : '90');
      ctx.beginPath();
      ctx.arc(x, y, objSize * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair for selected
      if (isSelected) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x - objSize * 2.5, y);
        ctx.lineTo(x - objSize * 0.8, y);
        ctx.moveTo(x + objSize * 0.8, y);
        ctx.lineTo(x + objSize * 2.5, y);
        ctx.moveTo(x, y - objSize * 2.5);
        ctx.lineTo(x, y - objSize * 0.8);
        ctx.moveTo(x, y + objSize * 0.8);
        ctx.lineTo(x, y + objSize * 2.5);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label
      ctx.fillStyle = obj.color;
      ctx.font = `${isSelected ? '12' : '10'}px "JetBrains Mono", monospace`;
      ctx.fillText(obj.catalog.split('/')[0].trim(), x + objSize + 4, y - 4);
    });
  }, [viewCenter, zoom, showGrid, selectedObject, starField]);

  // Mouse interaction
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const fovRA = 24 / zoom;
    const fovDec = 180 / zoom;

    // Check click on deep-sky objects
    for (const obj of DEEP_SKY_CATALOG) {
      let dra = obj.ra - viewCenter.ra;
      if (dra > 12) dra -= 24;
      if (dra < -12) dra += 24;
      const ox = w / 2 + (dra / fovRA) * w;
      const oy = h / 2 - ((obj.dec - viewCenter.dec) / fovDec) * h;
      const dist = Math.sqrt((mx - ox) ** 2 + (my - oy) ** 2);
      if (dist < 25) {
        snapToObject(obj);
        return;
      }
    }
    setSelectedObject(null);
  }, [viewCenter, zoom, snapToObject]);

  // Pan via drag
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.5, Math.min(20, z * (e.deltaY > 0 ? 0.9 : 1.1))));
  };

  const filteredObjects = searchQuery.length > 0
    ? DEEP_SKY_CATALOG.filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.catalog.toLowerCase().includes(searchQuery.toLowerCase()))
    : DEEP_SKY_CATALOG;

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/astrolab')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Deep Space Observatory
            </h1>
            <p className="text-sm text-white/50 font-mono">Interactive sky map · 8 deep-sky targets · RA/Dec coordinate grid</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sky Map */}
          <div className="lg:col-span-3">
            <div className="relative rounded-xl overflow-hidden border border-white/10"
              style={{ boxShadow: '0 0 60px rgba(255,0,122,0.04)' }}>
              <canvas ref={canvasRef} className="w-full cursor-crosshair" style={{ height: '600px' }}
                onClick={handleCanvasClick} onWheel={handleWheel}
                onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX, y: e.clientY }); }}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  const dx = e.clientX - dragStart.x;
                  const dy = e.clientY - dragStart.y;
                  const fovRA = 24 / zoom;
                  const fovDec = 180 / zoom;
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setViewCenter((v) => ({
                    ra: ((v.ra - (dx / rect.width) * fovRA) % 24 + 24) % 24,
                    dec: Math.max(-85, Math.min(85, v.dec + (dy / rect.height) * fovDec)),
                  }));
                  setDragStart({ x: e.clientX, y: e.clientY });
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              />

              {/* Zoom controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                <button onClick={() => setZoom((z) => Math.min(20, z * 1.3))}
                  className="p-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10 hover:border-pink-500/50">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => setZoom((z) => Math.max(0.5, z / 1.3))}
                  className="p-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10 hover:border-pink-500/50">
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>

              {/* Grid toggle */}
              <button onClick={() => setShowGrid(!showGrid)}
                className={`absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-sm rounded-lg border transition-all ${showGrid ? 'border-cyan-500/50 text-cyan-400' : 'border-white/10'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>

              {/* View info */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 font-mono text-xs text-white/50">
                Center: {viewCenter.ra.toFixed(2)}h / {viewCenter.dec > 0 ? '+' : ''}{viewCenter.dec.toFixed(1)}° · Zoom: {zoom.toFixed(1)}×
              </div>
            </div>
          </div>

          {/* Object Panel */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search objects..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm font-mono text-white placeholder-white/20 focus:border-pink-500/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Object list */}
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 max-h-[300px] overflow-y-auto space-y-1.5" style={{ backdropFilter: 'blur(20px)' }}>
              {filteredObjects.map((obj) => (
                <button key={obj.id} onClick={() => snapToObject(obj)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                    selectedObject?.id === obj.id ? 'border-pink-500/40 bg-pink-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: obj.color }} />
                    <span className="font-mono text-xs text-white/70">{obj.catalog.split('/')[0].trim()}</span>
                  </div>
                  <span className="text-sm font-medium">{obj.name}</span>
                  <div className="text-xs text-white/30 mt-0.5">{obj.type} · mag {obj.magnitude}</div>
                </button>
              ))}
            </div>

            {/* Selected object details */}
            {selectedObject && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-4" style={{ backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Crosshair className="w-4 h-4" style={{ color: selectedObject.color }} />
                  <h3 className="font-semibold text-sm" style={{ color: selectedObject.color }}>{selectedObject.name}</h3>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  {[
                    { l: 'Catalog', v: selectedObject.catalog },
                    { l: 'Type', v: selectedObject.type },
                    { l: 'RA', v: `${selectedObject.ra.toFixed(3)}h (${(selectedObject.ra * 15).toFixed(2)}°)` },
                    { l: 'Dec', v: `${selectedObject.dec > 0 ? '+' : ''}${selectedObject.dec.toFixed(3)}°` },
                    { l: 'Magnitude', v: selectedObject.magnitude.toFixed(1) },
                    { l: 'Distance', v: selectedObject.distance },
                    { l: 'Angular Size', v: selectedObject.angularSize },
                  ].map((row) => (
                    <div key={row.l} className="flex justify-between border-b border-white/5 py-1">
                      <span className="text-white/40">{row.l}</span>
                      <span className="text-white/80">{row.v}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/50 leading-relaxed">{selectedObject.description}</p>
                {userMode === 'student' && (
                  <div className="mt-3 p-2.5 rounded-lg bg-pink-500/5 border border-pink-500/10">
                    <p className="text-xs text-pink-400/70">💡 Right Ascension (RA) measures the angular distance eastward along the celestial equator. 1 hour of RA = 15°. Declination (Dec) is the angular distance above/below the equator.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
