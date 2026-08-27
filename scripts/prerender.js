import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITE_URL = "https://projectpolaris.in";

// The 9 core pages + legal routes
const ROUTES = [
  {
    path: "/",
    title: "Project Polaris — Learn by Building",
    description:
      "A student-led experiential engineering ecosystem built by students, for students. Learn by building, rather than building after learning.",
    heading: "PROJECT POLARIS",
    subheading: "Learn by building, rather than building after learning.",
    canonical: `${SITE_URL}/`,
  },
  {
    path: "/about",
    title: "About Us — Mission, Vision & Team | Project Polaris",
    description:
      "Project Polaris is a student-led organisation providing an experiential learning ecosystem bridging traditional education and real-world space & engineering.",
    heading: "About Project Polaris",
    subheading: "Built by students for students.",
    canonical: `${SITE_URL}/about`,
  },
  {
    path: "/programs",
    title: "Programs & Masterclasses — Project Polaris",
    description:
      "Active live astronomy workshops, ISRO scientist masterclasses, student volunteer cohorts, and past session archives.",
    heading: "Programs & Opportunities",
    subheading: "Learn directly from scientists and engineers doing the work.",
    canonical: `${SITE_URL}/programs`,
  },
  {
    path: "/projects",
    title: "Projects & AeroForge Lab — Project Polaris",
    description:
      "Explore AeroForge AI and open-source aerospace computational engineering labs with 40+ numerical physics solvers.",
    heading: "Projects & Computational Labs",
    subheading: "AeroForge simulation laboratory and computational platforms.",
    canonical: `${SITE_URL}/projects`,
  },
  {
    path: "/chapters",
    title: "Polaris Chapters — Regional Hubs",
    description:
      "Launching Polaris Chapters soon to reach more students from Tier 2, 3 cities and remote areas.",
    heading: "POLARIS CHAPTERS",
    subheading: "COMING SOON — Regional and institutional chapters.",
    canonical: `${SITE_URL}/chapters`,
  },
  {
    path: "/articles",
    title: "Newsletter & Articles — Project Polaris",
    description:
      "Explore. Learn. Share. A space for ideas, insights, and stories from the Polaris community.",
    heading: "Explore. Learn. Share.",
    subheading: "A space for ideas, insights, and stories from the Polaris community.",
    canonical: `${SITE_URL}/articles`,
  },
  {
    path: "/spotlight",
    title: "Polaris Spotlight — Exceptional Builders & Projects",
    description:
      "Recognising the people and ideas moving Polaris forward. Editorial features of exceptional student projects, research, and community contributions.",
    heading: "POLARIS SPOTLIGHT",
    subheading: "Recognising the people and ideas moving Polaris forward.",
    canonical: `${SITE_URL}/spotlight`,
  },
  {
    path: "/get-involved",
    title: "Get Involved & Partnerships — Project Polaris",
    description:
      "Partner with Polaris as a school, institution, or mentor. Join our core team, apply to the volunteer program, or get in touch.",
    heading: "Get Involved with Polaris",
    subheading: "Partner with us, join our team, and explore volunteer tracks.",
    canonical: `${SITE_URL}/get-involved`,
  },
  {
    path: "/dashboard",
    title: "Student Dashboard & Admin Portal — Project Polaris",
    description:
      "Student workspace and dynamic Admin CMS management for Project Polaris programs, articles, and spotlight features.",
    heading: "Polaris Portal",
    subheading: "Student workspace access and dynamic Admin CMS management.",
    canonical: `${SITE_URL}/dashboard`,
  },
  {
    path: "/privacy",
    title: "Privacy Policy — Project Polaris",
    description: "Privacy policy and data protection commitments of Project Polaris.",
    heading: "Privacy Policy",
    subheading: "How Project Polaris handles and protects student data.",
    canonical: `${SITE_URL}/privacy`,
  },
  {
    path: "/terms",
    title: "Terms of Service — Project Polaris",
    description: "Terms and conditions for utilizing Project Polaris open learning platforms.",
    heading: "Terms of Service",
    subheading: "Guidelines for open, collaborative, and verified learning.",
    canonical: `${SITE_URL}/terms`,
  },
  {
    path: "/404",
    title: "404 — Coordinates Not Found | Project Polaris",
    description: "The orbital trajectory or page you are looking for does not exist.",
    heading: "Coordinates Not Found",
    subheading: "Lost in deep space? Return to the main Polaris platform.",
    canonical: `${SITE_URL}/404`,
  },
];

async function prerender() {
  console.log("==================================================");
  console.log("[PRERENDER] Starting Static Route Generation (SSG)");
  console.log("==================================================");

  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error(`[PRERENDER ERROR] Base index.html not found in ${DIST_DIR}. Run 'vite build' first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, "utf-8");

  for (const route of ROUTES) {
    const routeHtml = generateRouteHtml(baseHtml, route);

    let targetDir = DIST_DIR;
    let targetFile = path.join(DIST_DIR, "index.html");

    if (route.path !== "/") {
      const cleanPath = route.path.replace(/^\//, "");
      targetDir = path.join(DIST_DIR, cleanPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      targetFile = path.join(targetDir, "index.html");
    }

    fs.writeFileSync(targetFile, routeHtml, "utf-8");
    console.log(`✓ Generated Static Route: ${route.path.padEnd(20)} -> ${targetFile.replace(DIST_DIR, "dist")}`);
  }

  console.log("==================================================");
  console.log(`[PRERENDER] Successfully generated ${ROUTES.length} static HTML routes.`);
  console.log("==================================================");
}

function generateRouteHtml(html, route) {
  let output = html;

  // Replace Title
  output = output.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace Meta Description
  if (output.includes('name="description"')) {
    output = output.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(route.description)}" />`
    );
  } else {
    output = output.replace(
      "</head>",
      `  <meta name="description" content="${escapeHtml(route.description)}" />\n  </head>`
    );
  }

  // Canonical Tag
  if (output.includes('rel="canonical"')) {
    output = output.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );
  } else {
    output = output.replace("</head>", `  <link rel="canonical" href="${route.canonical}" />\n  </head>`);
  }

  // OpenGraph & Twitter Cards
  const ogTags = `
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${route.canonical}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
  `;

  output = output.replace("</head>", `${ogTags}\n  </head>`);

  // Inject semantic HTML snapshot into <div id="root"></div> for zero-JS crawlers
  const semanticSnapshot = `
    <div id="root">
      <main id="main-content" style="padding-top: 5rem;">
        <header style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; text-align: center;">
          <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${escapeHtml(route.heading)}</h1>
          <p style="font-size: 1.25rem; color: #a5b4fc; max-width: 800px; margin: 0 auto;">${escapeHtml(route.subheading)}</p>
        </header>
        <section style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
          <p style="color: #9ca3af; text-align: center;">${escapeHtml(route.description)}</p>
        </section>
      </main>
    </div>
  `;

  output = output.replace('<div id="root"></div>', semanticSnapshot);
  return output;
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

prerender();
