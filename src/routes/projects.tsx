import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Rocket,
  Cpu,
  Bot,
  Compass,
  BookOpen,
  SunMedium,
  CheckCircle2,
  Layers,
  Maximize2,
  Minimize2,
  ExternalLink,
  ArrowRight,
  Github,
  Users,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PROJECTS, BUILD_SQUADS, VERIFIED_DELIVERABLES, SITE } from "@/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & AeroForge AI Suite — Project Polaris" },
      {
        name: "description",
        content:
          "Student-built Polaris engineering platforms and research tools: AeroForge AI simulation laboratory, Sky Atlas, Research Digest, and active build squads.",
      },
      { property: "og:title", content: "Projects & AeroForge AI Suite — Project Polaris" },
      {
        property: "og:description",
        content:
          "Explore and launch student-built engineering platforms — including the flagship AeroForge simulation suite, deep-sky astronomy logs, and computational research tools.",
      },
    ],
  }),
  component: ProjectsPage,
});

const PROJECT_ICONS: Record<string, typeof Rocket> = {
  "aeroforge-ai": Rocket,
  "sky-atlas": Compass,
  "schools-outreach-kit": Layers,
  "polaris-ai": Bot,
  "research-digest": BookOpen,
  "space-weather-dashboard": SunMedium,
};

function ProjectsPage() {
  const [isSimFullscreen, setIsSimFullscreen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Polaris Engineering"
        title="Student engineering platforms & build squads."
        lead="Small sprint teams, real physical constraints, reproducible code and models. Explore our flagship AeroForge simulation laboratory and active sprint squads."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-5 bg-primary text-primary-foreground font-bold font-mono text-xs shadow-sm hover:bg-primary/90 transition-colors">
            <a href="#aeroforge-lab">
              <Cpu className="size-4 mr-1.5" />
              Launch AeroForge Lab
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40">
            <Link to="/join">Join a Build Squad</Link>
          </Button>
        </div>
      </PageHeader>

      {/* ── EMBEDDED FLAGSHIP: AEROFORGE AI LAB WORKSTATION ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="aeroforge-lab">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="rounded-2xl border border-primary/30 bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Glowing Ambient Backdrop */}
              <div className="absolute top-0 right-0 size-96 bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 size-72 bg-gold/5 blur-[90px] pointer-events-none rounded-full" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/15 text-primary border border-primary/30 mb-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold">FLAGSHIP R&D PLATFORM</span>
                    <span className="text-white/20">|</span>
                    <span className="text-gold">100% Free & Open Source</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground">
                    AeroForge AI Physics & Aerodynamics Laboratory
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl font-body leading-relaxed">
                    An interactive aerospace engineering research workstation built entirely by student engineers. Run 40+ numerical physics solvers, 2D/3D CFD aerodynamics, structural FEA, and orbital propulsion trajectory models right in your browser.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <Button
                    onClick={() => setIsSimFullscreen(!isSimFullscreen)}
                    variant="outline"
                    size="sm"
                    className="h-9 px-3.5 border-white/15 hover:border-primary/40 text-primary font-semibold"
                  >
                    {isSimFullscreen ? (
                      <>
                        <Minimize2 className="size-3.5 mr-1.5" />
                        <span>Collapse Lab</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="size-3.5 mr-1.5" />
                        <span>Expand Viewport</span>
                      </>
                    )}
                  </Button>
                  <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-bold hover:bg-foreground/90">
                    <a href="/aeroforge/index.html" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                      <span>Standalone Tab</span>
                      <ExternalLink className="size-3 text-gold" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Embedded Simulation Iframe Sandbox */}
              <div
                className={`mt-6 transition-all duration-300 rounded-xl overflow-hidden border border-white/10 bg-background ${
                  isSimFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl" : "h-[620px]"
                }`}
              >
                <div className="w-full bg-surface-2 border-b border-white/8 px-4 py-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-destructive/60" />
                    <span className="size-2.5 rounded-full bg-gold/60" />
                    <span className="size-2.5 rounded-full bg-emerald-400/60" />
                    <span className="ml-2 text-primary font-semibold hidden sm:inline">
                      aeroforge://physics-canvas-webgl
                    </span>
                  </div>
                  {isSimFullscreen && (
                    <button
                      onClick={() => setIsSimFullscreen(false)}
                      className="px-2 py-0.5 rounded bg-surface hover:bg-surface-3 text-foreground"
                    >
                      Exit Fullscreen ✕
                    </button>
                  )}
                </div>
                <iframe
                  src="/aeroforge/index.html"
                  className="w-full h-[calc(100%-37px)] border-none"
                  title="AeroForge AI Simulation Workstation"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
                  allow="fullscreen; autoplay; clipboard-write; encrypted-media"
                />
              </div>

              {/* Solver Capabilities Telemetry Bar */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl border border-white/8 bg-surface-2/60">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Solvers</span>
                  <span className="text-sm font-bold text-foreground mt-0.5 block">40+ Numerical Physics</span>
                </div>
                <div className="p-3.5 rounded-xl border border-white/8 bg-surface-2/60">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Aerodynamics</span>
                  <span className="text-sm font-bold text-primary mt-0.5 block">Spalart-Allmaras CFD</span>
                </div>
                <div className="p-3.5 rounded-xl border border-white/8 bg-surface-2/60">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Astrodynamics</span>
                  <span className="text-sm font-bold text-gold mt-0.5 block">N-Body & Keplerian</span>
                </div>
                <div className="p-3.5 rounded-xl border border-white/8 bg-surface-2/60">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">License</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Open Source MIT</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ALL PRODUCT INITIATIVES ── */}
      <section className="section border-b border-white/8">
        <div className="shell">
          <SectionHeader
            eyebrow="Active Initiatives"
            title="All Student Build Sprints"
            lead="Collaborative engineering teams tackling open problems across aerospace, astrophysics, and research tools."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p) => {
              const Icon = PROJECT_ICONS[p.slug] || Cpu;
              const isFlagship = p.slug === "aeroforge-ai";

              return (
                <ScrollReveal key={p.slug} direction="up">
                  <article
                    className={`p-6 md:p-8 rounded-2xl border bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all ${
                      isFlagship ? "border-primary/30 bg-surface-2/30" : "border-white/8"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase">
                            {p.category}
                          </span>
                          <span className="text-muted-foreground text-[11px]">{p.members}</span>
                        </div>
                        {isFlagship && (
                          <span className="text-[11px] text-gold font-bold uppercase tracking-wider">
                            ★ Flagship Platform
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-xl bg-surface-2 border border-white/8 flex items-center justify-center text-primary shrink-0">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">{p.name}</h3>
                          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">{p.blurb}</p>
                        </div>
                      </div>

                      {/* Metadata Grid */}
                      <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-2/60 border border-white/6 font-mono text-[11px]">
                        <div>
                          <span className="text-muted-foreground uppercase text-[9px] block">Level</span>
                          <span className="text-foreground font-semibold block mt-0.5">{p.level}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground uppercase text-[9px] block">Duration</span>
                          <span className="text-primary font-semibold block mt-0.5">{p.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground uppercase text-[9px] block">Progress</span>
                          <span className="text-emerald-400 font-semibold block mt-0.5">{p.progress}%</span>
                        </div>
                      </div>

                      {/* Build Roadmap Timeline */}
                      <div className="mt-4 pt-3 border-t border-white/6">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                          Build Journey
                        </span>
                        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground overflow-x-auto gap-1">
                          {p.roadmap.map((step, i) => (
                            <div key={step} className="flex items-center gap-1 shrink-0">
                              <span className="text-foreground font-medium">{step}</span>
                              {i < p.roadmap.length - 1 && <span className="text-white/20">→</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables Checklist */}
                      <div className="mt-4 pt-3 border-t border-white/6">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                          What You Ship
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                          {p.deliverables.map((del) => (
                            <span key={del} className="px-2 py-0.5 rounded bg-surface-2 border border-white/6 text-muted-foreground flex items-center gap-1">
                              <Check className="size-2.5 text-emerald-400" />
                              <span>{del}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
                      <span className="text-muted-foreground text-[11px]">
                        {p.stack}
                      </span>
                      <Button asChild size="sm" className="h-8 px-4 text-xs font-mono font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                        <Link to="/join" className="flex items-center gap-1.5">
                          <span>Join Squad</span>
                          <ArrowRight className="size-3 text-primary" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ACTIVE BUILD SQUADS ── */}
      <section className="section bg-surface-2/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Open Squads"
            title="Sprint Squad Discovery"
            lead="Join an active squad working on technical deliverables."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUILD_SQUADS.map((squad) => (
              <div key={squad.id} className="p-5 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-surface-2 text-primary font-bold text-[10px]">
                      {squad.category}
                    </span>
                    <span className="text-muted-foreground text-[11px]">{squad.level}</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-foreground">{squad.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground font-mono">{squad.stack}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-surface-2/60 border border-white/6 text-xs">
                    <span className="text-[10px] text-muted-foreground uppercase block font-mono">Current Sprint</span>
                    <span className="text-foreground text-[11px] font-body mt-0.5 block">{squad.currentMilestone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground text-[11px]">{squad.members}</span>
                  <Button asChild size="sm" className="h-7 px-3 text-[11px] font-mono font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-md">
                    <Link to="/join">Join</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
