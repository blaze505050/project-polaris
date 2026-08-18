import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Zap, Download, Play, Pause } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SpaceflightDynamicsPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [deltaV, setDeltaV] = useState(3.2);

  const missions = [
    {
      id: 'leo-transfer',
      name: 'LEO Transfer Orbit',
      type: 'Earth Orbit',
      deltaV: 9.7,
      duration: '90 min',
      description: 'Transfer from Earth surface to Low Earth Orbit',
    },
    {
      id: 'gto',
      name: 'Geostationary Transfer',
      type: 'Earth-GEO',
      deltaV: 10.9,
      duration: '5.5 hours',
      description: 'Transfer from LEO to Geostationary Orbit',
    },
    {
      id: 'lunar-transfer',
      name: 'Lunar Transfer',
      type: 'Earth-Moon',
      deltaV: 3.2,
      duration: '3 days',
      description: 'Trans-lunar injection and lunar orbit insertion',
    },
    {
      id: 'mars-transfer',
      name: 'Mars Transfer Orbit',
      type: 'Interplanetary',
      deltaV: 5.3,
      duration: '6-9 months',
      description: 'Hohmann transfer from Earth to Mars',
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
            <Rocket className="text-red-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Spaceflight Dynamics</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Design and simulate spacecraft trajectories. Plan missions, optimize orbital transfers,
            and calculate delta-v requirements for interplanetary exploration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Trajectory Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Target size={20} className="text-red-400" />
                Trajectory Visualization
              </h3>

              {/* Orbit Display */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Central body */}
                  <circle cx="200" cy="200" r="30" fill="#3b82f6" opacity="0.8" />
                  {/* Orbit paths */}
                  <circle cx="200" cy="200" r="80" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                  <circle cx="200" cy="200" r="160" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                  {/* Spacecraft */}
                  <circle cx="280" cy="200" r="6" fill="#ef4444" />
                  <text x="290" y="205" fill="#ef4444" fontSize="12">Spacecraft</text>
                </svg>
              </div>

              {/* Mission Parameters */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Delta-V Required (km/s)
                  </label>
                  <Input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={deltaV}
                    onChange={(e) => setDeltaV(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">{deltaV.toFixed(1)} km/s</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isSimulating ? (
                      <>
                        <Pause size={18} />
                        Stop Simulation
                      </>
                    ) : (
                      <>
                        <Play size={18} />
                        Start Simulation
                      </>
                    )}
                  </Button>
                  <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mission Planner */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Rocket size={20} className="text-red-400" />
                Mission Profiles
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {missions.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => setSelectedMission(mission)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedMission?.id === mission.id
                        ? 'bg-red-600/20 border border-red-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{mission.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{mission.type}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      ΔV: {mission.deltaV} km/s | {mission.duration}
                    </div>
                  </button>
                ))}
              </div>

              {selectedMission && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300 space-y-2">
                    <div>
                      <span className="text-red-400 font-semibold">Delta-V:</span> {selectedMission.deltaV} km/s
                    </div>
                    <div>
                      <span className="text-red-400 font-semibold">Duration:</span> {selectedMission.duration}
                    </div>
                    <div className="text-xs text-slate-400 mt-3">{selectedMission.description}</div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Orbital Velocity</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Current</div>
                <div className="text-2xl font-bold text-red-400">7.8 km/s</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Target</div>
                <div className="text-2xl font-bold text-cyan-400">10.9 km/s</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Fuel Requirements</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Propellant Mass</div>
                <div className="text-2xl font-bold text-orange-400">45,000 kg</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Specific Impulse</div>
                <div className="text-2xl font-bold text-cyan-400">450 s</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Mission Timeline</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Launch Window</div>
                <div className="text-2xl font-bold text-green-400">45 days</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Transit Time</div>
                <div className="text-2xl font-bold text-cyan-400">6 months</div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Spaceflight Planning Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Trajectory Design',
                  description: 'Calculate optimal transfer orbits using Hohmann transfers and Lambert solutions.',
                },
                {
                  title: 'Delta-V Analysis',
                  description: 'Determine fuel requirements and mission feasibility for any trajectory.',
                },
                {
                  title: 'Launch Windows',
                  description: 'Identify optimal launch opportunities for interplanetary missions.',
                },
                {
                  title: 'Orbital Mechanics',
                  description: 'Analyze orbital elements and predict spacecraft positions.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-600/20 border border-red-500/30">
                      <span className="text-red-400 font-bold">✓</span>
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
