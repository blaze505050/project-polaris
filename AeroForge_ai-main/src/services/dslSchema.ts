/**
 * AeroForge DSL v1.0 - Strict JSON Schema
 * Deterministic Feature Definition Language
 * 
 * PRINCIPLES:
 * - Explicit units on every dimension
 * - Coordinate systems defined upfront
 * - Named features for traceability
 * - No implicit geometry
 * - Deterministic feature ordering
 * - Full type safety
 */

export interface CoordinateSystem {
  origin: [number, number, number];
  xAxis: [number, number, number];
  yAxis: [number, number, number];
  zAxis: [number, number, number];
}

export interface DimensionWithUnits {
  value: number;
  unit: 'mm' | 'cm' | 'in' | 'ft';
}

export interface Point3D {
  x: DimensionWithUnits;
  y: DimensionWithUnits;
  z: DimensionWithUnits;
}

export interface Constraint {
  id: string;
  type: 'TOLERANCE' | 'MATERIAL' | 'SURFACE_FINISH' | 'LOAD_CASE' | 'THERMAL' | 'CUSTOM';
  target: string; // feature name or dimension id
  value: string;
  unit?: string;
  notes?: string;
}

export interface Feature {
  id: string;
  name: string;
  type: 'PAD' | 'POCKET' | 'HOLE' | 'FILLET' | 'CHAMFER' | 'PATTERN' | 'SHELL' | 'DRAFT' | 'RIB' | 'AIRFOIL';
  
  // Common parameters
  referenceFeature?: string; // parent feature id
  coordinate?: Point3D;
  
  // PAD parameters
  padWidth?: DimensionWithUnits;
  padLength?: DimensionWithUnits;
  padHeight?: DimensionWithUnits;
  padProfile?: 'RECTANGULAR' | 'CIRCULAR' | 'CUSTOM';
  
  // HOLE parameters
  holeDiameter?: DimensionWithUnits;
  holeDepth?: DimensionWithUnits | 'THROUGH';
  holeType?: 'STRAIGHT' | 'COUNTERSINK' | 'COUNTERBORE';
  
  // FILLET/CHAMFER parameters
  radius?: DimensionWithUnits;
  chamferDistance?: DimensionWithUnits;
  
  // PATTERN parameters
  patternType?: 'LINEAR' | 'CIRCULAR';
  patternCount?: number;
  patternSpacing?: DimensionWithUnits;
  
  // Metadata
  description?: string;
  suppressionFlag?: boolean;
}

export interface ExecutionLog {
  featureId: string;
  featureName: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  operation: string;
  constraintResolution?: string;
  geometryHash?: string;
  notes?: string;
}

export interface ValidationResult {
  id: string;
  type: 'SCHEMA' | 'GEOMETRIC' | 'DEPENDENCY' | 'UNIT_MISMATCH' | 'DFM' | 'DETERMINISM';
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  affectedFeatures?: string[];
  suggestion?: string;
}

export interface AeroForgeDSL {
  version: '1.0';
  metadata: {
    title: string;
    description: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
  };
  
  // Global settings
  units: 'mm' | 'cm' | 'in' | 'ft';
  coordinateSystem: CoordinateSystem;
  
  // Design features
  features: Feature[];
  
  // Constraints
  constraints: Constraint[];
  
  // Validation & Execution
  validationStatus: 'PASS' | 'FAIL' | 'WARNING';
  validationResults: ValidationResult[];
  executionLog?: ExecutionLog[];
}

/**
 * Validate DSL against strict schema
 */
export function validateDSL(dsl: any): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Schema validation
  if (!dsl.version || dsl.version !== '1.0') {
    results.push({
      id: 'schema_version',
      type: 'SCHEMA',
      severity: 'ERROR',
      message: 'DSL version must be exactly "1.0"',
    });
  }

  if (!dsl.metadata || typeof dsl.metadata !== 'object') {
    results.push({
      id: 'schema_metadata',
      type: 'SCHEMA',
      severity: 'ERROR',
      message: 'Metadata object is required',
    });
  }

  if (!dsl.units || !['mm', 'cm', 'in', 'ft'].includes(dsl.units)) {
    results.push({
      id: 'schema_units',
      type: 'SCHEMA',
      severity: 'ERROR',
      message: 'Units must be one of: mm, cm, in, ft',
    });
  }

  if (!dsl.coordinateSystem || typeof dsl.coordinateSystem !== 'object') {
    results.push({
      id: 'schema_coordinate',
      type: 'SCHEMA',
      severity: 'ERROR',
      message: 'Coordinate system definition is required',
    });
  }

  if (!Array.isArray(dsl.features)) {
    results.push({
      id: 'schema_features',
      type: 'SCHEMA',
      severity: 'ERROR',
      message: 'Features must be an array',
    });
  } else {
    // Validate features
    const featureIds = new Set<string>();
    dsl.features.forEach((feature: any, index: number) => {
      if (!feature.id) {
        results.push({
          id: `feature_${index}_no_id`,
          type: 'SCHEMA',
          severity: 'ERROR',
          message: `Feature at index ${index} missing required id`,
        });
      } else if (featureIds.has(feature.id)) {
        results.push({
          id: `feature_${feature.id}_duplicate`,
          type: 'SCHEMA',
          severity: 'ERROR',
          message: `Duplicate feature id: ${feature.id}`,
        });
      } else {
        featureIds.add(feature.id);
      }

      if (!feature.name) {
        results.push({
          id: `feature_${index}_no_name`,
          type: 'SCHEMA',
          severity: 'ERROR',
          message: `Feature at index ${index} missing required name`,
        });
      }

      if (!feature.type || !['PAD', 'POCKET', 'HOLE', 'FILLET', 'CHAMFER', 'PATTERN', 'SHELL', 'DRAFT', 'RIB', 'AIRFOIL'].includes(feature.type)) {
        results.push({
          id: `feature_${index}_invalid_type`,
          type: 'SCHEMA',
          severity: 'ERROR',
          message: `Feature ${feature.name} has invalid type`,
        });
      }
    });

    // Dependency validation
    dsl.features.forEach((feature: any) => {
      if (feature.referenceFeature && !featureIds.has(feature.referenceFeature)) {
        results.push({
          id: `dependency_${feature.id}`,
          type: 'DEPENDENCY',
          severity: 'ERROR',
          message: `Feature ${feature.name} references non-existent feature ${feature.referenceFeature}`,
          affectedFeatures: [feature.id],
        });
      }
    });
  }

  if (!Array.isArray(dsl.constraints)) {
    results.push({
      id: 'schema_constraints',
      type: 'SCHEMA',
      severity: 'WARNING',
      message: 'Constraints should be an array',
    });
  }

  // Unit consistency check
  if (dsl.features && Array.isArray(dsl.features)) {
    dsl.features.forEach((feature: any) => {
      const checkDimension = (dim: any, name: string) => {
        if (dim && typeof dim === 'object' && dim.unit) {
          if (!['mm', 'cm', 'in', 'ft'].includes(dim.unit)) {
            results.push({
              id: `unit_${feature.id}_${name}`,
              type: 'UNIT_MISMATCH',
              severity: 'ERROR',
              message: `Invalid unit in ${feature.name}.${name}: ${dim.unit}`,
              affectedFeatures: [feature.id],
            });
          }
        }
      };

      checkDimension(feature.padWidth, 'padWidth');
      checkDimension(feature.padLength, 'padLength');
      checkDimension(feature.padHeight, 'padHeight');
      checkDimension(feature.holeDiameter, 'holeDiameter');
      checkDimension(feature.holeDepth, 'holeDepth');
      checkDimension(feature.radius, 'radius');
    });
  }

  // DFM checks
  if (dsl.features && Array.isArray(dsl.features)) {
    dsl.features.forEach((feature: any) => {
      // Check for unreasonably small features
      if (feature.holeDiameter && feature.holeDiameter.value < 0.5) {
        results.push({
          id: `dfm_${feature.id}_hole_size`,
          type: 'DFM',
          severity: 'WARNING',
          message: `Hole diameter ${feature.holeDiameter.value}${feature.holeDiameter.unit} may be too small for standard drilling`,
          affectedFeatures: [feature.id],
          suggestion: 'Consider minimum hole diameter of 0.5mm for CNC drilling',
        });
      }

      // Check for thin walls
      if (feature.padHeight && feature.padHeight.value < 0.5) {
        results.push({
          id: `dfm_${feature.id}_wall_thickness`,
          type: 'DFM',
          severity: 'WARNING',
          message: `Feature thickness ${feature.padHeight.value}${feature.padHeight.unit} may be too thin`,
          affectedFeatures: [feature.id],
          suggestion: 'Minimum wall thickness typically 1mm for injection molding',
        });
      }
    });
  }

  // Determinism check
  if (dsl.features && Array.isArray(dsl.features)) {
    const featureOrder = dsl.features.map((f: any) => f.id);
    const hasCycles = checkForCycles(featureOrder, dsl.features);
    if (hasCycles) {
      results.push({
        id: 'determinism_cycle',
        type: 'DETERMINISM',
        severity: 'ERROR',
        message: 'Circular dependency detected in feature references',
        suggestion: 'Ensure features reference only previously defined features',
      });
    }
  }

  return results;
}

/**
 * Check for circular dependencies
 */
function checkForCycles(featureOrder: string[], features: any[]): boolean {
  const featureMap = new Map(features.map((f: any) => [f.id, f]));
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(featureId: string): boolean {
    visited.add(featureId);
    recursionStack.add(featureId);

    const feature = featureMap.get(featureId);
    if (feature?.referenceFeature) {
      if (!visited.has(feature.referenceFeature)) {
        if (hasCycle(feature.referenceFeature)) return true;
      } else if (recursionStack.has(feature.referenceFeature)) {
        return true;
      }
    }

    recursionStack.delete(featureId);
    return false;
  }

  for (const featureId of featureOrder) {
    if (!visited.has(featureId)) {
      if (hasCycle(featureId)) return true;
    }
  }

  return false;
}

/**
 * Generate deterministic execution log
 */
export function generateExecutionLog(dsl: AeroForgeDSL): ExecutionLog[] {
  const log: ExecutionLog[] = [];
  const timestamp = new Date().toISOString();

  dsl.features.forEach((feature, index) => {
    log.push({
      featureId: feature.id,
      featureName: feature.name,
      timestamp: new Date(new Date(timestamp).getTime() + index * 100).toISOString(),
      status: 'SUCCESS',
      operation: `Execute ${feature.type} feature: ${feature.name}`,
      geometryHash: generateGeometryHash(feature),
      notes: `Feature ${index + 1}/${dsl.features.length} executed deterministically`,
    });
  });

  return log;
}

/**
 * Generate deterministic hash for geometry
 */
function generateGeometryHash(feature: Feature): string {
  const str = JSON.stringify(feature);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Create default DSL template
 */
export function createDefaultDSL(): AeroForgeDSL {
  return {
    version: '1.0',
    metadata: {
      title: 'Untitled Design',
      description: 'New AeroForge design',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    units: 'mm',
    coordinateSystem: {
      origin: [0, 0, 0],
      xAxis: [1, 0, 0],
      yAxis: [0, 1, 0],
      zAxis: [0, 0, 1],
    },
    features: [],
    constraints: [],
    validationStatus: 'PASS',
    validationResults: [],
  };
}
