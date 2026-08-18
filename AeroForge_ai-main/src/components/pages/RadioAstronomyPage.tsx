import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Waves, Activity, Download, Play, Pause } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RadioAstronomyPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);

  const signals = [
    {
      id: 'pulsar-b1919',
      name: 'PSR B1919+21',
      type: 'Pulsar',
      frequency: '1420 MHz',
      period: '1.337 s',
      description: 'The first discovered pulsar',
      signalStrength: 85,
    },
    {
      id: 'cmb',
      name: 'Cosmic Microwave Background',
      type: 'Radiation',
      frequency: '160 GHz',
      period: 'Continuous',
      description: 'Afterglow of the Big Bang',
      signalStrength: 92,
    },
    {
      id: 'quasar-3c273',
      name: '3C 273',
      type: 'Quasar',
      frequency: '1400 MHz',
      period: 'Variable',
      description: 'Brightest quasar in the sky',
      signalStrength: 78,
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
            <Radio className="text-indigo-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Radio Astronomy Suite</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Analyze radio signals from space. Study pulsars, quasars, and the cosmic microwave background
            using advanced signal processing and interferometry techniques.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Signal Analyzer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Waves size={20} className="text-indigo-400" />
                Signal Analysis
              </h3>

              {/* Waveform Display */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <div className="w-full h-full flex items-end justify-center gap-1">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t opacity-70"
                      style={{
                        height: `${Math.sin(i * 0.2) * 40 + 50}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={() => setIsAnalyzing(!isAnalyzing)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Pause size={18} />
                      Stop Analysis
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Start Analysis
                    </>
                  )}
                </Button>
                <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                  <Download size={18} />
                </Button>
              </div>

              {/* Analysis Results */}
              {selectedSignal && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-2">Signal Strength</div>
                    <div className="text-2xl font-bold text-indigo-400">{selectedSignal.signalStrength}%</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-2">Frequency</div>
                    <div className="text-2xl font-bold text-indigo-400">{selectedSignal.frequency}</div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Signal Catalog */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-indigo-400" />
                Signal Sources
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {signals.map((signal) => (
                  <button
                    key={signal.id}
                    onClick={() => setSelectedSignal(signal)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedSignal?.id === signal.id
                        ? 'bg-indigo-600/20 border border-indigo-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{signal.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{signal.type}</div>
                    <div className="text-xs text-slate-500 mt-2">{signal.frequency}</div>
                  </button>
                ))}
              </div>

              {selectedSignal && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300 space-y-2">
                    <div>
                      <span className="text-indigo-400 font-semibold">Period:</span> {selectedSignal.period}
                    </div>
                    <div className="text-xs text-slate-400 mt-3">{selectedSignal.description}</div>
                  </div>
                </div>
              )}
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
            <h2 className="text-2xl font-bold text-white mb-6">Radio Astronomy Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Pulsar Detection',
                  description: 'Identify and analyze periodic radio signals from rotating neutron stars.',
                },
                {
                  title: 'Interferometry',
                  description: 'Combine signals from multiple telescopes for enhanced resolution.',
                },
                {
                  title: 'CMB Analysis',
                  description: 'Study the cosmic microwave background radiation and its properties.',
                },
                {
                  title: 'Quasar Monitoring',
                  description: 'Track variable radio sources and analyze their temporal behavior.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                      <span className="text-indigo-400 font-bold">✓</span>
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
