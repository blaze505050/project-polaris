import {
  ModelCard,
  AirfoilSurrogateInputs,
  AirfoilSurrogateResult,
  JobStatusResponse,
  CanonicalDatasetEntry,
} from '@/types/physicsAi';

export interface PhysicsModelAdapterContract<TInput = AirfoilSurrogateInputs, TOutput = AirfoilSurrogateResult> {
  adapterId: string;
  modelId: string;

  /**
   * Retrieves full model card metadata & checkpoint info.
   */
  getModelMetadata(): Promise<ModelCard>;

  /**
   * Validates parameter range and training distribution bounds.
   */
  validateInputs(inputs: TInput): { valid: boolean; errors: string[]; warnings: string[] };

  /**
   * Preprocesses raw parameters into model-specific grid/mesh tensor representations.
   */
  prepareInput(inputs: TInput): Promise<{ tensorShape: number[]; preprocessedData: any }>;

  /**
   * Asynchronously submits inference job to execution worker.
   */
  submitJob(inputs: TInput, device?: 'auto' | 'cpu' | 'cuda'): Promise<{ jobId: string; status: JobStatusResponse }>;

  /**
   * Polls job state, progress, and logs.
   */
  getJobStatus(jobId: string): Promise<JobStatusResponse>;

  /**
   * Fetches raw model predictions and normalized AeroForge results.
   */
  getResults(jobId: string): Promise<TOutput>;

  /**
   * Evaluates physical residual checks (mass/momentum/energy conservation).
   */
  validatePrediction(result: TOutput): {
    massResidual: string;
    momentumResidual: string;
    energyResidual: string;
    boundaryError: string;
    valid: boolean;
  };

  /**
   * Formats spatio-temporal flow grids and $C_p$ curves for rendering.
   */
  getVisualizationData(result: TOutput): {
    cpCurve: any[];
    flowGrid: any[];
  };

  /**
   * Generates reproducible Digital Thread provenance payload.
   */
  getProvenance(jobId: string, result: TOutput): CanonicalDatasetEntry;

  /**
   * Cancels a running job.
   */
  cancelJob(jobId: string): Promise<boolean>;
}
