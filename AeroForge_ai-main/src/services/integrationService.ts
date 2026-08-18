/**
 * Integration Service
 * Handles external API integrations and data synchronization
 */

export interface IntegrationConfig {
  name: string;
  endpoint: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface IntegrationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  duration: number;
}

/**
 * Base Integration Handler
 */
export class IntegrationHandler {
  protected config: IntegrationConfig;
  protected requestCache = new Map<string, { data: any; timestamp: number }>();
  protected readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: IntegrationConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * Make HTTP request with retry logic
   */
  public async request<T>(
    method: string,
    path: string,
    data?: any,
    useCache = true
  ): Promise<IntegrationResponse<T>> {
    const startTime = performance.now();
    const cacheKey = `${method}:${path}`;

    // Check cache
    if (useCache && method === 'GET') {
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return {
          success: true,
          data: cached.data,
          timestamp: Date.now(),
          duration: 0,
        };
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retryAttempts!; attempt++) {
      try {
        const response = await this.executeRequest<T>(method, path, data);
        const duration = performance.now() - startTime;

        // Cache successful GET requests
        if (useCache && method === 'GET') {
          this.requestCache.set(cacheKey, {
            data: response,
            timestamp: Date.now(),
          });
        }

        return {
          success: true,
          data: response,
          timestamp: Date.now(),
          duration,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.retryAttempts! - 1) {
          await this.delay(this.config.retryDelay! * Math.pow(2, attempt));
        }
      }
    }

    const duration = performance.now() - startTime;
    return {
      success: false,
      error: lastError?.message || 'Unknown error',
      timestamp: Date.now(),
      duration,
    };
  }

  /**
   * Execute actual HTTP request
   */
  protected async executeRequest<T>(
    method: string,
    path: string,
    data?: any
  ): Promise<T> {
    const url = `${this.config.endpoint}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.requestCache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.requestCache.keys()) {
      if (regex.test(key)) {
        this.requestCache.delete(key);
      }
    }
  }

  /**
   * Delay utility
   */
  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Data Synchronization Service
 */
export class DataSyncService {
  private syncQueue: Array<{
    id: string;
    operation: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
  }> = [];
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  /**
   * Queue data for synchronization
   */
  queueSync(
    id: string,
    operation: 'create' | 'update' | 'delete',
    data: any
  ): void {
    // Remove duplicate operations for same ID
    this.syncQueue = this.syncQueue.filter((item) => item.id !== id);

    this.syncQueue.push({
      id,
      operation,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Start automatic synchronization
   */
  startAutoSync(interval: number = 30000): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.sync();
    }, interval);
  }

  /**
   * Stop automatic synchronization
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Perform synchronization
   */
  async sync(): Promise<boolean> {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return false;
    }

    this.isSyncing = true;

    try {
      const batch = [...this.syncQueue];
      this.syncQueue = [];

      // Process batch operations
      for (const item of batch) {
        // Implement actual sync logic here
        console.log(`Syncing ${item.operation}: ${item.id}`);
      }

      return true;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get pending sync items
   */
  getPendingItems() {
    return [...this.syncQueue];
  }

  /**
   * Clear sync queue
   */
  clearQueue(): void {
    this.syncQueue = [];
  }
}

/**
 * Webhook Handler
 */
export class WebhookHandler {
  private listeners = new Map<string, Set<(data: any) => void>>();

  /**
   * Subscribe to webhook events
   */
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Emit webhook event
   */
  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in webhook callback for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  unsubscribeAll(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

/**
 * API Rate Limiter
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Remove old requests outside the window
    this.requests = this.requests.filter((time) => time > windowStart);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const validRequests = this.requests.filter((time) => time > windowStart);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Get time until next request is allowed (in ms)
   */
  getResetTime(): number {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }

    const oldestRequest = this.requests[0];
    const resetTime = oldestRequest + this.windowMs - Date.now();
    return Math.max(0, resetTime);
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.requests = [];
  }
}

/**
 * Event Bus for inter-component communication
 */
export class EventBus {
  private events = new Map<string, Set<(data: any) => void>>();

  /**
   * Subscribe to event
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.events.get(event)?.delete(callback);
    };
  }

  /**
   * Subscribe to event once
   */
  once(event: string, callback: (data: any) => void): () => void {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Emit event
   */
  emit(event: string, data?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners
   */
  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// Export singleton instances
export const dataSyncService = new DataSyncService();
export const webhookHandler = new WebhookHandler();
export const eventBus = new EventBus();
export const rateLimiter = new RateLimiter();
