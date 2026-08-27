/**
 * Project Polaris Content Management System & Dynamic Data Store
 * Stores Programs, Past Sessions, Articles, Spotlight Features, and Team Constellation Data.
 * Persists in LocalStorage with initial seed data, editable via Admin Portal (/dashboard).
 */

export interface ProgramEvent {
  id: string;
  title: string;
  subtitle: string;
  category: "workshop" | "course" | "bootcamp" | "initiative";
  status: "upcoming" | "active" | "coming-soon" | "completed";
  date: string;
  time?: string;
  mode: "Online" | "Offline" | "Hybrid";
  speaker?: {
    name: string;
    designation: string;
    bio?: string;
    photo?: string;
  };
  details: string;
  benefits: string[];
  ctaText: string;
  ctaUrl: string;
  featured: boolean;
  visibility: boolean;
  price?: string;
}

export interface PastSession {
  id: string;
  title: string;
  date: string;
  speaker: string;
  designation: string;
  topic: string;
  participants: string;
  summary: string;
  photo?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category:
    | "Science & Astronomy"
    | "Technology & Innovation"
    | "Research"
    | "Education"
    | "Entrepreneurship"
    | "Student Perspectives";
  publishedAt: string;
  readTime: string;
  excerpt: string;
  content: string;
  featured: boolean;
}

export interface SpotlightEntry {
  id: string;
  name: string;
  category:
    | "Student Spotlight"
    | "Project Spotlight"
    | "Winner Spotlight"
    | "Team Spotlight"
    | "Community Spotlight";
  headline: string;
  story: string;
  accomplishment: string;
  contributionToPolaris?: string;
  image: string;
  featured: boolean; // Latest spotlight hero
  date: string;
  links?: { label: string; url: string }[];
}

export interface IndustrySprintProject {
  id: string;
  title: string;
  domain: "Aerospace & Rocketry" | "Astrophysics & Space Science" | "CSE & AI for Science" | "Mechanical & Systems";
  difficulty: "Foundational" | "Intermediate" | "Industry Standard";
  sprintDuration: string;
  teamSize: string;
  overview: string;
  industryProblem: string;
  deliverables: string[];
  skillsGained: string[];
  mentorship: {
    lead: string;
    role: string;
    reviewCadence: string;
  };
  tier: "Open Sprint (Free)" | "Industry Fellowship (Certified & Mentored)";
  price?: string;
  credits: string;
  status: "Open for Squads" | "Active Sprint" | "Upcoming";
}

export interface TeamMemberNode {
  id: string;
  name: string;
  department: string;
  role: string;
  intro: string;
  whatIBring: string;
  photo?: string;
  orbitRadius: number; // For constellation coordinate positioning
  orbitAngle: number;
  speed: number;
}

// ── 1. SEED DATA ──

export const INITIAL_INDUSTRY_SPRINTS: IndustrySprintProject[] = [
  {
    id: "sprint-cfd-transonic",
    title: "Transonic Airfoil CFD & Supercritical Shock Wave Simulation",
    domain: "Aerospace & Rocketry",
    difficulty: "Industry Standard",
    sprintDuration: "4 Weeks Sprint",
    teamSize: "2–4 Explorers per Squad (or Solo)",
    overview:
      "Model transonic flow over RAE 2822 and NASA SC(2) supercritical airfoils. Capture shockwave-boundary layer interactions and calculate wave drag rise using numerical finite volume solvers.",
    industryProblem:
      "Modern aerospace firms require fast aerodynamic mesh validation and drag prediction before wind tunnel prototyping.",
    deliverables: [
      "Compressible Navier-Stokes Euler mesh solver script",
      "Interactive pressure coefficient (Cp) contour dashboard",
      "Technical verification report co-authored with sprint squad",
    ],
    skillsGained: ["Computational Fluid Dynamics (CFD)", "Aerodynamics", "Python / C++", "Mesh Generation"],
    mentorship: {
      lead: "Aerospace Research Mentor",
      role: "Ex-ISRO / Aerodynamics Fellow",
      reviewCadence: "Weekly Code & Mesh Critique Sessions",
    },
    tier: "Industry Fellowship (Certified & Mentored)",
    price: "Cohort Fellowship",
    credits: "Verified Digital Credential + Co-Author Paper Credit",
    status: "Open for Squads",
  },
  {
    id: "sprint-pinn-fluid",
    title: "Physics-Informed Neural Networks (PINNs) for Fluid Flow",
    domain: "CSE & AI for Science",
    difficulty: "Industry Standard",
    sprintDuration: "4 Weeks Sprint",
    teamSize: "2–3 Explorers per Squad",
    overview:
      "Train deep neural networks that directly enforce the Navier-Stokes partial differential equations in their loss functions for instantaneous surrogate fluid field prediction.",
    industryProblem:
      "High-resolution CFD takes hours to compute. AI-surrogate physical models enable real-time aerodynamic control in autonomous aerial vehicles.",
    deliverables: [
      "PyTorch / JAX PINN training pipeline",
      "Loss convergence analysis against ground-truth CFD benchmarks",
      "Public GitHub repository with reproducible Google Colab notebook",
    ],
    skillsGained: ["Deep Learning / PINNs", "PyTorch / JAX", "Differential Equations", "Scientific Computing"],
    mentorship: {
      lead: "AI for Science Lead",
      role: "Computational Physics Researcher",
      reviewCadence: "Weekly Model Architecture Review",
    },
    tier: "Industry Fellowship (Certified & Mentored)",
    price: "Cohort Fellowship",
    credits: "Verified GitHub Badge + Spotlight Feature",
    status: "Open for Squads",
  },
  {
    id: "sprint-exoplanet-photometry",
    title: "Deep Sky Photometry & Exoplanet Transit Light Curve Modeling",
    domain: "Astrophysics & Space Science",
    difficulty: "Intermediate",
    sprintDuration: "3 Weeks Sprint",
    teamSize: "2–4 Explorers per Squad",
    overview:
      "Analyze raw telescopic FITS imagery from Kepler/TESS space telescopes. Extract differential photometric fluxes, filter instrumental noise, and calculate exoplanetary radius and orbital semi-major axis.",
    industryProblem:
      "Astronomical sky surveys generate petabytes of raw observational data requiring automated, noise-robust transit detection pipelines.",
    deliverables: [
      "Automated light curve detrending & transit fitting script",
      "MCMC parameter estimation for planetary radius & inclination",
      "Published observational write-up in Polaris Community Articles",
    ],
    skillsGained: ["Astronomical Photometry", "AstroPy / FITS", "MCMC Statistical Modeling", "Astrophysics"],
    mentorship: {
      lead: "Astrophysics Fellow",
      role: "Observational Astronomer",
      reviewCadence: "Bi-weekly Astrometry & Data Review",
    },
    tier: "Open Sprint (Free)",
    price: "100% Free",
    credits: "Polaris Student Showcase Feature + Open Source Contributor Badge",
    status: "Open for Squads",
  },
  {
    id: "sprint-cubesat-fea",
    title: "CubeSat Chassis Finite Element Analysis (FEA) & Thermal Control",
    domain: "Mechanical & Systems",
    difficulty: "Industry Standard",
    sprintDuration: "4 Weeks Sprint",
    teamSize: "2–4 Explorers per Squad",
    overview:
      "Design a modular 3U CubeSat chassis adhering to standard launch vehicle random vibration launch profiles (NASA GEVS) and orbital solar thermal radiation extremes.",
    industryProblem:
      "CubeSats must withstand severe acoustic and vibrational launch loads (up to 14g RMS) without structural failure or thermal damage in eclipse.",
    deliverables: [
      "CAD model with mass budget optimization (< 4.0 kg)",
      "Modal, random vibration, and harmonic stress analysis report",
      "Transient orbital thermal equilibrium simulation",
    ],
    skillsGained: ["Finite Element Analysis (FEA)", "Structural Dynamics", "CAD / STEP Modeling", "Thermal Engineering"],
    mentorship: {
      lead: "Structural Systems Lead",
      role: "Satellite Systems Engineer",
      reviewCadence: "Weekly Design Review & Stress Verification",
    },
    tier: "Industry Fellowship (Certified & Mentored)",
    price: "Cohort Fellowship",
    credits: "Verified Engineering Credential + Portfolio Case Study",
    status: "Open for Squads",
  },
];

export const INITIAL_PROGRAMS: ProgramEvent[] = [
  {
    id: "star-universe-aug29",
    title: "Exploring the Star Universe: A Journey into the Wonders of Astronomy",
    subtitle: "Join us for an engaging astronomy session as we embark on a journey through the fascinating world of stars and cosmos.",
    category: "workshop",
    status: "upcoming",
    date: "29 August 2026",
    time: "6:00 PM IST",
    mode: "Online",
    speaker: {
      name: "Scientist Baldev Krishan Sharma",
      designation: "Cosmo-scientist and Author",
      bio: "Distinguished researcher in astrophysical cosmos modeling and author of comprehensive cosmological works.",
    },
    details:
      "Whether you are an astronomy enthusiast or simply curious about the Universe, this session is an opportunity to explore the fascinating world of astronomy and deepen your understanding of the cosmos.",
    benefits: [
      "Chance to interact with expert scientist",
      "Chance to interact with like-minded enthusiasts",
      "Explore the COSMOS",
      "Participation certificates for all",
      "Rewards (To be revealed soon)",
      "Amazing Activity planned",
    ],
    ctaText: "Register Now →",
    ctaUrl: "https://forms.gle/EaZUGjUd7spcQfoF7",
    featured: true,
    visibility: true,
    price: "100% Free",
  },
  {
    id: "polaris-volunteer-cohort",
    title: "Build Polaris With Us (Volunteer Program)",
    subtitle: "Polaris isn't built only for students. It's built with students.",
    category: "initiative",
    status: "active",
    date: "Cohort Open",
    mode: "Online",
    details:
      "Join as a student volunteer across 4 core engineering, outreach, and research tracks to build real initiatives.",
    benefits: [
      "Hands-on project leadership",
      "Direct collaboration with core team",
      "Merit-based verification & recommendation",
    ],
    ctaText: "Apply as Volunteer →",
    ctaUrl: "https://drive.google.com/file/d/1YxoWvwXBQvJQ9gewJyEYhez-C1NpLPph/view?usp=drive_link",
    featured: false,
    visibility: true,
  },
  {
    id: "innovation-program-soon",
    title: "Polaris Innovation Program",
    subtitle: "Long-term sprint cohorts solving real aerospace, computational, and hardware engineering challenges.",
    category: "bootcamp",
    status: "coming-soon",
    date: "Coming Soon",
    mode: "Online",
    details: "Comprehensive build-cohort where student squads develop verified software platforms and hardware prototypes.",
    benefits: [
      "Mentorship from practicing engineers",
      "Sprint-based team projects",
      "Public artifact deployment",
    ],
    ctaText: "Details to be disclosed soon",
    ctaUrl: "#",
    featured: false,
    visibility: true,
  },
  {
    id: "chapter-lead-soon",
    title: "Chapter Lead Program",
    subtitle: "Establish and lead an official Polaris Space & Engineering Chapter at your school or university.",
    category: "initiative",
    status: "coming-soon",
    date: "Coming Soon",
    mode: "Hybrid",
    details: "Lead astronomy observation sessions, CFD simulations, and workshops in Tier-2, Tier-3 cities and remote regions.",
    benefits: [
      "Official institutional leadership",
      "Event kits and telescopic observation guidance",
      "National student network connection",
    ],
    ctaText: "Launching Soon",
    ctaUrl: "/chapters",
    featured: false,
    visibility: true,
  },
  {
    id: "mentor-panel-soon",
    title: "Mentor Panel & Fellowships",
    subtitle: "1-on-1 and squad guidance from aerospace scientists, propulsion engineers, and researchers.",
    category: "course",
    status: "coming-soon",
    date: "Coming Soon",
    mode: "Online",
    details: "Get direct technical critique on research papers, FEA stress analyses, and trajectory solvers.",
    benefits: [
      "Technical code and design reviews",
      "Career pathway guidance in ISRO & industry",
      "Verified co-authored publications",
    ],
    ctaText: "Coming Soon",
    ctaUrl: "#",
    featured: false,
    visibility: true,
  },
];

export const INITIAL_PAST_SESSIONS: PastSession[] = [
  {
    id: "session-1",
    title: "Fundamentals of Rocket Development",
    date: "2 July 2026",
    speaker: "Mr. Prakhar Vishwakarma",
    designation: "Missile Man of MP",
    topic: "Solid propulsion physics, structural mass ratios, and staging aerodynamics.",
    participants: "5 Participants",
    summary:
      "Our very first session introducing foundational propulsion thermodynamics and flight mechanics.",
  },
  {
    id: "session-2",
    title: "How to Pursue Your Career in ISRO",
    date: "12 July 2026",
    speaker: "Mr. Ankit Gupta",
    designation: "Scientist/Engineer 'SC' at ISRO",
    topic: "ISRO recruitment pathways, ICRB examination structure, and spacecraft engineering.",
    participants: "22 Participants",
    summary:
      "Direct interactive masterclass on scientific career preparation and space mission development at ISRO.",
  },
  {
    id: "session-3",
    title: "Cosmic Conversations",
    date: "26 July 2026",
    speaker: "Project Polaris Core",
    designation: "Astrophysics Lead & Moderators",
    topic: "Interactive astronomy storytelling, astrophysical quiz, and constellation-hunting challenge.",
    participants: "12 Participants",
    summary:
      "Community observation night and constellation mapping challenge examining deep-sky objects.",
  },
  {
    id: "session-4",
    title: "Dive into the World of Galaxies & Nebulas",
    date: "9 August 2026",
    speaker: "Ms. Vranda Gupta",
    designation: "Founder, Stellar Freaks",
    topic: "Deep space astrophysics, interstellar nebulae classification, and galactic evolutionary dynamics.",
    participants: "60+ Participants",
    summary:
      "A landmark interactive milestone exploring planetary nebulae, galactic morphology, and spectroscopic observations.",
  },
];

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: "art-1",
    title: "Understanding Transonic Compressibility: Why Airfoils Shock",
    slug: "understanding-transonic-compressibility",
    author: {
      name: "Aditya & Polaris Aerodynamics Squad",
      role: "Student Research Lead",
    },
    category: "Science & Astronomy",
    publishedAt: "20 August 2026",
    readTime: "5 min read",
    excerpt:
      "A computational breakdown of Mach numbers, critical drag rise, and how shockwaves form over supercritical wings in transonic flow.",
    content:
      "When an aircraft approaches Mach 1, local airflow over the curved suction surface reaches supersonic velocity while the freestream velocity is still subsonic...",
    featured: true,
  },
  {
    id: "art-2",
    title: "Keplerian Mechanics to N-Body Numerical Integration",
    slug: "keplerian-mechanics-to-n-body",
    author: {
      name: "Polaris Orbital Mechanics Group",
      role: "Simulation Contributor",
    },
    category: "Research",
    publishedAt: "15 August 2026",
    readTime: "7 min read",
    excerpt:
      "Why classical two-body equations fail for Lagrange point transfers, and how Runge-Kutta 4th order solvers bridge the gap.",
    content:
      "Classical orbital mechanics assumes a central gravitational field. In three-body regimes like the Earth-Moon Lagrangian points L1 and L2...",
    featured: false,
  },
  {
    id: "art-3",
    title: "Building Experiential Engineering Cohorts from Tier-2 Cities",
    slug: "building-experiential-cohorts",
    author: {
      name: "Project Polaris Editorial",
      role: "Ecosystem Note",
    },
    category: "Student Perspectives",
    publishedAt: "10 August 2026",
    readTime: "4 min read",
    excerpt:
      "How peer-to-peer open computational simulations eliminate geography and economic barriers in aerospace learning.",
    content:
      "Curiosity has no pin code. When students have access to browser-based physics workstations, they build aerodynamic mesh solvers from anywhere...",
    featured: false,
  },
];

export const INITIAL_SPOTLIGHT: SpotlightEntry[] = [
  {
    id: "spot-1",
    name: "AeroForge AI Simulation Workstation",
    category: "Project Spotlight",
    headline: "Building 40+ Browser-Based Numerical Solvers for Aerospace Explorers",
    story:
      "The AeroForge initiative was built to provide free, high-fidelity computational fluid dynamics, structural finite element analysis, and orbital Keplerian simulation directly in modern web browsers without requiring complex supercomputing clusters.",
    accomplishment:
      "Engineered 40+ physics solvers with WebGL 2.0 visualization, used across student workshops and research cohorts.",
    contributionToPolaris:
      "Flagship open-source simulation tool powering Project Polaris practical learning cohorts.",
    image: "/polaris-logo.png",
    featured: true,
    date: "August 2026",
    links: [
      { label: "Launch AeroForge", url: "/aeroforge" },
      { label: "View Source Code", url: "https://github.com/blaze505050/project-polaris" },
    ],
  },
  {
    id: "spot-2",
    name: "Galaxies & Nebulae Interactive Cohort",
    category: "Winner Spotlight",
    headline: "60+ Students Successfully Map Deep Space Nebula Spectroscopy",
    story:
      "During our fourth masterclass, participants analyzed real astronomical spectral lines to identify chemical compositions of star-forming regions.",
    accomplishment:
      "Highest single-session attendance and verified participation certificates issued to 60+ active learners.",
    contributionToPolaris: "Validated the experiential live masterclass model with active quizzes and hands-on exercises.",
    image: "/night-observation.webp",
    featured: false,
    date: "9 August 2026",
  },
  {
    id: "spot-3",
    name: "Student Volunteer Operations Squad",
    category: "Team Spotlight",
    headline: "28+ Contributors Building Operations, Outreach, and Content",
    story:
      "From scheduling ISRO scientist sessions to preparing study guides and computational models, our student volunteers power every single Polaris program.",
    accomplishment: "Coordinated 4 interactive workshops reaching 1,000+ students across India.",
    contributionToPolaris: "The backbone of community moderation, outreach partnerships, and cohort onboarding.",
    image: "/students-building.webp",
    featured: false,
    date: "July - August 2026",
  },
];

export const TEAM_CONSTELLATION_MEMBERS: TeamMemberNode[] = [
  {
    id: "aditya",
    name: "Aditya",
    department: "Executive & Engineering",
    role: "Founder & Technical Lead",
    intro: "Aerospace simulation enthusiast focused on making computational physics and rocketry tools accessible to every curious student.",
    whatIBring: "Architecting numerical simulation engines, software platforms, and ecosystem direction.",
    orbitRadius: 130,
    orbitAngle: 0.2,
    speed: 0.0006,
  },
  {
    id: "operations-lead",
    name: "Core Operations",
    department: "Operations & Logistics",
    role: "Program & Logistics Lead",
    intro: "Managing session timelines, scientist masterclasses, student cohort registration, and certificate verification.",
    whatIBring: "Ensuring smooth execution of every workshop and real-time student support.",
    orbitRadius: 190,
    orbitAngle: 1.8,
    speed: -0.0004,
  },
  {
    id: "research-lead",
    name: "Research Cohort",
    department: "Scientific Research",
    role: "Research & Simulation Fellow",
    intro: "Guiding students through formulating research hypotheses, data collection, and peer-reviewed technical paper preparation.",
    whatIBring: "Bridging textbook theory with numerical CFD and orbital trajectory verification.",
    orbitRadius: 240,
    orbitAngle: 3.4,
    speed: 0.0003,
  },
  {
    id: "outreach-lead",
    name: "Outreach & Partnerships",
    department: "Community & Schools",
    role: "Institutional Outreach Lead",
    intro: "Connecting Project Polaris with schools, colleges, and astronomy clubs across Tier-2 and Tier-3 cities.",
    whatIBring: "Expanding access to space science for students without institutional infrastructure.",
    orbitRadius: 160,
    orbitAngle: 4.8,
    speed: -0.0005,
  },
  {
    id: "content-lead",
    name: "Content & Design",
    department: "Design & Publications",
    role: "Media & Publications Lead",
    intro: "Crafting technical explainers, Aaj Ka Gyan drops, and open educational resources.",
    whatIBring: "Translating complex aerospace concepts into engaging, digestible visual knowledge.",
    orbitRadius: 210,
    orbitAngle: 5.9,
    speed: 0.0004,
  },
];

// ── 2. CMS STATE GETTERS & SETTERS (LocalStorage Persisted) ──

const STORAGE_KEYS = {
  PROGRAMS: "polaris_cms_programs",
  ARTICLES: "polaris_cms_articles",
  SPOTLIGHT: "polaris_cms_spotlight",
};

export function getPrograms(): ProgramEvent[] {
  if (typeof window === "undefined") return INITIAL_PROGRAMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    if (!raw) return INITIAL_PROGRAMS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROGRAMS;
  }
}

export function savePrograms(programs: ProgramEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
}

export function getArticles(): ArticleItem[] {
  if (typeof window === "undefined") return INITIAL_ARTICLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!raw) return INITIAL_ARTICLES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveArticles(articles: ArticleItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
}

export function getSpotlights(): SpotlightEntry[] {
  if (typeof window === "undefined") return INITIAL_SPOTLIGHT;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPOTLIGHT);
    if (!raw) return INITIAL_SPOTLIGHT;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SPOTLIGHT;
  }
}

export function saveSpotlights(spotlights: SpotlightEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SPOTLIGHT, JSON.stringify(spotlights));
}

const INDUSTRY_SPRINTS_KEY = "polaris_cms_industry_sprints";

export function getIndustrySprints(): IndustrySprintProject[] {
  if (typeof window === "undefined") return INITIAL_INDUSTRY_SPRINTS;
  try {
    const raw = localStorage.getItem(INDUSTRY_SPRINTS_KEY);
    if (!raw) return INITIAL_INDUSTRY_SPRINTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_INDUSTRY_SPRINTS;
  }
}

export function saveIndustrySprints(sprints: IndustrySprintProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INDUSTRY_SPRINTS_KEY, JSON.stringify(sprints));
}
