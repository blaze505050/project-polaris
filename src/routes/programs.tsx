import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Flame,
  Hammer,
  CheckCircle2,
  Users,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { LEARNING_LADDER } from "@/lib/learning";
import { WORKSHOPS, SITE } from "@/lib/site";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Masterclasses — Project Polaris" },
      {
        name: "description",
        content:
          "Explore the Polaris Learning Ladder: live expert-led masterclasses, practical cohorts, intensive bootcamps, and daily scientific curiosity drops.",
      },
      { property: "og:title", content: "Programs & Masterclasses — Project Polaris" },
      {
        property: "og:description",
        content:
          "Practical learning in science and aerospace. Live sessions, masterclasses, and cohort sprints.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Polaris Programs"
        title="The Polaris Learning Ladder."
        lead="Move from discovering a concept to mastering equations, building simulation software, and defending technical research."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-primary text-primary-foreground font-bold font-mono text-xs shadow-sm hover:bg-primary/90 transition-colors">
            <Link to="/courses">Explore Learning Catalog</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join WhatsApp Community
            </a>
          </Button>
        </div>
      </PageHeader>

      {/* ── THE 4-STAGE LEARNING LADDER ── */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Progression Framework"
            title="How Learners Progress Through Polaris"
            lead="No matter your background, you can enter at any step and progress as deep as your ambition takes you."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-mono">
            {LEARNING_LADDER.map((l, i) => (
              <ScrollReveal key={l.title} direction="up" delay={i * 50}>
                <div className="p-6 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-primary font-bold">{l.step}</span>
                      <span className="text-[11px] text-muted-foreground">{l.time}</span>
                    </div>
                    <h3 className="text-lg font-bold font-display text-foreground">{l.title}</h3>
                    <span className="inline-block mt-1 text-[11px] font-bold text-gold">{l.badge}</span>
                    <p className="mt-2 text-xs text-muted-foreground font-body leading-relaxed">
                      {l.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/6">
                    <Button asChild size="sm" variant="ghost" className="w-full justify-between h-8 text-xs font-mono text-primary hover:text-foreground px-1">
                      <Link to={l.to}>
                        <span>Explore {l.title}</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAST & ACTIVE EXPERT MASTERCLASSES ── */}
      <section className="section border-t border-white/8 bg-surface-2/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Expert Sessions"
            title="Masterclasses with ISRO & Aerospace Practitioners"
            lead="Direct exposure to scientists and researchers who actually build space missions and rocket technology."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3 font-mono">
            {WORKSHOPS.map((ws, i) => (
              <ScrollReveal key={ws.id} direction="up" delay={i * 50}>
                <article className="p-6 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                        {ws.tag}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{ws.date}</span>
                    </div>

                    <h3 className="text-base font-bold font-display text-foreground">{ws.title}</h3>
                    
                    <div className="mt-3 p-2.5 rounded-lg bg-surface-2/60 border border-white/6 text-xs font-body text-muted-foreground">
                      <span className="text-foreground font-semibold block">{ws.mentor}</span>
                      <span className="text-[11px] text-primary">{ws.mentorTitle} ({ws.mentorOrg})</span>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground font-body leading-relaxed">
                      {ws.summary}
                    </p>

                    <ul className="mt-4 space-y-1.5 text-[11px] font-body text-foreground/90">
                      {ws.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex items-start gap-1.5">
                          <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs">
                    {ws.linkedin ? (
                      <a href={ws.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:text-foreground text-[11px] flex items-center gap-1">
                        <span>Mentor Profile</span>
                        <ArrowUpRight className="size-2.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Polaris Mentor</span>
                    )}

                    <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs border-white/15 hover:border-primary/40">
                      <Link to="/courses" search={{ type: "workshop" }}>
                        <span>View Workshops</span>
                      </Link>
                    </Button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
