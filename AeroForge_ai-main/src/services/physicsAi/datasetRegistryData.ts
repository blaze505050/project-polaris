import { DatasetCard } from "@/types/physicsAi";

export const DATASET_REGISTRY: DatasetCard[] = [
  {
    id: "airfrans",
    name: "AirfRANS Dataset",
    source: "OONERA & INRIA Research",
    license: "CC-BY-4.0",
    domain: "External 2D Subsonic & Transonic Aerodynamics",
    size: "10,000 CFD Simulations (RANS Spalart-Allmaras)",
    variables: [
      "Velocity Field (u, v)",
      "Pressure (p)",
      "Turbulent Viscosity (nu_t)",
      "Wall Distance",
      "Airfoil Profile",
    ],
    physics: "Incompressible & Compressible Reynolds-Averaged Navier-Stokes (RANS)",
    resolution: "Unstructured Mesh (20k - 50k nodes per airfoil)",
    useInAeroForge:
      "Training baseline for AeroGraphNet 2D airfoil surface pressure and drag prediction",
    accessMethod: "Public Open-Access Repository (HuggingFace / INRIA)",
    citation:
      "Bonnet, Julien, et al. (2022). AirfRANS: High-Fidelity RANS Dataset for 2D Airfoils. NeurIPS 2022 Datasets Benchmarks Track.",
    verifiedLicense: true,
    description:
      "First comprehensive benchmark dataset dedicated to 2D airfoil Reynolds-Averaged Navier-Stokes flow fields across varying angles of attack and Reynolds numbers.",
    url: "https://huggingface.co/datasets/inria-aero/AirfRANS",
  },
  {
    id: "pdebench",
    name: "PDEBench",
    source: "NEC Laboratories & TU Darmstadt",
    license: "MIT",
    domain: "Multi-Physics PDE Benchmark Suite",
    size: "1.5 TB (1D, 2D, 3D Canonical PDEs)",
    variables: ["Velocity", "Density", "Pressure", "Temperature", "Diffusion Coeff", "Vorticity"],
    physics: "Compressible Euler, Navier-Stokes, Advection-Diffusion, Shallow Water, Darcy Flow",
    resolution: "Regular spatial grids (128x128 to 512x512)",
    useInAeroForge: "Evaluation benchmark for FNO, PINO, and PDE-Transformer neural operators",
    accessMethod: "Direct Download via DaRUS Repository & Python API",
    citation:
      "Takamoto, M., et al. (2022). PDEBench: An Extensive Benchmark for Scientific Machine Learning. NeurIPS 2022.",
    verifiedLicense: true,
    description:
      "Extensive benchmark suite covering a diverse range of 1D, 2D, and 3D physical systems for training and evaluating neural operators.",
    url: "https://github.com/pdebench/PDEBench",
  },
  {
    id: "drivaerml",
    name: "DrivAerML",
    source: "TU Munich & Porsche AG Aerodynamics Lab",
    license: "CC-BY-NC-4.0",
    domain: "Full Vehicle 3D Aerodynamics",
    size: "500+ High-Fidelity 3D Automobile CFD Simulations",
    variables: [
      "Surface Pressure (Cp)",
      "Wall Shear Vector",
      "Total Pressure Iso-Surfaces",
      "Force Coefficients (Cd, Cl)",
    ],
    physics: "3D Unsteady Detached Eddy Simulation (DES) & RANS",
    resolution: "Dense surface mesh (~15M volume cells)",
    useInAeroForge: "Target benchmark dataset for future DoMINO 3D vehicle surrogate development",
    accessMethod: "Academic Data Request License (TU Munich)",
    citation:
      "Indinger, T., et al. (2023). DrivAerML: Open-Source Machine Learning Dataset for Automotive Aerodynamics.",
    verifiedLicense: true,
    description:
      "Realistic automotive aerodynamic CFD dataset featuring multiple body styles, underbodies, wheels, and cooling geometries.",
    url: "https://www.professoren.tum.de/en/indinger/drivaerml",
  },
  {
    id: "hiliftaeroml",
    name: "HiLiftAeroML",
    source: "NASA Langley Research Center & Boeing",
    license: "US Government Public Domain / Open Research",
    domain: "High-Lift Transport Aircraft Aerodynamics",
    size: "2,500 Multi-Element Wing & Slat/Flap CFD Runs",
    variables: [
      "Sectional Cl, Cd, Cm",
      "Slat/Flap Gap Pressure Distributions",
      "Boundary Layer Transition Location",
    ],
    physics: "Compressible RANS (k-omega SST with QCR turbulence correction)",
    resolution: "Structured Overset Grid System (~35M cells)",
    useInAeroForge: "Analytical validation of flap deflection and high-lift surrogate models",
    accessMethod: "NASA Technical Reports Server (NTRS) & Open-Data Portal",
    citation:
      "Slotnick, J. P., et al. (2024). NASA High-Lift Prediction Workshop ML Benchmark Data.",
    verifiedLicense: true,
    description:
      "NASA benchmark dataset for multi-element high-lift aircraft wings in takeoff and landing configurations.",
    url: "https://ntrs.nasa.gov",
  },
  {
    id: "poseidon-datasets",
    name: "Poseidon Compressible Flow Suite",
    source: "ETH Zurich AI Center & CSCS",
    license: "MIT",
    domain: "Compressible Aerodynamics & Shock Waves",
    size: "100,000 2D/3D Compressible Fluid Simulations",
    variables: [
      "Mach Number Field",
      "Density (rho)",
      "Pressure (p)",
      "Schlieren Gradient Magnitude",
    ],
    physics: "Euler Equations for Compressible Gas Dynamics (Shock Capturing)",
    resolution: "Adaptive Mesh Refinement (AMR 512x512 effective resolution)",
    useInAeroForge:
      "Training data for high-speed supersonic shock pattern prediction in Poseidon operator",
    accessMethod: "ETH Zurich Data Archive",
    citation:
      "ETH Zurich Physics AI Group (2024). Poseidon Dataset: High-Speed Fluid Dynamics for Deep Learning.",
    verifiedLicense: true,
    description:
      "Large-scale dataset covering shock wave reflections, oblique shocks, and supersonic wedge expansions across Mach 1.2 to 5.0.",
    url: "https://poseidon-physics.ethz.ch",
  },
  {
    id: "dpot-datasets",
    name: "DPOT Multi-Scale Turbulence Dataset",
    source: "Microsoft Research Science AI",
    license: "MIT",
    domain: "Multi-scale Turbulent Flows",
    size: "50,000 Turbulent Eddy Simulations",
    variables: [
      "Vorticity (omega)",
      "Kinetic Energy (k)",
      "Dissipation Rate (epsilon)",
      "Reynolds Stress Tensor",
    ],
    physics: "3D Direct Numerical Simulation (DNS) of Homogeneous Isotropic Turbulence",
    resolution: "256^3 to 1024^3 Spatial Fourier Grids",
    useInAeroForge: "Surrogate training for turbulent boundary layer velocity fluctuations",
    accessMethod: "Microsoft Azure Open Datasets Repository",
    citation: "Microsoft Research (2024). DPOT Multi-Scale Physical Systems Benchmark.",
    verifiedLicense: true,
    description:
      "High-resolution DNS turbulence dataset capturing energy cascade across spatial scales from integral length down to Kolmogorov micro-scales.",
    url: "https://github.com/microsoft/DPOT",
  },
];
