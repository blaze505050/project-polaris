# PROJECT POLARIS × AEROFORGE AI

> **Learning through Building, rather than Building after learning.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-ff4154.svg)](https://tanstack.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-PyTorch-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Overview

**Project Polaris** is an open experiential learning organization dedicated to space exploration, mechanical engineering, and computational science.

**AeroForge AI** is the flagship computational aerospace and mechanical engineering workstation developed by Project Polaris. It provides a browser-based research laboratory featuring 40+ numerical physics solvers, compressible aerodynamics, finite-element structural mechanics, Keplerian orbital mechanics, and Physics AI surrogate inference.

---

## 2. Platform Architecture

```
PROJECT POLARIS (Monorepo Ecosystem)
├── polaris-web-launch-main/ (Parent Web Portal)
│   ├── src/
│   │   ├── routes/              # TanStack Start File-based Routing
│   │   ├── components/site/     # Design System, Starfield, Navigation, Newsletter
│   │   └── lib/site.ts          # Authentic Registry, Programs, Projects, Timeline
│   │
│   ├── public/                  # Static Assets, Sitemaps, Robots, Logo
│   │   ├── _redirects           # Cloudflare Pages SPA Routing
│   │   ├── _headers             # Production Security Headers
│   │   └── aeroforge/           # Compiled AeroForge Distribution Bundle
│   │
│   └── AeroForge_ai-main/       # AeroForge Engineering Research Workstation
│       ├── src/
│       │   ├── components/      # WebGL 3D Canvas, Solvers, Charts, Command Center
│       │   ├── stores/          # Zustand Stores (Theme, Units, Workspaces)
│       │   └── services/        # Physics Solvers, NASA Abbott Validation, Health
│       │
│       └── backend/             # FastAPI & PyTorch Physics AI Engine (Optional)
│           ├── main.py          # REST Endpoints, CORS, LRU Eviction, 2MB Ceiling
│           └── fno_surrogate.py # Fourier Neural Operator Inference Runtime
```

---

## 3. Core Research Labs & Solvers

| Pillar / Lab       | Mathematical Models & Features                                                                      |  Solver Classification   |
| :----------------- | :-------------------------------------------------------------------------------------------------- | :----------------------: |
| **AeroLab**        | 4-Digit NACA Airfoils, Prandtl-Glauert Compressibility, Boundary Layer Friction, $C_l / C_d$ Polars | `ANALYTICAL / NUMERICAL` |
| **MechLab**        | Euler-Bernoulli Elastic Beams, Mohr's Stress Circle, Thin-Walled Pressure Vessels, Von Mises Yield  |    `NUMERICAL (FEA)`     |
| **AstroLab**       | Two-Body Keplerian Orbit Propagation, Hohmann Delta-V Maneuvers, Deep Space Photometry              |       `NUMERICAL`        |
| **Physics AI**     | 2D Navier-Stokes Surrogates (14ms Flow Field Inference via Fourier Neural Operators)                |   `EXPERIMENTAL (AI)`    |
| **Validation**     | Automated Overlay Comparison against NASA / Abbott Empirical Wind Tunnel Datasets                   |  `EMPIRICAL BENCHMARK`   |
| **Digital Thread** | Cryptographic SHA-256 Provenance Records Linking Parameters $\to$ Mesh $\to$ Public Share Artifact  |     `DETERMINISTIC`      |

---

## 4. Local Development

### Prerequisites

- **Node.js**: v18.0+ or v20.0+
- **npm**: v9.0+
- **Python**: v3.10+ (Only required for local Physics AI GPU backend)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install AeroForge dependencies
cd AeroForge_ai-main
npm install
cd ..
```

### Step 2: Launch Development Server

```bash
npm run dev
```

Open `http://localhost:5173` to explore Project Polaris and the embedded AeroForge Lab.

---

## 5. Production Build & Verification

```bash
# Build AeroForge bundle + Project Polaris bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Cloudflare Pages Deployment

The application is structured for instant zero-configuration deployment on **Cloudflare Pages**:

1. **Framework Preset**: None / Vite
2. **Build Command**: `npm run build`
3. **Build Output Directory**: `dist`
4. **Node.js Version**: `20`
5. **SPA Routing**: Handled automatically via `/public/_redirects` (`/* /index.html 200` and `/aeroforge/* /aeroforge/index.html 200`).

---

## 7. Security & Data Sovereignty

- **100% Client-Side Compute**: All analytical formulas, numerical matrices, and Three.js WebGL graphics execute inside the local browser sandbox.
- **Zero AI Model Training**: User CAD geometries, custom airfoil arrays, and simulation notebooks are never harvested for AI model training.
- **Strict Iframe Sandboxing**: Embedded AeroForge instances use origin-verified `postMessage` synchronization with `sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"`.
- **Sanitized Public Artifacts**: Public share tokens `/share/:artifactId` enforce regex `^[a-zA-Z0-9_\-\.]{3,64}$` with recursive prototype pollution defense.

---

## 8. Scientific Veracity & Disclaimers

> [!IMPORTANT]
> AeroForge calculations are preliminary reduced-order educational and research tools. Results must be independently verified by qualified engineering professionals before use in certified flight hardware, structural fabrication, or safety-critical decisions.

---

## 9. License & Attribution

Project Polaris and AeroForge AI are distributed under the [MIT License](LICENSE).  
Canonical brand assets and logos belong to **Project Polaris**.
