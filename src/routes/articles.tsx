import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { getArticles, type ArticleItem } from "@/lib/cms-store";
import {
  BookOpen,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  User,
  Filter,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Newsletter & Articles — Project Polaris" },
      {
        name: "description",
        content:
          "Explore. Learn. Share. A space for ideas, insights, and stories from the Polaris student and researcher community.",
      },
      { property: "og:title", content: "Newsletter & Articles — Project Polaris" },
      {
        property: "og:description",
        content:
          "Articles and regular newsletter drops on science, technology, aerospace simulation, and student perspectives.",
      },
      { property: "og:url", content: "https://projectpolaris.in/articles" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/articles" }],
  }),
  component: ArticlesPage,
});

const CATEGORIES = [
  "All Topics",
  "Science & Astronomy",
  "Technology & Innovation",
  "Research",
  "Education",
  "Entrepreneurship",
  "Student Perspectives",
] as const;

function ArticlesPage() {
  const allArticles = getArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Topics");
  const [activeModalArticle, setActiveModalArticle] = useState<ArticleItem | null>(null);

  const filteredArticles = allArticles.filter((art) => {
    if (selectedCategory === "All Topics") return true;
    return art.category === selectedCategory;
  });

  return (
    <>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        <div className="shell max-w-4xl mx-auto text-center space-y-4 font-sans">
          <ScrollReveal direction="up">
            <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-2">
              Publications & Ideas
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              Explore. Learn. Share.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A space for ideas, insights, and stories from the Polaris student, researcher, and volunteer community.
            </p>
          </ScrollReveal>

          <div className="pt-4 flex flex-wrap justify-center gap-3 font-sans text-xs">
            <Button
              asChild
              size="sm"
              className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
            >
              <a href="https://tally.so/r/ZjrPzA" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <span>Submit an Article ↗</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-4 border-white/10 hover:border-white/20 text-foreground"
            >
              <a href="#newsletter">Join Newsletter</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 2. NEWSLETTER OVERVIEW ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="newsletter">
        <div className="shell max-w-4xl mx-auto font-sans">
          <ScrollReveal direction="up">
            <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-card space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-primary uppercase tracking-wider block font-semibold mb-1">
                    Polaris Dispatch
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                    The Polaris Newsletter
                  </h2>
                </div>
                <span className="text-xs font-mono text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  Weekly Drops
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Get regular curated updates covering:
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-foreground/90 font-medium">
                {[
                  "Science, technology & innovation",
                  "Opportunities, competitions & research",
                  "Projects, events & workshops",
                  "Polaris announcements & updates",
                  "Discoveries, datasets & simulation tools",
                  "Student research explainers",
                ].map((point) => (
                  <div key={point} className="p-2.5 rounded-lg bg-surface border border-white/6 flex items-center gap-2">
                    <CheckCircle className="size-3.5 text-primary shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="sm"
                  className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
                >
                  <a
                    href="https://whatsapp.com/channel/0029VbDrFjTDJ6H506hXDG2h"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <Send className="size-3.5" />
                    <span>Subscribe via WhatsApp Channel ↗</span>
                  </a>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. ARTICLES CATALOG & TOPIC FILTERS ── */}
      <section className="section border-b border-white/8" id="articles-list">
        <div className="shell space-y-8 font-sans">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Student & Volunteer Writings
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Selected Community Articles
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {CATEGORIES.map((cat) => (
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

          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {filteredArticles.map((art, idx) => (
              <ScrollReveal key={art.id} direction="up" delay={idx * 30}>
                <article className="p-6 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold text-[10px] uppercase">
                        {art.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>{art.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>

                    <div className="pt-2 text-xs text-primary font-medium flex items-center gap-2">
                      <User className="size-3" />
                      <span>{art.author.name}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">{art.publishedAt}</span>
                    <button
                      type="button"
                      onClick={() => setActiveModalArticle(art)}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SUBMIT YOUR ARTICLE ── */}
      <section className="section bg-surface-2/10" id="submit">
        <div className="shell max-w-2xl mx-auto text-center space-y-4 font-sans">
          <ScrollReveal direction="up">
            <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
              Open Submissions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
              Have something worth sharing?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Students and community members can submit their original articles, research explainers, opinions, or educational content for editorial review.
            </p>
            <p className="text-[11px] text-primary/80 font-medium">
              Selected submissions may be edited and published on the Polaris platform.
            </p>

            <div className="pt-4">
              <Button
                asChild
                size="default"
                className="h-10 px-6 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors text-xs"
              >
                <a href="https://tally.so/r/ZjrPzA" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <span>Submit an Article →</span>
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Article Detail Modal ── */}
      {activeModalArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 font-sans">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold uppercase text-[10px]">
                {activeModalArticle.category}
              </span>
              <span className="text-muted-foreground">{activeModalArticle.readTime}</span>
            </div>

            <h2 className="text-2xl font-bold font-display text-foreground">
              {activeModalArticle.title}
            </h2>

            <div className="text-xs text-primary font-medium">
              By {activeModalArticle.author.name} ({activeModalArticle.author.role}) • {activeModalArticle.publishedAt}
            </div>

            <div className="pt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t border-white/6">
              {activeModalArticle.content}
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-between items-center text-xs">
              <Button onClick={() => setActiveModalArticle(null)} variant="outline" size="sm">
                Close
              </Button>
              <a href="https://tally.so/r/ZjrPzA" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Submit your own article ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
