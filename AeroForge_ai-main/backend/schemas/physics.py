from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal

class AirfoilInputs(BaseModel):
    airfoilName: str = Field(default="NACA 0012")
    maxCamber: float = Field(default=0.0)
    camberPos: float = Field(default=0.4)
    thickness: float = Field(default=0.12)
    reynolds: float = Field(default=3e6)
    mach: float = Field(default=0.15)
    aoa: float = Field(default=4.0)
    bcType: str = Field(default="no-slip")
    gridResolution: int = Field(default=64)

class JobSubmissionPayload(BaseModel):
    modelId: str = Field(default="fno")
    inputs: AirfoilInputs
    device: Optional[Literal["auto", "cpu", "cuda"]] = Field(default="auto")

class AirfoilCpPoint(BaseModel):
    xc: float
    cpUpper: float
    cpLower: float
    cpAnalyticalUpper: float
    cpAnalyticalLower: float

class AirfoilFlowPoint(BaseModel):
    x: float
    y: float
    u: float
    v: float
    p: float
    cp: float

class AirfoilSurrogateResult(BaseModel):
    modelName: str
    modelVersion: str
    executionStatus: str
    inferenceTimeMs: float
    distributionCheck: str
    uncertaintyAvailable: bool
    uncertaintyPct: Optional[float] = None
    cl: float
    cd: float
    cm: float
    minCp: float
    cpCurve: List[AirfoilCpPoint]
    flowGrid: List[AirfoilFlowPoint]
    analytical: Dict[str, float]
    referenceData: Dict[str, Any]
    errorMetrics: Dict[str, float]
    physicsResiduals: Dict[str, Any]

class JobStatusResponse(BaseModel):
    jobId: str
    modelId: str
    status: str
    progressPct: float
    device: str
    startTime: str
    runtimeMs: Optional[float] = None
    logs: List[str]
    errorMessage: Optional[str] = None
    result: Optional[AirfoilSurrogateResult] = None

class ComputeStatusResponse(BaseModel):
    online: bool = True
    target: str = "Python FastAPI Backend"
    device: str = "CPU / PyTorch"
    gpu_available: bool = False
    torch_version: Optional[str] = None
    active_jobs_count: int = 0
    message: str = "FastAPI PyTorch Execution Engine Online"
