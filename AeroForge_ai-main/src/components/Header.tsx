import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Shield,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Globe,
  Wind,
  Rocket,
  Wrench,
  Search,
  Sliders,
  FolderOpen,
  Cpu,
  BookOpen,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUnitStore, UnitSystem } from "@/stores/unitStore";
import FeedbackModal from "@/components/FeedbackModal";

// Dynamic breadcrumb based on current route
function useBreadcrumbs() {
  const location = useLocation();
  const { currentProject } = useProjectStore();
  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs: { label: string; path: string }[] = [];

  if (segments.length === 0) {
    return [{ label: "Home", path: "/" }];
  }

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const path = "/" + segments.slice(0, i + 1).join("/");

    switch (seg) {
      case "dashboard":
        crumbs.push({ label: "Dashboard", path });
        break;
      case "projects":
        crumbs.push({ label: "Projects", path: "/projects" });
        // If next segment is a project ID
        if (segments[i + 1] && segments[i + 1] !== "new") {
          crumbs.push({
            label: currentProject?.name || `Project ${segments[i + 1]}`,
            path: `/projects/${segments[i + 1]}`,
          });
          i++; // skip the ID segment
        }
        break;
      case "labs":
        crumbs.push({ label: "Labs", path });
        if (segments[i + 1]) {
          crumbs.push({
            label: segments[i + 1].charAt(0).toUpperCase() + segments[i + 1].slice(1),
            path: path + "/" + segments[i + 1],
          });
          i++;
        }
        break;
      case "aerolab":
        crumbs.push({ label: "AeroLab", path: "/aerolab" });
        break;
      case "astrolab":
        crumbs.push({ label: "AstroLab", path: "/astrolab" });
        if (segments[i + 1]) {
          const toolName = segments[i + 1]
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          crumbs.push({ label: toolName, path: path + "/" + segments[i + 1] });
          i++;
        }
        break;
      case "mechlab":
        crumbs.push({ label: "MechLab", path: "/mechlab" });
        break;
      case "physics-ai":
        crumbs.push({ label: "Physics AI Lab", path: "/physics-ai" });
        break;
      case "settings":
        crumbs.push({ label: "Settings", path });
        break;
      case "documentation":
        crumbs.push({ label: "Documentation", path });
        break;
      default:
        crumbs.push({
          label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
          path,
        });
    }
  }

  return crumbs;
}

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { userMode, toggleMode } = useAeroForgeStore();
  const { unitSystem, setUnitSystem } = useUnitStore();
  const breadcrumbs = useBreadcrumbs();

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Open Command Palette via custom event or keyboard shortcut
  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <header className="w-full bg-[var(--af-bg)] sticky top-0 z-40 border-b border-white/10 backdrop-blur-md bg-opacity-95 text-white">
      {/* Top Context Banner */}
      <div className="w-full bg-[var(--af-surface-1)] border-b border-white/5 px-4 md:px-[4%] py-1 flex flex-wrap justify-between items-center text-[11px] font-mono">
        {/* Left: Brand + Dynamic Breadcrumb */}
        <div className="flex items-center gap-3 text-white/50 overflow-x-auto py-0.5">
          <a
            href="/"
            target="_top"
            className="flex items-center gap-1.5 text-[var(--af-accent)] hover:text-white font-semibold text-[10px] tracking-wider transition-colors shrink-0"
            title="Return to Project Polaris Portal"
          >
            <span>← POLARIS</span>
          </a>

          <span className="text-white/20">/</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/80 font-semibold tracking-wider">AEROFORGE</span>
            {/* WebGL health indicator */}
            <span className="relative flex size-2 ml-0.5" title="Physics Engine Online">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-400"></span>
            </span>
          </div>

          <span className="text-white/20 mx-0.5">/</span>

          {/* Dynamic Breadcrumb with chevron separators */}
          <div className="flex items-center gap-1.5 text-white/70 whitespace-nowrap">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronDown className="w-3 h-3 text-white/25 -rotate-90" />}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-[var(--af-accent)] font-semibold">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-[var(--af-accent)] transition-colors duration-150"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Unit Selector, Quick Search & Mode Switcher */}
        <div className="flex items-center gap-3 ml-auto py-0.5">
          {/* Unit System Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded px-2 py-0.5">
            <Sliders className="w-3 h-3 text-[var(--af-accent)]" />
            <span className="text-white/40 text-[9px] tracking-widest">UNITS:</span>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
              className="bg-transparent text-[var(--af-accent)] font-bold focus:outline-none cursor-pointer text-[10px]"
            >
              <option value="SI" className="bg-[#0A1224] text-white">
                SI (Pa, m, K)
              </option>
              <option value="Metric" className="bg-[#0A1224] text-white">
                Metric (bar, mm, °C)
              </option>
              <option value="Imperial" className="bg-[#0A1224] text-white">
                Imperial (psi, ft, °F)
              </option>
            </select>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={triggerCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            title="Open Command Palette (Ctrl+K)"
          >
            <Search className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Search</span>
            <span className="px-1 bg-white/10 rounded text-[9px] text-white/40">Ctrl+K</span>
          </button>

          {/* Mode Toggle */}
          <button
            onClick={toggleMode}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded border transition-all ${
              userMode === "student"
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border-pink-500/30 bg-pink-500/10 text-pink-400"
            }`}
          >
            {userMode === "student" ? (
              <GraduationCap className="w-3 h-3" />
            ) : (
              <Briefcase className="w-3 h-3" />
            )}
            <span className="font-bold uppercase text-[9px]">
              {userMode === "student" ? "Student" : "Professional"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/polaris-logo.png"
            alt="Project Polaris Logo"
            width={36}
            height={36}
            className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-tight text-white group-hover:text-[var(--af-accent)] transition-colors flex items-center gap-1">
              AERO<span className="text-[var(--af-accent)] group-hover:text-white">FORGE</span>
              <span className="text-[9px] text-[var(--af-accent)] font-normal px-1 py-0.2 rounded border border-cyan-500/30">
                AI
              </span>
            </span>
            <span className="font-mono text-[8.5px] text-white/50 tracking-wider">
              A PROJECT POLARIS INITIATIVE
            </span>
          </div>
        </Link>

        {/* Core Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
          <Link
            to="/projects"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith("/projects") ||
              location.pathname === "/flagship-workflow"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            Projects
          </Link>
          <Link
            to="/aerolab"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith("/aerolab") ||
              location.pathname.startsWith("/labs/aerodynamics")
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            AeroLab
          </Link>
          <Link
            to="/mechlab"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith("/mechlab")
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            MechLab
          </Link>
          <Link
            to="/astrolab"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith("/astrolab")
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-purple-400" />
            AstroLab
          </Link>
          <Link
            to="/challenges"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname === "/challenges"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Challenges
          </Link>
          <Link
            to="/marketplace"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname === "/marketplace"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Marketplace
          </Link>
          <Link
            to="/documentation"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              location.pathname === "/documentation"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            Docs
          </Link>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold transition-all flex items-center gap-1.5 ml-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Feedback</span>
          </button>
        </nav>

        <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-white/80 hover:text-cyan-400 transition-colors"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-[#080F24] border-t border-white/10 px-4 py-4 space-y-2 max-h-[85vh] overflow-y-auto font-mono text-sm">
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-white/90"
          >
            Dashboard
          </Link>
          <Link
            to="/projects"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-white/90"
          >
            Projects
          </Link>
          <Link
            to="/aerolab"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-white/90"
          >
            AeroLab — Aerospace & Aerodynamics
          </Link>
          <Link
            to="/astrolab"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-white/90"
          >
            AstroLab — Space & Orbital
          </Link>
          <Link
            to="/mechlab"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-white/90"
          >
            MechLab — Structures & Materials
          </Link>
          <Link
            to="/physics-ai"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-cyan-300 font-bold"
          >
            Physics AI — Neural Operators & Surrogates [EXP]
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsMenuOpen(false)}
            className="block p-2 rounded hover:bg-white/5 text-white/90"
          >
            Settings
          </Link>
        </div>
      )}
    </header>
  );
}
