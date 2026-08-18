import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Zap, Eye, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CosmologyExplorerPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [redshift, setRedshift] = useState(0.5);
  const [selectedEpoch, setSelectedEpoch] = useState(null);

  const epochs = [
    {
      id: 'big-bang',
      name: 'Big Bang',
      age: '0 s',
      temperature: '∞ K',
      description: 'Initial singularity and inflation',
    },
    {
      id: 'recombination',
      name: 'Recombination',
      age: '380,000 years',
      temperature: '3,000 K',
      description: 'Electrons combine with nuclei, universe becomes transparent',
    },
    {
      id: 'dark-ages',
      name: 'Dark Ages',
      age: '100 million years',
      temperature: '50 K',
      description: 'First stars and galaxies form',
    },
    {
      id: 'present',
      name: 'Present Day',
      age: '13.8 billion years',
      temperature: '2.7 K',
      description: 'Current universe with galaxies and cosmic structure',
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
            <Waves className="text-violet-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Cosmology Explorer</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Explore the universe at large scales. Study dark matter, dark energy, and cosmic structure
            from the Big Bang to the present day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Universe Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Eye size={20} className="text-violet-400" />
                Universe Evolution
              </h3>

              {/* Universe Visualization */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Cosmic web structure */}
                  <defs>
                    <radialGradient id="cosmicGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="150" fill="url(#cosmicGrad)" />
                  {/* Galaxy clusters */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 100 + Math.sin(i) * 30;
                    const x = 200 + Math.cos(angle) * radius;
                    const y = 200 + Math.sin(angle) * radius;
                    return (
                      <circle key={i} cx={x} cy={y} r="3" fill="#a78bfa" opacity="0.7" />
                    );
                  })}
                </svg>
              </div>

              {/* Redshift Control */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Redshift (z)
                  </label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={redshift}
                    onChange={(e) => setRedshift(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">z = {redshift.toFixed(1)}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isSimulating ? '⏸ Stop' : '▶ Start'} Evolution
                  </Button>
                  <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Cosmic Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-violet-400" />
                Cosmic Timeline
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {epochs.map((epoch) => (
                  <button
                    key={epoch.id}
                    onClick={() => setSelectedEpoch(epoch)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedEpoch?.id === epoch.id
                        ? 'bg-violet-600/20 border border-violet-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{epoch.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{epoch.age}</div>
                    <div className="text-xs text-slate-500 mt-2">{epoch.temperature}</div>
                  </button>
                ))}
              </div>

              {selectedEpoch && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300">
                    <p className="text-xs text-slate-400 mb-2">{selectedEpoch.description}</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Cosmic Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Dark Matter</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Density</div>
                <div className="text-2xl font-bold text-violet-400">27%</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Distribution</div>
                <div className="text-sm text-slate-300">Cosmic Web</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Dark Energy</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Density</div>
                <div className="text-2xl font-bold text-violet-400">68%</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Effect</div>
                <div className="text-sm text-slate-300">Acceleration</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ordinary Matter</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Density</div>
                <div className="text-2xl font-bold text-violet-400">5%</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Composition</div>
                <div className="text-sm text-slate-300">Baryonic</div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Cosmology Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Universe Expansion',
                  description: 'Model cosmic expansion and calculate distances using redshift.',
                },
                {
                  title: 'Dark Matter Mapping',
                  description: 'Visualize the cosmic web and dark matter distribution.',
                },
                {
                  title: 'Galaxy Clusters',
                  description: 'Study large-scale structure and galaxy clustering.',
                },
                {
                  title: 'Redshift Analysis',
                  description: 'Determine distances and velocities from spectroscopic data.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-violet-600/20 border border-violet-500/30">
                      <span className="text-violet-400 font-bold">✓</span>
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
