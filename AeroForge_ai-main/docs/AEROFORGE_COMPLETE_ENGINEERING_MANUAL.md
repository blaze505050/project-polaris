# AeroForge AI — Complete Technical & Engineering Manual

**Document Version:** 1.0.0 — Production Reference  
**Date:** August 17, 2026  
**Target Audience:** Aerospace Engineers, Mechanical Systems Designers, Astrodynamics Researchers, Computational Physicists, Software Architects  

---

## Table of Contents
1. [Platform Architecture & System Ecosystem](#1-platform-architecture--system-ecosystem)
2. [API Technical Reference](#2-api-technical-reference)
   - [2.1 Physics AI FastAPI REST API](#21-physics-ai-fastapi-rest-api)
   - [2.2 Public Artifact Cloud Registry REST API](#22-public-artifact-cloud-registry-rest-api)
   - [2.3 Research Hub Integration APIs](#23-research-hub-integration-apis)
3. [Physics AI Fourier Neural Operator (FNO) Engine](#3-physics-ai-fourier-neural-operator-fno-engine)
4. [AeroLab Aerodynamics Solver Manual](#4-aerolab-aerodynamics-solver-manual)
   - [4.1 Thin Airfoil Theory Solver](#41-thin-airfoil-theory-solver)
   - [4.2 NACA 4-Digit Airfoil Geometry Engine](#42-naca-4-digit-airfoil-geometry-engine)
   - [4.3 Prandtl-Glauert Compressibility Correction](#43-prandtl-glauert-compressibility-correction)
   - [4.4 ISO 2533 Standard Atmosphere 7-Layer Model](#44-iso-2533-standard-atmosphere-7-layer-model)
   - [4.5 2D Reduced-Order Boundary Layer Solver](#45-2d-reduced-order-boundary-layer-solver)
5. [MechLab Structural Mechanics Manual](#5-mechlab-structural-mechanics-manual)
   - [5.1 Euler-Bernoulli Beam Bending Solver](#51-euler-bernoulli-beam-bending-solver)
   - [5.2 Cantilever Deflection & Bending Stress](#52-cantilever-deflection--bending-stress)
   - [5.3 Structural Material Alloy Database](#53-structural-material-alloy-database)
6. [AstroLab Space Systems Manual](#6-astrolab-space-systems-manual)
   - [6.1 Keplerian Orbital Mechanics & Vis-Viva Solver](#61-keplerian-orbital-mechanics--vis-viva-solver)
   - [6.2 Porkchop Plot Lambert Transfer Solver](#62-porkchop-plot-lambert-transfer-solver)
   - [6.3 Fay-Riddell Hypersonic Re-entry Heat Flux Solver](#63-fay-riddell-hypersonic-re-entry-heat-flux-solver)
7. [Digital Thread Traceability & Project Archive Schema](#7-digital-thread-traceability--project-archive-schema)

---

## 1. Platform Architecture & System Ecosystem

AeroForge AI is built around a decoupled architecture separating client-side high-speed numerical solvers from backend neural surrogate inference servers:

```
+─────────────────────────────────────────────────────────────────────────────+
|                         AeroForge React 18 Frontend                         |
|  • Zustand Persistent State Engine ('aeroforge-projects-v1', 'aeroforge-state') |
|  • Local Solvers (Thin Airfoil, ISO Atmosphere, Keplerian Orbit, Beam Stress)|
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
            +──────────────────────────┴──────────────────────────+
            │                FastAPI PyTorch Service              │
            │  • POST /api/physics-ai/predict (FNO Engine)         │
            │  • POST /api/public-artifacts (Cloud Snapshots)     │
            │  • GET  /health (Status & CUDA GPU Device Query)    │
            +─────────────────────────────────────────────────────+
```

---

## 2. API Technical Reference

### 2.1 Physics AI FastAPI REST API

#### Endpoint: `GET /health`
Returns backend health status, system environment, and PyTorch CUDA GPU availability.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "device": "cuda:0 (NVIDIA RTX 4090)"
}
```

#### Endpoint: `POST /api/physics-ai/predict`
Executes Fourier Neural Operator (FNO) surrogate inference for 2D airfoil pressure field prediction.

**Request Payload:**
```json
{
  "model_id": "fno_airfoil_2d",
  "parameters": {
    "mach": 0.75,
    "angle_of_attack": 4.0,
    "reynolds_number": 6500000.0,
    "airfoil_grid": [[0.0, 0.0], [0.5, 0.06], [1.0, 0.0]]
  }
}
```

**Response Payload:**
```json
{
  "status": "COMPLETED",
  "execution_time_ms": 14.2,
  "execution_target": "cuda:0",
  "results": {
    "lift_coefficient": 0.5420,
    "drag_coefficient": 0.0312,
    "pressure_field_sample": [-0.85, -0.42, 0.12, 0.98]
  }
}
```

---

### 2.2 Public Artifact Cloud Registry REST API

#### Endpoint: `POST /api/public-artifacts`
Publishes an immutable snapshot of an experiment artifact to the cloud registry.

**Request Payload:**
```json
{
  "id": "PUB-EXP-2026-0914",
  "name": "NACA 2412 Transonic Evaluation",
  "pillar": "aerolab",
  "module": "Airfoil Compressibility Solver",
  "parameters": { "naca": "2412", "mach": 0.85, "aoa": 4.0 },
  "results": { "CL": 0.542, "CD": 0.0312, "L/D": 17.37 },
  "timestamp": 1786921200000
}
```

#### Endpoint: `GET /api/public-artifacts/{artifact_id}`
Retrieves a public artifact by ID for clean incognito context rendering.

---

## 3. Physics AI Fourier Neural Operator (FNO) Engine

The 2D Fourier Neural Operator parameterizes integral operators in Fourier space to learn resolution-independent mappings between function spaces:

$$v_{k+1}(x) = \sigma \left( W v_k(x) + \mathcal{F}^{-1} \left( R_{\phi} \cdot \mathcal{F}(v_k) \right)(x) \right)$$

Where:
- $\mathcal{F}$ is the 2D Fast Fourier Transform (FFT).
- $R_{\phi}$ is a parameterized weight matrix acting on lower Fourier modes.
- $\sigma$ is a non-linear activation function (GELU).

---

## 4. AeroLab Aerodynamics Solver Manual

### 4.1 Thin Airfoil Theory Solver
- **Governing Equations:**
  $$C_L = 2\pi (\alpha - \alpha_0)$$
  $$\alpha_0 = -\frac{1}{\pi} \int_{0}^{\pi} \frac{dz}{dx} (\theta) (\cos \theta - 1) d\theta$$
- **Assumptions:** Incompressible, inviscid, thin section ($t/c \le 0.12$), small angles of attack ($\alpha \le 12^\circ$).

### 4.2 Prandtl-Glauert Compressibility Correction
- **Governing Equation:**
  $$C_p = \frac{C_{p,0}}{\sqrt{1 - M_\infty^2}}$$
- **Valid Domain:** Subcritical subsonic flow ($M_\infty \le 0.80$).

### 4.3 ISO 2533 Standard Atmosphere (7-Layer Model)
Computes temperature, pressure, density, and dynamic viscosity from sea level up to 86 km:
- Troposphere ($0 \le h < 11\text{ km}$): $T = T_0 - L \cdot h$ where $L = 6.5\text{ K/km}$.
- Stratosphere ($11 \le h < 20\text{ km}$): $T = 216.65\text{ K}$ (Isothermal).

---

## 5. MechLab Structural Mechanics Manual

### 5.1 Euler-Bernoulli Beam Bending Solver
- **Deflection Formula (Cantilever Beam under End Load $F$):**
  $$\delta(x) = \frac{F x^2}{6 E I} (3L - x)$$
  $$\delta_{\max} = \frac{F L^3}{3 E I}$$
- **Bending Stress Formula:**
  $$\sigma = \frac{M \cdot y}{I}$$

Where $E$ is Young's Modulus, $I$ is Second Moment of Area, and $y$ is distance from neutral axis.

---

## 6. AstroLab Space Systems Manual

### 6.1 Keplerian Orbital Mechanics & Vis-Viva Solver
- **Vis-Viva Equation:**
  $$v = \sqrt{\mu \left( \frac{2}{r} - \frac{1}{a} \right)}$$
- **Orbital Period (Kepler's Third Law):**
  $$T = 2\pi \sqrt{\frac{a^3}{\mu}}$$
- **Escape Velocity:**
  $$v_{\text{esc}} = \sqrt{\frac{2\mu}{r}}$$

---

## 7. Digital Thread Traceability & Project Archive Schema

Project state exports follow the `.aeroforge` JSON package specification:

```json
{
  "format": "aeroforge-archive-v1",
  "exportedAt": "2026-08-17T16:32:00.000Z",
  "version": "1.0.0",
  "project": {
    "_id": "PRJ-2026-HYPER-04",
    "name": "Hypersonic UAV Section Study",
    "requirements": [
      { "id": "req_1", "code": "REQ-AERO-01", "specification": "L/D > 14.5", "status": "VERIFIED" }
    ],
    "simulations": [
      { "id": "sim_1", "name": "Prandtl-Glauert Compressibility Sweep", "solver": "Thin Airfoil + PG" }
    ]
  }
}
```
