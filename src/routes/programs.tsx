import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, CheckCircle2, ExternalLink, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
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
        title="Six programs. One idea: apply what you learn."
        lead="Every program exists because something was missing. Each one is designed to be joined, not just read about."
      />

      {/* CONDUCTED WORKSHOPS SPOTLIGHT */}
      <section className="section border-b border-border bg-surface/30">
        <div className="shell">
          <SectionHeader
            eyebrow="Proven Impact"
            title="Conducted Workshops & Masterclasses"
            lead="Real sessions delivered by scientists from ISRO, aerospace propulsion engineers, and astronomy educators."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {WORKSHOPS.map((w, i) => (
              <article
                key={w.id}
                className="card-elevated flex flex-col justify-between p-7 md:p-8 border border-border bg-card transition-all duration-300 hover:border-primary/40"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 90}ms both` }}
              >
                <div>
                  <div className="font-ui flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold text-primary tracking-wider uppercase">
                      {w.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                      <Calendar className="size-3.5 text-primary" />
                      <span>{w.date}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-foreground leading-snug">
                    {w.title}
                  </h3>

                  {/* Mentor details */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3">
                    <div>
                      <p className="font-display font-bold text-sm text-foreground">{w.mentor}</p>
                      <p className="font-ui text-xs text-primary font-medium">{w.mentorTitle}</p>
                      <p className="text-[11px] text-muted-foreground">{w.mentorOrg}</p>
                    </div>
                    {w.linkedin ? (
                      <a
                        href={w.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-primary transition-colors"
                        aria-label={`${w.mentor} LinkedIn`}
                      >
                        <Linkedin className="size-4" />
                      </a>
                    ) : null}
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {w.summary}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-border pt-4">
                    <p className="font-ui text-[11px] font-bold text-foreground uppercase tracking-wider">
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

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-ui">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
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
            ))}
          </div>
        </div>
      </section>

      {/* SIX CORE PROGRAMS */}
      <section className="section">
        <div className="shell space-y-6">
          <SectionHeader
            eyebrow="Framework"
            title="Six core pathways for builders"
            lead="Explore all active Polaris tracks — from student builds to research initiatives."
          />

          {PROGRAMS.map((program, i) => (
            <article
              key={program.slug}
              id={program.slug}
              className="card-elevated scroll-mt-24 p-7 md:p-10 transition-all duration-300 hover:border-primary/40"
              style={{ animation: `fade-in-up 500ms ease-out ${i * 80}ms both` }}
            >
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <span className="font-ui text-xs font-bold text-primary tracking-wider">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-2xl md:text-3xl font-display font-bold text-foreground">{program.name}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{program.blurb}</p>
                  <Button asChild variant="outline" size="sm" className="mt-7 rounded-full border-primary/30 hover:bg-primary/10">
                    <Link to="/get-involved" className="flex items-center gap-1.5">
                      <span>Get Involved & Apply</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>

                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="eyebrow-muted mb-2">Purpose</dt>
                    <dd className="text-sm text-muted-foreground leading-relaxed">{program.purpose}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-muted mb-2">Who it's for</dt>
                    <dd className="text-sm text-muted-foreground leading-relaxed">{program.who}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-muted mb-2">Typical experience</dt>
                    <dd className="text-sm text-muted-foreground leading-relaxed">{program.experience}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-muted mb-2">What you gain</dt>
                    <dd>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {program.gain.map((g) => (
                          <li key={g} className="flex gap-2 items-center">
                            <span aria-hidden="true" className="text-primary font-bold">
                              •
                            </span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell max-w-3xl">
          <p className="eyebrow mb-5">Recognition</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Contribution is meant to lead somewhere</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            We recognise the people who show up and do the work. Recognition is structured, not
            arbitrary — and it grows with what you contribute.
          </p>
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {RECOGNITION.map((item) => (
              <li
                key={item}
                className="font-ui rounded-full border border-amber-500/40 bg-amber-500/5 px-4 py-2 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/15"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

