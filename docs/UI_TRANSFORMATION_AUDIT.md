# AeroForge AI — Visual & UX Transformation Audit

This audit establishes a baseline of the current AeroForge AI user experience, design system, and technical pages. It evaluates the application against the target aesthetic of a **premium, precise, high-density scientific engineering workstation** (inspired by MengTo/Skills, MengTo/kage, and UI/UX Pro Max) rather than a generic SaaS or consumer-facing dashboard.

---

## 1. Executive Summary & Scoring Table

| Major Area | Score (1-10) | Primary Issue Identified | Key Priority |
| :--- | :---: | :--- | :---: |
| **Global Shell & Navigation** | `6/10` | Disconnected SaaS feel, generic layout, lack of breadcrumb hierarchy | **P1** |
| **Homepage Transformation** | `7/10` | Mix of SaaS marketing and technical elements; scroll-driven 3D is disjointed | **P0** |
| **Project Workspace** | `5/10` | Generic dashboard tabs; the "Digital Thread" lacks clear visual integration | **P0** |
| **AeroLab (Aerodynamics Suite)** | `6/10` | Sidebar is a standard text list; visualizations are basic and lack contour controls | **P0** |
| **MechLab (Structures Suite)** | `5/10` | Structural beam solvers feel like flat 2D form controls; lacks interactive 3D FEA stress feedback | **P0** |
| **AstroLab (Orbital Suite)** | `6/10` | Heavy tools load slowly; 3D scenes lack cohesive camera transitions and telemetry | **P1** |
| **Physics AI Lab** | `6/10` | Surrogate model registry lacks data context; flow visualizations are standard | **P1** |
| **Validation Center** | `5/10` | Abbott wind tunnel validation is static; tabular data is hard to compare | **P1** |
| **Research Hub** | `6/10` | Literature tabs are simple forms; citation copying lacks smooth animations | **P2** |
| **Interactive Demo** | `6/10` | Standard tutorial modal layout; feels generic and not integrated into the canvas | **P2** |
| **Public Share Artifacts** | `5/10` | Layout feels like an empty state page; no visualization telemetry overlay | **P1** |
| **Design Tokens & Typography** | `4/10` | Mismatch between Roboto headers, Inter text, and JetBrains Mono; lacks unified space/color tokens | **P0** |
| **Motion & Animation** | `4/10` | Fragmented Framer Motion configurations; default settings cause layout jumps | **P0** |
| **Responsive & Accessibility** | `5/10` | Forms overflow on mobile (390px-430px); focus outlines are inconsistent | **P1** |

---

## 2. Detailed Audit by Phase

### Phase 1: Design System & Design Tokens
*   **Current State:**
    *   Colors are defined separately in `professional.css` (using CSS variables) and `tailwind.config.mjs` (in the Tailwind config object). Colors like `#0F172A` and `#1E293B` look like default Tailwind slate colors rather than customized high-density laboratory tones.
    *   Fonts are mixed: Tailwind defines `heading` and `paragraph` as `roboto`, but body styles in `professional.css` apply `Inter`.
    *   Borders and borders-subtle are inconsistent. Some cards use `border-foreground/10`, others use `border-white/10`.
*   **Identified Issues:**
    *   `P0` - Mismatched typography system (Roboto vs Inter vs JetBrains Mono).
    *   `P0` - Lack of unified dark theme tokens for nested surface panels (`--af-bg`, `--af-surface-1`, `--af-surface-2`, `--af-surface-3`).
    *   `P1` - Standard Radix/Shadcn buttons (`components/ui/button.tsx`) have `hover:underline` styling, which looks like a text hyperlink rather than a precise engineering trigger button.
*   **Transformation Action:** Refactor `src/styles/professional.css` and `tailwind.config.mjs` to establish custom variables and typography styles, and update `components/ui/button.tsx` to have technical borders, micro-glows, and monospace sizing.

### Phase 2: Global Shell & Navigation
*   **Current State:**
    *   `components/Header.tsx` uses a default sticky layout with transparent backing and cyan text.
    *   Command Palette (`components/CommandPalette.tsx`) works, but lists commands using simple list rendering without group styling.
    *   `components/Footer.tsx` uses a simple grid layout with a disclaimer at the bottom.
*   **Identified Issues:**
    *   `P1` - Nav bar feels like a generic SaaS header. It should feel like an integrated control dashboard.
    *   `P1` - Ctrl/Cmd + K command palette matches inputs in case-sensitive ways and doesn't support keyboard arrow-key navigation correctly.
*   **Transformation Action:** Redesign the header to use precise pixel grids, thin border partitions, and telemetry indicators (e.g. active unit system, network status, WebGL state). Refactor the Command Palette to look like an IDE search overlay with interactive categorization.

### Phase 3: Homepage (Cinematic Introduction)
*   **Current State:**
    *   `components/pages/HomePage.tsx` has a scroll-driven 3D scene (`Engineering3DCanvas.tsx`), but the transitions between chapters are sudden.
    *   It relies on marketing buzzwords like "CONNECTED" and "REVOLUTIONARY" rather than displaying technical telemetry and solver specs.
*   **Identified Issues:**
    *   `P0` - The homepage hero has standard SaaS landing page layout grids.
    *   `P1` - Chapter cards on scroll cause layout shifting on mobile screen sizes.
*   **Transformation Action:** Refactor `HomePage.tsx` to align with the narrative chapters. Add custom telemetry indicators, clean technical borders, dynamic grid overlays, and smooth spring-based camera movements in the 3D scene.

### Phase 4: Projects & Digital Thread Workspace
*   **Current State:**
    *   `components/pages/ProjectsPage.tsx` lists projects in a flat card layout.
    *   `components/pages/ProjectWorkspacePage.tsx` features a tabbed view. The "Digital Thread" is a simple node flow block (`DigitalThreadProvenance.tsx`).
*   **Identified Issues:**
    *   `P0` - Digital Thread nodes do not update live and look like isolated diagram blocks.
    *   `P1` - Project creation flow asks for basic name/desc, missing critical engineering contexts (domain, reference solver).
*   **Transformation Action:** Redesign the project page to look like an engineering catalog with real-time metadata. Rework `DigitalThreadProvenance.tsx` into an interactive breadcrumb or horizontal pipeline with animated telemetry particles passing between active blocks (Geometry -> Solver -> Result).

### Phase 5: AeroLab (Aerodynamics)
*   **Current State:**
    *   `components/aerolab/AeroLabHub.tsx` lists 20 solvers in a simple sidebar.
    *   Calculations render in `ToolShell.tsx`. Visualizations use standard Recharts line charts.
*   **Identified Issues:**
    *   `P0` - AeroLab sidebar is a plain scrollbox with cyan selection highlights, lacking clear visual grouping.
    *   `P1` - Visualizations of pressure contours and streamlines are simple flat arrays.
*   **Transformation Action:** Upgrade the sidebar to group solvers by mechanical category (e.g., Potential Flow, Supersonic, Compressible) with inline tags. Rework `ToolShell.tsx` to structure the flow (Inputs -> Method -> Assumptions -> Run -> Results) sequentially with micro-animations.

### Phase 6 & 7: MechLab & AstroLab Hubs
*   **Current State:**
    *   `components/mechlab/MechLabHub.tsx` contains beam bending calculations with basic forms.
    *   `components/astrolab/` contains 14 files for orbital parameters, constellations, coordinates, and spacecraft reentry.
*   **Identified Issues:**
    *   `P0` - MechLab lacks interactive 3D visual feedback for structural deformation.
    *   `P1` - AstroLab tools like `OrbitalMechanics.tsx` and `PorkchopPlotGenerator.tsx` load heavy datasets and render complex plots that lag without frame throttling.
*   **Transformation Action:** Integrate 3D structural previews in MechLab. For AstroLab, implement rendering performance controls (controlled device pixel ratios, throttled calculations) and smooth GSAP/spring transitions.

### Phase 8: Physics AI Lab
*   **Current State:**
    *   `components/pages/PhysicsAiLabPage.tsx` manages Surrogate Model runtime configurations.
    *   `physicsAi/AirfoilExperimentUI.tsx` runs the FNO models.
*   **Identified Issues:**
    *   `P1` - Inference latency metrics are printed in simple labels without comparative graphs.
*   **Transformation Action:** Add telemetry overlays that compare Physics AI inference times (14ms) directly with traditional numerical solvers (minutes/hours) on an interactive chart.

### Phase 9 & 10: Validation & Research
*   **Current State:**
    *   `components/pages/ValidationCenter.tsx` compares results with Abbott Wind Tunnel data.
    *   `components/pages/DocumentationPage.tsx` searches arXiv/OpenAlex.
*   **Identified Issues:**
    *   `P1` - Validation comparisons lack visual error bars or confidence intervals.
    *   `P2` - Research citation export is a plain text box with no clear copying visual feedback.
*   **Transformation Action:** Add visual error bands to the Validation Center comparison charts and implement micro-interactions for copying BibTeX citations in the Research Hub.

---

## 3. Prioritized Action Plan

*   **P0 (Critical Interaction & Aesthetics):**
    *   Establish unified design tokens (`professional.css`) and clean sans-serif/monospace font hierarchy.
    *   Refactor the Homepage into a technical narrative with scroll-scrubbed WebGL camera paths.
    *   Rework the Project Workspace and the Digital Thread interface into a persistent engineering workstation.
    *   Improve tool input layouts in `ToolShell.tsx` to represent the sequential scientific method.
*   **P1 (Visual Alignment & Telemetry):**
    *   Redesign navigation shell, headers, footers, and command palette with telemetry overlays.
    *   Add responsive mobile fallbacks for complex 3D forms.
    *   Upgrade charts to look like scientific instruments (grid overlays, clear legends, error bounds).
*   **P2 (Polish & Micro-interactions):**
    *   Introduce micro-interactions (150ms-250ms) for hover states, tab switches, and citation copies.
    *   Clean up WebGL render cycles and dispose of buffers to prevent leaks on unmount.
