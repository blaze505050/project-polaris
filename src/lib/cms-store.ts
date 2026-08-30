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
    linkedin?: string;
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
  speakerLinkedin?: string;
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
  domain:
    | "Aerospace & Rocketry"
    | "Astrophysics & Space Science"
    | "CSE & AI for Science"
    | "Mechanical & Systems";
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
    id: "sprint-cfd-aerodynamics",
    title: "Aerodynamics & Computational Flow Simulation",
    domain: "Aerospace & Rocketry",
    difficulty: "Foundational",
    sprintDuration: "4 Weeks Sprint",
    teamSize: "2–4 Students per Squad (or Solo)",
    overview:
      "Explore foundational fluid dynamics and airfoil pressure contours using computational physics and numerical simulation tools.",
    industryProblem:
      "Understanding aerodynamic flow and drag forces through hands-on computational modeling rather than abstract textbook equations.",
    deliverables: [
      "Aerodynamic flow analysis script",
      "Interactive pressure contour plots",
      "Summary learning presentation with team",
    ],
    skillsGained: ["Aerodynamics Basics", "Numerical Simulation", "Python", "Data Visualization"],
    mentorship: {
      lead: "Polaris Technical Team",
      role: "Peer Mentors & Project Leads",
      reviewCadence: "Weekly Collaborative Check-ins",
    },
    tier: "Open Sprint (Free)",
    price: "TBD",
    credits: "Polaris Certificate of Participation",
    status: "Open for Squads",
  },
  {
    id: "sprint-python-science",
    title: "Python & Machine Learning for Scientific Computing",
    domain: "CSE & AI for Science",
    difficulty: "Intermediate",
    sprintDuration: "4 Weeks Sprint",
    teamSize: "2–3 Students per Squad",
    overview:
      "Apply Python programming, data science, and computational algorithms to model physical systems and data.",
    industryProblem:
      "Modern scientific research relies heavily on computational algorithms to analyze large datasets and simulate physical dynamics.",
    deliverables: [
      "Python data analysis notebook",
      "Interactive visualization graphs",
      "Open GitHub project repository",
    ],
    skillsGained: ["Python", "NumPy / SciPy", "Data Analysis", "Scientific Modeling"],
    mentorship: {
      lead: "Polaris Technical Team",
      role: "Peer Mentors & Project Leads",
      reviewCadence: "Weekly Project Reviews",
    },
    tier: "Open Sprint (Free)",
    price: "TBD",
    credits: "Polaris Showcase Feature",
    status: "Open for Squads",
  },
  {
    id: "sprint-astronomy-data",
    title: "Observational Astronomy & Celestial Data Analysis",
    domain: "Astrophysics & Space Science",
    difficulty: "Foundational",
    sprintDuration: "3 Weeks Sprint",
    teamSize: "2–4 Students per Squad",
    overview:
      "Analyze public astronomical datasets from space telescopes and sky surveys to study stars, galaxies, and celestial mechanics.",
    industryProblem:
      "Making real observational astronomical data accessible for high school and university students to explore freely.",
    deliverables: [
      "Observational data analysis report",
      "Stellar analysis notebook",
      "Article submission to Polaris Community",
    ],
    skillsGained: ["Observational Astronomy", "AstroPy Basics", "Data Analysis", "Astrophysics"],
    mentorship: {
      lead: "Polaris Astronomy Lead",
      role: "Student Research Mentor",
      reviewCadence: "Bi-weekly Session Reviews",
    },
    tier: "Open Sprint (Free)",
    price: "TBD",
    credits: "Polaris Student Showcase Feature",
    status: "Open for Squads",
  },
  {
    id: "sprint-cad-design",
    title: "3D CAD Modeling & Engineering Systems",
    domain: "Mechanical & Systems",
    difficulty: "Intermediate",
    sprintDuration: "4 Weeks Sprint",
    teamSize: "2–4 Students per Squad",
    overview:
      "Learn 3D CAD modeling, mechanical design principles, and structural modeling for aerospace and physical systems.",
    industryProblem:
      "Bridging conceptual engineering design with hands-on 3D parametric CAD modeling and mechanical analysis.",
    deliverables: [
      "3D CAD assembly models",
      "Bill of materials & design documentation",
      "Portfolio case study document",
    ],
    skillsGained: ["CAD Modeling", "Mechanical Design", "Systems Engineering", "Prototyping"],
    mentorship: {
      lead: "Polaris Engineering Lead",
      role: "Student Engineering Mentor",
      reviewCadence: "Weekly Design Reviews",
    },
    tier: "Open Sprint (Free)",
    price: "TBD",
    credits: "Polaris Project Certificate",
    status: "Open for Squads",
  },
];

export const INITIAL_PROGRAMS: ProgramEvent[] = [
  {
    id: "star-universe-aug29",
    title: "Exploring the Star Universe: A Journey into the Wonders of Astronomy",
    subtitle:
      "Join us for an engaging astronomy session as we embark on a journey through the fascinating world of stars and cosmos.",
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
      "Interactive Q&A session",
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
      "Join as a student volunteer across 4 core departments (Operations, Outreach, Research, Content & Design) to build real initiatives.",
    benefits: [
      "Hands-on project leadership",
      "Direct collaboration with core team",
      "Merit-based verification & recommendation",
    ],
    ctaText: "Apply as Volunteer →",
    ctaUrl: "https://drive.google.com/file/d/1YxoWvwXBQvJQ9gewJyEYhez-C1NpLPph/view?usp=drive_link",
    featured: false,
    visibility: true,
    price: "Free & Open",
  },
  {
    id: "innovation-program-soon",
    title: "Polaris Innovation Program",
    subtitle: "Long-term cohorts solving meaningful problems and building tangible projects.",
    category: "bootcamp",
    status: "coming-soon",
    date: "Coming Soon",
    mode: "Online",
    details:
      "Collaborative cohorts where student squads develop projects and practical prototypes.",
    benefits: ["TBD"],
    ctaText: "Details to be disclosed soon",
    ctaUrl: "#",
    featured: false,
    visibility: true,
    price: "TBD",
  },
  {
    id: "chapter-lead-soon",
    title: "Chapter Lead Program",
    subtitle: "Establish and lead an official Polaris Space Chapter at your school or university.",
    category: "initiative",
    status: "coming-soon",
    date: "Coming Soon",
    mode: "Hybrid",
    details:
      "Lead astronomy observation sessions, workshops, and science culture in Tier-2, Tier-3 cities and remote regions.",
    benefits: ["TBD"],
    ctaText: "Launching Soon",
    ctaUrl: "/chapters",
    featured: false,
    visibility: true,
    price: "TBD",
  },
  {
    id: "mentor-panel-soon",
    title: "Mentor Panel & Fellowships",
    subtitle:
      "Guidance and interactive reviews from experienced scientists, researchers, and mentors.",
    category: "course",
    status: "coming-soon",
    date: "Coming Soon",
    mode: "Online",
    details:
      "Direct technical guidance and reviews on student science projects, simulations, and research.",
    benefits: ["TBD"],
    ctaText: "Coming Soon",
    ctaUrl: "#",
    featured: false,
    visibility: true,
    price: "TBD",
  },
];

export const INITIAL_PAST_SESSIONS: PastSession[] = [
  {
    id: "session-1",
    title: "Fundamentals of Rocket Development",
    date: "2 July 2026",
    speaker: "Mr. Prakhar Vishwakarma",
    designation: "Missile Man of MP",
    speakerLinkedin: "https://www.linkedin.com/in/prakhar-vishwakarma-missile-man/",
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
    speakerLinkedin: "https://www.linkedin.com/in/ankit-gupta-isro/",
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
    speakerLinkedin: "https://www.linkedin.com/company/project-polaris/",
    topic:
      "Interactive astronomy storytelling, astrophysical quiz, and constellation-hunting challenge.",
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
    speakerLinkedin: "https://www.linkedin.com/in/vranda-gupta-stellarfreaks/",
    topic:
      "Deep space astrophysics, interstellar nebulae classification, and galactic evolutionary dynamics.",
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
      name: "Polaris Aerodynamics Squad",
      role: "Student Research Cohort",
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
    contributionToPolaris:
      "Validated the experiential live masterclass model with active quizzes and hands-on exercises.",
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
    contributionToPolaris:
      "The backbone of community moderation, outreach partnerships, and cohort onboarding.",
    image: "/students-building.webp",
    featured: false,
    date: "July - August 2026",
  },
];

export const TEAM_CONSTELLATION_MEMBERS: TeamMemberNode[] = [
  {
    id: "engineering-lead",
    name: "Engineering Squad",
    department: "Simulation & Systems",
    role: "Aerospace & Systems Engineering",
    intro:
      "Computational physics, aerodynamics, and rocketry tools built by students for students to explore real-world mechanics.",
    whatIBring:
      "Architecting numerical simulation engines, software platforms, and scientific workflows.",
    orbitRadius: 130,
    orbitAngle: 0.2,
    speed: 0.0006,
  },
  {
    id: "operations-lead",
    name: "Core Operations",
    department: "Operations & Logistics",
    role: "Program & Logistics Lead",
    intro:
      "Managing session timelines, scientist masterclasses, student cohort registration, and certificate verification.",
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
    intro:
      "Guiding students through formulating research hypotheses, data collection, and peer-reviewed technical paper preparation.",
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
    intro:
      "Connecting Project Polaris with schools, colleges, and astronomy clubs across Tier-2 and Tier-3 cities.",
    whatIBring:
      "Expanding access to space science for students without institutional infrastructure.",
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
    whatIBring:
      "Translating complex aerospace concepts into engaging, digestible visual knowledge.",
    orbitRadius: 210,
    orbitAngle: 5.9,
    speed: 0.0004,
  },
];

// ── 2. CMS STATE GETTERS & SETTERS (LocalStorage Persisted) ──

const STORAGE_KEYS = {
  PROGRAMS: "polaris_cms_programs",
  PAST_SESSIONS: "polaris_cms_past_sessions",
  ARTICLES: "polaris_cms_articles",
  SPOTLIGHT: "polaris_cms_spotlight",
  INDUSTRY_SPRINTS: "polaris_cms_industry_sprints",
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

export function getPastSessions(): PastSession[] {
  if (typeof window === "undefined") return INITIAL_PAST_SESSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAST_SESSIONS);
    if (!raw) return INITIAL_PAST_SESSIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PAST_SESSIONS;
  }
}

export function savePastSessions(sessions: PastSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PAST_SESSIONS, JSON.stringify(sessions));
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

export function getIndustrySprints(): IndustrySprintProject[] {
  if (typeof window === "undefined") return INITIAL_INDUSTRY_SPRINTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INDUSTRY_SPRINTS);
    if (!raw) return INITIAL_INDUSTRY_SPRINTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_INDUSTRY_SPRINTS;
  }
}

export function saveIndustrySprints(sprints: IndustrySprintProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.INDUSTRY_SPRINTS, JSON.stringify(sprints));
}

export function exportAllCmsData(): string {
  const data = {
    programs: getPrograms(),
    pastSessions: getPastSessions(),
    articles: getArticles(),
    spotlights: getSpotlights(),
    industrySprints: getIndustrySprints(),
    submissions: getUserSubmissions(),
    exportedAt: new Date().toISOString(),
    version: "2.0",
  };
  return JSON.stringify(data, null, 2);
}

export function importAllCmsData(jsonString: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.programs && Array.isArray(parsed.programs)) {
      savePrograms(parsed.programs);
    }
    if (parsed.pastSessions && Array.isArray(parsed.pastSessions)) {
      savePastSessions(parsed.pastSessions);
    }
    if (parsed.articles && Array.isArray(parsed.articles)) {
      saveArticles(parsed.articles);
    }
    if (parsed.spotlights && Array.isArray(parsed.spotlights)) {
      saveSpotlights(parsed.spotlights);
    }
    if (parsed.industrySprints && Array.isArray(parsed.industrySprints)) {
      saveIndustrySprints(parsed.industrySprints);
    }
    if (parsed.submissions && Array.isArray(parsed.submissions)) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsed.submissions));
    }
    return true;
  } catch {
    return false;
  }
}

export function resetAllCmsData() {
  if (typeof window === "undefined") return;
  savePrograms(INITIAL_PROGRAMS);
  savePastSessions(INITIAL_PAST_SESSIONS);
  saveArticles(INITIAL_ARTICLES);
  saveSpotlights(INITIAL_SPOTLIGHT);
  saveIndustrySprints(INITIAL_INDUSTRY_SPRINTS);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
}

// ── 3. USER SUBMISSIONS & BACKEND DATA STORE ──

export interface UserSubmission {
  id: string;
  type: "waitlist" | "sprint_application" | "contact_inquiry" | "chapter_lead" | "newsletter";
  name: string;
  email: string;
  phone?: string;
  programTitle?: string;
  domain?: string;
  squadMembers?: string;
  message?: string;
  timestamp: string;
}

const SUBMISSIONS_KEY = "polaris_user_submissions";

const INITIAL_SUBMISSIONS: UserSubmission[] = [
  {
    id: "sub-1",
    type: "waitlist",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    programTitle: "Polaris Innovation Program",
    message: "Interested in physical rocketry hardware prototypes and CFD aerodynamics.",
    timestamp: "2026-08-25T14:20:00.000Z",
  },
  {
    id: "sub-2",
    type: "sprint_application",
    name: "Sneha Patel",
    email: "sneha.p@example.com",
    domain: "Aerospace & Rocketry",
    programTitle: "Transonic Airfoil CFD & Shock Wave Modeling",
    squadMembers: "Sneha Patel, Rohan Verma",
    message: "We have basic OpenFOAM experience and want to learn supersonic grid generation.",
    timestamp: "2026-08-26T11:15:00.000Z",
  },
  {
    id: "sub-3",
    type: "contact_inquiry",
    name: "Dr. K. N. Rao",
    email: "knrao@institute.edu",
    message:
      "Interested in organizing a Polaris satellite simulation workshop for our undergraduate engineering department.",
    timestamp: "2026-08-26T16:40:00.000Z",
  },
  {
    id: "sub-4",
    type: "chapter_lead",
    name: "Vikram Mehta",
    email: "vikram.m@college.org",
    programTitle: "Regional Chapter Lead",
    message: "Want to launch a Polaris chapter at our university in Indore.",
    timestamp: "2026-08-27T09:30:00.000Z",
  },
];

export function getUserSubmissions(): UserSubmission[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

export function saveUserSubmission(
  submission: Omit<UserSubmission, "id" | "timestamp">,
): UserSubmission {
  const current = getUserSubmissions();
  const newEntry: UserSubmission = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newEntry, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  }
  return newEntry;
}

export function deleteUserSubmission(id: string): UserSubmission[] {
  const current = getUserSubmissions();
  const updated = current.filter((s) => s.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function clearAllUserSubmissions() {
  if (typeof window !== "undefined") {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  }
}
