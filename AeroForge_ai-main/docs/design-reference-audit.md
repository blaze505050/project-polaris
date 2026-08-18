# AeroForge AI — Design Reference Audit & Implementation Brief

This document details the architectural translation of design-engineering principles extracted from **MengTo Skills** (`MengTo/Skills`) and **Kage** (`MengTo/kage`) into AeroForge AI.

---

## Reference Analysis & Technique Translation

| Reference | Technique | What It Achieves | How It Translates to AeroForge | Target Location |
| :--- | :--- | :--- | :--- | :--- |
| **Kage** | Fixed full-viewport continuous 3D WebGL background layer | Unified atmospheric spatial continuity; avoids section breaks and generic card stacks | `Engineering3DCanvas` fixed full-screen WebGL viewport rendering aerodynamic streamlines, stress tensors, and orbital vectors driven by scroll position | [`HomePage.tsx`](file:///c:/Users/ADITYA/Desktop/AeroForge/AeroForge_ai-main/src/components/pages/HomePage.tsx) & `HeroVisualizationCanvas.tsx` |
| **Kage** | Scroll-driven camera path & chapter progression | Creates narrative anticipation, spatial depth, and discovery rhythm | Scrolling moves the camera through the engineering pipeline: Flow Field → Wireframe Mesh → CFD Pressure Field → Stress Vector → Orbital Ellipse | `HomePage.tsx` scroll progress state |
| **Skills** (`build-awwwards-quality-sites`) | Editorial-tech typography & technical telemetry overlays | Establishes high-density research credibility without feeling like a commercial dashboard | Oversized display headers paired with precise monospace telemetry values (`MACH`, `Re`, `AoA`, `P_0`, `T_0`, `SF`) and fine technical gridlines | [`professional.css`](file:///c:/Users/ADITYA/Desktop/AeroForge/AeroForge_ai-main/src/styles/professional.css) & [`Header.tsx`](file:///c:/Users/ADITYA/Desktop/AeroForge/AeroForge_ai-main/src/components/Header.tsx) |
| **Skills** (`animation-on-scroll`) | Pinned scroll storytelling & progressive node illumination | Guides user focus through multi-step engineering logic without layout shift | Pinned 3D canvas with interactive node activation for the Digital Thread (Requirement → Geometry → Solver → Simulation → Result → Validation) | [`DigitalThreadProvenance.tsx`](file:///c:/Users/ADITYA/Desktop/AeroForge/AeroForge_ai-main/src/components/DigitalThreadProvenance.tsx) |
| **Skills** (`progressive-blur`) | Layered spatial depth & alpha masking | Softens background WebGL geometry behind interactive foreground command interfaces | Progressive linear backdrop blur filters (`backdrop-filter: blur(12px)`) over technical panels | [`professional.css`](file:///c:/Users/ADITYA/Desktop/AeroForge/AeroForge_ai-main/src/styles/professional.css) |
| **Kage** | Multi-domain environment switching | Sensory distinctiveness between disciplines | Interactive domain selector that smoothly warps the WebGL scene (Aerospace streamlines vs Mechanical structural FEA stress vs Astrospace orbital Kepler ellipse) | `HomePage.tsx` (Chapter 03: The Three Worlds) |
| **Skills** (`threejs`) | Optimized geometry & resource disposal | Maintains 60 FPS performance without memory leaks | Clean Three.js buffer geometry cleanup on unmount; reduced-motion CSS fallback | `HeroVisualizationCanvas.tsx` & 3D viewports |

---

## Experience Architecture Chapters

```
CHAPTER 01: ARRIVAL
  ├── Full-viewport 3D aerodynamic flow field & live telemetry
  └── Editorial headline: "ENGINEERING, CONNECTED."

CHAPTER 02: ENTER THE SYSTEM
  └── Scroll scrubbed transformation: Airflow → Wireframe Geometry → Mesh → Pressure Field → Results

CHAPTER 03: THE THREE WORLDS
  └── Spatial environments: Aerospace (Airfoil) | Mechanical (Spar FEA) | Astrospace (Orbit)

CHAPTER 04: THE ENGINEERING THREAD
  └── Pinned living graph where nodes activate as user scrolls, pulsing data particles through links

CHAPTER 05: PROBLEM → SOLUTION
  └── Command interface entry points ("Analyze an Airfoil", "Optimize a Wing", "Design a Rocket")

CHAPTER 06: FLAGSHIP RESEARCH
  └── Interactive Morphing UAV research story

CHAPTER 07: SCIENTIFIC VALIDATION
  └── Instrument UI: AeroForge vs Abbott Wind Tunnel Data vs ISO Atmosphere

CHAPTER 08: PHYSICS AI
  └── Neural Operators (FNO/DeepONet) vs Analytical vs Numerical classification

CHAPTER 09: RESEARCH & LITERATURE
  └── arXiv & OpenAlex paper search with instant IEEE/BibTeX citation generation

CHAPTER 10: PUBLIC ARTIFACTS
  └── Shareable, reproducible research knowledge artifacts

CHAPTER 11: EXIT / CTA
  └── Environment recedes; "BUILD SOMETHING WORTH VALIDATING."
```
