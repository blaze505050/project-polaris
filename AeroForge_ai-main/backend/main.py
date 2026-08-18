import os
import sys
import time
import json
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend root is on Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from schemas.physics import JobSubmissionPayload, JobStatusResponse, ComputeStatusResponse
from workers.job_manager import job_manager, HAS_TORCH

if HAS_TORCH:
    import torch

app = FastAPI(
    title="AeroForge Physics AI Backend API",
    description="Execution Engine & Neural Operator Runtime for AeroForge Physics AI Lab",
    version="1.0.0",
)

# HTTP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Configure environment-aware CORS origins
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:4321,http://127.0.0.1:4321,http://localhost:5173")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AeroForge Physics AI Backend", "version": "1.0.0"}

@app.get("/api/physics-ai/compute-status", response_model=ComputeStatusResponse)
def get_compute_status():
    gpu_avail = HAS_TORCH and torch.cuda.is_available()
    device_name = f"CUDA GPU ({torch.cuda.get_device_name(0)})" if gpu_avail else "CPU / PyTorch"
    torch_ver = torch.__version__ if HAS_TORCH else "Not Installed (NumPy FFT Engine)"

    return ComputeStatusResponse(
        online=True,
        target="Python FastAPI Backend",
        device=device_name,
        gpu_available=gpu_avail,
        torch_version=torch_ver,
        active_jobs_count=len(job_manager.jobs),
        message="FastAPI PyTorch Execution Engine Online & Ready",
    )

@app.post("/api/physics-ai/jobs", response_model=JobStatusResponse)
def submit_job(payload: JobSubmissionPayload):
    try:
        job = job_manager.submit_job(payload)
        return job
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/physics-ai/jobs/{job_id}", response_model=JobStatusResponse)
def get_job_status(job_id: str):
    job = job_manager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")
    return job

@app.get("/api/physics-ai/jobs/{job_id}/results")
def get_job_results(job_id: str):
    job = job_manager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")
    if job.status != "COMPLETED" or not job.result:
        raise HTTPException(status_code=400, detail=f"Job status is '{job.status}'. Result not available.")
    return job.result

@app.post("/api/physics-ai/jobs/{job_id}/cancel")
def cancel_job(job_id: str):
    success = job_manager.cancel_job(job_id)
    if not success:
        raise HTTPException(status_code=400, detail=f"Job '{job_id}' cannot be cancelled.")
    return {"message": f"Job '{job_id}' successfully cancelled."}

@app.get("/api/physics-ai/models")
def list_models():
    return [
        {
            "id": "fno",
            "name": "Fourier Neural Operator (FNO)",
            "status": "LIVE",
            "executionTarget": job_manager.get_device_name(),
            "description": "2D Fourier Neural Operator running via FastAPI PyTorch engine."
        }
    ]

# ─── Public Artifact Cloud Registry API ───────────────────────────────────────

import re

SAFE_ARTIFACT_ID_REGEX = re.compile(r"^[a-zA-Z0-9_\-\.]{3,64}$")
PUBLIC_ARTIFACTS_DB = {}
MAX_PAYLOAD_BYTES = 2 * 1024 * 1024  # 2 MB limit
MAX_DB_ENTRIES = 500  # Cap in-memory store for safety

@app.post("/api/public-artifacts")
def publish_public_artifact(payload: dict):
    # Enforce payload size cap (max 2MB)
    encoded = json.dumps(payload).encode("utf-8")
    if len(encoded) > MAX_PAYLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Artifact payload exceeds 2 MB limit.")

    raw_id = str(payload.get("id") or f"PUB-{int(time.time() * 1000)}")
    if not SAFE_ARTIFACT_ID_REGEX.match(raw_id):
        raise HTTPException(status_code=400, detail="Invalid artifact ID format. Allowed: alphanumeric, _, -, . (3-64 chars)")

    # Evict oldest entry if DB cap reached
    if len(PUBLIC_ARTIFACTS_DB) >= MAX_DB_ENTRIES:
        oldest_key = next(iter(PUBLIC_ARTIFACTS_DB))
        PUBLIC_ARTIFACTS_DB.pop(oldest_key, None)

    PUBLIC_ARTIFACTS_DB[raw_id] = payload
    return {"status": "published", "id": raw_id, "artifact": payload}

@app.get("/api/public-artifacts/{artifact_id}")
def get_public_artifact(artifact_id: str):
    if not SAFE_ARTIFACT_ID_REGEX.match(artifact_id):
        raise HTTPException(status_code=400, detail="Invalid artifact ID format.")
    
    artifact = PUBLIC_ARTIFACTS_DB.get(artifact_id)
    if not artifact:
        raise HTTPException(status_code=404, detail=f"Public artifact '{artifact_id}' not found.")
    return artifact

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

