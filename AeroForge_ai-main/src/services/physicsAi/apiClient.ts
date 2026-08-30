import {
  BackendComputeStatus,
  JobSubmissionPayload,
  JobStatusResponse,
  AirfoilSurrogateResult,
  ModelCard,
} from "@/types/physicsAi";

const API_BASE =
  ((import.meta.env as any).VITE_PHYSICS_AI_API_URL as string) || "http://localhost:8000";

export async function checkBackendComputeStatus(): Promise<BackendComputeStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE}/api/physics-ai/compute-status`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        target: data.target || "Python FastAPI Backend",
        device: data.device || "CPU / PyTorch",
        gpuAvailable: data.gpu_available || false,
        torchVersion: data.torch_version,
        activeJobsCount: data.active_jobs_count || 0,
        message: data.message || "FastAPI PyTorch Execution Engine Online",
      };
    }
  } catch (err) {
    // Backend offline / not running
  }

  return {
    online: false,
    target: "Backend Disconnected",
    device: "Client Browser Preview",
    gpuAvailable: false,
    activeJobsCount: 0,
    message:
      'Physics AI backend is not configured. Run "python -m uvicorn backend.main:app" locally or deploy GPU worker.',
  };
}

export async function submitBackendJob(payload: JobSubmissionPayload): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/api/physics-ai/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit job: ${res.statusText}`);
  }

  return await res.json();
}

export async function getBackendJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/api/physics-ai/jobs/${jobId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch job status: ${res.statusText}`);
  }
  return await res.json();
}

export async function getBackendJobResults(jobId: string): Promise<AirfoilSurrogateResult> {
  const res = await fetch(`${API_BASE}/api/physics-ai/jobs/${jobId}/results`);
  if (!res.ok) {
    throw new Error(`Failed to fetch job results: ${res.statusText}`);
  }
  return await res.json();
}

export async function cancelBackendJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/physics-ai/jobs/${jobId}/cancel`, {
      method: "POST",
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
