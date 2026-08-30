export const SITE = {
  name: "Project Polaris",
  headline: "Build real engineering projects.",
  subheadline: "Learn everything you need along the way.",
  tagline: "Learning through Building, rather than Building after learning.",
  taglineAlt: "Learn by building, rather than building after learning.",
  description:
    "Project Polaris is a student engineering ecosystem where ambitious students build simulations, software, research projects and physical systems with mentors and peers.",
  mission:
    "To make practical, hands-on, and industry-relevant learning accessible to every student by creating opportunities to build, experiment, collaborate, and innovate.",
  vision:
    "To build one of the world's most impactful student engineering communities—one that empowers young minds to become builders, researchers, and innovators.",
  communityUrl: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  volunteerUrl: "https://polaris-volunteer-program-8.my.canva.site",
  associateFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  feedbackFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  phone: "+91 97970 42664",
  emails: ["project.polaris8@gmail.com", "contactprojectpolaris@gmail.com"],
  instagramUrl: "https://www.instagram.com/project_polaris_?igsh=cGR3aGdkdjd2Y2hm",
  linkedinCompanyUrl: "https://www.linkedin.com/company/nova-next-gen-of-vision-and-astronomy/",
} as const;

export const THREE_PILLARS = [
  {
    key: "BUILD",
    title: "Build Real Projects",
    description:
      "Build authentic physics simulations, astronomical databases, data pipelines, and computational aerospace models with verifiable code.",
    badge: "Engineering Core",
  },
  {
    key: "LEARN",
    title: "Learn What You Need",
    description:
      "Learn on-demand through mentor office hours, ISRO scientist masterclasses, peer code reviews, and structured problem roadmaps.",
    badge: "Cohorts & Mentors",
  },
  {
    key: "CONNECT",
    title: "Connect in Squads",
    description:
      "Collaborate in small sprint squads of 3–5 builders. Tackle open challenges, conduct research, and ship together.",
    badge: "Sprint Teams",
  },
] as const;

export const BRAND_POSITIONING = {
  line1: "A student-led space and physics engineering ecosystem.",
  line2:
    "Bridging academic theory with real engineering practice through open-source software, physical prototypes, and peer research cohorts.",
  line3:
    "Students build numerical physics simulations, launch telemetry kits, and publish technical research alongside mentors.",
} as const;

export const NAV_LINKS = [
  { label: "Projects", to: "/projects" },
  { label: "Programs", to: "/programs" },
  { label: "Showcase", to: "/showcase" },
  { label: "Research", to: "/research" },
] as const;

export const BRAND_VALUES = [
  "Curiosity",
  "Innovation",
  "Practical Learning",
  "Accessibility",
  "Collaboration",
  "Excellence",
  "Integrity",
  "Growth Mindset",
  "Student Empowerment",
] as const;

export const VALUES = [
  {
    name: "Curiosity",
    note: "We encourage questioning, deep exploration, and continuous inquiry beyond textbook bounds.",
  },
  {
    name: "Innovation",
    note: "We embrace bold creativity and seek better, computational ways to solve engineering problems.",
  },
  {
    name: "Practical Learning",
    note: "Real learning happens when knowledge is immediately applied to build and test real systems.",
  },
  {
    name: "Accessibility",
    note: "Industry-relevant tools and research opportunities should be universally open to all students.",
  },
  {
    name: "Collaboration",
    note: "Breakthroughs happen when diverse, passionate student minds work together in agile sprint cohorts.",
  },
  {
    name: "Excellence",
    note: "We continuously refine, test, simulate, and verify everything we build to high engineering standards.",
  },
  {
    name: "Integrity",
    note: "We value honesty, rigorous scientific verification, academic ethics, and transparency.",
  },
  {
    name: "Growth Mindset",
    note: "We view obstacles as learning moments and encourage fearless experimentation.",
  },
  {
    name: "Student Empowerment",
    note: "We put students in the driver's seat to lead projects, departments, and public masterclasses.",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Choose a Project",
    desc: "Pick from curated engineering challenges across aerospace CFD, orbital mechanics, observational astronomy, and physics AI.",
  },
  {
    step: "02",
    title: "Learn What You Need",
    desc: "Access reduced-order equations, open tutorials, mentor sessions with aerospace practitioners, and starter repositories.",
  },
  {
    step: "03",
    title: "Build With a Squad",
    desc: "Collaborate in focused sprint teams of 3–5 builders with weekly check-ins, architectural reviews, and pair programming.",
  },
  {
    step: "04",
    title: "Ship Your Work",
    desc: "Deploy live interactive web applications, publish peer-reviewed technical reports, and build a verified portfolio of artifacts.",
  },
] as const;

export const VERIFIED_DELIVERABLES = [
  {
    title: "Working Simulation & Software",
    desc: "A deployed web application or interactive physics workbench running real mathematical solvers.",
  },
  {
    title: "Public GitHub Repository",
    desc: "Clean commits, reproducible code, comprehensive README documentation, and open-source licensing.",
  },
  {
    title: "Technical Report & Whitepaper",
    desc: "Written analysis detailing governing equations, assumptions, boundary conditions, and benchmark validation.",
  },
  {
    title: "Portfolio Showcase Page",
    desc: "A permanent public artifact page on Project Polaris showcasing your role and contributions.",
  },
  {
    title: "Mentor Review & Feedback",
    desc: "Constructive evaluation and endorsements from practicing aerospace engineers and domain researchers.",
  },
  {
    title: "Team Contribution Record",
    desc: "Demonstrated sprint execution, collaboration history, and engineering leadership credentials.",
  },
] as const;

export const BUILD_SQUADS = [
  {
    id: "aero-cfd-engine",
    name: "Aero CFD Engine",
    category: "AEROSPACE",
    level: "Intermediate",
    members: "4 / 5 builders",
    stack: "TypeScript · WebGL · Navier-Stokes",
    currentMilestone: "Compressible shock wave & transonic drag rise modeling",
    progress: 78,
    projectSlug: "aeroforge-ai",
  },
  {
    id: "orbital-state-propagator",
    name: "Orbital State Propagator",
    category: "ASTRODYNAMICS",
    level: "Advanced",
    members: "2 / 4 builders",
    stack: "Python · Astrodynamics · RK4",
    currentMilestone: "N-Body gravitational perturbation & J2 zonal harmonics",
    progress: 55,
    projectSlug: "aeroforge-ai",
  },
  {
    id: "deep-sky-fits-telemetry",
    name: "Sky Atlas FITS Telemetry",
    category: "ASTRONOMY",
    level: "Beginner",
    members: "3 / 5 builders",
    stack: "FITS · React · Astronomy Data",
    currentMilestone: "Messier 42 photometer spectral calibration pipeline",
    progress: 85,
    projectSlug: "sky-atlas",
  },
  {
    id: "sounding-rocket-avionics",
    name: "Sounding Rocket Telemetry",
    category: "HARDWARE & DATA",
    level: "Intermediate",
    members: "3 / 4 builders",
    stack: "C++ · ESP32 · Kalman Filter",
    currentMilestone: "Barometric altitude sensor fusion & apogee detection",
    progress: 62,
    projectSlug: "schools-outreach-kit",
  },
] as const;

export const STATS = [
  { value: "40+", label: "Physics solvers", note: "CFD, FEA, orbital & propulsion suites." },
  { value: "10+", label: "Active project squads", note: "Student teams building open systems." },
  {
    value: "120+",
    label: "Community builders",
    note: "Curious students & mentors learning together.",
  },
  { value: "90+", label: "Aaj Ka Gyan posts", note: "Daily curated scientific inquiry drops." },
  { value: "100%", label: "Open source & free", note: "No barrier to start experimenting." },
] as const;

export const TEAM_MEMBERS = [
  {
    name: "Avishi Khare",
    role: "Founder",
    note: "Leading the core vision, community ecosystem, and student-led initiatives across Project Polaris.",
  },
  {
    name: "Manya Sharma",
    role: "Founding Member",
    note: "Co-founding partner driving foundational community outreach, youth engagement, and curriculum design.",
  },
  {
    name: "Anshika Singh",
    role: "Content Head",
    note: "Directing educational content curation, daily Aaj Ka Gyan series, and community scientific publications.",
  },
  {
    name: "Gnana Aditya Suvvari",
    role: "Research Head",
    note: "Spearheading student research programs, simulation frameworks, and technical development pipelines.",
  },
  {
    name: "Kanishk Sandhu",
    role: "Operations Head",
    note: "Overseeing logistics, workshop execution, volunteer coordination, and cohort operations.",
  },
  {
    name: "Aryan",
    role: "Research Volunteer",
    note: "Supporting physics simulation verification, literature surveys, and student research digests.",
  },
] as const;

export const PROJECTS = [
  {
    slug: "aeroforge-ai",
    name: "AeroForge AI Simulation Workstation",
    category: "AEROSPACE & CFD",
    level: "Intermediate / Advanced",
    duration: "4–6 weeks",
    stack: "Python · TypeScript · WebGL · Physics",
    team: "Core Engineering Squad",
    members: "4 / 5 members",
    progress: 88,
    stage: "Active beta",
    blurb:
      "Browser-based engineering research workstation with 40+ physics solvers across CFD aerodynamics, structural FEA, and orbital mechanics.",
    roadmap: ["01 Understand", "02 Model", "03 Implement", "04 Validate", "05 Ship"],
    deliverables: [
      "Working Simulation",
      "GitHub Repository",
      "Technical Report",
      "Showcase Page",
      "Mentor Review",
    ],
    cta: "Launch AeroForge Lab",
    link: "/projects",
    featured: true,
    github: "https://github.com/blaze505050/project-polaris",
    demo: "/aeroforge/index.html",
  },
  {
    slug: "sky-atlas",
    name: "Sky Atlas Deep-Sky Network",
    category: "ASTRONOMY",
    level: "Beginner / Intermediate",
    duration: "3–4 weeks",
    stack: "FITS · Astronomy Data · React",
    team: "Astrophysics Squad",
    members: "3 / 5 members",
    progress: 75,
    stage: "In progress",
    blurb:
      "An open, student-maintained deep-sky catalog and constellation mapping database with observations recorded across community stargazing nights.",
    roadmap: ["01 Catalog", "02 Ingest", "03 Calibrate", "04 Map", "05 Publish"],
    deliverables: ["Celestial Database", "FITS Viewer", "Observation Log", "Star Guide"],
    link: "/projects",
    github: "https://github.com/blaze505050/project-polaris",
  },
  {
    slug: "research-digest",
    name: "Polaris Science & Research Digest",
    category: "TECHNICAL RESEARCH",
    level: "All Skill Levels",
    duration: "Recurring Bi-Weekly",
    stack: "LaTeX · Peer Review · Literature Survey",
    team: "Research & Content Department",
    members: "5 / 6 members",
    progress: 90,
    stage: "Active Publication",
    blurb:
      "A recurring student-written and peer-reviewed technical digest that summarizes and verifies recent space science and propulsion research papers.",
    roadmap: ["01 Survey", "02 Hypothesize", "03 Verify", "04 Peer Review", "05 Release"],
    deliverables: ["PDF Digest", "Technical Summary", "Citation Index", "Community AMA"],
    link: "/research",
  },
  {
    slug: "schools-outreach-kit",
    name: "Schools Experiential Science Kit",
    category: "K-12 OUTREACH",
    level: "Beginner",
    duration: "2 weeks",
    stack: "Optics · Rocket Telemetry · Lab Curriculum",
    team: "Outreach Team",
    members: "3 / 4 members",
    progress: 65,
    stage: "In progress",
    blurb:
      "A ready-to-run interactive laboratory curriculum, stomp rocket telemetry kit, and telescope workshop modules for middle and high schools.",
    roadmap: ["01 Scope", "02 Build Kit", "03 Test in Schools", "04 Refine", "05 Deploy"],
    deliverables: [
      "Curriculum Modules",
      "Hardware Specs",
      "Facilitator Guide",
      "Student Worksheets",
    ],
    link: "/schools",
  },
] as const;

export const PROGRAMS = [
  {
    slug: "workshops",
    name: "Masterclasses & Expert Cohorts",
    blurb:
      "Interactive sessions and live masterclasses conducted by ISRO scientists, missile researchers, educators, and domain experts.",
    purpose:
      "To put students in the same room as people who actually do the work, and let them ask real questions.",
    who: "Open to the whole community — school, college & self-taught learners.",
    gain: [
      "Direct exposure to practitioners and ISRO scientists",
      "Practical context far beyond textbook theory",
      "Real-world aerospace & engineering pathways",
    ],
    experience:
      "Live masterclasses, interactive Q&As, student pitch challenges, and community discussions.",
  },
  {
    slug: "innovation-projects",
    name: "Build Squad Sprints",
    blurb:
      "Collaborative student-led sprint squads that build open-source simulations, research digests, and physical prototypes.",
    purpose:
      "To let students experience the full arc of building something real: scope, model, implement, test, and ship.",
    who: "School students, college builders, and passionate makers willing to collaborate in teams.",
    gain: [
      "A finished portfolio project you can demonstrate",
      "Hands-on engineering and teamwork under real constraints",
      "Technical mentor feedback and code reviews",
    ],
    experience:
      "Small focused teams working on initiatives like AeroForge AI research lab, Sky Atlas astronomical catalogs, and student research digests.",
  },
  {
    slug: "community-learning",
    name: "Daily Science Drops (Aaj Ka Gyan)",
    blurb:
      "Daily educational content, Saturday problem polls, quizzes, and collaborative technical discussions.",
    purpose:
      "To make scientific curiosity and learning a daily habit rather than an occasional event.",
    who: "Everyone in the Polaris student community.",
    gain: [
      "A consistent daily learning rhythm",
      "Mon–Fri curated scientific facts based on weekly themes",
      "Low-pressure entry into active exploration",
    ],
    experience:
      "Aaj Ka Gyan daily facts every morning, Saturday Polls every weekend, plus star-hunting quizzes and open problem-solving threads.",
  },
] as const;

export const WORKSHOPS = [
  {
    id: "rocket-fundamentals",
    title: "Fundamentals of Rockets & Space Technology",
    date: "2 July 2026",
    mentor: "Prakhar Vishwakarma",
    mentorTitle: "Missile Man of MP · Aerospace & Defence Projects",
    mentorOrg: "Aerospace & Propulsion Lead",
    linkedin: "https://www.linkedin.com/in/prakhar-vishwakarma/",
    summary:
      "Our first session introduced students to the fundamentals of rockets and space technology. Participants explored how rockets work, along with insights from the mentor's own journey and projects. The session also included an interactive Q&A and a Pitch and Win Challenge, where students shared what they had learned to make space science approachable beyond the classroom.",
    highlights: [
      "Rocket propulsion principles, specific impulse & thrust curves",
      "Mentor's aerospace journey, defence projects & propulsion research",
      "Interactive Q&A and Pitch & Win student challenge",
      "Practical pathways for young builders to explore aerospace beyond textbooks",
    ],
    tag: "ROCKETRY & PROPULSION",
  },
  {
    id: "isro-journey",
    title: "From Dreaming About Space to Building India's Space Missions: A Journey to ISRO",
    date: "12 July 2026",
    mentor: "Ankit Gupta",
    mentorTitle: "Scientist / Engineer 'SC'",
    mentorOrg: "Master Control Facility, ISRO",
    linkedin: "https://www.linkedin.com/in/ankit-gupta-isro/",
    summary:
      "In this session, Ankit Gupta took students through his journey from an early interest in aircraft and space to studying Aerospace Engineering and working at ISRO's Master Control Facility. Students explored ISRO's role across communication, weather forecasting, navigation, Earth observation, space science, and future missions, plus what happens after a satellite is launched: satellite tracking, orbit determination and prediction, collision avoidance, station keeping, and space situational awareness.",
    highlights: [
      "Journey from aspiring aerospace student to ISRO Satellite Operations Scientist",
      "Post-launch operations: satellite tracking, orbit prediction & station keeping",
      "Space Situational Awareness (SSA) & orbital collision avoidance maneuvers",
      "Multidisciplinary careers across aerospace, AI, computer science, physics & math",
    ],
    tag: "ISRO & SATELLITE OPERATIONS",
  },
  {
    id: "mystery-celestial-objects",
    title: "Mystery Celestial Objects: Unraveling Stellar Evolution & Cosmic Phenomena",
    date: "9 August 2026",
    mentor: "Vranda Gupta",
    mentorTitle: "Astronomy Educator & Founder",
    mentorOrg: "Stellar Freaks",
    linkedin: "https://www.linkedin.com/in/vranda-gupta-b34b742a7/",
    summary:
      "This interactive astronomy session explored galaxies, nebulae, stellar evolution, and cosmic phenomena. Rather than following a conventional lecture format, the session incorporated quizzes, discussions, rapid-fire facts, and hands-on activities. Students explored the structure of the Milky Way, stellar nurseries, and dying star remnants, concluding with a Build-a-Galaxy Challenge where participants designed and presented their own custom galaxies.",
    highlights: [
      "Galactic morphological classification & Milky Way architecture",
      "Stellar life cycle: from hydrogen clouds to nebulae and stellar remnants",
      "Interactive constellation hunting & astronomy rapid-fire quizzes",
      "Build-a-Galaxy Challenge: hands-on galactic design & presentation",
    ],
    tag: "ASTRONOMY & ASTROPHYSICS",
  },
] as const;

export const JOURNEY = [
  {
    date: "7 June 2026",
    title: "Project Polaris begins",
    note: "Started with a WhatsApp community committed to learning by building real engineering systems.",
  },
  {
    date: "12 June 2026",
    title: "Aaj Ka Gyan daily facts",
    note: "A daily scientific curiosity initiative inside the community that runs every single morning.",
  },
  {
    date: "2 July 2026",
    title: "Workshop 1: Fundamentals of Rockets",
    note: "Prakhar Vishwakarma ('Missile Man of MP') led our inaugural session on rocket technology.",
  },
  {
    date: "12 July 2026",
    title: "Workshop 2: Journey to ISRO & Space Missions",
    note: "Ankit Gupta (Scientist/Engineer 'SC', ISRO MCF) led a masterclass on satellite tracking & orbit determination.",
  },
  {
    date: "9 August 2026",
    title: "Workshop 3: Stellar Evolution & Cosmic Objects",
    note: "Vranda Gupta (Stellar Freaks) led an interactive exploration of stellar physics and galaxy modeling.",
  },
  {
    date: "August 2026",
    title: "AeroForge AI Simulation Suite Launch",
    note: "Launch of AeroForge AI — browser-based CFD, orbital mechanics, and structural FEA workstation built by Polaris students.",
  },
] as const;

export const RECOGNITION_SYSTEM = [
  "Performance Score & Contribution Points",
  "Digital Badges & Verified Certificates",
  "Leadership Opportunities in Core Initiatives",
  "Official Recommendation Letters from Mentors",
  "Special Awards & Annual Recognitions",
  "Exclusive Mentorship & Learning Opportunities",
] as const;

export const RECOGNITION = RECOGNITION_SYSTEM;

export const WORKING_CULTURE = [
  {
    rule: "Be respectful",
    detail: "Value every peer's perspective and support an inclusive environment.",
  },
  {
    rule: "Take ownership",
    detail: "Own assigned initiatives from start to finish with proactive initiative.",
  },
  {
    rule: "Communicate professionally",
    detail: "Maintain transparent, clear, and prompt communication.",
  },
  {
    rule: "Meet deadlines",
    detail: "Respect team timelines and deliverables with high consistency.",
  },
  {
    rule: "Be open to feedback",
    detail: "Embrace constructive reviews as opportunities for rapid growth.",
  },
  {
    rule: "Support fellow members",
    detail: "Collaborate, share knowledge, and lift others up as you grow.",
  },
  {
    rule: "Continuously learn",
    detail: "Stay curious, experiment fearlessly, and improve every day.",
  },
] as const;
