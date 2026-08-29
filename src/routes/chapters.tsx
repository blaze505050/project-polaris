import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

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

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <ScrollReveal direction="up">
          <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
            POLARIS CHAPTERS
          </h1>

          <div className="mt-4 inline-block text-lg sm:text-xl font-display font-bold text-primary tracking-wider uppercase py-2 px-6 rounded-2xl bg-surface-2 border border-primary/25 shadow-[0_0_20px_rgba(165,180,252,0.15)]">
            Applications & Early Access Open
          </div>

          <p className="mt-6 text-sm sm:text-base text-foreground/90 font-medium font-sans uppercase tracking-wide max-w-xl mx-auto leading-relaxed">
            Expanding Polaris Chapters to reach curious students from Tier 2, 3 cities and remote regions.
          </p>

          <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            We are creating an open network of institutional and community chapters where school and college students can host stargazing nights, collaborate on science projects, and organize experiential workshops locally.
          </p>
        </ScrollReveal>

        {/* Visual Media Showcase */}
        <ScrollReveal direction="scale" delay={60}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-2xl mx-auto mt-4 bg-card aspect-[16/9]">
            <img
              src="/media/telescope-milkyway.jpg"
              alt="Night astronomy sky observation and stargazing"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-left p-3 rounded-xl bg-surface/85 backdrop-blur-md border border-white/8">
              <div className="text-xs font-bold font-display text-foreground">Community Sky Observation & Space Labs</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Empowering student leaders to drive astronomy & science culture in their institutions.</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Action Button */}
        <ScrollReveal direction="up" delay={100}>
          <div className="pt-6 flex flex-wrap justify-center gap-3 font-sans text-xs">
            <Button
              asChild
              size="default"
              className="h-10 px-6 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors active:scale-[0.97]"
            >
              <a href="https://tally.so/r/LZL56l" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <span>Register Interest as Chapter Lead ↗</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="default"
              className="h-10 px-5 rounded-lg font-medium border-white/10 hover:border-white/20 text-foreground active:scale-[0.97]"
            >
              <Link to="/get-involved">Explore All Opportunities</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
