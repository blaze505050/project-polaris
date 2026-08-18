import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Telescope, Search, Download, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VirtualObservatoryPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [exposureTime, setExposureTime] = useState(30);
  const [filter, setFilter] = useState('visible');

  const celestialObjects = [
    {
      id: 'm31',
      name: 'Andromeda Galaxy',
      type: 'Galaxy',
      ra: '00h42m44.3s',
      dec: '+41°16\'09"',
      magnitude: 3.4,
      distance: '2.5 Mly',
      description: 'The nearest major galaxy to the Milky Way',
    },
    {
      id: 'm42',
      name: 'Orion Nebula',
      type: 'Nebula',
      ra: '05h35m24s',
      dec: '-05°23\'14"',
      magnitude: 4.0,
      distance: '1,344 ly',
      description: 'A stellar nursery with active star formation',
    },
    {
      id: 'm51',
      name: 'Whirlpool Galaxy',
      type: 'Galaxy',
      ra: '13h29m52.7s',
      dec: '+47°11\'43"',
      magnitude: 8.4,
      distance: '23 Mly',
      description: 'A classic spiral galaxy with prominent arms',
    },
    {
      id: 'sirius',
      name: 'Sirius A',
      type: 'Star',
      ra: '06h45m08.9s',
      dec: '-16°42\'46"',
      magnitude: -1.46,
      distance: '8.6 ly',
      description: 'The brightest star in the night sky',
    },
  ];

  const filters = [
    { id: 'visible', name: 'Visible Light', wavelength: '400-700 nm' },
    { id: 'infrared', name: 'Infrared', wavelength: '700 nm - 1 mm' },
    { id: 'ultraviolet', name: 'Ultraviolet', wavelength: '10-400 nm' },
    { id: 'xray', name: 'X-Ray', wavelength: '0.01-10 nm' },
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
            <Telescope className="text-cyan-400" size={32} />
            <h1 className="text-5xl font-bold text-white">Virtual Observatory</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Conduct real-time celestial observations using professional-grade instruments. 
            Access live sky data, perform photometric surveys, and analyze stellar spectra.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Observation Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-8 h-full">
              <div className="bg-slate-900/80 rounded-lg p-8 mb-6 aspect-video flex items-center justify-center border border-slate-700">
                <div className="text-center">
                  <Telescope size={64} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {selectedObject ? `Observing: ${selectedObject.name}` : 'Select an object to observe'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Exposure Time (seconds)
                  </label>
                  <Input
                    type="range"
                    min="1"
                    max="300"
                    value={exposureTime}
                    onChange={(e) => setExposureTime(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 mt-1">{exposureTime}s</div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block">
                    Observation Filter
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {filters.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          filter === f.id
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="font-semibold">{f.name}</div>
                        <div className="text-xs opacity-75">{f.wavelength}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isSimulating ? (
                      <>
                        <Pause size={18} />
                        Stop Observation
                      </>
                    ) : (
                      <>
                        <Play size={18} />
                        Start Observation
                      </>
                    )}
                  </Button>
                  <Button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-2">
                    <RotateCcw size={18} />
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Object Catalog */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Search size={20} className="text-cyan-400" />
                Object Catalog
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {celestialObjects.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setSelectedObject(obj)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedObject?.id === obj.id
                        ? 'bg-cyan-600/20 border border-cyan-500'
                        : 'bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-semibold text-white">{obj.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{obj.type}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      Mag: {obj.magnitude} | {obj.distance}
                    </div>
                  </button>
                ))}
              </div>

              {selectedObject && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-300 space-y-2">
                    <div>
                      <span className="text-cyan-400 font-semibold">RA:</span> {selectedObject.ra}
                    </div>
                    <div>
                      <span className="text-cyan-400 font-semibold">Dec:</span> {selectedObject.dec}
                    </div>
                    <div className="text-xs text-slate-400 mt-3">{selectedObject.description}</div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Data Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Photometric Analysis</h3>
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Apparent Magnitude</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {selectedObject?.magnitude || '—'}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Distance</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {selectedObject?.distance || '—'}
                </div>
              </div>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center justify-center gap-2">
                <Download size={18} />
                Export Data
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Spectroscopic Analysis</h3>
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Spectral Type</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {selectedObject?.type || '—'}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Redshift</div>
                <div className="text-2xl font-bold text-cyan-400">z = 0.000</div>
              </div>
              <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center justify-center gap-2">
                <Settings size={18} />
                Advanced Analysis
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How to Use the Virtual Observatory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Select an Object',
                  description: 'Choose from the catalog or search for specific celestial objects.',
                },
                {
                  title: 'Configure Observation',
                  description: 'Set exposure time and select the appropriate observation filter.',
                },
                {
                  title: 'Analyze Results',
                  description: 'View photometric and spectroscopic data, then export for further analysis.',
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-600/20 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">{idx + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.description}</p>
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
