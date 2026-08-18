import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, Settings, Zap } from 'lucide-react';

interface PhysicsVisualizerProps {
  title: string;
  description: string;
  data: {
    velocityField?: number[][];
    pressureField?: number[][];
    temperatureField?: number[][];
    streamlines?: Array<{ x: number; y: number }[]>;
    convergenceHistory?: number[];
  };
  config?: {
    reynoldsNumber?: number;
    machNumber?: number;
    angleOfAttack?: number;
    turbulenceModel?: string;
  };
  onExport?: () => void;
}

export default function AdvancedPhysicsVisualizer({
  title,
  description,
  data,
  config,
  onExport,
}: PhysicsVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const animationRef = useRef<number>();

  // Normalize data to 0-1 range for color mapping
  const normalizeValue = (value: number, min: number, max: number): number => {
    if (max === min) return 0.5;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  };

  // Get color from value using physics-appropriate colormap
  const getPhysicsColor = (value: number): string => {
    // Blue -> Cyan -> Green -> Yellow -> Red colormap (common in CFD)
    const hue = (1 - value) * 240; // 240 (blue) to 0 (red)
    const saturation = 100;
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Draw velocity field with streamlines
  const drawVelocityField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!data.velocityField) return;

    const field = data.velocityField;
    const cellWidth = canvas.width / field[0].length;
    const cellHeight = canvas.height / field.length;

    // Find min/max for normalization
    let minVel = Infinity;
    let maxVel = -Infinity;
    for (const row of field) {
      for (const val of row) {
        minVel = Math.min(minVel, val);
        maxVel = Math.max(maxVel, val);
      }
    }

    // Draw velocity magnitude as color field
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        const normalized = normalizeValue(field[i][j], minVel, maxVel);
        ctx.fillStyle = getPhysicsColor(normalized);
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }

    // Draw streamlines if available
    if (data.streamlines) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      for (const streamline of data.streamlines) {
        ctx.beginPath();
        for (let i = 0; i < streamline.length; i++) {
          const x = (streamline[i].x / 10) * canvas.width;
          const y = (streamline[i].y / 10) * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };

  // Draw pressure field
  const drawPressureField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!data.pressureField) return;

    const field = data.pressureField;
    const cellWidth = canvas.width / field[0].length;
    const cellHeight = canvas.height / field.length;

    let minPres = Infinity;
    let maxPres = -Infinity;
    for (const row of field) {
      for (const val of row) {
        minPres = Math.min(minPres, val);
        maxPres = Math.max(maxPres, val);
      }
    }

    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        const normalized = normalizeValue(field[i][j], minPres, maxPres);
        ctx.fillStyle = getPhysicsColor(normalized);
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }
  };

  // Draw convergence history
  const drawConvergence = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!data.convergenceHistory || data.convergenceHistory.length === 0) return;

    const history = data.convergenceHistory;
    const padding = 40;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;

    // Draw background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(padding, padding, graphWidth, graphHeight);

    // Draw grid
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + graphWidth, y);
      ctx.stroke();
    }

    // Find min/max for scaling
    const minVal = Math.min(...history);
    const maxVal = Math.max(...history);
    const range = maxVal - minVal || 1;

    // Draw convergence curve
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < history.length; i++) {
      const x = padding + (i / (history.length - 1 || 1)) * graphWidth;
      const normalized = (history[i] - minVal) / range;
      const y = padding + graphHeight - normalized * graphHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw axes labels
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '12px roboto';
    ctx.fillText('Iterations', padding + graphWidth / 2 - 30, canvas.height - 10);
    ctx.save();
    ctx.translate(10, padding + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Residual', 0, 0);
    ctx.restore();
  };

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw appropriate visualization
      if (data.velocityField) {
        drawVelocityField(ctx, canvas);
      } else if (data.pressureField) {
        drawPressureField(ctx, canvas);
      } else if (data.convergenceHistory) {
        drawConvergence(ctx, canvas);
      }

      if (isPlaying) {
        setAnimationFrame((prev) => (prev + 1) % 100);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-aerospace-dark to-primary rounded-lg border border-aerospace-blue/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-aerospace-blue/10 to-aerospace-accent/10 border-b border-aerospace-blue/20 p-6">
        <h3 className="text-xl font-heading font-bold text-foreground mb-2">{title}</h3>
        <p className="text-secondary-foreground text-sm">{description}</p>
        {config && (
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            {config.reynoldsNumber && (
              <span className="text-aerospace-blue">Re = {config.reynoldsNumber.toLocaleString()}</span>
            )}
            {config.machNumber && (
              <span className="text-aerospace-accent">M = {config.machNumber.toFixed(2)}</span>
            )}
            {config.angleOfAttack && (
              <span className="text-aerospace-success">α = {config.angleOfAttack}°</span>
            )}
            {config.turbulenceModel && (
              <span className="text-aerospace-warning">{config.turbulenceModel}</span>
            )}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative bg-aerospace-dark aspect-video">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full"
        />
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-aerospace-dark/20 to-transparent" />
      </div>

      {/* Controls */}
      <div className="bg-primary border-t border-aerospace-blue/20 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => setAnimationFrame(0)}
            className="p-2 rounded-lg bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 rounded-lg bg-aerospace-success/20 hover:bg-aerospace-success/30 text-aerospace-success transition-colors"
              title="Export"
            >
              <Download size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-primary/50 border-t border-aerospace-blue/20 p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-secondary-foreground text-xs">Animation Frame</label>
              <div className="text-aerospace-blue font-mono">{animationFrame}</div>
            </div>
            {config?.reynoldsNumber && (
              <div>
                <label className="text-secondary-foreground text-xs">Reynolds Number</label>
                <div className="text-aerospace-blue font-mono">{config.reynoldsNumber}</div>
              </div>
            )}
            {config?.machNumber && (
              <div>
                <label className="text-secondary-foreground text-xs">Mach Number</label>
                <div className="text-aerospace-blue font-mono">{config.machNumber.toFixed(3)}</div>
              </div>
            )}
            {data.convergenceHistory && (
              <div>
                <label className="text-secondary-foreground text-xs">Convergence</label>
                <div className="text-aerospace-success font-mono">
                  {Math.min(100, (data.convergenceHistory.length / 100) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
