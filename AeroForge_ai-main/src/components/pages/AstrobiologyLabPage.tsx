import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Droplets, Zap, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AstrobiologyLabPage() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const planets = [
    {
      id: 'kepler-452b',
      name: 'Kepler-452b',
      type: 'Earth-like',
      habitability: 0.87,
      biosignatures: ['O₂', 'CH₄', 'N₂O'],
      description: 'Super-Earth in habitable zone of Sun-like star',
    },
    {
      id: 'trappist-1e',
      name: 'TRAPPIST-1e',
      type: 'Terrestrial',
      habitability: 0.92,
      biosignatures: ['H₂O', 'O₃', 'CH₄'],
      description: 'Earth-sized planet in habitable zone',
    },
    {
      id: 'proxima-b',
      name: 'Proxima Centauri b',
      type: 'Terrestrial',
      habitability: 0.65,
      biosignatures: ['O₂', 'H₂O'],
      description: 'Potentially habitable exoplanet',
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
            <Microscope className="text-lime-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Astrobiology Lab</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Study conditions for life in the universe. Analyze biosignatures, assess habitability factors,
            and explore the potential for extraterrestrial life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Droplets size={20} className="text-lime-400" />
                Habitability Assessment
              </h3>

              {selectedPlanet ? (
                <div className="space-y-6">
                  {/* Habitability Score */}
                  <div className="bg-slate-900/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300">Habitability Index</span>
                      <span className="text-3xl font-bold text-lime-400">
                        {(selectedPlanet.habitability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-lime-600 to-green-600 h-3 rounded-full"
                        style={{ width: `${selectedPlanet.habitability * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Biosignatures */}
                  <div>
                    <h4 className="text-sm font-semibold text-lime-400 uppercase tracking-wider mb-3">
                      Detected Biosignatures
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedPlanet.biosignatures.map((sig, idx) => (
                        <div key={idx} className="bg-slate-900/50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-lime-400">{sig}</div>
                          <div className="text-xs text-slate-400 mt-1">Detected</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis Factors */}
                  <div className="space-y-3">
                    {[
                      { label: 'Atmospheric Composition', value: 85 },
                      { label: 'Temperature Range', value: 92 },
                      { label: 'Water Availability', value: 78 },
                      { label: 'Radiation Levels', value: 65 },
                    ].map((factor, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-slate-300">{factor.label}</span>
                          <span className="text-sm text-lime-400 font-semibold">{factor.value}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-lime-600 to-green-600 h-2 rounded-full"
                            style={{ width: `${factor.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold flex items-center justify-center gap-2">
                    <Download size={18} />
                    Export Analysis Report
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-400">
                  <p>Select a planet to analyze</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Planet Catalog */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-lime-400" />
                Exoplanets
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {planets.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => setSelectedPlanet(planet)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedPlanet?.id === planet.id
                        ? 'bg-lime-600/20 border border-lime-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{planet.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{planet.type}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      Habitability: {(planet.habitability * 100).toFixed(0)}%
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Astrobiology Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Biosignature Detection',
                  description: 'Identify chemical signatures indicative of biological processes.',
                },
                {
                  title: 'Habitability Modeling',
                  description: 'Assess planetary conditions suitable for life as we know it.',
                },
                {
                  title: 'Extremophile Analysis',
                  description: 'Study organisms that thrive in extreme environments.',
                },
                {
                  title: 'SETI Parameters',
                  description: 'Evaluate potential for intelligent life and communication.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-lime-600/20 border border-lime-500/30">
                      <span className="text-lime-400 font-bold">✓</span>
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
