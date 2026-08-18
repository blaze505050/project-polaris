/**
 * Advanced Convergence Monitoring Service
 * Tracks multi-residual convergence and provides iteration predictions
 */

export interface ResidualData {
  continuity: number[];
  momentum: number[];
  energy: number[];
  turbulence: number[];
}

export interface FieldNorms {
  velocityL2: number[];
  pressureL2: number[];
  turbulenceL2: number[];
}

export interface ForceCoefficients {
  cl: number[];
  cd: number[];
  cm: number[];
}

export interface ConvergenceMetrics {
  residuals: ResidualData;
  fieldNorms: FieldNorms;
  forceCoefficients: ForceCoefficients;
  convergenceRate: number;
  estimatedIterationsToConvergence: number;
  qualityMetrics: {
    orthogonalQuality: number;
    skewness: number;
    aspectRatio: number;
  };
  isConverged: boolean;
  convergenceHistory: Array<{
    iteration: number;
    residuals: number;
    forces: number;
    timestamp: number;
  }>;
}

export interface ConvergenceReport {
  isConverged: boolean;
  convergenceRate: number;
  estimatedIterations: number;
  warnings: string[];
  recommendations: string[];
  metrics: ConvergenceMetrics;
}

export class ConvergenceMonitoringService {
  private static targetResidual = 1e-5;
  private static maxIterations = 10000;
  private static convergenceWindow = 50; // Check convergence over last N iterations

  /**
   * Initialize convergence metrics
   */
  static initializeMetrics(): ConvergenceMetrics {
    return {
      residuals: {
        continuity: [],
        momentum: [],
        energy: [],
        turbulence: [],
      },
      fieldNorms: {
        velocityL2: [],
        pressureL2: [],
        turbulenceL2: [],
      },
      forceCoefficients: {
        cl: [],
        cd: [],
        cm: [],
      },
      convergenceRate: 0,
      estimatedIterationsToConvergence: 0,
      qualityMetrics: {
        orthogonalQuality: 0.9,
        skewness: 0.1,
        aspectRatio: 10,
      },
      isConverged: false,
      convergenceHistory: [],
    };
  }

  /**
   * Update convergence metrics with new iteration data
   */
  static updateMetrics(
    metrics: ConvergenceMetrics,
    iteration: number,
    residuals: {
      continuity: number;
      momentum: number;
      energy: number;
      turbulence: number;
    },
    fieldNorms: {
      velocityL2: number;
      pressureL2: number;
      turbulenceL2: number;
    },
    forces: {
      cl: number;
      cd: number;
      cm: number;
    }
  ): ConvergenceMetrics {
    // Update residuals
    metrics.residuals.continuity.push(residuals.continuity);
    metrics.residuals.momentum.push(residuals.momentum);
    metrics.residuals.energy.push(residuals.energy);
    metrics.residuals.turbulence.push(residuals.turbulence);

    // Update field norms
    metrics.fieldNorms.velocityL2.push(fieldNorms.velocityL2);
    metrics.fieldNorms.pressureL2.push(fieldNorms.pressureL2);
    metrics.fieldNorms.turbulenceL2.push(fieldNorms.turbulenceL2);

    // Update force coefficients
    metrics.forceCoefficients.cl.push(forces.cl);
    metrics.forceCoefficients.cd.push(forces.cd);
    metrics.forceCoefficients.cm.push(forces.cm);

    // Calculate convergence rate
    metrics.convergenceRate = this.calculateConvergenceRate(metrics.residuals.continuity);

    // Estimate iterations to convergence
    metrics.estimatedIterationsToConvergence = this.estimateIterationsToConvergence(
      metrics.residuals.continuity,
      metrics.convergenceRate,
      this.targetResidual
    );

    // Check convergence
    metrics.isConverged = this.checkConvergence(metrics);

    // Add to history
    const avgResidual = (residuals.continuity + residuals.momentum + residuals.energy + residuals.turbulence) / 4;
    const avgForce = Math.sqrt(forces.cl ** 2 + forces.cd ** 2 + forces.cm ** 2);
    
    metrics.convergenceHistory.push({
      iteration,
      residuals: avgResidual,
      forces: avgForce,
      timestamp: Date.now(),
    });

    // Keep only last 1000 history entries
    if (metrics.convergenceHistory.length > 1000) {
      metrics.convergenceHistory = metrics.convergenceHistory.slice(-1000);
    }

    return metrics;
  }

  /**
   * Calculate convergence rate (slope in log space)
   */
  private static calculateConvergenceRate(residuals: number[]): number {
    if (residuals.length < 2) return 0;

    const recentResiduals = residuals.slice(-Math.min(50, residuals.length));
    if (recentResiduals.length < 2) return 0;

    // Linear regression in log space
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < recentResiduals.length; i++) {
      const x = i;
      const y = Math.log10(Math.max(recentResiduals[i], 1e-15));

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const n = recentResiduals.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    return slope;
  }

  /**
   * Estimate iterations to convergence
   */
  private static estimateIterationsToConvergence(
    residuals: number[],
    convergenceRate: number,
    targetResidual: number
  ): number {
    if (residuals.length === 0 || convergenceRate >= 0) {
      return this.maxIterations;
    }

    const currentResidual = residuals[residuals.length - 1];
    if (currentResidual <= targetResidual) {
      return 0;
    }

    // Exponential decay: residual = r0 * 10^(rate * n)
    // Solve for n: n = log10(target/r0) / rate
    const iterationsNeeded = Math.log10(targetResidual / currentResidual) / convergenceRate;

    return Math.max(0, Math.ceil(iterationsNeeded));
  }

  /**
   * Check if simulation has converged
   */
  private static checkConvergence(metrics: ConvergenceMetrics): boolean {
    const residuals = metrics.residuals.continuity;
    if (residuals.length < this.convergenceWindow) {
      return false;
    }

    // Check if all residuals are below target
    const recentResiduals = residuals.slice(-this.convergenceWindow);
    const allBelowTarget = recentResiduals.every(r => r < this.targetResidual);

    if (!allBelowTarget) {
      return false;
    }

    // Check if residuals are stable (not oscillating)
    const variance = this.calculateVariance(recentResiduals);
    const mean = recentResiduals.reduce((a, b) => a + b, 0) / recentResiduals.length;
    const coefficientOfVariation = variance / (mean || 1);

    return coefficientOfVariation < 0.1; // Less than 10% variation
  }

  /**
   * Calculate variance
   */
  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => (v - mean) ** 2);
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Generate comprehensive convergence report
   */
  static generateConvergenceReport(metrics: ConvergenceMetrics): ConvergenceReport {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check convergence rate
    if (metrics.convergenceRate > -0.01) {
      warnings.push('Convergence rate is very slow or diverging');
      recommendations.push('Try reducing time step or increasing mesh refinement');
    } else if (metrics.convergenceRate > -0.05) {
      warnings.push('Convergence rate is slower than expected');
      recommendations.push('Consider adjusting turbulence model or solver settings');
    }

    // Check estimated iterations
    if (metrics.estimatedIterationsToConvergence > this.maxIterations) {
      warnings.push('Estimated iterations exceed maximum - may not converge');
      recommendations.push('Review simulation setup and boundary conditions');
    }

    // Check residual oscillations
    if (metrics.residuals.continuity.length > 20) {
      const recentResiduals = metrics.residuals.continuity.slice(-20);
      const variance = this.calculateVariance(recentResiduals);
      const mean = recentResiduals.reduce((a, b) => a + b, 0) / recentResiduals.length;

      if (variance / (mean || 1) > 0.5) {
        warnings.push('Residuals are oscillating significantly');
        recommendations.push('Try increasing relaxation factors or using under-relaxation');
      }
    }

    // Check force coefficient stability
    if (metrics.forceCoefficients.cl.length > 20) {
      const recentCl = metrics.forceCoefficients.cl.slice(-20);
      const clVariance = this.calculateVariance(recentCl);
      const clMean = recentCl.reduce((a, b) => a + b, 0) / recentCl.length;

      if (clVariance / (Math.abs(clMean) || 1) > 0.1) {
        warnings.push('Lift coefficient is not stable');
        recommendations.push('Continue iterations or refine mesh in critical regions');
      }
    }

    // Check mesh quality
    if (metrics.qualityMetrics.aspectRatio > 1000) {
      warnings.push('Mesh has very high aspect ratio');
      recommendations.push('Regenerate mesh with better quality settings');
    }

    if (metrics.qualityMetrics.skewness > 0.85) {
      warnings.push('Mesh has high skewness');
      recommendations.push('Improve mesh quality to avoid convergence issues');
    }

    return {
      isConverged: metrics.isConverged,
      convergenceRate: metrics.convergenceRate,
      estimatedIterations: metrics.estimatedIterationsToConvergence,
      warnings,
      recommendations,
      metrics,
    };
  }

  /**
   * Get convergence statistics
   */
  static getConvergenceStatistics(metrics: ConvergenceMetrics): {
    residualReduction: number;
    averageResidual: number;
    minResidual: number;
    maxResidual: number;
    clStability: number;
    cdStability: number;
  } {
    const residuals = metrics.residuals.continuity;
    const cl = metrics.forceCoefficients.cl;
    const cd = metrics.forceCoefficients.cd;

    const residualReduction = residuals.length > 1
      ? (residuals[0] - residuals[residuals.length - 1]) / residuals[0]
      : 0;

    const averageResidual = residuals.length > 0
      ? residuals.reduce((a, b) => a + b, 0) / residuals.length
      : 0;

    const minResidual = residuals.length > 0 ? Math.min(...residuals) : 0;
    const maxResidual = residuals.length > 0 ? Math.max(...residuals) : 0;

    const clStability = cl.length > 20
      ? 1 - (this.calculateVariance(cl.slice(-20)) / (Math.abs(cl[cl.length - 1]) || 1))
      : 0;

    const cdStability = cd.length > 20
      ? 1 - (this.calculateVariance(cd.slice(-20)) / (Math.abs(cd[cd.length - 1]) || 1))
      : 0;

    return {
      residualReduction: Math.max(0, Math.min(1, residualReduction)),
      averageResidual,
      minResidual,
      maxResidual,
      clStability: Math.max(0, Math.min(1, clStability)),
      cdStability: Math.max(0, Math.min(1, cdStability)),
    };
  }

  /**
   * Detect convergence issues
   */
  static detectConvergenceIssues(metrics: ConvergenceMetrics): string[] {
    const issues: string[] = [];

    // Divergence detection
    if (metrics.residuals.continuity.length > 10) {
      const recent = metrics.residuals.continuity.slice(-10);
      const isIncreasing = recent.every((val, i, arr) => i === 0 || val >= arr[i - 1]);

      if (isIncreasing) {
        issues.push('Simulation appears to be diverging');
      }
    }

    // Stagnation detection
    if (metrics.residuals.continuity.length > 100) {
      const recent = metrics.residuals.continuity.slice(-100);
      const variance = this.calculateVariance(recent);
      const mean = recent.reduce((a, b) => a + b, 0) / recent.length;

      if (variance / (mean || 1) < 0.001) {
        issues.push('Convergence appears to be stagnating');
      }
    }

    // Oscillation detection
    if (metrics.residuals.continuity.length > 50) {
      const recent = metrics.residuals.continuity.slice(-50);
      let oscillations = 0;

      for (let i = 1; i < recent.length; i++) {
        if ((recent[i] - recent[i - 1]) * (recent[i - 1] - (recent[i - 2] || recent[i - 1])) < 0) {
          oscillations++;
        }
      }

      if (oscillations > recent.length * 0.5) {
        issues.push('Residuals are oscillating significantly');
      }
    }

    return issues;
  }
}

export default ConvergenceMonitoringService;
