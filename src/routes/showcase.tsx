import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Sparkles, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProjectSubmissionForm } from "@/components/site/ProjectSubmissionForm";
import {
  SHOWCASE_CATEGORIES,
  SHOWCASE_CATEGORY_LABELS,
  showcaseQuery,
  type ShowcaseProject,
} from "@/lib/showcase";

const TITLE = "Student Project Showcase — Project Polaris";
const DESCRIPTION =
  "Explore student-built projects at Project Polaris across hardware, software, research, outreach and design — and submit your own project to be featured.";

const FLAGSHIP: ShowcaseProject[] = [
  {
    id: "aeroforge-ai",
    title: "AeroForge AI Simulation Workstation",
    category: "software",
    summary:
      "Browser-based engineering research workstation with 40+ physics solvers across CFD aerodynamics, structural FEA, and orbital mechanics.",
    description: null,
    team: "Core Engineering Team",
    link: "/aeroforge",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "sky-atlas",
    title: "Sky Atlas Deep-Sky Network",
    category: "software",
    summary:
      "An open, student-maintained deep-sky catalog and constellation mapping database with observations recorded across community stargazing nights.",
    description: null,
    team: "Astrophysics Squad",
    link: "/projects",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "polaris-research-digest",
    title: "Polaris Daily Science Digest",
    category: "research",
    summary:
      "A recurring student-written and peer-reviewed technical digest that summarises and verifies recent space science research papers.",
    description: null,
    team: "Research Department",
    link: "/programs",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "schools-outreach-kit",
    title: "Schools Experiential Science Kit",
    category: "outreach",
    summary:
      "A ready-to-run interactive laboratory curriculum and telescope workshop kit for middle and high schools.",
    description: null,
    team: "Outreach Team",
    link: "/schools",
    stage: "in_progress",
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
    <ScrollReveal direction="up" delay={index * 60}>
      <article className="card-premium p-6 md:p-7 flex flex-col justify-between h-full">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-4">
            <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-primary font-semibold">
              {SHOWCASE_CATEGORY_LABELS[project.category] ?? project.category}
            </span>
            {project.team ? (
              <span className="text-muted-foreground text-[11px]">{project.team}</span>
            ) : null}
          </div>
          <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
        </div>
        {project.link ? (
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
            <span className="text-[11px] text-muted-foreground">Open-Access</span>
            {project.link.startsWith("/") ? (
              <Link to={project.link} className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1">
                <span>View Platform</span>
                <ArrowRight className="size-3" />
              </Link>
            ) : (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>External Link</span>
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        ) : null}
      </article>
    </ScrollReveal>
  );
}

function Showcase() {
  const [category, setCategory] = useState("all");
  const { data } = useQuery(showcaseQuery);

  const projects = useMemo(() => {
    const all = [...FLAGSHIP, ...(data ?? [])];
    return category === "all" ? all : all.filter((p) => p.category === category);
  }, [data, category]);

  return (
    <>
      <PageHeader
        eyebrow="Student Showcase"
        title="Artifacts and platforms built in public."
        lead="Everything here was scoped, written, simulated, and tested by student engineers and researchers."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <a href="#submit" className="flex items-center gap-1.5">
              <Plus className="size-3.5" />
              <span>Submit your project</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <Link to="/opportunities">Join a build team</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-6 font-mono text-xs">
            {SHOWCASE_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  category === c.value
                    ? "bg-surface-3 text-foreground font-bold border border-border-strong"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SUBMIT PROJECT SECTION */}
      <section id="submit" className="section border-t border-border bg-surface/20 scroll-mt-20">
        <div className="shell max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-8">
              <p className="eyebrow mb-2">Open Submission</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Add your project to the showcase
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Built something at school, university, or independently? Submit your project for review by our student engineering team.
              </p>
            </div>
            <ProjectSubmissionForm />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
