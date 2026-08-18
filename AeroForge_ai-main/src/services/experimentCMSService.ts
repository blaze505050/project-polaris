/**
 * Experiment CMS Service
 * Handles CRUD operations for experiments and reports
 * Integrates with BaseCrudService for data persistence
 */

import { BaseCrudService } from '@/integrations';
import { Experiments, ExperimentReports } from '@/entities';

export interface ExperimentData {
  experimentName: string;
  parameters: string; // JSON stringified
  results: string; // JSON stringified
  conductedAt: Date | string;
  userNotes: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ReportData {
  reportTitle: string;
  analysisSummary: string;
  dataVisualizationChart?: string; // Image URL
  conclusionsFindings: string;
  reportDate: Date | string;
  authorName: string;
  reportVersion: number;
}

export class ExperimentCMSService {
  /**
   * Create a new experiment
   */
  static async createExperiment(data: ExperimentData): Promise<Experiments> {
    try {
      const experimentId = crypto.randomUUID();
      const experiment: Experiments = {
        _id: experimentId,
        experimentName: data.experimentName,
        parameters: data.parameters,
        results: data.results,
        conductedAt: data.conductedAt,
        userNotes: data.userNotes,
        status: data.status,
      };

      await BaseCrudService.create('experiments', experiment);
      return experiment;
    } catch (error) {
      throw new Error(`Failed to create experiment: ${error}`);
    }
  }

  /**
   * Get all experiments with pagination
   */
  static async getAllExperiments(limit: number = 50, skip: number = 0) {
    try {
      const result = await BaseCrudService.getAll<Experiments>('experiments', [], {
        limit,
        skip,
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch experiments: ${error}`);
    }
  }

  /**
   * Get experiment by ID
   */
  static async getExperimentById(id: string): Promise<Experiments | null> {
    try {
      const experiment = await BaseCrudService.getById<Experiments>('experiments', id);
      return experiment || null;
    } catch (error) {
      throw new Error(`Failed to fetch experiment: ${error}`);
    }
  }

  /**
   * Update experiment
   */
  static async updateExperiment(id: string, data: Partial<ExperimentData>): Promise<Experiments> {
    try {
      const updateData: Partial<Experiments> = {
        _id: id,
        ...data,
      };

      await BaseCrudService.update<Experiments>('experiments', updateData as Experiments);

      // Fetch and return updated experiment
      const updated = await BaseCrudService.getById<Experiments>('experiments', id);
      if (!updated) throw new Error('Failed to retrieve updated experiment');
      return updated;
    } catch (error) {
      throw new Error(`Failed to update experiment: ${error}`);
    }
  }

  /**
   * Delete experiment
   */
  static async deleteExperiment(id: string): Promise<void> {
    try {
      await BaseCrudService.delete('experiments', id);
    } catch (error) {
      throw new Error(`Failed to delete experiment: ${error}`);
    }
  }

  /**
   * Create experiment report
   */
  static async createReport(data: ReportData): Promise<ExperimentReports> {
    try {
      const reportId = crypto.randomUUID();
      const report: ExperimentReports = {
        _id: reportId,
        reportTitle: data.reportTitle,
        analysisSummary: data.analysisSummary,
        dataVisualizationChart: data.dataVisualizationChart,
        conclusionsFindings: data.conclusionsFindings,
        reportDate: data.reportDate,
        authorName: data.authorName,
        reportVersion: data.reportVersion,
      };

      await BaseCrudService.create('experimentreports', report);
      return report;
    } catch (error) {
      throw new Error(`Failed to create report: ${error}`);
    }
  }

  /**
   * Get all reports with pagination
   */
  static async getAllReports(limit: number = 50, skip: number = 0) {
    try {
      const result = await BaseCrudService.getAll<ExperimentReports>('experimentreports', [], {
        limit,
        skip,
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch reports: ${error}`);
    }
  }

  /**
   * Get report by ID
   */
  static async getReportById(id: string): Promise<ExperimentReports | null> {
    try {
      const report = await BaseCrudService.getById<ExperimentReports>('experimentreports', id);
      return report || null;
    } catch (error) {
      throw new Error(`Failed to fetch report: ${error}`);
    }
  }

  /**
   * Update report
   */
  static async updateReport(id: string, data: Partial<ReportData>): Promise<ExperimentReports> {
    try {
      const updateData: Partial<ExperimentReports> = {
        _id: id,
        ...data,
      };

      await BaseCrudService.update<ExperimentReports>('experimentreports', updateData as ExperimentReports);

      // Fetch and return updated report
      const updated = await BaseCrudService.getById<ExperimentReports>('experimentreports', id);
      if (!updated) throw new Error('Failed to retrieve updated report');
      return updated;
    } catch (error) {
      throw new Error(`Failed to update report: ${error}`);
    }
  }

  /**
   * Delete report
   */
  static async deleteReport(id: string): Promise<void> {
    try {
      await BaseCrudService.delete('experimentreports', id);
    } catch (error) {
      throw new Error(`Failed to delete report: ${error}`);
    }
  }

  /**
   * Get experiments by status
   */
  static async getExperimentsByStatus(status: string, limit: number = 50) {
    try {
      const result = await BaseCrudService.getAll<Experiments>('experiments', [], {
        limit,
      });

      const filtered = result.items.filter((exp) => exp.status === status);
      return {
        items: filtered,
        totalCount: filtered.length,
        hasNext: false,
      };
    } catch (error) {
      throw new Error(`Failed to fetch experiments by status: ${error}`);
    }
  }

  /**
   * Validate experiment data before save
   */
  static validateExperimentData(data: ExperimentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.experimentName || data.experimentName.trim().length === 0) {
      errors.push('Experiment name is required');
    }

    if (!data.parameters || data.parameters.trim().length === 0) {
      errors.push('Parameters are required');
    }

    if (!data.userNotes || data.userNotes.trim().length === 0) {
      errors.push('User notes are required');
    }

    if (!['pending', 'running', 'completed', 'failed'].includes(data.status)) {
      errors.push('Invalid status value');
    }

    try {
      JSON.parse(data.parameters);
    } catch {
      errors.push('Parameters must be valid JSON');
    }

    try {
      JSON.parse(data.results);
    } catch {
      errors.push('Results must be valid JSON');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate report data before save
   */
  static validateReportData(data: ReportData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.reportTitle || data.reportTitle.trim().length === 0) {
      errors.push('Report title is required');
    }

    if (!data.analysisSummary || data.analysisSummary.trim().length === 0) {
      errors.push('Analysis summary is required');
    }

    if (!data.conclusionsFindings || data.conclusionsFindings.trim().length === 0) {
      errors.push('Conclusions and findings are required');
    }

    if (!data.authorName || data.authorName.trim().length === 0) {
      errors.push('Author name is required');
    }

    if (data.reportVersion < 1) {
      errors.push('Report version must be at least 1');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export experiment as JSON
   */
  static async exportExperimentAsJSON(id: string): Promise<string> {
    try {
      const experiment = await this.getExperimentById(id);
      if (!experiment) throw new Error('Experiment not found');
      return JSON.stringify(experiment, null, 2);
    } catch (error) {
      throw new Error(`Failed to export experiment: ${error}`);
    }
  }

  /**
   * Export report as JSON
   */
  static async exportReportAsJSON(id: string): Promise<string> {
    try {
      const report = await this.getReportById(id);
      if (!report) throw new Error('Report not found');
      return JSON.stringify(report, null, 2);
    } catch (error) {
      throw new Error(`Failed to export report: ${error}`);
    }
  }

  /**
   * Get experiment statistics
   */
  static async getExperimentStatistics() {
    try {
      const result = await BaseCrudService.getAll<Experiments>('experiments', [], {
        limit: 1000,
      });

      const stats = {
        total: result.totalCount,
        completed: result.items.filter((e) => e.status === 'completed').length,
        running: result.items.filter((e) => e.status === 'running').length,
        pending: result.items.filter((e) => e.status === 'pending').length,
        failed: result.items.filter((e) => e.status === 'failed').length,
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get experiment statistics: ${error}`);
    }
  }

  /**
   * Get report statistics
   */
  static async getReportStatistics() {
    try {
      const result = await BaseCrudService.getAll<ExperimentReports>('experimentreports', [], {
        limit: 1000,
      });

      const stats = {
        total: result.totalCount,
        averageVersion: result.items.length > 0
          ? result.items.reduce((sum, r) => sum + (r.reportVersion || 1), 0) / result.items.length
          : 0,
        latestReport: result.items.length > 0
          ? result.items.reduce((latest, current) => {
              const latestDate = new Date(latest.reportDate || 0).getTime();
              const currentDate = new Date(current.reportDate || 0).getTime();
              return currentDate > latestDate ? current : latest;
            })
          : null,
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get report statistics: ${error}`);
    }
  }
}

export default ExperimentCMSService;
