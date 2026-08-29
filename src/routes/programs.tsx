import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import {
  getPrograms,
  getIndustrySprints,
  getPastSessions,
  saveUserSubmission,
  type ProgramEvent,
  type IndustrySprintProject,
  type PastSession,
} from "@/lib/cms-store";
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
  Cpu,
  Layers,
  Award,
  BookOpen,
  Code,
  ShieldCheck,
  Linkedin,
  X,
} from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Remote Industry Sprints — Project Polaris" },
      {
        name: "description",
        content:
          "Collaborate on remote industry-standard projects across Aerospace, Astrophysics, CSE & Systems Engineering with scientist mentorship and verified credits.",
      },
      { property: "og:title", content: "Programs & Remote Industry Sprints — Project Polaris" },
      {
        property: "og:description",
        content:
          "Join active workshops with ISRO scientists, remote collaborative industry sprints, and earn verified project credentials.",
      },
      { property: "og:url", content: "https://projectpolaris.in/programs" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/programs" }],
  }),
  component: ProgramsPage,
});

const DOMAIN_FILTERS = [
  "All Domains",
  "Aerospace & Rocketry",
  "Astrophysics & Space Science",
  "CSE & AI for Science",
  "Mechanical & Systems",
] as const;

function ProgramsPage() {
  const programs = getPrograms();
  const industrySprints = getIndustrySprints();
  const pastSessions = getPastSessions();
  const [selectedTab, setSelectedTab] = useState<"sprints" | "active" | "past">("active");
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [activeSprintModal, setActiveSprintModal] = useState<IndustrySprintProject | null>(null);

  const filteredSprints = industrySprints.filter((sprint) => {
    if (selectedDomain === "All Domains") return true;
    return sprint.domain === selectedDomain;
  });

  return (
    <>
      {/* ── 1. PROGRAMS HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        <div className="shell max-w-4xl space-y-4 font-sans text-left">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              Programs & Workshops
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Explore live expert masterclasses with scientists, hands-on experiential workshops, student research projects, and past session archives.
            </p>
          </ScrollReveal>

          {/* Primary View Switcher */}
          <div className="pt-6 flex flex-wrap justify-start gap-2">
            <button
              type="button"
              onClick={() => setSelectedTab("active")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 active:scale-[0.97] ${
                selectedTab === "active"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              <Calendar className="size-3.5" />
              <span>Live Masterclasses & Workshops</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("sprints")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 active:scale-[0.97] ${
                selectedTab === "sprints"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              <Cpu className="size-3.5" />
              <span>Project Cohorts & Sprints</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("past")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 active:scale-[0.97] ${
                selectedTab === "past"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>Past Archive ({pastSessions.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. REMOTE INDUSTRY SPRINTS SECTION (FLAGSHIP COLLABORATIVE TRACK) ── */}
      {selectedTab === "sprints" && (
        <section className="section font-sans space-y-12">
          <div className="shell space-y-8">
            {/* Value Proposition Callout */}
            <div className="p-6 md:p-8 rounded-2xl border border-primary/25 bg-card relative overflow-hidden">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-center">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-semibold">
                    <Sparkles className="size-3.5" />
                    <span>Remote Collaborative Industry Labs</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-snug">
                    Work on Real Industry Briefs. Build in Squads. Get Mentored.
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instead of generic tutorials, Polaris delivers authentic problem statements from aerospace, computational physics, and systems engineering. Form remote squads with curious peers or work solo, receive direct weekly code/physics reviews from mentors, and graduate with verified digital credentials and showcase credits.
                  </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-surface-2 border border-white/6 space-y-1">
                    <span className="font-bold text-primary font-mono text-[11px] block">01. Industry Briefs</span>
                    <span className="text-muted-foreground text-[11px]">Real math & physics constraints</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-2 border border-white/6 space-y-1">
                    <span className="font-bold text-primary font-mono text-[11px] block">02. Remote Squads</span>
                    <span className="text-muted-foreground text-[11px]">Collaborate with 2–4 peers</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-2 border border-white/6 space-y-1">
                    <span className="font-bold text-primary font-mono text-[11px] block">03. Expert Mentorship</span>
                    <span className="text-muted-foreground text-[11px]">Code, CFD & math critique</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-2 border border-white/6 space-y-1">
                    <span className="font-bold text-primary font-mono text-[11px] block">04. Verified Credits</span>
                    <span className="text-muted-foreground text-[11px]">Digital certificates & spotlight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Explore Sprints by Domain
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {DOMAIN_FILTERS.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedDomain === domain
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            {/* Sprints Catalog Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredSprints.map((sprint, idx) => (
                <ScrollReveal key={sprint.id} direction="up" delay={idx * 30}>
                  <article className="p-6 md:p-7 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors space-y-5">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] font-mono text-primary font-medium">
                          {sprint.domain}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                          <span className="text-emerald-400">{sprint.difficulty}</span>
                          <span>•</span>
                          <span>{sprint.sprintDuration}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                          {sprint.title}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {sprint.overview}
                        </p>
                      </div>

                      {/* Mentorship & Review Cadence Box */}
                      <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/6 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-primary text-[11px]">
                            Mentorship & Review
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {sprint.mentorship.reviewCadence}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Led by {sprint.mentorship.lead} ({sprint.mentorship.role})
                        </p>
                      </div>

                      {/* Skills Gained */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sprint.skillsGained.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-white/4 border border-white/8 text-[10px] text-muted-foreground font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/6 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-foreground/80 font-medium">
                          {sprint.tier}
                        </span>
                        <span className="text-primary font-semibold font-mono">
                          {sprint.price || "Open"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => setActiveSprintModal(sprint)}
                          size="sm"
                          className="flex-1 h-9 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
                        >
                          <span>View Sprint Details & Apply</span>
                          <ArrowRight className="size-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. ACTIVE LIVE MASTERCLASSES & WORKSHOPS ── */}
      {selectedTab === "active" && (
        <section className="section font-sans">
          <div className="shell space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {programs.map((prog, idx) => {
                const isComingSoon = prog.status === "coming-soon";
                return (
                  <ScrollReveal key={prog.id} direction="up" delay={idx * 40}>
                    <div className="p-6 md:p-7 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                          <span>{prog.date}</span>
                          {prog.mode && <span className="text-[11px] text-muted-foreground/80">{prog.mode}</span>}
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
                        <span className="text-primary font-semibold font-mono">{prog.price || "TBD"}</span>
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

      {/* ── 4. PAST SESSIONS ARCHIVE ── */}
      {selectedTab === "past" && (
        <section className="section font-sans">
          <div className="shell space-y-6">
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Past Sessions & Workshops
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                A chronological record of our expert sessions, career masterclasses, and astronomy workshops.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {pastSessions.map((session, idx) => (
                <ScrollReveal key={session.id} direction="up" delay={idx * 30}>
                  <article className="p-6 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span className="text-[11px] font-medium text-primary">
                          {session.date}
                        </span>
                        <span className="text-[11px]">{session.participants}</span>
                      </div>

                      <h3 className="text-lg font-bold font-display text-foreground">
                        {session.title}
                      </h3>

                      <div className="p-3 rounded-lg bg-surface-2 border border-white/6 text-xs flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-primary">{session.speaker}</div>
                          <div className="text-[11px] text-muted-foreground">{session.designation}</div>
                        </div>
                        {session.speakerLinkedin && (
                          <a
                            href={session.speakerLinkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md bg-white/5 hover:bg-primary/20 text-primary transition-colors text-[11px] flex items-center gap-1 shrink-0"
                            title="Speaker LinkedIn Profile"
                          >
                            <Linkedin className="size-3.5" />
                            <span className="hidden sm:inline">LinkedIn</span>
                          </a>
                        )}
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

      {/* ── Sprint Application & Details Modal ── */}
      {activeSprintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[88vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase text-[10px]">
                {activeSprintModal.domain}
              </span>
              <button
                type="button"
                onClick={() => setActiveSprintModal(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-display text-foreground">
                {activeSprintModal.title}
              </h2>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2 font-mono">
                <span>{activeSprintModal.sprintDuration}</span>
                <span>•</span>
                <span>{activeSprintModal.teamSize}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/6">
              <div>
                <span className="text-[10px] uppercase font-semibold text-primary block mb-1">
                  The Industry Challenge
                </span>
                <p className="text-xs leading-relaxed">{activeSprintModal.industryProblem}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-foreground block mb-1">
                  Expected Sprint Deliverables
                </span>
                <ul className="space-y-1.5 text-xs text-foreground/90 font-medium">
                  {activeSprintModal.deliverables.map((del) => (
                    <li key={del} className="flex items-start gap-2">
                      <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-primary block">
                  Mentorship & Review Format
                </span>
                <p className="text-xs text-foreground/90 font-medium">
                  {activeSprintModal.mentorship.lead} ({activeSprintModal.mentorship.role}) conducts{" "}
                  {activeSprintModal.mentorship.reviewCadence}.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-primary block">
                  Credits & Verified Recognition
                </span>
                <p className="text-xs text-foreground/90 font-medium">
                  {activeSprintModal.credits}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/8 flex flex-wrap justify-between items-center gap-3">
              <Button onClick={() => setActiveSprintModal(null)} variant="outline" size="sm" className="text-xs">
                Close
              </Button>
              <Button asChild size="sm" className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs">
                <a href="https://tally.so/r/LZL56l" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                  <span>Register for Sprint Squad ↗</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
