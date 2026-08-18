import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Droplets, Thermometer, Wind, Zap, Search, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

interface ExoplanetData {
  name: string;
  starName: string;
  distance: number;
  radius: number;
  mass: number;
  temperature: number;
  habitabilityScore: number;
  waterPresence: number;
  atmosphereType: string;
  discoveryYear: number;
}

const EXOPLANET_DATABASE: ExoplanetData[] = [
  {
    name: 'Proxima Centauri b',
    starName: 'Proxima Centauri',
    distance: 4.24,
    radius: 1.1,
    mass: 1.27,
    temperature: 234,
    habitabilityScore: 0.74,
    waterPresence: 0.65,
    atmosphereType: 'Unknown',
    discoveryYear: 2016,
  },
  {
    name: 'TRAPPIST-1e',
    starName: 'TRAPPIST-1',
    distance: 12.1,
    radius: 0.92,
    mass: 0.62,
    temperature: 246,
    habitabilityScore: 0.86,
    waterPresence: 0.78,
    atmosphereType: 'Potentially Habitable',
    discoveryYear: 2017,
  },
  {
    name: 'Kepler-452b',
    starName: 'Kepler-452',
    distance: 1206,
    radius: 1.6,
    mass: 5.0,
    temperature: 265,
    habitabilityScore: 0.71,
    waterPresence: 0.72,
    atmosphereType: 'Earth-like',
    discoveryYear: 2015,
  },
  {
    name: 'Gliese 667Cc',
    starName: 'Gliese 667C',
    distance: 23.62,
    radius: 1.5,
    mass: 3.8,
    temperature: 228,
    habitabilityScore: 0.79,
    waterPresence: 0.81,
    atmosphereType: 'Potentially Habitable',
    discoveryYear: 2011,
  },
  {
    name: 'K2-18b',
    starName: 'K2-18',
    distance: 124,
    radius: 2.6,
    mass: 8.63,
    temperature: 265,
    habitabilityScore: 0.68,
    waterPresence: 0.75,
    atmosphereType: 'Water-Rich',
    discoveryYear: 2015,
  },
];

export default function ExoplanetHabitabilityPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetData>(EXOPLANET_DATABASE[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'habitability' | 'distance' | 'temperature'>('habitability');

  const filteredPlanets = EXOPLANET_DATABASE.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.starName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'habitability') return b.habitabilityScore - a.habitabilityScore;
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'temperature') return a.temperature - b.temperature;
    return 0;
  });

  const getHabitabilityColor = (score: number) => {
    if (score > 0.8) return 'from-green-500 to-emerald-500';
    if (score > 0.6) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  const getHabitabilityLabel = (score: number) => {
    if (score > 0.8) return 'Highly Habitable';
    if (score > 0.6) return 'Potentially Habitable';
    return 'Low Habitability';
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            <span className="text-aerospace-blue">Exoplanet</span> Habitability Analyzer
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl">
            Analyze and compare exoplanets based on habitability indicators, atmospheric composition, and stellar proximity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Search & List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-primary/40 border-aerospace-blue/20 p-6 sticky top-24">
              <div className="mb-6">
                <label className="block text-sm font-mono text-aerospace-blue uppercase tracking-wider mb-3">
                  Search Exoplanets
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-aerospace-blue/50" />
                  <input
                    type="text"
                    placeholder="Planet or star name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-aerospace-blue/50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-mono text-aerospace-blue uppercase tracking-wider mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue/50"
                >
                  <option value="habitability">Habitability Score</option>
                  <option value="distance">Distance (Light-years)</option>
                  <option value="temperature">Temperature</option>
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPlanets.map((planet) => (
                  <motion.button
                    key={planet.name}
                    onClick={() => setSelectedPlanet(planet)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedPlanet.name === planet.name
                        ? 'bg-aerospace-blue/20 border-aerospace-blue/50'
                        : 'bg-primary/20 border-aerospace-blue/10 hover:border-aerospace-blue/30'
                    }`}
                  >
                    <p className="font-mono text-sm text-aerospace-blue">{planet.name}</p>
                    <p className="text-xs text-foreground/60">{planet.starName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`h-2 w-full rounded-full bg-gradient-to-r ${getHabitabilityColor(planet.habitabilityScore)}`} />
                      <span className="text-xs text-foreground/70 whitespace-nowrap">
                        {(planet.habitabilityScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Panel - Detailed Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Card */}
            <Card className="bg-primary/40 border-aerospace-blue/20 p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-aerospace-blue/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="font-heading text-4xl font-bold mb-2">{selectedPlanet.name}</h2>
                  <p className="text-foreground/70">Orbiting {selectedPlanet.starName}</p>
                </div>

                {/* Habitability Score */}
                <div className="mb-8 p-6 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-sm uppercase tracking-wider text-aerospace-blue">
                      Habitability Index
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-mono bg-gradient-to-r ${getHabitabilityColor(selectedPlanet.habitabilityScore)} text-white`}>
                      {getHabitabilityLabel(selectedPlanet.habitabilityScore)}
                    </span>
                  </div>
                  <div className="relative h-8 bg-aerospace-dark rounded-full overflow-hidden border border-aerospace-blue/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedPlanet.habitabilityScore * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${getHabitabilityColor(selectedPlanet.habitabilityScore)}`}
                    />
                  </div>
                  <p className="mt-3 text-sm text-foreground/70">
                    Score: {(selectedPlanet.habitabilityScore * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-aerospace-blue" />
                      <span className="text-xs font-mono text-aerospace-blue uppercase">Temperature</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedPlanet.temperature}K</p>
                  </div>

                  <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-aerospace-accent" />
                      <span className="text-xs font-mono text-aerospace-accent uppercase">Water</span>
                    </div>
                    <p className="text-2xl font-bold">{(selectedPlanet.waterPresence * 100).toFixed(0)}%</p>
                  </div>

                  <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-aerospace-success" />
                      <span className="text-xs font-mono text-aerospace-success uppercase">Distance</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedPlanet.distance} ly</p>
                  </div>

                  <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-aerospace-warning" />
                      <span className="text-xs font-mono text-aerospace-warning uppercase">Radius</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedPlanet.radius}R⊕</p>
                  </div>

                  <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-4 h-4 text-aerospace-blue" />
                      <span className="text-xs font-mono text-aerospace-blue uppercase">Mass</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedPlanet.mass}M⊕</p>
                  </div>

                  <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-aerospace-accent" />
                      <span className="text-xs font-mono text-aerospace-accent uppercase">Discovered</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedPlanet.discoveryYear}</p>
                  </div>
                </div>

                {/* Atmosphere */}
                <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-2">Atmosphere Type</p>
                  <p className="text-lg font-semibold">{selectedPlanet.atmosphereType}</p>
                </div>
              </div>
            </Card>

            {/* Comparison Table */}
            <Card className="bg-primary/40 border-aerospace-blue/20 p-6 overflow-x-auto">
              <h3 className="font-mono text-sm uppercase tracking-wider text-aerospace-blue mb-4">
                Comparative Analysis
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-aerospace-blue/20">
                    <th className="text-left py-2 text-aerospace-blue font-mono">Metric</th>
                    <th className="text-right py-2 text-aerospace-blue font-mono">Value</th>
                    <th className="text-right py-2 text-aerospace-blue font-mono">Earth Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-aerospace-blue/10">
                    <td className="py-3">Radius</td>
                    <td className="text-right">{selectedPlanet.radius} R⊕</td>
                    <td className="text-right text-aerospace-accent">{(selectedPlanet.radius).toFixed(2)}x</td>
                  </tr>
                  <tr className="border-b border-aerospace-blue/10">
                    <td className="py-3">Mass</td>
                    <td className="text-right">{selectedPlanet.mass} M⊕</td>
                    <td className="text-right text-aerospace-accent">{(selectedPlanet.mass).toFixed(2)}x</td>
                  </tr>
                  <tr className="border-b border-aerospace-blue/10">
                    <td className="py-3">Temperature</td>
                    <td className="text-right">{selectedPlanet.temperature}K</td>
                    <td className="text-right text-aerospace-accent">{(selectedPlanet.temperature / 288).toFixed(2)}x</td>
                  </tr>
                  <tr>
                    <td className="py-3">Distance</td>
                    <td className="text-right">{selectedPlanet.distance} ly</td>
                    <td className="text-right text-aerospace-accent">{(selectedPlanet.distance / 4.24).toFixed(1)}x Proxima</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
