# AeroForge AI — Project Polaris Engineering Workstation

AeroForge AI is the flagship interactive Aerospace & Mechanical Engineering research workstation developed by Project Polaris. It features 40+ browser-based numerical solvers, CFD aerodynamics, structural FEA, orbital astrodynamics, and Physics AI neural operator workflows.

---

## 🚀 Key Modules & Capabilities

- **Transonic CFD & Airfoil Aerodynamics**: Prandtl-Glauert compressibility corrections, Abbott empirical benchmarks, and boundary layer separation estimation.
- **Orbital Astrodynamics & Space Flight**: Keplerian two-body propagation, Hohmann transfers, and N-body gravitational perturbations.
- **Structural Finite Element Analysis (FEA)**: Static stress analysis, truss deformation, and von Mises yield criteria.
- **Rocket Propulsion & Staging**: Ideal rocket equation, thrust curves, specific impulse optimization, and nozzle expansion ratios.
- **Interactive 3D Visualizer**: Real-time Three.js WebGL rendering of space vehicles, celestial bodies, and aerodynamic pressure fields.
- **Project Polaris Integration**: Can run standalone or embedded within the Project Polaris platform at `/aeroforge` with sandbox security and theme synchronization via `postMessage`.

---

## 🛠️ Architecture & Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI primitives
- **3D Graphics**: Three.js (WebGL rendering with fallback error handling)
- **Scientific Computations**: Analytical and reduced-order numerical solvers
- **Testing**: Vitest test suite
- **Build Output**: Compiled to `/public/aeroforge/index.html` via `scripts/build-aeroforge.js`

---

## 🚀 Development & Local Build

From within `AeroForge_ai-main`:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile production bundle
npm run build
```

The production bundle is compiled and synchronized into the parent Project Polaris repository during `npm run build:aeroforge`.

---

## ⚖️ Scientific Disclaimer

AeroForge AI algorithms are intended for educational and preliminary conceptual research purposes. Numerical results are derived from reduced-order approximations and should not be used for flight-critical or certified aerospace engineering without formal validation.
