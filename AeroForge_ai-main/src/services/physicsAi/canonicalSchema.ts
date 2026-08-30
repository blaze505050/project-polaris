import {
  CanonicalDatasetEntry,
  AirfoilSurrogateResult,
  AirfoilSurrogateInputs,
} from "@/types/physicsAi";

/**
 * Converts an Airfoil Surrogate experiment result into a canonical AeroForge dataset entry.
 */
export function createCanonicalDatasetEntry(
  inputs: AirfoilSurrogateInputs,
  result: AirfoilSurrogateResult,
): CanonicalDatasetEntry {
  return {
    id: `af-ds-${Date.now()}-${inputs.airfoilName.toLowerCase().replace(/\s+/g, "")}`,
    geometry: {
      type: "Airfoil2D",
      params: {
        name: inputs.airfoilName,
        maxCamber: inputs.maxCamber,
        camberPos: inputs.camberPos,
        thickness: inputs.thickness,
      },
    },
    mesh: {
      type: "C-Grid Surface Structured",
      elementCount: inputs.gridResolution * 4,
    },
    solver: "AeroForge Analytical & Neural Surrogate Hybrid",
    solver_version: result.modelVersion,
    turbulence_model: "Spalart-Allmaras Neural Surrogate",
    mach: inputs.mach,
    reynolds: inputs.reynolds,
    aoa: inputs.aoa,
    temperature: 288.15, // Standard atmospheric K
    pressure: 101325, // Pa
    boundary_conditions: {
      inlet: "Farfield Mach & Pressure",
      airfoilSurface: inputs.bcType,
      outlet: "Zero Pressure Gradient",
    },
    fields: {
      xc: result.cpCurve.map((p) => p.xc),
      cpUpper: result.cpCurve.map((p) => p.cpUpper),
      cpLower: result.cpCurve.map((p) => p.cpLower),
    },
    forces: {
      lift: result.cl,
      drag: result.cd,
      pitchingMoment: result.cm,
    },
    moments: {
      cm_c4: result.cm,
    },
    convergence: {
      iterations: 1,
      converged: true,
    },
    residuals: {
      continuity: parseFloat(result.physicsResiduals.massResidual),
      xMomentum: parseFloat(result.physicsResiduals.momentumResidual),
      yMomentum: parseFloat(result.physicsResiduals.momentumResidual) * 0.9,
    },
    metadata: {
      distributionCheck: result.distributionCheck,
      uncertaintyPct: result.uncertaintyPct,
      inferenceTimeMs: result.inferenceTimeMs,
      errorMetrics: result.errorMetrics,
    },
    provenance: {
      timestamp: new Date().toISOString(),
      author: "AeroForge Physics AI Lab User",
      hardware: result.executionStatus,
    },
  };
}

export function validateCanonicalSchema(entry: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredKeys = [
    "id",
    "geometry",
    "mesh",
    "solver",
    "solver_version",
    "turbulence_model",
    "mach",
    "reynolds",
    "aoa",
    "temperature",
    "pressure",
    "boundary_conditions",
    "fields",
    "forces",
    "moments",
    "convergence",
    "residuals",
    "metadata",
    "provenance",
  ];

  requiredKeys.forEach((key) => {
    if (!(key in entry)) {
      errors.push(`Missing mandatory canonical schema field: ${key}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
