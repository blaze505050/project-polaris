import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
  status: 'good' | 'warning' | 'critical';
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    renderTime: 0,
    status: 'good',
  });
  const [isVisible, setIsVisible] = useState(false);
  const fpsRef = useRef({ frames: 0, lastTime: Date.now() });
  const renderStartRef = useRef(0);

  useEffect(() => {
    // Monitor performance
    const checkPerformance = () => {
      const now = Date.now();
      fpsRef.current.frames++;

      if (now - fpsRef.current.lastTime >= 1000) {
        const fps = fpsRef.current.frames;
        const memory = (performance as any).memory?.usedJSHeapSize || 0;
        const renderTime = now - renderStartRef.current;

        let status: 'good' | 'warning' | 'critical' = 'good';
        if (fps < 30 || memory > 500000000) status = 'critical';
        else if (fps < 45 || memory > 300000000) status = 'warning';

        setMetrics({
          fps,
          memory: Math.round(memory / 1000000),
          renderTime,
          status,
        });

        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }

      renderStartRef.current = now;
      requestAnimationFrame(checkPerformance);
    };

    const id = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(id);
  }, []);

  const getStatusColor = () => {
    switch (metrics.status) {
      case 'good':
        return 'text-aerospace-success';
      case 'warning':
        return 'text-aerospace-warning';
      case 'critical':
        return 'text-aerospace-danger';
      default:
        return 'text-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (metrics.status) {
      case 'good':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'warning':
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-6 right-6 z-40 bg-aerospace-dark/95 border border-aerospace-blue/30 rounded-lg p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-xs font-mono">
                {metrics.status.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-4 text-xs font-mono text-foreground/70">
              <div>
                <span className="text-aerospace-blue">{metrics.fps}</span> FPS
              </div>
              <div>
                <span className="text-aerospace-blue">{metrics.memory}</span> MB
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-6 right-6 z-40 p-2 bg-aerospace-blue/20 hover:bg-aerospace-blue/40 rounded-lg transition-all"
        title="Toggle Performance Monitor"
      >
        <Activity className="w-4 h-4 text-aerospace-blue" />
      </button>
    </AnimatePresence>
  );
}
