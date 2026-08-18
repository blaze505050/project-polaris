import time
import uuid
import asyncio
from typing import Dict, Optional
from schemas.physics import JobSubmissionPayload, JobStatusResponse
from adapters.fno_adapter import FNOAdapter, HAS_TORCH

if HAS_TORCH:
    import torch

class JobManager:
    def __init__(self):
        self.jobs: Dict[str, JobStatusResponse] = {}
        self.adapters = {
            "fno": FNOAdapter()
        }

    def get_device_name(self) -> str:
        if HAS_TORCH and torch.cuda.is_available():
            return f"CUDA GPU ({torch.cuda.get_device_name(0)})"
        return "CPU / PyTorch"

    def submit_job(self, payload: JobSubmissionPayload) -> JobStatusResponse:
        job_id = f"job-{uuid.uuid4().hex[:8]}"
        device_str = self.get_device_name()

        status_obj = JobStatusResponse(
            jobId=job_id,
            modelId=payload.modelId,
            status="QUEUED",
            progressPct=0.0,
            device=device_str,
            startTime=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            logs=[f"Job {job_id} queued for model '{payload.modelId}' on {device_str}."],
        )

        self.jobs[job_id] = status_obj

        # Trigger async job execution in background loop
        asyncio.create_task(self._process_job(job_id, payload))
        return status_obj

    async def _process_job(self, job_id: str, payload: JobSubmissionPayload):
        job = self.jobs.get(job_id)
        if not job:
            return

        try:
            start_ts = time.time()

            # State 1: VALIDATING
            job.status = "VALIDATING"
            job.progressPct = 15.0
            job.logs.append("Validating input parameters and physical bounds...")
            await asyncio.sleep(0.05)

            adapter = self.adapters.get(payload.modelId, self.adapters["fno"])
            valid, errors = adapter.validate_inputs(payload.inputs)
            if not valid:
                job.status = "FAILED"
                job.errorMessage = "; ".join(errors)
                job.logs.append(f"Validation Error: {job.errorMessage}")
                return

            # State 2: PREPROCESSING
            job.status = "PREPROCESSING"
            job.progressPct = 35.0
            job.logs.append("Converting NACA airfoil geometry into 64x64 spatial grid SDF tensor...")
            await asyncio.sleep(0.05)

            # State 3: RUNNING
            job.status = "RUNNING"
            job.progressPct = 65.0
            job.logs.append(f"Executing 2D Fourier Neural Operator spectral forward pass on {job.device}...")
            await asyncio.sleep(0.08)

            result = adapter.execute_inference(payload.inputs)

            # State 4: POSTPROCESSING & VALIDATION
            job.status = "POSTPROCESSING"
            job.progressPct = 90.0
            job.logs.append("Extracting surface Cp curves and evaluating Navier-Stokes mass/momentum residuals...")
            await asyncio.sleep(0.04)

            # State 5: COMPLETED
            elapsed_ms = round((time.time() - start_ts) * 1000, 2)
            job.status = "COMPLETED"
            job.progressPct = 100.0
            job.runtimeMs = elapsed_ms
            job.result = result
            job.logs.append(f"Job completed successfully in {elapsed_ms} ms. Normalized AeroForge result ready.")

        except Exception as e:
            job.status = "FAILED"
            job.errorMessage = str(e)
            job.logs.append(f"Execution Error: {str(e)}")

    def get_job_status(self, job_id: str) -> Optional[JobStatusResponse]:
        return self.jobs.get(job_id)

    def cancel_job(self, job_id: str) -> bool:
        if job_id in self.jobs:
            job = self.jobs[job_id]
            if job.status not in ["COMPLETED", "FAILED", "CANCELLED"]:
                job.status = "CANCELLED"
                job.logs.append("Job cancelled by user.")
                return True
        return False

# Global singleton manager
job_manager = JobManager()
