import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Maximize2, Minimize2, Save, Download, Upload, Share2, 
  Settings, Eye, Grid3x3, Layers, Zap, RotateCw, Copy, Trash2,
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX
} from 'lucide-react';

interface CADWorkspaceProps {
  projectId: string;
  projectName: string;
}

export default function CADWorkspace({ projectId, projectName }: CADWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'wireframe'>('3d');
  const [showGrid, setShowGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(0);

  const layers = [
    { id: 1, name: 'Main Body', visible: true, locked: false },
    { id: 2, name: 'Internal Structure', visible: true, locked: false },
    { id: 3, name: 'Surface Details', visible: true, locked: false },
    { id: 4, name: 'Annotations', visible: true, locked: false },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `${projectName}-preview.png`;
    link.click();
  };

  // Initialize canvas rendering
  React.useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw a simple 3D-like representation
    const drawFrame = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(10, 165, 225, 0.1)';
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

      // Draw rotating cube wireframe
      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = 60;

      // Simple 3D cube rotation
      const angle = time * 0.5;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.strokeStyle = 'rgba(10, 165, 225, 0.8)';
      ctx.lineWidth = 2;

      // Draw cube edges
      const vertices = [
        [-size, -size, -size],
        [size, -size, -size],
        [size, size, -size],
        [-size, size, -size],
        [-size, -size, size],
        [size, -size, size],
        [size, size, size],
        [-size, size, size],
      ];

      const rotated = vertices.map(([x, y, z]) => {
        const x2 = x * cos - z * sin;
        const z2 = x * sin + z * cos;
        return [x2, y, z2];
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      edges.forEach(([a, b]) => {
        const p1 = rotated[a];
        const p2 = rotated[b];
        ctx.beginPath();
        ctx.moveTo(centerX + p1[0], centerY + p1[1]);
        ctx.lineTo(centerX + p2[0], centerY + p2[1]);
        ctx.stroke();
      });

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, []);

  const handleRotate = (axis: 'x' | 'y' | 'z', direction: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: (prev[axis] + direction * 15) % 360,
    }));
  };

  return (
    <div className={`flex flex-col h-full bg-aerospace-dark ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/80 border-b border-aerospace-blue/30 px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-white">{projectName}</h3>
          <span className="text-secondary-foreground text-sm">ID: {projectId}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode */}
          <div className="flex items-center gap-1 bg-primary/50 rounded-lg p-1">
            {['3d', '2d', 'wireframe'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-aerospace-accent text-black'
                    : 'text-secondary-foreground hover:text-white'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tools */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'bg-aerospace-blue/20' : ''}
            title="Toggle Grid"
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLayers(!showLayers)}
            className={showLayers ? 'bg-aerospace-blue/20' : ''}
            title="Toggle Layers"
          >
            <Layers className="w-4 h-4" />
          </Button>

          {/* Zoom */}
          <div className="flex items-center gap-2 bg-primary/50 rounded-lg px-2 py-1">
            <button onClick={() => setZoom(Math.max(10, zoom - 10))} className="text-secondary-foreground hover:text-white">
              −
            </button>
            <span className="text-sm text-white min-w-[40px] text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(500, zoom + 10))} className="text-secondary-foreground hover:text-white">
              +
            </button>
          </div>

          {/* Actions */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            title="Save"
          >
            <Save className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            title="Export"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Sidebar - Layers */}
        {showLayers && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-primary/50 border border-aerospace-blue/30 rounded-lg p-4 overflow-y-auto"
          >
            <h4 className="font-heading font-semibold text-white mb-4">Layers</h4>
            <div className="space-y-2">
              {layers.map((layer, i) => (
                <motion.div
                  key={layer.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedLayer(i)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedLayer === i
                      ? 'bg-aerospace-accent/20 border border-aerospace-accent'
                      : 'bg-primary/30 border border-transparent hover:border-aerospace-blue/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Eye className="w-4 h-4 text-aerospace-blue" />
                      <span className="text-white text-sm font-medium">{layer.name}</span>
                    </div>
                    {layer.locked && <span className="text-xs text-secondary-foreground">🔒</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Center - Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-primary/50 border border-aerospace-blue/30 rounded-lg overflow-hidden flex flex-col"
        >
          {/* Canvas Area */}
          <div className="flex-1 relative bg-gradient-to-br from-aerospace-dark to-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{
                transform: `scale(${zoom / 100}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                transformOrigin: 'center',
              }}
            />
            
            {/* Grid Background */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, transparent 24%, rgba(10, 165, 225, 0.05) 25%, rgba(10, 165, 225, 0.05) 26%, transparent 27%, transparent 74%, rgba(10, 165, 225, 0.05) 75%, rgba(10, 165, 225, 0.05) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(10, 165, 225, 0.05) 25%, rgba(10, 165, 225, 0.05) 26%, transparent 27%, transparent 74%, rgba(10, 165, 225, 0.05) 75%, rgba(10, 165, 225, 0.05) 76%, transparent 77%, transparent)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
            )}

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 border-2 border-aerospace-accent/30 rounded-full" />
              <div className="absolute w-12 h-0.5 bg-gradient-to-r from-transparent via-aerospace-accent/30 to-transparent" />
              <div className="absolute w-0.5 h-12 bg-gradient-to-b from-transparent via-aerospace-accent/30 to-transparent" />
            </div>

            {/* Placeholder 3D Model */}
            <motion.div
              animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
                rotateZ: rotation.z,
              }}
              transition={{ type: 'spring', stiffness: 50 }}
              className="absolute w-32 h-32 bg-gradient-to-br from-aerospace-blue to-aerospace-accent rounded-lg shadow-2xl"
              style={{
                perspective: '1000px',
              }}
            />
          </div>

          {/* Rotation Controls */}
          <div className="bg-primary/50 border-t border-aerospace-blue/30 p-3 flex items-center justify-center gap-2">
            <span className="text-secondary-foreground text-xs">Rotate:</span>
            <div className="flex gap-1">
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis} className="flex gap-1">
                  <button
                    onClick={() => handleRotate(axis as any, -1)}
                    className="p-1 bg-primary/50 hover:bg-aerospace-blue/20 rounded text-secondary-foreground hover:text-white transition-all"
                    title={`Rotate ${axis} -`}
                  >
                    ←
                  </button>
                  <span className="text-white text-xs min-w-[20px] text-center">{axis}</span>
                  <button
                    onClick={() => handleRotate(axis as any, 1)}
                    className="p-1 bg-primary/50 hover:bg-aerospace-blue/20 rounded text-secondary-foreground hover:text-white transition-all"
                    title={`Rotate ${axis} +`}
                  >
                    →
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setRotation({ x: 0, y: 0, z: 0 })}
              className="ml-auto p-1 bg-primary/50 hover:bg-aerospace-blue/20 rounded text-secondary-foreground hover:text-white transition-all"
              title="Reset rotation"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Right Sidebar - Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 bg-primary/50 border border-aerospace-blue/30 rounded-lg p-4 overflow-y-auto"
        >
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-primary/50">
              <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4 mt-4">
              <div>
                <label className="text-secondary-foreground text-xs font-medium">Name</label>
                <input
                  type="text"
                  defaultValue={layers[selectedLayer].name}
                  className="w-full mt-1 bg-primary/50 border border-aerospace-blue/30 rounded px-2 py-1 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-secondary-foreground text-xs font-medium">Dimensions</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['X', 'Y', 'Z'].map((axis) => (
                    <input
                      key={axis}
                      type="number"
                      placeholder={axis}
                      className="bg-primary/50 border border-aerospace-blue/30 rounded px-2 py-1 text-white text-xs"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-secondary-foreground text-xs font-medium">Material</label>
                <select className="w-full mt-1 bg-primary/50 border border-aerospace-blue/30 rounded px-2 py-1 text-white text-sm">
                  <option>Aluminum</option>
                  <option>Steel</option>
                  <option>Carbon Fiber</option>
                  <option>Titanium</option>
                </select>
              </div>

              <div>
                <label className="text-secondary-foreground text-xs font-medium">Color</label>
                <div className="flex gap-2 mt-1">
                  {['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-aerospace-blue/30 hover:border-aerospace-accent"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-2 mt-4">
              {[
                { action: 'Created layer', time: '2 min ago' },
                { action: 'Modified geometry', time: '5 min ago' },
                { action: 'Changed material', time: '10 min ago' },
              ].map((item, i) => (
                <div key={i} className="text-xs p-2 bg-primary/30 rounded border border-aerospace-blue/20">
                  <p className="text-white font-medium">{item.action}</p>
                  <p className="text-secondary-foreground">{item.time}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
