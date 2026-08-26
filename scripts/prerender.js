import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITE_URL = "https://projectpolaris.in";

// Route configurations with rich metadata and semantic HTML pre-renders
const ROUTES = [
  {
    path: "/",
    title: "Project Polaris — Learn by Building",
    description:
      "A student-led experiential engineering ecosystem where students build numerical physics simulations, software platforms, and physical prototypes with mentors and peers.",
    heading: "Project Polaris",
    subheading: "Learn by building, rather than building after learning.",
    canonical: `${SITE_URL}/`,
  },
  {
    path: "/courses",
    title: "Learning Catalog & Workshops — Project Polaris",
    description:
      "Explore interactive workshops with ISRO scientists, practical mini-courses, cohort bootcamps, and real engineering projects in aerospace, astrophysics, and computation.",
    heading: "The Polaris Learning Catalog",
    subheading: "Workshops, short courses, bootcamps and projects designed around demonstrable skills and real systems.",
    canonical: `${SITE_URL}/courses`,
  },
  {
    path: "/about",
    title: "About Us — Mission, Leadership & Values | Project Polaris",
    description:
      "Discover why Project Polaris was founded, our student engineering ecosystem, leadership team, working culture, and merit-based recognition framework.",
    heading: "About Project Polaris",
    subheading: "A student-led experiential learning organisation bridging traditional education and real-world space & engineering practice.",
    canonical: `${SITE_URL}/about`,
  },
  {
    path: "/projects",
    title: "Projects & AeroForge Lab — Project Polaris",
    description:
      "Explore active student engineering sprints and AeroForge AI — our open-source computational physics lab with 40+ numerical solvers.",
    heading: "Engineering Projects & Computational Labs",
    subheading: "Small sprint teams, real physical constraints, reproducible code and models.",
    canonical: `${SITE_URL}/projects`,
  },
  {
    path: "/showcase",
    title: "Student Showcase & Engineering Artifacts — Project Polaris",
    description:
      "Verified engineering artifacts, research papers, aerodynamic simulations, and hardware prototypes built by students across the Polaris ecosystem.",
    heading: "Student Project Showcase",
    subheading: "Verified engineering artifacts, research papers, and open simulations built by students.",
    canonical: `${SITE_URL}/showcase`,
  },
  {
    path: "/research",
    title: "Scientific Research & Student Cohorts — Project Polaris",
    description:
      "Peer-reviewed student research in aerodynamics, celestial orbital mechanics, computational fluid dynamics, and astrophysics.",
    heading: "Student Research Programs",
    subheading: "Formulate hypotheses, simulate physical constraints, verify numerical models, and publish findings.",
    canonical: `${SITE_URL}/research`,
  },
  {
    path: "/resources",
    title: "Free Engineering & Physics Resources — Project Polaris",
    description:
      "Open-access study guides, CFD aerodynamic simulation datasets, equations sheets, and flight mechanics notebooks.",
    heading: "Open Learning Resources",
    subheading: "Everything we investigate, simulate, and verify is documented for students to learn from freely.",
    canonical: `${SITE_URL}/resources`,
  },
  {
    path: "/programs",
    title: "Experiential Learning Methodology & Pathways — Project Polaris",
    description:
      "The 4-stage Polaris experiential framework: Discover & Inquire, Learn on Demand, Build in Squads, and Verify & Deploy.",
    heading: "The Polaris Learning Pathways",
    subheading: "Move from discovering a concept to mastering equations, building simulation software, and defending technical research.",
    canonical: `${SITE_URL}/programs`,
  },
  {
    path: "/get-involved",
    title: "Get Involved & Join the Ecosystem — Project Polaris",
    description:
      "Join Project Polaris as a student builder, volunteer engineer, mentor, or school partner. 100% free and open knowledge.",
    heading: "Get Involved with Project Polaris",
    subheading: "Build real simulations, lead cohorts, mentor curious minds, or partner your institution.",
    canonical: `${SITE_URL}/get-involved`,
  },
  {
    path: "/schools",
    title: "Institutional Partnerships & School Outreach — Project Polaris",
    description:
      "Bring hands-on aerospace workshops, rocketry demonstrations, and astronomy observation nights to your school or college.",
    heading: "Schools & Institutional Outreach",
    subheading: "Inspiring the next generation of space innovators through hands-on workshops and telescope observation sessions.",
    canonical: `${SITE_URL}/schools`,
  },
  {
    path: "/community",
    title: "WhatsApp Engineering Community — Project Polaris",
    description:
      "Join hundreds of student builders, aerospace enthusiasts, and mentors discussing simulations, space missions, and project collabs.",
    heading: "The Polaris Student Community",
    subheading: "Connect directly with peers, ask questions, share project updates, and get notified about live masterclasses.",
    canonical: `${SITE_URL}/community`,
  },
  {
    path: "/contact",
    title: "Contact Us & Inquiries — Project Polaris",
    description:
      "Get in touch with the Project Polaris core team for partnerships, student inquiries, speaking invitations, and mentorship.",
    heading: "Contact the Polaris Team",
    subheading: "We read every message and will reply as soon as possible.",
    canonical: `${SITE_URL}/contact`,
  },
  {
    path: "/privacy",
    title: "Privacy Policy — Project Polaris",
    description: "Privacy policy and data protection commitments of Project Polaris.",
    heading: "Privacy Policy",
    subheading: "How Project Polaris handles and protects student and community data.",
    canonical: `${SITE_URL}/privacy`,
  },
  {
    path: "/terms",
    title: "Terms of Service — Project Polaris",
    description: "Terms of service and community guidelines for Project Polaris.",
    heading: "Terms of Service",
    subheading: "Rules, open knowledge guidelines, and code of conduct.",
    canonical: `${SITE_URL}/terms`,
  },
];

export function prerender() {
  console.log("==================================================");
  console.log("[PRERENDER ENGINE] Starting Static SSG Pre-rendering");
  console.log("==================================================");

  const indexHtmlPath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[PRERENDER ERROR] dist/index.html not found at: ${indexHtmlPath}`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  let renderedCount = 0;

  for (const route of ROUTES) {
    let pageHtml = templateHtml;

    // 1. Replace Title Tag
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

    // 2. Replace or Inject Description Meta Tag
    if (pageHtml.includes('name="description"')) {
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${route.description}" />`
      );
    } else {
      pageHtml = pageHtml.replace(
        "</head>",
        `  <meta name="description" content="${route.description}" />\n</head>`
      );
    }

    // 3. Inject OpenGraph & Twitter Meta Tags
    const ogTags = `
  <meta property="og:title" content="${route.title}" />
  <meta property="og:description" content="${route.description}" />
  <meta property="og:url" content="${route.canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Project Polaris" />
  <meta property="og:image" content="${SITE_URL}/polaris-logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${route.title}" />
  <meta name="twitter:description" content="${route.description}" />
  <meta name="twitter:image" content="${SITE_URL}/polaris-logo.png" />
  <link rel="canonical" href="${route.canonical}" />
`;

    pageHtml = pageHtml.replace("</head>", `${ogTags}</head>`);

    // 4. Inject Semantic Pre-rendered HTML inside <main> / <div id="root"> for Search Spiders
    const semanticFallback = `
      <noscript>
        <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: system-ui, sans-serif; color: #f8fafc; background: #0a0b0e;">
          <h1>${route.heading}</h1>
          <p>${route.subheading}</p>
          <p>${route.description}</p>
          <nav aria-label="Fallback Navigation" style="margin-top: 2rem;">
            <a href="/" style="color: #a5b4fc; margin-right: 1rem;">Home</a>
            <a href="/courses" style="color: #a5b4fc; margin-right: 1rem;">Courses</a>
            <a href="/projects" style="color: #a5b4fc; margin-right: 1rem;">Projects</a>
            <a href="/about" style="color: #a5b4fc; margin-right: 1rem;">About</a>
            <a href="/contact" style="color: #a5b4fc;">Contact</a>
          </nav>
        </div>
      </noscript>
    `;

    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${semanticFallback}</div>`);

    // 5. Determine destination path
    let targetPath;
    if (route.path === "/") {
      targetPath = path.join(DIST_DIR, "index.html");
    } else {
      const routeDir = path.join(DIST_DIR, route.path.replace(/^\//, ""));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      targetPath = path.join(routeDir, "index.html");
    }

    fs.writeFileSync(targetPath, pageHtml, "utf-8");
    console.log(`✓ Prerendered [${route.path}] -> ${path.relative(DIST_DIR, targetPath)}`);
    renderedCount++;
  }

  console.log("==================================================");
  console.log(`[PRERENDER COMPLETE] Successfully generated ${renderedCount} static HTML routes with full metadata!`);
  console.log("==================================================");
}

prerender();
