import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Hammer,
  Sparkles,
  ArrowRight,
  Rocket,
  Cpu,
  Bot,
  Compass,
  Radio,
  BookOpen,
  SunMedium,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import { PROJECTS } from "@/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Innovation Labs — Project Polaris" },
      {
        name: "description",
        content:
          "Student-built Polaris engineering projects and research platforms: AeroForge AI Lab, Orbital Telemetry Hub, Sky Atlas, Polaris AI, Research Digest, and more.",
      },
      { property: "og:title", content: "Projects & Innovation Labs — Project Polaris" },
      {
        property: "og:description",
        content:
          "Real things our students are building — from interactive aerospace simulators to orbital telemetry hubs and AI learning companions.",
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
  {
    step: "Scope",
    note: "A real problem narrowed down to a concrete deliverable a small team can research and solve.",
  },
  {
    step: "Build",
    note: "Weekly agile sprint sessions with mentorship from domain experts and practitioners.",
  },
  {
    step: "Test",
    note: "Validation with numerical solvers, simulation test rigs, or peer peer-review protocols.",
  },
  {
    step: "Showcase",
    note: "Open-sourced and presented to the broader student community with reproducible documentation.",
  },
];

const PROJECT_ICONS: Record<string, typeof Rocket> = {
  "aeroforge-ai": Rocket,
  "orbital-telemetry": Radio,
  "sky-atlas": Compass,
  "schools-outreach-kit": Layers,
  "polaris-ai": Bot,
  "research-digest": BookOpen,
  "space-weather-dashboard": SunMedium,
};

function Projects() {
  const activeProjects = PROJECTS.filter((p) => p.stage.includes("Active") || p.stage === "In progress");
  const upcomingProjects = PROJECTS.filter((p) => !p.stage.includes("Active") && p.stage !== "In progress");

  return (
    <>
      <PageHeader
        eyebrow="Innovation & R&D"
        title="Things our students are actually building."
        lead="Small teams, real constraints, finished artefacts. From full-scale aerospace simulation platforms to satellite hardware prototypes and AI learning companions."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none px-6">
            <Link to="/join">Join a project team</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/opportunities">See open roles</Link>
          </Button>
        </div>
      </PageHeader>

      {/* ACTIVE & FLAGSHIP BUILDS */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Active Builds"
            title="Projects currently in development"
            lead="Every initiative is student-driven with mentor guidance. Explore our active platforms below."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {activeProjects.map((p, i) => {
              const Icon = PROJECT_ICONS[p.slug] || Cpu;
              const isFlagship = "featured" in p && p.featured;

              return (
                <article
                  key={p.slug}
                  className={`card-elevated flex flex-col justify-between p-7 md:p-8 relative overflow-hidden ${
                    isFlagship
                      ? "md:col-span-2 border-primary/50 bg-gradient-to-b from-primary/10 via-surface/80 to-surface-2/90 shadow-2xl shadow-primary/10"
                      : "border-border hover:border-primary/40 transition-all duration-300"
                  }`}
                  style={{ animation: `fade-in-up 500ms ease-out ${i * 100}ms both` }}
                >
                  <div>
                    <div className="font-ui flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary font-semibold">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span>{p.stage}</span>
                      </span>
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted-foreground font-mono text-[11px]">
                        {p.team}
                      </span>
                      {isFlagship && (
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-amber-400 font-mono text-[10px] uppercase font-bold">
                          ★ Flagship Platform
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">{p.name}</h2>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-border flex items-center justify-between flex-wrap gap-4">
                    <span className="text-xs text-muted-foreground font-mono">
                      {isFlagship ? "40+ Numerical Solvers • CFD Aerodynamics • Orbital Engine" : "Status: Active Sprint"}
                    </span>
                    {"link" in p && p.link ? (
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-md hover:opacity-90 border-none"
                      >
                        <Link to={p.link} className="flex items-center gap-1.5">
                          <span>{"cta" in p && p.cta ? p.cta : "Explore Project"}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link to="/get-involved" className="flex items-center gap-1.5 text-xs">
                          <span>Collaborate</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* INTERACTIVE AEROFORGE SANDBOX DEMO */}
          <div className="mt-14">
            <div className="mb-6 text-center max-w-xl mx-auto">
              <span className="eyebrow block mb-2">Live Demo Environment</span>
              <h3 className="text-2xl font-display font-bold text-foreground">
                Try AeroForge AI in Your Browser
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                A preview of our interactive numerical aerodynamics solver.
              </p>
            </div>
            <InteractiveAeroForgeDemo />
          </div>
        </div>
      </section>

      {/* UPCOMING & R&D INITIATIVES */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Future Pipeline"
            title="Upcoming Projects & R&D Initiatives"
            lead="New ideas entering our incubation and scoping pipelines. Interested students can apply to lead or join early sprint teams."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingProjects.map((p, i) => {
              const Icon = PROJECT_ICONS[p.slug] || Sparkles;
              const isComingSoon = p.stage === "Coming soon";

              return (
                <article
                  key={p.slug}
                  className="card-elevated flex flex-col justify-between p-7 border border-border hover:border-primary/40 transition-all duration-300 group"
                  style={{ animation: `fade-in-up 500ms ease-out ${i * 100}ms both` }}
                >
                  <div>
                    <div className="font-ui flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                          isComingSoon
                            ? "border border-sky-500/40 bg-sky-500/10 text-sky-400"
                            : "border border-border bg-surface-2 text-muted-foreground"
                        }`}
                      >
                        <Clock className="size-3" />
                        <span>{p.stage}</span>
                      </span>
                      <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-muted-foreground font-mono text-[10px]">
                        {p.team}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-foreground">{p.name}</h3>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Status: Incubating</span>
                    <Link
                      to="/get-involved"
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Join Early Team</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW A PROJECT RUNS */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <p className="eyebrow mb-5">How a project runs</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold text-foreground">
            Scope, build, test, showcase.
          </h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {ARC.map((a, i) => (
              <li key={a.step} className="bg-background p-7 hover:bg-surface transition-colors">
                <span className="font-ui text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-display font-bold text-foreground">{a.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PITCH AN IDEA */}
      <section className="section border-t border-border">
        <div className="shell max-w-2xl text-center">
          <Hammer className="mx-auto size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-6 text-3xl md:text-4xl font-display font-bold text-foreground">Have a project idea?</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            If you can describe the problem, we can help you find the collaborators, mentors, and tools to build it.
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

