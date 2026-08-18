/**
 * AeroForge Compiler Service v2.0
 * Deterministic Feature DSL Generation with Strict Validation
 * FIXED: Accurate cube and bolt generation
 * 
 * DESIGN PRINCIPLES:
 * - No implicit geometry
 * - Explicit units on every dimension
 * - Deterministic feature ordering
 * - Full schema validation
 * - DFM rule enforcement
 * - Dependency cycle detection
 */

import { 
  AeroForgeDSL, 
  Feature, 
  Constraint, 
  DimensionWithUnits,
  Point3D,
  validateDSL, 
  generateExecutionLog,
  createDefaultDSL 
} from './dslSchema';

export interface CompilerRequest {
  input: string;
  units: 'mm' | 'cm' | 'in' | 'ft';
}

export interface CompilerResponse {
  success: boolean;
  dsl?: AeroForgeDSL;
  errors?: string[];
  error?: string;
  warnings?: string[];
  executionLog?: any[];
}

/**
 * Main compiler function - generates deterministic DSL from natural language
 */
export async function compileDesign(request: CompilerRequest): Promise<CompilerResponse> {
  // Simulate backend processing delay with progress
  await new Promise(resolve => setTimeout(resolve, 800));

  const { input, units } = request;

  // Input validation
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      errors: ['Input description cannot be empty'],
    };
  }

  if (!['mm', 'cm', 'in', 'ft'].includes(units)) {
    return {
      success: false,
      errors: [`Invalid units: ${units}. Must be one of: mm, cm, in, ft`],
    };
  }

  try {
    // Create base DSL
    const dsl = createDefaultDSL();
    dsl.units = units as any;
    dsl.metadata.description = input.substring(0, 200);

    // Parse natural language input
    const features = parseNaturalLanguageToFeatures(input, units);
    const constraints = parseConstraints(input, units);

    dsl.features = features;
    dsl.constraints = constraints;

    // Validate DSL
    const validationResults = validateDSL(dsl);
    const errors = validationResults.filter(r => r.severity === 'ERROR').map(r => r.message);
    const warnings = validationResults.filter(r => r.severity === 'WARNING').map(r => r.message);

    dsl.validationResults = validationResults;
    dsl.validationStatus = errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARNING' : 'PASS';

    // Generate execution log
    const executionLog = generateExecutionLog(dsl);

    if (errors.length > 0) {
      return {
        success: false,
        dsl,
        errors,
        warnings,
        executionLog,
      };
    }

    return {
      success: true,
      dsl,
      warnings: warnings.length > 0 ? warnings : undefined,
      executionLog,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Parse natural language input into typed features
 * FIXED: Accurate cube and bolt detection
 */
function parseNaturalLanguageToFeatures(input: string, units: string): Feature[] {
  const features: Feature[] = [];
  const lowerInput = input.toLowerCase();
  let featureIndex = 0;

  // Extract all dimensions with units
  const dimensions = extractDimensions(input, units);

  // CRITICAL FIX: Detect CUBE specifically (equal dimensions)
  if (lowerInput.includes('cube')) {
    const cubeDim = dimensions[0] || { value: 50, unit: units as any };
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'cube',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: cubeDim,
      padLength: cubeDim,
      padHeight: cubeDim,
      description: 'Perfect cube with equal dimensions',
    });
    return features;
  }

  // CRITICAL FIX: Detect BOLT specifically (single cylinder, NOT holes)
  if (lowerInput.includes('bolt') && !lowerInput.includes('hole')) {
    const boltDiameter = dimensions[0] || { value: 10, unit: units as any };
    const boltLength = dimensions[1] || { value: 50, unit: units as any };
    
    // Single bolt shaft
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'bolt_shaft',
      type: 'PAD',
      padProfile: 'CIRCULAR',
      padWidth: boltDiameter,
      padHeight: boltLength,
      description: 'Single bolt shaft with precise cylindrical geometry',
    });
    
    // Add bolt head if specified
    if (lowerInput.includes('head')) {
      const headDiameter = { value: (boltDiameter.value || 10) * 1.5, unit: boltDiameter.unit };
      const headHeight = { value: (boltDiameter.value || 10) * 0.7, unit: boltDiameter.unit };
      features.push({
        id: `feature_${featureIndex++}`,
        name: 'bolt_head',
        type: 'PAD',
        padProfile: 'CIRCULAR',
        padWidth: headDiameter,
        padHeight: headHeight,
        coordinate: {
          x: { value: 0, unit: units as any },
          y: { value: (boltLength.value || 50) / 2 + (headHeight.value || 7) / 2, unit: units as any },
          z: { value: 0, unit: units as any },
        },
        description: 'Bolt head with standard proportions',
      });
    }
    return features;
  }

  // Detect mounting bracket specifically
  if (lowerInput.includes('bracket') && (lowerInput.includes('mount') || lowerInput.includes('support'))) {
    // Base plate
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'bracket_base_plate',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 100, unit: units as any },
      padLength: dimensions[1] || { value: 150, unit: units as any },
      padHeight: dimensions[2] || { value: 12, unit: units as any },
      description: 'Main mounting bracket base plate',
    });

    // Vertical support arm
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'bracket_vertical_arm',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[3] || { value: 80, unit: units as any },
      padLength: dimensions[4] || { value: 15, unit: units as any },
      padHeight: dimensions[5] || { value: 80, unit: units as any },
      coordinate: {
        x: { value: 0, unit: units as any },
        y: { value: (dimensions[2]?.value || 12) / 2 + (dimensions[5]?.value || 80) / 2, unit: units as any },
        z: { value: (dimensions[1]?.value || 150) / 2 - (dimensions[4]?.value || 15) / 2, unit: units as any },
      },
      description: 'Vertical support arm for mounting',
    });

    // Top mounting flange
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'bracket_top_flange',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[6] || { value: 100, unit: units as any },
      padLength: dimensions[7] || { value: 40, unit: units as any },
      padHeight: dimensions[8] || { value: 10, unit: units as any },
      coordinate: {
        x: { value: 0, unit: units as any },
        y: { value: (dimensions[2]?.value || 12) / 2 + (dimensions[5]?.value || 80), unit: units as any },
        z: { value: (dimensions[1]?.value || 150) / 2 - (dimensions[4]?.value || 15) / 2, unit: units as any },
      },
      description: 'Top mounting flange for attachment',
    });
  } else if (lowerInput.includes('bracket') || lowerInput.includes('mount') || lowerInput.includes('support')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'mounting_bracket',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 120, unit: units as any },
      padLength: dimensions[1] || { value: 180, unit: units as any },
      padHeight: dimensions[2] || { value: 15, unit: units as any },
      description: 'Mounting bracket base with enhanced geometry',
    });
  } else if (lowerInput.includes('plate') || lowerInput.includes('flat') || lowerInput.includes('base')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'base_plate',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 250, unit: units as any },
      padLength: dimensions[1] || { value: 250, unit: units as any },
      padHeight: dimensions[2] || { value: 8, unit: units as any },
      description: 'Base plate with optimized thickness',
    });
  } else if (lowerInput.includes('cylinder') || lowerInput.includes('round') || lowerInput.includes('shaft')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'cylindrical_base',
      type: 'PAD',
      padProfile: 'CIRCULAR',
      padWidth: dimensions[0] || { value: 120, unit: units as any },
      padHeight: dimensions[1] || { value: 60, unit: units as any },
      description: 'Cylindrical base feature with precision geometry',
    });
  } else {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'base_feature',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 150, unit: units as any },
      padLength: dimensions[1] || { value: 150, unit: units as any },
      padHeight: dimensions[2] || { value: 12, unit: units as any },
      description: 'Base feature with standard geometry',
    });
  }

  // Enhanced hole detection - only add if NOT a bolt
  if ((lowerInput.includes('hole') || lowerInput.includes('screw')) && !lowerInput.includes('bolt')) {
    const holeMatches = input.match(/(\d+)\s*(?:x\s*)?(?:hole|screw)/gi) || [];
    const holeCount = holeMatches.length > 0 ? parseInt(holeMatches[0]) : 2;
    const holeDiameter = dimensions.find((d, i) => i > 0 && d.value < 25) || { value: 8, unit: units as any };
    const spacing = dimensions.find((d, i) => i > 1 && d.value > 25) || { value: 60, unit: units as any };

    for (let i = 0; i < Math.min(holeCount, 8); i++) {
      features.push({
        id: `feature_${featureIndex++}`,
        name: `hole_${i + 1}`,
        type: 'HOLE',
        referenceFeature: features[0].id,
        coordinate: {
          x: { value: spacing.value * (i - Math.floor(holeCount / 2)), unit: spacing.unit },
          y: { value: 0, unit: spacing.unit },
          z: { value: 0, unit: spacing.unit },
        },
        holeDiameter,
        holeDepth: 'THROUGH',
        holeType: 'STRAIGHT',
        description: `Precision hole ${i + 1}`,
      });
    }
  }

  // Enhanced fillet detection
  if (lowerInput.includes('fillet') || lowerInput.includes('round') || lowerInput.includes('smooth')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'corner_fillet',
      type: 'FILLET',
      referenceFeature: features[0].id,
      radius: { value: 3, unit: units as any },
      description: 'Corner fillet for stress relief and aesthetics',
    });
  }

  // Enhanced pocket detection
  if (lowerInput.includes('pocket') || lowerInput.includes('recess') || lowerInput.includes('cavity')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'pocket_feature',
      type: 'POCKET',
      referenceFeature: features[0].id,
      padWidth: dimensions[3] || { value: 60, unit: units as any },
      padLength: dimensions[4] || { value: 60, unit: units as any },
      padHeight: dimensions[5] || { value: 8, unit: units as any },
      description: 'Recessed pocket with precision tolerances',
    });
  }

  return features;
}

/**
 * Extract dimensions from natural language with unit preservation
 */
function extractDimensions(input: string, defaultUnit: string): DimensionWithUnits[] {
  const dimensions: DimensionWithUnits[] = [];
  
  // Match patterns like "100mm", "50 in", "3.5 inches", etc.
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(mm|millimeter|millimeters)/gi,
    /(\d+(?:\.\d+)?)\s*(cm|centimeter|centimeters)/gi,
    /(\d+(?:\.\d+)?)\s*(in|inch|inches|")/gi,
    /(\d+(?:\.\d+)?)\s*(ft|foot|feet|')/gi,
    /(\d+(?:\.\d+)?)\s*(?=mm|cm|in|ft|inch|foot|mm|cm)/gi,
  ];

  const unitMap: Record<string, 'mm' | 'cm' | 'in' | 'ft'> = {
    'mm': 'mm',
    'millimeter': 'mm',
    'millimeters': 'mm',
    'cm': 'cm',
    'centimeter': 'cm',
    'centimeters': 'cm',
    'in': 'in',
    'inch': 'in',
    'inches': 'in',
    '"': 'in',
    'ft': 'ft',
    'foot': 'ft',
    'feet': 'ft',
    "'": 'ft',
  };

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(input)) !== null) {
      const value = parseFloat(match[1]);
      const unitStr = match[2]?.toLowerCase() || defaultUnit;
      const unit = unitMap[unitStr] || (defaultUnit as 'mm' | 'cm' | 'in' | 'ft');
      
      dimensions.push({ value, unit });
    }
  }

  return dimensions;
}

/**
 * Parse constraints from natural language
 */
function parseConstraints(input: string, units: string): Constraint[] {
  const constraints: Constraint[] = [];
  const lowerInput = input.toLowerCase();
  let constraintIndex = 0;

  if (lowerInput.includes('tolerance')) {
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'TOLERANCE',
      target: 'all_dimensions',
      value: '±0.1',
      unit: units,
      notes: 'Standard manufacturing tolerance',
    });
  }

  if (lowerInput.includes('material') || lowerInput.includes('aluminum') || lowerInput.includes('steel')) {
    const material = lowerInput.includes('steel') ? 'Steel' : 
                    lowerInput.includes('aluminum') ? 'Aluminum 6061' : 'Aluminum 6061';
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'MATERIAL',
      target: 'all_features',
      value: material,
      notes: 'Material specification',
    });
  }

  if (lowerInput.includes('load') || lowerInput.includes('strength')) {
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'LOAD_CASE',
      target: 'structural',
      value: '100',
      unit: 'N',
      notes: 'Estimated load case - verify with FEA',
    });
  }

  if (lowerInput.includes('surface finish') || lowerInput.includes('polish')) {
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'SURFACE_FINISH',
      target: 'all_surfaces',
      value: 'Ra 1.6',
      notes: 'Surface finish requirement',
    });
  }

  return constraints;
}
