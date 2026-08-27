import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { Button } from "@/components/ui/button";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
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
      { property: "og:url", content: "https://projectpolaris.in/projects" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/projects" }],
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

        <div className="shell relative z-10 max-w-4xl mx-auto text-center space-y-4 font-sans">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight">
              Projects & Labs
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Small sprint teams, real physical constraints, reproducible code and models. Explore our flagship AeroForge simulation laboratory and computational platforms.
            </p>
          </ScrollReveal>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold">FLAGSHIP PLATFORM</span>
                <span className="text-white/20">|</span>
                <span className="text-muted-foreground">40+ Numerical Physics Solvers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                AeroForge AI Simulation Workstation
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                AeroForge AI is Polaris's open-source computational physics laboratory. Practice fluid dynamics, transonic airfoil CFD, structural FEA, and orbital Keplerian transfers directly in your browser.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive AeroForge Demonstration Component */}
          <ScrollReveal direction="up" delay={40}>
            <InteractiveAeroForgeDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. COMPUTATIONAL SOFTWARE LABS (Allowed Eyebrow 1 of 1) ── */}
      <section className="section bg-surface/20" id="software-labs">
        <div className="shell font-sans space-y-6">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold block mb-1">
              Active Repositories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Polaris Computational Labs
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Open-source software projects built and maintained by Polaris student squads.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Orbital Keplerian Engine",
                desc: "Numerical integration of 2-body and restricted 3-body gravitational trajectories with delta-V burn calculations.",
                tech: "TypeScript, WebGL, Runge-Kutta 4",
                status: "Production Lab",
              },
              {
                title: "Transonic CFD Airfoil Solver",
                desc: "Grid generation, compressible Navier-Stokes approximations, and Mach shockwave pressure contour mapping.",
                tech: "Wasm, C++, Canvas API",
                status: "Production Lab",
              },
              {
                title: "Structural FEA Stress Sandbox",
                desc: "2D truss and beam finite element analysis with von Mises stress distribution and displacement visualization.",
                tech: "Matrix Solvers, React, WebGL",
                status: "Production Lab",
              },
            ].map((lab, i) => (
              <ScrollReveal key={lab.title} direction="up" delay={i * 30}>
                <div className="p-6 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full card-gold-hover">
                  <div className="space-y-3">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 inline-block font-mono">
                      {lab.status}
                    </span>
                    <h3 className="text-base font-bold font-display text-foreground">{lab.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{lab.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono text-primary">{lab.tech}</span>
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
