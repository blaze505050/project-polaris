/**
 * Physics Validation Service
 * Validates simulation results against real-world data and industry standards
 */

export interface ValidationResult {
  isValid: boolean;
  accuracy: number; // 0-100%
  warnings: string[];
  errors: string[];
  recommendations: string[];
  comparisonWithRealData: {
    parameter: string;
    simulated: number;
    realWorld: number;
    deviation: number; // percentage
    status: 'excellent' | 'good' | 'acceptable' | 'poor';
  }[];
}

export interface RealWorldBenchmark {
  parameter: string;
  value: number;
  tolerance: number; // ±%
  source: string;
}

class ValidationService {
  // Real-world benchmarks for common aircraft
  private benchmarks: Map<string, RealWorldBenchmark[]> = new Map([
    ['cessna-172', [
      { parameter: 'dragCoefficient', value: 0.027, tolerance: 5, source: 'FAA Data' },
      { parameter: 'liftCoefficient', value: 0.5, tolerance: 10, source: 'Wind Tunnel' },
      { parameter: 'stallAngle', value: 16, tolerance: 2, source: 'Flight Test' },
      { parameter: 'maxLiftCoefficient', value: 1.4, tolerance: 8, source: 'Wind Tunnel' },
    ]],
    ['boeing-747', [
      { parameter: 'dragCoefficient', value: 0.018, tolerance: 5, source: 'CFD Validation' },
      { parameter: 'liftCoefficient', value: 0.45, tolerance: 8, source: 'Flight Data' },
      { parameter: 'stallAngle', value: 15, tolerance: 2, source: 'Flight Test' },
      { parameter: 'maxLiftCoefficient', value: 1.8, tolerance: 10, source: 'Wind Tunnel' },
    ]],
    ['airbus-a380', [
      { parameter: 'dragCoefficient', value: 0.019, tolerance: 5, source: 'CFD Validation' },
      { parameter: 'liftCoefficient', value: 0.48, tolerance: 8, source: 'Flight Data' },
      { parameter: 'stallAngle', value: 15.5, tolerance: 2, source: 'Flight Test' },
      { parameter: 'maxLiftCoefficient', value: 1.9, tolerance: 10, source: 'Wind Tunnel' },
    ]],
  ]);

  /**
   * Validate aerodynamic coefficients against real-world data
   */
  validateAerodynamics(
    simulatedData: {
      dragCoefficient: number;
      liftCoefficient: number;
      stallAngle?: number;
      maxLiftCoefficient?: number;
      reynoldsNumber: number;
      machNumber: number;
    },
    aircraftType: string = 'generic'
  ): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const recommendations: string[] = [];
    const comparisonWithRealData: ValidationResult['comparisonWithRealData'] = [];

    // Get benchmarks
    const benchmarks = this.benchmarks.get(aircraftType) || this.getGenericBenchmarks();

    let totalDeviation = 0;
    let validParameters = 0;

    // Validate each parameter
    for (const benchmark of benchmarks) {
      const simulated = simulatedData[benchmark.parameter as keyof typeof simulatedData];
      
      if (simulated === undefined) continue;

      const deviation = Math.abs((simulated - benchmark.value) / benchmark.value) * 100;
      totalDeviation += deviation;
      validParameters++;

      let status: 'excellent' | 'good' | 'acceptable' | 'poor';
      if (deviation <= benchmark.tolerance * 0.5) {
        status = 'excellent';
      } else if (deviation <= benchmark.tolerance) {
        status = 'good';
      } else if (deviation <= benchmark.tolerance * 1.5) {
        status = 'acceptable';
      } else {
        status = 'poor';
      }

      comparisonWithRealData.push({
        parameter: benchmark.parameter,
        simulated: Number(simulated.toFixed(4)),
        realWorld: benchmark.value,
        deviation: Number(deviation.toFixed(2)),
        status,
      });

      // Generate warnings/errors
      if (status === 'poor') {
        errors.push(
          `${benchmark.parameter} deviation (${deviation.toFixed(1)}%) exceeds tolerance (${benchmark.tolerance}%)`
        );
      } else if (status === 'acceptable') {
        warnings.push(
          `${benchmark.parameter} is within acceptable range but higher than typical (${deviation.toFixed(1)}%)`
        );
      }
    }

    // Validate Reynolds number range
    if (simulatedData.reynoldsNumber < 1e4) {
      warnings.push('Reynolds number is very low - results may not be representative of full-scale flight');
    } else if (simulatedData.reynoldsNumber > 1e8) {
      warnings.push('Reynolds number is extremely high - ensure mesh resolution is adequate');
    }

    // Validate Mach number range
    if (simulatedData.machNumber > 0.85 && simulatedData.machNumber < 1.2) {
      warnings.push('Transonic flow regime detected - compressibility effects are significant');
      recommendations.push('Consider using transonic CFD solver for improved accuracy');
    }

    // Generate recommendations
    if (errors.length > 0) {
      recommendations.push('Review mesh quality and refinement in critical regions');
      recommendations.push('Verify boundary conditions match experimental setup');
      recommendations.push('Consider increasing number of iterations for better convergence');
    }

    if (warnings.length > 0) {
      recommendations.push('Validate results against multiple data sources');
      recommendations.push('Perform sensitivity analysis on key parameters');
    }

    const accuracy = validParameters > 0 ? Math.max(0, 100 - (totalDeviation / validParameters)) : 0;

    return {
      isValid: errors.length === 0,
      accuracy: Math.max(0, accuracy),
      warnings,
      errors,
      recommendations,
      comparisonWithRealData,
    };
  }

  /**
   * Validate structural analysis results
   */
  validateStructural(
    simulatedData: {
      maxStress: number;
      maxDisplacement: number;
      safetyFactor: number;
      naturalFrequency: number;
    },
    materialYieldStrength: number,
    allowableDisplacement: number
  ): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const recommendations: string[] = [];
    const comparisonWithRealData: ValidationResult['comparisonWithRealData'] = [];

    // Check stress levels
    const stressRatio = simulatedData.maxStress / materialYieldStrength;
    if (stressRatio > 1.0) {
      errors.push(`Maximum stress (${simulatedData.maxStress.toFixed(0)} Pa) exceeds yield strength`);
    } else if (stressRatio > 0.8) {
      warnings.push(`Stress level is high (${(stressRatio * 100).toFixed(1)}% of yield strength)`);
    }

    // Check displacement
    const displacementRatio = simulatedData.maxDisplacement / allowableDisplacement;
    if (displacementRatio > 1.0) {
      errors.push(`Maximum displacement exceeds allowable limit`);
    } else if (displacementRatio > 0.8) {
      warnings.push(`Displacement is close to limit (${(displacementRatio * 100).toFixed(1)}%)`);
    }

    // Check safety factor
    if (simulatedData.safetyFactor < 1.5) {
      warnings.push(`Safety factor (${simulatedData.safetyFactor.toFixed(2)}) is below recommended minimum of 1.5`);
    }

    // Check natural frequency
    if (simulatedData.naturalFrequency < 10) {
      warnings.push('Low natural frequency may indicate potential resonance issues');
      recommendations.push('Perform flutter analysis to check for aeroelastic instability');
    }

    comparisonWithRealData.push({
      parameter: 'Stress Ratio',
      simulated: stressRatio,
      realWorld: 0.7,
      deviation: Math.abs((stressRatio - 0.7) / 0.7) * 100,
      status: stressRatio <= 0.7 ? 'good' : 'acceptable',
    });

    const accuracy = Math.max(0, 100 - Math.abs(stressRatio - 0.7) * 100);

    return {
      isValid: errors.length === 0,
      accuracy,
      warnings,
      errors,
      recommendations,
      comparisonWithRealData,
    };
  }

  /**
   * Validate thermal analysis results
   */
  validateThermal(
    simulatedData: {
      maxTemperature: number;
      minTemperature: number;
      temperatureGradient: number;
      heatFlux: number;
    },
    materialMeltingPoint: number,
    allowableTemperature: number
  ): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const recommendations: string[] = [];
    const comparisonWithRealData: ValidationResult['comparisonWithRealData'] = [];

    // Check temperature limits
    if (simulatedData.maxTemperature > materialMeltingPoint) {
      errors.push(`Maximum temperature exceeds material melting point`);
    } else if (simulatedData.maxTemperature > allowableTemperature) {
      errors.push(`Maximum temperature exceeds allowable limit`);
    } else if (simulatedData.maxTemperature > allowableTemperature * 0.9) {
      warnings.push(`Temperature is close to allowable limit`);
    }

    // Check temperature gradient
    if (simulatedData.temperatureGradient > 1000) {
      warnings.push(`High temperature gradient (${simulatedData.temperatureGradient.toFixed(0)} K/m) may cause thermal stress`);
      recommendations.push('Consider thermal stress analysis');
    }

    // Check heat flux
    if (simulatedData.heatFlux > 1e6) {
      warnings.push(`High heat flux detected - verify cooling system capacity`);
    }

    const tempRatio = simulatedData.maxTemperature / allowableTemperature;
    comparisonWithRealData.push({
      parameter: 'Temperature Ratio',
      simulated: tempRatio,
      realWorld: 0.85,
      deviation: Math.abs((tempRatio - 0.85) / 0.85) * 100,
      status: tempRatio <= 0.85 ? 'good' : 'acceptable',
    });

    const accuracy = Math.max(0, 100 - Math.abs(tempRatio - 0.85) * 100);

    return {
      isValid: errors.length === 0,
      accuracy,
      warnings,
      errors,
      recommendations,
      comparisonWithRealData,
    };
  }

  /**
   * Get generic benchmarks for validation
   */
  private getGenericBenchmarks(): RealWorldBenchmark[] {
    return [
      { parameter: 'dragCoefficient', value: 0.025, tolerance: 10, source: 'Generic Aircraft' },
      { parameter: 'liftCoefficient', value: 0.5, tolerance: 15, source: 'Generic Aircraft' },
      { parameter: 'stallAngle', value: 15, tolerance: 3, source: 'Generic Aircraft' },
      { parameter: 'maxLiftCoefficient', value: 1.5, tolerance: 15, source: 'Generic Aircraft' },
    ];
  }

  /**
   * Register custom aircraft benchmarks
   */
  registerAircraftBenchmarks(aircraftType: string, benchmarks: RealWorldBenchmark[]): void {
    this.benchmarks.set(aircraftType, benchmarks);
  }

  /**
   * Get all registered aircraft types
   */
  getRegisteredAircraftTypes(): string[] {
    return Array.from(this.benchmarks.keys());
  }
}

export const validationService = new ValidationService();
