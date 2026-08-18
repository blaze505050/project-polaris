/**
 * TRANSIT SIMULATOR
 * P0 Functional Simulation - Exoplanet Transit Detection
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  calculateTransitDepth,
  calculateTransitDuration,
  simulateTransitLightCurve,
  PHYSICS_CONSTANTS,
} from '@/services/physicsEngine';
import { useMyLabStore } from '@/stores/myLabStore';

interface SimulationState {
  planetRadius: number; // Earth radii
  starRadius: number; // Solar radii
  orbitalPeriod: number; // days
  inclination: number; // degrees
  planetOrbit: number; // AU
  isRunning: boolean;
  error: string | null;
}

export default function TransitSimulator() {
  const [state, setState] = useState<SimulationState>({
    planetRadius: 1, // Earth-like
    starRadius: 1, // Sun-like
    orbitalPeriod: 365.25,
    inclination: 90,
    planetOrbit: 1,
    isRunning: false,
    error: null,
  });

  const [experimentName, setExperimentName] = useState('Transit Detection Experiment');
  const addExperiment = useMyLabStore((s) => s.addExperiment);

  // Calculate transit properties
  const transitDepth = calculateTransitDepth(state.planetRadius, state.starRadius);
  const transitDuration = calculateTransitDuration(
    state.orbitalPeriod,
    state.starRadius,
    state.planetOrbit,
    state.inclination
  );

  // Generate light curve data
  const timePoints = Array.from({ length: 100 }, (_, i) => (i - 50) / 50 * transitDuration * 1.5);
  const lightCurve = simulateTransitLightCurve(transitDepth, transitDuration, timePoints);

  const chartData = timePoints.map((time, i) => ({
    time: time.toFixed(1),
    flux: (lightCurve[i] * 100).toFixed(2),
  }));

  const handleParameterChange = (key: keyof SimulationState, value: number) => {
    setState((s) => ({
      ...s,
      [key]: value,
    }));
  };

  const handleSaveExperiment = () => {
    const id = addExperiment({
      name: experimentName,
      type: 'transit',
      data: {
        planetRadius: state.planetRadius,
        starRadius: state.starRadius,
        orbitalPeriod: state.orbitalPeriod,
        inclination: state.inclination,
        planetOrbit: state.planetOrbit,
      },
      results: {
        transitDepth,
        transitDuration,
        lightCurve: chartData,
      },
      notes: `Transit simulation: ${state.planetRadius.toFixed(2)} R⊕ planet around ${state.starRadius.toFixed(2)} R☉ star`,
    });

    alert(`Experiment saved: ${id}`);
  };

  // Validation
  useEffect(() => {
    const errors: string[] = [];
    if (state.planetRadius <= 0) errors.push('Planet radius must be positive');
    if (state.starRadius <= 0) errors.push('Star radius must be positive');
    if (state.orbitalPeriod <= 0) errors.push('Orbital period must be positive');
    if (state.inclination < 0 || state.inclination > 180) errors.push('Inclination must be 0-180°');
    if (state.planetOrbit <= 0) errors.push('Orbital distance must be positive');

    setState((s) => ({
      ...s,
      error: errors.length > 0 ? errors[0] : null,
    }));
  }, [state.planetRadius, state.starRadius, state.orbitalPeriod, state.inclination, state.planetOrbit]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Transit Simulator</h1>
        <p className="text-secondary-foreground">
          Simulate exoplanet transits and generate synthetic light curves
        </p>
      </div>

      {state.error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-heading font-semibold">System Parameters</h2>

          <div className="space-y-3">
            <div>
              <Label className="text-sm">
                Planet Radius: {state.planetRadius.toFixed(2)} R⊕
              </Label>
              <Input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={state.planetRadius}
                onChange={(e) => handleParameterChange('planetRadius', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-secondary-foreground mt-1">Earth radii</p>
            </div>

            <div>
              <Label className="text-sm">
                Star Radius: {state.starRadius.toFixed(2)} R☉
              </Label>
              <Input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={state.starRadius}
                onChange={(e) => handleParameterChange('starRadius', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-secondary-foreground mt-1">Solar radii</p>
            </div>

            <div>
              <Label className="text-sm">
                Orbital Period: {state.orbitalPeriod.toFixed(1)} days
              </Label>
              <Input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={state.orbitalPeriod}
                onChange={(e) => handleParameterChange('orbitalPeriod', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Orbital Distance: {state.planetOrbit.toFixed(2)} AU
              </Label>
              <Input
                type="range"
                min="0.01"
                max="5"
                step="0.01"
                value={state.planetOrbit}
                onChange={(e) => handleParameterChange('planetOrbit', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Inclination: {state.inclination.toFixed(1)}°
              </Label>
              <Input
                type="range"
                min="0"
                max="180"
                step="1"
                value={state.inclination}
                onChange={(e) => handleParameterChange('inclination', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-secondary-foreground mt-1">90° = edge-on (transits visible)</p>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-heading font-semibold">Transit Properties</h2>

          <div className="space-y-3">
            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Transit Depth</p>
              <p className="text-accent-foreground font-semibold text-lg">
                {(transitDepth * 100).toFixed(3)}%
              </p>
              <p className="text-xs text-secondary-foreground mt-1">
                (Rp/Rs)² - fractional flux loss
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Transit Duration</p>
              <p className="text-accent-foreground font-semibold text-lg">
                {transitDuration.toFixed(2)} hours
              </p>
              <p className="text-xs text-secondary-foreground mt-1">
                Time from first to last contact
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Detectability</p>
              <p className="text-accent-foreground font-semibold text-lg">
                {transitDepth > 0.001 ? '✓ Detectable' : '✗ Too shallow'}
              </p>
              <p className="text-xs text-secondary-foreground mt-1">
                Typical threshold: 0.1%
              </p>
            </div>
          </div>
        </Card>

        {/* Light Curve Preview */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-heading font-semibold">Light Curve</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={[99.5, 100.5]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #0EA5E9' }}
                formatter={(value) => `${value}%`}
              />
              <Line
                type="monotone"
                dataKey="flux"
                stroke="#0EA5E9"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-secondary-foreground">Normalized flux vs time</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleSaveExperiment} variant="outline" className="gap-2">
            <Save className="w-4 h-4" /> Save to My Lab
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exp-name" className="text-sm">
            Experiment Name
          </Label>
          <Input
            id="exp-name"
            value={experimentName}
            onChange={(e) => setExperimentName(e.target.value)}
            placeholder="Name this experiment..."
            className="w-full"
          />
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary border border-secondary rounded-lg text-sm text-secondary-foreground"
      >
        <p className="font-semibold mb-2">About Transit Detection:</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>Transits occur when a planet passes in front of its star</li>
          <li>Deeper transits = larger planets or smaller stars</li>
          <li>Longer durations = larger orbits or larger planets</li>
          <li>Edge-on orbits (90° inclination) show the deepest transits</li>
        </ul>
      </motion.div>
    </div>
  );
}
