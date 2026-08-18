import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Atom, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function QuantumAstrophysicsPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedPhenomenon, setSelectedPhenomenon] = useState(null);
  const [energy, setEnergy] = useState(1.0);

  const phenomena = [
    {
      id: 'quantum-tunneling',
      name: 'Quantum Tunneling',
      description: 'Particles tunneling through energy barriers in stellar cores',
      equation: 'P ∝ exp(-2π√(2mV/ℏ²))',
    },
    {
      id: 'neutron-stars',
      name: 'Neutron Star Physics',
      description: 'Quantum degeneracy pressure in ultra-dense matter',
      equation: 'P ∝ n^(5/3)',
    },
    {
      id: 'hawking-radiation',
      name: 'Hawking Radiation',
      description: 'Quantum effects near black hole event horizons',
      equation: 'T_H = ℏc³/(8πGMk_B)',
    },
    {
      id: 'pair-production',
      name: 'Pair Production',
      description: 'Creation of particle-antiparticle pairs near massive objects',
      equation: 'E ≥ 2m_e c²',
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
            <Lightbulb className="text-yellow-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Quantum Astrophysics</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Explore quantum effects in astrophysical systems. Study neutron stars, quantum gravity,
            and the quantum mechanics of extreme environments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quantum Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Atom size={20} className="text-yellow-400" />
                Quantum Effects Simulator
              </h3>

              {/* Quantum Visualization */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Potential well */}
                  <path
                    d="M 50 300 Q 100 100 200 100 Q 300 100 350 300"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  {/* Wave function */}
                  <path
                    d="M 50 250 Q 100 150 200 200 Q 300 250 350 200"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />
                  {/* Energy levels */}
                  <line x1="50" y1="250" x2="350" y2="250" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                  <line x1="50" y1="200" x2="350" y2="200" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                  <line x1="50" y1="150" x2="350" y2="150" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                </svg>
              </div>

              {/* Energy Control */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Particle Energy (MeV)
                  </label>
                  <Input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">{energy.toFixed(1)} MeV</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold flex items-center justify-center gap-2"
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

          {/* Phenomenon Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" />
                Phenomena
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {phenomena.map((phenom) => (
                  <button
                    key={phenom.id}
                    onClick={() => setSelectedPhenomenon(phenom)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedPhenomenon?.id === phenom.id
                        ? 'bg-yellow-600/20 border border-yellow-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{phenom.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{phenom.description}</div>
                  </button>
                ))}
              </div>

              {selectedPhenomenon && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300">
                    <div className="text-xs text-slate-400 mb-2">Governing Equation:</div>
                    <div className="text-xs text-yellow-400 font-mono">{selectedPhenomenon.equation}</div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Quantum Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Wave Properties</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">de Broglie Wavelength</div>
                <div className="text-2xl font-bold text-yellow-400">λ = 1.2 fm</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Compton Wavelength</div>
                <div className="text-2xl font-bold text-yellow-400">λ_C = 2.4 pm</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Tunneling Probability</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Transmission Coefficient</div>
                <div className="text-2xl font-bold text-yellow-400">T = 0.85</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Reflection Coefficient</div>
                <div className="text-2xl font-bold text-yellow-400">R = 0.15</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Relativistic Effects</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Lorentz Factor (γ)</div>
                <div className="text-2xl font-bold text-yellow-400">γ = 2.5</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Velocity (β)</div>
                <div className="text-2xl font-bold text-yellow-400">β = 0.92c</div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Quantum Astrophysics Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Quantum Mechanics',
                  description: 'Solve Schrödinger equation for astrophysical systems.',
                },
                {
                  title: 'Neutron Star Physics',
                  description: 'Model degenerate matter and neutron star structure.',
                },
                {
                  title: 'Quantum Gravity',
                  description: 'Explore quantum effects near black holes and singularities.',
                },
                {
                  title: 'Particle Physics',
                  description: 'Study particle creation and annihilation in extreme fields.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-600/20 border border-yellow-500/30">
                      <span className="text-yellow-400 font-bold">✓</span>
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
