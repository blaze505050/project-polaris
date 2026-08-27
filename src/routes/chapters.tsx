import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import polarisLogo from "@/assets/polaris-logo.png";

export const Route = createFileRoute("/chapters")({
  head: () => ({
    meta: [
      { title: "Polaris Chapters — Institutional & Regional Hubs" },
      {
        name: "description",
        content:
          "Launching Polaris Chapters soon to reach more students from Tier 2, 3 cities and remote areas.",
      },
      { property: "og:title", content: "Polaris Chapters — Institutional & Regional Hubs" },
      {
        property: "og:description",
        content:
          "Establishing student-led space and aerospace chapters across schools, colleges, and regional clubs.",
      },
      { property: "og:url", content: "https://projectpolaris.in/chapters" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/chapters" }],
  }),
  component: ChaptersPage,
});

function ChaptersPage() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-24 px-4 font-sans text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/25 mb-4">
            <Compass className="size-3.5" />
            <span>REGIONAL INITIATIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
            POLARIS CHAPTERS
          </h1>

          <div className="mt-4 inline-block text-xl sm:text-2xl font-display font-bold text-primary tracking-wider uppercase py-2 px-6 rounded-2xl bg-surface-2 border border-primary/25 shadow-[0_0_20px_rgba(165,180,252,0.15)]">
            APPLICATIONS & EARLY ACCESS OPEN
          </div>

          <p className="mt-6 text-sm sm:text-base text-foreground/90 font-medium font-sans uppercase tracking-wide max-w-xl mx-auto leading-relaxed">
            EXPANDING POLARIS CHAPTERS TO REACH CURIOUS STUDENTS FROM TIER 2, 3 CITIES AND REMOTE REGIONS.
          </p>

          <p className="mt-3 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            We are creating an open network of institutional chapters where school and college students can host observation nights, build computational physics simulations, and organize engineering build sprints locally.
          </p>
        </ScrollReveal>

        {/* Chapter Lead Feature Highlights */}
        <ScrollReveal direction="up" delay={60}>
          <div className="grid gap-3 sm:grid-cols-3 text-left pt-4 max-w-xl mx-auto font-sans">
            {[
              "Official Chapter Toolkit",
              "Observation Night Kits",
              "Direct ISRO Scientist Masterclasses",
            ].map((feature) => (
              <div key={feature} className="p-3.5 rounded-xl bg-card border border-white/8 text-xs flex items-center gap-2">
                <CheckCircle className="size-3.5 text-primary shrink-0" />
                <span className="text-foreground/90 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Action Button */}
        <ScrollReveal direction="up" delay={100}>
          <div className="pt-6 flex flex-wrap justify-center gap-3 font-sans text-xs">
            <Button
              asChild
              size="default"
              className="h-10 px-6 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
            >
              <a href="https://tally.so/r/LZL56l" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <span>Register Interest as Chapter Lead ↗</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="default"
              className="h-10 px-5 rounded-lg font-medium border-white/10 hover:border-white/20 text-foreground"
            >
              <Link to="/get-involved">Explore All Opportunities</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
