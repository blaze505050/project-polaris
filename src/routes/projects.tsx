import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Button } from "@/components/ui/button";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import { SITE_URL } from "@/lib/site";
import { Cpu, ArrowRight, Code, Layers, Sparkles } from "lucide-react";

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
              <Link to="/spotlight">View Student Artifacts</Link>
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
    </>
  );
}
