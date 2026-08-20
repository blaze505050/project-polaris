import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Flame,
  FileText,
  Hammer,
  Users,
  Cpu,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroProductPreview } from "@/components/site/HeroProductPreview";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import {
  LEARNING_CATALOG,
  LEARNING_LADDER,
  START_HERE_INTENTS,
  TOPIC_LABELS,
  type Topic,
  type LearningItem,
} from "@/lib/learning";
import { SITE, STATS } from "@/lib/site";
import polarisLogoWebp from "@/assets/polaris-logo.webp";
import polarisLogo from "@/assets/polaris-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Experiential Learning Platform for Science & Engineering" },
      {
        name: "description",
        content:
          "Learn science by doing it. Interactive workshops, practical courses, expert-led bootcamps, and hands-on engineering projects for curious students.",
      },
      { property: "og:title", content: "Project Polaris — Experiential Learning Platform" },
      {
        property: "og:description",
        content:
          "Practical learning in science, engineering and technology — through workshops, courses, bootcamps, resources and real projects.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">("all");

  const filteredItems = useMemo(() => {
    if (selectedTopic === "all") return LEARNING_CATALOG.slice(0, 6);
    return LEARNING_CATALOG.filter((item) => item.topics.includes(selectedTopic));
  }, [selectedTopic]);

  // "What's happening now" items
  const featuredWorkshop = LEARNING_CATALOG.find((i) => i.id === "ws-rocket-propulsion");
  const featuredCourse = LEARNING_CATALOG.find((i) => i.id === "course-orbital-mechanics");
  const featuredBootcamp = LEARNING_CATALOG.find((i) => i.id === "bootcamp-aerospace-systems");

  return (
    <>
      {/* ── 1. LEARNING-FIRST HERO SECTION ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 border-b border-white/8">
        {/* Ambient Stars & Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <ConstellationCanvas />
        </div>
        <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 size-80 bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="shell relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
            {/* Left Column: Learning-First Positioning */}
            <div>
              {/* Manifesto Slogan Chip */}
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
                    Learn science by doing it
                  </span>
                </div>
              </ScrollReveal>

              {/* Bold Headline */}
              <ScrollReveal direction="up" delay={60}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.08]">
                  Learn science by{" "}
                  <span className="bg-gradient-to-r from-primary via-[#e8d7ff] to-gold bg-clip-text text-transparent">
                    doing it.
                  </span>
                </h1>
                <p className="mt-2 text-2xl sm:text-3xl font-display italic text-foreground/80 font-normal">
                  Learn beyond the classroom. Build beyond the textbook.
                </p>
              </ScrollReveal>

              {/* Expanded Clear Subhead */}
              <ScrollReveal direction="up" delay={120}>
                <p className="mt-5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-body max-w-xl">
                  Interactive workshops, practical courses, expert-led bootcamps, and hands-on engineering projects for curious students in science, engineering, and technology.
                </p>
              </ScrollReveal>

              {/* Two Primary CTAs */}
              <ScrollReveal direction="up" delay={180}>
                <div className="mt-8 flex flex-wrap items-center gap-3.5 font-mono text-xs">
                  <Button
                    asChild
                    size="default"
                    className="h-11 px-7 rounded-full font-bold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 shadow-[0_4px_20px_rgba(197,157,255,0.3)] transition-all active:scale-95"
                  >
                    <Link to="/courses" className="flex items-center gap-2">
                      <span>Explore Learning</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="h-11 px-6 rounded-full font-medium border-white/15 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] hover:border-primary/40 text-foreground transition-all active:scale-95"
                  >
                    <Link to="/courses" search={{ type: "workshop" }}>
                      Upcoming Workshops
                    </Link>
                  </Button>
                </div>

                {/* Micro Credibility */}
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Workshops · Courses · Bootcamps · Projects</span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span>100% Free Open Knowledge</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Live Aerodynamic / Physics Interactive Simulator */}
            <ScrollReveal direction="up" delay={140}>
              <HeroProductPreview />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT'S HAPPENING NOW (LIVE & UPCOMING CARDS) ── */}
      <section className="border-b border-white/8 bg-surface-2/30 py-12">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-foreground uppercase tracking-wider">What's Happening Now</span>
                <span className="text-muted-foreground hidden sm:inline">— Learn something new this week</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-mono text-primary hover:text-primary">
                <Link to="/courses">View full calendar →</Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
            {/* 1. Upcoming Workshop */}
            {featuredWorkshop && (
              <ScrollReveal direction="up" delay={0}>
                <div className="p-5 rounded-2xl border border-primary/25 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-bold text-[10px] uppercase">
                        🚀 LIVE WORKSHOP
                      </span>
                      <span className="text-[11px] text-gold font-semibold">{featuredWorkshop.duration}</span>
                    </div>
                    <h3 className="text-base font-bold font-display text-foreground">{featuredWorkshop.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-body leading-relaxed">
                      {featuredWorkshop.subtitle}
                    </p>
                    <div className="mt-3 text-[11px] text-primary/80">
                      With {featuredWorkshop.instructor?.name} ({featuredWorkshop.instructor?.org})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">{featuredWorkshop.date}</span>
                    <Button asChild size="sm" className="h-7 px-3 text-[11px] bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90">
                      <a href={featuredWorkshop.link} target="_blank" rel="noreferrer">
                        Reserve Seat →
                      </a>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* 2. Mini-Course */}
            {featuredCourse && (
              <ScrollReveal direction="up" delay={60}>
                <div className="p-5 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-2 text-primary border border-white/8 font-bold text-[10px] uppercase">
                        🎓 MINI COURSE
                      </span>
                      <span className="text-[11px] text-muted-foreground">{featuredCourse.duration}</span>
                    </div>
                    <h3 className="text-base font-bold font-display text-foreground">{featuredCourse.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-body leading-relaxed">
                      {featuredCourse.subtitle}
                    </p>
                    <div className="mt-3 text-[11px] text-emerald-400">
                      Final Project: {featuredCourse.finalProject?.title}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px] capitalize">{featuredCourse.level}</span>
                    <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[11px] border-white/15 hover:border-primary/40 rounded-lg">
                      <Link to="/courses">Start Course →</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* 3. Intensive Bootcamp */}
            {featuredBootcamp && (
              <ScrollReveal direction="up" delay={120}>
                <div className="p-5 rounded-2xl border border-gold/20 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-gold/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/25 font-bold text-[10px] uppercase">
                        ⚡ BOOTCAMP
                      </span>
                      <span className="text-[11px] text-muted-foreground">{featuredBootcamp.duration}</span>
                    </div>
                    <h3 className="text-base font-bold font-display text-foreground">{featuredBootcamp.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-body leading-relaxed">
                      {featuredBootcamp.subtitle}
                    </p>
                    <div className="mt-3 text-[11px] text-gold/90">
                      {featuredBootcamp.seats}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">{featuredBootcamp.date}</span>
                    <Button asChild size="sm" className="h-7 px-3 text-[11px] bg-gold text-background font-bold rounded-lg hover:bg-gold/90">
                      <a href={featuredBootcamp.link} target="_blank" rel="noreferrer">
                        Apply →
                      </a>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. THE POLARIS LEARNING LADDER ── */}
      <section className="section border-b border-white/8" id="learning-ladder">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                The Learning Ladder
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                How do you want to learn?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-body">
                Four distinct formats tailored to your pace, depth, and engineering ambition.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-mono">
            {LEARNING_LADDER.map((ladder, i) => (
              <ScrollReveal key={ladder.title} direction="up" delay={i * 50}>
                <div className="p-6 rounded-2xl border border-white/8 bg-surface/75 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-primary font-bold">{ladder.step}</span>
                      <span className="text-[11px] text-muted-foreground">{ladder.time}</span>
                    </div>
                    <h3 className="text-lg font-bold font-display text-foreground">{ladder.title}</h3>
                    <span className="inline-block mt-1 text-[11px] font-bold text-gold">{ladder.badge}</span>
                    <p className="mt-2.5 text-xs text-muted-foreground font-body leading-relaxed">
                      {ladder.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/6">
                    <Button asChild variant="ghost" size="sm" className="w-full justify-between h-8 text-xs font-mono text-primary hover:text-foreground px-1">
                      <Link to={ladder.to}>
                        <span>Explore {ladder.title}</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. LEARNING EXPLORER BY TOPIC ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="learning-explorer">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Catalog Explorer
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Explore by Topic
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-body">
                  Science, aerospace, astrophysics, programming, and computational simulation.
                </p>
              </div>

              <Button asChild variant="outline" size="sm" className="font-mono text-xs border-white/15 hover:border-primary/40">
                <Link to="/courses">Browse All ({LEARNING_CATALOG.length})</Link>
              </Button>
            </div>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedTopic("all")}
                className={`px-3.5 py-1.5 rounded-full transition-colors ${
                  selectedTopic === "all"
                    ? "bg-foreground text-background font-bold"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                }`}
              >
                All Domains
              </button>
              {(Object.keys(TOPIC_LABELS) as Topic[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTopic(key)}
                  className={`px-3.5 py-1.5 rounded-full transition-colors ${
                    selectedTopic === key
                      ? "bg-foreground text-background font-bold"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                  }`}
                >
                  {TOPIC_LABELS[key]}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Filtered Learning Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 font-mono">
            {filteredItems.map((item, idx) => (
              <ScrollReveal key={item.id} direction="up" delay={idx * 40}>
                <article className="p-6 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{item.duration}</span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-foreground">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground font-body leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1 text-[10px]">
                      {item.topics.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-surface-2 border border-white/6 text-muted-foreground">
                          {TOPIC_LABELS[t]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 text-[11px] font-semibold uppercase">{item.status}</span>
                    <Button asChild size="sm" className="h-8 px-3.5 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                      <Link to="/courses" className="flex items-center gap-1">
                        <span>{item.ctaText || "View Details"}</span>
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

      {/* ── 5. START HERE (INTENT-BASED ROUTE PICKER) ── */}
      <section className="section border-b border-white/8">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                Personalized Pathways
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                Not sure where to start?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-body">
                Choose the statement that fits your current time and learning goal.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
            {START_HERE_INTENTS.map((intent, i) => (
              <ScrollReveal key={intent.intent} direction="up" delay={i * 40}>
                <Link
                  to={intent.to}
                  className="p-5 rounded-2xl border border-white/8 bg-surface/60 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 hover:bg-surface/80 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gold font-bold text-[11px]">{intent.intent}</span>
                      <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-surface-2">
                        {intent.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
                      {intent.heading}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-body leading-relaxed">
                      {intent.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center text-xs text-primary font-bold gap-1">
                    <span>Go to path</span>
                    <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FEATURED LAB: AEROFORGE ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="aeroforge-lab">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">POLARIS LEARNING LAB</span>
                <span className="text-white/20">|</span>
                <span className="text-gold">40+ Numerical Physics Solvers</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground">
                Learn aerospace engineering by actually{" "}
                <span className="bg-gradient-to-r from-primary via-[#e8d7ff] to-gold bg-clip-text text-transparent">
                  experimenting with it.
                </span>
              </h2>
              <p className="mt-3 text-xs sm:text-base text-muted-foreground leading-relaxed font-body">
                AeroForge AI is Polaris's open-source computational physics lab. Practice fluid mechanics, transonic airfoil CFD, structural FEA, and orbital Keplerian dynamics directly in your browser.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive AeroForge Demonstration */}
          <ScrollReveal direction="up" delay={60}>
            <InteractiveAeroForgeDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 7. VERIFIED PROOF & COMMUNITY NUMBERS ── */}
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

      {/* ── 8. FINAL CALL TO ACTION ── */}
      <section className="section bg-gradient-to-b from-surface/40 to-background">
        <div className="shell text-center max-w-2xl mx-auto space-y-5">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-2">
              Start Learning
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground">
              Ready to learn something new?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
              Join workshops with ISRO scientists, take practical mini-courses, or build real engineering projects with peers.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3.5 font-mono text-xs">
              <Button
                asChild
                size="default"
                className="h-11 px-8 rounded-full font-bold bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background hover:brightness-110 shadow-lg transition-transform active:scale-95"
              >
                <Link to="/courses" className="flex items-center gap-2">
                  <span>Explore Learning Catalog</span>
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
