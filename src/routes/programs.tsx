import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { PROGRAMS, RECOGNITION } from "@/lib/site";

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

      <section className="section">
        <div className="shell space-y-6">
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
                  <h2 className="mt-3 text-2xl md:text-3xl font-display font-bold text-white">{program.name}</h2>
                  <p className="mt-4 text-slate-300 leading-relaxed">{program.blurb}</p>
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
                    <dd className="text-sm text-slate-300 leading-relaxed">{program.purpose}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-muted mb-2">Who it's for</dt>
                    <dd className="text-sm text-slate-300 leading-relaxed">{program.who}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-muted mb-2">Typical experience</dt>
                    <dd className="text-sm text-slate-300 leading-relaxed">{program.experience}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-muted mb-2">What you gain</dt>
                    <dd>
                      <ul className="space-y-1.5 text-sm text-slate-300">
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Contribution is meant to lead somewhere</h2>
          <p className="mt-5 text-slate-300 leading-relaxed">
            We recognise the people who show up and do the work. Recognition is structured, not
            arbitrary — and it grows with what you contribute.
          </p>
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {RECOGNITION.map((item) => (
              <li
                key={item}
                className="font-ui rounded-full border border-gold/40 bg-gold/5 px-4 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/15"
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

