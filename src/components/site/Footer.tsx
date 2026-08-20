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
    <footer className="border-t border-border bg-surface/30">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:py-16">
        <div>
          <Link to="/" aria-label="Project Polaris Home" className="inline-block">
            <Wordmark />
          </Link>
          <p className="mt-3 max-w-xs text-xs text-muted-foreground leading-relaxed">
            A student-led experiential learning organisation. {SITE.tagline}
          </p>

          <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground font-mono">
            <a href={`mailto:${SITE.emails[0]}`} className="hover:text-foreground transition-colors">
              {SITE.emails[0]}
            </a>
          </div>

          <div className="mt-5 flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-7 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3.5">{col.heading}</h3>
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
          </nav>
        ))}
      </div>

      <div className="shell flex flex-col gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between font-mono">
        <p>© {new Date().getFullYear()} Project Polaris. Student-Led.</p>
        <p className="text-[11px]">Experiential Learning · Space Science & Engineering</p>
      </div>
    </footer>
  );
}

