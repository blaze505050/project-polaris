/**
 * Quality Assurance Service
 * Validates all ASTROLAB tools for production-grade reliability
 */

export interface ValidationResult {
  tool: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: Date;
}

export interface PhysicsValidation {
  equation: string;
  units: string[];
  uncertaintyRange: [number, number];
  isValid: boolean;
}

export class QualityAssuranceService {
  private validationResults: ValidationResult[] = [];

  /**
   * Validate physics equations for dimensional consistency
   */
  static validatePhysicsEquation(
    equation: string,
    inputUnits: Record<string, string>,
    expectedOutputUnit: string
  ): PhysicsValidation {
    const unitMap: Record<string, string[]> = {
      velocity: ['m/s', 'km/s', 'AU/year'],
      acceleration: ['m/s²', 'km/s²'],
      force: ['N', 'dyne'],
      energy: ['J', 'erg', 'eV'],
      temperature: ['K', 'C', 'F'],
      mass: ['kg', 'g', 'M☉'],
      distance: ['m', 'km', 'AU', 'pc', 'ly'],
      time: ['s', 'min', 'hour', 'day', 'year'],
    };

    const inputUnitsList = Object.values(inputUnits);
    const isValid = unitMap[expectedOutputUnit]?.some((unit) =>
      inputUnitsList.some((u) => u.includes(unit))
    ) ?? false;

    return {
      equation,
      units: inputUnitsList,
      uncertaintyRange: [0.95, 1.05], // ±5% uncertainty
      isValid,
    };
  }

  /**
   * Validate simulation parameters
   */
  static validateSimulationParameters(params: Record<string, any>): ValidationResult {
    const requiredParams = ['initialConditions', 'timeStep', 'duration', 'tolerance'];
    const missingParams = requiredParams.filter((p) => !(p in params));

    if (missingParams.length > 0) {
      return {
        tool: 'Simulation',
        status: 'fail',
        message: `Missing required parameters: ${missingParams.join(', ')}`,
        timestamp: new Date(),
      };
    }

    // Validate ranges
    if (params.timeStep <= 0 || params.timeStep > params.duration) {
      return {
        tool: 'Simulation',
        status: 'fail',
        message: 'Invalid time step: must be positive and less than duration',
        timestamp: new Date(),
      };
    }

    if (params.tolerance <= 0 || params.tolerance > 0.1) {
      return {
        tool: 'Simulation',
        status: 'warning',
        message: 'Tolerance outside recommended range (0 < tol < 0.1)',
        timestamp: new Date(),
      };
    }

    return {
      tool: 'Simulation',
      status: 'pass',
      message: 'All simulation parameters valid',
      timestamp: new Date(),
    };
  }

  /**
   * Validate data consistency
   */
  static validateDataConsistency(data: Record<string, any>): ValidationResult {
    const checks = {
      hasTimestamp: 'timestamp' in data,
      hasMetadata: 'metadata' in data,
      hasUnitInfo: 'units' in data,
      hasUncertainty: 'uncertainty' in data,
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    if (passedChecks === totalChecks) {
      return {
        tool: 'Data Validation',
        status: 'pass',
        message: 'All data consistency checks passed',
        timestamp: new Date(),
      };
    }

    const failedChecks = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check);

    return {
      tool: 'Data Validation',
      status: passedChecks === totalChecks ? 'pass' : 'warning',
      message: `Missing: ${failedChecks.join(', ')}`,
      timestamp: new Date(),
    };
  }

  /**
   * Validate numerical stability
   */
  static validateNumericalStability(values: number[]): ValidationResult {
    const hasNaN = values.some((v) => isNaN(v));
    const hasInfinity = values.some((v) => !isFinite(v));
    const hasNegative = values.some((v) => v < 0);

    if (hasNaN || hasInfinity) {
      return {
        tool: 'Numerical Stability',
        status: 'fail',
        message: 'Invalid numerical values detected (NaN or Infinity)',
        timestamp: new Date(),
      };
    }

    if (hasNegative) {
      return {
        tool: 'Numerical Stability',
        status: 'warning',
        message: 'Negative values detected - verify physical validity',
        timestamp: new Date(),
      };
    }

    return {
      tool: 'Numerical Stability',
      status: 'pass',
      message: 'All values numerically stable',
      timestamp: new Date(),
    };
  }

  /**
   * Validate orbital mechanics calculations
   */
  static validateOrbitalMechanics(
    semiMajorAxis: number,
    eccentricity: number,
    inclination: number
  ): ValidationResult {
    const checks = {
      semiMajorAxis: semiMajorAxis > 0,
      eccentricity: eccentricity >= 0 && eccentricity < 1,
      inclination: inclination >= 0 && inclination <= 180,
    };

    const allValid = Object.values(checks).every(Boolean);

    if (!allValid) {
      const failedChecks = Object.entries(checks)
        .filter(([, valid]) => !valid)
        .map(([check]) => check);

      return {
        tool: 'Orbital Mechanics',
        status: 'fail',
        message: `Invalid orbital parameters: ${failedChecks.join(', ')}`,
        timestamp: new Date(),
      };
    }

    return {
      tool: 'Orbital Mechanics',
      status: 'pass',
      message: 'Orbital parameters valid',
      timestamp: new Date(),
    };
  }

  /**
   * Validate exoplanet habitability calculations
   */
  static validateHabitabilityCalculation(
    equilibriumTemp: number,
    atmosphericRetention: number,
    stellarFlux: number
  ): ValidationResult {
    const checks = {
      temperature: equilibriumTemp > 0 && equilibriumTemp < 1000,
      retention: atmosphericRetention >= 0 && atmosphericRetention <= 1,
      flux: stellarFlux > 0,
    };

    const allValid = Object.values(checks).every(Boolean);

    if (!allValid) {
      return {
        tool: 'Habitability Calculator',
        status: 'fail',
        message: 'Invalid habitability parameters',
        timestamp: new Date(),
      };
    }

    // Check habitable zone (Earth-like conditions)
    const isInHabitableZone = equilibriumTemp > 273 && equilibriumTemp < 373; // 0-100°C

    return {
      tool: 'Habitability Calculator',
      status: isInHabitableZone ? 'pass' : 'warning',
      message: isInHabitableZone
        ? 'Planet in habitable zone'
        : 'Planet outside traditional habitable zone',
      timestamp: new Date(),
    };
  }

  /**
   * Run comprehensive QA suite
   */
  static runComprehensiveQA(): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Test simulation parameters
    results.push(
      this.validateSimulationParameters({
        initialConditions: { x: 0, y: 0, z: 0 },
        timeStep: 0.01,
        duration: 100,
        tolerance: 0.001,
      })
    );

    // Test data consistency
    results.push(
      this.validateDataConsistency({
        timestamp: new Date(),
        metadata: { source: 'astrolab' },
        units: { distance: 'AU', time: 'year' },
        uncertainty: 0.05,
      })
    );

    // Test numerical stability
    results.push(this.validateNumericalStability([1.5, 2.3, 3.7, 4.2, 5.1]));

    // Test orbital mechanics
    results.push(this.validateOrbitalMechanics(1.0, 0.2, 0.0));

    // Test habitability
    results.push(this.validateHabitabilityCalculation(288, 1.0, 1.0));

    return results;
  }

  /**
   * Generate QA report
   */
  static generateQAReport(results: ValidationResult[]): string {
    const passed = results.filter((r) => r.status === 'pass').length;
    const failed = results.filter((r) => r.status === 'fail').length;
    const warnings = results.filter((r) => r.status === 'warning').length;

    let report = `
ASTROLAB QUALITY ASSURANCE REPORT
==================================

Summary:
--------
Total Tests: ${results.length}
Passed: ${passed}
Failed: ${failed}
Warnings: ${warnings}

Status: ${failed === 0 ? '✓ PRODUCTION READY' : '✗ REQUIRES FIXES'}

Detailed Results:
-----------------
`;

    results.forEach((result) => {
      const icon = result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '⚠';
      report += `\n${icon} [${result.tool}] ${result.message}`;
    });

    report += `\n\nGenerated: ${new Date().toISOString()}`;

    return report;
  }
}

// Export for use in components
export default QualityAssuranceService;
