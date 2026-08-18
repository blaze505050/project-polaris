/**
 * STELLAR EVOLUTION SIMULATOR
 * P0 Functional Simulation - HR Diagram & Stellar Properties
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  getHRDiagramPosition,
  calculateStellarLuminosity,
  calculateStellarRadius,
  calculateStellarTemperature,
  StellarProperties,
} from '@/services/physicsEngine';
import { useMyLabStore } from '@/stores/myLabStore';

interface SimulationState {
  mass: number; // solar masses
  error: string | null;
}

// HR Diagram reference stars
const HR_REFERENCE_STARS = [
  { name: 'Sirius A', mass: 2.02, temp: 9940, lum: 26 },
  { name: 'Sun', mass: 1, temp: 5778, lum: 1 },
  { name: 'Proxima Centauri', mass: 0.12, temp: 3042, lum: 0.0017 },
  { name: 'Betelgeuse', mass: 16.5, temp: 3500, lum: 140000 },
  { name: 'Rigel', mass: 17, temp: 11000, lum: 120000 },
];

export default function StellarEvolutionSimulator() {
  const [state, setState] = useState<SimulationState>({
    mass: 1,
    error: null,
  });

  const [experimentName, setExperimentName] = useState('Stellar Evolution Study');
  const addExperiment = useMyLabStore((s) => s.addExperiment);

  // Calculate stellar properties
  const stellar = getHRDiagramPosition(state.mass);

  // Generate HR diagram data
  const masses = Array.from({ length: 50 }, (_, i) => 0.1 + (i / 49) * 19.9);
  const hrData = masses.map((m) => {
    const props = getHRDiagramPosition(m);
    return {
      temp: props.temperature,
      lum: props.luminosity,
      mass: m,
      name: m.toFixed(1),
    };
  });

  const handleMassChange = (value: number) => {
    setState((s) => {
      const errors: string[] = [];
      if (value <= 0) errors.push('Mass must be positive');
      if (value > 100) errors.push('Mass exceeds simulation limits');

      return {
        ...s,
        mass: value,
        error: errors.length > 0 ? errors[0] : null,
      };
    });
  };

  const handleSaveExperiment = () => {
    const id = addExperiment({
      name: experimentName,
      type: 'stellar',
      data: {
        mass: state.mass,
      },
      results: {
        stellar,
      },
      notes: `Stellar properties for ${state.mass.toFixed(2)} M☉ star`,
    });

    alert(`Experiment saved: ${id}`);
  };

  // Find current star on chart
  const currentPoint = {
    temp: stellar.temperature,
    lum: stellar.luminosity,
    mass: state.mass,
    name: `${state.mass.toFixed(2)} M☉`,
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Stellar Evolution Simulator</h1>
        <p className="text-secondary-foreground">
          Explore the Hertzsprung-Russell diagram and stellar properties
        </p>
      </div>

      {state.error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HR Diagram */}
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-heading font-semibold">Hertzsprung-Russell Diagram</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="temp"
                  type="number"
                  scale="log"
                  domain={[2000, 50000]}
                  label={{ value: 'Temperature (K)', position: 'insideBottomRight', offset: -10 }}
                  tick={{ fontSize: 10 }}
                  reversed
                />
                <YAxis
                  dataKey="lum"
                  type="number"
                  scale="log"
                  domain={[0.001, 1000000]}
                  label={{ value: 'Luminosity (L☉)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #0EA5E9' }}
                  formatter={(value) => (typeof value === 'number' ? value.toFixed(0) : value)}
                  labelFormatter={(label) => `Temp: ${label}K`}
                />
                {/* Main sequence */}
                <Scatter name="Main Sequence" data={hrData} fill="#0EA5E9" fillOpacity={0.3} />
                {/* Reference stars */}
                <Scatter
                  name="Reference Stars"
                  data={HR_REFERENCE_STARS}
                  fill="#FCD34D"
                  fillOpacity={0.8}
                />
                {/* Current star */}
                <Scatter name="Current Star" data={[currentPoint]} fill="#10B981" fillOpacity={1} />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-secondary-foreground">
              Blue: Main sequence | Yellow: Reference stars | Green: Your star
            </p>
          </Card>
        </div>

        {/* Properties */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-heading font-semibold">Stellar Properties</h2>

          <div className="space-y-3">
            <div>
              <Label className="text-sm">
                Mass: {state.mass.toFixed(2)} M☉
              </Label>
              <Input
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                value={state.mass}
                onChange={(e) => handleMassChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-secondary-foreground mt-1">Solar masses</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-secondary">
            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Radius</p>
              <p className="text-accent-foreground font-semibold">
                {stellar.radius.toFixed(2)} R☉
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Temperature</p>
              <p className="text-accent-foreground font-semibold">
                {stellar.temperature.toFixed(0)} K
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Luminosity</p>
              <p className="text-accent-foreground font-semibold">
                {stellar.luminosity.toFixed(2)} L☉
              </p>
            </div>

            <div className="p-3 bg-primary rounded">
              <p className="text-secondary-foreground text-xs mb-1">Spectral Type</p>
              <p className="text-accent-foreground font-semibold">
                {getSpectralType(stellar.temperature)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-heading font-semibold">Comparison with Known Stars</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary">
                <th className="text-left py-2 px-2">Star</th>
                <th className="text-right py-2 px-2">Mass (M☉)</th>
                <th className="text-right py-2 px-2">Radius (R☉)</th>
                <th className="text-right py-2 px-2">Temp (K)</th>
                <th className="text-right py-2 px-2">Luminosity (L☉)</th>
              </tr>
            </thead>
            <tbody>
              {HR_REFERENCE_STARS.map((star) => (
                <tr key={star.name} className="border-b border-primary hover:bg-primary/50">
                  <td className="py-2 px-2">{star.name}</td>
                  <td className="text-right py-2 px-2">{star.mass.toFixed(2)}</td>
                  <td className="text-right py-2 px-2">-</td>
                  <td className="text-right py-2 px-2">{star.temp}</td>
                  <td className="text-right py-2 px-2">{star.lum}</td>
                </tr>
              ))}
              <tr className="border-b border-secondary bg-primary/30 font-semibold">
                <td className="py-2 px-2">Your Star</td>
                <td className="text-right py-2 px-2">{state.mass.toFixed(2)}</td>
                <td className="text-right py-2 px-2">{stellar.radius.toFixed(2)}</td>
                <td className="text-right py-2 px-2">{stellar.temperature.toFixed(0)}</td>
                <td className="text-right py-2 px-2">{stellar.luminosity.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

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
            placeholder="Name this study..."
            className="w-full"
          />
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary border border-secondary rounded-lg text-sm text-secondary-foreground"
      >
        <p className="font-semibold mb-2">About the HR Diagram:</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>X-axis: Temperature (hotter stars on left)</li>
          <li>Y-axis: Luminosity (brighter stars on top)</li>
          <li>Main sequence: Most stars follow this diagonal band</li>
          <li>More massive stars are hotter and brighter</li>
        </ul>
      </motion.div>
    </div>
  );
}

function getSpectralType(temp: number): string {
  if (temp > 30000) return 'O';
  if (temp > 10000) return 'B';
  if (temp > 7500) return 'A';
  if (temp > 6000) return 'F';
  if (temp > 5200) return 'G';
  if (temp > 3700) return 'K';
  return 'M';
}
