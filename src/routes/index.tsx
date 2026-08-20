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
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoGrid } from "@/components/site/BentoGrid";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE, STATS, BRAND_POSITIONING, TEAM_MEMBERS } from "@/lib/site";
import polarisLogoWebp from "@/assets/polaris-logo.webp";
import polarisLogo from "@/assets/polaris-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Learn by Building Rather Than Building After Learning" },
      {
        name: "description",
        content:
          "Project Polaris is a student-led experiential engineering and research ecosystem. Learn by building rather than building after learning.",
      },
      { property: "og:title", content: "Project Polaris — Learn by Building Rather Than Building After Learning" },
      {
        property: "og:description",
        content:
          "Where curiosity becomes action. Open-source aerospace simulation platforms, daily science drops, and student-led research cohorts.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [activeWorkbenchTab, setActiveWorkbenchTab] = useState<"aeroforge" | "skyatlas" | "digest">("aeroforge");

  return (
    <>
      {/* ── HERO SECTION WITH INTERACTIVE CONSTELLATION BACKDROP ── */}
      <section className="relative pt-24 pb-16 md:pt-36 md:pb-28 border-b border-border overflow-hidden">
        {/* Dynamic interactive starfield backdrop */}
        <ConstellationCanvas className="opacity-40 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/4 right-10 size-[300px] bg-gold/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="shell relative z-10">
          <div className="max-w-4xl">
            {/* Minimalist Brand Logo & Status Chip */}
            <ScrollReveal direction="fade">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl px-4 py-1.5 text-xs text-muted-foreground mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
                <picture>
                  <source srcSet={polarisLogoWebp} type="image/webp" />
                  <img
                    src={polarisLogo}
                    alt="Project Polaris Official Logo"
                    className="size-4 rounded-full object-cover ring-1 ring-primary/40"
                  />
                </picture>
                <span className="font-semibold text-foreground">Project Polaris</span>
                <span className="text-white/20">|</span>
                <span className="text-primary font-mono text-[11px]">Experiential Learning Ecosystem</span>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </ScrollReveal>

            {/* Official Brand Headline & Caption */}
            <ScrollReveal direction="up" delay={80}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.08]">
                Learn by building{" "}
                <span className="block mt-1 sm:mt-2 text-3xl sm:text-5xl md:text-6xl font-normal italic bg-gradient-to-r from-primary via-[#e8d7ff] to-gold bg-clip-text text-transparent">
                  rather than building after learning.
                </span>
              </h1>
            </ScrollReveal>

            {/* Value Proposition */}
            <ScrollReveal direction="up" delay={140}>
              <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-body">
                We are a student-led ecosystem bridging traditional education and real-world engineering through interactive physics simulation platforms, deep-sky astronomy networks, and peer-reviewed research cohorts.
              </p>
            </ScrollReveal>

            {/* Primary Actions */}
            <ScrollReveal direction="up" delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button asChild size="default" className="h-11 px-7 rounded-full font-semibold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 font-mono text-xs shadow-[0_4px_20px_rgba(197,157,255,0.3)] transition-all duration-300 active:scale-95">
                  <Link to="/projects" className="flex items-center gap-2">
                    <FolderKanban className="size-4 text-background" />
                    <span>Explore Project Builds</span>
                    <ArrowRight className="size-3.5 text-background" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="h-11 px-6 rounded-full font-medium border-white/12 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] font-mono text-xs hover:border-primary/40 transition-all duration-300 active:scale-95 shadow-sm">
                  <Link to="/join" className="flex items-center gap-2">
                    <Sparkles className="size-4 text-gold" />
                    <span>Join Build Squads</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="default" className="h-11 px-4 text-xs font-mono text-muted-foreground hover:text-foreground rounded-full hover:bg-white/[0.04]">
                  <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                    <span className="text-[#e8d7ff]">WhatsApp Community</span>
                    <ArrowUpRight className="size-3.5 text-gold" />
                  </a>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* ── WORKBENCH PREVIEW CONTAINER (APPLE GLASS) ── */}
          <ScrollReveal direction="up" delay={260}>
            <div className="mt-16 rounded-2xl border border-white/10 bg-surface/75 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden">
              {/* Top Toolbar */}
              <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-5 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-destructive/60 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                  <span className="size-2.5 rounded-full bg-gold/60 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                  <span className="size-2.5 rounded-full bg-emerald-400/60 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                    polaris://active-engineering-workbench
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {(["skyatlas", "digest", "outreach"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveWorkbenchTab(tab as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                        activeWorkbenchTab === tab
                          ? "bg-primary/20 text-primary font-bold border border-primary/30 shadow-[0_2px_10px_rgba(197,157,255,0.15)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                      }`}
                    >
                      {tab === "skyatlas" && "Sky Atlas Deep-Sky"}
                      {tab === "digest" && "Research Telemetry"}
                      {tab === "outreach" && "Schools Lab Kits"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Workbench Content */}
              <div className="p-6 md:p-8">
                {(activeWorkbenchTab === "skyatlas" || (activeWorkbenchTab as string) === "aeroforge") && (
                  <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                        <Orbit className="size-3 text-primary" />
                        <span>DEEP-SKY OBSERVATION NETWORK</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                        Sky Atlas Astrophotography & Celestial Database
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                        An open observational registry and deep-sky catalog curated by students during community night-sky challenges, telescope workshops, and astrophotography sessions.
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2.5 font-mono text-xs">
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Cataloged</div>
                          <div className="text-sm font-bold text-foreground mt-0.5">180+ Targets</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Observations</div>
                          <div className="text-sm font-bold text-primary mt-0.5">Verified</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Open Data</div>
                          <div className="text-sm font-bold text-gold mt-0.5">FITS / PNG</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-3 font-mono">
                        <Button asChild size="sm" className="h-8 px-4 text-xs bg-foreground text-background font-medium">
                          <Link to="/projects">Explore Projects →</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Sky Atlas Telemetry Visual Box */}
                    <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                        <span className="text-primary font-semibold">M42 Orion Nebula</span>
                        <span className="text-[11px] text-emerald-400 font-bold">● RESOLVED</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Right Ascension (RA):</span>
                          <span className="text-foreground">05h 35m 17.3s</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Declination (Dec):</span>
                          <span className="text-foreground">-05° 23′ 28″</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="text-primary font-bold">1,344 light-years</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Spectral Filter:</span>
                          <span className="text-gold font-bold">H-alpha + OIII</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWorkbenchTab === "skyatlas" && (
                  <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                        <Orbit className="size-3" />
                        <span>DEEP-SKY OBSERVATION NETWORK</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                        Sky Atlas Astrophotography Database
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                        An open observational registry and deep-sky catalog curated by students during community night-sky challenges, telescope workshops, and astrophotography sessions.
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2.5 font-mono text-xs">
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Cataloged</div>
                          <div className="text-sm font-bold text-foreground mt-0.5">180+ Targets</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Observations</div>
                          <div className="text-sm font-bold text-primary mt-0.5">Verified</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Open Data</div>
                          <div className="text-sm font-bold text-gold mt-0.5">FITS / PNG</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-3 font-mono">
                        <Button asChild size="sm" className="h-8 px-4 text-xs bg-foreground text-background font-medium">
                          <Link to="/projects">Explore Catalog →</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Sky Atlas Telemetry Visual Box */}
                    <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                        <span className="text-primary font-semibold">M42 Orion Nebula</span>
                        <span className="text-[11px] text-emerald-400 font-bold">● RESOLVED</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Right Ascension (RA):</span>
                          <span className="text-foreground">05h 35m 17.3s</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Declination (Dec):</span>
                          <span className="text-foreground">-05° 23′ 28″</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="text-primary font-bold">1,344 light-years</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Spectral Filter:</span>
                          <span className="text-gold font-bold">H-alpha + OIII</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWorkbenchTab === "digest" && (
                  <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                        <Sparkles className="size-3 text-gold" />
                        <span>DAILY SCIENTIFIC INQUIRY</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                        Aaj Ka Gyan & Research Summaries
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                        Curated daily science drops based on weekly themes. Published every morning to make curiosity and technical rigor a consistent habit.
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2.5 font-mono text-xs">
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Daily Drops</div>
                          <div className="text-sm font-bold text-foreground mt-0.5">90+ Issues</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Community</div>
                          <div className="text-sm font-bold text-primary mt-0.5">120+ Active</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Cadence</div>
                          <div className="text-sm font-bold text-gold mt-0.5">Mon–Fri</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-3 font-mono">
                        <Button asChild size="sm" className="h-8 px-4 text-xs bg-foreground text-background font-medium">
                          <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                            Join WhatsApp Drops →
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Digest Visual Box */}
                    <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                        <span className="text-primary font-semibold">Today's Topic: Rocket Propulsion</span>
                        <span className="text-[11px] text-primary font-bold">● DROP #92</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-body">
                        "The Tsiolkovsky rocket equation shows that increasing specific impulse (Isp) yields exponential fuel mass savings compared to simply increasing structural mass."
                      </p>
                      <div className="p-2 rounded bg-surface-2 text-[11px] text-foreground font-mono">
                        Δv = I_sp · g_0 · ln(m_0 / m_f)
                      </div>
                    </div>
                  </div>
                )}

                {activeWorkbenchTab === "outreach" && (
                  <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                        <Sparkles className="size-3 text-gold" />
                        <span>K-12 EXPERIENTIAL LEARNING</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                        School Outreach & Laboratory Kits
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                        Curriculum modules, telescope night kits, and space science challenges designed to turn traditional school science clubs into active engineering labs.
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2.5 font-mono text-xs">
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Students Reached</div>
                          <div className="text-sm font-bold text-foreground mt-0.5">500+ Active</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Tiers</div>
                          <div className="text-sm font-bold text-primary mt-0.5">4 Formats</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-surface-2">
                          <div className="text-muted-foreground text-[10px] uppercase">Cost</div>
                          <div className="text-sm font-bold text-emerald-400 mt-0.5">Free Kits</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-3 font-mono">
                        <Button asChild size="sm" className="h-8 px-4 text-xs bg-foreground text-background font-medium">
                          <Link to="/schools">Explore School Kits →</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Outreach Visual Box */}
                    <div className="rounded-lg border border-border bg-background p-4 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                        <span className="text-primary font-semibold">Laboratory Modules</span>
                        <span className="text-[11px] text-emerald-400 font-bold">● READY TO RUN</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Optics & Telescopes:</span>
                          <span className="text-foreground">Dobsonian / Refractor assembly</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Rocketry Physics:</span>
                          <span className="text-foreground">Stomp & water rocket telemetry</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Orbital Mechanics:</span>
                          <span className="text-primary font-bold">2-Body gravity simulator</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── BRAND POSITIONING SECTION ── */}
      <section className="border-b border-border bg-surface-2/40 py-16">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold">
                Brand Identity & Positioning
              </span>
              <div className="space-y-2 text-base sm:text-lg text-muted-foreground font-body leading-relaxed">
                <p className="font-medium text-foreground/80">{BRAND_POSITIONING.line1}</p>
                <p className="font-medium text-foreground/80">{BRAND_POSITIONING.line2}</p>
                <p className="text-foreground text-lg sm:text-xl font-bold font-display text-primary pt-2">
                  {BRAND_POSITIONING.line3}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-border bg-gradient-to-r from-surface-2/60 via-surface/80 to-surface-2/60 py-10">
        <div className="shell">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {STATS.map((s, idx) => (
              <ScrollReveal key={s.label} direction="up" delay={idx * 30}>
                <div className="p-4 rounded-xl border border-border/80 bg-surface/80 backdrop-blur hover:border-primary/40 transition-all group">
                  <div className="text-2xl sm:text-3xl font-bold font-mono bg-gradient-to-r from-primary via-[#e8d7ff] to-gold bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-1.5 leading-snug">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block line-clamp-1">{s.note}</div>
                </div>
              </ScrollReveal>
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
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground leading-tight">
                Students spend years memorizing theories without ever building a system.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-xs sm:text-sm font-body">
                Standard curricula focus on high-stakes testing and textbook definitions. Students rarely get to touch simulation solvers, debug real data, or publish verified findings with mentors.
              </p>
              <p className="mt-3 text-[#e8d7ff] font-semibold leading-relaxed text-xs sm:text-sm font-body">
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
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                Software, physics solvers & observational data.
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="font-mono text-xs">
              <Link to="/projects" className="flex items-center gap-1.5">
                <span>View all projects & simulators</span>
                <ArrowRight className="size-3 text-primary" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: AeroForge */}
            <div className="card-premium p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                  <span className="text-primary font-semibold">Aerospace & CFD</span>
                  <span className="text-emerald-400">● 50+ Solvers</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">AeroForge AI Suite</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  40+ numerical physics solvers across supersonic aerodynamics, orbital maneuvers, and structural finite element analysis.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">Embedded in Projects</span>
                <Link to="/projects" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 font-mono">
                  <span>Launch Lab</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Sky Atlas */}
            <div className="card-premium p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                  <span className="text-primary font-semibold">Astrophysics</span>
                  <span className="text-gold">● Active Squad</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Sky Atlas Network</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  Community-maintained deep-sky catalog mapping Messier, NGC, and IC celestial objects using observational telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">110 Objects</span>
                <Link to="/projects" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 font-mono">
                  <span>Explore</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Research Digest */}
            <div className="card-premium p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
                  <span className="text-gold font-semibold">Scientific Inquiries</span>
                  <span className="text-primary">● Weekly</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Polaris Research Digest</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  Peer-reviewed literature summaries, verification papers, and student fellowship documentation across space technology.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">Student Authors</span>
                <Link to="/programs" className="text-xs text-gold font-semibold hover:underline flex items-center gap-1 font-mono">
                  <span>Read Digest</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE TEAM LEADERSHIP (FROM CANVA) ── */}
      <section className="section border-b border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Core Leadership
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  Meet the Team Behind Project Polaris
                </h2>
                <p className="mt-1 text-xs text-muted-foreground font-body">
                  Student founders, department heads, and volunteers building the next generation of experiential learning.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10">
                <Link to="/about">
                  <span>Full Team & Values</span>
                  <ArrowRight className="size-3 ml-1" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <ScrollReveal key={member.name} direction="up" delay={i * 40}>
                <div className="card-premium p-5 flex flex-col justify-between h-full hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/15 text-primary border border-primary/25 font-bold uppercase">
                        {member.role}
                      </span>
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold font-display text-foreground">{member.name}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed font-body">{member.note}</p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Project Polaris</span>
                    <span className="text-primary">Core Member</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
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
