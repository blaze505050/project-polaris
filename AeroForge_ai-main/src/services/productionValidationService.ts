/**
 * Production Validation Service
 * Real-time validation for all ASTROLAB simulations
 * Ensures scientific accuracy and production reliability
 */

export interface ValidationReport {
  timestamp: Date;
  simulationType: string;
  isValid: boolean;
  accuracy: number; // 0-100%
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recommendations: string[];
  benchmarkComparison: BenchmarkResult[];
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  affectedParameter: string;
  suggestedFix: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  severity: 'low' | 'medium';
  affectedParameter: string;
}

export interface BenchmarkResult {
  parameter: string;
  simulated: number;
  benchmark: number;
  deviation: number; // percentage
  status: 'excellent' | 'good' | 'acceptable' | 'poor';
  tolerance: number;
}

/**
 * Validates orbital mechanics calculations
 */
export function validateOrbitalMechanics(params: {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  centralBodyMass: number;
  centralBodyRadius: number;
}): ValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const recommendations: string[] = [];
  const benchmarkComparison: BenchmarkResult[] = [];

  // Validate semi-major axis
  if (params.semiMajorAxis <= params.centralBodyRadius) {
    errors.push({
      code: 'INVALID_SMA',
      message: 'Semi-major axis must be greater than central body radius',
      severity: 'critical',
      affectedParameter: 'semiMajorAxis',
      suggestedFix: `Increase semi-major axis to at least ${params.centralBodyRadius * 1.1} meters`,
    });
  }

  // Validate eccentricity
  if (params.eccentricity < 0 || params.eccentricity >= 1) {
    errors.push({
      code: 'INVALID_ECCENTRICITY',
      message: 'Eccentricity must be between 0 and 1 for bound orbits',
      severity: 'critical',
      affectedParameter: 'eccentricity',
      suggestedFix: 'Set eccentricity between 0 (circular) and 0.999 (highly elliptical)',
    });
  }

  // Validate inclination
  if (params.inclination < 0 || params.inclination > 180) {
    errors.push({
      code: 'INVALID_INCLINATION',
      message: 'Inclination must be between 0° and 180°',
      severity: 'critical',
      affectedParameter: 'inclination',
      suggestedFix: `Set inclination between 0 and 180 degrees`,
    });
  }

  // Validate central body parameters
  if (params.centralBodyMass <= 0) {
    errors.push({
      code: 'INVALID_MASS',
      message: 'Central body mass must be positive',
      severity: 'critical',
      affectedParameter: 'centralBodyMass',
      suggestedFix: 'Use positive mass value',
    });
  }

  if (params.centralBodyRadius <= 0) {
    errors.push({
      code: 'INVALID_RADIUS',
      message: 'Central body radius must be positive',
      severity: 'critical',
      affectedParameter: 'centralBodyRadius',
      suggestedFix: 'Use positive radius value',
    });
  }

  // Calculate periapsis and apoapsis
  const periapsis = params.semiMajorAxis * (1 - params.eccentricity);
  const apoapsis = params.semiMajorAxis * (1 + params.eccentricity);

  // Check for collision with central body
  if (periapsis < params.centralBodyRadius) {
    warnings.push({
      code: 'COLLISION_RISK',
      message: 'Periapsis is below central body surface - orbit will collide',
      severity: 'medium',
      affectedParameter: 'periapsis',
    });
  }

  // Benchmark comparisons
  benchmarkComparison.push({
    parameter: 'Eccentricity',
    simulated: params.eccentricity,
    benchmark: 0.2, // Typical for most orbits
    deviation: Math.abs((params.eccentricity - 0.2) / 0.2) * 100,
    status: params.eccentricity < 0.3 ? 'good' : 'acceptable',
    tolerance: 50,
  });

  benchmarkComparison.push({
    parameter: 'Inclination',
    simulated: params.inclination,
    benchmark: 51.6, // ISS inclination
    deviation: Math.abs((params.inclination - 51.6) / 51.6) * 100,
    status: Math.abs(params.inclination - 51.6) < 20 ? 'good' : 'acceptable',
    tolerance: 100,
  });

  // Generate recommendations
  if (params.eccentricity > 0.8) {
    recommendations.push('High eccentricity detected - verify this is intentional for your mission');
    recommendations.push('Consider using Kepler equation solver for accurate position calculations');
  }

  if (params.inclination > 60) {
    recommendations.push('High inclination orbit - ensure launch site can support this inclination');
  }

  const isValid = errors.length === 0;
  const accuracy = 100 - (errors.length * 20 + warnings.length * 5);

  return {
    timestamp: new Date(),
    simulationType: 'Orbital Mechanics',
    isValid,
    accuracy: Math.max(0, accuracy),
    errors,
    warnings,
    recommendations,
    benchmarkComparison,
  };
}

/**
 * Validates aerodynamic calculations
 */
export function validateAerodynamics(params: {
  liftCoefficient: number;
  dragCoefficient: number;
  reynoldsNumber: number;
  machNumber: number;
  angleOfAttack: number;
}): ValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const recommendations: string[] = [];
  const benchmarkComparison: BenchmarkResult[] = [];

  // Validate Reynolds number
  if (params.reynoldsNumber <= 0) {
    errors.push({
      code: 'INVALID_RE',
      message: 'Reynolds number must be positive',
      severity: 'critical',
      affectedParameter: 'reynoldsNumber',
      suggestedFix: 'Use positive Reynolds number',
    });
  }

  if (params.reynoldsNumber < 1e4) {
    warnings.push({
      code: 'LOW_RE',
      message: 'Very low Reynolds number - results may not represent full-scale flight',
      severity: 'medium',
      affectedParameter: 'reynoldsNumber',
    });
  }

  // Validate Mach number
  if (params.machNumber < 0) {
    errors.push({
      code: 'INVALID_MACH',
      message: 'Mach number cannot be negative',
      severity: 'critical',
      affectedParameter: 'machNumber',
      suggestedFix: 'Use positive Mach number',
    });
  }

  if (params.machNumber > 0.85 && params.machNumber < 1.2) {
    warnings.push({
      code: 'TRANSONIC_FLOW',
      message: 'Transonic flow regime - compressibility effects are significant',
      severity: 'medium',
      affectedParameter: 'machNumber',
    });
    recommendations.push('Use transonic CFD solver for improved accuracy');
  }

  // Validate lift coefficient
  if (Math.abs(params.liftCoefficient) > 3) {
    warnings.push({
      code: 'HIGH_CL',
      message: 'Lift coefficient is unusually high - verify stall conditions',
      severity: 'medium',
      affectedParameter: 'liftCoefficient',
    });
  }

  // Validate drag coefficient
  if (params.dragCoefficient < 0) {
    errors.push({
      code: 'NEGATIVE_CD',
      message: 'Drag coefficient cannot be negative',
      severity: 'critical',
      affectedParameter: 'dragCoefficient',
      suggestedFix: 'Drag coefficient must be positive',
    });
  }

  if (params.dragCoefficient > 2) {
    warnings.push({
      code: 'HIGH_CD',
      message: 'Drag coefficient is very high - verify geometry and flow conditions',
      severity: 'medium',
      affectedParameter: 'dragCoefficient',
    });
  }

  // Validate angle of attack
  if (params.angleOfAttack < -180 || params.angleOfAttack > 180) {
    errors.push({
      code: 'INVALID_AOA',
      message: 'Angle of attack must be between -180° and 180°',
      severity: 'high',
      affectedParameter: 'angleOfAttack',
      suggestedFix: 'Normalize angle of attack to [-180, 180] range',
    });
  }

  // Benchmark comparisons
  benchmarkComparison.push({
    parameter: 'Lift Coefficient',
    simulated: params.liftCoefficient,
    benchmark: 0.5,
    deviation: Math.abs((params.liftCoefficient - 0.5) / 0.5) * 100,
    status: Math.abs(params.liftCoefficient - 0.5) < 0.3 ? 'good' : 'acceptable',
    tolerance: 50,
  });

  benchmarkComparison.push({
    parameter: 'Drag Coefficient',
    simulated: params.dragCoefficient,
    benchmark: 0.025,
    deviation: Math.abs((params.dragCoefficient - 0.025) / 0.025) * 100,
    status: Math.abs(params.dragCoefficient - 0.025) < 0.01 ? 'excellent' : 'good',
    tolerance: 40,
  });

  const isValid = errors.length === 0;
  const accuracy = 100 - (errors.length * 20 + warnings.length * 5);

  return {
    timestamp: new Date(),
    simulationType: 'Aerodynamics',
    isValid,
    accuracy: Math.max(0, accuracy),
    errors,
    warnings,
    recommendations,
    benchmarkComparison,
  };
}

/**
 * Validates stellar evolution calculations
 */
export function validateStellarEvolution(params: {
  mass: number; // Solar masses
  age: number; // Years
  luminosity: number; // Solar luminosities
  temperature: number; // Kelvin
}): ValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const recommendations: string[] = [];
  const benchmarkComparison: BenchmarkResult[] = [];

  // Validate mass
  if (params.mass <= 0.08) {
    warnings.push({
      code: 'BROWN_DWARF',
      message: 'Mass below hydrogen burning limit - object is a brown dwarf',
      severity: 'low',
      affectedParameter: 'mass',
    });
  }

  if (params.mass > 150) {
    warnings.push({
      code: 'EXTREME_MASS',
      message: 'Mass exceeds typical stellar limit - verify this is intentional',
      severity: 'medium',
      affectedParameter: 'mass',
    });
  }

  // Validate age
  if (params.age < 0) {
    errors.push({
      code: 'NEGATIVE_AGE',
      message: 'Age cannot be negative',
      severity: 'critical',
      affectedParameter: 'age',
      suggestedFix: 'Use positive age value',
    });
  }

  if (params.age > 13.8e9) {
    errors.push({
      code: 'AGE_EXCEEDS_UNIVERSE',
      message: 'Age exceeds age of universe',
      severity: 'critical',
      affectedParameter: 'age',
      suggestedFix: 'Use age less than 13.8 billion years',
    });
  }

  // Validate temperature
  if (params.temperature < 2000) {
    warnings.push({
      code: 'LOW_TEMPERATURE',
      message: 'Temperature is very low - verify this represents a cool star',
      severity: 'low',
      affectedParameter: 'temperature',
    });
  }

  if (params.temperature > 50000) {
    warnings.push({
      code: 'HIGH_TEMPERATURE',
      message: 'Temperature is very high - verify this represents a hot star',
      severity: 'low',
      affectedParameter: 'temperature',
    });
  }

  // Validate luminosity
  if (params.luminosity < 0) {
    errors.push({
      code: 'NEGATIVE_LUMINOSITY',
      message: 'Luminosity cannot be negative',
      severity: 'critical',
      affectedParameter: 'luminosity',
      suggestedFix: 'Use positive luminosity value',
    });
  }

  // Benchmark comparisons (Sun reference)
  benchmarkComparison.push({
    parameter: 'Mass',
    simulated: params.mass,
    benchmark: 1.0, // Solar mass
    deviation: Math.abs((params.mass - 1.0) / 1.0) * 100,
    status: Math.abs(params.mass - 1.0) < 0.5 ? 'good' : 'acceptable',
    tolerance: 100,
  });

  benchmarkComparison.push({
    parameter: 'Temperature',
    simulated: params.temperature,
    benchmark: 5778, // Solar temperature
    deviation: Math.abs((params.temperature - 5778) / 5778) * 100,
    status: Math.abs(params.temperature - 5778) < 1000 ? 'good' : 'acceptable',
    tolerance: 30,
  });

  // Generate recommendations
  if (params.mass < 0.5) {
    recommendations.push('Low-mass star detected - verify main sequence lifetime calculations');
  }

  if (params.age > 10e9 && params.mass > 1.5) {
    recommendations.push('High-mass star with advanced age - verify evolutionary stage');
  }

  const isValid = errors.length === 0;
  const accuracy = 100 - (errors.length * 20 + warnings.length * 5);

  return {
    timestamp: new Date(),
    simulationType: 'Stellar Evolution',
    isValid,
    accuracy: Math.max(0, accuracy),
    errors,
    warnings,
    recommendations,
    benchmarkComparison,
  };
}

/**
 * Validates cosmological calculations
 */
export function validateCosmology(params: {
  redshift: number;
  hubbleConstant: number; // km/s/Mpc
  omegaMatter: number;
  omegaDarkEnergy: number;
}): ValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const recommendations: string[] = [];
  const benchmarkComparison: BenchmarkResult[] = [];

  // Validate redshift
  if (params.redshift < 0) {
    errors.push({
      code: 'NEGATIVE_REDSHIFT',
      message: 'Redshift cannot be negative for distant objects',
      severity: 'high',
      affectedParameter: 'redshift',
      suggestedFix: 'Use positive redshift value',
    });
  }

  if (params.redshift > 20) {
    warnings.push({
      code: 'EXTREME_REDSHIFT',
      message: 'Extreme redshift detected - verify this represents early universe',
      severity: 'low',
      affectedParameter: 'redshift',
    });
  }

  // Validate Hubble constant
  if (params.hubbleConstant < 50 || params.hubbleConstant > 80) {
    warnings.push({
      code: 'HUBBLE_TENSION',
      message: 'Hubble constant outside current consensus range (67-74 km/s/Mpc)',
      severity: 'medium',
      affectedParameter: 'hubbleConstant',
    });
  }

  // Validate density parameters
  const totalOmega = params.omegaMatter + params.omegaDarkEnergy;
  if (Math.abs(totalOmega - 1.0) > 0.1) {
    warnings.push({
      code: 'DENSITY_MISMATCH',
      message: `Total density parameter (${totalOmega.toFixed(2)}) deviates from 1.0`,
      severity: 'medium',
      affectedParameter: 'omegaMatter/omegaDarkEnergy',
    });
  }

  if (params.omegaMatter < 0 || params.omegaMatter > 1) {
    errors.push({
      code: 'INVALID_OMEGA_M',
      message: 'Matter density parameter must be between 0 and 1',
      severity: 'critical',
      affectedParameter: 'omegaMatter',
      suggestedFix: 'Use value between 0 and 1',
    });
  }

  if (params.omegaDarkEnergy < 0 || params.omegaDarkEnergy > 1) {
    errors.push({
      code: 'INVALID_OMEGA_DE',
      message: 'Dark energy density parameter must be between 0 and 1',
      severity: 'critical',
      affectedParameter: 'omegaDarkEnergy',
      suggestedFix: 'Use value between 0 and 1',
    });
  }

  // Benchmark comparisons (Planck 2018)
  benchmarkComparison.push({
    parameter: 'Hubble Constant',
    simulated: params.hubbleConstant,
    benchmark: 67.4,
    deviation: Math.abs((params.hubbleConstant - 67.4) / 67.4) * 100,
    status: Math.abs(params.hubbleConstant - 67.4) < 5 ? 'good' : 'acceptable',
    tolerance: 10,
  });

  benchmarkComparison.push({
    parameter: 'Matter Density',
    simulated: params.omegaMatter,
    benchmark: 0.315,
    deviation: Math.abs((params.omegaMatter - 0.315) / 0.315) * 100,
    status: Math.abs(params.omegaMatter - 0.315) < 0.05 ? 'good' : 'acceptable',
    tolerance: 20,
  });

  const isValid = errors.length === 0;
  const accuracy = 100 - (errors.length * 20 + warnings.length * 5);

  return {
    timestamp: new Date(),
    simulationType: 'Cosmology',
    isValid,
    accuracy: Math.max(0, accuracy),
    errors,
    warnings,
    recommendations,
    benchmarkComparison,
  };
}

export const ProductionValidationService = {
  validateOrbitalMechanics,
  validateAerodynamics,
  validateStellarEvolution,
  validateCosmology,
};
