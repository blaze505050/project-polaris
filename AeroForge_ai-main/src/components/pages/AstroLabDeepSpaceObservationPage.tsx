import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, Settings, Star, Eye, BarChart3, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CelestialObject {
  id: string;
  name: string;
  type: 'Galaxy' | 'Nebula' | 'Star Cluster' | 'Supernova' | 'Quasar';
  ra: number;
  dec: number;
  magnitude: number;
  distance: number;
  redshift: number;
  luminosity: number;
  color: string;
  description: string;
}

const CATALOG: CelestialObject[] = [
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    type: 'Galaxy',
    ra: 0.7,
    dec: 41.3,
    magnitude: 3.4,
    distance: 2.5,
    redshift: -0.001,
    luminosity: 2.6e10,
    color: '#00F0FF',
    description: 'Nearest large galaxy to the Milky Way, approaching at 110 km/s',
  },
  {
    id: 'orion',
    name: 'Orion Nebula',
    type: 'Nebula',
    ra: 5.55,
    dec: -5.4,
    magnitude: 4.0,
    distance: 1.3,
    redshift: 0,
    luminosity: 1.2e5,
    color: '#FF007A',
    description: 'Stellar nursery with active star formation',
  },
  {
    id: 'pleiades',
    name: 'Pleiades Star Cluster',
    type: 'Star Cluster',
    ra: 3.79,
    dec: 24.1,
    magnitude: 1.6,
    distance: 0.136,
    redshift: 0,
    luminosity: 1.8e4,
    color: '#F59E0B',
    description: 'Young open cluster, approximately 100 million years old',
  },
  {
    id: 'crab',
    name: 'Crab Nebula',
    type: 'Supernova',
    ra: 5.58,
    dec: 22.0,
    magnitude: 8.4,
    distance: 6.3,
    redshift: 0.0001,
    luminosity: 5e4,
    color: '#A78BFA',
    description: 'Remnant of supernova SN 1054, contains a pulsar',
  },
  {
    id: '3c273',
    name: '3C 273 Quasar',
    type: 'Quasar',
    ra: 12.29,
    dec: 2.05,
    magnitude: 12.9,
    distance: 2.4e9,
    redshift: 0.158,
    luminosity: 4e40,
    color: '#10B981',
    description: 'Brightest quasar in the sky, powered by supermassive black hole',
  },
  {
    id: 'sombrero',
    name: 'Sombrero Galaxy',
    type: 'Galaxy',
    ra: 12.4,
    dec: -11.6,
    magnitude: 8.0,
    distance: 29.3,
    redshift: 0.003,
    luminosity: 8e9,
    color: '#00F0FF',
    description: 'Lenticular galaxy with prominent dust lane',
  },
  {
    id: 'horsehead',
    name: 'Horsehead Nebula',
    type: 'Nebula',
    ra: 5.76,
    dec: -2.27,
    magnitude: 13.0,
    distance: 1.5,
    redshift: 0,
    luminosity: 1e3,
    color: '#FF007A',
    description: 'Dark nebula silhouetted against bright emission nebula',
  },
  {
    id: 'ring',
    name: 'Ring Nebula',
    type: 'Nebula',
    ra: 18.89,
    dec: 33.02,
    magnitude: 8.8,
    distance: 2.3,
    redshift: 0,
    luminosity: 3e4,
    color: '#F59E0B',
    description: 'Planetary nebula, shell of gas ejected by dying star',
  },
];

export default function AstroLabDeepSpaceObservationPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [sortBy, setSortBy] = useState<'magnitude' | 'distance' | 'luminosity'>('magnitude');

  const filteredObjects = useMemo(() => {
    return CATALOG.filter(obj => {
      const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || obj.type === selectedType;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'magnitude') return a.magnitude - b.magnitude;
      if (sortBy === 'distance') return a.distance - b.distance;
      return b.luminosity - a.luminosity;
    });
  }, [searchTerm, selectedType, sortBy]);

  const types = Array.from(new Set(CATALOG.map(obj => obj.type)));

  const handleExport = () => {
    const csv = [
      ['Name', 'Type', 'RA (h)', 'Dec (°)', 'Magnitude', 'Distance (Mly)', 'Redshift', 'Luminosity (L☉)'],
      ...filteredObjects.map(obj => [
        obj.name,
        obj.type,
        obj.ra.toFixed(2),
        obj.dec.toFixed(2),
        obj.magnitude.toFixed(2),
        obj.distance.toFixed(2),
        obj.redshift.toFixed(4),
        obj.luminosity.toExponential(2),
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deep-space-catalog-${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Deep Space Observation</h1>
                <p className="text-secondary-foreground text-sm">Catalog of celestial objects & deep-sky mapping</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="p-2 hover:bg-[#131924] rounded-lg transition" title="Export catalog">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition" title="Settings">
                <Settings size={20} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-[#00F0FF]" />
                <input
                  type="text"
                  placeholder="Search objects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded-lg text-foreground placeholder-secondary-foreground focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded-lg text-foreground focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded-lg text-foreground focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="magnitude">Sort by Magnitude</option>
                <option value="distance">Sort by Distance</option>
                <option value="luminosity">Sort by Luminosity</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Catalog List */}
            <div className="lg:col-span-2">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredObjects.map((obj, idx) => (
                    <motion.button
                      key={obj.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedObject(obj)}
                      className={`w-full text-left p-4 border-b border-[#00F0FF33] transition ${
                        selectedObject?.id === obj.id
                          ? 'bg-[#00F0FF]/20 border-l-4 border-l-[#00F0FF]'
                          : 'hover:bg-[#131924]/80'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: obj.color }} />
                          <div>
                            <h3 className="font-mono font-bold text-foreground">{obj.name}</h3>
                            <p className="text-xs text-secondary-foreground">{obj.type}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[#00F0FF]">m={obj.magnitude.toFixed(1)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono text-secondary-foreground">
                        <div>RA: {obj.ra.toFixed(2)}h</div>
                        <div>Dec: {obj.dec.toFixed(1)}°</div>
                        <div>d: {obj.distance.toFixed(2)} Mly</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Details Panel */}
            {selectedObject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Object Info */}
                <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedObject.color }} />
                    <h2 className="text-xl font-mono font-bold text-foreground">{selectedObject.name}</h2>
                  </div>
                  
                  <div className="space-y-3 text-xs font-mono">
                    <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                      <div className="text-secondary-foreground mb-1">Type</div>
                      <div className="text-[#00F0FF] font-bold">{selectedObject.type}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#0B0E14] p-3 rounded border border-[#FF007A33]">
                        <div className="text-secondary-foreground mb-1">Magnitude</div>
                        <div className="text-[#FF007A] font-bold">{selectedObject.magnitude.toFixed(2)}</div>
                      </div>
                      <div className="bg-[#0B0E14] p-3 rounded border border-[#F59E0B33]">
                        <div className="text-secondary-foreground mb-1">Distance</div>
                        <div className="text-[#F59E0B] font-bold">{selectedObject.distance.toFixed(2)} Mly</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#0B0E14] p-3 rounded border border-[#A78BFA33]">
                        <div className="text-secondary-foreground mb-1">RA</div>
                        <div className="text-[#A78BFA] font-bold">{selectedObject.ra.toFixed(2)}h</div>
                      </div>
                      <div className="bg-[#0B0E14] p-3 rounded border border-[#10B98133]">
                        <div className="text-secondary-foreground mb-1">Dec</div>
                        <div className="text-[#10B981] font-bold">{selectedObject.dec.toFixed(2)}°</div>
                      </div>
                    </div>

                    <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                      <div className="text-secondary-foreground mb-1">Redshift</div>
                      <div className="text-[#00F0FF] font-bold">{selectedObject.redshift.toFixed(4)}</div>
                    </div>

                    <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                      <div className="text-secondary-foreground mb-1">Luminosity</div>
                      <div className="text-[#00F0FF] font-bold">{selectedObject.luminosity.toExponential(2)} L☉</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                  <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                    <Info size={14} />
                    Description
                  </h3>
                  <p className="text-xs text-secondary-foreground leading-relaxed">
                    {selectedObject.description}
                  </p>
                </div>

                {/* Observation Tips */}
                <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                  <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3 flex items-center gap-2">
                    <Eye size={14} />
                    Observation
                  </h3>
                  <div className="space-y-2 text-xs text-secondary-foreground">
                    <div className="flex justify-between">
                      <span>Best Season:</span>
                      <span className="text-[#00F0FF]">Year-round</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min. Aperture:</span>
                      <span className="text-[#00F0FF]">50mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className="text-[#00F0FF]">Intermediate</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
            <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4 flex items-center gap-2">
              <BarChart3 size={14} />
              Catalog Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                <div className="text-xs text-secondary-foreground mb-1">Total Objects</div>
                <div className="text-2xl font-bold text-[#00F0FF]">{CATALOG.length}</div>
              </div>
              <div className="bg-[#0B0E14] p-3 rounded border border-[#FF007A33]">
                <div className="text-xs text-secondary-foreground mb-1">Filtered</div>
                <div className="text-2xl font-bold text-[#FF007A]">{filteredObjects.length}</div>
              </div>
              <div className="bg-[#0B0E14] p-3 rounded border border-[#F59E0B33]">
                <div className="text-xs text-secondary-foreground mb-1">Avg Distance</div>
                <div className="text-2xl font-bold text-[#F59E0B]">{(CATALOG.reduce((a, b) => a + b.distance, 0) / CATALOG.length).toFixed(0)} Mly</div>
              </div>
              <div className="bg-[#0B0E14] p-3 rounded border border-[#A78BFA33]">
                <div className="text-xs text-secondary-foreground mb-1">Brightest</div>
                <div className="text-2xl font-bold text-[#A78BFA]">{Math.min(...CATALOG.map(o => o.magnitude)).toFixed(1)}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
