export const SITE = {
  name: "Project Polaris",
  tagline: "Learning through Building, rather than Building after learning.",
  description:
    "Project Polaris is a student-led experiential learning organisation. Students research, build, experiment and collaborate on real problems — starting with space science.",
  communityUrl: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
  volunteerUrl: "https://polaris-volunteer-program-8.my.canva.site",
  associateFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeg249_cm0l37Yg2jCv3ZxgZ6VtZ3XwLMwQgFz9dpOxMMXhPg/viewform",
  emails: ["project.polaris8@gmail.com", "contactprojectpolaris@gmail.com"],
  instagramUrl: "https://www.instagram.com/project_polaris_?igsh=cGR3aGdkdjd2Y2hm",
  linkedinCompanyUrl: "https://www.linkedin.com/company/nova-next-gen-of-vision-and-astronomy/",
} as const;

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "AeroForge Lab", to: "/aeroforge" },
  { label: "Programs", to: "/programs" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Contact", to: "/contact" },
] as const;

export const PROGRAMS = [
  {
    slug: "workshops",
    name: "Workshops",
    blurb:
      "Interactive sessions conducted by industry experts, educators, professionals, researchers and experienced mentors.",
    purpose:
      "To put students in the same room as people who actually do the work, and let them ask real questions.",
    who: "Open to the whole community — middle school upwards.",
    gain: [
      "Direct exposure to practitioners",
      "Practical context beyond textbooks",
      "A reason to keep going",
    ],
    experience:
      "Live sessions with an expert, space for questions, and follow-up discussion inside the community.",
  },
  {
    slug: "community-learning",
    name: "Community Learning",
    blurb: "Daily educational content, discussions, quizzes and learning challenges.",
    purpose: "To make learning a daily habit rather than an event.",
    who: "Everyone in the Polaris community.",
    gain: [
      "A daily learning rhythm",
      "Peers who are genuinely curious",
      "Low-pressure entry into the ecosystem",
    ],
    experience:
      "Aaj Ka Gyan every day, Saturday Polls every week, plus quizzes, challenges and open discussion.",
  },
  {
    slug: "innovation-projects",
    name: "Innovation Projects",
    blurb:
      "Collaborative projects that solve real-world problems while helping students build practical skills.",
    purpose:
      "To let students experience the full arc of building something: scope, attempt, fail, improve, ship.",
    who: "School students, college students and self-taught learners willing to work in a team.",
    gain: [
      "A finished project you can point to",
      "Teamwork under real constraints",
      "Mentor feedback",
    ],
    experience:
      "A small team, a real problem, a build phase, and a showcase to the community at the end.",
  },
  {
    slug: "mentorship",
    name: "Mentorship",
    blurb:
      "Connecting learners with mentors who can guide them academically, professionally and personally.",
    purpose:
      "To close the access gap — most students never get to speak to someone doing the work they admire.",
    who: "Students seeking guidance, and professionals willing to give a little time.",
    gain: [
      "Perspective from someone further along",
      "Honest feedback",
      "Direction, not just information",
    ],
    experience:
      "A conversation, then ongoing guidance where both sides want it. Mentors can also run a single session.",
  },
  {
    slug: "events",
    name: "Events",
    blurb:
      "Competitions, webinars, speaker sessions, hackathons, bootcamps and community activities.",
    purpose: "To create moments where the community shows up together and something happens.",
    who: "Open to all members; some formats are team-based.",
    gain: ["Momentum", "Collaborators", "Something to build towards"],
    experience: "Announced in the community ahead of time, run live, and documented afterwards.",
  },
  {
    slug: "research",
    name: "Research Initiative (Upcoming)",
    blurb:
      "Upcoming student-led research initiatives, literature reviews, scientific exploration and interdisciplinary collaboration.",
    purpose:
      "To give students a real experience of how knowledge is produced — questions, evidence, verification and documentation.",
    who: "High-school and college students interested in scientific writing.",
    gain: [
      "Structured research methodology",
      "Evidence-based thinking",
      "Guidance from mentors",
    ],
    experience:
      "Currently in development — launching soon to connect curious minds with research projects.",
  },
] as const;

export const VALUES = [
  { name: "Learn by Building", note: "Real learning happens when knowledge is applied." },
  { name: "Curiosity", note: "We encourage questioning, exploration and continuous learning." },
  { name: "Innovation", note: "We embrace creativity and seek better ways to solve problems." },
  { name: "Integrity", note: "We value honesty, transparency and accountability." },
  { name: "Collaboration", note: "Great ideas emerge when diverse minds work together." },
  { name: "Accessibility", note: "Learning opportunities should be available to everyone." },
  { name: "Excellence", note: "We continuously improve everything we build." },
  { name: "Leadership", note: "We encourage volunteers, participants and members to lead." },
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

export const STATS = [
  { value: "4", label: "Workshops conducted", note: "Expert-led sessions run end to end." },
  { value: "1000+", label: "Students engaged", note: "Across sessions, community and content." },
  { value: "28+", label: "Team members so far", note: "Core, associates and volunteers." },
  { value: "100%", label: "Student-led", note: "Built and run by students, for students." },
] as const;

export const COURSE_LAUNCH_DATE = "August 20th";

export const TEAM_MEMBERS = [
  {
    name: "Founder & Core Leads",
    role: "Core Engineering & Operations",
    note: "Driving strategic vision, physics engineering pipelines, and student community growth.",
  },
  {
    name: "Associates Team",
    role: "11 Associate Members",
    note: "Leading design, operations, scientific outreach, and technical initiatives.",
  },
  {
    name: "Volunteers Network",
    role: "8 Active Volunteers",
    note: "Supporting day-to-day community activities, event hosting, and educational content.",
  },
  {
    name: "Guest Mentors & Speakers",
    role: "Domain Experts",
    note: "Researchers from ISRO, aerospace propulsion labs, and academic institutions.",
  },
] as const;

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
] as const;
