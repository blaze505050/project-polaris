export const SITE = {
  name: "Project Polaris",
  tagline: "Learning through Building, rather than Building after learning.",
  description:
    "Project Polaris is a student-led experiential learning organisation. Students research, build, experiment and collaborate on real problems — starting with space science.",
  communityUrl: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  volunteerUrl: "https://polaris-volunteer-program-8.my.canva.site",
  associateFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  feedbackFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  phone: "+91 97970 42664",
  emails: ["project.polaris8@gmail.com", "contactprojectpolaris@gmail.com"],
  instagramUrl: "https://www.instagram.com/project_polaris_?igsh=cGR3aGdkdjd2Y2hm",
  linkedinCompanyUrl: "https://www.linkedin.com/company/nova-next-gen-of-vision-and-astronomy/",
} as const;

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Programs", to: "/programs" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const PROGRAMS = [
  {
    slug: "workshops",
    name: "Interactive Workshops & Webinars",
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
    slug: "community-learning",
    name: "Community Learning & Rituals",
    blurb: "Daily educational content (Aaj Ka Gyan), Saturday polls, quizzes, and collaborative discussions.",
    purpose: "To make scientific curiosity and learning a daily habit rather than an occasional event.",
    who: "Everyone in the Polaris student community.",
    gain: [
      "A consistent daily learning rhythm",
      "Mon–Fri curated scientific facts based on weekly themes",
      "Low-pressure entry into active exploration",
    ],
    experience:
      "Aaj Ka Gyan daily facts every morning, Saturday Polls every weekend, plus star-hunting quizzes and open problem-solving threads.",
  },
  {
    slug: "innovation-projects",
    name: "Innovation & Build Projects",
    blurb:
      "Collaborative student-led projects that solve real-world problems while helping learners build practical skills.",
    purpose:
      "To let students experience the full arc of building something real: scope, attempt, fail, improve, and ship.",
    who: "School students, college builders, and passionate makers willing to collaborate.",
    gain: [
      "A finished portfolio project you can demonstrate",
      "Hands-on engineering and teamwork under real constraints",
      "Technical mentor feedback and code reviews",
    ],
    experience:
      "Small focused teams working on initiatives like CanSat atmospheric payloads, AeroForge AI research lab, and Sky Atlas open logs.",
  },
  {
    slug: "mentorship",
    name: "Mentorship & Guidance",
    blurb:
      "Connecting learners with mentors who can guide them academically, technically, and professionally.",
    purpose:
      "To close the access gap — most students rarely get to interact directly with researchers and industry leaders.",
    who: "Students seeking guidance, and professionals passionate about giving back.",
    gain: [
      "Perspective from researchers and engineers further along the path",
      "Honest, personalized technical feedback",
      "Clear direction and roadmap planning",
    ],
    experience:
      "Direct 1-on-1 conversations, group roundtables, and project-based advisory.",
  },
  {
    slug: "events",
    name: "Events & Competitions",
    blurb:
      "Competitions, webinars, speaker sessions, astronomy challenges, bootcamps, and community activities.",
    purpose: "To create high-energy moments where the entire community converges to build, learn, and showcase.",
    who: "Open to all members; includes individual and team challenge formats.",
    gain: ["Momentum & urgency", "Cross-disciplinary collaborators", "Tangible achievements and awards"],
    experience: "Announced in the community ahead of time, executed live, and archived for ongoing study.",
  },
  {
    slug: "research",
    name: "Research & Fellowship Program (In Progress)",
    blurb:
      "Student-led research initiatives, literature reviews, scientific exploration, educational camps, and interdisciplinary collaboration.",
    purpose:
      "To give young students early authentic experience with research methodology: formulating hypotheses, gathering evidence, simulating, and publishing.",
    who: "High-school and college students interested in scientific research and technical writing.",
    gain: [
      "Structured research methodology & literature survey training",
      "Evidence-based scientific writing and peer review",
      "Guidance from senior researchers and academicians",
    ],
    experience:
      "Currently in active development — connecting curious young minds with research cohorts, educational trips, and fellowship opportunities.",
  },
] as const;

export const VALUES = [
  { name: "Learn by Building", note: "Real learning happens when knowledge is immediately applied to real problems." },
  { name: "Curiosity", note: "We encourage questioning, deep exploration, and continuous learning." },
  { name: "Innovation", note: "We embrace bold creativity and seek better ways to solve problems." },
  { name: "Integrity", note: "We value honesty, transparency, rigorous verification, and accountability." },
  { name: "Collaboration", note: "Great breakthroughs happen when diverse, passionate minds work together." },
  { name: "Accessibility", note: "Practical learning opportunities should be accessible to everyone regardless of background." },
  { name: "Excellence", note: "We continuously refine, test, and improve everything we build." },
  { name: "Leadership", note: "We empower students, volunteers, and participants to take initiative and lead." },
] as const;

export const WHY_JOIN_PILLARS = [
  {
    title: "Learn Beyond Textbooks",
    description: "Gain practical, high-impact knowledge through live masterclasses with ISRO scientists, interactive workshops, and hands-on experiments.",
    icon: "BookOpen",
  },
  {
    title: "Develop Future-Ready Skills",
    description: "Strengthen leadership, scientific communication, teamwork, research methodology, critical thinking, and structured problem-solving.",
    icon: "Sparkles",
  },
  {
    title: "Work on Meaningful Projects",
    description: "Collaborate with passionate peers on real projects like CanSat prototypes, AeroForge AI simulation lab, and open observational astronomy atlases.",
    icon: "Hammer",
  },
  {
    title: "Connect With Inspiring People",
    description: "Meet ambitious students, scientists, innovators, industry professionals, educators, and mentors who share your curiosity and ambition.",
    icon: "Users",
  },
  {
    title: "Build Your Portfolio",
    description: "Showcase verified contributions, published research notes, live code repositories, leadership roles, and recognized community achievements.",
    icon: "FolderKanban",
  },
] as const;

export const WHO_CAN_JOIN = [
  {
    category: "School Students",
    description: "Middle and high school students who want to explore space science, experiment with hardware, and discover their true potential.",
    badge: "Grade 6–12",
  },
  {
    category: "College Students",
    description: "Undergraduate and graduate builders looking to apply engineering, physics, coding, or research skills in collaborative teams.",
    badge: "Higher Ed",
  },
  {
    category: "Professionals & Mentors",
    description: "Engineers, scientists, and researchers eager to deliver masterclasses, guide student projects, or provide career mentorship.",
    badge: "Mentorship",
  },
  {
    category: "Educators & Teachers",
    description: "Teachers looking to integrate experiential learning workshops and interactive science challenges into their classrooms.",
    badge: "Education",
  },
  {
    category: "Schools, NGOs & Startups",
    description: "Educational institutions and organizations seeking to co-host workshops, sponsor access, and empower young innovators.",
    badge: "Partnerships",
  },
] as const;

export const STATS = [
  { value: "120+", label: "Community members", note: "Curious students & builders learning together." },
  { value: "90+", label: "Aaj Ka Gyan posts", note: "Daily curated scientific knowledge drops." },
  { value: "25+", label: "Volunteers & contributors", note: "Students leading content, ops & research." },
  { value: "10+", label: "Webinars & sessions", note: "Conducted & scheduled expert masterclasses." },
] as const;

export const TEAM_MEMBERS = [
  {
    name: "Avishi Khare",
    role: "Founder & Lead",
    note: "Leading the core vision, community ecosystem, and student-led initiatives at Project Polaris.",
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
    name: "Aryan",
    role: "Research Volunteer",
    note: "Contributing to scientific literature exploration, workshop operations, and student outreach activities.",
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
      "Practical pathways for young builders to explore aerospace beyond textbooks"
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
      "Multidisciplinary careers across aerospace, AI, computer science, physics & math"
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
      "Build-a-Galaxy Challenge: hands-on galactic design & presentation"
    ],
    tag: "ASTRONOMY & ASTROPHYSICS",
  },
] as const;

export const JOURNEY = [
  {
    date: "7 June 2026",
    title: "Project Polaris begins",
    note: "It started with a WhatsApp community — our founder and a few passionate friends committed to learning by building.",
  },
  {
    date: "12 June 2026",
    title: "Aaj Ka Gyan daily facts",
    note: "A daily scientific curiosity initiative inside the community that still runs every single morning.",
  },
  {
    date: "2 July 2026",
    title: "Workshop 1: Fundamentals of Rockets",
    note: "Prakhar Vishwakarma ('Missile Man of MP') led our inaugural session on rocket technology and student pitch challenges.",
  },
  {
    date: "12 July 2026",
    title: "Workshop 2: Journey to ISRO & Space Missions",
    note: "Ankit Gupta (Scientist/Engineer 'SC', ISRO MCF) led a masterclass on post-launch satellite tracking, orbit determination & SSA.",
  },
  {
    date: "26 July 2026",
    title: "Cosmic Conversations & Quizzes",
    note: "Interactive constellation hunting challenges, astronomy trivia, and storytelling across our student community.",
  },
  {
    date: "9 August 2026",
    title: "Workshop 3: Stellar Evolution & Cosmic Objects",
    note: "Vranda Gupta (Stellar Freaks) led an interactive exploration of nebulae, galaxies, and a collaborative Build-a-Galaxy challenge.",
  },
  {
    date: "August 2026",
    title: "AeroForge AI & Digital Thread Launch",
    note: "Launch of AeroForge AI — browser-based CFD, orbital mechanics, and structural FEA research lab built by Polaris students.",
  },
] as const;

export const PATHWAY = [
  { step: "Discover", note: "Find a question that actually interests you." },
  { step: "Learn", note: "Sessions, content and people who have done it before." },
  { step: "Build", note: "Turn the idea into something that exists." },
  { step: "Collaborate", note: "Work with people who are better than you at something." },
  { step: "Share", note: "Present, publish, teach it back." },
  { step: "Lead", note: "Run the next thing yourself." },
] as const;

export const RECOGNITION = [
  "Performance Score",
  "Contribution Points",
  "Digital Badges",
  "Certificates",
  "Leadership Opportunities",
  "Recommendation Letters",
  "Special Awards",
  "Exclusive Learning Opportunities",
] as const;

export const INVOLVEMENT_PATHS = [
  {
    id: "student",
    title: "I'm a Student",
    note: "Join projects, workshops and community activities.",
    cta: "Join as a Student",
    link: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  },
  {
    id: "associate",
    title: "I'm an Associate",
    note: "Apply to become an Associate and take on core leadership & project responsibilities.",
    cta: "Apply as Associate",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  },
  {
    id: "volunteer",
    title: "I'm a Volunteer",
    note: "Help with research, content, operations and community initiatives.",
    cta: "Apply to Volunteer Program",
    link: "https://polaris-volunteer-program-8.my.canva.site",
  },
  {
    id: "mentor",
    title: "I'm a Mentor",
    note: "Share knowledge, guide learners and conduct sessions.",
    cta: "Become a Mentor",
    link: "/contact",
  },
  {
    id: "educator",
    title: "I'm an Educator",
    note: "Collaborate with Polaris and bring opportunities to your students.",
    cta: "Collaborate With Us",
    link: "/contact",
  },
] as const;

export type InvolvementRole = (typeof INVOLVEMENT_PATHS)[number]["id"];

export const COURSE_LAUNCH_DATE = "August 20th";

export const TESTIMONIALS = [
  {
    quote: "The ISRO scientist session gave me insights into actual space missions that no textbook ever touched. Asking questions directly to practitioners changed my whole perspective.",
    name: "Engineering Student",
    role: "Polaris Community Member",
    event: "ISRO Scientist Session",
  },
  {
    quote: "Rocket fundamentals broke down complex propulsion concepts into actionable design principles. It sparked our team's interest in building a CanSat payload.",
    name: "Undergraduate Builder",
    role: "Innovation Team",
    event: "Rocketry Workshop",
  },
  {
    quote: "Interactive guidance and open discussion gave us clear direction on how to turn our theoretical physics ideas into working simulation models and real projects.",
    name: "High School Student",
    role: "Community Member",
    event: "Interactive Builder Session",
  },
] as const;

export const PROJECTS = [
  {
    slug: "aeroforge-ai",
    name: "AeroForge AI",
    stage: "Active beta",
    team: "Core Engineering Team",
    blurb:
      "Browser-based engineering research workstation. Features 40+ physics solvers across CFD aerodynamics, structural FEA, orbital propagation, optimization, and Physics AI neural operators.",
    cta: "Launch AeroForge Lab",
    link: "/aeroforge",
    featured: true,
  },
  {
    slug: "cansat-prototype",
    name: "CanSat Prototype",
    stage: "In progress",
    team: "Innovation team",
    blurb:
      "A soda-can sized satellite payload with atmospheric sensors, real-time telemetry transmitter, and passive recovery system, built end to end by students.",
  },
  {
    slug: "sky-atlas",
    name: "Sky Atlas",
    stage: "In progress",
    team: "Research + Tech",
    blurb:
      "An open, student-maintained astronomical observation log and constellation guide built from our community night-sky challenges.",
  },
  {
    slug: "schools-outreach-kit",
    name: "Schools Outreach Kit",
    stage: "Planned",
    team: "Community + Outreach",
    blurb:
      "A ready-to-run space science workshop kit enabling any school to host hands-on Polaris experimentation sessions with their students.",
  },
  {
    slug: "polaris-ai",
    name: "Polaris AI",
    stage: "Coming soon",
    team: "AI + Education Team",
    blurb:
      "An AI-powered educational companion that helps students explore space science concepts, generate interactive study aids, and receive guided problem-solving assistance across physics, astronomy, and engineering topics.",
  },
  {
    slug: "research-digest",
    name: "Polaris Research Digest",
    stage: "Planned",
    team: "Research + Content",
    blurb:
      "A curated, student-written monthly digest summarising the latest space science and engineering research in accessible language — bridging the gap between academia and young builders.",
  },
  {
    slug: "space-weather-dashboard",
    name: "Space Weather Dashboard",
    stage: "Planned",
    team: "Data + Visualisation",
    blurb:
      "A real-time dashboard tracking solar activity, geomagnetic storms, and auroral forecasts — built by students, for student observers and amateur astronomers.",
  },
] as const;
