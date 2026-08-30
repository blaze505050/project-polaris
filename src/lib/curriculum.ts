export const PROGRAM = {
  name: "Polaris Innovation Program",
  arc: ["Discover", "Investigate", "Build", "Showcase"],
  lead: "A 14-day, mission-driven interdisciplinary program connecting space science, technology and innovation — plus one free public demo session.",
  challenge:
    "Humanity's ability to explore Earth, the atmosphere and space is expanding, but exploration remains constrained by limited resources, environmental risks, complex systems and the need for better decision-making. How can we use science, technology and innovation to make exploration smarter, safer and more sustainable?",
  loop: "Problem → Question → Concept → Activity → Evidence → Application → Build → Mentor Feedback → Improve → Showcase",
} as const;

export const PROGRAM_STATS = [
  { value: "14", label: "core program days" },
  { value: "1", label: "free public demo" },
  { value: "8", label: "integrated domains" },
  { value: "10", label: "project tracks" },
  { value: "3–4", label: "students per team" },
] as const;

export const PROGRAM_PHASES = [
  {
    no: "01",
    title: "Discover",
    body: "Meet the mission. Explore astronomy, physics, biology, engineering, coding and innovation as one connected toolkit.",
  },
  {
    no: "02",
    title: "Investigate",
    body: "Question → Concept → Activity → Evidence. Build evidence and reasoning across every domain.",
  },
  {
    no: "03",
    title: "Build",
    body: "Application → Build → Mentor Feedback → Improve. Turn evidence into a real, demonstrable project.",
  },
  {
    no: "04",
    title: "Showcase",
    body: "Present, defend and reflect. Portfolio-ready proof of what students can investigate and build.",
  },
] as const;

export const SESSION_TYPES = [
  {
    name: "Concept session",
    body: "A short mentor-led idea (~20–30 min) immediately paired with a hands-on activity or game — never a standalone lecture.",
  },
  {
    name: "Peer-to-peer session",
    body: "A breather. Students exchange or demo what they built in small groups, with no new content.",
  },
  {
    name: "Team discussion",
    body: "A breather. Team-only strategy, debate or planning time through a guided worksheet.",
  },
  {
    name: "Mentor session",
    body: "Team-by-team feedback with a domain mentor — no new content, only review and direction.",
  },
  {
    name: "Connected work session",
    body: "Cameras-on, self-paced build time. Optional office hours, but not a class.",
  },
] as const;

export const SCHEDULE = [
  {
    day: "Day 1",
    focus: "Orientation + Mission Reveal",
    type: "Concept",
    output: "Polaris Mission Brief V1",
  },
  {
    day: "Day 2",
    focus: "Astronomy — What do we know?",
    type: "Concept",
    output: "Astronomical Evidence Report",
  },
  {
    day: "Day 3",
    focus: "Astrophysics — Does the physics work?",
    type: "Concept",
    output: "Planet Physics Profile",
  },
  {
    day: "Day 4",
    focus: "Breather — Evidence exchange + team discussion",
    type: "Peer + Team",
    output: "Peer Feedback Log",
  },
  {
    day: "Day 5",
    focus: "Coding × Astronomy × Astrophysics",
    type: "Concept",
    output: "Data-Analysis Artifact",
  },
  {
    day: "Day 6",
    focus: "Astrobiology — Could life exist?",
    type: "Concept",
    output: "Habitability Assessment",
  },
  {
    day: "Day 7",
    focus: "Breather — Habitability debate & direction check-in",
    type: "Team",
    output: "Project Direction Note",
  },
  {
    day: "Day 8",
    focus: "Astronautics — How would we investigate?",
    type: "Concept",
    output: "Mission Architecture V1",
  },
  {
    day: "Day 9",
    focus: "Aeronautics + Engineering Systems",
    type: "Concept",
    output: "Mission System Map",
  },
  {
    day: "Day 10",
    focus: "Breather — Systems show & tell",
    type: "Team",
    output: "Peer Feedback Log",
  },
  {
    day: "Day 11",
    focus: "Entrepreneurship × Space Innovation",
    type: "Concept",
    output: "Polaris Innovation Canvas",
  },
  {
    day: "Day 12",
    focus: "Research & build sprint + final project discussion",
    type: "Work + Team",
    output: "Evidence Bank + Prototype V1",
  },
  {
    day: "Day 13",
    focus: "Mentor review, then iterate & defence prep",
    type: "Mentor",
    output: "Project V2 + Presentation Package",
  },
  {
    day: "Day 14",
    focus: "Polaris Mission Showcase",
    type: "Showcase",
    output: "Final Project + Portfolio",
  },
] as const;

export const DOMAINS = [
  {
    name: "Astronomy",
    body: "Observation & data inform spacecraft, rovers, UAVs and research tools.",
  },
  { name: "Astrophysics", body: "Gravity, orbits & energy support mission design and simulation." },
  {
    name: "Astrobiology",
    body: "Habitability & biosignatures inform rovers, habitats and sensors.",
  },
  { name: "Aeronautics", body: "Flight & aerodynamics support drones and aerial exploration." },
  {
    name: "Astronautics",
    body: "Mission architecture supports satellites, rovers and infrastructure.",
  },
  { name: "Coding & Data", body: "Analysis and simulation strengthen every project type." },
  {
    name: "Research & Evidence",
    body: "Makes every claim defensible and scientifically grounded.",
  },
  { name: "Entrepreneurship", body: "Turns a technical idea into a usable, impactful solution." },
] as const;

export const PROJECT_TRACKS = [
  { name: "Spacecraft / Satellite Concept", domains: "Astronautics · Astrophysics · Coding" },
  {
    name: "Planetary Rover / Exploration Vehicle",
    domains: "Astronautics · Astrobiology · Aeronautics",
  },
  { name: "UAV / Drone Sensing & Mapping System", domains: "Aeronautics · Coding" },
  { name: "Astronomical Observation & Data Tool", domains: "Astronomy · Coding" },
  {
    name: "Habitability / Biosignature Analysis Tool",
    domains: "Astrobiology · Astrophysics · Coding",
  },
  {
    name: "Space-Weather / Disaster Monitoring Concept",
    domains: "Astrophysics · Astronautics · Coding",
  },
  { name: "Mission-Control / Planning Simulation", domains: "Astronautics · Coding · Innovation" },
  { name: "AI / Data-Driven Exploration Concept", domains: "Coding · Research" },
  {
    name: "Space-to-Earth Innovation / Startup Concept",
    domains: "Entrepreneurship · any technical domain",
  },
  { name: "Research-Based Scientific Investigation", domains: "Research · 1–2 technical domains" },
] as const;

export const QUALITY_BAR = [
  "Problem — which exploration problem is being addressed",
  "Evidence — what is known, and what supports the need",
  "Science — which scientific principles explain the problem",
  "Technology — what system or approach could address it",
  "Computation — how data, code or simulation strengthens it",
  "Impact — who could use it, and what it could change",
  "Build — a working, demonstrable component, not a slide deck",
  "Limitations — what cannot yet be solved, honestly stated",
] as const;

export const ZERO_COST = [
  {
    title: "Household materials",
    items: [
      "Cardboard, paper & tape for rover / spacecraft mockups",
      "Paper or foam-board gliders for aeronautics tests",
      "Everyday objects as sensors, structures & props",
    ],
  },
  {
    title: "Free digital tools",
    items: [
      "Google Colab for Python, data & visualisation",
      "Public NASA / ESA / ISRO / Kaggle datasets",
      "Free astronomy apps for naked-eye observation",
    ],
  },
  {
    title: "Free human resources",
    items: [
      "Peer teaching instead of repeated lectures",
      "Public research papers & open-source repositories",
      "Self-recorded video/photo evidence, no equipment needed",
    ],
  },
] as const;

export const PROGRAM_PEOPLE = [
  {
    count: "1",
    role: "Lead Program Mentor",
    body: "Overall academic and project direction & quality.",
  },
  {
    count: "4",
    role: "Domain Mentors",
    body: "Astronomy/Astrophysics · Aerospace · Coding/Data · Astrobiology.",
  },
  {
    count: "1",
    role: "Innovation Mentor",
    body: "Problem–solution thinking and pitching; may be a guest specialist.",
  },
  {
    count: "2–4",
    role: "Project Associates",
    body: "Track attendance, milestones, doubts and progress.",
  },
] as const;

export const AWARDS = [
  "Best Scientific Investigation (individual)",
  "Best Data / Computational Work (individual)",
  "Best Project Design (team)",
  "Best Interdisciplinary Project (team)",
  "Best Interaction (individual)",
  "Best Presentation (team)",
  "Polaris Mission Award (team)",
  "Polaris Award (individual)",
] as const;
