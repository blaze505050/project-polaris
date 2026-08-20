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
  { label: "AeroForge Lab", to: "/aeroforge" },
  { label: "Showcase", to: "/showcase" },
  { label: "Programs", to: "/programs" },
  { label: "About", to: "/about" },
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled || open
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <nav aria-label="Main Navigation" className="shell flex h-14 items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" aria-label="Project Polaris Home" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((link) => {
            const isActive = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  isActive
                    ? "text-foreground bg-surface-2 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/50",
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

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground">
            <Link to="/portal" className="flex items-center gap-1.5">
              <User className="size-3.5" />
              <span>Workspace</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex h-8 px-3 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
              <span>Community</span>
              <ArrowUpRight className="size-3 opacity-70" />
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-b border-border bg-background px-4 py-4 md:hidden"
      >
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-md"
              activeProps={{ className: "text-foreground bg-surface-2 font-semibold" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-center">
              <Link to="/portal">Student Workspace</Link>
            </Button>
            <Button asChild size="sm" className="w-full justify-center bg-foreground text-background">
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                <span>Join Community</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


