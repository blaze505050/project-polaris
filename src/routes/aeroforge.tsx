import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Maximize2,
  Minimize2,
  ExternalLink,
  Info,
  ChevronRight,
  Sparkles,
  Lock,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransparencyModal } from "@/components/site/TransparencyModal";
import { ThemeToggle, getResolvedTheme, ThemePreference } from "@/components/site/ThemeToggle";

export const Route = createFileRoute("/aeroforge")({
  head: () => ({
    meta: [
      { title: "AeroForge AI Lab — Project Polaris" },
      {
        name: "description",
        content:
          "AeroForge AI is an interactive Aerospace & Mechanical Engineering research laboratory featuring 40+ physics solvers, orbital mechanics, aerodynamics, thermal analysis, and material selection tools developed by Project Polaris.",
      },
      { property: "og:title", content: "AeroForge AI Lab — Project Polaris" },
      {
        property: "og:description",
        content:
          "Explore the AeroForge interactive space engineering laboratory with advanced physics tools, CFD aerodynamics, and orbital mechanics.",
      },
      { property: "og:image", content: "/polaris-logo.png" },
    ],
  }),
  component: AeroForgeLab,
});

function AeroForgeLab() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync theme to iframe via postMessage
  const syncThemeToIframe = (theme: "dark" | "light") => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: "POLARIS_THEME_UPDATE", theme },
          window.location.origin
        );
      } catch (err) {
        console.warn("Theme postMessage sync error:", err);
      }
    }
  };

  useEffect(() => {
    // Listen for secure messages from child AeroForge iframe
    const handleMessage = (event: MessageEvent) => {
      // Strict origin validation
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "AEROFORGE_READY") {
        setIsLoading(false);
        const stored = (localStorage.getItem("polaris-theme") as ThemePreference) || "system";
        const resolved = getResolvedTheme(stored);
        syncThemeToIframe(resolved);
      } else if (event.data?.type === "AEROFORGE_THEME_CHANGE" && event.data?.theme) {
        // Synchronize parent theme when child switches
        const theme = event.data.theme as "dark" | "light";
        document.documentElement.classList.toggle("light", theme === "light");
        document.documentElement.setAttribute("data-theme", theme);
      }
    };

    window.addEventListener("message", handleMessage);

    // Safety timeout to ensure loading state dismisses
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className={`relative w-full bg-background flex flex-col ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.5rem)] pt-16 md:pt-20"}`}>
      {/* Transparency & Security Modal */}
      <TransparencyModal
        isOpen={showTransparency}
        onClose={() => setShowTransparency(false)}
      />

      {/* Top Security & Transparency Control Bar */}
      <div className="w-full bg-surface border-b border-border px-4 md:px-6 py-2 flex items-center justify-between text-xs font-mono text-muted-foreground shrink-0 z-20">
        {/* Breadcrumb & Provenance */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <Link
            to="/"
            className="text-primary hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Project Polaris</span>
          </Link>
          <ChevronRight className="size-3 text-white/30 shrink-0" />
          <Link
            to="/projects"
            className="text-white/60 hover:text-white transition-colors shrink-0"
          >
            <span>Projects</span>
          </Link>
          <ChevronRight className="size-3 text-white/30 shrink-0" />
          <span className="text-foreground font-bold flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AeroForge AI Lab</span>
          </span>
          <span className="hidden sm:inline text-[10px] text-amber-400/90 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded ml-2">
            OFFICIAL POLARIS INITIATIVE
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Transparency Trigger */}
          <button
            type="button"
            onClick={() => setShowTransparency(true)}
            aria-label="Open Project Polaris Governance & Transparency Charter"
            aria-haspopup="dialog"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 hover:bg-surface-3 text-slate-200 hover:text-white border border-border text-[11px] transition-colors"
            title="Read Project Polaris & AeroForge Transparency Charter"
          >
            <Shield className="size-3.5 text-primary" />
            <span className="hidden md:inline">Transparency Charter</span>
          </button>

          {/* Standalone View */}
          <a
            href="/aeroforge/index.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open AeroForge in Standalone Tab"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 hover:bg-surface-3 text-slate-200 hover:text-white border border-border text-[11px] transition-colors"
            title="Open AeroForge in Standalone Window"
          >
            <ExternalLink className="size-3.5 text-sky-400" />
            <span className="hidden sm:inline">Direct Tab</span>
          </a>

          {/* Fullscreen Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? "Exit Fullscreen mode" : "Expand AeroForge Lab to Full Viewport"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-[11px] font-semibold transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Expand to Full Viewport"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="size-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="size-3.5" />
                <span className="hidden sm:inline">Expand Lab</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Sandbox Iframe */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-background">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-foreground font-mono text-xs space-y-3">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Cpu className="size-4 animate-pulse" />
              <span>Booting AeroForge Physics Engines & WebGL Canvas...</span>
            </div>
            <p className="text-[11px] text-white/40">Secured via Project Polaris Sandbox Environment</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="/aeroforge/index.html"
          className="w-full h-full border-none"
          title="AeroForge AI — Project Polaris Aerospace & Mechanical Engineering Laboratory"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
          allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          onLoad={() => {
            setIsLoading(false);
            const stored = (localStorage.getItem("polaris-theme") as ThemePreference) || "system";
            const resolved = getResolvedTheme(stored);
            syncThemeToIframe(resolved);
          }}
        />
      </div>
    </div>
  );
}
