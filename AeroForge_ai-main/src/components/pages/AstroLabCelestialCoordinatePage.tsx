import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, BarChart3, Zap, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CoordinateSystem {
  name: string;
  description: string;
  x: number;
  y: number;
  z: number;
}

export default function AstroLabCelestialCoordinatePage() {
  const navigate = useNavigate();
  const [ra, setRa] = useState(12);
  const [dec, setDec] = useState(30);
  const [distance, setDistance] = useState(10);
  const [epoch, setEpoch] = useState(2000);
  const [sourceType, setSourceType] = useState<'equatorial' | 'ecliptic' | 'galactic'>('equatorial');

  // Convert RA/Dec to Cartesian
  const toCartesian = useMemo(() => {
    const ra_rad = (ra * Math.PI) / 12;
    const dec_rad = (dec * Math.PI) / 180;
    
    return {
      x: distance * Math.cos(dec_rad) * Math.cos(ra_rad),
      y: distance * Math.cos(dec_rad) * Math.sin(ra_rad),
      z: distance * Math.sin(dec_rad),
    };
  }, [ra, dec, distance]);

  // Convert to Ecliptic
  const toEcliptic = useMemo(() => {
    const ε = 23.4392911; // Obliquity of ecliptic
    const ε_rad = (ε * Math.PI) / 180;
    
    const x = toCartesian.x;
    const y = toCartesian.y * Math.cos(ε_rad) - toCartesian.z * Math.sin(ε_rad);
    const z = toCartesian.y * Math.sin(ε_rad) + toCartesian.z * Math.cos(ε_rad);
    
    const lon = Math.atan2(y, x) * 180 / Math.PI;
    const lat = Math.asin(z / distance) * 180 / Math.PI;
    
    return {
      longitude: lon < 0 ? lon + 360 : lon,
      latitude: lat,
      x, y, z,
    };
  }, [toCartesian, distance]);

  // Convert to Galactic
  const toGalactic = useMemo(() => {
    const ra_rad = (ra * Math.PI) / 12;
    const dec_rad = (dec * Math.PI) / 180;
    
    // Galactic center coordinates (J2000)
    const gc_ra = 266.4168;
    const gc_dec = -28.9362;
    const gc_ra_rad = (gc_ra * Math.PI) / 180;
    const gc_dec_rad = (gc_dec * Math.PI) / 180;
    
    // Spherical to Cartesian
    const x = Math.cos(dec_rad) * Math.cos(ra_rad);
    const y = Math.cos(dec_rad) * Math.sin(ra_rad);
    const z = Math.sin(dec_rad);
    
    // Rotation matrix
    const l = Math.atan2(
      z * Math.cos(gc_dec_rad) - (x * Math.sin(gc_ra_rad) - y * Math.cos(gc_ra_rad)) * Math.sin(gc_dec_rad),
      x * Math.cos(gc_ra_rad) + y * Math.sin(gc_ra_rad)
    ) * 180 / Math.PI;
    
    const b = Math.asin(
      z * Math.sin(gc_dec_rad) + (x * Math.sin(gc_ra_rad) - y * Math.cos(gc_ra_rad)) * Math.cos(gc_dec_rad)
    ) * 180 / Math.PI;
    
    return {
      longitude: l < 0 ? l + 360 : l,
      latitude: b,
    };
  }, [ra, dec]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      epoch,
      equatorial: { ra, dec, distance },
      ecliptic: toEcliptic,
      galactic: toGalactic,
      cartesian: toCartesian,
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordinates-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Celestial Coordinates</h1>
                <p className="text-secondary-foreground text-sm">Ephemeris calculations & coordinate transformations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="p-2 hover:bg-[#131924] rounded-lg transition" title="Export data">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition" title="Settings">
                <Settings size={20} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4">Input Coordinates</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Right Ascension: <span className="text-[#00F0FF]">{ra.toFixed(2)}h</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="0.01"
                      value={ra}
                      onChange={(e) => setRa(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={ra.toFixed(2)}
                      onChange={(e) => setRa(parseFloat(e.target.value))}
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Declination: <span className="text-[#FF007A]">{dec.toFixed(2)}°</span>
                    </label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="0.01"
                      value={dec}
                      onChange={(e) => setDec(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={dec.toFixed(2)}
                      onChange={(e) => setDec(parseFloat(e.target.value))}
                      className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Distance: <span className="text-[#F59E0B]">{distance.toFixed(2)} kpc</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Epoch: <span className="text-[#A78BFA]">{epoch}</span>
                    </label>
                    <select
                      value={epoch}
                      onChange={(e) => setEpoch(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-xs text-foreground"
                    >
                      <option value={1900}>B1900.0</option>
                      <option value={1950}>B1950.0</option>
                      <option value={2000}>J2000.0</option>
                      <option value={2050}>J2050.0</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Panels */}
            <div className="lg:col-span-2 space-y-4">
              {/* Equatorial Coordinates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4"
              >
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4">Equatorial Coordinates (J2000)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                    <div className="text-xs text-secondary-foreground mb-2">Right Ascension</div>
                    <div className="text-lg font-mono font-bold text-[#00F0FF] mb-2">{ra.toFixed(4)}h</div>
                    <div className="text-xs text-secondary-foreground mb-2">
                      {Math.floor(ra)}h {Math.floor((ra % 1) * 60)}m {((ra % 1) * 60 % 1 * 60).toFixed(1)}s
                    </div>
                    <button
                      onClick={() => handleCopy(`${ra.toFixed(4)}h`)}
                      className="flex items-center gap-2 text-xs text-[#00F0FF] hover:text-[#00F0FF]/80 transition"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>

                  <div className="bg-[#0B0E14] p-3 rounded border border-[#FF007A33]">
                    <div className="text-xs text-secondary-foreground mb-2">Declination</div>
                    <div className="text-lg font-mono font-bold text-[#FF007A] mb-2">{dec.toFixed(4)}°</div>
                    <div className="text-xs text-secondary-foreground mb-2">
                      {Math.floor(Math.abs(dec))}° {Math.floor((Math.abs(dec) % 1) * 60)}' {((Math.abs(dec) % 1) * 60 % 1 * 60).toFixed(1)}"
                    </div>
                    <button
                      onClick={() => handleCopy(`${dec.toFixed(4)}°`)}
                      className="flex items-center gap-2 text-xs text-[#FF007A] hover:text-[#FF007A]/80 transition"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Ecliptic Coordinates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#F59E0B33] rounded-lg p-4"
              >
                <h3 className="text-sm font-mono font-bold text-[#F59E0B] mb-4">Ecliptic Coordinates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#F59E0B33]">
                    <div className="text-xs text-secondary-foreground mb-2">Ecliptic Longitude</div>
                    <div className="text-lg font-mono font-bold text-[#F59E0B]">{toEcliptic.longitude.toFixed(4)}°</div>
                    <button
                      onClick={() => handleCopy(`${toEcliptic.longitude.toFixed(4)}°`)}
                      className="flex items-center gap-2 text-xs text-[#F59E0B] hover:text-[#F59E0B]/80 transition mt-2"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>

                  <div className="bg-[#0B0E14] p-3 rounded border border-[#F59E0B33]">
                    <div className="text-xs text-secondary-foreground mb-2">Ecliptic Latitude</div>
                    <div className="text-lg font-mono font-bold text-[#F59E0B]">{toEcliptic.latitude.toFixed(4)}°</div>
                    <button
                      onClick={() => handleCopy(`${toEcliptic.latitude.toFixed(4)}°`)}
                      className="flex items-center gap-2 text-xs text-[#F59E0B] hover:text-[#F59E0B]/80 transition mt-2"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Galactic Coordinates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#A78BFA33] rounded-lg p-4"
              >
                <h3 className="text-sm font-mono font-bold text-[#A78BFA] mb-4">Galactic Coordinates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#A78BFA33]">
                    <div className="text-xs text-secondary-foreground mb-2">Galactic Longitude</div>
                    <div className="text-lg font-mono font-bold text-[#A78BFA]">{toGalactic.longitude.toFixed(4)}°</div>
                    <button
                      onClick={() => handleCopy(`${toGalactic.longitude.toFixed(4)}°`)}
                      className="flex items-center gap-2 text-xs text-[#A78BFA] hover:text-[#A78BFA]/80 transition mt-2"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>

                  <div className="bg-[#0B0E14] p-3 rounded border border-[#A78BFA33]">
                    <div className="text-xs text-secondary-foreground mb-2">Galactic Latitude</div>
                    <div className="text-lg font-mono font-bold text-[#A78BFA]">{toGalactic.latitude.toFixed(4)}°</div>
                    <button
                      onClick={() => handleCopy(`${toGalactic.latitude.toFixed(4)}°`)}
                      className="flex items-center gap-2 text-xs text-[#A78BFA] hover:text-[#A78BFA]/80 transition mt-2"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Cartesian Coordinates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#131924]/60 backdrop-blur-md border border-[#10B98133] rounded-lg p-4"
              >
                <h3 className="text-sm font-mono font-bold text-[#10B981] mb-4">Cartesian Coordinates</h3>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-[#0B0E14] p-2 rounded border border-[#10B98133]">
                    <div className="text-secondary-foreground mb-1">X</div>
                    <div className="text-[#10B981] font-bold">{toCartesian.x.toFixed(3)}</div>
                  </div>
                  <div className="bg-[#0B0E14] p-2 rounded border border-[#10B98133]">
                    <div className="text-secondary-foreground mb-1">Y</div>
                    <div className="text-[#10B981] font-bold">{toCartesian.y.toFixed(3)}</div>
                  </div>
                  <div className="bg-[#0B0E14] p-2 rounded border border-[#10B98133]">
                    <div className="text-secondary-foreground mb-1">Z</div>
                    <div className="text-[#10B981] font-bold">{toCartesian.z.toFixed(3)}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
