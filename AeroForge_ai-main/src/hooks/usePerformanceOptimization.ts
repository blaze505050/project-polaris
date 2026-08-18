import { useEffect, useRef, useCallback } from 'react';

interface PerformanceOptions {
  enableLogging?: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
}

export function usePerformanceOptimization(options: PerformanceOptions = {}) {
  const {
    enableLogging = false,
    warningThreshold = 45,
    criticalThreshold = 30,
  } = options;

  const metricsRef = useRef({
    fps: 60,
    frameTime: 0,
    lastFrameTime: performance.now(),
  });

  const measurePerformance = useCallback((callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    const frameTime = end - start;

    metricsRef.current.frameTime = frameTime;

    if (enableLogging && frameTime > 16.67) {
      console.warn(`Slow frame detected: ${frameTime.toFixed(2)}ms`);
    }

    return frameTime;
  }, [enableLogging]);

  const getMetrics = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - metricsRef.current.lastFrameTime;
    const fps = Math.round(1000 / deltaTime);

    metricsRef.current.fps = fps;
    metricsRef.current.lastFrameTime = now;

    return {
      fps,
      frameTime: metricsRef.current.frameTime,
      isWarning: fps < warningThreshold,
      isCritical: fps < criticalThreshold,
    };
  }, [warningThreshold, criticalThreshold]);

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  return {
    measurePerformance,
    getMetrics,
    debounce,
    throttle,
  };
}

export function useMemoryOptimization() {
  const checkMemory = useCallback(() => {
    if ((performance as any).memory) {
      const { usedJSHeapSize, jsHeapSizeLimit } = (performance as any).memory;
      const usage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
      return {
        used: Math.round(usedJSHeapSize / 1000000),
        limit: Math.round(jsHeapSizeLimit / 1000000),
        percentage: Math.round(usage),
      };
    }
    return null;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const memory = checkMemory();
      if (memory && memory.percentage > 90) {
        console.warn('High memory usage detected:', memory);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [checkMemory]);

  return { checkMemory };
}
