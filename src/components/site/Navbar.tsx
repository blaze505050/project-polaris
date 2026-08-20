import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Wordmark } from "./NorthStar";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Projects", to: "/projects" },
  { label: "Programs", to: "/programs" },
  { label: "About & Showcase", to: "/about" },
  { label: "Contact Us", to: "/contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 pointer-events-none py-3 px-4 sm:px-6",
      )}
    >
      <nav
        aria-label="Main Navigation"
        className={cn(
          "max-w-5xl mx-auto h-12 sm:h-14 px-4 sm:px-6 rounded-full flex items-center justify-between gap-4 pointer-events-auto transition-all duration-300",
          scrolled || open
            ? "bg-background/75 backdrop-blur-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]"
            : "bg-surface/60 backdrop-blur-xl border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
        )}
      >
        {/* Brand */}
        <Link to="/" aria-label="Project Polaris Home" className="shrink-0 group flex items-center gap-2">
          <Wordmark />
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1 font-mono">
          {NAV_ITEMS.map((link) => {
            const isActive = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3.5 py-1.5 text-xs rounded-full transition-all duration-200",
                  isActive
                    ? "text-foreground bg-primary/20 font-bold border border-primary/40 shadow-[0_2px_10px_rgba(197,157,255,0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]",
                )}
                {...(isActive ? { "aria-current": "page" as const } : {})}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex h-8 px-3 text-xs font-mono font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-white/[0.06]">
            <Link to="/portal" className="flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              <span>Portal</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex h-8 px-4 text-xs font-mono font-semibold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 rounded-full shadow-[0_2px_12px_rgba(197,157,255,0.25)] transition-transform active:scale-95">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
              <span>Community</span>
              <ArrowUpRight className="size-3 text-background font-bold" />
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Glass Drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="mt-2 max-w-5xl mx-auto rounded-2xl border border-white/12 bg-surface/90 backdrop-blur-2xl p-4 md:hidden pointer-events-auto shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col gap-1 font-mono">
          {NAV_ITEMS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.06] rounded-xl transition-colors"
              activeProps={{ className: "text-foreground bg-primary/20 font-bold border border-primary/30" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-1 border-t border-white/10 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-center rounded-xl font-mono text-xs border-white/10">
              <Link to="/portal">Student Workspace</Link>
            </Button>
            <Button asChild size="sm" className="w-full justify-center bg-gradient-to-r from-primary to-gold text-background font-mono text-xs font-bold rounded-xl shadow-md">
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <span>Join WhatsApp Community</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


