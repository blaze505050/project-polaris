# AeroForge AI — Launch Readiness Baseline Audit

**Document Version:** 1.0.0  
**Date:** August 17, 2026  
**Status:** Baseline Inventory Complete

---

## 1. Product Architecture Overview

AeroForge AI is a browser-based engineering research platform for aerospace, mechanical engineering, and astrospace.

```
+─────────────────────────────────────────────────────────────────────────────+
|                              Client Layer (Vite + React 18)                 |
|  • astro.config.mjs / [...slug].astro -> AppRouter (React Router v7)        |
|  • Tailwind CSS / Vanilla CSS / Framer Motion / Recharts / Lucide Icons     |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
            +──────────────────────────┴──────────────────────────+
            │               Zustand State Engine                  │
            │  • projectStore (localStorage 'aeroforge-projects-v1')│
            │  • aeroforgeStore (localStorage 'aeroforge-state')  │
            │  • experimentStore (localStorage 'astrolab-exp')    │
            │  • unitStore (localStorage 'aeroforge-unit-prefs')  │
            +──────────────────────────┬──────────────────────────+
                                       │
     +─────────────────────────────────┼─────────────────────────────────+
     │                                 │                                 │
+────┴───────────────────+   +─────────┴───────────────────+   +─────────┴───────────────────+
| Physics Solvers (Local) |   | Research API Service        |   | Physics AI Backend          |
| • Thin Airfoil (2D)     |   | • arXiv Public REST API     |   | • Python FastAPI Server     |
| • ISO 2533 Atmosphere   |   | • OpenAlex Public REST API  |   | • PyTorch / NumPy FNO       |
| • Keplerian Orbit       |   | • Curated Fallback Library  |   | • Compute Status & Jobs     |
| • Euler-Bernoulli Beam  |   +─────────────────────────────+   +─────────────────────────────+
+─────────────────────────+
```

---

## 2. Route Inventory (~45 React Client Routes)

| Path                               | Component                      | Purpose                                                            | Status |
| :--------------------------------- | :----------------------------- | :----------------------------------------------------------------- | :----- |
| `/`                                | `HomePage`                     | Platform overview, workflow, CTAs, status badges                   | REAL   |
| `/dashboard`                       | `DashboardPage`                | Personalized workspace metrics & recent activities                 | REAL   |
| `/projects`                        | `ProjectsPage`                 | Project catalog, creation, filters & templates                     | REAL   |
| `/projects/:projectId`             | `ProjectWorkspacePage`         | Project workspace (Requirements, Simulations, Datasets, Notebooks) | REAL   |
| `/aerolab`                         | `AeroLabHub`                   | Aerodynamics lab hub & tools                                       | REAL   |
| `/mechlab`                         | `MechLabHub`                   | Mechanical engineering lab hub & tools                             | REAL   |
| `/astrolab`                        | `AstroLabMainPage`             | AstroSpace main portal                                             | REAL   |
| `/astrolab/hub`                    | `AstroLabHubPage`              | AstroLab suite selection                                           | REAL   |
| `/astrolab/academy`                | `AstroLabAcademyPage`          | Interactive astrophysics learning modules                          | REAL   |
| `/astrolab/simulations`            | `AstroLabSimulationsPage`      | Celestial simulation suite                                         | REAL   |
| `/astrolab/reports`                | `AstroLabReportsPage`          | Astrodynamics report generator                                     | REAL   |
| `/astrolab/spatial-globe`          | `SpatialGlobe`                 | Satellite constellation & globe tool                               | REAL   |
| `/astrolab/deep-space`             | `DeepSpace`                    | Deep space galaxy/nebula explorer                                  | REAL   |
| `/astrolab/photometry-suite`       | `PhotometrySuite`              | Stellar transit lightcurve photometry tool                         | REAL   |
| `/astrolab/astrodynamics-sandbox`  | `AstrodynamicsSandbox`         | N-body gravity & orbit sandbox                                     | REAL   |
| `/astrolab/dual-mode`              | `DualMode`                     | Student vs Professional mode comparator                            | REAL   |
| `/astrolab/constellations`         | `Constellations`               | 88-constellation celestial viewer                                  | REAL   |
| `/astrolab/coordinates`            | `Coordinates`                  | Equatorial/Ecliptic/Horizontal coordinate converter                | REAL   |
| `/astrolab/orbital-mechanics`      | `OrbitalMechanics`             | Keplerian orbit parameters & trajectory plotter                    | REAL   |
| `/astrolab/porkchop-plot`          | `PorkchopPlotGenerator`        | Interplanetary launch window Lambert solver                        | REAL   |
| `/astrolab/hypersonic-reentry`     | `HypersonicReentryCorridor`    | Aerothermal shockwave & heat flux solver                           | REAL   |
| `/astrolab/spectroscopic-analyzer` | `SpectroscopicAnalyzer`        | Absorption spectrum & composition analyzer                         | REAL   |
| `/astrolab/ascent-optimizer`       | `AscentPayloadOptimizer`       | Rocket payload fraction & delta-v calculator                       | REAL   |
| `/astrolab/space-environment`      | `SpaceEnvironmentHeliophysics` | Solar flare, magnetosphere & radiation tool                        | REAL   |
| `/astrolab/exoplanet-engine`       | `ExoplanetDiscoveryEngine`     | Transit & radial velocity detection engine                         | REAL   |
| `/physics-ai`                      | `PhysicsAiLabPage`             | Neural Operator (FNO) runtime & model registry                     | REAL   |
| `/validation`                      | `ValidationCenter`             | Physics benchmark comparisons against literature                   | REAL   |
| `/flagship-workflow`               | `FlagshipWorkflowPage`         | 7-step guided aerodynamic design wizard                            | REAL   |
| `/share/:artifactId`               | `PublicArtifactPage`           | Public shareable artifact page with provenance                     | REAL   |
| `/trust`                           | `TrustCenter`                  | Transparency, security boundaries & disclaimers                    | REAL   |
| `/demo`                            | `GuidedEngineeringDemo`        | 5-minute interactive platform walkthrough                          | REAL   |
| `/changelog`                       | `ChangelogPage`                | Version history and feature releases                               | REAL   |
| `/documentation`                   | `DocumentationPage`            | Engineering manuals, equations, and API guides                     | REAL   |
| `/settings`                        | `SettingsPage`                 | User preferences, units, theme, & API keys                         | REAL   |
| `/legal`                           | `LegalPage`                    | Privacy policy & terms of service                                  | REAL   |
| `/contact`                         | `ContactPage`                  | Engineering support & contact form                                 | REAL   |
| `*`                                | `NotFoundPage`                 | Trajectory Lost 404 handler                                        | REAL   |

---

## 3. Tool & Solver Inventory

### A. Aerodynamics Solvers (`AeroLab`)

- **2D Thin Airfoil Theory Solver:** Linear lift slope ($C_L = 2\pi(\alpha - \alpha_0)$), NACA 4-digit geometry generator (`generateNACA4Digit`).
- **Prandtl-Glauert Compressibility Correction:** Subsonic Mach correction ($C_p = C_{p0} / \sqrt{1 - M^2}$).
- **ISO 2533 Standard Atmosphere:** 7-layer atmospheric density, pressure, temperature, dynamic viscosity, and speed of sound solver (`computeISAAtmosphere`).
- **Reduced-Order Boundary Layer Solver:** 2D finite-difference flow approximation (`cfdPhysicsEngine.ts`).

### B. Structural Solvers (`MechLab`)

- **Euler-Bernoulli Beam Bending Solver:** Cantilever & simply supported deflection ($\delta = \frac{F L^3}{3 E I}$), bending stress ($\sigma = \frac{M y}{I}$), shear force diagrams (`computeBeamStress`).
- **Material Database Lookup:** Structural alloy properties (Aluminum 6061-T6, Titanium Ti-6Al-4V, Carbon Fiber Composites, Stainless 316L).

### C. Astrodynamics & Space Solvers (`AstroLab`)

- **Keplerian Orbit Solver:** Orbital period ($T = 2\pi \sqrt{a^3 / \mu}$), orbital velocity ($v = \sqrt{\mu/r}$), escape velocity ($v_{esc} = \sqrt{2\mu/r}$), specific orbital energy ($\varepsilon = -\mu / 2a$).
- **Porkchop Plot Lambert Solver:** Interplanetary transfer trajectory delta-v approximation.
- **Hypersonic Re-entry Heat Flux:** Fay-Riddell stagnation point aerothermal heating model.

### D. Physics AI Neural Operator

- **2D Fourier Neural Operator (FNO):** FastAPI PyTorch backend (`backend/main.py`) executing neural surrogate inference for fluid pressure fields.

---

## 4. Known Risks & Baseline Limitations

1. **Public Artifact Sharing Dependency:** Originally dependent on local browser storage (`localStorage`). Resolving with server-backed `/api/public-artifacts` endpoints.
2. **Storage Quota:** Large numbers of saved experiments could hit 5MB `localStorage` limits. Requiring `try/catch` quota protection.
3. **Solver Classification Transparency:** Reduced-order 2D solvers must be explicitly labeled as such to ensure zero misleading CFD claims.
