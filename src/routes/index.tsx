import { createFileRoute, Link } from "@tanstack/react-router";
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
  Sparkles,
  Zap,
  Github,
  FileCheck2,
  Users,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroProductPreview } from "@/components/site/HeroProductPreview";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import {
  SITE,
  STATS,
  PROJECTS,
  BUILD_SQUADS,
  HOW_IT_WORKS_STEPS,
  VERIFIED_DELIVERABLES,
  THREE_PILLARS,
} from "@/lib/site";
import polarisLogoWebp from "@/assets/polaris-logo.webp";
import polarisLogo from "@/assets/polaris-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Build Real Engineering Projects" },
      {
        name: "description",
        content:
          "Project Polaris is a student engineering ecosystem where ambitious students build simulations, software, research projects and physical systems with mentors and peers.",
      },
      { property: "og:title", content: "Project Polaris — Build Real Engineering Projects" },
      {
        property: "og:description",
        content:
          "Where curiosity becomes action. Open-source aerospace simulation platforms, active build squads, and student-led research cohorts.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 border-b border-white/8">
        {/* Subtle Constellation Starfield in Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <ConstellationCanvas />
        </div>

        {/* Ambient Backlight Cones */}
        <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 size-80 bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="shell relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
            {/* Left Column: Product Positioning & Value Proposition */}
            <div>
              {/* Slogan Manifesto Chip */}
              <ScrollReveal direction="fade">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl px-4 py-1.5 text-xs text-muted-foreground mb-6 shadow-sm">
                  <picture>
                    <source srcSet={polarisLogoWebp} type="image/webp" />
                    <img
                      src={polarisLogo}
                      alt="Project Polaris Logo"
                      className="size-4 rounded-full object-cover ring-1 ring-primary/40"
                    />
                  </picture>
                  <span className="font-semibold text-foreground">Project Polaris</span>
                  <span className="text-white/20">|</span>
                  <span className="text-primary font-mono text-[11px]">
                    Learning through Building, rather than Building after learning
                  </span>
                </div>
              </ScrollReveal>

              {/* Bold Product Headline */}
              <ScrollReveal direction="up" delay={60}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.08]">
                  Build real engineering{" "}
                  <span className="bg-gradient-to-r from-primary via-[#e8d7ff] to-gold bg-clip-text text-transparent">
                    projects.
                  </span>
                </h1>
                <p className="mt-2 text-2xl sm:text-3xl font-display italic text-foreground/80 font-normal">
                  Learn everything you need along the way.
                </p>
              </ScrollReveal>

              {/* Exact Product Definition */}
              <ScrollReveal direction="up" delay={120}>
                <p className="mt-5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-body max-w-xl">
                  Project Polaris is a student-led engineering ecosystem where ambitious students build simulations, software, research projects, and physical systems with mentors and peers.
                </p>
              </ScrollReveal>

              {/* Two Clear Focused CTAs */}
              <ScrollReveal direction="up" delay={180}>
                <div className="mt-8 flex flex-wrap items-center gap-3.5 font-mono text-xs">
                  <Button
                    asChild
                    size="default"
                    className="h-11 px-7 rounded-full font-bold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 shadow-[0_4px_20px_rgba(197,157,255,0.3)] transition-all active:scale-95"
                  >
                    <Link to="/projects" className="flex items-center gap-2">
                      <span>Start Building</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="h-11 px-6 rounded-full font-medium border-white/15 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] hover:border-primary/40 transition-all active:scale-95 text-foreground"
                  >
                    <Link to="/projects">Explore Projects</Link>
                  </Button>
                </div>

                {/* Minimal Credibility Strip */}
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <span>40+ Physics Solvers</span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span>100% Free & Open Source</span>
                  <span className="text-white/20">•</span>
                  <span>Built by Students</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Live AeroForge Simulator Product HUD */}
            <ScrollReveal direction="up" delay={140}>
              <HeroProductPreview />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 2. THREE PILLARS: BUILD · LEARN · CONNECT ── */}
      <section className="border-b border-white/8 bg-surface-2/30 py-12">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-3">
            {THREE_PILLARS.map((pillar, i) => (
              <ScrollReveal key={pillar.key} direction="up" delay={i * 60}>
                <div className="p-6 rounded-2xl border border-white/8 bg-surface/60 backdrop-blur-xl hover:border-primary/30 transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25">
                        {pillar.key}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">{pillar.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold font-display text-foreground">{pillar.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BUILT, NOT WATCHED: REAL PROJECTS ── */}
      <section className="section border-b border-white/8" id="projects-showcase">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Built, Not Watched
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Real projects. Real teams. Real artifacts.
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-body">
                  Ambitious engineering initiatives with defined milestones, code repositories, and deliverables.
                </p>
              </div>

              <Button asChild variant="outline" size="sm" className="font-mono text-xs border-white/15 hover:border-primary/40">
                <Link to="/projects" className="flex items-center gap-1.5">
                  <span>View all projects</span>
                  <ArrowRight className="size-3 text-primary" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Project Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p, idx) => (
              <ScrollReveal key={p.slug} direction="up" delay={idx * 60}>
                <article className="p-6 md:p-8 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    {/* Header: Domain & Squad Progress */}
                    <div className="flex items-center justify-between text-xs font-mono mb-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[10px]">
                        {p.category}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{p.members}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">{p.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                      {p.blurb}
                    </p>

                    {/* Metadata: Level, Time, Stack */}
                    <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-2/60 border border-white/6 font-mono text-[11px]">
                      <div>
                        <span className="text-muted-foreground uppercase text-[9px] block">Level</span>
                        <span className="text-foreground font-semibold block mt-0.5">{p.level}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground uppercase text-[9px] block">Timeline</span>
                        <span className="text-primary font-semibold block mt-0.5">{p.duration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground uppercase text-[9px] block">Progress</span>
                        <span className="text-emerald-400 font-semibold block mt-0.5">{p.progress}%</span>
                      </div>
                    </div>

                    {/* Build Roadmap Preview */}
                    <div className="mt-4 pt-3 border-t border-white/6">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                        Build Roadmap
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
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground text-[11px]">{p.stack}</span>
                    <Button asChild size="sm" className="h-8 px-4 font-mono text-xs bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90">
                      <Link to="/projects" className="flex items-center gap-1.5">
                        <span>View Project</span>
                        <ArrowRight className="size-3 text-primary" />
                      </Link>
                    </Button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW POLARIS WORKS ── */}
      <section className="section border-b border-white/8 bg-surface-2/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                The Build Framework
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                How Polaris Works
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-body">
                Theory becomes useful when you build with it. Follow a structured path from question to shipped artifact.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {HOW_IT_WORKS_STEPS.map((s, i) => (
              <ScrollReveal key={s.step} direction="up" delay={i * 50}>
                <div className="p-6 rounded-2xl border border-white/8 bg-surface/70 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/30 transition-colors">
                  <div>
                    <div className="text-primary font-bold text-base mb-3 font-mono">{s.step}</div>
                    <h3 className="text-base font-bold font-display text-foreground mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed font-body">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/6 text-[10px] text-primary/80 uppercase">
                    Step {i + 1} of 4
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FLAGSHIP ENGINEERING LAB: AEROFORGE ── */}
      <section className="section border-b border-white/8" id="aeroforge-lab">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">FLAGSHIP PLATFORM</span>
                <span className="text-white/20">|</span>
                <span className="text-gold">100% Free & Open Source</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground">
                Don't just learn aerospace engineering.{" "}
                <span className="bg-gradient-to-r from-primary via-[#e8d7ff] to-gold bg-clip-text text-transparent">
                  Experiment with it.
                </span>
              </h2>
              <p className="mt-3 text-xs sm:text-base text-muted-foreground leading-relaxed font-body">
                AeroForge AI is a browser-based aerospace & physics simulation workstation built by student engineers. Run 40+ numerical solvers across transonic CFD aerodynamics, structural FEA, and orbital Keplerian astrodynamics.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive AeroForge Embedded Demonstration */}
          <ScrollReveal direction="up" delay={60}>
            <InteractiveAeroForgeDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. FIND YOUR SQUAD (BUILD SQUADS) ── */}
      <section className="section border-b border-white/8 bg-surface-2/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Sprint Teams
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Find Your Build Squad
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-body">
                  Collaborate with peers who are working toward the same technical milestones.
                </p>
              </div>

              <Button asChild variant="outline" size="sm" className="font-mono text-xs border-white/15 hover:border-primary/40">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                  <span>Explore all squads</span>
                  <ArrowUpRight className="size-3 text-gold" />
                </a>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUILD_SQUADS.map((squad, i) => (
              <ScrollReveal key={squad.id} direction="up" delay={i * 40}>
                <div className="p-5 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="px-2 py-0.5 rounded bg-surface-2 text-primary font-bold text-[10px]">
                        {squad.category}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{squad.level}</span>
                    </div>

                    <h3 className="text-base font-bold font-display text-foreground">{squad.name}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-mono">{squad.stack}</p>

                    <div className="mt-3 p-2.5 rounded-lg bg-surface-2/60 border border-white/6 text-xs">
                      <span className="text-[10px] text-muted-foreground uppercase block font-mono">Current Goal</span>
                      <span className="text-foreground text-[11px] font-body mt-0.5 block">{squad.currentMilestone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground text-[11px]">{squad.members}</span>
                    <Button asChild size="sm" className="h-7 px-3 text-[11px] font-mono font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-md">
                      <Link to="/join">Join Squad</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHAT YOU LEAVE WITH (OUTCOMES & DELIVERABLES) ── */}
      <section className="section border-b border-white/8">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                Artifacts Over Certificates
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                What You Leave With
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-body">
                Students don't need another generic PDF certificate. You finish each project with demonstrable technical artifacts.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VERIFIED_DELIVERABLES.map((del, i) => (
              <ScrollReveal key={del.title} direction="up" delay={i * 40}>
                <div className="p-5 rounded-2xl border border-white/8 bg-surface/60 backdrop-blur-xl flex items-start gap-3.5 h-full hover:border-primary/30 transition-colors">
                  <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Check className="size-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-display text-foreground">{del.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed font-body">{del.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. AUTHENTIC PROOF & COMMUNITY METRICS ── */}
      <section className="border-b border-white/8 bg-surface-2/40 py-12">
        <div className="shell">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center font-mono">
            {STATS.map((s, idx) => (
              <ScrollReveal key={s.label} direction="up" delay={idx * 30}>
                <div className="p-4 rounded-xl border border-white/8 bg-surface/80 backdrop-blur-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">{s.value}</div>
                  <div className="text-xs font-semibold text-foreground mt-1">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{s.note}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CALL TO ACTION ── */}
      <section className="section bg-gradient-to-b from-surface/40 to-background">
        <div className="shell text-center max-w-2xl mx-auto space-y-5">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-2">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground">
              Ready to build something real?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
              Join hundreds of student builders, researchers, and engineers across open build squads. No barriers, no inflated promises.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3.5 font-mono text-xs">
              <Button
                asChild
                size="default"
                className="h-11 px-8 rounded-full font-bold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 shadow-lg transition-transform active:scale-95"
              >
                <Link to="/projects" className="flex items-center gap-2">
                  <span>Start Building Now</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="h-11 px-6 rounded-full font-medium border-white/15 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] hover:border-primary/40 text-foreground"
              >
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5 text-emerald-400" />
                  <span>Join WhatsApp Community</span>
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
