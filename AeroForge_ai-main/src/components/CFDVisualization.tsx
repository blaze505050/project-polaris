import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FlowField, MeshData } from '@/services/cfdPhysicsEngine';

interface CFDVisualizationProps {
  flowField: FlowField | null;
  meshData: MeshData | null;
  isRunning: boolean;
  convergence: number;
  visualizationType: 'velocity' | 'pressure' | 'turbulence' | 'streamlines';
}

export default function CFDVisualization({
  flowField,
  meshData,
  isRunning,
  convergence,
  visualizationType,
}: CFDVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!canvasRef.current || !flowField || !meshData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on visualization type
    switch (visualizationType) {
      case 'velocity':
        drawVelocityField(ctx, canvas, flowField, meshData);
        break;
      case 'pressure':
        drawPressureField(ctx, canvas, flowField, meshData);
        break;
      case 'turbulence':
        drawTurbulenceField(ctx, canvas, flowField, meshData);
        break;
      case 'streamlines':
        drawStreamlines(ctx, canvas, flowField, meshData);
        break;
    }

    // Draw mesh outline
    drawMeshOutline(ctx, canvas, meshData);
  }, [flowField, meshData, visualizationType, convergence]);

  const drawVelocityField = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    flowField: FlowField,
    meshData: MeshData
  ) => {
    const nodes = meshData.nodes;
    const maxVelocity = Math.max(
      ...flowField.u.map(Math.abs),
      ...flowField.v.map(Math.abs)
    );

    // Draw velocity vectors
    const step = Math.max(1, Math.floor(nodes.length / 100));
    for (let i = 0; i < nodes.length; i += step) {
      const node = nodes[i];
      const x = ((node.x + 1) / 2) * canvas.width;
      const y = ((1 - node.y) / 2) * canvas.height;

      const u = flowField.u[i] / maxVelocity;
      const v = flowField.v[i] / maxVelocity;
      const magnitude = Math.sqrt(u * u + v * v);

      // Color based on velocity magnitude
      const hue = (magnitude * 360) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.lineWidth = 2;

      // Draw arrow
      const arrowLength = 15;
      const endX = x + u * arrowLength;
      const endY = y - v * arrowLength;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(endY - y, endX - x);
      const arrowSize = 5;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fill();
    }
  };

  const drawPressureField = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    flowField: FlowField,
    meshData: MeshData
  ) => {
    const nodes = meshData.nodes;
    const minPressure = Math.min(...flowField.p);
    const maxPressure = Math.max(...flowField.p);
    const pressureRange = maxPressure - minPressure;

    // Draw pressure contours
    const contourLevels = 20;
    for (let level = 0; level < contourLevels; level++) {
      const pressure = minPressure + (level / contourLevels) * pressureRange;
      const hue = (level / contourLevels) * 240; // Blue to red

      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      ctx.beginPath();
      let isFirst = true;
      for (let i = 0; i < nodes.length; i++) {
        if (Math.abs(flowField.p[i] - pressure) < pressureRange / (contourLevels * 2)) {
          const node = nodes[i];
          const x = ((node.x + 1) / 2) * canvas.width;
          const y = ((1 - node.y) / 2) * canvas.height;

          if (isFirst) {
            ctx.moveTo(x, y);
            isFirst = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw pressure field as heatmap
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const x = Math.floor(((node.x + 1) / 2) * canvas.width);
      const y = Math.floor(((1 - node.y) / 2) * canvas.height);

      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const normalized = (flowField.p[i] - minPressure) / pressureRange;
        const hue = (1 - normalized) * 240;

        const rgb = hslToRgb(hue, 100, 50);
        const pixelIndex = (y * canvas.width + x) * 4;
        data[pixelIndex] = rgb.r;
        data[pixelIndex + 1] = rgb.g;
        data[pixelIndex + 2] = rgb.b;
        data[pixelIndex + 3] = 100;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawTurbulenceField = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    flowField: FlowField,
    meshData: MeshData
  ) => {
    const nodes = meshData.nodes;
    const maxK = Math.max(...flowField.turbulence.k);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const x = Math.floor(((node.x + 1) / 2) * canvas.width);
      const y = Math.floor(((1 - node.y) / 2) * canvas.height);

      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const normalized = flowField.turbulence.k[i] / maxK;
        const hue = normalized * 60; // Yellow to red

        const rgb = hslToRgb(hue, 100, 50);
        const pixelIndex = (y * canvas.width + x) * 4;
        data[pixelIndex] = rgb.r;
        data[pixelIndex + 1] = rgb.g;
        data[pixelIndex + 2] = rgb.b;
        data[pixelIndex + 3] = 150;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawStreamlines = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    flowField: FlowField,
    meshData: MeshData
  ) => {
    const nodes = meshData.nodes;
    const maxVelocity = Math.max(
      ...flowField.u.map(Math.abs),
      ...flowField.v.map(Math.abs)
    );

    // Draw streamlines starting from inlet
    const numStreamlines = 15;
    for (let s = 0; s < numStreamlines; s++) {
      const startY = (s / numStreamlines) * 2 - 1;
      let x = -1;
      let y = startY;

      ctx.strokeStyle = `hsl(${(s / numStreamlines) * 360}, 100%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Trace streamline
      for (let step = 0; step < 100; step++) {
        const canvasX = ((x + 1) / 2) * canvas.width;
        const canvasY = ((1 - y) / 2) * canvas.height;

        if (step === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }

        // Find nearest node
        let nearestIdx = 0;
        let minDist = Infinity;
        for (let i = 0; i < nodes.length; i++) {
          const dist = Math.sqrt(
            Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2)
          );
          if (dist < minDist) {
            minDist = dist;
            nearestIdx = i;
          }
        }

        // Move along velocity field
        const u = flowField.u[nearestIdx] / maxVelocity;
        const v = flowField.v[nearestIdx] / maxVelocity;
        const dt = 0.02;

        x += u * dt;
        y += v * dt;

        // Stop if out of bounds
        if (x > 1 || y > 1 || y < -1) break;
      }

      ctx.stroke();
    }
  };

  const drawMeshOutline = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    meshData: MeshData
  ) => {
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;

    for (const element of meshData.elements) {
      for (let i = 0; i < element.length; i++) {
        const node1 = meshData.nodes[element[i]];
        const node2 = meshData.nodes[element[(i + 1) % element.length]];

        const x1 = ((node1.x + 1) / 2) * canvas.width;
        const y1 = ((1 - node1.y) / 2) * canvas.height;
        const x2 = ((node2.x + 1) / 2) * canvas.width;
        const y2 = ((1 - node2.y) / 2) * canvas.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <motion.canvas
        ref={canvasRef}
        className="w-full h-96 bg-slate-900 rounded-lg border border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {isRunning && (
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm text-slate-400">
            Rendering flow field... {convergence.toFixed(1)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}
