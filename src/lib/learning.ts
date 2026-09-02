export type Topic = "aerospace" | "astronomy" | "physics" | "engineering" | "computing" | "ai";

export type LearningType = "workshop" | "course" | "bootcamp" | "resource" | "project";

export type LearningLevel = "beginner" | "intermediate" | "advanced" | "all";

export type LearningFormat = "live" | "self-paced" | "cohort" | "team-sprint";

export type LearningStatus = "upcoming" | "open" | "ongoing" | "self-paced" | "archived";

export interface LearningItem {
  id: string;
  slug: string;
  type: LearningType;
  title: string;
  subtitle?: string;
  description: string;
  topics: Topic[];
  level: LearningLevel;
  duration: string;
  format: LearningFormat;
  status: LearningStatus;
  instructor?: {
    name: string;
    role: string;
    org?: string;
    linkedin?: string;
  };
  date?: string;
  seats?: string;
  prerequisites?: string[];
  outcomes: string[];
  syllabus?: { title: string; desc: string; duration?: string }[];
  agenda?: { title: string; desc: string }[];
  finalProject?: { title: string; desc: string; link?: string };
  related?: { label: string; to: string; type: string }[];
  ctaText?: string;
  link?: string;
  featured?: boolean;
}

export const TOPIC_LABELS: Record<Topic, string> = {
  aerospace: "Aerospace",
  astronomy: "Astronomy",
  physics: "Physics",
  engineering: "Engineering",
  computing: "Programming & Data",
  ai: "AI & Simulation",
};

export const LEARNING_LADDER = [
  {
    step: "01",
    type: "workshop" as const,
    title: "Workshops",
    time: "60–120 min",
    format: "Live & interactive",
    badge: "Learn in one sitting",
    summary:
      "Expert-led masterclasses by ISRO scientists, defence researchers, and engineers with live interactive Q&A and pitch challenges.",
    to: "/courses?type=workshop",
  },
  {
    step: "02",
    type: "course" as const,
    title: "Mini-Courses",
    time: "2–7 hours",
    format: "Self-paced + exercises",
    badge: "Build a skill",
    summary:
      "Structured self-paced modules with hands-on computational exercises, conceptual quizzes, and a working final mini-project.",
    to: "/courses?type=course",
  },
  {
    step: "03",
    type: "bootcamp" as const,
    title: "Bootcamps",
    time: "3–6 weeks",
    format: "Cohort + mentor",
    badge: "Go deep with a squad",
    summary:
      "Intensive cohort sprints with weekly live mentor reviews, team assignments, and production-grade engineering systems.",
    to: "/courses?type=bootcamp",
  },
  {
    step: "04",
    type: "project" as const,
    title: "Projects & Labs",
    time: "2+ weeks",
    format: "Real engineering sprint",
    badge: "Put it into practice",
    summary:
      "Collaborative student build squads shipping open-source simulation tools, research digests, and physical prototypes.",
    to: "/projects",
  },
] as const;

export const START_HERE_INTENTS = [
  {
    intent: "I have 1–2 hours",
    heading: "Try a Live Workshop",
    desc: "Learn from practicing scientists in interactive sessions with real-world context.",
    to: "/courses?type=workshop",
    badge: "60–90 min",
  },
  {
    intent: "I want to master a specific skill",
    heading: "Take a Mini-Course",
    desc: "Follow modular lessons with interactive calculations and build a working solver.",
    to: "/courses?type=course",
    badge: "2–7 hours",
  },
  {
    intent: "I want an intensive cohort experience",
    heading: "Join a Bootcamp",
    desc: "Collaborate in a 25-seat sprint with weekly mentor reviews and code evaluations.",
    to: "/courses?type=bootcamp",
    badge: "3–6 weeks",
  },
  {
    intent: "I want to build a real engineering platform",
    heading: "Join a Build Squad",
    desc: "Team up on open aerospace platforms, orbital solvers, or observation networks.",
    to: "/projects",
    badge: "Active Sprints",
  },
  {
    intent: "I want to explore on my own",
    heading: "Browse Free Resources",
    desc: "Free guides, mathematical primers, solver blueprints, and lecture notes.",
    to: "/resources",
    badge: "Self-Paced",
  },
] as const;

export const LEARNING_CATALOG: LearningItem[] = [
  // ── WORKSHOPS ──
  {
    id: "ws-rocket-propulsion",
    slug: "rocket-propulsion-fundamentals",
    type: "workshop",
    title: "Fundamentals of Rockets & Propulsion Technology",
    subtitle: "Thrust equations, specific impulse, and nozzle expansion dynamics.",
    description:
      "An interactive live masterclass exploring rocket propulsion from first principles: specific impulse, chamber pressure, nozzle exit velocity, and real aerospace defence pathways.",
    topics: ["aerospace", "physics", "engineering"],
    level: "beginner",
    duration: "90 min",
    format: "live",
    status: "upcoming",
    date: "July 2 · 7:00 PM IST",
    seats: "Open for Enrollment",
    instructor: {
      name: "Prakhar Vishwakarma",
      role: "Aerospace & Defence Projects Lead",
      org: "Missile Man of MP",
      linkedin: "https://www.linkedin.com/in/prakhar-vishwakarma/",
    },
    prerequisites: ["High school physics (Newtonian mechanics, basic pressure relations)"],
    outcomes: [
      "Understand rocket equation & delta-v fundamentals",
      "Calculate thrust coefficient & specific impulse (Isp)",
      "Explore liquid vs solid propellant motor trade-offs",
      "Pitch & Win challenge with live mentor feedback",
    ],
    agenda: [
      {
        title: "00:00 — Welcome & Aerospace Roadmaps",
        desc: "Setting the context and career pathways.",
      },
      {
        title: "00:15 — Governing Rocket Equations",
        desc: "Tsiolkovsky equation, mass ratio, and exhaust velocity.",
      },
      {
        title: "00:40 — Combustion & Nozzle Dynamics",
        desc: "Chamber pressure, De Laval convergent-divergent nozzles.",
      },
      {
        title: "01:05 — Real Case Studies & Projects",
        desc: "Sounding rockets and missile system propulsion.",
      },
      {
        title: "01:20 — Student Pitch & Win Challenge",
        desc: "Live rapid-fire problem solving and Q&A.",
      },
    ],
    related: [
      { label: "Specific Impulse & Nozzle Calculations", to: "/resources", type: "Resource Guide" },
      {
        label: "Orbital Mechanics from First Principles",
        to: "/courses?id=orbital-mechanics",
        type: "Mini-Course",
      },
      { label: "AeroForge AI Propulsion Solvers", to: "/projects", type: "Interactive Lab" },
    ],
    ctaText: "Reserve Seat (Free)",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
    featured: true,
  },
  {
    id: "ws-isro-satellite-operations",
    slug: "journey-to-isro-and-space-missions",
    type: "workshop",
    title: "From Dreams to Space Missions: A Journey to ISRO",
    subtitle: "Post-launch satellite operations, orbit tracking, and space situational awareness.",
    description:
      "Ankit Gupta (Scientist 'SC' at ISRO Master Control Facility) takes students behind the scenes of satellite operations: orbit determination, collision avoidance, and station keeping.",
    topics: ["aerospace", "astronomy", "engineering"],
    level: "beginner",
    duration: "90 min",
    format: "live",
    status: "open",
    date: "July 12 · 6:30 PM IST",
    seats: "Registration Open",
    instructor: {
      name: "Ankit Gupta",
      role: "Scientist / Engineer 'SC'",
      org: "Master Control Facility, ISRO",
      linkedin: "https://www.linkedin.com/in/ankit-gupta-isro/",
    },
    prerequisites: ["Curiosity about space missions & satellite operations"],
    outcomes: [
      "Learn what happens after a satellite reaches orbit",
      "Understand orbit determination, telemetry, and tracking (TT&C)",
      "Explore Space Situational Awareness (SSA) & collision avoidance maneuvers",
      "Understand multi-disciplinary ISRO recruitment pathways",
    ],
    related: [
      {
        label: "Orbital Mechanics Mini Course",
        to: "/courses?id=orbital-mechanics",
        type: "Mini-Course",
      },
      { label: "Astrodynamics Bootcamp", to: "/courses?type=bootcamp", type: "Bootcamp" },
    ],
    ctaText: "Reserve Seat",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
    featured: true,
  },
  {
    id: "ws-stellar-evolution",
    slug: "mystery-celestial-objects-and-galaxies",
    type: "workshop",
    title: "Mystery Celestial Objects: Stellar Evolution & Galaxies",
    subtitle: "Nebulae, dying star remnants, galactic morphologies, and Build-a-Galaxy challenge.",
    description:
      "Vranda Gupta (Stellar Freaks) leads an interactive deep dive into galactic architectures, star life cycles, and planetary nebulae with hands-on rapid-fire quizzes.",
    topics: ["astronomy", "physics"],
    level: "beginner",
    duration: "90 min",
    format: "live",
    status: "open",
    date: "August 9 · 7:00 PM IST",
    seats: "Open for Enrollment",
    instructor: {
      name: "Vranda Gupta",
      role: "Astronomy Educator & Founder",
      org: "Stellar Freaks",
      linkedin: "https://www.linkedin.com/in/vranda-gupta-b34b742a7/",
    },
    prerequisites: ["None — open to all curious minds"],
    outcomes: [
      "Classify spiral, elliptical, and irregular galactic morphologies",
      "Trace the stellar life cycle from nebulae to white dwarfs and black holes",
      "Design and present a custom galactic architecture in the Build-a-Galaxy Challenge",
    ],
    related: [
      { label: "Deep-Sky Observational Protocol", to: "/resources", type: "Resource" },
      { label: "Sky Atlas Deep-Sky Network", to: "/projects", type: "Project" },
    ],
    ctaText: "Reserve Seat",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  },

  // ── MINI-COURSES ──
  {
    id: "course-orbital-mechanics",
    slug: "orbital-mechanics-from-first-principles",
    type: "course",
    title: "Orbital Mechanics from First Principles",
    subtitle: "From Kepler's laws to Hohmann transfer delta-v calculations.",
    description:
      "Go from basic gravitational physics to computing orbital insertion burns, Keplerian state vectors, and interplanetary transfer trajectories with Python exercises.",
    topics: ["aerospace", "physics", "computing"],
    level: "intermediate",
    duration: "6 lessons · ~4 hours",
    format: "self-paced",
    status: "open",
    prerequisites: ["High-school trigonometry & basic Python/math familiarity"],
    outcomes: [
      "Derive Kepler's 3 laws from Newton's universal gravitation",
      "Compute orbital velocity via vis-viva equation at perigee/apogee",
      "Calculate two-impulse Hohmann transfer delta-v budgets",
      "Build a working orbital trajectory calculator",
    ],
    syllabus: [
      {
        title: "01 — Coordinate Systems & Two-Body Problem",
        desc: "Inertial reference frames and the central force problem.",
      },
      {
        title: "02 — Kepler's Laws & Conic Sections",
        desc: "Circular, elliptical, parabolic, and hyperbolic orbits.",
      },
      {
        title: "03 — Vis-Viva & Specific Orbital Energy",
        desc: "Energy conservation, semi-major axis, and orbital velocity.",
      },
      {
        title: "04 — Hohmann Transfer Orbits",
        desc: "Coplanar transfers, semi-major transfer ellipse, and burn times.",
      },
      {
        title: "05 — Inclination Changes & Bi-elliptic Transfers",
        desc: "Plane change delta-v costs and three-burn efficiency trade-offs.",
      },
      {
        title: "06 — Capstone Project: Orbital Simulator",
        desc: "Code a numerical orbital transfer model in Python or JavaScript.",
      },
    ],
    finalProject: {
      title: "Hohmann Transfer Delta-V Calculator",
      desc: "An interactive browser or script tool that calculates departure and arrival impulses for Earth-to-Mars transit orbits.",
      link: "/projects",
    },
    related: [
      { label: "Two-Body Keplerian Dynamics Notebook", to: "/resources", type: "Resource" },
      { label: "AeroForge Orbital Propagator Lab", to: "/projects", type: "Interactive Lab" },
      { label: "Astrodynamics Bootcamp", to: "/courses?type=bootcamp", type: "Bootcamp" },
    ],
    ctaText: "Start Learning",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
    featured: true,
  },
  {
    id: "course-aerodynamics-cfd",
    slug: "transonic-cfd-and-boundary-layers",
    type: "course",
    title: "Airfoil Aerodynamics & CFD Solvers",
    subtitle: "Boundary layer separation, NACA profiles, and Navier-Stokes approximations.",
    description:
      "Understand how lift and wave drag are computed on lifting surfaces. Model NACA 4-digit airfoils, thin airfoil theory, and Prandtl-Glauert compressibility corrections.",
    topics: ["aerospace", "engineering", "physics"],
    level: "intermediate",
    duration: "8 lessons · ~5 hours",
    format: "self-paced",
    status: "open",
    prerequisites: ["Calculus & basic fluid mechanics concepts"],
    outcomes: [
      "Understand circulation and Kutta-Joukowski lift theorem",
      "Model NACA 4-digit camber lines and thickness distributions",
      "Analyze boundary layer separation and Reynolds number scaling",
      "Run compressible CFD simulations inside AeroForge Lab",
    ],
    finalProject: {
      title: "Airfoil Lift/Drag Polar Generator",
      desc: "Simulate pressure distributions ($C_p$) and drag polar curves across subsonic and transonic regimes.",
      link: "/projects",
    },
    related: [
      { label: "CFD Solvers Primer Guide", to: "/resources", type: "Resource" },
      { label: "AeroForge AI Aerodynamics Suite", to: "/projects", type: "Interactive Lab" },
    ],
    ctaText: "Start Learning",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  },
  {
    id: "course-astronomy-data",
    slug: "observational-astronomy-and-fits-pipelines",
    type: "course",
    title: "Astronomical Data & FITS Pipelines",
    subtitle: "From raw sensor photons to calibrated stellar light curves and Messier catalogs.",
    description:
      "Learn how modern astronomers process telescope image data: bias subtraction, dark frame calibration, flat fielding, and aperture photometry.",
    topics: ["astronomy", "computing", "physics"],
    level: "beginner",
    duration: "5 lessons · ~3.5 hours",
    format: "self-paced",
    status: "open",
    prerequisites: ["Curiosity in observational astronomy"],
    outcomes: [
      "Understand CCD sensor noise and signal-to-noise ratio (SNR)",
      "Process FITS astronomical headers and raw matrix arrays",
      "Perform aperture photometry on variable stars",
      "Contribute observational records to Sky Atlas",
    ],
    finalProject: {
      title: "Messier 42 Spectral Photometer Pipeline",
      desc: "Ingest real telescope data and generate a calibrated B-V magnitude profile.",
      link: "/projects",
    },
    related: [
      { label: "Astrophotography Protocol Manual", to: "/resources", type: "Resource" },
      { label: "Sky Atlas Deep-Sky Network", to: "/projects", type: "Project" },
    ],
    ctaText: "Start Learning",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  },

  // ── BOOTCAMPS ──
  {
    id: "bootcamp-aerospace-systems",
    slug: "aerospace-systems-and-flight-simulation",
    type: "bootcamp",
    title: "Aerospace Systems & Flight Simulation Bootcamp",
    subtitle: "6 weeks · Cohort · 25 seats · Mentored by practising aerospace engineers.",
    description:
      "An intensive team sprint building an end-to-end flight dynamics and aerodynamic simulation model. Work in a cohort of 25 ambitious peers with weekly code reviews.",
    topics: ["aerospace", "engineering", "computing"],
    level: "intermediate",
    duration: "6 weeks",
    format: "cohort",
    status: "upcoming",
    date: "Cohort Starts September 2026",
    seats: "25 Seats · Application Required",
    prerequisites: [
      "Basic physics, programming fundamentals (Python or C++), willingness to collaborate",
    ],
    outcomes: [
      "Build a 6-DOF aircraft performance and stability model",
      "Implement aerodynamic coefficient lookup matrices",
      "Defend your engineering architecture in front of industry mentors",
      "Publish a comprehensive technical whitepaper and GitHub repository",
    ],
    syllabus: [
      {
        title: "Week 1: Vehicle Geometry & Mass Properties",
        desc: "CAD coordinate frames, center of gravity, and inertia tensor.",
      },
      {
        title: "Week 2: Subsonic & Transonic Aerodynamics",
        desc: "Lift slopes, induced drag, and control surface effectiveness.",
      },
      {
        title: "Week 3: Propulsion & Thrust Integration",
        desc: "Engine performance decks, fuel burn rates, and flight envelopes.",
      },
      {
        title: "Week 4: 6-DOF Equations of Motion",
        desc: "Translational and rotational equations, Euler angles, and quaternions.",
      },
      {
        title: "Week 5: Flight Control & Autopilot",
        desc: "PID pitch/roll stabilization and trajectory waypoint guidance.",
      },
      {
        title: "Week 6: Defence & Final Showcase",
        desc: "Live presentation to mentor panel and public demo release.",
      },
    ],
    finalProject: {
      title: "Full 6-DOF Flight Dynamics Simulator",
      desc: "A validated aircraft simulation environment with real telemetry visualization.",
    },
    related: [
      { label: "Airfoil Aerodynamics Course", to: "/courses", type: "Course" },
      { label: "AeroForge AI Simulation Workstation", to: "/projects", type: "Lab" },
    ],
    ctaText: "Apply to Cohort",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
    featured: true,
  },
  {
    id: "bootcamp-sounding-rocket-avionics",
    slug: "embedded-avionics-and-rocket-telemetry",
    type: "bootcamp",
    title: "Sounding Rocket Avionics & Telemetry Bootcamp",
    subtitle: "4 weeks · Cohort · 20 seats · Sensor fusion, Kalman filtering & telemetry.",
    description:
      "Design, build, and simulate flight computer avionics for atmospheric sounding rockets. Combine barometric pressure, 9-axis IMUs, and real-time radio telemetry.",
    topics: ["engineering", "computing", "physics"],
    level: "intermediate",
    duration: "4 weeks",
    format: "cohort",
    status: "upcoming",
    date: "Cohort Starts October 2026",
    seats: "20 Seats · Application Required",
    prerequisites: ["Basic C/C++ or Arduino familiarity, enthusiasm for embedded systems"],
    outcomes: [
      "Implement sensor fusion with Extended Kalman Filter (EKF)",
      "Detect apogee and trigger dual-deployment recovery events",
      "Transmit telemetry packets via LoRa / 2.4GHz radio",
      "Build a web-based ground station dashboard",
    ],
    related: [
      { label: "Rocket Propulsion Workshop", to: "/courses?type=workshop", type: "Workshop" },
      { label: "Schools Outreach Kit", to: "/schools", type: "Outreach" },
    ],
    ctaText: "Apply to Cohort",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  },

  // ── PROJECTS & LABS ──
  {
    id: "proj-aeroforge",
    slug: "aeroforge-ai",
    type: "project",
    title: "AeroForge AI Physics Workstation",
    subtitle: "40+ numerical physics solvers across CFD, FEA, and orbital Keplerian dynamics.",
    description:
      "An open-source browser engineering workstation built by students. Run 2D/3D CFD flow solvers, supersonic wave drag, and N-body gravitational propagators.",
    topics: ["aerospace", "physics", "computing", "ai"],
    level: "all",
    duration: "Active Platform",
    format: "team-sprint",
    status: "open",
    outcomes: [
      "Simulate transonic shock delay and boundary layer separation",
      "Compute orbital orbital Hohmann transfers and state vectors",
      "Open-source MIT licensed codebase ready for student experiments",
    ],
    related: [
      { label: "Transonic CFD Course", to: "/courses", type: "Course" },
      { label: "Aero CFD Build Squad", to: "/projects", type: "Build Squad" },
    ],
    ctaText: "Launch AeroForge Lab",
    link: "/projects",
    featured: true,
  },
  {
    id: "proj-sky-atlas",
    slug: "sky-atlas",
    type: "project",
    title: "Sky Atlas Deep-Sky Observational Registry",
    subtitle: "Open astronomical observation database and constellation guide.",
    description:
      "A student-maintained observation catalog tracking nebulae, star clusters, and variable stars from community night-sky observation sessions.",
    topics: ["astronomy", "computing"],
    level: "beginner",
    duration: "Active Platform",
    format: "team-sprint",
    status: "open",
    outcomes: [
      "Open astronomical observation database",
      "Interactive Messier object browser and stellar spectra",
      "Collaborative observation log built with students",
    ],
    related: [
      { label: "Astronomical Data Course", to: "/courses", type: "Course" },
      { label: "Deep-Sky Telemetry Squad", to: "/projects", type: "Build Squad" },
    ],
    ctaText: "Explore Sky Atlas",
    link: "/projects",
  },
];
