import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Orbit, Zap, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CelestialMechanicsPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [eccentricity, setEccentricity] = useState(0.3);

  const problems = [
    {
      id: 'two-body',
      name: 'Two-Body Problem',
      description: 'Gravitational interaction between two massive bodies',
      equations: ['F = GMm/r²', 'a = -GM/r²'],
    },
    {
      id: 'three-body',
      name: 'Three-Body Problem',
      description: 'Complex dynamics of three mutually gravitating bodies',
      equations: ['Chaotic', 'Lagrange Points'],
    },
    {
      id: 'perturbations',
      name: 'Perturbation Analysis',
      description: 'Effects of small forces on orbital motion',
      equations: ['δa/dt', 'δe/dt', 'δω/dt'],
    },
    {
      id: 'resonances',
      name: 'Orbital Resonances',
      description: 'Periodic gravitational interactions between orbits',
      equations: ['Mean Motion', 'Commensurability'],
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
            <Compass className="text-sky-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Celestial Mechanics</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Master orbital mechanics and gravitational interactions. Solve N-body problems,
            analyze orbital elements, and study resonances and stability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Mechanics Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Orbit size={20} className="text-sky-400" />
                Orbital Dynamics
              </h3>

              {/* Orbit Visualization */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Central body */}
                  <circle cx="200" cy="200" r="15" fill="#3b82f6" />
                  {/* Elliptical orbit */}
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="120"
                    ry={120 * (1 - eccentricity)}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  {/* Orbiting body */}
                  <circle cx="320" cy="200" r="6" fill="#ef4444" />
                  {/* Velocity vector */}
                  <line x1="320" y1="200" x2="320" y2="140" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>
              </div>

              {/* Eccentricity Control */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Eccentricity (e)
                  </label>
                  <Input
                    type="range"
                    min="0"
                    max="0.99"
                    step="0.01"
                    value={eccentricity}
                    onChange={(e) => setEccentricity(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">e = {eccentricity.toFixed(2)}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center justify-center gap-2"
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

          {/* Problem Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-sky-400" />
                Problems
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {problems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedProblem?.id === problem.id
                        ? 'bg-sky-600/20 border border-sky-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{problem.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{problem.description}</div>
                  </button>
                ))}
              </div>

              {selectedProblem && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300">
                    <div className="text-xs text-slate-400 mb-2">Key Equations:</div>
                    {selectedProblem.equations.map((eq, idx) => (
                      <div key={idx} className="text-xs text-sky-400 font-mono">{eq}</div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Orbital Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Semi-major Axis</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Value (a)</div>
                <div className="text-2xl font-bold text-sky-400">1.0 AU</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Period</div>
                <div className="text-2xl font-bold text-sky-400">1.0 yr</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Eccentricity</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Value (e)</div>
                <div className="text-2xl font-bold text-sky-400">{eccentricity.toFixed(2)}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Orbit Type</div>
                <div className="text-sm text-slate-300">
                  {eccentricity < 0.1 ? 'Circular' : eccentricity < 1 ? 'Elliptical' : 'Hyperbolic'}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Orbital Energy</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Specific Energy</div>
                <div className="text-2xl font-bold text-sky-400">-0.5 J/kg</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Angular Momentum</div>
                <div className="text-2xl font-bold text-sky-400">h = 1.0</div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Celestial Mechanics Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Orbital Element Analysis',
                  description: 'Calculate and visualize Keplerian orbital elements.',
                },
                {
                  title: 'Perturbation Effects',
                  description: 'Model how external forces affect orbital parameters.',
                },
                {
                  title: 'Resonance Detection',
                  description: 'Identify mean motion resonances and their stability.',
                },
                {
                  title: 'Stability Analysis',
                  description: 'Determine long-term orbital stability and chaos.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-600/20 border border-sky-500/30">
                      <span className="text-sky-400 font-bold">✓</span>
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
