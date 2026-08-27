import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { getPrograms, INITIAL_PAST_SESSIONS, type ProgramEvent } from "@/lib/cms-store";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Users,
  Mic,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Masterclasses — Project Polaris" },
      {
        name: "description",
        content:
          "Explore active live workshops, astronomy masterclasses, volunteer cohorts, and past session history at Project Polaris.",
      },
      { property: "og:title", content: "Programs & Masterclasses — Project Polaris" },
      {
        property: "og:description",
        content:
          "Join active workshops with ISRO scientists, astronomy cohorts, and explore past session archives.",
      },
      { property: "og:url", content: "https://projectpolaris.in/programs" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/programs" }],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const programs = getPrograms();
  const [selectedTab, setSelectedTab] = useState<"active" | "past">("active");

  return (
    <>
      {/* ── 1. PROGRAMS HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        <div className="shell max-w-4xl mx-auto text-center space-y-4 font-sans">
          <ScrollReveal direction="up">
            <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-2">
              Learning Cohorts
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              Programs & Opportunities
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore active live masterclasses with scientists, student volunteer initiatives, and past session archives.
            </p>
          </ScrollReveal>

          {/* Tab Switcher */}
          <div className="pt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTab("active")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                selectedTab === "active"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              Active & Upcoming Programs
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("past")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                selectedTab === "past"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              Past Events Archive ({INITIAL_PAST_SESSIONS.length})
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. ACTIVE PROGRAMS LIST ── */}
      {selectedTab === "active" && (
        <section className="section">
          <div className="shell space-y-6 font-sans">
            <div className="grid gap-6 md:grid-cols-2">
              {programs.map((prog, idx) => {
                const isComingSoon = prog.status === "coming-soon";
                return (
                  <ScrollReveal key={prog.id} direction="up" delay={idx * 40}>
                    <div className="p-6 md:p-7 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                              isComingSoon
                                ? "bg-white/6 text-muted-foreground border border-white/10"
                                : "bg-primary/10 text-primary border border-primary/20"
                            }`}
                          >
                            {prog.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">{prog.date}</span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                            {prog.title}
                          </h3>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {prog.subtitle}
                          </p>
                        </div>

                        {prog.speaker && (
                          <div className="p-3 rounded-lg bg-surface-2 border border-white/6 flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              <Mic className="size-4" />
                            </div>
                            <div className="text-xs">
                              <div className="font-semibold text-foreground">{prog.speaker.name}</div>
                              <div className="text-[11px] text-muted-foreground">{prog.speaker.designation}</div>
                            </div>
                          </div>
                        )}

                        {prog.benefits && prog.benefits.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                              What's Included
                            </span>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                              {prog.benefits.map((b) => (
                                <li key={b} className="flex items-center gap-2">
                                  <CheckCircle className="size-3 text-primary shrink-0" />
                                  <span className="text-foreground/90">{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/6 flex items-center justify-between text-xs">
                        <span className="text-primary font-semibold font-mono">{prog.price || "Free & Open"}</span>
                        {isComingSoon ? (
                          <Button size="sm" variant="outline" disabled className="h-8 text-xs border-white/10 opacity-70">
                            Coming Soon
                          </Button>
                        ) : prog.ctaUrl.startsWith("http") ? (
                          <Button asChild size="sm" className="h-8 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                            <a href={prog.ctaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                              <span>{prog.ctaText}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          </Button>
                        ) : (
                          <Button asChild size="sm" className="h-8 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                            <Link to={prog.ctaUrl}>
                              <span>{prog.ctaText}</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. PAST EVENTS ARCHIVE ── */}
      {selectedTab === "past" && (
        <section className="section">
          <div className="shell space-y-6 font-sans">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Historical Archive
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Past Sessions & Workshops
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                A chronological record of our expert sessions, ISRO career masterclasses, and astronomy workshops.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {INITIAL_PAST_SESSIONS.map((session, idx) => (
                <ScrollReveal key={session.id} direction="up" delay={idx * 30}>
                  <article className="p-6 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold text-[10px]">
                          {session.date}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{session.participants}</span>
                      </div>

                      <h3 className="text-lg font-bold font-display text-foreground">
                        {session.title}
                      </h3>

                      <div className="p-3 rounded-lg bg-surface-2 border border-white/6 text-xs">
                        <div className="font-semibold text-primary">{session.speaker}</div>
                        <div className="text-[11px] text-muted-foreground">{session.designation}</div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {session.summary}
                      </p>

                      <div className="text-[11px] text-foreground/80 font-medium pt-1">
                        Topic: {session.topic}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Project Polaris Archive</span>
                      <span className="text-emerald-400 font-medium">Completed</span>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
