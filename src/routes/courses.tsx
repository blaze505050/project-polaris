import { useState, useMemo } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  GraduationCap,
  Sparkles,
  Flame,
  Hammer,
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  Users,
  ChevronRight,
  Layers,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE_URL } from "@/lib/site";
import {
  LEARNING_CATALOG,
  TOPIC_LABELS,
  type LearningItem,
  type LearningType,
  type Topic,
  type LearningLevel,
} from "@/lib/learning";
import { SITE } from "@/lib/site";
import { getCoursesSchema } from "@/lib/structured-data";

interface CoursesSearchParams {
  type?: LearningType;
  topic?: Topic;
}

export const Route = createFileRoute("/courses")({
  validateSearch: (search: Record<string, unknown>): CoursesSearchParams => ({
    type: (search["type"] as LearningType) || undefined,
    topic: (search["topic"] as Topic) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Learning Catalog — Project Polaris" },
      {
        name: "description",
        content:
          "Explore interactive workshops, practical mini-courses, cohort bootcamps, and real engineering projects in science, aerospace, and technology.",
      },
      { property: "og:title", content: "Learning Catalog — Project Polaris" },
      {
        property: "og:description",
        content:
          "Practical learning for curious students. Masterclasses, self-paced skills, and hands-on cohorts.",
      },
      { property: "og:url", content: `${SITE_URL}/courses` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/courses` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(getCoursesSchema()),
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const search = useSearch({ from: "/courses" });
  const [selectedType, setSelectedType] = useState<LearningType | "all">(search.type || "all");
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">(search.topic || "all");
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | "all">("all");
  const [activeItemModal, setActiveItemModal] = useState<LearningItem | null>(null);

  const filteredItems = useMemo(() => {
    return LEARNING_CATALOG.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) return false;
      if (selectedTopic !== "all" && !item.topics.includes(selectedTopic)) return false;
      if (selectedLevel !== "all" && item.level !== selectedLevel && item.level !== "all")
        return false;
      return true;
    });
  }, [selectedType, selectedTopic, selectedLevel]);

  return (
    <>
      <PageHeader
        eyebrow="The Polaris Learning Catalog"
        title="Learn science and engineering by doing it."
        lead="Workshops, short courses, bootcamps and projects designed around demonstrable skills and real systems."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="sm"
            className="h-9 px-4 bg-primary text-primary-foreground font-bold font-mono text-xs shadow-sm hover:bg-primary/90 transition-colors"
          >
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join WhatsApp Community
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40"
          >
            <Link to="/resources">Browse Free Resources</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          {/* ── FILTER CONTROLS ── */}
          <ScrollReveal direction="up">
            <div className="p-4 sm:p-6 rounded-2xl border border-white/8 bg-surface/70 backdrop-blur-xl mb-8 space-y-4 font-mono text-xs">
              {/* Type Filter */}
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2 font-bold">
                  Learning Format
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "All Formats" },
                    { id: "workshop", label: "Workshops (60–90m)" },
                    { id: "course", label: "Mini-Courses (2–7h)" },
                    { id: "bootcamp", label: "Bootcamps (3–6w)" },
                    { id: "project", label: "Projects & Labs" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedType(f.id as LearningType | "all")}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        selectedType === f.id
                          ? "bg-primary text-background font-bold"
                          : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/6"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic & Level Filter */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/6">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2 font-bold">
                    Domain / Topic
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTopic("all")}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                        selectedTopic === "all"
                          ? "bg-foreground text-background font-bold"
                          : "bg-surface-2 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All Domains
                    </button>
                    {(Object.keys(TOPIC_LABELS) as Topic[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTopic(key)}
                        className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                          selectedTopic === key
                            ? "bg-foreground text-background font-bold"
                            : "bg-surface-2 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {TOPIC_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2 font-bold">
                    Difficulty Level
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl as LearningLevel | "all")}
                        className={`px-2.5 py-1 rounded-md text-[11px] capitalize transition-colors ${
                          selectedLevel === lvl
                            ? "bg-gold text-background font-bold"
                            : "bg-surface-2 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── CATALOG CARDS GRID ── */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 font-mono">
            {filteredItems.map((item, idx) => (
              <ScrollReveal key={item.id} direction="up" delay={idx * 30}>
                <article className="p-6 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    {/* Badge & Duration Header */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>{item.duration}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-foreground">{item.title}</h3>
                    {item.subtitle && (
                      <p className="mt-1 text-xs text-primary/80 font-body">{item.subtitle}</p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground font-body leading-relaxed">
                      {item.description}
                    </p>

                    {/* Instructor / Mentor Tag if Present */}
                    {item.instructor && (
                      <div className="mt-3 p-2 rounded-lg bg-surface-2/60 border border-white/6 text-[11px] font-body text-muted-foreground flex items-center justify-between">
                        <span>
                          Lead: <strong className="text-foreground">{item.instructor.name}</strong>
                        </span>
                        <span className="text-primary text-[10px] font-mono">
                          {item.instructor.org}
                        </span>
                      </div>
                    )}

                    {/* Key Outcomes Preview */}
                    <div className="mt-4 pt-3 border-t border-white/6 space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                        What you learn & build:
                      </span>
                      {item.outcomes.slice(0, 2).map((out) => (
                        <div
                          key={out}
                          className="flex items-start gap-1.5 text-[11px] font-body text-foreground/90"
                        >
                          <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveItemModal(item)}
                      className="text-primary hover:text-foreground font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Syllabus & Info</span>
                      <ChevronRight className="size-3" />
                    </button>

                    <Button
                      asChild
                      size="sm"
                      className="h-8 px-3.5 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg"
                    >
                      <a
                        href={item.link || SITE.communityUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1"
                      >
                        <span>{item.ctaText || "Enroll"}</span>
                        <ArrowUpRight className="size-3 text-primary" />
                      </a>
                    </Button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 p-8 rounded-2xl border border-white/8 bg-surface-2/30 font-mono">
              <p className="text-sm text-muted-foreground">
                No learning items match the selected filters.
              </p>
              <Button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedTopic("all");
                  setSelectedLevel("all");
                }}
                variant="outline"
                size="sm"
                className="mt-4 text-xs font-mono"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── SYLLABUS & DETAILS MODAL ── */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto font-mono">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-surface p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-mono"
            >
              ✕ Close
            </button>

            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase text-[10px]">
                {activeItemModal.type}
              </span>
              <span className="text-muted-foreground">{activeItemModal.duration}</span>
              <span className="text-white/20">•</span>
              <span className="text-gold capitalize">{activeItemModal.level}</span>
            </div>

            <h3 className="text-2xl font-bold font-display text-foreground">
              {activeItemModal.title}
            </h3>
            {activeItemModal.subtitle && (
              <p className="text-xs text-primary/80 font-body mt-1">{activeItemModal.subtitle}</p>
            )}

            <p className="mt-3 text-xs text-muted-foreground font-body leading-relaxed">
              {activeItemModal.description}
            </p>

            {/* Instructor Details */}
            {activeItemModal.instructor && (
              <div className="mt-4 p-3 rounded-xl bg-surface-2 border border-white/6 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    Instructor / Mentor
                  </span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {activeItemModal.instructor.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {activeItemModal.instructor.role} ({activeItemModal.instructor.org})
                  </span>
                </div>
                {activeItemModal.instructor.linkedin && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] border-white/10"
                  >
                    <a href={activeItemModal.instructor.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            )}

            {/* Syllabus */}
            {activeItemModal.syllabus && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase text-foreground mb-2">
                  Detailed Syllabus
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeItemModal.syllabus.map((s) => (
                    <div
                      key={s.title}
                      className="p-2.5 rounded-lg bg-surface-2/60 border border-white/6 text-xs"
                    >
                      <p className="font-bold text-foreground">{s.title}</p>
                      <p className="text-[11px] text-muted-foreground font-body mt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Agenda (Workshops) */}
            {activeItemModal.agenda && activeItemModal.agenda.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase text-foreground mb-2">
                  Session Agenda Breakdown
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeItemModal.agenda.map((a) => (
                    <div
                      key={a.title}
                      className="p-2.5 rounded-lg bg-surface-2/60 border border-white/6 text-xs"
                    >
                      <p className="font-bold text-foreground">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground font-body mt-0.5">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Capstone Final Project */}
            {activeItemModal.finalProject && (
              <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                <span className="text-[10px] text-primary font-bold uppercase block">
                  Final Engineering Artifact
                </span>
                <span className="font-bold text-foreground mt-0.5 block">
                  {activeItemModal.finalProject.title}
                </span>
                <p className="text-[11px] text-muted-foreground font-body mt-1">
                  {activeItemModal.finalProject.desc}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between">
              <Button
                onClick={() => setActiveItemModal(null)}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Back to Catalog
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 px-5 bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:bg-primary/90 transition-colors"
              >
                <a
                  href={activeItemModal.link || SITE.communityUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {activeItemModal.ctaText || "Enroll Now"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
