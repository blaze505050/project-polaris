import { useEffect, useState, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  ArrowUpRight,
  User,
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Flame,
  FileText,
  Hammer,
  Users,
  Cpu,
  Calendar,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Wordmark } from "./NorthStar";
import { ThemeToggle } from "./ThemeToggle";

const LEARN_ITEMS = [
  {
    label: "Workshops",
    desc: "Live expert-led masterclasses (60–90m)",
    to: "/courses?type=workshop",
    icon: Sparkles,
  },
  {
    label: "Mini-Courses",
    desc: "Short, practical skill modules (2–7h)",
    to: "/courses?type=course",
    icon: GraduationCap,
  },
  {
    label: "Bootcamps",
    desc: "Cohort-based deep dives with mentors (3–6w)",
    to: "/courses?type=bootcamp",
    icon: Flame,
  },
  {
    label: "Resources",
    desc: "Free guides, notes & interactive tools",
    to: "/resources",
    icon: FileText,
  },
] as const;

const BUILD_ITEMS = [
  {
    label: "Projects",
    desc: "Student engineering platforms & software",
    to: "/projects",
    icon: Hammer,
  },
  {
    label: "Build Squads",
    desc: "Active sprint teams of 3–5 builders",
    to: "/projects#squads",
    icon: Users,
  },
  {
    label: "AeroForge Lab",
    desc: "40+ CFD, FEA & orbital mechanics solvers",
    to: "/projects#aeroforge-lab",
    icon: Cpu,
  },
] as const;

const COMMUNITY_ITEMS = [
  {
    label: "Live Events",
    desc: "Webinars, masterclasses & pitch challenges",
    to: "/programs",
    icon: Calendar,
  },
  {
    label: "Mentorship",
    desc: "Direct guidance from researchers & engineers",
    to: "/about",
    icon: HeartHandshake,
  },
  {
    label: "Student Community",
    desc: "WhatsApp community & daily Aaj Ka Gyan drops",
    to: SITE.communityUrl,
    external: true,
    icon: MessageCircle,
  },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300 pointer-events-none py-3 px-4 sm:px-6">
      <nav
        aria-label="Main Navigation"
        ref={dropdownRef}
        className={cn(
          "max-w-6xl mx-auto h-12 sm:h-14 px-4 sm:px-6 rounded-full flex items-center justify-between gap-4 pointer-events-auto transition-all duration-300 relative",
          scrolled || open
            ? "bg-background/85 backdrop-blur-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]"
            : "bg-surface/70 backdrop-blur-xl border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
        )}
      >
        {/* Brand */}
        <Link to="/" aria-label="Project Polaris Home" className="shrink-0 group flex items-center gap-2">
          <Wordmark />
        </Link>

        {/* Center Nav Dropdowns */}
        <div className="hidden md:flex items-center gap-1 font-mono text-xs">
          {/* Learn Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === "learn" ? null : "learn")}
              className={cn(
                "px-3 py-1.5 rounded-full flex items-center gap-1 transition-all duration-200",
                pathname.startsWith("/courses") || pathname.startsWith("/resources") || activeDropdown === "learn"
                  ? "text-foreground bg-primary/20 font-bold border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]",
              )}
            >
              <span>Learn</span>
              <ChevronDown className={cn("size-3 transition-transform", activeDropdown === "learn" && "rotate-180")} />
            </button>

            {activeDropdown === "learn" && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-white/12 bg-surface/95 backdrop-blur-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="text-[10px] uppercase font-bold text-primary px-3 py-1 tracking-wider">
                  The Learning Ladder
                </div>
                {LEARN_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/[0.08] transition-colors group"
                  >
                    <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors shrink-0 mt-0.5">
                      <item.icon className="size-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Build Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === "build" ? null : "build")}
              className={cn(
                "px-3 py-1.5 rounded-full flex items-center gap-1 transition-all duration-200",
                pathname.startsWith("/projects") || activeDropdown === "build"
                  ? "text-foreground bg-primary/20 font-bold border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]",
              )}
            >
              <span>Build</span>
              <ChevronDown className={cn("size-3 transition-transform", activeDropdown === "build" && "rotate-180")} />
            </button>

            {activeDropdown === "build" && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-white/12 bg-surface/95 backdrop-blur-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="text-[10px] uppercase font-bold text-primary px-3 py-1 tracking-wider">
                  Engineering & Sprints
                </div>
                {BUILD_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/[0.08] transition-colors group"
                  >
                    <div className="size-7 rounded-lg bg-surface-2 border border-white/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors shrink-0 mt-0.5">
                      <item.icon className="size-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Community Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === "community" ? null : "community")}
              className={cn(
                "px-3 py-1.5 rounded-full flex items-center gap-1 transition-all duration-200",
                pathname.startsWith("/community") || pathname.startsWith("/programs") || activeDropdown === "community"
                  ? "text-foreground bg-primary/20 font-bold border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]",
              )}
            >
              <span>Community</span>
              <ChevronDown className={cn("size-3 transition-transform", activeDropdown === "community" && "rotate-180")} />
            </button>

            {activeDropdown === "community" && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-white/12 bg-surface/95 backdrop-blur-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="text-[10px] uppercase font-bold text-primary px-3 py-1 tracking-wider">
                  Network & Cohorts
                </div>
                {COMMUNITY_ITEMS.map((item) => (
                  "external" in item && item.external ? (
                    <a
                      key={item.label}
                      href={item.to}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="size-7 rounded-lg bg-surface-2 border border-white/8 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <item.icon className="size-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                          <span>{item.label}</span>
                          <ArrowUpRight className="size-2.5 opacity-60" />
                        </div>
                        <div className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="size-7 rounded-lg bg-surface-2 border border-white/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors shrink-0 mt-0.5">
                        <item.icon className="size-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Showcase Direct Link */}
          <Link
            to="/showcase"
            className={cn(
              "px-3 py-1.5 rounded-full transition-all duration-200",
              pathname.startsWith("/showcase")
                ? "text-foreground bg-primary/20 font-bold border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]",
            )}
          >
            Showcase
          </Link>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex h-8 px-3 text-xs font-mono font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-white/[0.06]">
            <Link to="/portal" className="flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              <span>Workspace</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex h-8 px-4 text-xs font-mono font-bold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 rounded-full shadow-[0_2px_12px_rgba(197,157,255,0.25)] transition-transform active:scale-95">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
              <span>Join Polaris</span>
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

      {/* Mobile Drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="mt-2 max-w-5xl mx-auto rounded-2xl border border-white/12 bg-surface/95 backdrop-blur-2xl p-4 md:hidden pointer-events-auto shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200 font-mono text-xs"
      >
        <div className="space-y-1">
          <div className="text-[10px] text-primary uppercase font-bold px-3 py-1">Learn</div>
          <div className="grid grid-cols-2 gap-1">
            {LEARN_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-3 py-2 rounded-xl bg-surface-2/60 text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-white/8">
          <div className="text-[10px] text-primary uppercase font-bold px-3 py-1">Build</div>
          <div className="grid grid-cols-2 gap-1">
            {BUILD_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-3 py-2 rounded-xl bg-surface-2/60 text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-white/8">
          <div className="text-[10px] text-primary uppercase font-bold px-3 py-1">Community & Showcase</div>
          <div className="grid grid-cols-2 gap-1">
            <Link to="/programs" className="px-3 py-2 rounded-xl bg-surface-2/60 text-muted-foreground hover:text-foreground">
              Live Events
            </Link>
            <Link to="/showcase" className="px-3 py-2 rounded-xl bg-surface-2/60 text-muted-foreground hover:text-foreground">
              Showcase
            </Link>
          </div>
        </div>

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
    </header>
  );
}
