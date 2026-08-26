import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  Plus,
  Github,
  FileCheck2,
  Rocket,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "Student Project Showcase — Project Polaris" },
      {
        name: "description",
        content:
          "Explore real software, simulations, and research projects built by students at Project Polaris. Working code, live demos, and technical whitepapers.",
      },
      { property: "og:title", content: "Student Project Showcase — Project Polaris" },
      {
        property: "og:description",
        content: "Explore student-built aerospace and computational engineering projects.",
      },
    ],
  }),
  component: ShowcasePage,
});

const FLAGSHIP_SHOWCASE: ShowcaseProject[] = [
  {
    id: "aeroforge-ai",
    title: "AeroForge AI Simulation Workstation",
    category: "software",
    summary:
      "Browser-based engineering research workstation with 40+ physics solvers across CFD aerodynamics, structural FEA, and orbital mechanics.",
    description: null,
    team: "Core Engineering Squad",
    link: "/projects",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "sky-atlas",
    title: "Sky Atlas Deep-Sky Observational Registry",
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
    title: "Polaris Bi-Weekly Science Digest",
    category: "research",
    summary:
      "A recurring student-written and peer-reviewed technical digest that summarizes and verifies recent space science and propulsion research papers.",
    description: null,
    team: "Research Department",
    link: "/research",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "schools-outreach-kit",
    title: "Schools Experiential Science Laboratory Kit",
    category: "outreach",
    summary:
      "A ready-to-run interactive laboratory curriculum, stomp rocket telemetry kit, and telescope workshop modules for middle and high schools.",
    description: null,
    team: "Outreach Team",
    link: "/schools",
    stage: "in_progress",
    created_at: "",
  },
];

function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: dbProjects = [] } = useQuery(showcaseQuery);

  const projects = useMemo(() => {
    const list = dbProjects.length > 0 ? dbProjects : FLAGSHIP_SHOWCASE;
    if (selectedCategory === "all") return list;
    return list.filter((p) => p.category === selectedCategory);
  }, [dbProjects, selectedCategory]);

  return (
    <>
      <PageHeader
        eyebrow="Student Artifacts"
        title="What Polaris students are actually building."
        lead="Explore open-source simulation tools, astronomical registries, and computational research papers built by student engineers."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowSubmitModal(true)}
            size="sm"
            className="h-9 px-4 bg-primary text-primary-foreground font-bold font-mono text-xs shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-3.5 mr-1" />
            Submit Your Project
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40">
            <Link to="/projects">Explore Build Squads</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <ScrollReveal direction="up">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-full transition-colors ${
                  selectedCategory === "all"
                    ? "bg-foreground text-background font-bold"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                }`}
              >
                All Artifacts ({FLAGSHIP_SHOWCASE.length})
              </button>
              {SHOWCASE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-foreground text-background font-bold"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                  }`}
                >
                  {SHOWCASE_CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Project Showcase Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <ScrollReveal key={p.id} direction="up" delay={i * 60}>
                <article className="p-6 md:p-8 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 capitalize text-[10px]">
                        {p.category}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{p.team}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">{p.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                      {p.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      <span>Verified Artifact</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" className="h-8 px-3.5 text-xs font-mono font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                        <Link to={p.link || "/projects"} className="flex items-center gap-1">
                          <span>Live Demo</span>
                          <ArrowRight className="size-3 text-primary" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Project Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-surface p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-mono"
            >
              ✕ Close
            </button>
            <h3 className="text-xl font-bold font-display text-foreground mb-1">Submit Your Project</h3>
            <p className="text-xs text-muted-foreground mb-6 font-body">
              Submit your space, physics, software, or hardware project to be peer-reviewed and featured on the Polaris Showcase.
            </p>
            <ProjectSubmissionForm onSuccess={() => setShowSubmitModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
