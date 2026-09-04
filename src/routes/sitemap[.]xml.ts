import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

const PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.9", changefreq: "weekly" },
  { path: "/programs", priority: "0.95", changefreq: "daily" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/chapters", priority: "0.85", changefreq: "weekly" },
  { path: "/articles", priority: "0.9", changefreq: "daily" },
  { path: "/spotlight", priority: "0.85", changefreq: "weekly" },
  { path: "/get-involved", priority: "0.85", changefreq: "weekly" },
  { path: "/courses", priority: "0.85", changefreq: "weekly" },
  { path: "/schools", priority: "0.75", changefreq: "monthly" },
  { path: "/community", priority: "0.80", changefreq: "weekly" },
  { path: "/resources", priority: "0.80", changefreq: "weekly" },
  { path: "/research", priority: "0.75", changefreq: "monthly" },
  { path: "/showcase", priority: "0.75", changefreq: "monthly" },
  { path: "/impact", priority: "0.75", changefreq: "monthly" },
  { path: "/contact", priority: "0.70", changefreq: "monthly" },
  { path: "/support", priority: "0.70", changefreq: "monthly" },
  { path: "/join", priority: "0.70", changefreq: "monthly" },
  { path: "/privacy", priority: "0.30", changefreq: "yearly" },
  { path: "/terms", priority: "0.30", changefreq: "yearly" },
  { path: "/cookies", priority: "0.30", changefreq: "yearly" },
  { path: "/refund-policy", priority: "0.30", changefreq: "yearly" },
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
