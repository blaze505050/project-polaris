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
          "Student-built Polaris engineering projects and research platforms: AeroForge AI Lab, Sky Atlas, Polaris AI, Research Digest, Space Weather Dashboard, and more.",
      },
      { property: "og:title", content: "Projects & Innovation Labs — Project Polaris" },
      {
        property: "og:description",
        content:
          "Real things our students are building — from interactive aerospace simulators to deep-sky observation logs and AI learning companions.",
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
        title="Student engineering platforms & active builds."
        lead="Small teams, real constraints, reproducible code and models. From browser-based CFD physics solvers to open deep-sky astronomy catalogs."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <Link to="/join">Join a project squad</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <Link to="/opportunities">View open roles</Link>
          </Button>
        </div>
      </PageHeader>

      {/* ACTIVE & FLAGSHIP BUILDS */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Active Builds"
            title="Platforms in production & sprint cycle"
            lead="Every initiative is student-driven with peer review and domain practitioner guidance."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {activeProjects.map((p) => {
              const Icon = PROJECT_ICONS[p.slug] || Cpu;
              const isFlagship = "featured" in p && p.featured;

              return (
                <article
                  key={p.slug}
                  className={`card-premium p-6 md:p-8 flex flex-col justify-between ${
                    isFlagship ? "md:col-span-2 border-primary/40 bg-surface-2/40" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-2 border border-border text-foreground font-semibold">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{p.stage}</span>
                        </span>
                        <span className="text-muted-foreground">{p.team}</span>
                      </div>
                      {isFlagship && (
                        <span className="text-[11px] text-primary font-bold uppercase tracking-wider">
                          ★ Flagship Platform
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="size-10 rounded-md bg-surface-2 border border-border flex items-center justify-center text-primary shrink-0">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{p.name}</h2>
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
                    <span className="text-muted-foreground text-[11px]">
                      {isFlagship ? "40+ Solvers · Supersonic CFD · Orbital Engine" : "Sprint Deliverable"}
                    </span>
                    {"link" in p && p.link ? (
                      <Button asChild size="sm" className="h-8 px-3 text-xs bg-foreground text-background font-medium">
                        <Link to={p.link} className="flex items-center gap-1.5">
                          <span>{"cta" in p && p.cta ? p.cta : "Explore Project"}</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                        <Link to="/get-involved" className="flex items-center gap-1.5">
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

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingProjects.map((p) => {
              const Icon = PROJECT_ICONS[p.slug] || Sparkles;
              const isComingSoon = p.stage === "Coming soon";

              return (
                <article
                  key={p.slug}
                  className="card-premium p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${
                          isComingSoon
                            ? "bg-surface-2 border border-border text-primary font-semibold"
                            : "bg-surface-2 border border-border text-muted-foreground"
                        }`}
                      >
                        <Clock className="size-3" />
                        <span>{p.stage}</span>
                      </span>
                      <span className="text-muted-foreground text-[11px]">{p.team}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-surface-2 border border-border flex items-center justify-center text-primary">
                        <Icon className="size-4" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{p.blurb}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="text-[11px] text-muted-foreground">Incubating</span>
                    <Link
                      to="/get-involved"
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Join Squad</span>
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
      <section className="section border-t border-border">
        <div className="shell">
          <p className="eyebrow mb-3">Project Lifecycle</p>
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Scope, build, test, showcase.
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {ARC.map((a, i) => (
              <li key={a.step} className="p-5 rounded-lg border border-border bg-surface-2/40">
                <span className="text-primary font-bold text-sm block mb-2">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-foreground mb-1">{a.step}</h3>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">{a.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PITCH AN IDEA */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell max-w-2xl text-center mx-auto">
          <Hammer className="mx-auto size-6 text-primary mb-4" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Have a project idea?</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            If you can describe the problem, we can help you assemble the collaborators, mentors, and simulation compute to build it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
              <Link to="/contact">Pitch your idea</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9 px-4">
              <Link to="/get-involved">Mentor a team</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

