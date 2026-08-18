/**
 * Industry-Professional Batch Processing Service
 * Advanced queuing, parametric studies, result aggregation, and comprehensive analytics
 */

export type BatchJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused';
export type BatchOperationType = 'export' | 'simulation' | 'optimization' | 'analysis' | 'conversion' | 'validation' | 'parametric-study';
export type ParameterType = 'range' | 'list' | 'logarithmic' | 'geometric';
export type QueueStrategy = 'fifo' | 'priority' | 'adaptive';

export interface ParameterDefinition {
  name: string;
  type: ParameterType;
  min?: number;
  max?: number;
  steps?: number;
  values?: any[];
  base?: number;
}

export interface ParametricStudyConfig {
  parameters: ParameterDefinition[];
  baselineParameters: Record<string, any>;
  aggregationMethod: 'mean' | 'median' | 'min' | 'max' | 'all';
}

export interface BatchJobItem {
  id: string;
  designId: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  result?: any;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  retryCount?: number;
  parametricVariant?: Record<string, any>;
}

export interface AggregatedResult {
  parameterSet: Record<string, any>;
  metrics: Record<string, number>;
  variance: Record<string, number>;
  itemCount: number;
  successRate: number;
}

export interface BatchJob {
  id: string;
  name: string;
  operationType: BatchOperationType;
  status: BatchJobStatus;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  items: BatchJobItem[];
  progress: number;
  estimatedTimeRemaining: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: 'low' | 'normal' | 'high';
  parameters: Record<string, any>;
  parametricStudyConfig?: ParametricStudyConfig;
  aggregatedResults?: AggregatedResult[];
  results?: {
    successful: number;
    failed: number;
    averageProcessingTime: number;
    totalProcessingTime: number;
    peakMemoryUsage?: number;
    throughput?: number;
    successRate?: number;
  };
  metadata?: {
    userId?: string;
    tags?: string[];
    description?: string;
    estimatedCost?: number;
  };
}

export interface BatchProcessingConfig {
  maxConcurrentJobs: number;
  maxItemsPerBatch: number;
  timeoutPerItem: number;
  retryAttempts: number;
  retryDelay: number;
  queueStrategy: QueueStrategy;
  enablePersistence: boolean;
  enableMetrics: boolean;
}

class BatchProcessingService {
  private jobs: Map<string, BatchJob> = new Map();
  private queue: string[] = [];
  private activeJobs: Set<string> = new Set();
  private config: BatchProcessingConfig = {
    maxConcurrentJobs: 3,
    maxItemsPerBatch: 100,
    timeoutPerItem: 300000,
    retryAttempts: 3,
    retryDelay: 5000,
    queueStrategy: 'adaptive',
    enablePersistence: true,
    enableMetrics: true,
  };

  private jobProgressCallbacks: Map<string, (job: BatchJob) => void> = new Map();
  private itemProgressCallbacks: Map<string, (item: BatchJobItem) => void> = new Map();
  private performanceMetrics: Map<string, any> = new Map();
  private jobHistory: BatchJob[] = [];
  private maxHistorySize = 1000;

  /**
   * Initialize batch processing service
   */
  initialize(config: Partial<BatchProcessingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Create a new batch job with optional parametric study
   */
  createBatchJob(
    name: string,
    operationType: BatchOperationType,
    items: Omit<BatchJobItem, 'status' | 'progress'>[],
    parameters: Record<string, any> = {},
    priority: 'low' | 'normal' | 'high' = 'normal',
    parametricStudyConfig?: ParametricStudyConfig,
    metadata?: BatchJob['metadata']
  ): BatchJob {
    const jobId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate parametric variants if study config provided
    let finalItems = items;
    if (parametricStudyConfig) {
      finalItems = this.generateParametricVariants(items, parametricStudyConfig);
    }
    
    const job: BatchJob = {
      id: jobId,
      name,
      operationType,
      status: 'queued',
      totalItems: finalItems.length,
      completedItems: 0,
      failedItems: 0,
      items: finalItems.map((item, index) => (
        {
          ...item,
          id: `${jobId}-item-${index}`,
          status: 'pending',
          progress: 0,
          retryCount: 0,
        }
      )),
      progress: 0,
      estimatedTimeRemaining: 0,
      createdAt: new Date(),
      priority,
      parameters,
      parametricStudyConfig,
      metadata,
    };

    this.jobs.set(jobId, job);
    this.queue.push(jobId);
    this.sortQueue();
    this.persistJob(job);
    this.processQueue();

    return job;
  }

  /**
   * Generate parametric study variants
   */
  private generateParametricVariants(
    baseItems: Omit<BatchJobItem, 'status' | 'progress'>[],
    config: ParametricStudyConfig
  ): Omit<BatchJobItem, 'status' | 'progress'>[] {
    const variants: Omit<BatchJobItem, 'status' | 'progress'>[] = [];
    const parameterCombinations = this.generateParameterCombinations(config.parameters);

    for (const baseItem of baseItems) {
      for (const paramSet of parameterCombinations) {
        variants.push({
          ...baseItem,
          name: `${baseItem.name} - ${Object.entries(paramSet).map(([k, v]) => `${k}:${v}`).join(', ')}`,
          parametricVariant: paramSet,
        });
      }
    }

    return variants;
  }

  /**
   * Generate all parameter combinations
   */
  private generateParameterCombinations(parameters: ParameterDefinition[]): Record<string, any>[] {
    const combinations: Record<string, any>[] = [];
    const parameterValues: any[][] = [];

    for (const param of parameters) {
      const values = this.generateParameterValues(param);
      parameterValues.push(values);
    }

    const cartesianProduct = (arrays: any[][]): any[][] => {
      if (arrays.length === 0) return [[]];
      const [first, ...rest] = arrays;
      const restProduct = cartesianProduct(rest);
      return first.flatMap(val => restProduct.map(combo => [val, ...combo]));
    };

    const product = cartesianProduct(parameterValues);
    for (const combo of product) {
      const paramSet: Record<string, any> = {};
      for (let i = 0; i < parameters.length; i++) {
        paramSet[parameters[i].name] = combo[i];
      }
      combinations.push(paramSet);
    }

    return combinations;
  }

  /**
   * Generate values for a parameter based on its type
   */
  private generateParameterValues(param: ParameterDefinition): any[] {
    if (param.type === 'list' && param.values) {
      return param.values;
    }

    if (param.type === 'range' && param.min !== undefined && param.max !== undefined && param.steps) {
      const values: number[] = [];
      const step = (param.max - param.min) / (param.steps - 1);
      for (let i = 0; i < param.steps; i++) {
        values.push(param.min + step * i);
      }
      return values;
    }

    if (param.type === 'logarithmic' && param.min && param.max && param.steps && param.base) {
      const values: number[] = [];
      const logMin = Math.log(param.min) / Math.log(param.base);
      const logMax = Math.log(param.max) / Math.log(param.base);
      const step = (logMax - logMin) / (param.steps - 1);
      for (let i = 0; i < param.steps; i++) {
        values.push(Math.pow(param.base, logMin + step * i));
      }
      return values;
    }

    if (param.type === 'geometric' && param.min && param.max && param.steps) {
      const values: number[] = [];
      const ratio = Math.pow(param.max / param.min, 1 / (param.steps - 1));
      for (let i = 0; i < param.steps; i++) {
        values.push(param.min * Math.pow(ratio, i));
      }
      return values;
    }

    return [];
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): BatchJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): BatchJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: BatchJobStatus): BatchJob[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  /**
   * Cancel a batch job
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'processing') {
      job.status = 'cancelled';
      this.activeJobs.delete(jobId);
    } else if (job.status === 'queued') {
      job.status = 'cancelled';
      this.queue = this.queue.filter(id => id !== jobId);
    }

    return true;
  }

  /**
   * Pause a batch job
   */
  pauseJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'processing') return false;

    job.status = 'paused';
    return true;
  }

  /**
   * Resume a paused job
   */
  resumeJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'paused') return false;

    job.status = 'processing';
    this.processQueue();
    return true;
  }

  /**
   * Subscribe to job progress updates
   */
  onJobProgress(jobId: string, callback: (job: BatchJob) => void): () => void {
    this.jobProgressCallbacks.set(jobId, callback);
    return () => this.jobProgressCallbacks.delete(jobId);
  }

  /**
   * Subscribe to item progress updates
   */
  onItemProgress(itemId: string, callback: (item: BatchJobItem) => void): () => void {
    this.itemProgressCallbacks.set(itemId, callback);
    return () => this.itemProgressCallbacks.delete(itemId);
  }

  /**
   * Sort queue based on strategy
   */
  private sortQueue(): void {
    if (this.config.queueStrategy === 'priority') {
      this.queue.sort((a, b) => {
        const jobA = this.jobs.get(a);
        const jobB = this.jobs.get(b);
        if (!jobA || !jobB) return 0;
        
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[jobA.priority] - priorityOrder[jobB.priority];
      });
    }
  }

  /**
   * Process queue - manages concurrent job execution
   */
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.activeJobs.size < this.config.maxConcurrentJobs) {
      const jobId = this.queue.shift();
      if (!jobId) break;

      const job = this.jobs.get(jobId);
      if (!job) continue;

      this.activeJobs.add(jobId);
      job.status = 'processing';
      job.startedAt = new Date();

      this.executeJob(job).catch(error => {
        console.error(`Job ${jobId} failed:`, error);
        job.status = 'failed';
      });
    }
  }

  /**
   * Execute a batch job
   */
  private async executeJob(job: BatchJob): Promise<void> {
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;
    const processingTimes: number[] = [];

    for (let i = 0; i < job.items.length; i++) {
      if (job.status === 'cancelled') break;
      if (job.status === 'paused') {
        await this.waitForResume(job.id);
      }

      const item = job.items[i];
      item.status = 'processing';
      item.startTime = new Date();

      try {
        const itemStartTime = Date.now();
        const result = await this.processItem(item, job);
        const itemDuration = Date.now() - itemStartTime;

        item.status = 'completed';
        item.progress = 100;
        item.result = result;
        item.duration = itemDuration;
        item.endTime = new Date();
        processingTimes.push(itemDuration);
        successCount++;
      } catch (error) {
        item.status = 'failed';
        item.error = error instanceof Error ? error.message : 'Unknown error';
        failureCount++;
      }

      // Update job progress
      job.completedItems = successCount + failureCount;
      job.failedItems = failureCount;
      job.progress = Math.round((job.completedItems / job.totalItems) * 100);
      job.estimatedTimeRemaining = this.estimateRemainingTime(
        processingTimes,
        job.totalItems - job.completedItems
      );

      this.notifyItemProgress(item);
      this.notifyJobProgress(job);
    }

    // Finalize job
    job.status = 'completed';
    job.completedAt = new Date();
    job.progress = 100;

    const totalTime = Date.now() - startTime;
    const successRate = job.totalItems > 0 ? (successCount / job.totalItems) * 100 : 0;
    
    job.results = {
      successful: successCount,
      failed: failureCount,
      averageProcessingTime: processingTimes.length > 0 
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
        : 0,
      totalProcessingTime: totalTime,
      throughput: totalTime > 0 ? (job.totalItems / (totalTime / 1000)) : 0,
      successRate,
    };

    // Aggregate results if parametric study
    if (job.parametricStudyConfig) {
      job.aggregatedResults = this.aggregateParametricResults(job);
    }

    this.activeJobs.delete(job.id);
    this.addToHistory(job);
    this.notifyJobProgress(job);
    this.processQueue();
  }

  /**
   * Aggregate parametric study results
   */
  private aggregateParametricResults(job: BatchJob): AggregatedResult[] {
    const aggregated = new Map<string, any>();

    for (const item of job.items) {
      if (item.status !== 'completed' || !item.parametricVariant) continue;

      const key = JSON.stringify(item.parametricVariant);
      if (!aggregated.has(key)) {
        aggregated.set(key, {
          parameterSet: item.parametricVariant,
          metrics: {},
          values: [],
          count: 0,
          successes: 0,
        });
      }

      const entry = aggregated.get(key);
      entry.count++;
      if (item.status === 'completed') entry.successes++;

      if (item.result?.metrics) {
        for (const [metricName, metricValue] of Object.entries(item.result.metrics)) {
          if (!entry.values[metricName]) entry.values[metricName] = [];
          entry.values[metricName].push(metricValue);
        }
      }
    }

    const results: AggregatedResult[] = [];
    for (const entry of aggregated.values()) {
      const metrics: Record<string, number> = {};
      const variance: Record<string, number> = {};

      for (const [metricName, values] of Object.entries(entry.values)) {
        const numValues = (values as number[]).map(v => typeof v === 'number' ? v : parseFloat(String(v)));
        
        if (job.parametricStudyConfig?.aggregationMethod === 'mean') {
          metrics[metricName] = numValues.reduce((a, b) => a + b, 0) / numValues.length;
        } else if (job.parametricStudyConfig?.aggregationMethod === 'median') {
          const sorted = [...numValues].sort((a, b) => a - b);
          metrics[metricName] = sorted[Math.floor(sorted.length / 2)];
        } else if (job.parametricStudyConfig?.aggregationMethod === 'min') {
          metrics[metricName] = Math.min(...numValues);
        } else if (job.parametricStudyConfig?.aggregationMethod === 'max') {
          metrics[metricName] = Math.max(...numValues);
        }

        const mean = metrics[metricName];
        const squaredDiffs = numValues.map(v => Math.pow(v - mean, 2));
        variance[metricName] = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / numValues.length);
      }

      results.push({
        parameterSet: entry.parameterSet,
        metrics,
        variance,
        itemCount: entry.count,
        successRate: (entry.successes / entry.count) * 100,
      });
    }

    return results;
  }

  /**
   * Process individual item
   */
  private async processItem(item: BatchJobItem, job: BatchJob): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      item.retryCount = attempt;
      try {
        return await this.executeOperation(item, job, attempt);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.config.retryAttempts - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError || new Error('Operation failed after all retry attempts');
  }

  /**
   * Execute the actual operation based on type
   */
  private async executeOperation(
    item: BatchJobItem,
    job: BatchJob,
    attempt: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Operation timeout after ${this.config.timeoutPerItem}ms`));
      }, this.config.timeoutPerItem);

      const processingTime = this.getProcessingTime(job.operationType);
      
      setTimeout(() => {
        clearTimeout(timeout);

        if (Math.random() < 0.05 && attempt === 0) {
          reject(new Error('Simulated transient failure'));
          return;
        }

        resolve({
          itemId: item.id,
          designId: item.designId,
          operationType: job.operationType,
          timestamp: new Date(),
          metrics: this.generateMetrics(job.operationType),
          attempt,
          parametricVariant: item.parametricVariant,
        });
      }, processingTime);
    });
  }

  /**
   * Get estimated processing time for operation type
   */
  private getProcessingTime(operationType: BatchOperationType): number {
    const times: Record<BatchOperationType, number> = {
      export: 2000,
      simulation: 8000,
      optimization: 12000,
      analysis: 5000,
      conversion: 3000,
      validation: 1500,
      'parametric-study': 10000,
    };
    return times[operationType] + Math.random() * 2000;
  }

  /**
   * Generate metrics for operation result
   */
  private generateMetrics(operationType: BatchOperationType): Record<string, any> {
    const metrics: Record<BatchOperationType, Record<string, any>> = {
      export: {
        fileSize: Math.floor(Math.random() * 50) + 10,
        format: 'STEP',
        validationPassed: true,
      },
      simulation: {
        maxStress: (Math.random() * 500 + 100).toFixed(2),
        maxDeflection: (Math.random() * 5 + 0.5).toFixed(2),
        convergence: (Math.random() * 0.3 + 0.7).toFixed(3),
      },
      optimization: {
        weightReduction: (Math.random() * 30 + 5).toFixed(1),
        costSavings: (Math.random() * 40 + 10).toFixed(1),
        performanceGain: (Math.random() * 25 + 5).toFixed(1),
      },
      analysis: {
        criticalAreas: Math.floor(Math.random() * 5) + 1,
        riskScore: (Math.random() * 100).toFixed(1),
        recommendations: Math.floor(Math.random() * 8) + 2,
      },
      conversion: {
        sourceFormat: 'IGES',
        targetFormat: 'STEP',
        geometryPreserved: (Math.random() * 5 + 95).toFixed(1),
      },
      validation: {
        checksRun: Math.floor(Math.random() * 50) + 20,
        checksPassed: Math.floor(Math.random() * 45) + 20,
        dfmCompliant: Math.random() > 0.1,
      },
      'parametric-study': {
        parameterVariance: (Math.random() * 20 + 5).toFixed(2),
        optimalValue: (Math.random() * 100).toFixed(2),
        convergenceRate: (Math.random() * 0.5 + 0.5).toFixed(3),
      },
    };
    return metrics[operationType];
  }

  /**
   * Estimate remaining time
   */
  private estimateRemainingTime(processingTimes: number[], remainingItems: number): number {
    if (processingTimes.length === 0) return 0;
    const avgTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
    return Math.ceil((avgTime * remainingItems) / 1000);
  }

  /**
   * Wait for job to resume
   */
  private waitForResume(jobId: string): Promise<void> {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        const job = this.jobs.get(jobId);
        if (job && job.status !== 'paused') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Notify job progress
   */
  private notifyJobProgress(job: BatchJob): void {
    const callback = this.jobProgressCallbacks.get(job.id);
    if (callback) {
      callback(job);
    }
  }

  /**
   * Notify item progress
   */
  private notifyItemProgress(item: BatchJobItem): void {
    const callback = this.itemProgressCallbacks.get(item.id);
    if (callback) {
      callback(item);
    }
  }

  /**
   * Add job to history
   */
  private addToHistory(job: BatchJob): void {
    this.jobHistory.push(job);
    if (this.jobHistory.length > this.maxHistorySize) {
      this.jobHistory.shift();
    }
  }

  /**
   * Persist job to storage
   */
  private persistJob(job: BatchJob): void {
    if (!this.config.enablePersistence) return;
    try {
      const stored = localStorage.getItem('batch_jobs') || '[]';
      const jobs = JSON.parse(stored);
      jobs.push(job);
      localStorage.setItem('batch_jobs', JSON.stringify(jobs.slice(-100)));
    } catch (e) {
      console.warn('Failed to persist job:', e);
    }
  }

  /**
   * Export job results
   */
  exportResults(jobId: string, format: 'json' | 'csv'): Blob {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');

    if (format === 'json') {
      return new Blob([JSON.stringify(job, null, 2)], { type: 'application/json' });
    } else {
      const headers = ['Item ID', 'Design ID', 'Status', 'Progress', 'Duration (ms)', 'Error', 'Retry Count'];
      const rows = job.items.map(item => [
        item.id,
        item.designId,
        item.status,
        item.progress,
        item.duration || '',
        item.error || '',
        item.retryCount || 0,
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      return new Blob([csv], { type: 'text/csv' });
    }
  }

  /**
   * Clear completed jobs
   */
  clearCompletedJobs(): number {
    let cleared = 0;
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
        this.jobs.delete(jobId);
        cleared++;
      }
    }
    return cleared;
  }

  /**
   * Get service statistics
   */
  getStatistics(): {
    totalJobs: number;
    activeJobs: number;
    queuedJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalItemsProcessed: number;
    averageJobDuration: number;
    totalThroughput: number;
  } {
    const allJobs = Array.from(this.jobs.values());
    const completedJobs = allJobs.filter(j => j.status === 'completed' || j.status === 'failed');
    
    const totalItemsProcessed = completedJobs.reduce((sum, job) => sum + job.completedItems, 0);
    const totalDuration = completedJobs.reduce((sum, job) => {
      if (job.startedAt && job.completedAt) {
        return sum + (job.completedAt.getTime() - job.startedAt.getTime());
      }
      return sum;
    }, 0);

    const totalThroughput = completedJobs.reduce((sum, job) => sum + (job.results?.throughput || 0), 0);

    return {
      totalJobs: allJobs.length,
      activeJobs: this.activeJobs.size,
      queuedJobs: this.queue.length,
      completedJobs: allJobs.filter(j => j.status === 'completed').length,
      failedJobs: allJobs.filter(j => j.status === 'failed').length,
      totalItemsProcessed,
      averageJobDuration: completedJobs.length > 0 ? totalDuration / completedJobs.length : 0,
      totalThroughput: totalThroughput / Math.max(completedJobs.length, 1),
    };
  }

  /**
   * Get job history
   */
  getJobHistory(limit: number = 50): BatchJob[] {
    return this.jobHistory.slice(-limit);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(jobId: string): any {
    return this.performanceMetrics.get(jobId);
  }
}

export const batchProcessingService = new BatchProcessingService();
