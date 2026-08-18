import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Flame, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AstronomicalConstants } from '@/services/astronomicalConstants';

interface StellarModel {
  age: number; // years
  mass: number; // solar masses
  radius: number; // solar radii
  luminosity: number; // solar luminosities
  temperature: number; // Kelvin
  stage: string;
  description: string;
  lifespan: number; // years
}

export default function AstroLabStellarEvolutionPage() {
  const navigate = useNavigate();

  // Initial mass (determines entire evolution)
  const [initialMass, setInitialMass] = useState(1.0); // Solar masses
  const [evolutionAge, setEvolutionAge] = useState(0); // years (0 = birth, 1 = main sequence end)

  // Calculate stellar evolution using Hertzsprung-Russell diagram principles
  const stellarModel = useMemo(() => {
    const model: StellarModel = {
      age: 0,
      mass: initialMass,
      radius: 1,
      luminosity: 1,
      temperature: 5778,
      stage: 'Main Sequence',
      description: '',
      lifespan: 0,
    };

    // Main sequence lifespan (Bahcall-Pinsonneault)
    const msLifespan = 1e10 * Math.pow(initialMass, -2.5); // years
    model.lifespan = msLifespan;

    // Current age based on slider (0 to 1 = birth to end of main sequence)
    model.age = evolutionAge * msLifespan;

    // Mass-Luminosity relation (L ∝ M^3.5 for main sequence)
    const msLuminosity = Math.pow(initialMass, 3.5);

    // Mass-Radius relation (R ∝ M^0.5 for main sequence)
    const msRadius = Math.pow(initialMass, 0.5);

    // Temperature from Stefan-Boltzmann law
    const msTemperature = 5778 * Math.pow(initialMass, 0.54);

    if (evolutionAge < 0.85) {
      // Main Sequence
      model.stage = 'Main Sequence';
      model.luminosity = msLuminosity;
      model.radius = msRadius;
      model.temperature = msTemperature;
      model.description = `Stable hydrogen burning in core. ${(100 * evolutionAge).toFixed(1)}% through main sequence lifetime.`;
    } else if (evolutionAge < 0.92) {
      // Red Giant Branch
      model.stage = 'Red Giant';
      const rgProgress = (evolutionAge - 0.85) / 0.07;
      model.luminosity = msLuminosity * (1 + rgProgress * 100);
      model.radius = msRadius * (1 + rgProgress * 50);
      model.temperature = msTemperature * (1 - rgProgress * 0.3);
      model.description = `Hydrogen shell burning. Core contracting, envelope expanding. ${(rgProgress * 100).toFixed(0)}% through RGB.`;
    } else if (evolutionAge < 0.95) {
      // Horizontal Branch / Core Helium Burning
      model.stage = 'Horizontal Branch';
      model.luminosity = msLuminosity * 50;
      model.radius = msRadius * 10;
      model.temperature = msTemperature * 0.8;
      model.description = `Helium burning in core. Brief stable phase before asymptotic giant branch.`;
    } else if (evolutionAge < 0.99) {
      // Asymptotic Giant Branch
      model.stage = 'Asymptotic Giant';
      const agbProgress = (evolutionAge - 0.95) / 0.04;
      model.luminosity = msLuminosity * (50 + agbProgress * 200);
      model.radius = msRadius * (10 + agbProgress * 100);
      model.temperature = msTemperature * 0.7;
      model.description = `Helium and hydrogen shell burning. Rapid mass loss via stellar wind.`;
    } else {
      // White Dwarf
      model.stage = 'White Dwarf';
      model.luminosity = msLuminosity * 0.001;
      model.radius = 0.01; // Earth-sized
      model.temperature = 8000 + (1 - evolutionAge) * 10000; // Cooling over time
      model.description = `Remnant core cooling slowly. No more nuclear fusion. Lifetime: trillions of years.`;
    }

    return model;
  }, [initialMass, evolutionAge]);

  // HR Diagram position
  const getHRDiagramPosition = () => {
    const tempRange = [2500, 10000];
    const lumRange = [0.0001, 100000];

    const x = ((Math.log10(stellarModel.temperature) - Math.log10(tempRange[0])) / 
               (Math.log10(tempRange[1]) - Math.log10(tempRange[0]))) * 100;
    
    const y = 100 - ((Math.log10(stellarModel.luminosity) - Math.log10(lumRange[0])) / 
                     (Math.log10(lumRange[1]) - Math.log10(lumRange[0]))) * 100;

    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const hrPosition = getHRDiagramPosition();

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      parameters: {
        initialMass,
        evolutionAge,
      },
      model: stellarModel,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stellar-evolution-${Date.now()}.json`;
    a.click();
  };

  const stageColor = {
    'Main Sequence': 'text-blue-400',
    'Red Giant': 'text-red-400',
    'Horizontal Branch': 'text-yellow-400',
    'Asymptotic Giant': 'text-orange-400',
    'White Dwarf': 'text-slate-300',
  };

  const stageBgColor = {
    'Main Sequence': 'bg-blue-500/20 border-blue-500/50',
    'Red Giant': 'bg-red-500/20 border-red-500/50',
    'Horizontal Branch': 'bg-yellow-500/20 border-yellow-500/50',
    'Asymptotic Giant': 'bg-orange-500/20 border-orange-500/50',
    'White Dwarf': 'bg-slate-500/20 border-slate-500/50',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/astrolab/orbital-mechanics')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to AstroLab
          </button>

          <h1 className="text-5xl font-bold text-white mb-4">Stellar Evolution Simulator</h1>
          <p className="text-xl text-slate-300">
            Explore the life cycle of stars from birth to death using Hertzsprung-Russell diagram principles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame size={20} className="text-orange-400" />
                Evolution Parameters
              </h2>

              <div className="space-y-6">
                {/* Initial Mass */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    Initial Mass (Solar Masses)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={initialMass}
                    onChange={(e) => setInitialMass(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-cyan-300 font-mono">{initialMass.toFixed(1)} M☉</div>
                  <div className="text-xs text-slate-400 mt-2">
                    Main Sequence Lifetime: {(stellarModel.lifespan / 1e9).toFixed(1)} billion years
                  </div>
                </div>

                {/* Evolution Progress */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                    Evolutionary Stage
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={evolutionAge}
                    onChange={(e) => setEvolutionAge(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-cyan-300 font-mono">
                    {(stellarModel.age / 1e9).toFixed(2)} Gyr
                  </div>
                </div>

                <Button
                  onClick={handleExport}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export Model
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Visualization & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Current Stage */}
            <Card className={`border-2 p-8 ${stageBgColor[stellarModel.stage as keyof typeof stageBgColor]}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Stage</h3>
                  <h2 className={`text-4xl font-bold ${stageColor[stellarModel.stage as keyof typeof stageColor]}`}>
                    {stellarModel.stage}
                  </h2>
                </div>
                <Flame size={40} className={stageColor[stellarModel.stage as keyof typeof stageColor]} />
              </div>
              <p className="text-slate-300">{stellarModel.description}</p>
            </Card>

            {/* HR Diagram */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                Hertzsprung-Russell Diagram
              </h3>
              <div className="relative w-full aspect-square bg-slate-900 rounded border border-slate-700">
                {/* HR Diagram Background */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  {/* Main Sequence */}
                  <path
                    d="M 10 90 Q 30 70 50 40 Q 70 20 90 5"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Red Giant Branch */}
                  <path
                    d="M 50 40 Q 40 30 35 10"
                    stroke="rgba(239, 68, 68, 0.3)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Horizontal Branch */}
                  <path
                    d="M 35 10 Q 45 15 55 20"
                    stroke="rgba(234, 179, 8, 0.3)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* AGB */}
                  <path
                    d="M 55 20 Q 40 5 30 2"
                    stroke="rgba(249, 115, 22, 0.3)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* White Dwarf */}
                  <circle cx="85" cy="85" r="3" fill="rgba(203, 213, 225, 0.3)" />

                  {/* Axes */}
                  <line x1="5" y1="95" x2="95" y2="95" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" />
                  <line x1="5" y1="95" x2="5" y2="5" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" />

                  {/* Labels */}
                  <text x="50" y="98" textAnchor="middle" fill="rgba(148, 163, 184, 0.7)" fontSize="8">
                    Temperature (K)
                  </text>
                  <text x="2" y="50" textAnchor="middle" fill="rgba(148, 163, 184, 0.7)" fontSize="8" transform="rotate(-90 2 50)">
                    Luminosity (L☉)
                  </text>

                  {/* Current Position */}
                  <motion.circle
                    cx={hrPosition.x}
                    cy={hrPosition.y}
                    r="2"
                    fill="currentColor"
                    className="text-cyan-400"
                    animate={{
                      cx: hrPosition.x,
                      cy: hrPosition.y,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
              </div>
            </Card>

            {/* Stellar Properties */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Radius</h4>
                <div className="text-2xl font-bold text-white">{stellarModel.radius.toFixed(2)} R☉</div>
                <div className="text-xs text-slate-400 mt-2">
                  {(stellarModel.radius * AstronomicalConstants.SOLAR_RADIUS / 1e9).toFixed(2)} million km
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Luminosity</h4>
                <div className="text-2xl font-bold text-white">{stellarModel.luminosity.toFixed(2)} L☉</div>
                <div className="text-xs text-slate-400 mt-2">
                  {(stellarModel.luminosity * AstronomicalConstants.SOLAR_LUMINOSITY / 1e26).toFixed(2)} × 10²⁶ W
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Temperature</h4>
                <div className="text-2xl font-bold text-white">{stellarModel.temperature.toFixed(0)} K</div>
                <div className="text-xs text-slate-400 mt-2">
                  {(stellarModel.temperature - 273.15).toFixed(0)}°C
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Mass</h4>
                <div className="text-2xl font-bold text-white">{stellarModel.mass.toFixed(1)} M☉</div>
                <div className="text-xs text-slate-400 mt-2">
                  {(stellarModel.mass * AstronomicalConstants.SOLAR_MASS / 1e30).toFixed(1)} × 10³⁰ kg
                </div>
              </Card>
            </div>

            {/* Evolution Stages Info */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={18} />
                Stellar Evolution Stages
              </h4>
              <div className="space-y-3 text-sm text-slate-300">
                <div>
                  <span className="text-blue-400 font-semibold">Main Sequence:</span> Hydrogen burning in core. Longest phase (90% of lifetime).
                </div>
                <div>
                  <span className="text-red-400 font-semibold">Red Giant:</span> Hydrogen shell burning. Core contracts, envelope expands.
                </div>
                <div>
                  <span className="text-yellow-400 font-semibold">Horizontal Branch:</span> Helium burning in core. Brief stable phase.
                </div>
                <div>
                  <span className="text-orange-400 font-semibold">Asymptotic Giant:</span> Helium and hydrogen shell burning. Rapid mass loss.
                </div>
                <div>
                  <span className="text-slate-300 font-semibold">White Dwarf:</span> Cooling remnant. No fusion. Lifetime: trillions of years.
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
