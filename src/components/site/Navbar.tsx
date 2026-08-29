import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wordmark } from "./NorthStar";
import { ThemeToggle } from "./ThemeToggle";

// Exactly the 9 required pages for the navigation panel
export const NAV_PAGES = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Projects", to: "/projects" },
  { label: "Chapters", to: "/chapters" },
  { label: "Articles", to: "/articles" },
  { label: "Spotlight", to: "/spotlight" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Student Dashboard", to: "/dashboard" },
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
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none py-3 px-3 sm:px-6" style={{ transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
      <nav
        aria-label="Main Navigation"
        className={cn(
          "max-w-7xl mx-auto h-13 sm:h-14 px-3 sm:px-5 rounded-full flex items-center justify-between gap-3 pointer-events-auto relative",
          scrolled || open
            ? "bg-background/90 backdrop-blur-2xl border border-white/12 shadow-[0_16px_36px_rgba(0,0,0,0.6)]"
            : "bg-surface/80 backdrop-blur-xl border border-white/8 shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
        )}
        style={{ transition: 'all 350ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {/* Brand Logo */}
        <Link to="/" aria-label="Project Polaris Home" className="shrink-0 flex items-center gap-2">
          <Wordmark />
        </Link>

        {/* Center Nav Items (8 Main Navigation Pages) - Hidden on mobile */}
        <div className="hidden xl:flex items-center gap-1 text-xs font-medium font-sans">
          {NAV_PAGES.slice(0, 8).map((item) => {
            const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "nav-link-glow px-3 py-1.5 rounded-lg font-sans",
                  isActive
                    ? "text-foreground font-semibold bg-white/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/4"
                )}
                style={{ transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action: Theme Toggle & 9. Student Dashboard Login */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop Student Dashboard (Page 9) */}
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex h-8 px-3.5 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Link to="/dashboard" className="flex items-center gap-1.5">
              <User className="size-3.5" />
              <span>Dashboard</span>
            </Link>
          </Button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={open}
            className="xl:hidden p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-white/6 transition-colors"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Featuring all 9 pages clearly) */}
      {open && (
        <div className="xl:hidden fixed inset-x-3 top-20 z-50 p-5 rounded-2xl border border-white/10 bg-background/95 backdrop-blur-2xl shadow-2xl pointer-events-auto max-h-[82vh] overflow-y-auto font-sans drawer-animated">
          <div className="space-y-1 stagger-children">
            <span className="text-[10px] uppercase font-semibold text-primary tracking-wider block px-3 mb-2">
              Navigation Menu
            </span>

            {NAV_PAGES.slice(0, 8).map((item, idx) => {
              const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl text-sm",
                    isActive
                      ? "bg-white/10 text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                  style={{ transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground/60 w-4">0{idx + 1}</span>
                    <span>{item.label}</span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              );
            })}

            {/* Page 9: Student Dashboard */}
            <div className="pt-3 border-t border-white/8 mt-3">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90"
                style={{ transition: 'opacity 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 120ms cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>09. Student Dashboard / Login</span>
                </div>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
