import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Cpu,
  Flame,
  FolderKanban,
  MessageCircle,
  Orbit,
  Check,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoGrid } from "@/components/site/BentoGrid";
import { SITE, STATS } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Learn by Building" },
      {
        name: "description",
        content:
          "A student-led experiential engineering and research organisation. Students research, build, and deploy real systems — starting with space science.",
      },
      { property: "og:title", content: "Project Polaris — Learn by Building" },
      {
        property: "og:description",
        content:
          "Where curiosity becomes action. Open-source engineering platforms, daily science drops, and student-led research cohorts.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<"aeroforge" | "skyatlas" | "digest">("aeroforge");

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border">
        <div className="shell">
          <div className="max-w-3xl">
            {/* Minimalist Status Chip */}
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground mb-6 font-mono">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Student-Led Experiential Engineering</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Learn by building,{" "}
              <span className="text-muted-foreground font-normal block sm:inline">
                not after.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Project Polaris bridges the gap between academic theory and real-world engineering. 
              Students collaborate on active simulation platforms, observational astrophysics tools, 
              and research papers with guidance from industry practitioners.
            </p>

            {/* Primary Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="default" className="h-10 px-4 rounded-md font-medium bg-foreground text-background hover:bg-foreground/90">
                <Link to="/projects" className="flex items-center gap-1.5">
                  <FolderKanban className="size-4" />
                  <span>Explore Projects</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="h-10 px-4 rounded-md font-medium border-border hover:bg-surface-2">
                <Link to="/aeroforge" className="flex items-center gap-1.5">
                  <Cpu className="size-4 text-primary" />
                  <span>Launch AeroForge Lab</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="default" className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  <span>WhatsApp Community</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* ── WORKBENCH PREVIEW CONTAINER ── */}
          <div className="mt-14 rounded-xl border border-border bg-surface shadow-2xl overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-border-strong" />
                <span className="size-2.5 rounded-full bg-border-strong" />
                <span className="size-2.5 rounded-full bg-border-strong" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  polaris://active-r&d-workbench
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(["aeroforge", "skyatlas", "digest"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveWorkbenchTab(tab)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      activeWorkbenchTab === tab
                        ? "bg-surface-3 text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "aeroforge" && "AeroForge CFD"}
                    {tab === "skyatlas" && "Sky Atlas"}
                    {tab === "digest" && "Daily Research"}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Workbench Content */}
            <div className="p-6 md:p-8">
              {activeWorkbenchTab === "aeroforge" && (
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                      <Terminal className="size-3" />
                      <span>FLAGSHIP R&D PLATFORM</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      AeroForge Simulation Workstation
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      A browser-based aerospace & physics simulation laboratory built by student engineers. Includes 40+ numerical solvers, CFD aerodynamics, structural FEA, and orbital propulsion modeling.
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2.5 font-mono text-xs">
                      <div className="p-3 rounded-lg border border-border bg-surface-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Solvers</div>
                        <div className="text-sm font-bold text-foreground mt-0.5">40+ Active</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-surface-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Aerodynamics</div>
                        <div className="text-sm font-bold text-primary mt-0.5">CFD Grid</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-surface-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Access</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">Open 100%</div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <Button asChild size="sm" className="h-8 px-3 text-xs bg-foreground text-background">
                        <Link to="/aeroforge">Open Full Simulator →</Link>
                      </Button>
                      <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground">
                        View Documentation
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2 text-[11px]">
                      <span className="text-foreground font-semibold">Telemetry Output</span>
                      <span className="text-emerald-400">● Solver Converged</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span>Mach Number:</span>
                        <span className="text-foreground">2.14 (Supersonic Regime)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dynamic Pressure (q):</span>
                        <span className="text-foreground">48.2 kPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boundary Layer δ:</span>
                        <span className="text-foreground">1.42 mm (Turbulent)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Specific Impulse (Isp):</span>
                        <span className="text-primary">3,120 s (Ion Thruster)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeWorkbenchTab === "skyatlas" && (
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-accent/10 text-accent border border-accent/20 mb-3">
                      <Orbit className="size-3" />
                      <span>ASTROPHYSICS DATABASE</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Sky Atlas Observation Network
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      An open, student-maintained deep-sky catalog and constellation mapping database with observations recorded across community stargazing nights and telescope workshops.
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2.5 font-mono text-xs">
                      <div className="p-3 rounded-lg border border-border bg-surface-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Objects</div>
                        <div className="text-sm font-bold text-foreground mt-0.5">110 Messier</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-surface-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Coordinates</div>
                        <div className="text-sm font-bold text-accent mt-0.5">J2000 Epoch</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-surface-2">
                        <div className="text-muted-foreground text-[10px] uppercase">Format</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">Open Data</div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <Button asChild size="sm" className="h-8 px-3 text-xs bg-foreground text-background">
                        <Link to="/projects">Explore Sky Atlas →</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground space-y-2">
                    <div className="text-[11px] text-foreground font-semibold border-b border-border pb-2">
                      Recent Deep-Sky Log: M31 Andromeda Galaxy
                    </div>
                    <div className="text-[11px] space-y-1">
                      <p>• RA: 00h 42m 44.3s | Dec: +41° 16′ 09″</p>
                      <p>• Distance: 2.537 Mly | Mag: 3.44</p>
                      <p className="text-slate-300">Observation Notes: Prominent spiral dust lanes visible through 8" Dobsonian during community observation night.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeWorkbenchTab === "digest" && (
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-gold/10 text-gold border border-gold/20 mb-3">
                      <Flame className="size-3" />
                      <span>DAILY LEARNING RITUAL</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Aaj Ka Gyan (Daily Science Drops)
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Every weekday morning, our student content team releases verified deeptech insights based on weekly scientific themes — sparking daily discussions across 400+ members.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <Button asChild size="sm" className="h-8 px-3 text-xs bg-foreground text-background">
                        <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                          Join WhatsApp Channel →
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
                    <div className="flex justify-between items-center text-[11px] text-foreground font-semibold border-b border-border pb-2 mb-2">
                      <span>Today's Drop #94</span>
                      <span className="text-primary font-normal">Theme: Ion Propulsion</span>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "Why Hall-effect thrusters achieve 3000+ s specific impulse by accelerating xenon ions via electrostatic fields, requiring 10x less propellant mass than chemical rockets for interplanetary trajectories."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-border bg-surface-2/40 py-6">
        <div className="shell">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BentoGrid />


      {/* ── THE EDUCATIONAL GAP VS POLARIS MODEL ── */}
      <section className="section border-b border-border">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <p className="eyebrow">The Educational Gap</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Students spend years memorizing theories without ever building a system.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                Standard curricula focus on high-stakes testing and textbook definitions. Students rarely get to touch simulation solvers, debug real data, or publish verified findings with mentors.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
                Polaris is the parallel track where curiosity becomes practical engineering.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { label: "Traditional Path", val: "Passive lectures and exam memorization", polaris: "Active sprint teams & production deliverables" },
                { label: "Practical Exposure", val: "Zero direct access to engineers or labs", polaris: "Interactive masterclasses with ISRO & aerospace leads" },
                { label: "Artifacts", val: "Only marks and test score percentages", polaris: "Open-source software, simulation tools & research digests" },
                { label: "Learning Rhythm", val: "Cramming before terminal examinations", polaris: "Daily scientific inquiry ('Aaj Ka Gyan') and weekly reviews" },
              ].map((row, i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-surface-2/60">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">{row.label}</div>
                  <div className="text-muted-foreground line-through decoration-destructive/60 mb-1 text-[11px]">{row.val}</div>
                  <div className="text-foreground font-semibold flex items-center gap-1.5 text-xs">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>{row.polaris}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE FLAGSHIP PLATFORMS ── */}
      <section className="section border-b border-border bg-surface/20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow">Active R&D Initiatives</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Software, physics solvers & observational data.
              </h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/projects" className="flex items-center gap-1.5">
                <span>View all projects</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: AeroForge */}
            <div className="card-premium p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                  <span className="text-primary font-semibold">Aerospace & CFD</span>
                  <span className="text-emerald-400">● Live Lab</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">AeroForge AI Suite</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  40+ numerical physics solvers across supersonic aerodynamics, orbital maneuvers, and structural finite element analysis.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">Open Workbench</span>
                <Link to="/aeroforge" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <span>Launch</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Sky Atlas */}
            <div className="card-premium p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                  <span className="text-accent font-semibold">Astrophysics</span>
                  <span>In Progress</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Sky Atlas Network</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Community-maintained deep-sky catalog mapping Messier, NGC, and IC celestial objects using observational telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">110 Objects</span>
                <Link to="/projects" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Research Digest */}
            <div className="card-premium p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                  <span className="text-gold font-semibold">Scientific Inquiries</span>
                  <span>Weekly</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Polaris Research Digest</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Peer-reviewed literature summaries, verification papers, and student fellowship documentation across space technology.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">Student Authors</span>
                <Link to="/programs" className="text-xs text-gold font-semibold hover:underline flex items-center gap-1">
                  <span>Read Digest</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE STUDENT TRAJECTORY ── */}
      <section className="section border-b border-border">
        <div className="shell">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="eyebrow">Student Trajectory</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              From curious beginner to verified project contributor.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {[
              { step: "01", title: "Join Daily Rhythm", desc: "Engage with daily 'Aaj Ka Gyan' science drops and weekend interactive problem polls." },
              { step: "02", title: "Attend Cohorts", desc: "Participate in live masterclasses and Q&As with aerospace and astrophysics practitioners." },
              { step: "03", title: "Sprint on Projects", desc: "Join an active development squad building simulation solvers, research papers, or hardware kits." },
              { step: "04", title: "Verify Credentials", desc: "Build an authentic portfolio of demonstrable technical artifacts and official mentor letters." },
            ].map((p) => (
              <div key={p.step} className="p-5 rounded-lg border border-border bg-surface-2/40 flex flex-col justify-between">
                <div>
                  <div className="text-primary font-bold text-sm mb-2">{p.step}</div>
                  <div className="text-sm font-semibold text-foreground mb-1.5">{p.title}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed font-sans">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CLEAN CALL TO ACTION ── */}
      <section className="section bg-surface/30">
        <div className="shell text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Ready to build something real?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Join 400+ student builders, researchers, and mentors on our free WhatsApp community. No entry barrier, no inflated promises.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="default" className="h-10 px-5 bg-foreground text-background font-medium">
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <MessageCircle className="size-4" />
                <span>Join WhatsApp Community</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="default" className="h-10 px-5">
              <Link to="/portal">Open Student Workspace</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
