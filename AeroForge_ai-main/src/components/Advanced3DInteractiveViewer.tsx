/**
 * Advanced 3D Interactive Viewer
 * Professional-grade 3D visualization with real-time controls
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Play, Pause, Maximize2, Minimize2, Eye, Settings } from 'lucide-react';

interface Object3D {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  color: string;
}

const Advanced3DInteractiveViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [objects, setObjects] = useState<Object3D[]>([
    { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1, color: '#0EA5E9' },
    { x: 100, y: 50, z: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 0.8, color: '#06B6D4' },
    { x: -100, y: -50, z: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 0.6, color: '#10B981' },
  ]);

  const [cameraRotation, setCameraRotation] = useState({ x: 0.5, y: 0.5 });
  const [zoom, setZoom] = useState(500);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  // 3D rendering loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isAnimating) {
        timeRef.current += 0.016; // ~60fps
      }

      // Clear canvas
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = -200; i <= 200; i += 50) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + i, 0);
        ctx.lineTo(canvas.width / 2 + i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + i);
        ctx.lineTo(canvas.width, canvas.height / 2 + i);
        ctx.stroke();
      }

      // Draw axes
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // X axis (red)
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + 100, centerY);
      ctx.stroke();

      // Y axis (green)
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - 100);
      ctx.stroke();

      // Z axis (blue)
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + 70, centerY + 70);
      ctx.stroke();

      // Draw 3D objects
      objects.forEach((obj, idx) => {
        // Apply rotation
        let x = obj.x;
        let y = obj.y;
        let z = obj.z;

        if (isAnimating) {
          const angle = timeRef.current * 0.5 + idx;
          x += Math.cos(angle) * 50;
          y += Math.sin(angle) * 50;
          z += Math.sin(angle * 0.7) * 30;
        }

        // Apply camera rotation
        let rotX = x * Math.cos(cameraRotation.y) - z * Math.sin(cameraRotation.y);
        let rotZ = x * Math.sin(cameraRotation.y) + z * Math.cos(cameraRotation.y);
        let rotY = y * Math.cos(cameraRotation.x) - rotZ * Math.sin(cameraRotation.x);
        rotZ = y * Math.sin(cameraRotation.x) + rotZ * Math.cos(cameraRotation.x);

        // Perspective projection
        const perspective = zoom / (zoom + rotZ);
        const screenX = centerX + rotX * perspective;
        const screenY = centerY - rotY * perspective;
        const size = 20 * obj.scale * perspective;

        // Draw object
        ctx.fillStyle = obj.color;
        ctx.globalAlpha = 0.7 + 0.3 * perspective;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size + 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
      });

      // Draw info
      ctx.fillStyle = '#0EA5E9';
      ctx.font = '12px monospace';
      ctx.globalAlpha = 0.7;
      ctx.fillText(`Objects: ${objects.length}`, 20, 30);
      ctx.fillText(`Zoom: ${zoom.toFixed(0)}`, 20, 50);
      ctx.fillText(`Rotation: X=${cameraRotation.x.toFixed(2)} Y=${cameraRotation.y.toFixed(2)}`, 20, 70);
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, objects, cameraRotation, zoom]);

  const handleReset = () => {
    setCameraRotation({ x: 0.5, y: 0.5 });
    setZoom(500);
    timeRef.current = 0;
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
              3D Interactive Viewer
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Playback Controls */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAnimating(!isAnimating)}
                variant="outline"
                className="flex-1 border-aerospace-blue/30 hover:bg-aerospace-blue/10"
              >
                {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
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

            {/* Camera Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-secondary-foreground flex justify-between mb-2">
                  <span>Camera Rotation X</span>
                  <span className="text-aerospace-blue font-mono">{cameraRotation.x.toFixed(2)}</span>
                </label>
                <Slider
                  value={[cameraRotation.x]}
                  onValueChange={(val) => setCameraRotation({ ...cameraRotation, x: val[0] })}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-secondary-foreground flex justify-between mb-2">
                  <span>Camera Rotation Y</span>
                  <span className="text-aerospace-blue font-mono">{cameraRotation.y.toFixed(2)}</span>
                </label>
                <Slider
                  value={[cameraRotation.y]}
                  onValueChange={(val) => setCameraRotation({ ...cameraRotation, y: val[0] })}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-secondary-foreground flex justify-between mb-2">
                  <span>Zoom Level</span>
                  <span className="text-aerospace-blue font-mono">{zoom.toFixed(0)}</span>
                </label>
                <Slider
                  value={[zoom]}
                  onValueChange={(val) => setZoom(val[0])}
                  min={100}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Advanced3DInteractiveViewer;
