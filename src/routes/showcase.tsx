import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProjectSubmissionForm } from "@/components/site/ProjectSubmissionForm";
import {
  SHOWCASE_CATEGORIES,
  SHOWCASE_CATEGORY_LABELS,
  SHOWCASE_STAGE_LABELS,
  showcaseQuery,
  type ShowcaseProject,
} from "@/lib/showcase";

const TITLE = "Student Project Showcase — Project Polaris";
const DESCRIPTION =
  "Explore student-built projects at Project Polaris across hardware, software, research, outreach and design — and submit your own project to be featured.";

const FLAGSHIP: ShowcaseProject[] = [
  {
    id: "cansat-prototype",
    title: "CanSat Prototype",
    category: "hardware",
    summary:
      "A soda-can sized satellite payload with sensors, telemetry and a recovery system, built end to end by students.",
    description: null,
    team: "Innovation team",
    link: null,
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "sky-atlas",
    title: "Sky Atlas",
    category: "software",
    summary:
      "An open, student-maintained observation log and constellation guide built from our night-sky challenges.",
    description: null,
    team: "Research + Tech",
    link: null,
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "polaris-research-digest",
    title: "Polaris Research Digest",
    category: "research",
    summary:
      "A recurring student-written digest that summarises and verifies recent space science research.",
    description: null,
    team: "Research department",
    link: null,
    stage: "idea",
    created_at: "",
  },
  {
    id: "schools-outreach-kit",
    title: "Schools Outreach Kit",
    category: "outreach",
    summary:
      "A ready-to-run workshop kit so any school can host a Polaris session with their own students.",
    description: null,
    team: "Community + Outreach",
    link: null,
    stage: "idea",
    created_at: "",
  },
];

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          about: FLAGSHIP.map((p) => ({
            "@type": "CreativeWork",
            name: p.title,
            abstract: p.summary,
            creator: { "@type": "Organization", name: "Project Polaris" },
          })),
        }),
      },
    ],
  }),
  component: Showcase,
});

function ProjectCard({ project, index }: { project: ShowcaseProject; index: number }) {
  return (
    <article
      className="card-elevated flex flex-col p-7 md:p-8 justify-between"
      style={{ animation: `fade-in-up 500ms ease-out ${index * 80}ms both` }}
    >
      <div>
        <div className="font-ui flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary font-semibold">
            {SHOWCASE_CATEGORY_LABELS[project.category] ?? project.category}
          </span>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted-foreground font-medium">
            {SHOWCASE_STAGE_LABELS[project.stage] ?? project.stage}
          </span>
          {project.team ? (
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-muted-foreground font-mono text-[11px]">{project.team}</span>
          ) : null}
        </div>
        <h3 className="mt-5 text-2xl font-display font-bold text-foreground">{project.title}</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
        {project.description ? (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        ) : null}
      </div>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          className="font-ui mt-6 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline font-semibold"
        >
          <span>View project</span>
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      ) : null}
    </article>
  );
}

function Showcase() {
  const [category, setCategory] = useState("all");
  const { data, isLoading } = useQuery(showcaseQuery);

  const projects = useMemo(() => {
    const all = [...FLAGSHIP, ...(data ?? [])];
    return category === "all" ? all : all.filter((p) => p.category === category);
  }, [data, category]);

  return (
    <>
      <PageHeader
        eyebrow="Showcase"
        title="Projects built by students, published in public."
        lead="Everything here was scoped, built and tested by students. Browse by category — and if you've built something, submit it and we'll review it for the showcase."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
            <a href="#submit">Submit your project</a>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10">
            <Link to="/opportunities">Join a project team</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Browse"
            title="Filter by category"
            lead="New submissions appear here once a student team has reviewed them."
          />

          <div className="mt-10 flex flex-wrap gap-2">
            {SHOWCASE_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                aria-pressed={category === c.value}
                className={
                  "font-ui rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer " +
                  (category === c.value
                    ? "border-primary bg-primary/20 text-primary shadow-sm"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground")
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          {projects.length === 0 ? (
            <p className="mt-12 text-sm text-muted-foreground">
              {isLoading ? "Loading projects…" : "Nothing in this category yet — yours could be first."}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="submit" className="section scroll-mt-24 border-t border-border bg-surface/30">
        <div className="shell">
          <SectionHeader
            eyebrow="Submit"
            title="Add your project"
            lead="Built something as part of Polaris, at school, or on your own? Send it in. We review every submission before publishing."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <ProjectSubmissionForm />
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell max-w-2xl text-center">
          <Sparkles className="mx-auto size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-6 text-3xl md:text-4xl font-display font-bold text-white">Want help finishing an idea?</h2>
          <p className="mt-5 text-slate-300 leading-relaxed">
            Bring the problem. We'll help you find a team, a mentor and a deadline.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full shadow-md">
              <Link to="/join">Join Polaris</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10">
              <Link to="/projects">See our builds</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

