import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Cloud, Thermometer, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AtmosphericSciencePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [temperature, setTemperature] = useState(288);

  const planets = [
    {
      id: 'earth',
      name: 'Earth',
      composition: 'N₂ (78%), O₂ (21%), Ar (0.9%)',
      pressure: '101.3 kPa',
      temperature: '288 K',
      description: 'Habitable atmosphere with oxygen',
    },
    {
      id: 'venus',
      name: 'Venus',
      composition: 'CO₂ (96%), N₂ (3%)',
      pressure: '9.2 MPa',
      temperature: '735 K',
      description: 'Extreme greenhouse effect',
    },
    {
      id: 'mars',
      name: 'Mars',
      composition: 'CO₂ (95%), N₂ (2.7%), Ar (2%)',
      pressure: '600 Pa',
      temperature: '210 K',
      description: 'Thin, cold atmosphere',
    },
    {
      id: 'titan',
      name: 'Titan',
      composition: 'N₂ (98%), CH₄ (1.4%)',
      pressure: '150 kPa',
      temperature: '94 K',
      description: 'Thick nitrogen atmosphere',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Wind className="text-teal-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Atmospheric Science</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Study planetary atmospheres and climate systems. Model atmospheric dynamics,
            radiation transfer, and weather patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Atmosphere Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Cloud size={20} className="text-teal-400" />
                Atmospheric Model
              </h3>

              {/* Atmosphere Visualization */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Planet */}
                  <circle cx="200" cy="300" r="80" fill="#4b5563" />
                  {/* Atmosphere layers */}
                  <circle cx="200" cy="300" r="100" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
                  <circle cx="200" cy="300" r="110" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
                  <circle cx="200" cy="300" r="120" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.2" />
                  {/* Temperature gradient */}
                  <defs>
                    <linearGradient id="tempGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <rect x="50" y="50" width="300" height="250" fill="url(#tempGrad)" opacity="0.5" />
                </svg>
              </div>

              {/* Temperature Control */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Surface Temperature (K)
                  </label>
                  <Input
                    type="range"
                    min="100"
                    max="800"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">{temperature} K</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isSimulating ? '⏸ Stop' : '▶ Start'} Simulation
                  </Button>
                  <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Planet Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Thermometer size={20} className="text-teal-400" />
                Planets
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {planets.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => setSelectedPlanet(planet)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedPlanet?.id === planet.id
                        ? 'bg-teal-600/20 border border-teal-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{planet.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{planet.temperature}</div>
                  </button>
                ))}
              </div>

              {selectedPlanet && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300 space-y-2">
                    <div className="text-xs text-slate-400">{selectedPlanet.description}</div>
                    <div className="mt-3">
                      <div className="text-xs text-teal-400 font-semibold mb-1">Composition:</div>
                      <div className="text-xs text-slate-400">{selectedPlanet.composition}</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-400 font-semibold mb-1">Pressure:</div>
                      <div className="text-xs text-slate-400">{selectedPlanet.pressure}</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Atmospheric Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Temperature Profile</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Surface</div>
                <div className="text-2xl font-bold text-teal-400">{temperature} K</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Lapse Rate</div>
                <div className="text-2xl font-bold text-teal-400">-6.5 K/km</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Pressure & Density</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Surface Pressure</div>
                <div className="text-2xl font-bold text-teal-400">101.3 kPa</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Scale Height</div>
                <div className="text-2xl font-bold text-teal-400">8.5 km</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Radiation Transfer</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Solar Constant</div>
                <div className="text-2xl font-bold text-teal-400">1361 W/m²</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Albedo</div>
                <div className="text-2xl font-bold text-teal-400">0.30</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Atmospheric Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Atmospheric Composition',
                  description: 'Analyze gas mixtures and their effects on climate.',
                },
                {
                  title: 'Climate Modeling',
                  description: 'Simulate planetary climate systems and feedback mechanisms.',
                },
                {
                  title: 'Weather Simulation',
                  description: 'Model atmospheric dynamics and weather patterns.',
                },
                {
                  title: 'Radiation Transfer',
                  description: 'Calculate energy balance and greenhouse effects.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-teal-600/20 border border-teal-500/30">
                      <span className="text-teal-400 font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
