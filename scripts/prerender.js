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
  {
    path: "/program",
    title: "Polaris Innovation Program — 14-Day Curriculum | Project Polaris",
    description:
      "The Polaris Innovation Program: a 14-day interdisciplinary space science, technology and innovation curriculum — discover, investigate, build and showcase a real project.",
    heading: "Polaris Innovation Program",
    subheading: "Learn while building — not building after learning.",
    canonical: `${SITE_URL}/program`,
  },
  {
    path: "/opportunities",
    title: "Open Opportunities & Build Squads — Project Polaris",
    description:
      "Browse open research projects, workshops, volunteer roles, and engineering sprint squads you can join at Project Polaris.",
    heading: "Opportunities",
    subheading: "Find something worth building. Open to all students.",
    canonical: `${SITE_URL}/opportunities`,
  },
  {
    path: "/aeroforge",
    title: "AeroForge AI Simulation Workstation — Project Polaris",
    description:
      "Interactive Aerospace & Mechanical Engineering research workstation with 40+ numerical physics solvers, CFD aerodynamics, and orbital mechanics in the browser.",
    heading: "AeroForge AI Simulation Workstation",
    subheading: "Open-source computational physics laboratory and engineering solvers.",
    canonical: `${SITE_URL}/aeroforge`,
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
      <header role="banner" style="position: sticky; top: 0; z-index: 50; background: rgba(5,5,5,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1.5rem;">
        <nav aria-label="Main" style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <a href="/" style="font-weight: 700; color: #fff; text-decoration: none; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>PROJECT POLARIS</span>
          </a>
          <div style="display: flex; align-items: center; gap: 1.25rem; font-size: 0.85rem;">
            <a href="/about" style="color: #94a3b8; text-decoration: none;">About</a>
            <a href="/programs" style="color: #94a3b8; text-decoration: none;">Programs</a>
            <a href="/projects" style="color: #94a3b8; text-decoration: none;">Projects</a>
            <a href="/aeroforge" style="color: #38bdf8; text-decoration: none; font-weight: 600;">AeroForge Lab</a>
            <a href="/chapters" style="color: #94a3b8; text-decoration: none;">Chapters</a>
            <a href="/articles" style="color: #94a3b8; text-decoration: none;">Articles</a>
            <a href="/showcase" style="color: #94a3b8; text-decoration: none;">Showcase</a>
            <a href="/research" style="color: #94a3b8; text-decoration: none;">Research</a>
            <a href="/community" style="color: #94a3b8; text-decoration: none;">Community</a>
            <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact</a>
          </div>
        </nav>
      </header>
      <main id="main-content" style="padding-top: 3rem; min-height: 70vh;">
        <header style="max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; text-align: center;">
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8; font-weight: 600; margin-bottom: 0.5rem;">Project Polaris Ecosystem</p>
          <h1 style="font-size: 2.75rem; font-weight: 800; margin-bottom: 1rem; color: #f8fafc; line-height: 1.15;">${escapeHtml(route.heading)}</h1>
          <p style="font-size: 1.25rem; color: #a5b4fc; max-width: 800px; margin: 0 auto; line-height: 1.6;">${escapeHtml(route.subheading)}</p>
        </header>
        <section style="max-width: 900px; margin: 0 auto; padding: 1.5rem; line-height: 1.7; color: #cbd5e1; font-size: 1rem;">
          <p style="text-align: center; margin-bottom: 2rem;">${escapeHtml(route.description)}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
            <article style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem; rounded: 12px; border-radius: 12px;">
              <h2 style="font-size: 1.1rem; color: #38bdf8; margin-bottom: 0.5rem; font-weight: 600;">Learn by Building</h2>
              <p style="font-size: 0.875rem; color: #94a3b8;">Hands-on experiential engineering. Practice real aerospace modeling, astrodynamics, and computational physics.</p>
            </article>
            <article style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem; rounded: 12px; border-radius: 12px;">
              <h2 style="font-size: 1.1rem; color: #38bdf8; margin-bottom: 0.5rem; font-weight: 600;">AeroForge AI Suite</h2>
              <p style="font-size: 0.875rem; color: #94a3b8;">40+ browser-based numerical physics engines, transonic CFD solvers, and orbital trajectory propagators.</p>
            </article>
            <article style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem; rounded: 12px; border-radius: 12px;">
              <h2 style="font-size: 1.1rem; color: #38bdf8; margin-bottom: 0.5rem; font-weight: 600;">Open Community</h2>
              <p style="font-size: 0.875rem; color: #94a3b8;">Mentorship from ISRO scientists, domain researchers, and peer sprint squads across India and beyond.</p>
            </article>
          </div>
        </section>
      </main>
      <footer role="contentinfo" style="border-top: 1px solid rgba(255,255,255,0.1); padding: 3rem 1.5rem; background: rgba(5,5,5,0.9); margin-top: 4rem; font-size: 0.85rem; color: #94a3b8;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2rem;">
          <div>
            <p style="font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Project Polaris</p>
            <p style="color: #64748b; max-width: 360px;">A student-led experiential engineering ecosystem built by students, for students.</p>
          </div>
          <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <div>
              <p style="font-weight: 600; color: #cbd5e1; margin-bottom: 0.5rem;">Explore</p>
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                <li><a href="/programs" style="color: #94a3b8; text-decoration: none;">Programs & Masterclasses</a></li>
                <li><a href="/projects" style="color: #94a3b8; text-decoration: none;">Projects & AeroForge</a></li>
                <li><a href="/showcase" style="color: #94a3b8; text-decoration: none;">Student Showcase</a></li>
                <li><a href="/research" style="color: #94a3b8; text-decoration: none;">Research Digests</a></li>
              </ul>
            </div>
            <div>
              <p style="font-weight: 600; color: #cbd5e1; margin-bottom: 0.5rem;">Governance</p>
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                <li><a href="/privacy" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a></li>
                <li><a href="/terms" style="color: #94a3b8; text-decoration: none;">Terms of Service</a></li>
                <li><a href="/cookies" style="color: #94a3b8; text-decoration: none;">Cookie Preferences</a></li>
                <li><a href="/refund-policy" style="color: #94a3b8; text-decoration: none;">Refund Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div style="max-width: 1200px; margin: 2rem auto 0; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; color: #64748b; font-size: 0.75rem;">
          <p>© 2026 Project Polaris. Built by students, for students.</p>
          <p>Contact: project.polaris8@gmail.com</p>
        </div>
      </footer>
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
