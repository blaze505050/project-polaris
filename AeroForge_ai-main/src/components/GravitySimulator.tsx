/**
 * GRAVITY SIMULATOR
 * P0 Functional Simulation - N-Body Gravity
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CelestialBody,
  updateBodies,
  validateCelestialBody,
  PHYSICS_CONSTANTS,
  formatDistance,
  formatVelocity,
} from "@/services/physicsEngine";
import { useMyLabStore } from "@/stores/myLabStore";

const PRESETS = {
  earth_sun: [
    {
      id: "sun",
      name: "Sun",
      mass: PHYSICS_CONSTANTS.SOLAR_MASS,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      radius: PHYSICS_CONSTANTS.SOLAR_RADIUS,
    },
    {
      id: "earth",
      name: "Earth",
      mass: PHYSICS_CONSTANTS.EARTH_MASS,
      x: PHYSICS_CONSTANTS.AU,
      y: 0,
      z: 0,
      vx: 0,
      vy: 29780, // m/s
      vz: 0,
      radius: PHYSICS_CONSTANTS.EARTH_RADIUS,
    },
  ],
  three_body: [
    {
      id: "star1",
      name: "Star 1",
      mass: PHYSICS_CONSTANTS.SOLAR_MASS,
      x: -1e11,
      y: 0,
      z: 0,
      vx: 0,
      vy: 10000,
      vz: 0,
      radius: PHYSICS_CONSTANTS.SOLAR_RADIUS,
    },
    {
      id: "star2",
      name: "Star 2",
      mass: PHYSICS_CONSTANTS.SOLAR_MASS,
      x: 1e11,
      y: 0,
      z: 0,
      vx: 0,
      vy: -10000,
      vz: 0,
      radius: PHYSICS_CONSTANTS.SOLAR_RADIUS,
    },
    {
      id: "planet",
      name: "Planet",
      mass: PHYSICS_CONSTANTS.EARTH_MASS,
      x: 0,
      y: 5e10,
      z: 0,
      vx: 15000,
      vy: 0,
      vz: 0,
      radius: PHYSICS_CONSTANTS.EARTH_RADIUS,
    },
  ],
};

interface SimulationState {
  bodies: any[];
  time: number;
  isRunning: boolean;
  error: string | null;
  dt: number; // time step
}

export default function GravitySimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SimulationState>({
    bodies: PRESETS.earth_sun,
    time: 0,
    isRunning: false,
    error: null,
    dt: 3600, // 1 hour
  });

  const [experimentName, setExperimentName] = useState("Gravity Simulation");
  const [preset, setPreset] = useState<"earth_sun" | "three_body">("earth_sun");
  const addExperiment = useMyLabStore((s) => s.addExperiment);

  // Validate bodies on load
  useEffect(() => {
    const errors: string[] = [];
    state.bodies.forEach((body: any) => {
      const validation = validateCelestialBody(body);
      if (!validation.isValid && validation.warning) {
        errors.push(`${body.name}: ${validation.warning}`);
      }
    });

    if (errors.length > 0) {
      setState((s) => ({ ...s, error: errors[0] }));
    }
  }, [state.bodies]);

  // Animation loop
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState((s) => {
        try {
          const updated = updateBodies(s.bodies, s.dt);
          return {
            ...s,
            bodies: updated,
            time: s.time + s.dt,
            error: null,
          };
        } catch (err) {
          return {
            ...s,
            error: err instanceof Error ? err.message : "Simulation error",
            isRunning: false,
          };
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [state.isRunning, state.dt]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw bodies
    const scale = 1e-11; // Scale factor for visualization
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    state.bodies.forEach((body) => {
      const x = centerX + body.x * scale;
      const y = centerY + body.y * scale;

      // Draw body
      const radius = Math.max(3, Math.log(body.mass) / 5);
      ctx.fillStyle = body.id === "sun" ? "#FCD34D" : "#0EA5E9";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = "#E2E8F0";
      ctx.font = "10px monospace";
      ctx.fillText(body.name, x + radius + 5, y - 5);
    });
  }, [state.bodies]);

  const handlePresetChange = (newPreset: "earth_sun" | "three_body") => {
    setPreset(newPreset);
    setState((s) => ({
      ...s,
      bodies: PRESETS[newPreset],
      time: 0,
      isRunning: false,
    }));
  };

  const handleSaveExperiment = () => {
    const id = addExperiment({
      name: experimentName,
      type: "gravity",
      data: {
        preset,
        dt: state.dt,
        initialBodies: state.bodies,
      },
      results: {
        finalBodies: state.bodies,
        time: state.time,
      },
      notes: `N-body gravity simulation with ${state.bodies.length} bodies`,
    });

    alert(`Experiment saved: ${id}`);
  };

  const handleReset = () => {
    setState((s) => ({
      ...s,
      bodies: PRESETS[preset],
      time: 0,
      isRunning: false,
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Gravity Simulator</h1>
        <p className="text-secondary-foreground">N-body gravitational dynamics with real physics</p>
      </div>

      {state.error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full border border-secondary rounded bg-primary"
            />
            <p className="text-xs text-secondary-foreground mt-2">
              Visualization of gravitational interactions (not to scale)
            </p>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-heading font-semibold">Presets</h3>
            <Button
              onClick={() => handlePresetChange("earth_sun")}
              variant={preset === "earth_sun" ? "default" : "outline"}
              className="w-full"
            >
              Earth-Sun
            </Button>
            <Button
              onClick={() => handlePresetChange("three_body")}
              variant={preset === "three_body" ? "default" : "outline"}
              className="w-full"
            >
              Three Body
            </Button>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-heading font-semibold">Simulation</h3>
            <div className="space-y-2">
              <Label className="text-sm">Time Step (seconds)</Label>
              <Input
                type="number"
                value={state.dt}
                onChange={(e) => setState((s) => ({ ...s, dt: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <p className="text-xs text-secondary-foreground">
              Time: {(state.time / PHYSICS_CONSTANTS.SECONDS_PER_DAY).toFixed(1)} days
            </p>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-heading font-semibold">Bodies</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {state.bodies.map((body) => (
                <div key={body.id} className="p-2 bg-primary rounded text-xs">
                  <p className="font-semibold text-accent">{body.name}</p>
                  <p className="text-secondary-foreground">
                    {formatDistance(Math.sqrt(body.x ** 2 + body.y ** 2 + body.z ** 2))}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
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
    </div>
  );
}
