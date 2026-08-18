/**
 * ORBITAL MECHANICS SIMULATOR
 * P0 Functional Simulation - Kepler Orbit Calculator
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  OrbitalElements,
  CartesianPosition,
  calculateOrbitalPeriod,
  orbitalToCartesian,
  validateOrbitalElements,
  formatDistance,
  PHYSICS_CONSTANTS,
} from '@/services/physicsEngine';
import { useMyLabStore } from '@/stores/myLabStore';

interface SimulationState {
  elements: OrbitalElements;
  position: CartesianPosition;
  time: number;
  isRunning: boolean;
  error: string | null;
}

export default function OrbitalMechanicsSimulator() {
  const [state, setState] = useState<SimulationState>({
    elements: {
      a: 1, // 1 AU
      e: 0.2,
      i: 0,
      Omega: 0,
      omega: 0,
      M: 0,
    },
    position: { x: 0, y: 0, z: 0 },
    time: 0,
    isRunning: false,
    error: null,
  });

  const [experimentName, setExperimentName] = useState('Orbital Mechanics Experiment');
  const addExperiment = useMyLabStore((s) => s.addExperiment);

  // Calculate orbital period
  const period = calculateOrbitalPeriod(state.elements.a);

  // Update position when elements change
  useEffect(() => {
    try {
      const validation = validateOrbitalElements(state.elements);
      if (!validation.valid) {
        setState((s) => ({ ...s, error: validation.errors[0] }));
        return;
      }

      const position = orbitalToCartesian(state.elements);
      setState((s) => ({ ...s, position, error: null }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Calculation error',
      }));
    }
  }, [state.elements]);

  // Animation loop
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState((s) => {
        const newTime = s.time + 0.1;
        const newM = (newTime / period) * 360;

        return {
          ...s,
          time: newTime,
          elements: {
            ...s.elements,
            M: newM % 360,
          },
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [state.isRunning, period]);

  const handleElementChange = (key: keyof OrbitalElements, value: number) => {
    setState((s) => ({
      ...s,
      elements: {
        ...s.elements,
        [key]: value,
      },
    }));
  };

  const handleSaveExperiment = () => {
    const id = addExperiment({
      name: experimentName,
      type: 'orbital',
      data: {
        elements: state.elements,
        period,
      },
      results: {
        position: state.position,
        time: state.time,
      },
      notes: `Orbital simulation with a=${state.elements.a} AU, e=${state.elements.e}`,
    });

    alert(`Experiment saved: ${id}`);
  };

  const handleReset = () => {
    setState((s) => ({
      ...s,
      time: 0,
      elements: {
        ...s.elements,
        M: 0,
      },
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Orbital Mechanics Simulator</h1>
        <p className="text-secondary-foreground">
          Calculate and visualize Keplerian orbits using real physics
        </p>
      </div>

      {state.error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-heading font-semibold">Orbital Elements</h2>

          <div className="space-y-3">
            <div>
              <Label className="text-sm">
                Semi-Major Axis (a): {state.elements.a.toFixed(3)} AU
              </Label>
              <Input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={state.elements.a}
                onChange={(e) => handleElementChange('a', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Eccentricity (e): {state.elements.e.toFixed(3)}
              </Label>
              <Input
                type="range"
                min="0"
                max="0.99"
                step="0.01"
                value={state.elements.e}
                onChange={(e) => handleElementChange('e', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Inclination (i): {state.elements.i.toFixed(1)}°
              </Label>
              <Input
                type="range"
                min="0"
                max="180"
                step="1"
                value={state.elements.i}
                onChange={(e) => handleElementChange('i', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Longitude of Ascending Node (Ω): {state.elements.Omega.toFixed(1)}°
              </Label>
              <Input
                type="range"
                min="0"
                max="360"
                step="1"
                value={state.elements.Omega}
                onChange={(e) => handleElementChange('Omega', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Argument of Periapsis (ω): {state.elements.omega.toFixed(1)}°
              </Label>
              <Input
                type="range"
                min="0"
                max="360"
                step="1"
                value={state.elements.omega}
                onChange={(e) => handleElementChange('omega', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm">
                Mean Anomaly (M): {state.elements.M.toFixed(1)}°
              </Label>
              <Input
                type="range"
                min="0"
                max="360"
                step="1"
                value={state.elements.M}
                onChange={(e) => handleElementChange('M', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-secondary space-y-2">
            <p className="text-sm font-semibold">
              Orbital Period: {period.toFixed(2)} days
            </p>
            <p className="text-xs text-secondary-foreground">
              Calculated using Kepler's 3rd Law: P² = a³
            </p>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-heading font-semibold">Position & Velocity</h2>

          <div className="space-y-3 font-mono text-sm">
            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">X Position</p>
              <p className="text-accent-foreground font-semibold">
                {formatDistance(state.position.x * PHYSICS_CONSTANTS.AU)}
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Y Position</p>
              <p className="text-accent-foreground font-semibold">
                {formatDistance(state.position.y * PHYSICS_CONSTANTS.AU)}
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Z Position</p>
              <p className="text-accent-foreground font-semibold">
                {formatDistance(state.position.z * PHYSICS_CONSTANTS.AU)}
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Simulation Time</p>
              <p className="text-accent-foreground font-semibold">
                {state.time.toFixed(2)} days
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-secondary">
            <p className="text-xs text-secondary-foreground mb-3">
              Cartesian coordinates in AU (Astronomical Units)
            </p>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setState((s) => ({ ...s, isRunning: !s.isRunning }))}
            className="gap-2"
          >
            {state.isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play
              </>
            )}
          </Button>

          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>

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
        <p className="font-semibold mb-2">How to use:</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>Adjust orbital elements using the sliders</li>
          <li>Press Play to animate the orbit over time</li>
          <li>Save experiments to My Lab for later review</li>
          <li>All calculations use real physics constants</li>
        </ul>
      </motion.div>
    </div>
  );
}
