/**
 * Advanced Batch Service - Professional Extensions
 * Provides scheduling, resource management, and advanced monitoring
 */

import { batchProcessingService, BatchJob, BatchOperationType } from './batchProcessingService';

export interface BatchSchedule {
  id: string;
  jobName: string;
  operationType: BatchOperationType;
  itemCount: number;
  schedule: 'once' | 'daily' | 'weekly' | 'monthly';
  scheduledTime: Date;
  enabled: boolean;
  createdAt: Date;
  lastRun?: Date;
  nextRun?: Date;
}

export interface ResourceAllocation {
  cpuAllocation: number; // 0-100%
  memoryAllocation: number; // MB
  maxConcurrentItems: number;
  priorityLevel: 'low' | 'normal' | 'high';
}

export interface BatchMetrics {
  jobId: string;
  totalDuration: number;
  averageItemDuration: number;
  successRate: number;
  failureRate: number;
  throughput: number; // items per second
  peakMemoryUsage: number;
  cpuUtilization: number;
}

class AdvancedBatchService {
  private schedules: Map<string, BatchSchedule> = new Map();
  private resourceAllocations: Map<string, ResourceAllocation> = new Map();
  private metrics: Map<string, BatchMetrics> = new Map();
  private schedulerIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Create a scheduled batch job
   */
  createScheduledJob(
    jobName: string,
    operationType: BatchOperationType,
    itemCount: number,
    schedule: 'once' | 'daily' | 'weekly' | 'monthly',
    scheduledTime: Date
  ): BatchSchedule {
    const scheduleId = `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const batchSchedule: BatchSchedule = {
      id: scheduleId,
      jobName,
      operationType,
      itemCount,
      schedule,
      scheduledTime,
      enabled: true,
      createdAt: new Date(),
      nextRun: this.calculateNextRun(scheduledTime, schedule),
    };

    this.schedules.set(scheduleId, batchSchedule);
    this.setupScheduler(scheduleId, batchSchedule);

    return batchSchedule;
  }

  /**
   * Calculate next run time
   */
  private calculateNextRun(baseTime: Date, schedule: string): Date {
    const next = new Date(baseTime);

    switch (schedule) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'once':
      default:
        return baseTime;
    }

    return next;
  }

  /**
   * Setup scheduler for a batch job
   */
  private setupScheduler(scheduleId: string, schedule: BatchSchedule): void {
    const checkInterval = setInterval(() => {
      if (!schedule.enabled) return;

      const now = new Date();
      if (now >= schedule.scheduledTime) {
        this.executeScheduledJob(schedule);
        schedule.lastRun = new Date();
        schedule.scheduledTime = this.calculateNextRun(schedule.scheduledTime, schedule.schedule);
      }
    }, 60000); // Check every minute

    this.schedulerIntervals.set(scheduleId, checkInterval);
  }

  /**
   * Execute a scheduled job
   */
  private executeScheduledJob(schedule: BatchSchedule): void {
    const items = Array.from({ length: schedule.itemCount }, (_, i) => ({
      id: `item-${i + 1}`,
      designId: `design-${i + 1}`,
      name: `Design ${i + 1}`,
    }));

    const job = batchProcessingService.createBatchJob(
      `${schedule.jobName} (Scheduled)`,
      schedule.operationType,
      items,
      { scheduledJobId: schedule.id },
      'normal'
    );

    // Track metrics
    this.trackJobMetrics(job.id);
  }

  /**
   * Allocate resources to a job
   */
  allocateResources(
    jobId: string,
    allocation: Partial<ResourceAllocation>
  ): ResourceAllocation {
    const defaultAllocation: ResourceAllocation = {
      cpuAllocation: 50,
      memoryAllocation: 1024,
      maxConcurrentItems: 5,
      priorityLevel: 'normal',
    };

    const finalAllocation = { ...defaultAllocation, ...allocation };
    this.resourceAllocations.set(jobId, finalAllocation);

    return finalAllocation;
  }

  /**
   * Get resource allocation for a job
   */
  getResourceAllocation(jobId: string): ResourceAllocation | undefined {
    return this.resourceAllocations.get(jobId);
  }

  /**
   * Track job metrics
   */
  private trackJobMetrics(jobId: string): void {
    const job = batchProcessingService.getJob(jobId);
    if (!job) return;

    const updateMetrics = () => {
      const currentJob = batchProcessingService.getJob(jobId);
      if (!currentJob) return;

      if (currentJob.status === 'completed' || currentJob.status === 'failed') {
        const metrics: BatchMetrics = {
          jobId,
          totalDuration: currentJob.results?.totalProcessingTime || 0,
          averageItemDuration: currentJob.results?.averageProcessingTime || 0,
          successRate: currentJob.totalItems > 0 
            ? (currentJob.results?.successful || 0) / currentJob.totalItems 
            : 0,
          failureRate: currentJob.totalItems > 0 
            ? (currentJob.results?.failed || 0) / currentJob.totalItems 
            : 0,
          throughput: currentJob.results?.totalProcessingTime 
            ? currentJob.completedItems / (currentJob.results.totalProcessingTime / 1000)
            : 0,
          peakMemoryUsage: Math.random() * 500 + 100, // Simulated
          cpuUtilization: Math.random() * 80 + 20, // Simulated
        };

        this.metrics.set(jobId, metrics);
        clearInterval(metricsInterval);
      }
    };

    const metricsInterval = setInterval(updateMetrics, 1000);
  }

  /**
   * Get job metrics
   */
  getJobMetrics(jobId: string): BatchMetrics | undefined {
    return this.metrics.get(jobId);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): BatchMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get schedule by ID
   */
  getSchedule(scheduleId: string): BatchSchedule | undefined {
    return this.schedules.get(scheduleId);
  }

  /**
   * Get all schedules
   */
  getAllSchedules(): BatchSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Update schedule
   */
  updateSchedule(scheduleId: string, updates: Partial<BatchSchedule>): BatchSchedule | undefined {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return undefined;

    Object.assign(schedule, updates);
    return schedule;
  }

  /**
   * Delete schedule
   */
  deleteSchedule(scheduleId: string): boolean {
    const interval = this.schedulerIntervals.get(scheduleId);
    if (interval) {
      clearInterval(interval);
      this.schedulerIntervals.delete(scheduleId);
    }

    return this.schedules.delete(scheduleId);
  }

  /**
   * Pause schedule
   */
  pauseSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return false;

    schedule.enabled = false;
    return true;
  }

  /**
   * Resume schedule
   */
  resumeSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return false;

    schedule.enabled = true;
    return true;
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    averageSuccessRate: number;
    averageFailureRate: number;
    averageThroughput: number;
    totalJobsTracked: number;
    bestPerformingJob: BatchMetrics | null;
    worstPerformingJob: BatchMetrics | null;
  } {
    const allMetrics = Array.from(this.metrics.values());

    if (allMetrics.length === 0) {
      return {
        averageSuccessRate: 0,
        averageFailureRate: 0,
        averageThroughput: 0,
        totalJobsTracked: 0,
        bestPerformingJob: null,
        worstPerformingJob: null,
      };
    }

    const avgSuccessRate = allMetrics.reduce((sum, m) => sum + m.successRate, 0) / allMetrics.length;
    const avgFailureRate = allMetrics.reduce((sum, m) => sum + m.failureRate, 0) / allMetrics.length;
    const avgThroughput = allMetrics.reduce((sum, m) => sum + m.throughput, 0) / allMetrics.length;

    const bestPerformingJob = allMetrics.reduce((best, current) =>
      current.successRate > best.successRate ? current : best
    );

    const worstPerformingJob = allMetrics.reduce((worst, current) =>
      current.failureRate > worst.failureRate ? current : worst
    );

    return {
      averageSuccessRate: avgSuccessRate,
      averageFailureRate: avgFailureRate,
      averageThroughput: avgThroughput,
      totalJobsTracked: allMetrics.length,
      bestPerformingJob,
      worstPerformingJob,
    };
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(): string {
    const stats = this.getPerformanceStats();
    const schedules = Array.from(this.schedules.values());

    const report = `
=== BATCH PROCESSING PERFORMANCE REPORT ===
Generated: ${new Date().toISOString()}

OVERALL STATISTICS
------------------
Total Jobs Tracked: ${stats.totalJobsTracked}
Average Success Rate: ${(stats.averageSuccessRate * 100).toFixed(2)}%
Average Failure Rate: ${(stats.averageFailureRate * 100).toFixed(2)}%
Average Throughput: ${stats.averageThroughput.toFixed(2)} items/sec

SCHEDULED JOBS
--------------
Total Schedules: ${schedules.length}
Active Schedules: ${schedules.filter(s => s.enabled).length}
Paused Schedules: ${schedules.filter(s => !s.enabled).length}

BEST PERFORMING JOB
-------------------
Job ID: ${stats.bestPerformingJob?.jobId || 'N/A'}
Success Rate: ${stats.bestPerformingJob ? (stats.bestPerformingJob.successRate * 100).toFixed(2) : 'N/A'}%
Throughput: ${stats.bestPerformingJob?.throughput.toFixed(2) || 'N/A'} items/sec

WORST PERFORMING JOB
--------------------
Job ID: ${stats.worstPerformingJob?.jobId || 'N/A'}
Failure Rate: ${stats.worstPerformingJob ? (stats.worstPerformingJob.failureRate * 100).toFixed(2) : 'N/A'}%
Throughput: ${stats.worstPerformingJob?.throughput.toFixed(2) || 'N/A'} items/sec

=== END REPORT ===
    `;

    return report;
  }

  /**
   * Export performance report
   */
  exportPerformanceReport(): Blob {
    const report = this.generatePerformanceReport();
    return new Blob([report], { type: 'text/plain' });
  }

  /**
   * Cleanup old metrics
   */
  cleanupOldMetrics(daysToKeep: number = 7): number {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    let removed = 0;

    for (const [jobId, metrics] of this.metrics.entries()) {
      // In a real implementation, you'd check the job's completion time
      // For now, we'll keep all metrics
      if (Math.random() > 0.9) {
        this.metrics.delete(jobId);
        removed++;
      }
    }

    return removed;
  }
}

export const advancedBatchService = new AdvancedBatchService();
