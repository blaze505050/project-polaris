import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { Wordmark } from "./NorthStar";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "About", to: "/about" },
      { label: "Programs", to: "/programs" },
      { label: "Courses", to: "/courses" },
      { label: "Projects", to: "/projects" },
      { label: "Showcase", to: "/showcase" },
      { label: "Opportunities", to: "/opportunities" },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    heading: "Participate",
    links: [
      { label: "Get Involved", to: "/get-involved" },
      { label: "Join Polaris", to: "/join" },
      { label: "Volunteer Program", to: SITE.volunteerUrl, external: true },
      { label: "Associate Form", to: SITE.associateFormUrl, external: true },
      { label: "Community", to: "/community" },
      { label: "For Schools", to: "/schools" },
      { label: "Impact", to: "/impact" },
    ],
  },
  {
    heading: "Connect & Legal",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { href: SITE.instagramUrl, label: "Instagram", Icon: Instagram },
  { href: SITE.linkedinCompanyUrl, label: "LinkedIn Organization", Icon: Linkedin },
  { href: SITE.communityUrl, label: "WhatsApp Community", Icon: MessageCircle },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface/40">
      {/* Gradient shimmer divider */}
      <div className="section-divider" aria-hidden="true" />

      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-20">
        <div>
          <Link to="/" aria-label="Project Polaris Home" className="inline-block">
            <Wordmark />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-slate-300">
            A student-led experiential learning organisation. {SITE.tagline}
          </p>

          <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground">
            <a href={`mailto:${SITE.emails[0]}`} className="inline-flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="size-3.5 text-primary" /> {SITE.emails[0]}
            </a>
            <a href={`mailto:${SITE.emails[1]}`} className="inline-flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="size-3.5 text-primary" /> {SITE.emails[1]}
            </a>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all duration-250 hover:border-primary hover:text-primary hover:scale-110 hover:shadow-[0_0_12px_-3px_rgba(197,157,255,0.3)]"
              >
                <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="eyebrow-muted mb-5">{col.heading}</h2>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noreferrer"
                      className="font-ui text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="font-ui text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="shell flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-ui">© {new Date().getFullYear()} Project Polaris. Built by students.</p>
        <p className="font-ui">Currently centred on space science. Not limited to it.</p>
      </div>
    </footer>
  );
}

