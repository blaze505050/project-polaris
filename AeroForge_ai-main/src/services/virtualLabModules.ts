/**
 * Virtual Lab Modules System
 * Comprehensive integration of 12 aerospace research modules
 * with subsystems, tools, capabilities, AI enhancements, and cloud architecture
 */

export interface ModuleSubsystem {
  name: string;
  description: string;
  capabilities: string[];
}

export interface ModuleTool {
  name: string;
  description: string;
  type: 'GUI' | 'CLI' | 'API' | 'Web IDE';
}

export interface ModuleCapability {
  name: string;
  description: string;
  physicsLevel: 'simplified' | 'intermediate' | 'advanced' | 'research-grade';
}

export interface AIEnhancement {
  name: string;
  description: string;
  capability: string;
}

export interface CloudArchitecture {
  infrastructure: string;
  scalability: string;
  dataManagement: string;
}

export interface VirtualLabModule {
  id: string;
  number: string;
  title: string;
  description: string;
  subsystems: ModuleSubsystem[];
  tools: ModuleTool[];
  capabilities: ModuleCapability[];
  aiEnhancements: AIEnhancement[];
  cloudArchitecture: CloudArchitecture;
  color: string;
  icon: string;
}

export const VIRTUAL_LAB_MODULES: VirtualLabModule[] = [
  // ===== MODULE 1.1: AERODYNAMICS LABS =====
  {
    id: 'module-1-1',
    number: '1.1',
    title: 'Aerodynamics Labs (Virtual Wind Tunnels)',
    description: 'Complete virtual wind tunnel environment with subsonic to hypersonic capabilities',
    subsystems: [
      {
        name: 'Test-case Manager',
        description: 'Organize and manage aerodynamic test scenarios',
        capabilities: ['Test creation', 'Scenario management', 'Result archiving'],
      },
      {
        name: 'Virtual Wind-Tunnel Types',
        description: 'Multiple wind tunnel configurations',
        capabilities: ['Subsonic tunnels', 'Transonic tunnels', 'Supersonic tunnels', 'Hypersonic tunnels'],
      },
      {
        name: 'Model Geometry Manager',
        description: 'Handle complex 3D geometries and CAD imports',
        capabilities: ['CAD import/export', 'Geometry validation', 'Mesh generation'],
      },
      {
        name: 'Instrumentation Emulator',
        description: 'Simulate physical measurement instruments',
        capabilities: ['Pressure sensors', 'Force balances', 'Temperature probes'],
      },
      {
        name: 'Unsteady Data Capture',
        description: 'Capture time-dependent aerodynamic phenomena',
        capabilities: ['Time-series recording', 'Transient analysis', 'Frequency domain analysis'],
      },
    ],
    tools: [
      {
        name: 'Parametric CAD Import/Export',
        description: 'Seamless integration with CAD systems',
        type: 'API',
      },
      {
        name: 'Pre/Postprocessing GUI & CLI',
        description: 'Comprehensive data processing tools',
        type: 'GUI',
      },
      {
        name: 'Virtual Sensors',
        description: 'Emulated measurement instruments',
        type: 'Web IDE',
      },
      {
        name: 'Time-Series Database',
        description: 'High-performance data storage',
        type: 'API',
      },
    ],
    capabilities: [
      {
        name: 'Subsonic Flow Analysis',
        description: 'Incompressible and low-speed compressible flows',
        physicsLevel: 'advanced',
      },
      {
        name: 'Transonic Flow Analysis',
        description: 'Mixed subsonic-supersonic flow regimes',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Supersonic Flow Analysis',
        description: 'Shock-expansion theory and shock-boundary layer interaction',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Hypersonic Flow Analysis',
        description: 'Entropy layer effects and entropy gradients',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Coupled Aeroelastic FSI',
        description: 'Fluid-structure interaction with structural deformation',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Time-Accurate Unsteady Simulations',
        description: 'Transient aerodynamic phenomena',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Aeroacoustics',
        description: 'Noise generation and propagation',
        physicsLevel: 'research-grade',
      },
    ],
    aiEnhancements: [
      {
        name: 'ML-based Inflow Generation',
        description: 'Machine learning for realistic turbulent inflow conditions',
        capability: 'Turbulence modeling',
      },
      {
        name: 'Surrogate Models for Lift/Drag',
        description: 'Neural network surrogates for rapid aerodynamic prediction',
        capability: 'Performance prediction',
      },
      {
        name: 'Active Experiment Suggestion',
        description: 'AI recommends optimal test cases',
        capability: 'Experiment planning',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'GPU-backed auto-scaling clusters',
      scalability: 'Horizontal scaling for parallel simulations',
      dataManagement: 'Data lake for transient datasets with streaming telemetry bus',
    },
    color: 'from-blue-500 to-cyan-500',
    icon: 'Wind',
  },

  // ===== MODULE 1.2: WIND TUNNELS =====
  {
    id: 'module-1-2',
    number: '1.2',
    title: 'Wind Tunnels (Subsonic/Supersonic/Hypersonic)',
    description: 'Specialized wind tunnel simulation for extreme flow regimes',
    subsystems: [
      {
        name: 'Mach-Number Control',
        description: 'Precise control of flow speed regimes',
        capabilities: ['Subsonic control', 'Transonic control', 'Supersonic control', 'Hypersonic control'],
      },
      {
        name: 'Nozzle Configuration Library',
        description: 'Pre-configured and custom nozzle designs',
        capabilities: ['Convergent nozzles', 'Convergent-divergent nozzles', 'Custom geometries'],
      },
      {
        name: 'Cryogenic/Thermal Control',
        description: 'Temperature management for high-speed flows',
        capabilities: ['Cryogenic cooling', 'Heating systems', 'Temperature monitoring'],
      },
    ],
    tools: [
      {
        name: 'Virtual Calibration Suites',
        description: 'Instrument calibration and validation',
        type: 'GUI',
      },
      {
        name: 'Plume & Combustion Couplers',
        description: 'Integration with propulsion systems',
        type: 'API',
      },
    ],
    capabilities: [
      {
        name: 'Real-Gas Models',
        description: 'Non-ideal gas behavior at extreme conditions',
        physicsLevel: 'research-grade',
      },
      {
        name: 'High-Temperature Air Chemistry',
        description: 'Ionization and chemical reactions at high temperatures',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Shock-Boundary Layer Interaction',
        description: 'Complex shock-induced separation',
        physicsLevel: 'research-grade',
      },
    ],
    aiEnhancements: [
      {
        name: 'ML-based Shock Position Prediction',
        description: 'Neural networks predict shock locations',
        capability: 'Shock dynamics',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'High memory instances for complex thermodynamics',
      scalability: 'Hybrid on-premises GPU bursting for peak loads',
      dataManagement: 'Real-time data streaming and archival',
    },
    color: 'from-purple-500 to-pink-500',
    icon: 'Zap',
  },

  // ===== MODULE 1.3: CFD SIMULATION CLUSTERS =====
  {
    id: 'module-1-3',
    number: '1.3',
    title: 'CFD Simulation Clusters (Enterprise CFD-as-a-Service)',
    description: 'Enterprise-scale CFD infrastructure with massive parallelization',
    subsystems: [
      {
        name: 'Multi-Tenant Job Scheduler',
        description: 'Manage multiple concurrent simulations',
        capabilities: ['Job queuing', 'Priority management', 'Resource allocation'],
      },
      {
        name: 'Solver Catalog',
        description: 'Collection of CFD solvers',
        capabilities: ['RANS solvers', 'LES solvers', 'DES solvers', 'DNS solvers'],
      },
      {
        name: 'Mesh Bank with AMR',
        description: 'Adaptive mesh refinement library',
        capabilities: ['Mesh generation', 'Mesh adaptation', 'Mesh optimization'],
      },
      {
        name: 'Checkpointing & Time-Travel Debugging',
        description: 'Simulation state management',
        capabilities: ['Checkpoint creation', 'Restart capability', 'Debugging tools'],
      },
    ],
    tools: [
      {
        name: 'Web IDE + Jupyter Lab',
        description: 'Interactive simulation environment',
        type: 'Web IDE',
      },
      {
        name: 'REST & gRPC APIs',
        description: 'Programmatic access to solvers',
        type: 'API',
      },
      {
        name: 'Monitoring Dashboards',
        description: 'Real-time simulation monitoring',
        type: 'GUI',
      },
    ],
    capabilities: [
      {
        name: 'Massive Parallel GPU & CPU Scaling',
        description: 'Petascale computing capabilities',
        physicsLevel: 'research-grade',
      },
      {
        name: 'In-Situ Visualization',
        description: 'Real-time visualization during simulation',
        physicsLevel: 'advanced',
      },
      {
        name: 'Streaming Slices',
        description: 'Continuous data extraction',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'ML-Accelerated Linear Algebra',
        description: 'Neural network acceleration for matrix operations',
        capability: 'Solver acceleration',
      },
      {
        name: 'Learned Turbulence Closure Models',
        description: 'Data-driven turbulence modeling',
        capability: 'Turbulence modeling',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'Kubernetes + Slurm hybrid orchestration',
      scalability: 'NVMe scratch storage, Lustre/GPFS parallel filesystem, cold storage archival',
      dataManagement: 'Distributed data management with automatic tiering',
    },
    color: 'from-orange-500 to-red-500',
    icon: 'Cpu',
  },

  // ===== MODULE 1.4: STRUCTURAL TESTING LABS =====
  {
    id: 'module-1-4',
    number: '1.4',
    title: 'Structural Testing Labs (Virtual Testbeds)',
    description: 'Advanced structural analysis and testing simulation',
    subsystems: [
      {
        name: 'Virtual Load Frames & Actuators',
        description: 'Simulated mechanical testing equipment',
        capabilities: ['Tensile testing', 'Compression testing', 'Shear testing'],
      },
      {
        name: 'Material Nonlinearities',
        description: 'Nonlinear material behavior',
        capabilities: ['Plasticity', 'Creep', 'Damage evolution'],
      },
      {
        name: 'Vibration & Modal Test Rig',
        description: 'Modal analysis and vibration testing',
        capabilities: ['Modal analysis', 'Frequency response', 'Damping measurement'],
      },
    ],
    tools: [
      {
        name: 'FEA Solver Integrations',
        description: 'Integration with commercial FEA packages',
        type: 'API',
      },
      {
        name: 'Digital Strain Gauge Emulation',
        description: 'Virtual measurement instruments',
        type: 'GUI',
      },
    ],
    capabilities: [
      {
        name: 'Multi-Scale Structural Models',
        description: 'From micro to macro scale analysis',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Fatigue Life Prediction',
        description: 'S-N curve analysis and Miner\'s rule',
        physicsLevel: 'advanced',
      },
      {
        name: 'Mission Spectrum Analysis',
        description: 'Load spectrum analysis',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'Bayesian Experimental Planning',
        description: 'Optimal test design using Bayesian methods',
        capability: 'Experiment optimization',
      },
      {
        name: 'Anomaly Detection on Modal Response',
        description: 'ML-based damage detection',
        capability: 'Structural health monitoring',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'High-memory nodes for sparse matrix solvers',
      scalability: 'Distributed sparse linear algebra',
      dataManagement: 'Time-series database for test data',
    },
    color: 'from-red-500 to-pink-500',
    icon: 'Layers',
  },

  // ===== MODULE 1.5: MATERIAL SCIENCE LABS =====
  {
    id: 'module-1-5',
    number: '1.5',
    title: 'Material Science Labs (Virtual Materials Foundry)',
    description: 'Materials discovery and characterization platform',
    subsystems: [
      {
        name: 'Materials Database',
        description: 'Comprehensive materials property database',
        capabilities: ['Property lookup', 'Composition search', 'Performance filtering'],
      },
      {
        name: 'Microscale/Mesoscale Simulation Chains',
        description: 'Multi-scale material simulation',
        capabilities: ['Atomic simulation', 'Crystal plasticity', 'Continuum mechanics'],
      },
      {
        name: 'Manufacturing Process Simulation',
        description: 'Process-structure-property relationships',
        capabilities: ['Casting simulation', 'Forging simulation', 'Additive manufacturing'],
      },
    ],
    tools: [
      {
        name: 'DFT/MD Toolchain Connectors',
        description: 'Integration with quantum chemistry codes',
        type: 'API',
      },
      {
        name: 'Microstructure Image Analysis',
        description: 'Image-based microstructure characterization',
        type: 'GUI',
      },
    ],
    capabilities: [
      {
        name: 'Additive Manufacturing Residual Stress',
        description: 'Thermal stress in AM processes',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Creep & Oxidation Simulation',
        description: 'Long-term material degradation',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Radiation Damage',
        description: 'Nuclear radiation effects',
        physicsLevel: 'research-grade',
      },
    ],
    aiEnhancements: [
      {
        name: 'Generative Materials Discovery',
        description: 'AI-driven new material discovery',
        capability: 'Materials design',
      },
      {
        name: 'Predictive Upscaling',
        description: 'Scale-bridging using machine learning',
        capability: 'Multi-scale modeling',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'HPC instances for molecular dynamics and DFT',
      scalability: 'GPU acceleration for quantum calculations',
      dataManagement: 'Data cataloging with provenance tracking',
    },
    color: 'from-amber-500 to-yellow-500',
    icon: 'Beaker',
  },

  // ===== MODULE 1.6: COMBUSTION & PROPULSION LABS =====
  {
    id: 'module-1-6',
    number: '1.6',
    title: 'Combustion & Propulsion Labs (Virtual Engine Testbeds)',
    description: 'Advanced combustion and propulsion system simulation',
    subsystems: [
      {
        name: 'Injector & Chamber Libraries',
        description: 'Pre-configured injector and combustor designs',
        capabilities: ['Injector geometry', 'Chamber design', 'Cooling channels'],
      },
      {
        name: 'Thermochemical Kinetics Engine',
        description: 'Chemical reaction kinetics solver',
        capabilities: ['Reaction mechanism', 'Equilibrium calculation', 'Kinetic integration'],
      },
      {
        name: 'Emissions & Soot Models',
        description: 'Pollutant formation modeling',
        capabilities: ['NOx formation', 'Soot formation', 'Particulate matter'],
      },
      {
        name: 'Thrust Stand Emulation',
        description: 'Virtual thrust measurement',
        capabilities: ['Thrust calculation', 'Specific impulse', 'Performance metrics'],
      },
    ],
    tools: [
      {
        name: '0D/1D Rocket Cycle Calculators',
        description: 'Simplified cycle analysis',
        type: 'Web IDE',
      },
      {
        name: 'Reaction Network Management',
        description: 'Chemical mechanism editor',
        type: 'GUI',
      },
    ],
    capabilities: [
      {
        name: 'Detailed Reacting Flow LES/DNS',
        description: 'Large eddy simulation of combustion',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Injector-Atomization Multi-Phase',
        description: 'Spray combustion modeling',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Spray Models',
        description: 'Lagrangian spray simulation',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'Neural Surrogates for Instability',
        description: 'ML models for combustion instability prediction',
        capability: 'Instability prediction',
      },
      {
        name: 'Active Control Policy Search',
        description: 'Reinforcement learning for combustion control',
        capability: 'Active control',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'GPU clusters with low-latency interconnects',
      scalability: 'Checkpoint and restart at scale',
      dataManagement: 'Real-time data streaming for monitoring',
    },
    color: 'from-orange-500 to-red-500',
    icon: 'Rocket',
  },

  // ===== MODULE 1.7: ROCKET ENGINE TEST SIMULATION =====
  {
    id: 'module-1-7',
    number: '1.7',
    title: 'Rocket Engine Test Simulation Environments',
    description: 'Complete rocket engine system simulation',
    subsystems: [
      {
        name: 'Full-System Engine Cycle Simulators',
        description: 'Integrated engine cycle analysis',
        capabilities: ['Cycle analysis', 'Performance prediction', 'Operating point optimization'],
      },
      {
        name: 'Thermal/Structural/Propellant Coupling',
        description: 'Multi-physics engine analysis',
        capabilities: ['Thermal analysis', 'Structural analysis', 'Propellant dynamics'],
      },
      {
        name: 'Nozzle Plume Interactions',
        description: 'Exhaust plume simulation',
        capabilities: ['Plume expansion', 'Plume-structure interaction', 'Radiation'],
      },
    ],
    tools: [
      {
        name: 'Propellant Material Libraries',
        description: 'Propellant property database',
        type: 'API',
      },
      {
        name: 'Turbomachinery Blade Element Models',
        description: 'Pump and turbine analysis',
        type: 'Web IDE',
      },
      {
        name: 'Stage Ignition Scripts',
        description: 'Ignition sequence automation',
        type: 'CLI',
      },
    ],
    capabilities: [
      {
        name: 'Multi-Physics Transient',
        description: 'Coupled transient analysis',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Cavitation & LOX/GH2 Plumbing',
        description: 'Cryogenic fluid dynamics',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Failure Insertion Testing',
        description: 'Fault injection and analysis',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'Rapid Sensitivity Analysis',
        description: 'AI-accelerated parameter sensitivity',
        capability: 'Design optimization',
      },
      {
        name: 'Autotuning of Operating Points',
        description: 'Automatic engine tuning',
        capability: 'Performance optimization',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'Safety-isolated compute enclaves',
      scalability: 'Secure multi-tenant isolation',
      dataManagement: 'Encrypted data storage and transmission',
    },
    color: 'from-red-500 to-orange-500',
    icon: 'Rocket',
  },

  // ===== MODULE 1.8: SATELLITE INTEGRATION LABS =====
  {
    id: 'module-1-8',
    number: '1.8',
    title: 'Satellite Integration Labs (Virtual Cleanrooms + AIT)',
    description: 'Satellite assembly, integration, and test simulation',
    subsystems: [
      {
        name: 'Payload Mounting & Compatibility',
        description: 'Payload integration verification',
        capabilities: ['Mounting analysis', 'Compatibility checking', 'Interface verification'],
      },
      {
        name: 'EMI/EMC Simulation Rigs',
        description: 'Electromagnetic compatibility testing',
        capabilities: ['EMI analysis', 'EMC testing', 'Shielding design'],
      },
      {
        name: 'Vibration & Shock Test Emulators',
        description: 'Mechanical environment simulation',
        capabilities: ['Vibration analysis', 'Shock analysis', 'Random vibration'],
      },
      {
        name: 'RF/Antenna Pattern Testbeds',
        description: 'RF performance analysis',
        capabilities: ['Antenna patterns', 'Link budget', 'Interference analysis'],
      },
    ],
    tools: [
      {
        name: 'Spacecraft Bus & Subsystem Libraries',
        description: 'Pre-configured spacecraft components',
        type: 'API',
      },
      {
        name: 'Thermal Modeling & Scenario Builders',
        description: 'Thermal environment simulation',
        type: 'GUI',
      },
    ],
    capabilities: [
      {
        name: 'End-to-End Mission Simulations',
        description: 'Complete mission profile analysis',
        physicsLevel: 'advanced',
      },
      {
        name: 'Power & Thermal Management',
        description: 'Power budget and thermal control',
        physicsLevel: 'advanced',
      },
      {
        name: 'On-Orbit Operations',
        description: 'Orbital operations simulation',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'Automated Trade-Off Engine',
        description: 'Multi-objective design optimization',
        capability: 'Design optimization',
      },
      {
        name: 'Failure Mode Prediction',
        description: 'ML-based failure prediction',
        capability: 'Reliability analysis',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'Secure mission environments',
      scalability: 'Deterministic simulation runtimes',
      dataManagement: 'Mission-critical data protection',
    },
    color: 'from-indigo-500 to-blue-600',
    icon: 'Satellite',
  },

  // ===== MODULE 1.9: THERMAL VACUUM CHAMBERS =====
  {
    id: 'module-1-9',
    number: '1.9',
    title: 'Thermal Vacuum Chambers (Virtual)',
    description: 'Space environment simulation and thermal testing',
    subsystems: [
      {
        name: 'Vacuum Envelope Models',
        description: 'Vacuum chamber simulation',
        capabilities: ['Pressure control', 'Leak detection', 'Outgassing'],
      },
      {
        name: 'Radiative Thermal Network Solver',
        description: 'Thermal radiation analysis',
        capabilities: ['View factor calculation', 'Radiation exchange', 'Temperature distribution'],
      },
    ],
    tools: [
      {
        name: 'Sun-Angle & Deep-Space Thermal Builders',
        description: 'Orbital thermal environment',
        type: 'GUI',
      },
    ],
    capabilities: [
      {
        name: 'Thermal Vacuum Soak',
        description: 'Long-duration thermal cycling',
        physicsLevel: 'advanced',
      },
      {
        name: 'Bakeout & Thermal Balance Test Simulations',
        description: 'Pre-flight thermal testing',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'Intelligent Test Sequencing',
        description: 'Optimal test sequence planning',
        capability: 'Test optimization',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'Time-series thermal data storage',
      scalability: 'Real-time monitoring infrastructure',
      dataManagement: 'Virtual instrumentation dashboards',
    },
    color: 'from-cyan-500 to-blue-500',
    icon: 'Thermometer',
  },

  // ===== MODULE 1.10: AVIONICS LABS =====
  {
    id: 'module-1-10',
    number: '1.10',
    title: 'Avionics Labs (Virtual HW-in-the-Loop & SW-in-the-Loop)',
    description: 'Avionics system simulation and testing',
    subsystems: [
      {
        name: 'Real-Time RTOS Emulators',
        description: 'Real-time operating system simulation',
        capabilities: ['Task scheduling', 'Interrupt handling', 'Memory management'],
      },
      {
        name: 'Hardware Abstraction Layers',
        description: 'Hardware interface abstraction',
        capabilities: ['Device drivers', 'Peripheral simulation', 'Protocol stacks'],
      },
      {
        name: 'Sensor/Actuator Virtualization',
        description: 'Virtual sensor and actuator models',
        capabilities: ['Sensor models', 'Actuator models', 'Failure injection'],
      },
    ],
    tools: [
      {
        name: 'MIL-STD Connectors',
        description: 'Military standard interface support',
        type: 'API',
      },
      {
        name: 'DO-178C Compliance Toolchains',
        description: 'Certification support tools',
        type: 'CLI',
      },
      {
        name: 'FPGA/SoC Co-Simulation',
        description: 'Hardware-software co-simulation',
        type: 'Web IDE',
      },
    ],
    capabilities: [
      {
        name: 'HW-in-the-Loop over Low-Latency Links',
        description: 'Real-time hardware integration',
        physicsLevel: 'advanced',
      },
      {
        name: 'Avionics Bus Emulation (ARINC, CAN)',
        description: 'Avionics communication bus simulation',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'ML Summarizer for Code Coverage',
        description: 'Intelligent test coverage analysis',
        capability: 'Test analysis',
      },
      {
        name: 'Safety-Critical Anomaly Detection',
        description: 'ML-based fault detection',
        capability: 'Fault detection',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'Deterministic low-latency streaming',
      scalability: 'Edge compute for HIL',
      dataManagement: 'Real-time data acquisition',
    },
    color: 'from-green-500 to-emerald-500',
    icon: 'Cpu',
  },

  // ===== MODULE 1.11: FLIGHT CONTROL SYSTEM LABS =====
  {
    id: 'module-1-11',
    number: '1.11',
    title: 'Flight Control System Labs',
    description: 'Guidance, navigation, and control system simulation',
    subsystems: [
      {
        name: 'GNC Algorithm Repository',
        description: 'Collection of GNC algorithms',
        capabilities: ['Guidance algorithms', 'Navigation filters', 'Control laws'],
      },
      {
        name: 'Monte-Carlo Uncertainty Injector',
        description: 'Stochastic uncertainty analysis',
        capabilities: ['Parameter uncertainty', 'Sensor noise', 'Environmental disturbances'],
      },
      {
        name: 'Sensor Fusion Pipelines',
        description: 'Multi-sensor data fusion',
        capabilities: ['Kalman filtering', 'Particle filtering', 'Information fusion'],
      },
    ],
    tools: [
      {
        name: 'Full Aircraft Dynamics Solvers',
        description: 'Complete aircraft dynamics',
        type: 'Web IDE',
      },
      {
        name: 'Hardware Autopilot Connectors',
        description: 'Real autopilot hardware integration',
        type: 'API',
      },
    ],
    capabilities: [
      {
        name: 'High-Fidelity Aero + Structural + Control Closed-Loop',
        description: 'Integrated multi-physics control loop',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Failure Injection & Recovery Validation',
        description: 'Fault tolerance testing',
        physicsLevel: 'advanced',
      },
    ],
    aiEnhancements: [
      {
        name: 'AI Co-Pilot for Controller Tuning',
        description: 'Automated control law tuning',
        capability: 'Control optimization',
      },
      {
        name: 'Automated Stability Margin Search',
        description: 'Robustness analysis automation',
        capability: 'Stability analysis',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'GPU compute for RL training',
      scalability: 'Distributed rollout databases',
      dataManagement: 'High-throughput data logging',
    },
    color: 'from-violet-500 to-purple-600',
    icon: 'Navigation',
  },

  // ===== MODULE 1.12: ORBITAL MECHANICS & RE-ENTRY =====
  {
    id: 'module-1-12',
    number: '1.12',
    title: 'Orbital Mechanics & Re-Entry Simulation Environments',
    description: 'Orbital dynamics and atmospheric re-entry simulation',
    subsystems: [
      {
        name: 'Ephemeris & Force Models',
        description: 'Orbital propagation models',
        capabilities: ['Two-body dynamics', 'Perturbation forces', 'Ephemeris data'],
      },
      {
        name: 'Atmospheric Re-Entry/Ablation Modules',
        description: 'Re-entry vehicle simulation',
        capabilities: ['Aerothermal heating', 'Ablation', 'Plasma effects'],
      },
      {
        name: 'Guidance & Intercept Simulation',
        description: 'Rendezvous and intercept',
        capabilities: ['Guidance algorithms', 'Intercept planning', 'Proximity operations'],
      },
    ],
    tools: [
      {
        name: 'Mission Planning UI',
        description: 'Interactive mission planning',
        type: 'GUI',
      },
      {
        name: 'Patched Conics & Full N-Body Solvers',
        description: 'Orbital propagation solvers',
        type: 'Web IDE',
      },
      {
        name: 'Monte-Carlo Collision Simulators',
        description: 'Conjunction assessment',
        type: 'CLI',
      },
    ],
    capabilities: [
      {
        name: 'High-Fidelity Atmospheric Entry Physics',
        description: 'Detailed re-entry aerothermodynamics',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Plasma Sheath Modeling',
        description: 'Ionospheric effects',
        physicsLevel: 'research-grade',
      },
      {
        name: 'Reusable Vehicle Entry & Aero-Thermal Loads',
        description: 'Reusable launch vehicle analysis',
        physicsLevel: 'research-grade',
      },
    ],
    aiEnhancements: [
      {
        name: 'Autonomous Re-Entry Trajectory Optimizer',
        description: 'AI-based trajectory optimization',
        capability: 'Trajectory optimization',
      },
    ],
    cloudArchitecture: {
      infrastructure: 'Deterministic simulation pipelines',
      scalability: 'Large ephemeris data stores',
      dataManagement: 'Orbital mechanics database',
    },
    color: 'from-rose-500 to-pink-500',
    icon: 'Rocket',
  },
];

// ===== MODULE STATISTICS =====
export const getModuleStatistics = () => {
  const totalSubsystems = VIRTUAL_LAB_MODULES.reduce((sum, m) => sum + m.subsystems.length, 0);
  const totalTools = VIRTUAL_LAB_MODULES.reduce((sum, m) => sum + m.tools.length, 0);
  const totalCapabilities = VIRTUAL_LAB_MODULES.reduce((sum, m) => sum + m.capabilities.length, 0);
  const totalAIEnhancements = VIRTUAL_LAB_MODULES.reduce((sum, m) => sum + m.aiEnhancements.length, 0);

  return {
    modules: VIRTUAL_LAB_MODULES.length,
    subsystems: totalSubsystems,
    tools: totalTools,
    capabilities: totalCapabilities,
    aiEnhancements: totalAIEnhancements,
  };
};

// ===== MODULE SEARCH & FILTER =====
export const searchModules = (query: string): VirtualLabModule[] => {
  const q = query.toLowerCase();
  return VIRTUAL_LAB_MODULES.filter(
    m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.subsystems.some(s => s.name.toLowerCase().includes(q)) ||
      m.capabilities.some(c => c.name.toLowerCase().includes(q))
  );
};

export const getModulesByPhysicsLevel = (level: 'simplified' | 'intermediate' | 'advanced' | 'research-grade'): VirtualLabModule[] => {
  return VIRTUAL_LAB_MODULES.filter(m =>
    m.capabilities.some(c => c.physicsLevel === level)
  );
};

export default {
  VIRTUAL_LAB_MODULES,
  getModuleStatistics,
  searchModules,
  getModulesByPhysicsLevel,
};
