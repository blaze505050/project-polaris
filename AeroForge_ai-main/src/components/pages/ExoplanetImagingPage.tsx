import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Aperture, Zap, Download, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExoplanetImagingPage() {
  const [isImaging, setIsImaging] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [wavelength, setWavelength] = useState(550);

  const techniques = [
    {
      id: 'direct-imaging',
      name: 'Direct Imaging',
      description: 'Directly observe light reflected or emitted by exoplanets',
      contrast: '10⁻⁶',
      wavelength: 'Infrared',
    },
    {
      id: 'transit',
      name: 'Transit Photometry',
      description: 'Measure brightness dips as planets cross their host star',
      contrast: '10⁻²',
      wavelength: 'Visible/IR',
    },
    {
      id: 'radial-velocity',
      name: 'Radial Velocity',
      description: 'Detect stellar motion caused by planetary gravity',
      contrast: 'N/A',
      wavelength: 'Spectroscopy',
    },
    {
      id: 'astrometry',
      name: 'Astrometry',
      description: 'Measure precise positions of stars over time',
      contrast: 'N/A',
      wavelength: 'Visible',
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
            <Eye className="text-cyan-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Exoplanet Imaging</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Advanced imaging techniques for detecting and characterizing exoplanets.
            Explore direct imaging, transit photometry, radial velocity, and astrometry methods.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Imaging Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Aperture size={20} className="text-cyan-400" />
                Imaging Simulation
              </h3>

              {/* Image Display */}
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32" viewBox="0 0 100 100">
                    {/* Star */}
                    <circle cx="50" cy="50" r="8" fill="#fbbf24" opacity="0.9" />
                    {/* Diffraction spikes */}
                    <line x1="50" y1="20" x2="50" y2="0" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                    <line x1="50" y1="80" x2="50" y2="100" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                    <line x1="20" y1="50" x2="0" y2="50" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                    <line x1="80" y1="50" x2="100" y2="50" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                    {/* Exoplanet */}
                    <circle cx="70" cy="50" r="2" fill="#06b6d4" opacity="0.8" />
                  </svg>
                </div>
              </div>

              {/* Wavelength Control */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Wavelength (nm)
                  </label>
                  <Input
                    type="range"
                    min="400"
                    max="2000"
                    value={wavelength}
                    onChange={(e) => setWavelength(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">{wavelength} nm</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsImaging(!isImaging)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isImaging ? '⏸ Stop' : '▶ Start'} Imaging
                  </Button>
                  <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold">
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Technique Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" />
                Detection Methods
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {techniques.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnique(tech)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedTechnique?.id === tech.id
                        ? 'bg-cyan-600/20 border border-cyan-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{tech.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{tech.wavelength}</div>
                  </button>
                ))}
              </div>

              {selectedTechnique && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300 space-y-2">
                    <p className="text-xs text-slate-400">{selectedTechnique.description}</p>
                    <div className="mt-3">
                      <span className="text-cyan-400 font-semibold">Contrast:</span> {selectedTechnique.contrast}
                    </div>
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
            <h3 className="text-lg font-bold text-white mb-4">Angular Resolution</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Current</div>
                <div className="text-2xl font-bold text-cyan-400">0.05"</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Diffraction Limit</div>
                <div className="text-2xl font-bold text-cyan-400">0.02"</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Detection Sensitivity</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Magnitude Limit</div>
                <div className="text-2xl font-bold text-cyan-400">m = 28</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Signal-to-Noise</div>
                <div className="text-2xl font-bold text-cyan-400">SNR = 100</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Observation Time</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Integration</div>
                <div className="text-2xl font-bold text-cyan-400">3600 s</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Total</div>
                <div className="text-2xl font-bold text-cyan-400">1 hour</div>
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
            <h2 className="text-2xl font-bold text-white mb-6">Imaging Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Multi-wavelength Imaging',
                  description: 'Observe across UV, visible, and infrared wavelengths.',
                },
                {
                  title: 'Adaptive Optics',
                  description: 'Correct for atmospheric distortion to improve resolution.',
                },
                {
                  title: 'Spectroscopic Analysis',
                  description: 'Analyze light spectra to determine planetary composition.',
                },
                {
                  title: 'Time-series Photometry',
                  description: 'Track brightness variations to detect transiting planets.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-600/20 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">✓</span>
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
