import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { getSpotlights, type SpotlightEntry } from "@/lib/cms-store";
import {
  Sparkles,
  Award,
  ArrowRight,
  ExternalLink,
  Layers,
  Users,
  CheckCircle,
  Calendar,
  X,
} from "lucide-react";

export const Route = createFileRoute("/spotlight")({
  head: () => ({
    meta: [
      { title: "Polaris Spotlight — Exceptional Builders & Projects" },
      {
        name: "description",
        content:
          "Recognising the people and ideas moving Polaris forward. Editorial features of exceptional student projects, research, and community contributions.",
      },
      { property: "og:title", content: "Polaris Spotlight — Exceptional Builders & Projects" },
      {
        property: "og:description",
        content:
          "Selectively recognising exceptional builders, projects, and contributions within the Polaris ecosystem.",
      },
      { property: "og:url", content: "https://projectpolaris.in/spotlight" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/spotlight" }],
  }),
  component: SpotlightPage,
});

const SPOTLIGHT_CATEGORIES = [
  "All",
  "Student Spotlight",
  "Project Spotlight",
  "Winner Spotlight",
  "Team Spotlight",
  "Community Spotlight",
] as const;

function SpotlightPage() {
  const spotlights = getSpotlights();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalSpotlight, setActiveModalSpotlight] = useState<SpotlightEntry | null>(null);

  const featuredSpotlight = spotlights.find((s) => s.featured) || spotlights[0];
  const previousSpotlights = spotlights.filter((s) => s.id !== featuredSpotlight?.id);

  const filteredPrevious = previousSpotlights.filter((s) => {
    if (selectedCategory === "All") return true;
    return s.category === selectedCategory;
  });

  return (
    <>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        <div className="shell max-w-4xl space-y-4 font-sans text-left">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              POLARIS SPOTLIGHT
            </h1>
            <p className="mt-3 text-lg sm:text-2xl font-display text-primary/95 font-medium max-w-2xl leading-snug">
              Recognising the people and ideas moving Polaris forward.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Polaris doesn't just teach students. It notices the ones who go out and do something
              with what they learn.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. CURRENT / FEATURED SPOTLIGHT ── */}
      {featuredSpotlight && (
        <section className="section border-b border-white/8 bg-surface-2/15" id="current-spotlight">
          <div className="shell font-sans space-y-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
                CURRENT SPOTLIGHT
              </span>
            </div>

            <ScrollReveal direction="up">
              <div className="p-6 md:p-8 rounded-2xl border border-primary/30 bg-card overflow-hidden">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold text-[10px] uppercase">
                        {featuredSpotlight.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {featuredSpotlight.date}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-snug">
                      {featuredSpotlight.name}
                    </h2>

                    <p className="text-sm font-medium text-primary leading-snug font-display">
                      "{featuredSpotlight.headline}"
                    </p>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {featuredSpotlight.story}
                    </p>

                    {featuredSpotlight.accomplishment && (
                      <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/6 space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                          What Was Accomplished
                        </span>
                        <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                          {featuredSpotlight.accomplishment}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        onClick={() => setActiveModalSpotlight(featuredSpotlight)}
                        size="sm"
                        className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="size-3.5 ml-1.5" />
                      </Button>
                      {featuredSpotlight.links &&
                        featuredSpotlight.links.map((link) => (
                          <Button
                            key={link.label}
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 text-xs border-white/10 hover:border-white/20"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* Visual / Highlight Box */}
                  <div className="p-6 rounded-xl bg-surface-2/40 border border-white/6 space-y-3 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-primary tracking-wider block font-mono mb-2">
                        Contribution to Polaris Ecosystem
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {featuredSpotlight.contributionToPolaris ||
                          "A verified contribution advancing student research and practical physics capabilities."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/6 flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="size-4 text-emerald-400" />
                      <span>Verified Editorial Recognition</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 3. PREVIOUS SPOTLIGHTS & FILTERS ── */}
      <section className="section" id="previous-spotlights">
        <div className="shell space-y-8 font-sans">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Archive of Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Previous Recognitions
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {SPOTLIGHT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrevious.map((entry, idx) => (
              <ScrollReveal key={entry.id} direction="up" delay={idx * 30}>
                <article className="p-6 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold text-[10px] uppercase">
                        {entry.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {entry.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                      {entry.name}
                    </h3>

                    <p className="text-xs text-primary font-medium leading-snug">
                      "{entry.headline}"
                    </p>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {entry.story}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">Recognized Entry</span>
                    <button
                      type="button"
                      onClick={() => setActiveModalSpotlight(entry)}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spotlight Detail Modal ── */}
      {activeModalSpotlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold uppercase text-[10px]">
                {activeModalSpotlight.category}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalSpotlight(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="text-2xl font-bold font-display text-foreground">
              {activeModalSpotlight.name}
            </h2>

            <div className="text-xs text-primary font-medium">
              "{activeModalSpotlight.headline}" • {activeModalSpotlight.date}
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/6">
              <div>
                <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                  Their Journey & Story
                </span>
                <p>{activeModalSpotlight.story}</p>
              </div>

              {activeModalSpotlight.accomplishment && (
                <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                  <span className="text-[10px] uppercase font-semibold text-foreground block mb-1">
                    What Was Accomplished
                  </span>
                  <p className="text-foreground/90 font-medium">
                    {activeModalSpotlight.accomplishment}
                  </p>
                </div>
              )}

              {activeModalSpotlight.contributionToPolaris && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                    Contribution to Polaris
                  </span>
                  <p>{activeModalSpotlight.contributionToPolaris}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-end">
              <Button onClick={() => setActiveModalSpotlight(null)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
