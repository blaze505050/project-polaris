/**
 * Performance Optimization Service
 * Handles caching, memoization, and performance monitoring
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class PerformanceCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Performance Metrics Tracker
 */
class PerformanceMetrics {
  private metrics = new Map<string, number[]>();

  record(label: string, duration: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
  }

  getStats(label: string) {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: Math.round(avg * 100) / 100,
      median,
      p95,
      p99,
    };
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [label] of this.metrics) {
      stats[label] = this.getStats(label);
    }
    return stats;
  }

  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Debounce utility for search and filter operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle utility for scroll and resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy loading utility for images
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  callback?: () => void
): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          image.src = image.dataset.src || '';
          image.classList.remove('lazy');
          observer.unobserve(image);
          callback?.();
        }
      });
    });
    observer.observe(img);
  } else {
    img.src = img.dataset.src || '';
    callback?.();
  }
}

/**
 * Request batching for API calls
 */
class RequestBatcher {
  private queue: Array<{
    key: string;
    promise: Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;
  private readonly batchSize = 10;
  private readonly batchDelay = 50;

  async batch<T>(key: string, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        key,
        promise: fn(),
        resolve,
        reject,
      });

      if (!this.processing) {
        this.processBatch();
      }
    });
  }

  private async processBatch(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);

      try {
        const results = await Promise.all(batch.map((item) => item.promise));
        batch.forEach((item, index) => {
          item.resolve(results[index]);
        });
      } catch (error) {
        batch.forEach((item) => {
          item.reject(error);
        });
      }

      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.batchDelay));
      }
    }

    this.processing = false;
  }
}

// Export singleton instances
export const performanceCache = new PerformanceCache();
export const performanceMetrics = new PerformanceMetrics();
export const requestBatcher = new RequestBatcher();

/**
 * Measure function execution time
 */
export async function measurePerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    performanceMetrics.record(label, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMetrics.record(`${label}_error`, duration);
    throw error;
  }
}

/**
 * Virtual scrolling helper for large lists
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  items: any[];
  overscan?: number;
}

export function getVisibleRange(config: VirtualScrollConfig) {
  const { itemHeight, containerHeight, items, overscan = 3 } = config;
  const scrollTop = window.scrollY;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    offsetY: startIndex * itemHeight,
  };
}
