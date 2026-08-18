/**
 * Interactive Physics Engine - Professional Grade
 * Real-time physics manipulation with advanced controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Zap, Eye, Settings } from 'lucide-react';

interface PhysicsState {
  mass: number;
  velocity: number;
  acceleration: number;
  force: number;
  energy: number;
  temperature: number;
  pressure: number;
  density: number;
}

interface ParticleSystem {
  particles: Particle[];
  time: number;
  isRunning: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}

const InteractivePhysicsEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    mass: 1.0,
    velocity: 5.0,
    acceleration: 0.5,
    force: 5.0,
    energy: 12.5,
    temperature: 300,
    pressure: 101.325,
    density: 1.225,
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();

  // Initialize particle system
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * physicsState.velocity,
      vy: (Math.random() - 0.5) * physicsState.velocity,
      mass: physicsState.mass,
      radius: 4,
      color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
    }));
    setParticles(initialParticles);
  }, []);

  // Physics simulation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simulate = () => {
      if (!isRunning) {
        animationRef.current = requestAnimationFrame(simulate);
        return;
      }

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update particles
      const updatedParticles = particles.map((p) => {
        let particle = { ...p };

        // Apply forces
        particle.vy += physicsState.acceleration * 0.01;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary conditions
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas.width) {
          particle.vx *= -0.95;
          particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas.height) {
          particle.vy *= -0.95;
          particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));
        }

        return particle;
      });

      // Particle-particle collisions
      for (let i = 0; i < updatedParticles.length; i++) {
        for (let j = i + 1; j < updatedParticles.length; j++) {
          const dx = updatedParticles[j].x - updatedParticles[i].x;
          const dy = updatedParticles[j].y - updatedParticles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = updatedParticles[i].radius + updatedParticles[j].radius;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Swap velocities
            const vx1 = updatedParticles[i].vx * cos + updatedParticles[i].vy * sin;
            const vy1 = updatedParticles[i].vy * cos - updatedParticles[i].vx * sin;
            const vx2 = updatedParticles[j].vx * cos + updatedParticles[j].vy * sin;
            const vy2 = updatedParticles[j].vy * cos - updatedParticles[j].vx * sin;

            updatedParticles[i].vx = vx2 * cos - vy1 * sin;
            updatedParticles[i].vy = vy1 * cos + vx2 * sin;
            updatedParticles[j].vx = vx1 * cos - vy2 * sin;
            updatedParticles[j].vy = vy2 * cos + vx1 * sin;

            // Separate particles
            const overlap = (minDist - dist) / 2;
            updatedParticles[i].x -= overlap * cos;
            updatedParticles[i].y -= overlap * sin;
            updatedParticles[j].x += overlap * cos;
            updatedParticles[j].y += overlap * sin;
          }
        }
      }

      setParticles(updatedParticles);

      // Draw particles
      updatedParticles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw velocity vector
        ctx.strokeStyle = `${p.color}80`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 5, p.y + p.vy * 5);
        ctx.stroke();
      });

      // Draw grid
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.lineWidth = 0.5;
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

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, particles, physicsState]);

  const handleReset = () => {
    setIsRunning(false);
    const initialParticles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * physicsState.velocity,
      vy: (Math.random() - 0.5) * physicsState.velocity,
      mass: physicsState.mass,
      radius: 4,
      color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
    }));
    setParticles(initialParticles);
  };

  const calculateEnergy = () => {
    const ke = 0.5 * physicsState.mass * physicsState.velocity ** 2;
    const pe = physicsState.mass * 9.81 * 100;
    return (ke + pe).toFixed(2);
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
        <div className="space-y-6">
          {/* Canvas */}
          <div className="relative rounded-lg overflow-hidden border border-aerospace-blue/20 bg-aerospace-dark">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-auto"
            />
            <div className="absolute top-4 right-4 bg-aerospace-dark/80 backdrop-blur px-3 py-2 rounded border border-aerospace-blue/30 text-xs font-mono text-aerospace-blue">
              {particles.length} particles | Energy: {calculateEnergy()} J
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Playback Controls */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant="outline"
                className="flex-1 border-aerospace-blue/30 hover:bg-aerospace-blue/10"
              >
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-aerospace-blue/30 hover:bg-aerospace-blue/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-aerospace-dark/50 p-2 rounded border border-aerospace-blue/20">
                <div className="text-secondary-foreground">Mass</div>
                <div className="text-aerospace-blue font-mono">{physicsState.mass.toFixed(2)} kg</div>
              </div>
              <div className="bg-aerospace-dark/50 p-2 rounded border border-aerospace-blue/20">
                <div className="text-secondary-foreground">Velocity</div>
                <div className="text-aerospace-blue font-mono">{physicsState.velocity.toFixed(2)} m/s</div>
              </div>
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-secondary-foreground flex justify-between mb-2">
                <span>Mass</span>
                <span className="text-aerospace-blue font-mono">{physicsState.mass.toFixed(2)} kg</span>
              </label>
              <Slider
                value={[physicsState.mass]}
                onValueChange={(val) => setPhysicsState({ ...physicsState, mass: val[0] })}
                min={0.1}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-secondary-foreground flex justify-between mb-2">
                <span>Velocity</span>
                <span className="text-aerospace-blue font-mono">{physicsState.velocity.toFixed(2)} m/s</span>
              </label>
              <Slider
                value={[physicsState.velocity]}
                onValueChange={(val) => setPhysicsState({ ...physicsState, velocity: val[0] })}
                min={0}
                max={20}
                step={0.5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-secondary-foreground flex justify-between mb-2">
                <span>Acceleration</span>
                <span className="text-aerospace-blue font-mono">{physicsState.acceleration.toFixed(2)} m/s²</span>
              </label>
              <Slider
                value={[physicsState.acceleration]}
                onValueChange={(val) => setPhysicsState({ ...physicsState, acceleration: val[0] })}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InteractivePhysicsEngine;
