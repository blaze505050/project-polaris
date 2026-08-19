import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://projectpolaris.in";

const PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/programs", priority: "0.9", changefreq: "monthly" },
  { path: "/courses", priority: "0.9", changefreq: "weekly" },
  { path: "/projects", priority: "0.8", changefreq: "weekly" },
  { path: "/showcase", priority: "0.8", changefreq: "weekly" },
  { path: "/opportunities", priority: "0.9", changefreq: "weekly" },
  { path: "/schools", priority: "0.8", changefreq: "monthly" },
  { path: "/community", priority: "0.7", changefreq: "weekly" },
  { path: "/resources", priority: "0.7", changefreq: "weekly" },
  { path: "/impact", priority: "0.6", changefreq: "monthly" },
  { path: "/get-involved", priority: "0.8", changefreq: "monthly" },
  { path: "/join", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/auth", priority: "0.5", changefreq: "monthly" },

  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  component: () => null,
  server: {
    handlers: {
      GET: async () => {
        const lastmod = new Date().toISOString().slice(0, 10);
        const urls = PAGES.map(
          (p) =>
            `  <url>\n    <loc>${BASE}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
