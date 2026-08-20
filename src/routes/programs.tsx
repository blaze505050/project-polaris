import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, CheckCircle2, ExternalLink, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PROGRAMS, RECOGNITION, SITE, WORKSHOPS } from "@/lib/site";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Project Polaris" },
      {
        name: "description",
        content:
          "Research, workshops, community learning, innovation projects, mentorship and events — the six programs students work through at Project Polaris.",
      },
      { property: "og:title", content: "Programs — Project Polaris" },
      {
        property: "og:description",
        content:
          "Programs: workshops, community learning, innovation projects, mentorship, events, and upcoming research.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Project Polaris Programs",
          itemListElement: PROGRAMS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Course",
              name: p.name,
              description: p.blurb,
              url: "https://projectpolaris.in/programs",
              provider: {
                "@type": "EducationalOrganization",
                name: "Project Polaris",
                url: "https://projectpolaris.in",
              },
            },
          })),
        }),
      },
    ],
  }),
  component: Programs,
});

function Programs() {
  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Six pathways. One model: apply what you learn."
        lead="Every program is built to turn passive textbook theory into verifiable engineering and research capability."
      />

      {/* CONDUCTED WORKSHOPS SPOTLIGHT */}
      <section className="section border-b border-border bg-surface/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Masterclass Archive"
            title="Conducted Workshops & Industry Sessions"
            lead="Technical deep-dives led by scientists from ISRO, aerospace propulsion researchers, and astronomy educators."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {WORKSHOPS.map((w, i) => (
              <ScrollReveal key={w.id} direction="up" delay={i * 80}>
                <article className="card-premium flex flex-col justify-between p-6 md:p-7 h-full">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-4">
                      <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-primary font-semibold">
                        {w.tag}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                        <Calendar className="size-3 text-primary" />
                        <span>{w.date}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground leading-snug">
                      {w.title}
                    </h3>

                    {/* Mentor details */}
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3">
                      <div>
                        <p className="font-semibold text-xs text-foreground">{w.mentor}</p>
                        <p className="font-mono text-[11px] text-primary">{w.mentorTitle}</p>
                        <p className="text-[11px] text-muted-foreground">{w.mentorOrg}</p>
                      </div>
                      {w.linkedin ? (
                        <a
                          href={w.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-1.5 text-muted-foreground hover:text-primary transition-colors"
                          aria-label={`${w.mentor} LinkedIn`}
                        >
                          <Linkedin className="size-3.5" />
                        </a>
                      ) : null}
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                      {w.summary}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-border pt-4">
                      <p className="text-[11px] font-mono font-semibold text-foreground uppercase tracking-wider">
                        Key Takeaways:
                      </p>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {w.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      Archived Session
                    </span>
                    <a
                      href={SITE.communityUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Discussion</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SIX CORE PROGRAMS */}
      <section className="section">
        <div className="shell space-y-6">
          <SectionHeader
            eyebrow="Framework"
            title="Six core pathways for student engineers"
            lead="Explore active Polaris tracks — from student builds to research initiatives."
          />

          <div className="space-y-6 mt-8">
            {PROGRAMS.map((program, i) => (
              <ScrollReveal key={program.slug} direction="up" delay={i * 60}>
                <article
                  id={program.slug}
                  className="card-premium scroll-mt-24 p-6 md:p-8"
                >
                  <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-2 text-2xl font-bold text-foreground">{program.name}</h2>
                      <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">{program.blurb}</p>
                      <Button asChild variant="outline" size="sm" className="mt-6 h-8 text-xs">
                        <Link to="/get-involved" className="flex items-center gap-1.5">
                          <span>Get Involved</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    </div>

                    <dl className="grid gap-5 sm:grid-cols-2 text-xs">
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Purpose</dt>
                        <dd className="text-muted-foreground leading-relaxed">{program.purpose}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Target Audience</dt>
                        <dd className="text-muted-foreground leading-relaxed">{program.who}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Cadence & Format</dt>
                        <dd className="text-muted-foreground leading-relaxed">{program.experience}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Verified Outcomes</dt>
                        <dd>
                          <ul className="space-y-1 text-muted-foreground">
                            {program.gain.map((g) => (
                              <li key={g} className="flex gap-2 items-center">
                                <span className="text-primary font-bold">•</span>
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Recognition & Trajectory</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Contribution is designed to lead somewhere</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We recognise students who commit code, run simulations, and lead workshops. Trajectories are verified, public, and portfolio-ready.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {RECOGNITION.map((item) => (
                <li
                  key={item}
                  className="font-mono text-xs rounded-md border border-border bg-surface-2 px-3 py-1.5 text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
