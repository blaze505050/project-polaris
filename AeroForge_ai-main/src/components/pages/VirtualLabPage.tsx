import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wind, Database, Wrench, Zap, Download, Cpu, Calculator, 
  Microscope, Beaker, Gauge, Layers, Rocket, Brain, Workflow,
  BarChart3, GitBranch, Target, Lightbulb, Settings, Play, Users,
  Thermometer, Navigation, Satellite, ChevronDown, Code, Zap as ZapIcon, TrendingUp,
  Globe, Telescope, Radio, Map, Compass, Orbit, Waves, Eye
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VIRTUAL_LAB_MODULES, getModuleStatistics } from '@/services/virtualLabModules';
import InteractiveSimulationPanel from '@/components/InteractiveSimulationPanel';
import AdvancedPhysicsVisualizer from '@/components/AdvancedPhysicsVisualizer';
import ValidationReportPanel from '@/components/ValidationReportPanel';

interface LabTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  subcategory?: string;
  features: string[];
  color: string;
  path?: string;
  isActive: boolean;
  order: number;
}

const labTools: LabTool[] = [
  // ===== STRUCTURAL ANALYSIS =====
  {
    id: 'structural-analysis',
    title: 'Structural Analysis Lab',
    description: 'Advanced finite element analysis for aerospace structures with real-time visualization',
    icon: <Layers className="w-8 h-8" />,
    category: 'Advanced Modules',
    subcategory: 'Structural Analysis',
    features: ['FEA Solver', 'Stress Analysis', 'Modal Analysis', 'Optimization'],
    color: 'from-red-500 to-pink-500',
    path: '/structural-analysis',
    isActive: true,
    order: 1,
  },
  
  // ===== PROPULSION SYSTEMS =====
  {
    id: 'propulsion-systems',
    title: 'Propulsion Systems Lab',
    description: 'Comprehensive engine and propulsion analysis with thermodynamic modeling',
    icon: <Rocket className="w-8 h-8" />,
    category: 'Advanced Modules',
    subcategory: 'Propulsion Systems',
    features: ['Engine Analysis', 'Thermodynamics', 'Performance Curves', 'Fuel Efficiency'],
    color: 'from-orange-500 to-red-500',
    path: '/propulsion-systems',
    isActive: true,
    order: 2,
  },
  
  // ===== AERODYNAMICS LAB =====
  {
    id: 'aerodynamics-lab',
    title: 'Aerodynamics Lab',
    description: 'Complete aerodynamic analysis suite with CFD integration and visualization',
    icon: <Wind className="w-8 h-8" />,
    category: 'Advanced Modules',
    subcategory: 'Aerodynamics Lab',
    features: ['Flow Analysis', 'Pressure Distribution', 'Lift & Drag', 'Optimization'],
    color: 'from-blue-500 to-cyan-500',
    path: '/aerodynamics-lab',
    isActive: true,
    order: 3,
  },
  
  // ===== MATERIALS LAB =====
  {
    id: 'materials-lab',
    title: 'Materials Lab',
    description: 'Material properties database with mechanical testing and selection tools',
    icon: <Beaker className="w-8 h-8" />,
    category: 'Advanced Modules',
    subcategory: 'Materials Lab',
    features: ['Material Database', 'Properties Analysis', 'Testing', 'Selection Tools'],
    color: 'from-amber-500 to-yellow-500',
    path: '/materials-lab',
    isActive: true,
    order: 4,
  },
  
  // ===== SYSTEMS INTEGRATION =====
  {
    id: 'systems-integration',
    title: 'Systems Integration',
    description: 'Multi-disciplinary system integration and architecture design',
    icon: <Workflow className="w-8 h-8" />,
    category: 'Advanced Modules',
    subcategory: 'Systems Integration',
    features: ['System Architecture', 'Integration Testing', 'Requirements', 'Validation'],
    color: 'from-purple-500 to-pink-500',
    path: '/systems-integration',
    isActive: true,
    order: 5,
  },
  
  // ===== CASE STUDIES =====
  {
    id: 'case-studies',
    title: 'Case Studies',
    description: 'Real-world aerospace projects with detailed analysis and lessons learned',
    icon: <BarChart3 className="w-8 h-8" />,
    category: 'Products',
    subcategory: 'Case Studies',
    features: ['Project Analysis', 'Performance Data', 'Lessons Learned', 'Best Practices'],
    color: 'from-green-500 to-emerald-500',
    path: '/case-studies',
    isActive: true,
    order: 6,
  },
  
  // ===== AEROSPACE TOOLS =====
  {
    id: 'aerospace-tools',
    title: 'Aerospace Tools',
    description: 'Comprehensive suite of aerospace design and analysis tools',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Products',
    subcategory: 'Aerospace Tools',
    features: ['Design Tools', 'Analysis Suite', 'Calculators', 'Utilities'],
    color: 'from-slate-600 to-gray-700',
    path: '/aerospace-tools',
    isActive: true,
    order: 7,
  },
  
  // ===== TEMPLATES =====
  {
    id: 'templates',
    title: 'Templates Hub',
    description: 'Pre-built aerospace design templates and project frameworks',
    icon: <GitBranch className="w-8 h-8" />,
    category: 'Products',
    subcategory: 'Templates',
    features: ['Design Templates', 'Project Frameworks', 'Best Practices', 'Quick Start'],
    color: 'from-indigo-500 to-blue-600',
    path: '/templates',
    isActive: true,
    order: 8,
  },
  
  // ===== CFD DATASETS =====
  {
    id: 'cfd-datasets',
    title: 'CFD Datasets Hub',
    description: 'Validated CFD simulation datasets with tutorials and boundary conditions',
    icon: <Database className="w-8 h-8" />,
    category: 'Products',
    subcategory: 'CFD Datasets',
    features: ['Validated Data', 'Mesh Tutorials', 'Boundary Conditions', 'Advanced Analysis'],
    color: 'from-cyan-500 to-blue-500',
    path: '/cfd-datasets',
    isActive: true,
    order: 9,
  },
  
  // ===== RESEARCH HUB =====
  {
    id: 'research-hub',
    title: 'Research Hub',
    description: 'Central repository for aerospace research papers and publications',
    icon: <Microscope className="w-8 h-8" />,
    category: 'Research',
    subcategory: 'Research Hub',
    features: ['Research Papers', 'Publications', 'Literature', 'Knowledge Base'],
    color: 'from-violet-500 to-purple-600',
    path: '/research-hub',
    isActive: true,
    order: 10,
  },
  
  // ===== KNOWLEDGE BASE =====
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Comprehensive documentation and technical knowledge repository',
    icon: <Lightbulb className="w-8 h-8" />,
    category: 'Research',
    subcategory: 'Knowledge Base',
    features: ['Documentation', 'Tutorials', 'FAQs', 'Technical Guides'],
    color: 'from-yellow-500 to-amber-500',
    path: '/knowledge-base',
    isActive: true,
    order: 11,
  },
  
  // ===== ADVANCED TURBULENCE MODELING =====
  {
    id: 'advanced-turbulence-modeling',
    title: 'Advanced Turbulence Modeling',
    description: 'Research-grade turbulence modeling with advanced analysis capabilities',
    icon: <Cpu className="w-8 h-8" />,
    category: 'Research',
    subcategory: 'Advanced Research',
    features: ['RANS Models', 'LES Capabilities', 'Hybrid Methods', 'Research Tools'],
    color: 'from-orange-500 to-red-500',
    path: '/advanced-turbulence-modeling',
    isActive: true,
    order: 12,
  },
  
  // ===== MULTI-OBJECTIVE OPTIMIZATION =====
  {
    id: 'multi-objective-optimization',
    title: 'Multi-Objective Optimization',
    description: 'Advanced Pareto frontier optimization for complex design problems',
    icon: <Target className="w-8 h-8" />,
    category: 'Research',
    subcategory: 'Advanced Research',
    features: ['Pareto Analysis', 'Multi-objective', 'Design Space', 'Visualization'],
    color: 'from-pink-500 to-rose-500',
    path: '/multi-objective-optimization',
    isActive: true,
    order: 13,
  },
  
  // ===== BATCH PROCESSING =====
  {
    id: 'batch-processing',
    title: 'Batch Processing Engine',
    description: 'High-performance parallel processing for large-scale simulations',
    icon: <Workflow className="w-8 h-8" />,
    category: 'Research',
    subcategory: 'Advanced Research',
    features: ['Parallel Processing', 'Queue Management', 'Result Aggregation', 'Monitoring'],
    color: 'from-teal-500 to-cyan-500',
    path: '/batch-processing',
    isActive: true,
    order: 14,
  },
  
  // ===== ELITE SUITE - MULTI-OBJECTIVE OPTIMIZATION =====
  {
    id: 'elite-multi-objective',
    title: 'Elite Multi-Objective Optimizer',
    description: 'Enterprise-grade Pareto frontier optimization with advanced visualization',
    icon: <Target className="w-8 h-8" />,
    category: 'Elite Suite',
    subcategory: 'Elite Optimization',
    features: ['Pareto Frontier', 'Multi-physics', 'Advanced Visualization', 'Enterprise Tools'],
    color: 'from-fuchsia-500 to-purple-500',
    path: '/elite-multi-objective-optimization',
    isActive: true,
    order: 15,
  },
  
  // ===== ELITE SUITE - TURBULENCE MODELING RESEARCH LAB =====
  {
    id: 'turbulence-modeling-research-lab',
    title: 'Turbulence Modeling Research Lab',
    description: 'Elite research environment for advanced turbulence modeling',
    icon: <Microscope className="w-8 h-8" />,
    category: 'Elite Suite',
    subcategory: 'Elite Research',
    features: ['Advanced RANS', 'LES/DES', 'Hybrid Approaches', 'Research Publishing'],
    color: 'from-indigo-500 to-blue-600',
    path: '/turbulence-modeling-research-lab',
    isActive: true,
    order: 16,
  },
  
  // ===== ELITE SUITE - AEROSPACE DESIGN PATTERNS =====
  {
    id: 'aerospace-design-patterns',
    title: 'Aerospace Design Patterns Library',
    description: 'Enterprise design patterns and best practices for aerospace systems',
    icon: <GitBranch className="w-8 h-8" />,
    category: 'Elite Suite',
    subcategory: 'Elite Design',
    features: ['Design Patterns', 'Best Practices', 'Architecture', 'Implementation Guides'],
    color: 'from-emerald-500 to-teal-500',
    path: '/aerospace-design-patterns-library',
    isActive: true,
    order: 17,
  },
  
  // ===== ELITE SUITE - AI RESEARCH ASSISTANT =====
  {
    id: 'ai-research-assistant',
    title: 'AI Research Assistant',
    description: 'Intelligent AI-powered assistant for aerospace research and optimization',
    icon: <Brain className="w-8 h-8" />,
    category: 'Elite Suite',
    subcategory: 'Elite AI',
    features: ['Natural Language', 'Design Suggestions', 'Literature Search', 'Analysis'],
    color: 'from-rose-500 to-pink-500',
    path: '/ai-research-assistant',
    isActive: true,
    order: 18,
  },
  
  // ===== ELITE SUITE - COLLABORATIVE WORKSPACE =====
  {
    id: 'collaborative-workspace',
    title: 'Collaborative Workspace',
    description: 'Enterprise team collaboration platform for aerospace projects',
    icon: <Users className="w-8 h-8" />,
    category: 'Elite Suite',
    subcategory: 'Elite Collaboration',
    features: ['Real-time Sync', 'Version Control', 'Comments', 'Permissions'],
    color: 'from-sky-500 to-blue-500',
    path: '/collaborative-workspace',
    isActive: true,
    order: 19,
  },
  
  // ===== CORE TOOLS =====
  {
    id: 'airfoil-designer',
    title: 'Airfoil Design Studio',
    description: 'Real-time aerodynamic airfoil design with NACA profile generation',
    icon: <Wind className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Design',
    features: ['NACA Generation', 'Real-time Visualization', 'Geometry Optimization', 'CAD Export'],
    color: 'from-blue-500 to-cyan-500',
    path: '/airfoil-designer',
    isActive: true,
    order: 20,
  },
  
  {
    id: 'cfd-simulator',
    title: 'CFD Solver Lab',
    description: 'Production-grade computational fluid dynamics with mesh generation',
    icon: <Cpu className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Simulation',
    features: ['Mesh Generation', 'Solver Configuration', 'Results Visualization', 'Data Export'],
    color: 'from-purple-500 to-pink-500',
    path: '/cfd-simulator',
    isActive: true,
    order: 21,
  },
  
  {
    id: 'wing-calculator',
    title: 'Wing Performance Lab',
    description: 'Advanced wing aerodynamic analysis and performance computation',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Analysis',
    features: ['Wing Span Calc', 'Performance Metrics', 'Speed Analysis', 'CSV Export'],
    color: 'from-amber-500 to-yellow-500',
    path: '/wing-calculator',
    isActive: true,
    order: 22,
  },
  
  {
    id: 'thrust-calculator',
    title: 'Engine Thrust Lab',
    description: 'Comprehensive engine thrust and performance analysis',
    icon: <Zap className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Analysis',
    features: ['Jet Engine', 'Piston Engine', 'Power Output', 'Fuel Analysis'],
    color: 'from-red-500 to-pink-500',
    path: '/thrust-calculator',
    isActive: true,
    order: 23,
  },
  
  {
    id: 'drag-calculator',
    title: 'Drag Analysis Lab',
    description: 'Production-grade aerodynamic drag analysis with component breakdown',
    icon: <Wind className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Analysis',
    features: ['Drag Components', 'Compressibility', 'Performance', 'CSV Export'],
    color: 'from-teal-500 to-cyan-500',
    path: '/drag-calculator',
    isActive: true,
    order: 24,
  },
  
  {
    id: 'airfoil-downloader',
    title: 'Airfoil Repository',
    description: 'Comprehensive airfoil database with performance data',
    icon: <Download className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Data',
    features: ['Natural Search', 'CSV Export', 'Batch Download', 'Performance Curves'],
    color: 'from-green-500 to-emerald-500',
    path: '/airfoil-downloader',
    isActive: true,
    order: 25,
  },
  
  {
    id: 'advanced-cfd',
    title: 'Advanced CFD Suite',
    description: 'Elite computational fluid dynamics with convergence monitoring',
    icon: <Beaker className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Advanced',
    features: ['Convergence Monitor', 'Advanced Solvers', 'Real-time Monitoring', 'Multi-physics'],
    color: 'from-violet-500 to-purple-600',
    path: '/advanced-cfd',
    isActive: true,
    order: 26,
  },
  
  {
    id: 'aerospace-suite',
    title: 'Enterprise Aerospace Suite',
    description: 'Integrated aerospace design platform with multi-physics simulation',
    icon: <Rocket className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Integration',
    features: ['Multi-physics', 'Structural Analysis', 'Optimization', 'Collaboration'],
    color: 'from-purple-500 to-pink-500',
    path: '/advanced-aerospace-suite',
    isActive: true,
    order: 27,
  },
  
  {
    id: 'mechanical-suite',
    title: 'Mechanical CAD Suite',
    description: 'Production-grade mechanical design with parametric modeling',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Integration',
    features: ['Parametric Modeling', 'Assembly Sim', 'Manufacturing', 'Material DB'],
    color: 'from-slate-600 to-gray-700',
    path: '/mechanical-cad-suite',
    isActive: true,
    order: 28,
  },
  
  {
    id: 'digital-research-lab',
    title: 'Digital Aerospace Lab',
    description: 'Comprehensive digital research environment for aerospace innovation',
    icon: <Lightbulb className="w-8 h-8" />,
    category: 'Core Tools',
    subcategory: 'Research',
    features: ['Research Tools', 'Data Analysis', 'Visualization', 'Publishing'],
    color: 'from-yellow-500 to-amber-500',
    path: '/digital-aerospace-research-lab',
    isActive: true,
    order: 29,
  },
  
  // ===== SPECIALIZED LABORATORIES =====
  // Aerospace & Flight Systems
  {
    id: 'aircraft-uav-design',
    title: 'Aircraft & UAV Design Studio',
    description: 'Integrated platform for aircraft and unmanned aerial vehicle design with aerodynamic optimization',
    icon: <Rocket className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Aerospace & Flight Systems',
    features: ['Aircraft Design', 'UAV Configuration', 'Aerodynamic Optimization', 'Performance Prediction'],
    color: 'from-sky-500 to-blue-600',
    path: '/aircraft-uav-design',
    isActive: true,
    order: 30,
  },
  
  {
    id: 'flight-simulator',
    title: 'Flight Simulation Engine',
    description: 'High-fidelity flight dynamics simulator with real-time physics and control systems',
    icon: <Navigation className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Aerospace & Flight Systems',
    features: ['Flight Dynamics', 'Control Systems', 'Real-time Simulation', 'Autopilot Testing'],
    color: 'from-cyan-500 to-blue-500',
    path: '/flight-simulator',
    isActive: true,
    order: 31,
  },
  
  {
    id: 'virtual-wind-tunnel',
    title: 'Virtual Wind Tunnel',
    description: 'Advanced CFD-based wind tunnel for aerodynamic testing and flow visualization',
    icon: <Wind className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Aerospace & Flight Systems',
    features: ['Flow Visualization', 'Pressure Distribution', 'Force Measurement', 'Parametric Studies'],
    color: 'from-blue-500 to-indigo-600',
    path: '/virtual-wind-tunnel',
    isActive: true,
    order: 32,
  },
  
  {
    id: 'terrain-mission-sim',
    title: '3D Terrain & Mission Simulator',
    description: 'Real-time 3D environment for mission planning, terrain analysis, and flight path optimization',
    icon: <Satellite className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Aerospace & Flight Systems',
    features: ['3D Terrain Rendering', 'Mission Planning', 'Path Optimization', 'Real-time Visualization'],
    color: 'from-green-500 to-emerald-600',
    path: '/terrain-mission-simulator',
    isActive: true,
    order: 33,
  },
  
  // Industrial Mechanical Engineering
  {
    id: 'digital-twin-lab',
    title: 'Digital Twin Laboratory',
    description: 'Real-time digital twins for rotating machinery, pumps, valves, compressors, and HVAC systems',
    icon: <Database className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Industrial Mechanical Engineering',
    features: ['Real-time Telemetry', 'Condition Monitoring', 'Predictive Maintenance', 'Performance Analytics'],
    color: 'from-purple-500 to-pink-500',
    path: '/digital-twin-lab',
    isActive: true,
    order: 34,
  },
  
  {
    id: 'plc-dcs-testing',
    title: 'PLC/DCS Testing Platform',
    description: 'Comprehensive platform for programmable logic controller and distributed control system testing',
    icon: <Cpu className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Industrial Mechanical Engineering',
    features: ['PLC Simulation', 'DCS Integration', 'Logic Testing', 'Safety Validation'],
    color: 'from-orange-500 to-red-500',
    path: '/plc-dcs-testing',
    isActive: true,
    order: 35,
  },
  
  {
    id: 'hvac-systems-lab',
    title: 'HVAC Systems Laboratory',
    description: 'Advanced simulation for heating, ventilation, and air conditioning system design and optimization',
    icon: <Thermometer className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Industrial Mechanical Engineering',
    features: ['Thermal Analysis', 'Flow Simulation', 'System Optimization', 'Energy Efficiency'],
    color: 'from-blue-500 to-cyan-500',
    path: '/hvac-systems-lab',
    isActive: true,
    order: 36,
  },
  
  // Advanced Dynamics & Robotics
  {
    id: 'multibody-dynamics',
    title: 'Multibody Dynamics Engine',
    description: 'Real-time simulation of complex mechanical systems with rigid body dynamics and constraints',
    icon: <Layers className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Advanced Dynamics & Robotics',
    features: ['Rigid Body Dynamics', 'Constraint Solving', 'Contact Detection', 'Real-time Visualization'],
    color: 'from-red-500 to-pink-500',
    path: '/multibody-dynamics',
    isActive: true,
    order: 37,
  },
  
  {
    id: 'hydraulics-powertrain',
    title: 'Hydraulics & Powertrain Simulator',
    description: 'Advanced simulation for hydraulic systems, powertrains, and fluid power applications',
    icon: <Zap className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Advanced Dynamics & Robotics',
    features: ['Hydraulic Modeling', 'Powertrain Analysis', 'Fluid Dynamics', 'System Integration'],
    color: 'from-yellow-500 to-amber-500',
    path: '/hydraulics-powertrain',
    isActive: true,
    order: 38,
  },
  
  {
    id: 'robotics-lab',
    title: 'Robotics & Automation Lab',
    description: 'Comprehensive platform for robot design, kinematics, dynamics, and control system development',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Advanced Dynamics & Robotics',
    features: ['Robot Kinematics', 'Dynamics Simulation', 'Path Planning', 'Control Development'],
    color: 'from-indigo-500 to-purple-600',
    path: '/robotics-lab',
    isActive: true,
    order: 39,
  },
  
  // Manufacturing & Digital Thread
  {
    id: 'digital-thread-hub',
    title: 'Digital Thread Management Hub',
    description: 'Unified platform for managing digital thread across product lifecycle from design to manufacturing',
    icon: <GitBranch className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Manufacturing & Digital Thread',
    features: ['Lifecycle Management', 'Data Integration', 'Version Control', 'Traceability'],
    color: 'from-teal-500 to-cyan-600',
    path: '/digital-thread-hub',
    isActive: true,
    order: 40,
  },
  
  {
    id: 'industry-4-0-lab',
    title: 'Industry 4.0 Smart Manufacturing',
    description: 'Advanced platform for smart manufacturing, IoT integration, and Industry 4.0 implementation',
    icon: <TrendingUp className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Manufacturing & Digital Thread',
    features: ['IoT Integration', 'Real-time Monitoring', 'Predictive Analytics', 'Process Optimization'],
    color: 'from-green-500 to-emerald-600',
    path: '/industry-4-0-lab',
    isActive: true,
    order: 41,
  },
  
  {
    id: 'vr-ar-engineering',
    title: 'VR/AR Engineering Environment',
    description: 'Immersive virtual and augmented reality platform for design review, assembly, and training',
    icon: <Lightbulb className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Manufacturing & Digital Thread',
    features: ['VR Visualization', 'AR Overlay', 'Assembly Simulation', 'Training Modules'],
    color: 'from-pink-500 to-rose-600',
    path: '/vr-ar-engineering',
    isActive: true,
    order: 42,
  },
  
  // Mechanism & Kinematics
  {
    id: 'mechanism-design-studio',
    title: 'Mechanism Design Studio',
    description: 'Advanced CAD-based platform for mechanism design, kinematics analysis, and optimization',
    icon: <Wrench className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Mechanism & Kinematics',
    features: ['Mechanism Synthesis', 'Kinematics Analysis', 'Motion Simulation', 'Optimization'],
    color: 'from-slate-600 to-gray-700',
    path: '/mechanism-design-studio',
    isActive: true,
    order: 43,
  },
  
  {
    id: 'kinematics-solver',
    title: 'Advanced Kinematics Solver',
    description: 'Comprehensive kinematics and inverse kinematics solver for complex mechanical systems',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Mechanism & Kinematics',
    features: ['Forward Kinematics', 'Inverse Kinematics', 'Trajectory Planning', 'Singularity Analysis'],
    color: 'from-amber-500 to-yellow-600',
    path: '/kinematics-solver',
    isActive: true,
    order: 44,
  },
  
  {
    id: 'digital-human-modeling',
    title: 'Digital Human Modeling Lab',
    description: 'Ergonomic analysis and digital human modeling for product design and workplace optimization',
    icon: <Users className="w-8 h-8" />,
    category: 'Specialized Laboratories',
    subcategory: 'Mechanism & Kinematics',
    features: ['Ergonomic Analysis', 'Posture Simulation', 'Reach Analysis', 'Comfort Assessment'],
    color: 'from-rose-500 to-pink-600',
    path: '/digital-human-modeling',
    isActive: true,
    order: 45,
  },
  
  // ===== ASTROLAB - SPATIAL INTELLIGENCE & 3D GLOBE ENGINE =====
  {
    id: 'spatial-intelligence-globe',
    title: 'Spatial Intelligence & 3D Globe Engine',
    description: 'Real-time 3D geospatial visualization with satellite propagation and orbital mechanics',
    icon: <Globe className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Spatial Intelligence',
    features: ['CesiumJS Renderer', 'SGP4 Satellite Propagator', 'Real-time Ephemeris', 'Spatial Filtering'],
    color: 'from-indigo-500 to-purple-600',
    path: '/astrolab-spatial-globe',
    isActive: true,
    order: 46,
  },
  
  {
    id: 'deep-space-observation',
    title: 'Deep-Space Observation & Mapping',
    description: 'Advanced astronomical survey visualization with multi-spectral layer overlays',
    icon: <Telescope className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Deep-Space Observation',
    features: ['Aladin Lite Engine', 'Pan-STARRS/DSS Surveys', 'Coordinate Targeting', 'Multi-Spectral Overlays'],
    color: 'from-blue-600 to-indigo-700',
    path: '/astrolab-deep-space',
    isActive: true,
    order: 47,
  },
  
  {
    id: 'professional-photometry-suite',
    title: 'Professional Analytical & Photometry Suite',
    description: 'FITS image analysis with photometry tools and NASA HEASARC integration',
    icon: <Eye className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Analytical Tools',
    features: ['JS9 Web FITS Analyzer', 'ROI Photometry', 'NASA HEASARC Bridge', 'Image Processing'],
    color: 'from-cyan-500 to-blue-600',
    path: '/astrolab-photometry',
    isActive: true,
    order: 48,
  },
  
  {
    id: 'astrodynamics-sandbox',
    title: 'Astrodynamics & Physics Simulation Sandbox',
    description: 'Interactive orbital mechanics with N-Body gravity simulation and mission planning',
    icon: <Orbit className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Astrodynamics',
    features: ['Pyodide Python Engine', 'N-Body Gravity Simulation', 'Mission Planner', 'Delta-V Calculator'],
    color: 'from-purple-500 to-pink-600',
    path: '/astrolab-astrodynamics',
    isActive: true,
    order: 49,
  },
  
  {
    id: 'astrolab-dual-mode-ux',
    title: 'AstroLab Dual-Mode Experience',
    description: 'Seamless switching between Student and Professional modes for all astronomical tools',
    icon: <Radio className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'User Experience',
    features: ['Student Mode', 'Professional Mode', 'Guided Tours', 'Advanced Telemetry'],
    color: 'from-pink-500 to-rose-600',
    path: '/astrolab-dual-mode',
    isActive: true,
    order: 50,
  },
  
  // ===== ASTROLAB - ADVANCED FEATURES =====
  {
    id: 'satellite-constellation-mapper',
    title: 'Satellite Constellation Mapper',
    description: 'Real-time mapping of LEO, MEO, GEO satellites with debris tracking',
    icon: <Satellite className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Satellite Operations',
    features: ['LEO/MEO/GEO Tracking', 'Debris Detection', 'Collision Avoidance', 'TLE Updates'],
    color: 'from-green-500 to-emerald-600',
    path: '/astrolab-constellation',
    isActive: true,
    order: 51,
  },
  
  {
    id: 'celestial-coordinate-system',
    title: 'Celestial Coordinate System & Ephemeris',
    description: 'Advanced coordinate transformations and ephemeris data pipeline',
    icon: <Compass className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Coordinate Systems',
    features: ['RA/Dec Conversions', 'Ephemeris Calculations', 'CelesTrak Integration', 'JPL Data Pipeline'],
    color: 'from-yellow-500 to-amber-600',
    path: '/astrolab-coordinates',
    isActive: true,
    order: 52,
  },
  
  {
    id: 'orbital-mechanics-calculator',
    title: 'Orbital Mechanics Calculator',
    description: 'Comprehensive orbital element calculations and trajectory analysis',
    icon: <Waves className="w-8 h-8" />,
    category: 'AstroLab',
    subcategory: 'Orbital Analysis',
    features: ['Kepler Elements', 'Trajectory Analysis', 'Orbital Decay', 'Perturbation Analysis'],
    color: 'from-red-500 to-orange-600',
    path: '/astrolab-orbital-mechanics',
    isActive: true,
    order: 53,
  },
];

// Sort tools by order
labTools.sort((a, b) => a.order - b.order);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function VirtualLabPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showModules, setShowModules] = useState(false);
  const moduleStats = getModuleStatistics();

  useEffect(() => {
    setActiveCount(labTools.filter(t => t.isActive).length);
  }, []);

  // Organize categories in order
  const categoryOrder = [
    'Elite Suite',
    'Products',
    'Advanced Modules',
    'Research',
    'Core Tools',
    'Specialized Laboratories',
    'AstroLab'
  ];
  
  const categories = categoryOrder.filter(cat => 
    labTools.some(t => t.category === cat)
  );
  
  const filteredTools = selectedCategory 
    ? labTools.filter(t => t.category === selectedCategory)
    : labTools;

  const handleToolClick = (tool: LabTool) => {
    if (tool.path) {
      navigate(tool.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Microscope className="w-8 h-8 text-blue-400" />
              <span className="font-mono text-sm uppercase tracking-widest text-blue-400">
                Tools & Resources
              </span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6">
              Design & Analysis Tools
            </h1>
            
            <p className="font-paragraph text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Integrated tools for aerospace, mechanical, and astronomical research. {activeCount} tools ready to use.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => { setSelectedCategory(null); setShowModules(false); }}
                className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                  !showModules && selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All Tools ({labTools.length})
              </button>
              {categories.map(cat => {
                const count = labTools.filter(t => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowModules(false); }}
                    className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all ${
                      !showModules && selectedCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
              <button
                onClick={() => setShowModules(!showModules)}
                className={`px-6 py-2 rounded-lg font-paragraph font-medium transition-all flex items-center gap-2 ${
                  showModules
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Microscope className="w-4 h-4" />
                Research Modules ({moduleStats.modules})
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Active Solvers', value: '54' },
                { label: 'Domains', value: categories.length },
                { label: 'Validation Suite', value: '100%' },
                { label: 'Execution', value: 'Browser JS' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Module Stats */}
            {showModules && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto"
              >
                {[
                  { label: 'Research Modules', value: moduleStats.modules },
                  { label: 'Subsystems', value: moduleStats.subsystems },
                  { label: 'Tools', value: moduleStats.tools },
                  { label: 'Capabilities', value: moduleStats.capabilities },
                  { label: 'AI Enhancements', value: moduleStats.aiEnhancements },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30"
                  >
                    <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-purple-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Tools Grid */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-16">
          {!selectedCategory ? (
            // Show all tools organized by category
            <div className="space-y-16">
              {/* Physics Engine Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700"
              >
                <div className="flex items-start gap-4 mb-4">
                  <ZapIcon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">
                      Enhanced Physics Engine
                    </h3>
                    <p className="font-paragraph text-slate-300 mb-4">
                      Powered by advanced multi-physics simulation with atmospheric modeling, aerodynamic analysis,
                      structural mechanics, thermal analysis, propulsion dynamics, orbital mechanics, and numerical integration.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="font-paragraph text-sm font-semibold text-blue-300 mb-1">Atmospheric Model</p>
                        <p className="font-paragraph text-xs text-slate-400">US Standard Atmosphere 1976 up to 86km</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="font-paragraph text-sm font-semibold text-cyan-300 mb-1">Aerodynamics</p>
                        <p className="font-paragraph text-xs text-slate-400">Subsonic to hypersonic with compressibility</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="font-paragraph text-sm font-semibold text-purple-300 mb-1">Numerical Methods</p>
                        <p className="font-paragraph text-xs text-slate-400">RK4 with adaptive step control</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tools by Category */}
              {categories.map((category) => {
                const categoryTools = labTools.filter(t => t.category === category);
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {/* Category Header */}
                    <div className="mb-8">
                      <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                        {category}
                      </h2>
                      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                      <p className="text-slate-400 mt-3 text-lg">
                        {category === 'Advanced Modules' && 'Specialized aerospace analysis and design modules'}
                        {category === 'Products' && 'Production-ready tools and resources'}
                        {category === 'Research' && 'Advanced research and development tools'}
                        {category === 'Elite Suite' && 'Enterprise-grade optimization and collaboration'}
                        {category === 'Core Tools' && 'Essential aerospace design and simulation tools'}
                        {category === 'Specialized Laboratories' && 'World-class virtual engineering labs for aerospace, mechanical, and manufacturing'}
                        {category === 'AstroLab' && 'Advanced astronomical and space research tools with satellite tracking and deep-space observation'}
                      </p>
                    </div>
                    
                    {/* Tools Grid for this category */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {categoryTools.map((tool) => (
                        <motion.div
                          key={tool.id}
                          variants={itemVariants}
                          onMouseEnter={() => setHoveredTool(tool.id)}
                          onMouseLeave={() => setHoveredTool(null)}
                          className="group cursor-pointer"
                        >
                          <div className="relative h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                            {/* Background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-10">
                              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/50">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-mono text-green-400">Active</span>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="relative p-8 h-full flex flex-col">
                              {/* Icon */}
                              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tool.color} p-3 mb-6 flex items-center justify-center text-white`}>
                                {tool.icon}
                              </div>

                              {/* Title and description */}
                              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                                {tool.title}
                              </h3>
                              <p className="font-paragraph text-slate-400 mb-6 flex-grow">
                                {tool.description}
                              </p>

                              {/* Features */}
                              <div className="mb-6">
                                <p className="font-paragraph text-sm font-semibold text-slate-300 mb-3">
                                  Capabilities:
                                </p>
                                <ul className="space-y-2">
                                  {tool.features.map((feature, i) => (
                                    <li key={i} className="font-paragraph text-sm text-slate-400 flex items-start">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 mt-1.5 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleToolClick(tool)}
                                className={`w-full py-3 rounded-lg font-paragraph font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                  hoveredTool === tool.id
                                    ? `bg-gradient-to-r ${tool.color} text-white`
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                              >
                                <Play className="w-4 h-4" />
                                Launch Tool
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Show filtered category
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  className="group cursor-pointer"
                >
                <div className="relative h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-mono text-green-400">Active</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tool.color} p-3 mb-6 flex items-center justify-center text-white`}>
                      {tool.icon}
                    </div>

                    {/* Title and description */}
                    <h3 className="font-heading text-2xl font-bold text-white mb-3">
                      {tool.title}
                    </h3>
                    <p className="font-paragraph text-slate-400 mb-6 flex-grow">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="font-paragraph text-sm font-semibold text-slate-300 mb-3">
                        Capabilities:
                      </p>
                      <ul className="space-y-2">
                        {tool.features.map((feature, i) => (
                          <li key={i} className="font-paragraph text-sm text-slate-400 flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 mt-1.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToolClick(tool)}
                      className={`w-full py-3 rounded-lg font-paragraph font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        hoveredTool === tool.id
                          ? `bg-gradient-to-r ${tool.color} text-white`
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Launch Tool
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}</motion.div>
          )}
        </section>

        {/* Features Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 md:p-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-8">
              Why Virtual Lab?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Layers,
                  title: 'Integrated Ecosystem',
                  description: 'All tools work seamlessly together for complete aerospace, mechanical, and astronomical workflows',
                },
                {
                  icon: Gauge,
                  title: 'Research-Grade Physics',
                  description: 'Validated analytical and reduced-order algorithms with published reference data',
                },
                {
                  icon: Brain,
                  title: 'AI-Powered',
                  description: 'Intelligent suggestions and automated optimization across all tools',
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Analytics',
                  description: 'Live monitoring, convergence tracking, and performance visualization',
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <Icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="font-heading text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="font-paragraph text-slate-100">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Quick Start Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Get Started in Seconds
            </h2>
            <p className="font-paragraph text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Choose a tool above and start your research journey. All tools are fully functional and ready to use.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Select Tool',
                  desc: 'Choose from 53+ integrated aerospace, mechanical, and astronomical tools',
                },
                {
                  step: '2',
                  title: 'Configure',
                  desc: 'Set parameters and input your design specifications',
                },
                {
                  step: '3',
                  title: 'Analyze',
                  desc: 'Get instant results with real-time visualization',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="font-paragraph text-slate-400">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Launch Your Research?
            </h2>
            <p className="font-paragraph text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Access all aerospace, mechanical, and astronomical research tools in one unified environment. Start designing, simulating, and optimizing today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedCategory(null); setShowModules(false); }}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-heading font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              Explore All Tools
            </motion.button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
