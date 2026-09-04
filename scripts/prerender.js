import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITE_URL = process.env.VITE_SITE_URL || "https://project-polaris-green.vercel.app";

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
    robots: "noindex, nofollow",
  },
  {
    path: "/portal",
    title: "Polaris Engineering Workspace — Student Portal",
    description:
      "Active engineering workspace, technical roadmap, sprint deliverables, and AI engineering mentor.",
    heading: "Engineering Workspace",
    subheading: "Student workspace and project tracking portal.",
    canonical: `${SITE_URL}/portal`,
    robots: "noindex, nofollow",
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
    robots: "noindex, follow",
  },
  {
    path: "/cookies",
    title: "Cookie Policy & Preferences — Project Polaris",
    description: "Manage your cookie settings and learn how Project Polaris uses local storage.",
    heading: "Cookie Preferences",
    subheading: "Transparency and control over your browser storage preferences.",
    canonical: `${SITE_URL}/cookies`,
  },
  {
    path: "/refund-policy",
    title: "Refund & Cancellation Policy — Project Polaris",
    description:
      "Transparent refund guidelines and cancellation timelines for Project Polaris cohorts.",
    heading: "Refund & Cancellation Policy",
    subheading: "Fair and student-first terms for workshops, sprints, and certifications.",
    canonical: `${SITE_URL}/refund-policy`,
  },
  {
    path: "/payment-failed",
    title: "Payment Incomplete — Project Polaris",
    description: "Transaction recovery and troubleshooting steps for workshop registrations.",
    heading: "Payment Incomplete",
    subheading: "Troubleshoot transaction issues or retry your registration.",
    canonical: `${SITE_URL}/payment-failed`,
    robots: "noindex, nofollow",
  },
  {
    path: "/reset-password",
    title: "Reset Workspace Password — Project Polaris",
    description: "Recover and reset your Project Polaris workspace or admin account password.",
    heading: "Reset Password",
    subheading: "Recover your student or administrator credentials securely.",
    canonical: `${SITE_URL}/reset-password`,
    robots: "noindex, nofollow",
  },
  {
    path: "/verify-email",
    title: "Verify Your Email — Project Polaris",
    description: "Confirm your email address to activate your Project Polaris workspace.",
    heading: "Email Verification",
    subheading: "Activate your profile and access AeroForge computational labs.",
    canonical: `${SITE_URL}/verify-email`,
    robots: "noindex, nofollow",
  },
  {
    path: "/access-denied",
    title: "403 — Access Denied | Project Polaris",
    description: "Access restricted to authorized administrators and mentor roles.",
    heading: "Access Restricted",
    subheading: "Security protocol: Elevated role clearance required.",
    canonical: `${SITE_URL}/access-denied`,
    robots: "noindex, nofollow",
  },
  {
    path: "/maintenance",
    title: "System Maintenance — Project Polaris",
    description: "Scheduled platform upgrade and numerical solver updates in progress.",
    heading: "System Maintenance",
    subheading: "Deploying infrastructure updates to the Polaris ecosystem.",
    canonical: `${SITE_URL}/maintenance`,
    robots: "noindex, nofollow",
  },
  {
    path: "/support",
    title: "Help & Support Hub — Project Polaris",
    description:
      "Frequently asked questions and direct helpdesk ticket submission for Project Polaris.",
    heading: "Help & Support Hub",
    subheading: "Got questions? Explore FAQs or submit a support ticket.",
    canonical: `${SITE_URL}/support`,
  },
  {
    path: "/courses",
    title: "Learning Catalog — Project Polaris",
    description:
      "Explore interactive workshops, practical mini-courses, cohort bootcamps, and real engineering projects in science, aerospace, and technology.",
    heading: "The Polaris Learning Catalog",
    subheading: "Learn science and engineering by doing it.",
    canonical: `${SITE_URL}/courses`,
  },
  {
    path: "/community",
    title: "Community — Project Polaris",
    description:
      "Daily science drops, interactive challenges, live sessions and discussions with students, mentors and professionals inside the Project Polaris community.",
    heading: "Project Polaris Community",
    subheading: "An active laboratory where curiosity is normal.",
    canonical: `${SITE_URL}/community`,
  },
  {
    path: "/research",
    title: "Technical Research & Science Digest — Project Polaris",
    description:
      "Student-led aerospace and physics research papers, peer-reviewed literature surveys, and bi-weekly scientific digests at Project Polaris.",
    heading: "Polaris Research",
    subheading: "Student-led technical inquiry & research digests.",
    canonical: `${SITE_URL}/research`,
  },
  {
    path: "/resources",
    title: "Open Resources & Technical Notes — Project Polaris",
    description:
      "Free, self-paced knowledge guides, mathematical primers, solver blueprints, and lecture notes curated by student researchers at Project Polaris.",
    heading: "Open Knowledge",
    subheading: "Free guides, solver blueprints & lecture notes.",
    canonical: `${SITE_URL}/resources`,
  },
  {
    path: "/schools",
    title: "School Outreach — Bring Polaris to Your School",
    description:
      "Partner with Project Polaris to run space science workshops, space camps, expert talks and student clubs at your school.",
    heading: "School Outreach",
    subheading: "Bring experiential aerospace into your school.",
    canonical: `${SITE_URL}/schools`,
  },
  {
    path: "/showcase",
    title: "Student Project Showcase — Project Polaris",
    description:
      "Explore real software, simulations, and research projects built by students at Project Polaris. Working code, live demos, and technical whitepapers.",
    heading: "Student Artifacts",
    subheading: "What Polaris students are actually building.",
    canonical: `${SITE_URL}/showcase`,
  },
  {
    path: "/impact",
    title: "Impact — Project Polaris",
    description:
      "An honest account of what Project Polaris has built so far, what we're measuring, and what comes next.",
    heading: "Verified Impact",
    subheading: "We'd rather be honest than impressive.",
    canonical: `${SITE_URL}/impact`,
  },
  {
    path: "/join",
    title: "Join — Project Polaris",
    description:
      "Apply to join Project Polaris. Open to students of any background, with options to join as student, volunteer, or associate.",
    heading: "Join Polaris",
    subheading: "Start where you are. Learn by building.",
    canonical: `${SITE_URL}/join`,
  },
  {
    path: "/contact",
    title: "Contact & Inquiries — Project Polaris",
    description:
      "Get in touch with the Project Polaris team about joining, school collaborations, masterclasses, mentorship, or technical partnerships.",
    heading: "Direct Line",
    subheading: "Get in touch with Project Polaris.",
    canonical: `${SITE_URL}/contact`,
  },
  {
    path: "/auth",
    title: "Student Portal Login & Authentication — Project Polaris",
    description:
      "Sign in or create your Project Polaris account to access your workspace, projects, and learning resources.",
    heading: "Polaris Authentication",
    subheading: "Access your student workspace and project tracking.",
    canonical: `${SITE_URL}/auth`,
  },
];

async function prerender() {
  console.log("==================================================");
  console.log("[PRERENDER] Starting Static Route Generation (SSG)");
  console.log("==================================================");

  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error(
      `[PRERENDER ERROR] Base index.html not found in ${DIST_DIR}. Run 'vite build' first.`,
    );
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
    console.log(
      `✓ Generated Static Route: ${route.path.padEnd(20)} -> ${targetFile.replace(DIST_DIR, "dist")}`,
    );
  }

  // Generate dynamic sitemap.xml with current build date
  const today = new Date().toISOString().split("T")[0];
  const publicRoutes = ROUTES.filter(
    (r) =>
      ![
        "/dashboard",
        "/portal",
        "/auth",
        "/access-denied",
        "/maintenance",
        "/404",
        "/verify-email",
        "/reset-password",
        "/payment-failed",
      ].includes(r.path),
  );

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes
  .map((r) => {
    const priority = r.path === "/" ? "1.00" : r.path === "/programs" ? "0.95" : "0.90";
    const freq =
      r.path === "/" || r.path === "/programs" || r.path === "/articles" ? "daily" : "weekly";
    return `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  const publicSitemap = path.resolve(__dirname, "../public/sitemap.xml");
  const distSitemap = path.join(DIST_DIR, "sitemap.xml");
  fs.writeFileSync(publicSitemap, sitemapXml, "utf-8");
  fs.writeFileSync(distSitemap, sitemapXml, "utf-8");
  console.log(
    `✓ Generated dynamic sitemap.xml (${publicRoutes.length} public URLs) with build date: ${today}`,
  );

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
      `<meta name="description" content="${escapeHtml(route.description)}" />`,
    );
  } else {
    output = output.replace(
      "</head>",
      `  <meta name="description" content="${escapeHtml(route.description)}" />\n  </head>`,
    );
  }

  // Robots Meta Tag
  if (route.robots) {
    if (output.includes('name="robots"')) {
      output = output.replace(
        /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
        `<meta name="robots" content="${escapeHtml(route.robots)}" />`,
      );
    } else {
      output = output.replace(
        "</head>",
        `  <meta name="robots" content="${escapeHtml(route.robots)}" />\n  </head>`,
      );
    }
  }

  // Canonical Tag
  if (output.includes('rel="canonical"')) {
    output = output.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}" />`,
    );
  } else {
    output = output.replace(
      "</head>",
      `  <link rel="canonical" href="${route.canonical}" />\n  </head>`,
    );
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
