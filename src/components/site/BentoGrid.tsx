import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import {
  Cpu,
  Orbit,
  Sparkles,
  Radio,
  FileText,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";

export function BentoGrid() {
  const [activeSolver, setActiveSolver] = useState<"cfd" | "orbital" | "fea">("cfd");

  return (
    <section className="section relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-[600px] bg-primary/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 size-[500px] bg-accent/6 blur-[140px] pointer-events-none rounded-full" />

      <div className="shell">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="size-3.5" />
            <span>The Polaris Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight">
            Built for Builders, Powered by Real Science
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            From browser-based physics supercomputing to hands-on satellite payloads and ISRO masterclasses — explore how Polaris transforms curiosity into authentic engineering.
          </p>
        </div>

        {/* BENTO GRID CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5 md:gap-6">
          {/* 1. MAIN HERO BENTO: AeroForge AI Lab (Span 7 cols) */}
          <SpotlightCard
            spotlightColor="rgba(197, 157, 255, 0.22)"
            className="lg:col-span-7 flex flex-col justify-between border border-primary/25 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-primary/5 p-7 md:p-9"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-mono font-bold text-primary">
                  <Cpu className="size-3.5" />
                  FLAGSHIP PROJECT
                </span>
                <span className="font-mono text-xs text-muted-foreground">40+ Physics Solvers Online</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                AeroForge AI Simulation Lab
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
                A full-stack, browser-native aerospace research suite built completely by students. Perform 2D/3D compressible CFD, two-body & restricted three-body orbital propagation, and structural FEA without expensive workstation licenses.
              </p>

              {/* Interactive Solver Switcher */}
              <div className="mt-6 p-4 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3 text-xs font-mono">
                  <span className="text-muted-foreground">Sim Engine:</span>
                  <div className="flex gap-1.5">
                    {(["cfd", "orbital", "fea"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setActiveSolver(s)}
                        className={`px-2.5 py-1 rounded-md transition-all font-semibold uppercase ${
                          activeSolver === s
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Visual Graph Preview */}
                <div className="h-28 rounded-lg bg-black/40 border border-white/5 p-3 flex flex-col justify-between font-mono text-[11px] text-muted-foreground relative overflow-hidden">
                  <div className="absolute inset-0 blueprint opacity-25" />
                  <div className="flex justify-between items-center z-10">
                    <span className="text-primary font-bold">
                      {activeSolver === "cfd" && "Compressible Navier-Stokes (Mach 2.4)"}
                      {activeSolver === "orbital" && "Runge-Kutta 4th Order LEO Orbit"}
                      {activeSolver === "fea" && "Von Mises Stress Tensor (Inconel 718)"}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Converged
                    </span>
                  </div>

                  {/* Animated Waveform Simulation */}
                  <div className="h-10 w-full flex items-end gap-1 z-10 pt-2">
                    {[40, 65, 30, 85, 95, 45, 60, 75, 50, 90, 100, 70, 80, 55, 65, 90, 85, 95, 60, 75, 80].map(
                      (h, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-primary/40 to-accent rounded-t-sm transition-all duration-500"
                          style={{ height: `${activeSolver === "cfd" ? h : activeSolver === "orbital" ? (h * 1.2) % 100 : (h * 0.8) % 100}%` }}
                        />
                      )
                    )}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 z-10">
                    <span>Mesh: 24,000 Cells</span>
                    <span>Residual: 1.42e-6</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
              <Button asChild size="default" className="rounded-full font-semibold shadow-md bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none btn-shimmer">
                <Link to="/aeroforge" className="flex items-center gap-2">
                  <span>Launch AeroForge Lab</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Link to="/projects" className="text-xs font-ui text-muted-foreground hover:text-primary font-semibold flex items-center gap-1">
                <span>View project architecture</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </SpotlightCard>

          {/* 2. AAJ KA GYAN DAILY PULSE (Span 5 cols) */}
          <SpotlightCard
            spotlightColor="rgba(56, 189, 248, 0.2)"
            className="lg:col-span-5 flex flex-col justify-between border border-accent/20 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-accent/5 p-7 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-xs font-mono font-bold text-accent">
                  <Flame className="size-3.5 text-accent animate-pulse" />
                  DAILY RITUAL
                </span>
                <span className="font-mono text-xs text-muted-foreground">Mon–Fri Drops</span>
              </div>

              <h3 className="text-2xl font-display font-bold text-foreground">Aaj Ka Gyan</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Every morning, our student content team releases curated scientific knowledge based on weekly deeptech themes — sparking curiosity and daily debates across 120+ active community members.
              </p>

              <div className="mt-5 p-4 rounded-xl border border-white/10 bg-slate-950/70">
                <div className="flex items-center justify-between text-xs font-mono text-primary mb-2">
                  <span>Today's Drop #94</span>
                  <span className="text-emerald-400">● Live on WhatsApp</span>
                </div>
                <p className="text-xs text-foreground font-medium italic leading-relaxed">
                  "Why ion thrusters produce low thrust but astronomical specific impulse (3000+ s) compared to chemical rockets..."
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Propulsion</span>
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Deep Space</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Daily Fact</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">90+ Total Drops</span>
              <a
                href={SITE.communityUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <span>Read in Community</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </SpotlightCard>

          {/* 3. ISRO & EXPERT MASTERCLASSES (Span 4 cols) */}
          <SpotlightCard
            spotlightColor="rgba(245, 158, 11, 0.2)"
            className="lg:col-span-4 flex flex-col justify-between border border-amber-500/20 bg-slate-950/80 p-6 md:p-7"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold text-amber-400">
                  <Sparkles className="size-3.5" />
                  MASTERCLASSES
                </span>
                <span className="font-mono text-xs text-muted-foreground">10+ Sessions</span>
              </div>

              <h3 className="text-xl font-display font-bold text-foreground">ISRO & Industry Mentors</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Direct interactive workshops with scientists from ISRO Master Control Facility, propulsion researchers, and university professors.
              </p>

              <div className="mt-4 space-y-2.5">
                <div className="p-3 rounded-lg border border-border bg-surface-2 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    AG
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-foreground">Ankit Gupta</p>
                    <p className="text-[11px] text-muted-foreground">Scientist 'SC', ISRO MCF</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-2 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    PV
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-foreground">Prakhar Vishwakarma</p>
                    <p className="text-[11px] text-muted-foreground">Missile Man of MP · Aerospace Lead</p>
                  </div>
                </div>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="mt-6 w-full rounded-full border-white/20 hover:border-amber-400/50">
              <Link to="/programs" className="flex items-center justify-center gap-1.5">
                <span>View Session Archives</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </SpotlightCard>

          {/* 4. SKY ATLAS & OBSERVATIONAL ASTRONOMY (Span 4 cols) */}
          <SpotlightCard
            spotlightColor="rgba(197, 157, 255, 0.2)"
            className="lg:col-span-4 flex flex-col justify-between border border-primary/20 bg-slate-950/80 p-6 md:p-7"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono font-bold text-primary">
                  <Orbit className="size-3.5" />
                  SKY ATLAS
                </span>
                <span className="font-mono text-xs text-emerald-400">Live Observation Logs</span>
              </div>

              <h3 className="text-xl font-display font-bold text-foreground">Sky Atlas Network</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                An open, student-maintained deep-sky catalog and constellation mapping database built from our community night observation challenges.
              </p>

              <div className="mt-4 p-3 rounded-lg border border-border bg-surface-2 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Catalogs:</span>
                  <span className="text-foreground">Messier + NGC + IC</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Coord System:</span>
                  <span className="text-foreground">J2000 RA / Dec</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Telemetry:</span>
                  <span className="text-primary font-bold">Open Access Stargazing</span>
                </div>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="mt-6 w-full rounded-full border-white/20 hover:border-primary/50">
              <Link to="/projects" className="flex items-center justify-center gap-1.5">
                <span>Explore Sky Atlas</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </SpotlightCard>

          {/* 5. OPEN RESEARCH & PUBLICATIONS (Span 4 cols) */}
          <SpotlightCard
            spotlightColor="rgba(56, 189, 248, 0.2)"
            className="lg:col-span-4 flex flex-col justify-between border border-accent/20 bg-slate-950/80 p-6 md:p-7"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono font-bold text-accent">
                  <FileText className="size-3.5" />
                  PUBLICATIONS
                </span>
                <span className="font-mono text-xs text-muted-foreground">Open Access</span>
              </div>

              <h3 className="text-xl font-display font-bold text-foreground">Student Research & Papers</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Encouraging school and college students to draft authentic literature reviews, simulation papers, and astronomical observation logs.
              </p>

              <div className="mt-4 p-3 rounded-lg border border-border bg-surface-2 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground">Peer-reviewed format & methodology</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground">Sky Atlas community observation logs</span>
                </div>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="mt-6 w-full rounded-full border-white/20 hover:border-accent/50">
              <Link to="/get-involved" className="flex items-center justify-center gap-1.5">
                <span>Join Research Cohort</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
