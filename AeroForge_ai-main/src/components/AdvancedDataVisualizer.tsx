/**
 * Advanced Data Visualizer - Premium Graphics Engine
 * High-performance WebGL-based visualizations with glassmorphism UI
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface VisualizerConfig {
  width: number;
  height: number;
  dataPoints: number;
  updateRate: number;
}

export const AdvancedDataVisualizer: React.FC<{
  config: VisualizerConfig;
  title: string;
  type: 'waveform' | 'spectrum' | 'orbital' | 'heatmap';
}> = ({ config, title, type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !isAnimating) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.016; // ~60fps

      // Clear with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0B0E14');
      gradient.addColorStop(1, '#131924');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw based on type
      switch (type) {
        case 'waveform':
          drawWaveform(ctx, canvas, time);
          break;
        case 'spectrum':
          drawSpectrum(ctx, canvas, time);
          break;
        case 'orbital':
          drawOrbital(ctx, canvas, time);
          break;
        case 'heatmap':
          drawHeatmap(ctx, canvas, time);
          break;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isAnimating, type]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-xl p-6 hover:border-[#00F0FF]/40 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#00F0FF] font-mono">{title}</h3>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-3 py-1 text-xs font-mono bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded hover:bg-[#00F0FF]/20 transition-all"
        >
          {isAnimating ? 'Pause' : 'Play'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={config.width}
        height={config.height}
        className="w-full rounded-lg bg-[#0B0E14] border border-[#00F0FF]/10"
      />
    </motion.div>
  );
};

// Waveform visualization
function drawWaveform(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) {
  const centerY = canvas.height / 2;
  const amplitude = canvas.height * 0.3;
  const frequency = 2;

  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let x = 0; x < canvas.width; x++) {
    const y =
      centerY +
      amplitude *
        Math.sin((x / canvas.width) * Math.PI * frequency + time) *
        Math.exp(-((x - canvas.width / 2) ** 2) / (canvas.width ** 2 / 8));

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Draw glow
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw grid
  ctx.strokeStyle = '#00F0FF33';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = (canvas.height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Spectrum visualization
function drawSpectrum(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) {
  const barCount = 64;
  const barWidth = canvas.width / barCount;

  for (let i = 0; i < barCount; i++) {
    const frequency = i / barCount;
    const height =
      (canvas.height * 0.8 * (Math.sin(frequency * 10 + time) + 1)) / 2 +
      Math.random() * canvas.height * 0.1;

    const hue = (frequency * 120).toString();
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

    ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);

    // Glow effect
    ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
    ctx.shadowBlur = 10;
    ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
    ctx.shadowBlur = 0;
  }
}

// Orbital visualization
function drawOrbital(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw orbital rings
  ctx.strokeStyle = '#00F0FF33';
  ctx.lineWidth = 1;
  for (let r = 1; r <= 5; r++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (canvas.width / 12) * r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw central body
  ctx.fillStyle = '#1a3a52';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Draw orbiting satellites
  const satellites = 5;
  for (let i = 0; i < satellites; i++) {
    const angle = (time * 0.5 + (i / satellites) * Math.PI * 2) % (Math.PI * 2);
    const radius = (canvas.width / 12) * (2 + i);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    // Satellite trail
    ctx.strokeStyle = `hsl(${(i / satellites) * 360}, 100%, 50%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, angle - 0.5, angle);
    ctx.stroke();

    // Satellite
    ctx.fillStyle = `hsl(${(i / satellites) * 360}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    ctx.shadowColor = `hsl(${(i / satellites) * 360}, 100%, 50%)`;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

// Heatmap visualization
function drawHeatmap(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) {
  const cellSize = 20;
  const cols = Math.ceil(canvas.width / cellSize);
  const rows = Math.ceil(canvas.height / cellSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize;
      const y = row * cellSize;

      // Generate heat value based on position and time
      const value =
        (Math.sin((col / cols) * Math.PI * 2 + time) +
          Math.sin((row / rows) * Math.PI * 2 + time) +
          2) /
        4;

      const hue = (value * 120).toString(); // Green to red
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
    }
  }

  // Draw grid overlay
  ctx.strokeStyle = '#00F0FF33';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }
}

// Real-time data stream component
export const RealTimeDataStream: React.FC<{
  title: string;
  data: Array<{ label: string; value: number; unit: string }>;
  updateInterval?: number;
}> = ({ title, data, updateInterval = 1000 }) => {
  const [displayData, setDisplayData] = useState(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayData(prev =>
        prev.map(item => ({
          ...item,
          value: item.value + (Math.random() - 0.5) * item.value * 0.1,
        }))
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#00F0FF]/20 rounded-lg p-6"
    >
      <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">{title}</h3>
      <div className="space-y-3">
        {displayData.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-3 bg-[#0B0E14]/40 rounded border border-[#00F0FF]/10 hover:border-[#00F0FF]/30 transition-all"
          >
            <span className="text-sm text-secondary-foreground font-mono">{item.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#00F0FF] font-mono">{item.value.toFixed(2)}</span>
              <span className="text-xs text-secondary-foreground">{item.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Performance metrics display
export const PerformanceMetrics: React.FC<{
  metrics: Array<{ label: string; value: number; max: number; unit: string }>;
}> = ({ metrics }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#131924]/60 to-[#1a1f2e]/40 backdrop-blur-xl border border-[#FF007A]/20 rounded-lg p-6"
    >
      <h3 className="text-lg font-bold text-[#FF007A] font-mono mb-4">Performance Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const percentage = (metric.value / metric.max) * 100;
          const color =
            percentage < 50 ? '#10B981' : percentage < 80 ? '#F59E0B' : '#EF4444';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary-foreground font-mono">{metric.label}</span>
                <span className="text-sm font-bold font-mono" style={{ color }}>
                  {metric.value.toFixed(1)} {metric.unit}
                </span>
              </div>
              <div className="w-full h-2 bg-[#0B0E14]/40 rounded-full overflow-hidden border border-[#FF007A]/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
