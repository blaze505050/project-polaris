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
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PolarisStarCenterpiece } from "@/components/site/PolarisStarCenterpiece";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import {
  LEARNING_CATALOG,
  START_HERE_INTENTS,
  TOPIC_LABELS,
  type Topic,
  type LearningItem,
} from "@/lib/learning";
import { SITE, STATS } from "@/lib/site";

const POLARIS_METHODOLOGY = [
  {
    step: "01",
    phase: "DISCOVER & INQUIRE",
    title: "Real-World Problem Scoping",
    summary:
      "Students formulate authentic engineering questions across aerospace aerodynamics, astrophysics, and computational physics beyond textbook bounds.",
    badge: "Scientific Inquiry",
    to: "/about",
  },
  {
    step: "02",
    phase: "LEARN ON DEMAND",
    title: "Theory & Mentor Masterclasses",
    summary:
      "Learn governing equations, numerical methods, and technical tools right when needed through live sessions with ISRO scientists and industry practitioners.",
    badge: "Expert Cohorts",
    to: "/courses?type=workshop",
  },
  {
    step: "03",
    phase: "BUILD IN SQUADS",
    title: "Collaborative Sprint Execution",
    summary:
      "Tackle challenges in small multi-disciplinary teams of 3–5 builders with code reviews, version control, and pair programming sprints.",
    badge: "Sprint Teams",
    to: "/projects",
  },
  {
    step: "04",
    phase: "VERIFY & DEPLOY",
    title: "Open Artifacts & Portfolios",
    summary:
      "Validate models with benchmark data, publish technical whitepapers, and deploy working open-source applications and simulators for the world.",
    badge: "Verified Artifacts",
    to: "/showcase",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Experiential Learning Platform for Science & Engineering" },
      {
        name: "description",
        content:
          "Learn by building, rather than building after learning. Interactive workshops, practical courses, expert-led cohorts, and hands-on engineering projects for curious students.",
      },
      { property: "og:title", content: "Project Polaris — Experiential Learning Platform" },
      {
        property: "og:description",
        content:
          "Learn by building, rather than building after learning. Practical learning in science, engineering and technology through open tools and real projects.",
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
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 border-b border-white/8">
        {/* Ambient Stars */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <ConstellationCanvas />
        </div>

        <div className="shell relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
            {/* Left Column: Organization Positioning */}
            <div>
              {/* Bold Headline */}
              <ScrollReveal direction="up" delay={40}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.08]">
                  Project Polaris
                </h1>
                <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-display text-primary/95 font-medium leading-snug">
                  Learn by building, rather than building after learning.
                </p>
              </ScrollReveal>

              {/* Subhead */}
              <ScrollReveal direction="up" delay={100}>
                <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-body max-w-xl">
                  A student engineering ecosystem where curious minds build numerical physics simulations, software platforms, and physical prototypes with mentors and peers.
                </p>
              </ScrollReveal>

              {/* Primary CTAs */}
              <ScrollReveal direction="up" delay={160}>
                <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs">
                  <Button
                    asChild
                    size="default"
                    className="h-10 px-6 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
                  >
                    <Link to="/courses" className="flex items-center gap-2">
                      <span>Explore Courses</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="h-10 px-5 rounded-lg font-medium border-white/15 bg-surface hover:bg-surface-2 text-foreground transition-colors"
                  >
                    <Link to="/courses" search={{ type: "workshop" }}>
                      Our Workshops
                    </Link>
                  </Button>
                </div>

                {/* Micro Credibility */}
                <div className="mt-6 flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>Student-Led Ecosystem</span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span>100% Free & Open Knowledge</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Organization Showcase Centerpiece */}
            <ScrollReveal direction="up" delay={120}>
              <PolarisStarCenterpiece />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT'S HAPPENING NOW (LIVE & UPCOMING CARDS) ── */}
      <section className="border-b border-white/8 bg-surface-2/20 py-12">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-foreground uppercase tracking-wider">What's Happening Now</span>
                <span className="text-muted-foreground hidden sm:inline">• Weekly live sessions and modules</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-mono text-primary hover:text-foreground">
                <Link to="/courses">View full calendar →</Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
            {/* 1. Upcoming Workshop */}
            {featuredWorkshop && (
              <ScrollReveal direction="up" delay={0}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase">
                        LIVE WORKSHOP
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">{featuredWorkshop.duration}</span>
                    </div>
                    <h3 className="text-base font-bold font-sans text-foreground">{featuredWorkshop.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans leading-relaxed">
                      {featuredWorkshop.subtitle}
                    </p>
                    <div className="mt-3 text-[11px] text-primary">
                      With {featuredWorkshop.instructor?.name} ({featuredWorkshop.instructor?.org})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">{featuredWorkshop.date}</span>
                    <Button asChild size="sm" className="h-7 px-3 text-[11px] bg-foreground text-background font-medium rounded hover:bg-foreground/90">
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
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-0.5 rounded bg-surface-2 text-foreground border border-white/8 font-bold text-[10px] uppercase">
                        MINI-COURSE
                      </span>
                      <span className="text-[11px] text-muted-foreground">{featuredCourse.duration}</span>
                    </div>
                    <h3 className="text-base font-bold font-sans text-foreground">{featuredCourse.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans leading-relaxed">
                      {featuredCourse.subtitle}
                    </p>
                    <div className="mt-3 text-[11px] text-emerald-400">
                      Final Project: {featuredCourse.finalProject?.title}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px] capitalize">{featuredCourse.level}</span>
                    <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[11px] border-white/10 hover:border-white/20 rounded">
                      <Link to="/courses">Start Course →</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* 3. Intensive Bootcamp */}
            {featuredBootcamp && (
              <ScrollReveal direction="up" delay={120}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase">
                        BOOTCAMP
                      </span>
                      <span className="text-[11px] text-muted-foreground">{featuredBootcamp.duration}</span>
                    </div>
                    <h3 className="text-base font-bold font-sans text-foreground">{featuredBootcamp.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans leading-relaxed">
                      {featuredBootcamp.subtitle}
                    </p>
                    <div className="mt-3 text-[11px] text-muted-foreground">
                      {featuredBootcamp.seats}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">{featuredBootcamp.date}</span>
                    <Button asChild size="sm" className="h-7 px-3 text-[11px] bg-foreground text-background font-medium rounded hover:bg-foreground/90">
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

      {/* ── 3. THE POLARIS METHODOLOGY & FRAMEWORK ── */}
      <section className="section border-b border-white/8" id="methodology">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                The Polaris Framework
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-sans text-foreground">
                How We Learn by Building
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">
                Our structured methodology connecting inquiry, live guidance, sprint squads, and verified public artifacts.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
            {POLARIS_METHODOLOGY.map((step, i) => (
              <ScrollReveal key={step.title} direction="up" delay={i * 40}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-primary font-bold">{step.step}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{step.phase}</span>
                    </div>
                    <h3 className="text-base font-bold font-sans text-foreground">{step.title}</h3>
                    <span className="inline-block mt-1 text-[11px] text-primary">{step.badge}</span>
                    <p className="mt-2 text-xs text-muted-foreground font-sans leading-relaxed">
                      {step.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/6">
                    <Button asChild variant="ghost" size="sm" className="w-full justify-between h-7 text-xs font-mono text-primary hover:text-foreground px-0">
                      <Link to={step.to}>
                        <span>Explore Step</span>
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
      <section className="section border-b border-white/8 bg-surface-2/10" id="learning-explorer">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Catalog Explorer
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-sans text-foreground">
                  Explore by Topic
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-sans">
                  Science, aerospace, astrophysics, programming, and computational simulation.
                </p>
              </div>

              <Button asChild variant="outline" size="sm" className="font-mono text-xs border-white/10 hover:border-white/20">
                <Link to="/courses">Browse All ({LEARNING_CATALOG.length})</Link>
              </Button>
            </div>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedTopic("all")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedTopic === "all"
                    ? "bg-foreground text-background font-medium"
                    : "bg-surface text-muted-foreground hover:text-foreground border border-white/8"
                }`}
              >
                All Domains
              </button>
              {(Object.keys(TOPIC_LABELS) as Topic[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTopic(key)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedTopic === key
                      ? "bg-foreground text-background font-medium"
                      : "bg-surface text-muted-foreground hover:text-foreground border border-white/8"
                  }`}
                >
                  {TOPIC_LABELS[key]}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Filtered Learning Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 font-mono">
            {filteredItems.map((item, idx) => (
              <ScrollReveal key={item.id} direction="up" delay={idx * 30}>
                <article className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{item.duration}</span>
                    </div>

                    <h3 className="text-base font-bold font-sans text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                      {item.topics.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-surface-2 border border-white/6 text-muted-foreground">
                          {TOPIC_LABELS[t]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 text-[11px] font-medium uppercase">{item.status}</span>
                    <Button asChild size="sm" className="h-7 px-3 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 rounded">
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
              <h2 className="text-3xl sm:text-4xl font-bold font-sans text-foreground">
                Not sure where to start?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans">
                Choose the statement that fits your current time and learning goal.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
            {START_HERE_INTENTS.map((intent, i) => (
              <ScrollReveal key={intent.intent} direction="up" delay={i * 30}>
                <Link
                  to={intent.to}
                  className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-primary font-bold text-[11px]">{intent.intent}</span>
                      <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-surface-2">
                        {intent.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-sans text-foreground group-hover:text-primary transition-colors">
                      {intent.heading}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans leading-relaxed">
                      {intent.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center text-xs text-primary font-bold gap-1">
                    <span>Go to path</span>
                    <ArrowRight className="size-3" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FEATURED LAB: AEROFORGE ── */}
      <section className="section border-b border-white/8 bg-surface-2/10" id="aeroforge-lab">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20 mb-3">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="font-bold">POLARIS LEARNING LAB</span>
                <span className="text-white/20">|</span>
                <span className="text-muted-foreground">40+ Numerical Physics Solvers</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-sans font-bold text-foreground">
                Learn aerospace engineering by actually experimenting with it.
              </h2>
              <p className="mt-3 text-xs sm:text-base text-muted-foreground leading-relaxed font-sans">
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
      <section className="border-b border-white/8 bg-surface-2/20 py-12">
        <div className="shell">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center font-mono">
            {STATS.map((s, idx) => (
              <ScrollReveal key={s.label} direction="up" delay={idx * 20}>
                <div className="p-4 rounded-xl border border-white/8 bg-card">
                  <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">{s.value}</div>
                  <div className="text-xs font-medium text-foreground mt-1">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{s.note}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CALL TO ACTION ── */}
      <section className="section bg-surface-2/10">
        <div className="shell text-center max-w-2xl mx-auto space-y-4">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-2">
              Start Learning
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-bold text-foreground">
              Ready to learn something new?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
              Join workshops with ISRO scientists, take practical mini-courses, or build real engineering projects with peers.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono text-xs">
              <Button
                asChild
                size="default"
                className="h-10 px-6 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
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
                className="h-10 px-5 rounded-lg font-medium border-white/15 bg-surface hover:bg-surface-2 text-foreground"
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

