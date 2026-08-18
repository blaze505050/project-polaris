import { useEffect, useState, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Instagram, Linkedin, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Wordmark } from "./NorthStar";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Entrance animation
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Scroll tracking + progress bar
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        scrolled || open
          ? "border-b border-white/10 bg-[#04060e]/85 backdrop-blur-xl shadow-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Main" className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" aria-label="Project Polaris — home" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Minimalist Nav Items */}
        <ul className="font-ui hidden items-center gap-2 md:flex rounded-full border border-white/10 bg-slate-900/50 px-4 py-1.5 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="relative rounded-full px-3.5 py-1.5 text-xs md:text-sm font-medium text-slate-300 transition-colors hover:text-white"
                activeProps={{ className: "text-white bg-white/10 font-semibold" }}
                activeOptions={{ exact: link.to === "/" }}
                {...(pathname === link.to ? { "aria-current": "page" as const } : {})}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-1.5 border-r border-white/10 pr-3 mr-1">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Project Polaris Instagram"
              className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-110"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={SITE.linkedinCompanyUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Project Polaris LinkedIn Company Page"
              className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-110"
            >
              <Linkedin className="size-4" />
            </a>
          </div>

          <ThemeToggle />

          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex rounded-full font-medium border-primary/30 hover:bg-primary/10 transition-all duration-300">
            <Link to="/aeroforge" className="flex items-center gap-1.5">
              <Rocket className="size-3.5 text-primary" />
              <span>AeroForge Lab</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex rounded-full font-medium">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
              <MessageCircle className="size-3.5" />
              <span>Join WhatsApp</span>
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-primary md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Scroll Progress Indicator */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary transition-none"
        style={{ width: `${scrollProgress * 100}%`, opacity: scrollProgress > 0.01 ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-[#04060e]/95 backdrop-blur-2xl md:hidden"
      >
        <ul className="shell flex flex-col py-4">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.to}
              style={{
                animation: open ? `fade-in-up 350ms ease-out ${80 * i}ms both` : "none",
              }}
            >
              <Link
                to={link.to}
                className="font-ui block border-b border-white/5 py-3 text-base text-slate-300"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: link.to === "/" }}
                {...(pathname === link.to ? { "aria-current": "page" as const } : {})}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="shell flex flex-col gap-3 pb-8">
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none">
            <Link to="/aeroforge" className="flex items-center justify-center gap-2">
              <Rocket className="size-4" />
              <span>Launch AeroForge Lab</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
              <MessageCircle className="size-4" />
              <span>Join WhatsApp Community</span>
            </a>
          </Button>
          <div className="flex justify-center gap-6 pt-3">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary"
            >
              <Instagram className="size-4" /> Instagram
            </a>
            <a
              href={SITE.linkedinCompanyUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}


