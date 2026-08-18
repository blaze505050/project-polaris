export type ModelStatus = 'LIVE' | 'PROTOTYPE' | 'RESEARCH' | 'PLANNED';

export type ModelCategory =
  | 'General PDE'
  | 'External Aerodynamics'
  | 'Physics-Informed'
  | 'Atmospheric'
  | 'Multi-Physics';

export type JobState =
  | 'QUEUED'
  | 'VALIDATING'
  | 'PREPROCESSING'
  | 'RUNNING'
  | 'POSTPROCESSING'
  | 'VALIDATING_RESULT'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ModelCard {
  id: string;
  name: string;
  domain: string;
  category: ModelCategory;
  architecture: string;
  inputType: string;
  outputType: string;
  trainingDataType: string;
  aeroforgeApplication: string;
  status: ModelStatus;
  license: string;
  repository: string;
  citation: string;
  limitations: string[];
  version: string;
  description: string;
  tags: string[];
  paperTitle?: string;
  year?: number;
  checkpointInfo?: {
    name: string;
    checksum: string;
    dataset: string;
    resolution: string;
    fileSizeKb?: number;
    parameterCount?: number;
    stateDictKeys?: string[];
  };
}

export interface DatasetCard {
  id: string;
  name: string;
  source: string;
  license: string;
  domain: string;
  size: string;
  variables: string[];
  physics: string;
  resolution: string;
  useInAeroForge: string;
  accessMethod: string;
  citation: string;
  verifiedLicense: boolean;
  description: string;
  url?: string;
}

export interface AirfoilSurrogateInputs {
  airfoilName: string;
  maxCamber: number; // e.g. 0.02 (2%)
  camberPos: number; // e.g. 0.4 (40%)
  thickness: number; // e.g. 0.12 (12%)
  reynolds: number;  // e.g. 3e6
  mach: number;      // e.g. 0.15
  aoa: number;       // degrees, e.g. 4.0
  bcType: 'no-slip' | 'free-slip' | 'farfield-pressure' | 'inlet-outlet';
  gridResolution: number;
}

export interface AirfoilCpPoint {
  xc: number; // 0.0 to 1.0
  cpUpper: number;
  cpLower: number;
  cpAnalyticalUpper: number;
  cpAnalyticalLower: number;
}

export interface AirfoilFlowPoint {
  x: number;
  y: number;
  u: number;
  v: number;
  p: number;
  cp: number;
}

export interface AirfoilSurrogateResult {
  modelName: string;
  modelVersion: string;
  executionStatus: string;
  inferenceTimeMs: number;
  distributionCheck: 'Within training distribution' | 'Near training boundary' | 'Outside known training range';
  uncertaintyAvailable: boolean;
  uncertaintyPct: number | null;
  cl: number;
  cd: number;
  cm: number;
  minCp: number;
  cpCurve: AirfoilCpPoint[];
  flowGrid: AirfoilFlowPoint[];
  analytical: {
    cl: number;
    cd: number;
    cm: number;
    minCp: number;
  };
  referenceData: {
    available: boolean;
    source: string;
    cl: number | null;
    cd: number | null;
  };
  errorMetrics: {
    absClError: number;
    relClErrorPct: number;
    absCdError: number;
    relCdErrorPct: number;
    cpMae: number;
    cpRmse: number;
    maxCpDev: number;
  };
  physicsResiduals: {
    massResidual: string;
    momentumResidual: string;
    energyResidual: string;
    boundaryConditionError: string;
    pdeResidualEvaluated: boolean;
    preprocessingTimeMs?: number;
    modelInferenceTimeMs?: number;
    postprocessingTimeMs?: number;
    totalExecutionTimeMs?: number;
    checkpointSha256?: string;
    parameterCount?: number;
    derivationMethod?: string;
  };
}

export interface CanonicalDatasetEntry {
  id: string;
  geometry: {
    type: string;
    params: Record<string, number | string>;
  };
  mesh: {
    type: string;
    elementCount: number;
  };
  solver: string;
  solver_version: string;
  turbulence_model: string;
  mach: number;
  reynolds: number;
  aoa: number;
  temperature: number;
  pressure: number;
  boundary_conditions: Record<string, string>;
  fields: Record<string, number[]>;
  forces: {
    lift: number;
    drag: number;
    pitchingMoment: number;
  };
  moments: Record<string, number>;
  convergence: {
    iterations: number;
    converged: boolean;
  };
  residuals: {
    continuity: number;
    xMomentum: number;
    yMomentum: number;
  };
  metadata: Record<string, any>;
  provenance: {
    timestamp: string;
    author: string;
    hardware: string;
  };
}

export interface ModelRouterRequest {
  domain: string;
  pdeType: string;
  geometryType: string;
  speedRequirement: 'real-time' | 'interactive' | 'batch';
  physicsCategory: ModelCategory;
}

export interface ModelRouterRecommendation {
  modelId: string;
  modelName: string;
  confidenceScore: number;
  status: ModelStatus;
  reasoning: string;
  tradeoffs: string[];
}

export interface JobSubmissionPayload {
  modelId: string;
  inputs: AirfoilSurrogateInputs;
  device?: 'auto' | 'cpu' | 'cuda';
}

export interface JobStatusResponse {
  jobId: string;
  modelId: string;
  status: JobState;
  progressPct: number;
  device: string;
  startTime: string;
  runtimeMs?: number;
  logs: string[];
  errorMessage?: string;
  result?: AirfoilSurrogateResult;
}

export interface BackendComputeStatus {
  online: boolean;
  target: string;
  device: string;
  gpuAvailable: boolean;
  torchVersion?: string;
  activeJobsCount: number;
  message: string;
}
