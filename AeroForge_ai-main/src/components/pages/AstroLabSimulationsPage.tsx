import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Save, RotateCcw } from 'lucide-react';
import { useExperimentStore } from '@/stores/experimentStore';
import {
  computeOrbitalState,
  calculateGravitationalForce,
  generateTransitLightCurve,
  computeStellarProperties,
  sanitizeNumericInput,
  PHYSICS_CONSTANTS,
} from '@/services/physicsEngine';

export default function AstroLabSimulationsPage() {
  const [activeTab, setActiveTab] = useState<'orbital' | 'gravity' | 'transit' | 'stellar'>('orbital');
  const [experimentName, setExperimentName] = useState('');
  const [notes, setNotes] = useState('');
  const saveExperiment = useExperimentStore((state) => state.saveExperiment);

  // Orbital Mechanics State
  const [orbitalMass, setOrbitalMass] = useState(PHYSICS_CONSTANTS.M_EARTH);
  const [orbitalRadius, setOrbitalRadius] = useState(6.371e6 + 400e3); // 400 km altitude
  const [orbitalEccentricity, setOrbitalEccentricity] = useState(0);
  const [orbitalState, setOrbitalState] = useState(computeOrbitalState(orbitalMass, orbitalRadius, orbitalEccentricity));

  // Gravity Simulator State
  const [mass1, setMass1] = useState(PHYSICS_CONSTANTS.M_EARTH);
  const [mass2, setMass2] = useState(1000); // kg
  const [distance, setDistance] = useState(1e7); // 10,000 km
  const [gravityResult, setGravityResult] = useState(calculateGravitationalForce(mass1, mass2, distance));

  // Transit Light Curve State
  const [planetRadius, setPlanetRadius] = useState(6.371e6); // Earth radius
  const [starRadius, setStarRadius] = useState(PHYSICS_CONSTANTS.R_SUN);
  const [orbitalPeriod, setOrbitalPeriod] = useState(365.25);
  const [transitCurve, setTransitCurve] = useState(generateTransitLightCurve(planetRadius, starRadius, orbitalPeriod));

  // Stellar Evolution State
  const [stellarMass, setStellarMass] = useState(1); // Solar masses
  const [stellarProps, setStellarProps] = useState(computeStellarProperties(stellarMass));

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Update orbital state
  const handleOrbitalUpdate = (mass: number, radius: number, ecc: number) => {
    const validation = sanitizeNumericInput(mass, 1e20, 1e35, 'Central Mass');
    if (!validation.isValid) {
      setError(validation.warning);
      return;
    }
    setError(null);
    setOrbitalMass(validation.value);
    setOrbitalRadius(radius);
    setOrbitalEccentricity(ecc);
    setOrbitalState(computeOrbitalState(validation.value, radius, ecc));
  };

  // Update gravity calculation
  const handleGravityUpdate = (m1: number, m2: number, dist: number) => {
    const validation = sanitizeNumericInput(dist, 1, Infinity, 'Distance');
    if (!validation.isValid) {
      setError(validation.warning);
      return;
    }
    setError(null);
    setMass1(m1);
    setMass2(m2);
    setDistance(validation.value);
    setGravityResult(calculateGravitationalForce(m1, m2, validation.value));
  };

  // Update transit curve
  const handleTransitUpdate = (pRad: number, sRad: number, period: number) => {
    const validation = sanitizeNumericInput(pRad, 1e6, sRad, 'Planet Radius');
    if (!validation.isValid) {
      setError(validation.warning);
      return;
    }
    setError(null);
    setPlanetRadius(validation.value);
    setStarRadius(sRad);
    setOrbitalPeriod(period);
    setTransitCurve(generateTransitLightCurve(validation.value, sRad, period));
  };

  // Update stellar properties
  const handleStellarUpdate = (mass: number) => {
    const validation = sanitizeNumericInput(mass, 0.1, 100, 'Stellar Mass');
    if (!validation.isValid) {
      setError(validation.warning);
      return;
    }
    setError(null);
    setStellarMass(validation.value);
    setStellarProps(computeStellarProperties(validation.value));
  };

  // Save experiment
  const handleSaveExperiment = () => {
    if (!experimentName.trim()) {
      setError('Please enter an experiment name');
      return;
    }

    let parameters: Record<string, any> = {};
    let results: Record<string, any> = {};

    if (activeTab === 'orbital') {
      parameters = { mass: orbitalMass, radius: orbitalRadius, eccentricity: orbitalEccentricity };
      results = {
        velocity: orbitalState.velocity,
        period: orbitalState.period,
        escapeVelocity: orbitalState.escapeVelocity,
        energy: orbitalState.specificOrbitalEnergy,
      };
    } else if (activeTab === 'gravity') {
      parameters = { mass1, mass2, distance };
      results = { force: gravityResult.force, acceleration: gravityResult.acceleration };
    } else if (activeTab === 'transit') {
      parameters = { planetRadius, starRadius, orbitalPeriod };
      results = { transitDepth: transitCurve.transitDepth, transitDuration: transitCurve.transitDuration };
    } else if (activeTab === 'stellar') {
      parameters = { mass: stellarMass };
      results = {
        lifetime: stellarProps.mainSequenceLifetime,
        temperature: stellarProps.surfaceTemperature,
        luminosity: stellarProps.luminosity,
        spectralClass: stellarProps.spectralClass,
      };
    }

    const saved = saveExperiment({
      name: experimentName,
      type: activeTab,
      parameters,
      results,
      notes,
      tags: [activeTab],
    });

    setError(null);
    setExperimentName('');
    setNotes('');
    alert(`Experiment "${saved.name}" saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Simulation Engine</h1>
          <p className="text-slate-400">
            Run physics-accurate simulations and save your experiments.
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 p-6">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
                {(['orbital', 'gravity', 'transit', 'stellar'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Orbital Mechanics Tab */}
              {activeTab === 'orbital' && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white mb-2 block">
                      Central Mass: {(orbitalMass / PHYSICS_CONSTANTS.M_EARTH).toFixed(2)} M⊕
                    </Label>
                    <Slider
                      value={[orbitalMass]}
                      onValueChange={(val) => handleOrbitalUpdate(val[0], orbitalRadius, orbitalEccentricity)}
                      min={PHYSICS_CONSTANTS.M_EARTH}
                      max={PHYSICS_CONSTANTS.M_SUN}
                      step={1e24}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Orbital Radius: {(orbitalRadius / 1e6).toFixed(0)} km
                    </Label>
                    <Slider
                      value={[orbitalRadius]}
                      onValueChange={(val) => handleOrbitalUpdate(orbitalMass, val[0], orbitalEccentricity)}
                      min={6.371e6}
                      max={1.496e11}
                      step={1e6}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-3">Results</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Orbital Velocity</p>
                        <p className="text-cyan-400 font-mono">{(orbitalState.velocity / 1000).toFixed(2)} km/s</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Period</p>
                        <p className="text-cyan-400 font-mono">{(orbitalState.period / 86400).toFixed(2)} days</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Escape Velocity</p>
                        <p className="text-cyan-400 font-mono">{(orbitalState.escapeVelocity / 1000).toFixed(2)} km/s</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Specific Energy</p>
                        <p className="text-cyan-400 font-mono">{orbitalState.specificOrbitalEnergy.toFixed(0)} J/kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gravity Simulator Tab */}
              {activeTab === 'gravity' && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white mb-2 block">
                      Mass 1: {(mass1 / PHYSICS_CONSTANTS.M_EARTH).toFixed(2)} M⊕
                    </Label>
                    <Slider
                      value={[mass1]}
                      onValueChange={(val) => handleGravityUpdate(val[0], mass2, distance)}
                      min={PHYSICS_CONSTANTS.M_EARTH}
                      max={PHYSICS_CONSTANTS.M_SUN}
                      step={1e24}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Distance: {(distance / 1e6).toFixed(0)} km
                    </Label>
                    <Slider
                      value={[distance]}
                      onValueChange={(val) => handleGravityUpdate(mass1, mass2, val[0])}
                      min={1e6}
                      max={1.496e11}
                      step={1e6}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-3">Results</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Gravitational Force</p>
                        <p className="text-cyan-400 font-mono">{gravityResult.force.toExponential(2)} N</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Acceleration</p>
                        <p className="text-cyan-400 font-mono">{gravityResult.acceleration.toFixed(4)} m/s²</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">{gravityResult.distanceValidation}</p>
                  </div>
                </div>
              )}

              {/* Transit Light Curve Tab */}
              {activeTab === 'transit' && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white mb-2 block">
                      Planet Radius: {(planetRadius / 1e6).toFixed(1)} km
                    </Label>
                    <Slider
                      value={[planetRadius]}
                      onValueChange={(val) => handleTransitUpdate(val[0], starRadius, orbitalPeriod)}
                      min={1e6}
                      max={starRadius}
                      step={1e5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Star Radius: {(starRadius / 1e6).toFixed(1)} km
                    </Label>
                    <Slider
                      value={[starRadius]}
                      onValueChange={(val) => handleTransitUpdate(planetRadius, val[0], orbitalPeriod)}
                      min={planetRadius}
                      max={PHYSICS_CONSTANTS.R_SUN * 2}
                      step={1e7}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-3">Results</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Transit Depth</p>
                        <p className="text-cyan-400 font-mono">{transitCurve.transitDepth.toFixed(3)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Transit Duration</p>
                        <p className="text-cyan-400 font-mono">{transitCurve.transitDuration.toFixed(2)} hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stellar Evolution Tab */}
              {activeTab === 'stellar' && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white mb-2 block">
                      Stellar Mass: {stellarMass.toFixed(2)} M☉
                    </Label>
                    <Slider
                      value={[stellarMass]}
                      onValueChange={(val) => handleStellarUpdate(val[0])}
                      min={0.1}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-3">Stellar Properties</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Spectral Class</p>
                        <p className="text-cyan-400 font-mono text-lg">{stellarProps.spectralClass}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Surface Temperature</p>
                        <p className="text-cyan-400 font-mono">{stellarProps.surfaceTemperature.toLocaleString()} K</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Luminosity</p>
                        <p className="text-cyan-400 font-mono">{stellarProps.luminosity.toFixed(2)} L☉</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Main Sequence Lifetime</p>
                        <p className="text-cyan-400 font-mono">{(stellarProps.mainSequenceLifetime / 1e9).toFixed(2)} Gy</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Save Panel */}
          <div>
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4">Save Experiment</h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Experiment Name</Label>
                  <Input
                    value={experimentName}
                    onChange={(e) => setExperimentName(e.target.value)}
                    placeholder="e.g., LEO Orbit Test"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">Notes</Label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add observations or findings..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-md text-white p-2 text-sm"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSaveExperiment}
                  className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Experiment
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-2"
                  onClick={() => {
                    setExperimentName('');
                    setNotes('');
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
