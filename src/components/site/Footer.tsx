import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { Wordmark, NorthStar } from "./NorthStar";
import { MessageCircle, Instagram, Linkedin, ArrowUpRight, Github } from "lucide-react";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Projects & AeroForge", to: "/projects" },
      { label: "Programs & Cohorts", to: "/programs" },
      { label: "Student Showcase", to: "/showcase" },
      { label: "Technical Research", to: "/research" },
      { label: "For Schools", to: "/schools" },
    ],
  },
  {
    heading: "Organization",
    links: [
      { label: "About Polaris", to: "/about" },
      { label: "Student Workspace", to: "/portal" },
      { label: "Volunteer Program", to: SITE.volunteerUrl, external: true },
      { label: "Associate Form", to: SITE.associateFormUrl, external: true },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    heading: "Legal & Policies",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { href: SITE.communityUrl, label: "WhatsApp Community", Icon: MessageCircle },
  { href: SITE.instagramUrl, label: "Instagram", Icon: Instagram },
  { href: SITE.linkedinCompanyUrl, label: "LinkedIn", Icon: Linkedin },
  { href: "https://github.com/blaze505050/project-polaris", label: "GitHub", Icon: Github },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-surface-2/40 text-xs">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" aria-label="Project Polaris Home" className="inline-block">
              <Wordmark />
            </Link>
            <p className="font-display italic text-foreground/90 text-sm">
              Build real things. Learn along the way.
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm font-body">
              Project Polaris is a student engineering ecosystem where students build simulations, software, research, and real-world systems.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="size-8 rounded-full border border-white/10 bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3 font-mono">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-primary">
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
                        <ArrowUpRight className="size-2.5 opacity-60" />
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
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <NorthStar className="size-3 text-gold" />
            <span>© {new Date().getFullYear()} Project Polaris. 100% Free & Open Source.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
