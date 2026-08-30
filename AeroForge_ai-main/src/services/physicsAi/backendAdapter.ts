export interface ComputeStatus {
  target: "Browser Client" | "Backend GPU Worker - Not Configured" | "HPC Cluster";
  available: boolean;
  gpuDevice?: string;
  maxMemoryGb?: number;
  message: string;
}

export function getComputeStatus(modelId: string): ComputeStatus {
  if (modelId === "aerographnet" || modelId === "fno") {
    return {
      target: "Browser Client",
      available: true,
      gpuDevice: "WebGL / WebGPU Client Acceleration",
      maxMemoryGb: 2,
      message: "Client-side surrogate inference supported for 2D airfoils and low-res grids.",
    };
  }

  return {
    target: "Backend GPU Worker - Not Configured",
    available: false,
    message: `Model '${modelId}' requires backend PyTorch inference worker. Deploy GPU adapter endpoint to enable.`,
  };
}
