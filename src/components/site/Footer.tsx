import { Link } from "@tanstack/react-router";
import { Wordmark, NorthStar } from "./NorthStar";
import { MessageCircle, Instagram, Linkedin, Mail, Send } from "lucide-react";
import { SITE } from "@/lib/site";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Home", to: "/" },
      { label: "About Us", to: "/about" },
      { label: "Programs & Events", to: "/programs" },
      { label: "Projects & Labs", to: "/projects" },
      { label: "Polaris Chapters", to: "/chapters" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Articles & Newsletter", to: "/articles" },
      { label: "Polaris Spotlight", to: "/spotlight" },
      { label: "Get Involved", to: "/get-involved" },
      { label: "Student Dashboard", to: "/dashboard" },
    ],
  },
  {
    heading: "Connect & Apply",
    links: [
      { label: "Volunteer Operations", to: "https://forms.gle/ZXaxJH9k2ZUXVdYz6", external: true },
      { label: "Volunteer Outreach", to: "https://forms.gle/WoKGodwNCBp5wkcn8", external: true },
      { label: "Volunteer Research", to: "https://forms.gle/SnMhq9gNDLWmNqCF7", external: true },
      { label: "Volunteer Content", to: "https://forms.gle/qUtQhWUNhmWtuSQu8", external: true },
      { label: "Partner With Us", to: "https://tally.so/r/LZL56l", external: true },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
    label: "WhatsApp Community",
    Icon: MessageCircle,
  },
  {
    href: "https://whatsapp.com/channel/0029VbDrFjTDJ6H506hXDG2h",
    label: "WhatsApp Channel",
    Icon: Send,
  },
  {
    href: "https://www.instagram.com/project_polaris_?igsi=MTM1cWxldXBlM2sybA==",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://www.linkedin.com/company/nova-next-gen-of-vision-and-astronomy/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  { href: `mailto:${SITE.contactEmail}`, label: "Email Us", Icon: Mail },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2/50 text-xs font-sans">
      <div className="shell py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="space-y-3.5">
            <Link to="/" aria-label="Project Polaris Home" className="inline-block">
              <Wordmark />
            </Link>
            <p className="font-display text-primary font-medium text-sm">
              Learn by building, rather than building after learning.
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              A student-led experiential engineering ecosystem built by students, for students.
              Bridging the gap between traditional education and real-world learning.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => {
                const isMail = href.startsWith("mailto:");
                return (
                  <a
                    key={label}
                    href={href}
                    {...(!isMail ? { target: "_blank", rel: "noreferrer" } : {})}
                    aria-label={label}
                    className="size-8 rounded-full border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                  >
                    <Icon className="size-3.5" />
                  </a>
                );
              })}
            </div>
            <div className="text-[11px] text-muted-foreground pt-1">
              Contact:{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="text-primary hover:underline">
                {SITE.contactEmail}
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-primary">
                {col.heading}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                      >
                        <span>{link.label}</span>
                        <span className="text-[10px] opacity-60">↗</span>
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Baseline Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <NorthStar className="size-3 text-primary" />
            <span>
              © {new Date().getFullYear()} Project Polaris. Built by students, for students.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Cookie Preferences
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-foreground transition-colors">
              Refund & Cancellation
            </Link>
            <span>•</span>
            <Link to="/support" className="hover:text-foreground transition-colors">
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
