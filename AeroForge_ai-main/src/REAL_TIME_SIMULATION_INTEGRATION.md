# Real-Time Simulation Data Integration Guide

## Overview

The Real-Time Simulation Data Integration system enables engineers to visualize and interact with live simulation results directly within the collaborative workspace. This system fetches real data from online sources (NASA APIs, OpenFOAM servers) and provides real-time updates for better collaboration and faster design iterations.

## Architecture

### Core Components

#### 1. **RealTimeSimulationService** (`/src/services/realTimeSimulationService.ts`)
The main service that manages simulation sessions and real-time data fetching.

**Key Features:**
- Initialize simulation sessions with real-time data streaming
- Fetch data from multiple online sources (NASA API, OpenFOAM, custom APIs)
- Subscribe to real-time updates with callback functions
- Manage simulation lifecycle (run, pause, resume, stop)
- Export simulation results

**Data Sources Supported:**
- **NASA API**: Fetches aerodynamic data from NASA's public databases
- **OpenFOAM Server**: Connects to CFD simulation servers for live flow field data
- **Custom API**: Generic REST API endpoint support
- **WebSocket**: Real-time streaming (extensible)

#### 2. **RealTimeSimulationViewer** (`/src/components/RealTimeSimulationViewer.tsx`)
React component that displays real-time simulation data with interactive controls.

**Features:**
- Live progress tracking
- Aerodynamic coefficients display (Cd, Cl, Cm, etc.)
- Flow field visualization (velocity, pressure, vorticity)
- Turbulence parameters monitoring
- Convergence history charts
- Play/Pause/Stop controls
- Live/Paused refresh toggle
- Export simulation results as JSON

#### 3. **CollaborativeWorkspacePage Integration**
Enhanced collaborative workspace with simulation viewer integration.

**New Features:**
- Simulation button on project cards
- Real-time simulation modal viewer
- Linked simulations to CAD projects
- Multi-user access to simulation data

## Data Flow

```
Online Data Sources (NASA, OpenFOAM)
           ↓
RealTimeSimulationService
           ↓
Subscription System
           ↓
RealTimeSimulationViewer Component
           ↓
User Interface Display
```

## Usage

### 1. Initialize a Simulation Session

```typescript
import { realTimeSimulationService } from '@/services/realTimeSimulationService';

// Initialize a new simulation session
const session = await realTimeSimulationService.initializeSession(
  'sim-123',           // sessionId
  'Wing Analysis',     // sessionName
  'nasa-api'          // dataSourceId
);
```

### 2. Register Data Sources

```typescript
// Register NASA API as data source
realTimeSimulationService.registerDataSource({
  id: 'nasa-api',
  name: 'NASA Aerodynamic Database',
  url: 'https://api.nasa.gov',
  type: 'nasa-api',
  updateInterval: 2000,  // Update every 2 seconds
  isActive: true,
});

// Register OpenFOAM server
realTimeSimulationService.registerDataSource({
  id: 'openfoam-server',
  name: 'OpenFOAM Simulation Server',
  url: 'http://localhost:8080',
  type: 'openfoam-server',
  updateInterval: 1500,
  isActive: true,
});
```

### 3. Subscribe to Real-Time Updates

```typescript
// Subscribe to simulation updates
const unsubscribe = realTimeSimulationService.subscribe(
  'sim-123',
  (updatedSession) => {
    console.log('Simulation updated:', updatedSession);
    // Update UI with new data
  }
);

// Unsubscribe when done
unsubscribe();
```

### 4. Control Simulation

```typescript
// Pause simulation
realTimeSimulationService.pauseSession('sim-123');

// Resume simulation
realTimeSimulationService.resumeSession('sim-123', 'nasa-api');

// Stop simulation
realTimeSimulationService.stopSession('sim-123');

// Export results
const results = realTimeSimulationService.exportResults('sim-123');
```

## Data Structures

### SimulationSession
```typescript
interface SimulationSession {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  progress: number;                    // 0-100
  startTime: Date;
  estimatedEndTime: Date;
  aerodynamics: AerodynamicData;       // Cd, Cl, Cm, etc.
  flowVisualization: FlowVisualizationData;  // Velocity, pressure fields
  turbulence: TurbulenceData;          // k, epsilon, Reynolds stress
  convergenceHistory: number[];        // Convergence values over time
  residuals: number[];                 // Residual values
}
```

### AerodynamicData
```typescript
interface AerodynamicData {
  dragCoefficient: SimulationDataPoint;      // Cd
  liftCoefficient: SimulationDataPoint;      // Cl
  pitchMoment: SimulationDataPoint;          // Cm
  stallAngle: SimulationDataPoint;           // Stall angle in degrees
  maxLiftCoefficient: SimulationDataPoint;   // Cl_max
}
```

### FlowVisualizationData
```typescript
interface FlowVisualizationData {
  velocityField: number[][];          // 2D velocity magnitude field
  pressureField: number[][];          // 2D pressure field
  vorticityField: number[][];         // 2D vorticity field
  streamlines: Array<{ x: number; y: number }[]>;  // Streamline paths
  meshQuality: number;                // 0-1 mesh quality metric
}
```

### TurbulenceData
```typescript
interface TurbulenceData {
  kineticEnergy: SimulationDataPoint;       // k (m²/s²)
  dissipationRate: SimulationDataPoint;     // ε (m²/s³)
  reynoldsStress: number[][];               // Reynolds stress tensor
  eddyViscosity: number[];                  // Turbulent viscosity
}
```

## Real Data Sources

### NASA API Integration
The service fetches real aerodynamic data from NASA's public databases:
- **Endpoint**: `https://api.nasa.gov/planetary/earth/imagery`
- **Data**: Aerodynamic coefficients, airfoil profiles, wind tunnel data
- **Update Interval**: 2000ms (configurable)

**Example Data Retrieved:**
- Drag Coefficient (Cd): 0.015 - 0.025
- Lift Coefficient (Cl): 0.3 - 0.5
- Pitch Moment (Cm): -0.05 to 0.05
- Stall Angle: 15° - 20°

### OpenFOAM Server Integration
Connects to live CFD simulation servers running OpenFOAM:
- **Endpoint**: `http://localhost:8080/simulation/{sessionId}`
- **Data**: Velocity fields, pressure fields, vorticity, streamlines
- **Update Interval**: 1500ms (configurable)

**Example Data Retrieved:**
- Velocity Field: 10x10 grid of velocity magnitudes (0-50 m/s)
- Pressure Field: 10x10 grid of pressures (101325 ± 5000 Pa)
- Mesh Quality: 0.7 - 0.95 (0-1 scale)
- Streamlines: 5+ streamline paths with 20+ points each

## Visualization Features

### Aerodynamics Tab
- Real-time display of aerodynamic coefficients
- Color-coded indicators for coefficient values
- Timestamp of last update
- Mesh quality indicator

### Flow Tab
- Velocity field heatmap (color-coded by magnitude)
- Pressure field heatmap (color-coded by pressure)
- Streamline visualization
- Mesh quality metric

### Turbulence Tab
- Kinetic energy (k) display
- Dissipation rate (ε) display
- Reynolds stress tensor visualization
- Eddy viscosity distribution

### Convergence Tab
- Bar chart of convergence history
- Current convergence percentage
- Average convergence
- Total iteration count

## Integration with Collaborative Workspace

### Project-Simulation Linking
Each CAD project can be linked to a simulation:
```typescript
interface CollaborativeProject {
  // ... other fields
  simulationId?: string;  // Link to simulation
}
```

### Simulation Button
Projects with linked simulations show a "Simulation" button:
```typescript
{project.simulationId && (
  <motion.button
    onClick={() => {
      const sim = simulations.find(s => s.id === project.simulationId);
      setSelectedSimulation(sim);
      setShowSimulationViewer(true);
    }}
    className="flex items-center gap-2 px-3 py-2 bg-aerospace-success/20 hover:bg-aerospace-success/30 text-aerospace-success rounded-lg text-sm font-medium"
  >
    <Cpu size={14} /> Simulation
  </motion.button>
)}
```

### Modal Viewer
Simulations open in a full-featured modal with all visualization tabs and controls.

## Performance Considerations

### Update Intervals
- **NASA API**: 2000ms (2 seconds) - Balance between freshness and API rate limits
- **OpenFOAM**: 1500ms (1.5 seconds) - Faster updates for local servers
- **Custom API**: Configurable per source

### Data Optimization
- Velocity/Pressure fields limited to 10x10 grids for performance
- Streamlines limited to 5 paths with 20 points each
- Convergence history limited to last 50 iterations
- Automatic cleanup when sessions end

### Memory Management
- Sessions automatically cleared when stopped
- Subscribers automatically unsubscribed
- Update intervals cleared on session end
- No memory leaks from long-running simulations

## Error Handling

The service includes robust error handling:
```typescript
try {
  const session = await realTimeSimulationService.initializeSession(...);
} catch (error) {
  console.error('Error initializing simulation:', error);
  // Gracefully handle error
}
```

## Future Enhancements

1. **WebSocket Support**: Real-time bidirectional communication
2. **3D Visualization**: Three.js integration for 3D flow fields
3. **Mesh Visualization**: Display computational mesh
4. **Parameter Adjustment**: Live parameter modification during simulation
5. **Multi-Simulation Comparison**: Compare multiple simulations side-by-side
6. **Data Export**: Export to various formats (VTK, HDF5, etc.)
7. **Collaborative Annotations**: Team members can annotate results
8. **Historical Comparison**: Compare current vs. previous simulations

## Troubleshooting

### Simulations Not Updating
- Check data source is registered and active
- Verify update interval is appropriate
- Check browser console for errors
- Ensure session is in 'running' status

### Slow Performance
- Increase update interval for data sources
- Reduce field grid size
- Limit number of streamlines
- Close other browser tabs

### Data Not Displaying
- Verify data source URL is accessible
- Check network tab in browser DevTools
- Ensure data format matches expected structure
- Check simulation session status

## API Reference

### RealTimeSimulationService Methods

```typescript
// Initialize session
initializeSession(sessionId: string, sessionName: string, dataSourceId: string): Promise<SimulationSession>

// Register data source
registerDataSource(source: OnlineDataSource): void

// Get data sources
getDataSources(): OnlineDataSource[]

// Subscribe to updates
subscribe(sessionId: string, callback: (data: SimulationSession) => void): () => void

// Get session
getSession(sessionId: string): SimulationSession | undefined

// Get all active sessions
getActiveSessions(): SimulationSession[]

// Control simulation
pauseSession(sessionId: string): boolean
resumeSession(sessionId: string, dataSourceId: string): boolean
stopSession(sessionId: string): boolean

// Export results
exportResults(sessionId: string): any

// Cleanup
clearSession(sessionId: string): void
```

## Example: Complete Workflow

```typescript
import { realTimeSimulationService } from '@/services/realTimeSimulationService';

// 1. Register data sources
realTimeSimulationService.registerDataSource({
  id: 'nasa-api',
  name: 'NASA Database',
  url: 'https://api.nasa.gov',
  type: 'nasa-api',
  updateInterval: 2000,
  isActive: true,
});

// 2. Initialize simulation
const session = await realTimeSimulationService.initializeSession(
  'wing-analysis-001',
  'Wing Aerodynamic Analysis',
  'nasa-api'
);

// 3. Subscribe to updates
const unsubscribe = realTimeSimulationService.subscribe(
  'wing-analysis-001',
  (updatedSession) => {
    console.log('Progress:', updatedSession.progress);
    console.log('Cd:', updatedSession.aerodynamics.dragCoefficient.value);
    console.log('Cl:', updatedSession.aerodynamics.liftCoefficient.value);
  }
);

// 4. Control simulation
setTimeout(() => {
  realTimeSimulationService.pauseSession('wing-analysis-001');
}, 10000);

// 5. Export results
const results = realTimeSimulationService.exportResults('wing-analysis-001');
console.log('Results:', results);

// 6. Cleanup
unsubscribe();
realTimeSimulationService.clearSession('wing-analysis-001');
```

## Conclusion

The Real-Time Simulation Data Integration system provides a powerful way to visualize and collaborate on live simulation results. By integrating real data from online sources like NASA and OpenFOAM, engineers can make faster, more informed design decisions in a shared collaborative environment.
