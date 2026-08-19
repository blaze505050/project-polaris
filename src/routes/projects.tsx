import { createFileRoute, Link } from "@tanstack/react-router";
import { Hammer, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { PROJECTS } from "@/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Project Polaris" },
      {
        name: "description",
        content:
          "Student-built Polaris projects: a CanSat prototype, an open sky atlas, a research digest and a schools outreach kit. Progress updates published here.",
      },
      { property: "og:title", content: "Projects — Project Polaris" },
      {
        property: "og:description",
        content:
          "Real things our students are building, from CanSat hardware to open research tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Project Polaris Projects",
          url: "https://projectpolaris.in/projects",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: PROJECTS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "CreativeWork",
                name: p.name,
                description: p.blurb,
                creator: { "@type": "Organization", name: "Project Polaris" },
              },
            })),
          },
        }),
      },
    ],
  }),
  component: Projects,
});

const ARC = [
  { step: "Scope", note: "A real problem, narrowed to something a small team can finish." },
  { step: "Build", note: "Weekly working sessions with mentor check-ins." },
  { step: "Test", note: "It has to actually work, not just look finished." },
  { step: "Showcase", note: "Presented to the community and documented publicly." },
];

function Projects() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things our students are actually building."
        lead="Small teams, real constraints, finished artefacts. These are the projects currently in motion — detailed write-ups and results will be published here as they progress."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
            <Link to="/join">Join a project team</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/opportunities">See open roles</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Current builds"
            title="Four projects in motion"
            lead="Every project is student-led with mentor support. Updates land on this page."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <article
                key={p.slug}
                className={`card-elevated flex flex-col p-7 md:p-8 justify-between ${
                  "featured" in p && p.featured ? "border-primary/50 bg-gradient-to-b from-primary/10 via-surface/80 to-surface-2/90 shadow-xl shadow-primary/5 md:col-span-2" : ""
                }`}
                style={{ animation: `fade-in-up 500ms ease-out ${i * 100}ms both` }}
              >
                <div>
                  <div className="font-ui flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={
                        p.stage.includes("Active") || p.stage === "In progress"
                          ? "inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary font-semibold"
                        : "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-muted-foreground"
                      }
                    >
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                      <span>{p.stage}</span>
                    </span>
                    <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted-foreground font-mono text-[11px]">{p.team}</span>
                    {"featured" in p && p.featured && (
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-amber-400 font-mono text-[10px] uppercase font-bold">
                        ★ Flagship Environment
                      </span>
                    )}
                  </div>
                  <h2 className="mt-5 text-2xl font-display font-bold text-foreground">{p.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    {"featured" in p && p.featured ? "40+ Solvers • WebGL 3D" : "Status: Active Development"}
                  </span>
                  {"link" in p && p.link ? (
                    <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md">
                      <Link to={p.link} className="flex items-center gap-1.5">
                        <span>{"cta" in p && p.cta ? p.cta : "Explore Project"}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Link to="/get-involved" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                      <span>Collaborate</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <p className="eyebrow mb-5">How a project runs</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold text-foreground">Scope, build, test, showcase.</h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {ARC.map((a, i) => (
              <li key={a.step} className="bg-background p-7 hover:bg-surface transition-colors">
                <span className="font-ui text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-display font-bold text-foreground">{a.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell max-w-2xl text-center">
          <Hammer className="mx-auto size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-6 text-3xl md:text-4xl font-display font-bold text-foreground">Have a project idea?</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            If you can describe the problem, we can help you find the team to build it.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full shadow-md">
              <Link to="/contact">Pitch your idea</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/get-involved">Mentor a team</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

