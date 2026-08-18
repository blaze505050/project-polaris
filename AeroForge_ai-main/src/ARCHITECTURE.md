# AeroForge AI - Engineering Operating System Architecture

## Phase 0: Product Architecture Audit

### Current State Analysis
**Existing Modules:**
- Compiler (DSL-based CAD generation)
- Virtual Lab (generic simulation interface)
- Advanced Tools (optimization, analysis)
- Documentation (knowledge base)
- CAD Workspace (geometry preview)
- CFD Visualization
- 3D Viewer & Preview
- Performance Monitoring
- Validation & Reporting

**Issues Identified:**
1. **Tool-Centric Design**: Each tool is isolated; no unified project context
2. **Redundant Functionality**: Multiple visualization, simulation, and analysis modules
3. **Missing Core Infrastructure**: No project management, no engineering notebook, no dataset manager
4. **Broken Digital Thread**: No connection between design → simulation → validation → publication
5. **No AI Context**: AI suggestions exist but lack project-wide understanding
6. **Fragmented Data**: No unified data model for designs, simulations, results

### Consolidation Strategy
- **Merge**: CFD Visualization + Advanced Physics Visualizer → Unified Simulation Viewer
- **Merge**: CAD Workspace + 3D Viewer → Unified Geometry Engine
- **Merge**: Performance Monitor + Convergence Monitor → Unified Compute Monitor
- **Remove**: Redundant UI components, duplicate services
- **Create**: Project-centric navigation, unified data model

---

## Phase 1: Engineering OS Foundation (MVP)

### Core Architecture

```
AeroForge OS
├── Navigation (Command Center Sidebar)
│   ├── Dashboard
│   ├── Projects
│   ├── Research
│   ├── Labs
│   ├── Compute
│   ├── Knowledge
│   └── Marketplace
├── Project Workspace (Primary Container)
│   ├── Engineering Notebook (Jupyter-style)
│   ├── Simulation Manager (Queue, Logs, Resources)
│   ├── Dataset Manager (Geometry, Meshes, Results)
│   ├── Results Viewer (Unified visualization)
│   └── Validation Panel
├── Specialized Labs (Pluggable)
│   ├── Aerodynamics Lab
│   ├── Structures Lab
│   ├── Propulsion Lab
│   └── [12 more labs]
└── AI Copilot (Project-aware)
```

### Data Model

```typescript
// Core Entities
Project {
  _id: string
  name: string
  description: string
  owner: string
  status: 'active' | 'archived' | 'completed'
  createdDate: Date
  updatedDate: Date
  tags: string[]
}

ProjectWorkspace {
  projectId: string
  activeTab: 'notebook' | 'simulations' | 'datasets' | 'results' | 'validation'
  notebookContent: string (markdown + code blocks)
  selectedDataset: string
  selectedSimulation: string
}

Simulation {
  _id: string
  projectId: string
  name: string
  type: 'cfd' | 'fea' | 'thermal' | 'optimization'
  status: 'queued' | 'running' | 'completed' | 'failed'
  inputParameters: JSON
  resultSummary: string
  computeTime: number
  createdDate: Date
}

Dataset {
  _id: string
  projectId: string
  name: string
  type: 'geometry' | 'mesh' | 'results' | 'csv' | 'matlab'
  fileUrl: string
  metadata: JSON
  createdDate: Date
}

ValidationReport {
  _id: string
  projectId: string
  simulationId: string
  status: 'pass' | 'fail' | 'warning'
  checks: ValidationCheck[]
  createdDate: Date
}
```

### Navigation Structure

**Sidebar (Always Visible)**
```
┌─────────────────────────┐
│ AeroForge OS            │
├─────────────────────────┤
│ 🏠 Dashboard            │
│ 📁 Projects             │
│ 📚 Research             │
│ 🔬 Labs                 │
│ ⚙️  Compute             │
│ 💡 Knowledge            │
│ 🛒 Marketplace          │
├─────────────────────────┤
│ Current Project:        │
│ [Project Name]          │
│ ├─ Notebook             │
│ ├─ Simulations          │
│ ├─ Datasets             │
│ ├─ Results              │
│ └─ Validation           │
├─────────────────────────┤
│ AI Copilot              │
│ [Chat Interface]        │
└─────────────────────────┘
```

---

## Phase 2: Specialized Laboratories

### Lab Structure

Each lab is a specialized workspace with domain-specific tools:

**Aerodynamics Lab**
- Airfoil Studio (2D airfoil design & analysis)
- Wing Studio (3D wing design)
- CFD Studio (mesh generation, solver setup)
- Wind Tunnel (virtual wind tunnel)
- Flow Visualization (streamlines, pressure fields)
- Boundary Layer Analysis
- Compressible Flow Tools
- Hypersonics Tools
- Rotorcraft Tools
- UAV Tools

**Structures Lab**
- FEA Workspace
- Modal Analysis
- Buckling Analysis
- Fatigue Analysis
- Composite Analysis
- Topology Optimization

**Propulsion Lab**
- Jet Engine Design
- Rocket Engine Design
- Electric Propulsion
- Hybrid Propulsion
- Turbomachinery
- Combustion Analysis

**[9 More Labs]**

### Lab Integration
- All labs share the same Project, Dataset, Notebook, Simulation, and AI systems
- Results from one lab feed into another (e.g., CFD results → FEA loads)
- Unified data model prevents duplication

---

## Phase 3: Engineering Workflow

### Continuous Workflow

```
Requirements
    ↓
Research (Literature + Knowledge Base)
    ↓
Concept Design (Sketches + CAD)
    ↓
CAD Modeling (Parametric geometry)
    ↓
Meshing (Mesh generation & validation)
    ↓
CFD Analysis (Aerodynamics)
    ↓
FEA Analysis (Structures)
    ↓
Thermal Analysis
    ↓
Optimization (Multi-objective)
    ↓
Manufacturing (CAM, tolerances)
    ↓
Validation (Against requirements)
    ↓
Reports (Technical documentation)
    ↓
Publication (Share results)
    ↓
Knowledge Base (Lessons learned)
    ↓
Version History (Track iterations)
    ↓
Future Projects (Reuse templates)
```

**No isolated calculators or one-off tools.**

---

## Phase 4: Digital Thread

### Complete Data Lineage

```
Requirements Document
    ↓ (defines)
Design Specification
    ↓ (drives)
CAD Model (v1, v2, v3...)
    ↓ (generates)
Mesh (structured, unstructured)
    ↓ (inputs to)
CFD Simulation (Mach, Re, AoA)
    ↓ (produces)
Flow Field Results
    ↓ (loads for)
FEA Simulation
    ↓ (produces)
Stress/Strain Results
    ↓ (validates against)
Design Criteria
    ↓ (if fail, triggers)
Optimization Loop
    ↓ (if pass, generates)
Technical Report
    ↓ (published to)
Knowledge Base
    ↓ (informs)
Future Projects
```

**Key Principle**: No duplicated data. Single source of truth for each artifact.

---

## Phase 5: Engineering Intelligence (AI Copilot)

### AI Context Memory

The AI Copilot maintains project-wide context:

```
Project Memory {
  design_history: [CAD versions with changes],
  assumptions: [Design assumptions & rationale],
  simulations: [All simulation runs with parameters],
  meshes: [Mesh strategies & refinement history],
  reports: [Technical reports & findings],
  datasets: [All input/output data],
  equations: [Governing equations used],
  failures: [Failed designs & why],
  optimizations: [Optimization runs & results],
  lessons_learned: [Key insights]
}
```

### AI Behaviors

- **Design Assistant**: Suggests improvements based on past designs
- **Simulation Advisor**: Recommends mesh strategies, solver settings
- **Optimization Guide**: Proposes design variables, constraints
- **Report Generator**: Drafts technical documentation
- **Knowledge Extractor**: Learns from each project

---

## Phase 6: Research Platform

### Research Workspace

```
Research Platform
├── Literature Workspace
│   ├── Paper Library
│   ├── Annotation Tools
│   └── Reading List
├── Paper Reader
│   ├── PDF Viewer
│   ├── Equation Extractor
│   └── Citation Highlighter
├── Citation Manager
│   ├── BibTeX Export
│   ├── Citation Styles
│   └── Reference Library
├── Formula Extractor
│   ├── OCR for Equations
│   └── LaTeX Export
├── Engineering Notebook
│   ├── Markdown Editor
│   ├── Code Blocks
│   └── Equation Support
├── Experiment Comparison
│   ├── Side-by-side Results
│   └── Statistical Analysis
├── Research Timeline
│   └── Project Evolution
└── Publication Generator
    ├── Template Library
    └── Auto-formatting
```

---

## Phase 7: Compute Center

### Job Management

```
Compute Center
├── GPU Queue
│   ├── Job Submission
│   ├── Resource Allocation
│   └── Priority Scheduling
├── CPU Queue
│   ├── Batch Processing
│   └── Load Balancing
├── Batch Jobs
│   ├── Parameter Sweeps
│   ├── Optimization Runs
│   └── Sensitivity Analysis
├── Cloud Compute
│   ├── AWS Integration
│   ├── Azure Integration
│   └── GCP Integration
├── Simulation Logs
│   ├── Real-time Monitoring
│   ├── Error Tracking
│   └── Performance Metrics
├── Resource Monitor
│   ├── GPU Utilization
│   ├── Memory Usage
│   └── Network I/O
└── Job Scheduler
    ├── Cron Jobs
    └── Workflow Automation
```

---

## Phase 8: Marketplace

### Shareable Assets

```
Marketplace
├── Airfoils
│   ├── NACA Profiles
│   ├── Supercritical
│   └── Custom Designs
├── CAD Models
│   ├── Aircraft Components
│   ├── Engine Parts
│   └── Structures
├── CFD Cases
│   ├── Mesh Templates
│   ├── Solver Setups
│   └── Boundary Conditions
├── Mesh Templates
│   ├── Structured Grids
│   ├── Unstructured Meshes
│   └── Hybrid Meshes
├── Material Libraries
│   ├── Aluminum Alloys
│   ├── Composites
│   └── Ceramics
├── AI Agents
│   ├── Design Agents
│   ├── Optimization Agents
│   └── Analysis Agents
├── Optimization Pipelines
│   ├── Multi-objective
│   ├── Surrogate-based
│   └── Evolutionary
├── Plugins
│   ├── Custom Solvers
│   ├── Post-processors
│   └── Validators
└── Research Templates
    ├── Paper Templates
    ├── Experiment Setups
    └── Analysis Workflows
```

---

## UI/UX Philosophy

### Command Center Aesthetic

**Design Principles:**
1. **High-Density Information**: Multiple data streams visible simultaneously
2. **Real-Time Telemetry**: Live monitoring of simulations, resources, AI activity
3. **Professional Visualizations**: NASA/SpaceX-style dashboards
4. **Integrated AI**: Copilot visible in every context
5. **Dark Theme**: Aerospace-grade dark blue (#0F172A) with cyan accents (#0EA5E9)
6. **Monospace Typography**: Technical credibility with Roboto Mono
7. **Grid-Based Layout**: Structured, organized information hierarchy

### Visual Language

- **Status Indicators**: Real-time simulation status, resource usage
- **Data Streams**: Continuous visualization of metrics
- **Command Palette**: Quick access to all functions
- **Context Panels**: Sidebar with project, lab, and AI context
- **Unified Viewer**: Single interface for all visualization types

---

## Implementation Roadmap

### Phase 1 (MVP - Weeks 1-2)
- [ ] Project management system
- [ ] Project workspace with tabs
- [ ] Engineering notebook (basic markdown)
- [ ] Simulation manager (queue, logs)
- [ ] Dataset manager (file upload, metadata)
- [ ] Unified navigation sidebar

### Phase 2 (Weeks 3-4)
- [ ] Restructure Virtual Lab into specialized labs
- [ ] Aerodynamics Lab (Airfoil + CFD Studio)
- [ ] Structures Lab (FEA workspace)
- [ ] Lab integration with project system

### Phase 3 (Weeks 5-6)
- [ ] Engineering workflow UI
- [ ] Results viewer (unified)
- [ ] Validation panel
- [ ] Report generator

### Phase 4 (Weeks 7-8)
- [ ] AI Copilot with project context
- [ ] Research platform (literature + notebook)
- [ ] Compute center (job management)

### Phase 5 (Weeks 9-10)
- [ ] Marketplace (asset sharing)
- [ ] Remaining labs (Propulsion, Thermal, etc.)
- [ ] Advanced features (optimization, digital twin)

---

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand (project, lab, workspace state)
- **Styling**: Tailwind CSS + custom aerospace theme
- **Visualization**: Three.js (3D geometry), Recharts (data), Framer Motion (animations)
- **Data**: Wix CMS collections (projects, simulations, datasets, reports)
- **AI**: Context-aware prompting with project memory
- **Compute**: Job queue system (future: cloud integration)

---

## Success Metrics

1. **Unified Project Context**: All tools operate within a single project
2. **Digital Thread**: Complete lineage from requirements to publication
3. **AI Effectiveness**: Copilot provides actionable suggestions based on project history
4. **Lab Integration**: Results flow seamlessly between labs
5. **User Efficiency**: 50% reduction in context switching vs. current design
6. **Scalability**: Support for 1000+ concurrent users, 10,000+ projects

---

## Next Steps

1. Implement Phase 1 foundation (project system, workspace, navigation)
2. Create CMS collections for Projects, Simulations, Datasets, ValidationReports
3. Build unified sidebar navigation
4. Restructure existing pages into lab modules
5. Implement AI Copilot with project context
