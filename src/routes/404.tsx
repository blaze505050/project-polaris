import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { NorthStar } from "@/components/site/NorthStar";
import { Home, Compass, FolderKanban, BookOpen, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "404 — Coordinates Not Found | Project Polaris" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NotFoundPage,
});

export function NotFoundPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      {/* Ambient Celestial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/25 shadow-sm">
          <NorthStar className="size-3.5 text-primary" />
          <span>Coordinates Not Found</span>
        </div>

        <h1 className="text-7xl sm:text-9xl font-bold font-display tracking-tight text-foreground/20 leading-none">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Lost in Deep Space?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            The orbital trajectory or page you are looking for does not exist or has been shifted into another sector. Let's recalculate your state vectors.
          </p>
        </div>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-sans text-left">
          <Link
            to="/"
            className="p-3.5 rounded-xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <Home className="size-4 text-primary mb-1.5" />
            <span className="font-bold text-foreground block">Home</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Main platform</span>
          </Link>
          <Link
            to="/programs"
            className="p-3.5 rounded-xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <Compass className="size-4 text-primary mb-1.5" />
            <span className="font-bold text-foreground block">Programs</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Industry Sprints</span>
          </Link>
          <Link
            to="/projects"
            className="p-3.5 rounded-xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <FolderKanban className="size-4 text-primary mb-1.5" />
            <span className="font-bold text-foreground block">Projects</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">AeroForge Lab</span>
          </Link>
          <Link
            to="/articles"
            className="p-3.5 rounded-xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <BookOpen className="size-4 text-primary mb-1.5" />
            <span className="font-bold text-foreground block">Articles</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Publications</span>
          </Link>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="default" className="h-10 px-6 font-semibold text-xs bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Link to="/" className="flex items-center gap-2">
              <Home className="size-3.5" />
              <span>Return Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="h-10 px-5 text-xs border-white/10 hover:border-white/20 text-foreground">
            <Link to="/get-involved">Contact Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
