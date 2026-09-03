import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Button } from "@/components/ui/button";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import { SITE_URL } from "@/lib/site";
import {
  Cpu,
  ArrowRight,
  Code,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Users,
} from "lucide-react";
import { getProjects, type ProjectItem } from "@/lib/cms-store";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Computational Labs — Project Polaris" },
      {
        name: "description",
        content:
          "Explore AeroForge AI and open-source aerospace computational software engineering projects built by Polaris students.",
      },
      { property: "og:title", content: "Projects & Computational Labs — Project Polaris" },
      {
        property: "og:description",
        content:
          "Open-source aerospace engineering labs, 40+ numerical physics solvers, and student build sprints.",
      },
      { property: "og:url", content: `${SITE_URL}/projects` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/projects` }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(getProjects());

  useEffect(() => {
    const handleUpdate = () => {
      setProjects(getProjects());
    };
    window.addEventListener("polaris_cms_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("polaris_cms_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <>
      {/* ── 1. PROJECTS HERO (Parallax Background + Display Type) ── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24 border-b border-border">
        <ParallaxImage
          src="/media/rocket-assembly.jpg"
          alt="Space launch vehicle assembly and simulation laboratory"
          intensity={0.2}
          overlay={0.78}
          kenBurns={true}
          className="absolute inset-0 size-full pointer-events-none"
        />

        <div className="shell relative z-10 max-w-4xl space-y-4 font-sans text-left">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight">
              Projects & Labs
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Small sprint teams, real physical constraints, reproducible code and models. Explore
              our flagship AeroForge simulation laboratory and computational platforms.
            </p>
          </ScrollReveal>

          <div className="pt-4 flex flex-wrap justify-start gap-3">
            <Button
              asChild
              size="sm"
              className="h-10 px-6 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors shadow-sm text-xs active:scale-[0.97]"
            >
              <a href="#aeroforge-lab" className="flex items-center gap-2">
                <Cpu className="size-3.5" />
                <span>Launch AeroForge Lab</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 px-5 text-xs font-medium rounded-full border-white/15 bg-surface/80 backdrop-blur-md hover:bg-surface-2 text-foreground active:scale-[0.97]"
            >
              <a href="#student-projects">Browse Labs & Projects</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 2. FLAGSHIP PROJECT: AEROFORGE AI LAB ── */}
      <section className="section border-b border-border" id="aeroforge-lab">
        <div className="shell space-y-8 font-sans">
          <ScrollReveal direction="up">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                AeroForge AI Simulation Workstation
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                AeroForge AI is Polaris's open-source computational physics laboratory. Practice
                fluid dynamics, transonic airfoil CFD, structural FEA, and orbital Keplerian
                transfers directly in your browser.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive AeroForge Demonstration Component */}
          <ScrollReveal direction="up" delay={40}>
            <InteractiveAeroForgeDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. FEATURED STUDENT LABS & OPEN PROJECTS (CMS DYNAMIC) ── */}
      <section className="section border-b border-border bg-surface/10" id="student-projects">
        <div className="shell space-y-8 font-sans">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-semibold block mb-1">
                  Active Computational Research
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Computational Labs & Sprints
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Explore open-source physics solvers, orbital registries, and simulation engines
                  built by Polaris student squads.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 text-xs border-white/10 hover:border-white/20 active:scale-[0.97]"
              >
                <Link to="/programs">Explore Programs & Sprints →</Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {projects.map((proj, idx) => (
              <ScrollReveal key={proj.id} direction="up" delay={idx * 30}>
                <div className="p-6 rounded-2xl border border-white/10 bg-card flex flex-col justify-between h-full space-y-4 hover:border-primary/40 transition-colors shadow-sm">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-primary/10 border border-primary/20 text-primary">
                        {proj.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          proj.status === "Active Lab"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-foreground">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] font-mono text-primary/80 mt-0.5">{proj.domain}</p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{proj.summary}</p>

                    {proj.deliverables && proj.deliverables.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                          Key Deliverables:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.deliverables.map((deliv) => (
                            <span
                              key={deliv}
                              className="text-[10px] px-2 py-0.5 rounded bg-surface border border-white/6 text-foreground/90 font-mono"
                            >
                              {deliv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Users className="size-3 text-primary" />
                      <span>{proj.team}</span>
                    </div>

                    {proj.link && (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-primary hover:text-foreground active:scale-[0.97]"
                      >
                        {proj.link.startsWith("http") ? (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1"
                          >
                            <span>Open Project</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <Link to={proj.link} className="flex items-center gap-1">
                            <span>Launch Lab</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
