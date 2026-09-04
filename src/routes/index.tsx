import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  CheckCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  MapPin,
  Mic,
  Bell,
  CalendarPlus,
  ExternalLink,
  Calendar,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { CountUp } from "@/components/ui/count-up";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { WaitlistModal } from "@/components/site/WaitlistModal";
import {
  getPrograms,
  fetchProgramsFromSupabase,
  getPastSessions,
  fetchPastSessionsFromSupabase,
  getWhatsHappening,
  getUpcomingInitiatives,
  getStudentReviews,
  type ProgramEvent,
  type PastSession,
  type WhatsHappeningConfig,
  type UpcomingInitiative,
  type StudentReview,
} from "@/lib/cms-store";
import { SITE_URL } from "@/lib/site";
import polarisLogo from "@/assets/polaris-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Learn by Building" },
      {
        name: "description",
        content:
          "Project Polaris is a student-led experiential learning ecosystem built by students, for students. Learn by building, rather than building after learning.",
      },
      { property: "og:title", content: "Project Polaris — Learn by Building" },
      {
        property: "og:description",
        content:
          "A student-led experiential engineering ecosystem bridging traditional education and real-world space & engineering practice.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: HomePage,
});

// The 6-Step Polaris Experiential Methodology
const METHODOLOGY_STEPS = [
  {
    step: "01",
    phase: "Explore",
    title: "Curiosity Sparks",
    description:
      "Join weekly expert sessions, explore astronomy observations, or join a student squad. No prerequisites or prior background needed.",
    icon: Compass,
    action: "Browse Programs",
    href: "/programs",
  },
  {
    step: "02",
    phase: "Frame",
    title: "Frame Real Questions",
    description:
      "Move beyond passive lectures. Read scientific literature, formulate hypotheses, and scope practical engineering challenges.",
    icon: Sparkles,
    action: "Read Articles",
    href: "/articles",
  },
  {
    step: "03",
    phase: "Simulate",
    title: "Numerical Simulation",
    description:
      "Run CFD aerodynamics, Keplerian orbital mechanics, and structural simulations using open-source tools and browser-based workstations.",
    icon: Award,
    action: "Launch AeroForge",
    href: "/projects",
  },
  {
    step: "04",
    phase: "Build",
    title: "Prototype & Iterate",
    description:
      "Build aerodynamic airfoils, satellite tracking ground systems, and algorithms. Test, fail, refine, and document real engineering models.",
    icon: Users,
    action: "Join a Cohort",
    href: "/programs",
  },
  {
    step: "05",
    phase: "Showcase",
    title: "Publish & Peer Review",
    description:
      "Showcase your prototypes, technical papers, and simulation results to the wider community, mentors, and partner institutions.",
    icon: CheckCircle,
    action: "View Spotlight",
    href: "/spotlight",
  },
  {
    step: "06",
    title: "PROGRESS",
    desc: "Learn from outcome and build again.",
    detail: "Iterate to higher complexity systems and lead new cohorts.",
  },
];

function HomePage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [waitlistProgram, setWaitlistProgram] = useState<string | null>(null);
  const [pastSessions, setPastSessions] = useState<PastSession[]>(getPastSessions());
  const [whatsHappening, setWhatsHappening] = useState<WhatsHappeningConfig>(getWhatsHappening());
  const [upcomingInitiatives, setUpcomingInitiatives] =
    useState<UpcomingInitiative[]>(getUpcomingInitiatives());
  const [studentReviews, setStudentReviews] = useState<StudentReview[]>(getStudentReviews());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [allPrograms, setAllPrograms] = useState<ProgramEvent[]>(getPrograms());
  const featuredSession = allPrograms.find((p) => p.id === "star-universe-aug29") || allPrograms[0];

  useEffect(() => {
    fetchProgramsFromSupabase().then((progs) => {
      if (progs && progs.length > 0) {
        setAllPrograms(progs);
      }
    });

    fetchPastSessionsFromSupabase().then((sessions) => {
      if (sessions && sessions.length > 0) {
        setPastSessions(sessions);
      }
    });

    const handleUpdate = () => {
      setAllPrograms(getPrograms());
      setPastSessions(getPastSessions());
      setWhatsHappening(getWhatsHappening());
      setUpcomingInitiatives(getUpcomingInitiatives());
      setStudentReviews(getStudentReviews());
    };
    window.addEventListener("polaris_cms_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("polaris_cms_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const targetStr = whatsHappening.targetDate || "2026-08-29T18:00:00+05:30";
      const targetTime = new Date(targetStr).getTime();
      const target = isNaN(targetTime)
        ? new Date("2026-08-29T18:00:00+05:30").getTime()
        : targetTime;
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [whatsHappening.targetDate]);

  return (
    <>
      {/* ── 1. HERO SECTION (Parallax Nebula + Fluid Display Type) ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 border-b border-border">
        {/* Subtle Full-bleed Nebula Parallax Background (Gentle Intensity) */}
        <ParallaxImage
          src="/media/nebula-hero.jpg"
          alt="Deep space nebula cosmic backdrop"
          intensity={0.16}
          imgOpacity={0.26}
          overlay={0.85}
          kenBurns={true}
          className="absolute inset-0 size-full pointer-events-none"
        />

        {/* Contrast Enhancement Mask (Ensures all text remains super sharp & legible) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_65%_at_50%_42%,rgba(8,10,15,0.65)_0%,rgba(8,10,15,0.95)_100%)]" />

        {/* Ambient Star Canvas Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <ConstellationCanvas />
        </div>

        <div className="shell relative z-10 text-left max-w-5xl space-y-7">
          <ScrollReveal direction="up" delay={20}>
            {/* Direct display title with drop-shadow clarity */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] font-display font-extrabold tracking-tight text-white leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              PROJECT POLARIS
            </h1>
            <p className="mt-5 text-xl sm:text-2xl md:text-3xl font-display text-primary font-medium leading-snug max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] text-shimmer">
              Learn by building, rather than building after learning.
            </p>
          </ScrollReveal>

          {/* Primary Action Buttons with Kowalski Active Tactile Press */}
          <ScrollReveal direction="up" delay={80}>
            <div className="mt-8 flex flex-wrap items-center justify-start gap-3.5 font-sans text-xs">
              <Button
                asChild
                size="default"
                className="h-11 px-7 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm active:scale-[0.97]"
              >
                <Link to="/about" className="flex items-center gap-2">
                  <span>Explore Polaris</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="h-11 px-6 rounded-full font-medium border-white/15 bg-surface/80 backdrop-blur-md hover:bg-surface-2 text-foreground transition-colors active:scale-[0.97]"
              >
                <Link to="/programs">View Programs</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="default"
                className="h-11 px-5 rounded-full font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 active:scale-[0.97]"
              >
                <a
                  href="https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Join the Community</span>
                </a>
              </Button>
            </div>
          </ScrollReveal>

          {/* ── The 6-Step Visual Methodology Chain (Allowed Eyebrow 1 of 3) ── */}
          <ScrollReveal direction="blur" delay={120}>
            <div className="mt-14 pt-8 border-t border-white/10">
              <span className="text-[10px] uppercase font-mono font-semibold text-primary/80 tracking-widest block mb-4">
                The Polaris Learning Methodology
              </span>

              {/* Visual Methodology Infographic Banner */}
              <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10 bg-card shadow-2xl group">
                <img
                  src="/media/polaris-learning-methodology.png"
                  alt="Polaris 6-Step Experiential Methodology: Discover, Investigate, Build, Validate, Showcase, Progress"
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 hidden sm:flex items-center justify-between text-[11px] font-mono text-muted-foreground pointer-events-none">
                  <span className="text-white/90 font-medium">Learn by building, rather than building after learning</span>
                  <span className="text-primary font-semibold">6-Phase Experiential Continuum →</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left font-sans">
                {METHODOLOGY_STEPS.map((m, idx) => {
                  const isHovered = activeStep === idx;
                  return (
                    <div
                      key={m.title}
                      onMouseEnter={() => setActiveStep(idx)}
                      onMouseLeave={() => setActiveStep(null)}
                      className={`p-3.5 rounded-xl border cursor-default ${
                        isHovered
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(197,157,255,0.18)]"
                          : "border-white/8 bg-card/70 backdrop-blur-sm hover:border-white/20"
                      }`}
                      style={{
                        transition: "all 250ms cubic-bezier(0.23, 1, 0.32, 1)",
                        transitionDelay: `${idx * 40}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 font-mono">
                        <span className="text-primary font-bold">{m.step}</span>
                        <span>→</span>
                      </div>
                      <h3 className="text-xs font-bold font-display text-foreground">{m.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        {m.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. THE PROBLEM SECTION ("THE GAP" — Asymmetric Split Layout) ── */}
      <section className="section border-b border-border bg-surface/30" id="the-gap">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Left Content (Asymmetric Headline & 3 Key Realities) */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal direction="up">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-foreground leading-[1.12]">
                  The world doesn't have a knowledge problem.
                  <br />
                  <span className="text-primary">It has an action problem.</span>
                </h2>
              </ScrollReveal>

              <div className="grid gap-3 font-sans">
                <ScrollReveal direction="up" delay={40}>
                  <div
                    className="p-4 sm:p-5 rounded-xl border border-white/8 bg-card/80"
                    style={{
                      transition:
                        "border-color 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(197, 157, 255, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-primary">
                        01. Application
                      </span>
                      <h3 className="text-sm sm:text-base font-bold font-display text-foreground">
                        KNOWLEDGE ≠ ACTION
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Knowing a concept or memorizing textbook formulas doesn't mean knowing how to
                      build, test, and deploy something real with it.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={80}>
                  <div
                    className="p-4 sm:p-5 rounded-xl border border-white/8 bg-card/80"
                    style={{
                      transition:
                        "border-color 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(197, 157, 255, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-primary">
                        02. Ecosystem
                      </span>
                      <h3 className="text-sm sm:text-base font-bold font-display text-foreground">
                        CURIOSITY ≠ ACCESS
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Being deeply curious doesn't guarantee access to the tools, mentorship,
                      computational software, or environment to explore freely.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={120}>
                  <div
                    className="p-4 sm:p-5 rounded-xl border border-white/8 bg-card/80"
                    style={{
                      transition:
                        "border-color 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(197, 157, 255, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-primary">
                        03. Democratization
                      </span>
                      <h3 className="text-sm sm:text-base font-bold font-display text-foreground">
                        OPPORTUNITY ≠ AFFORDABILITY
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      An opportunity isn't truly accessible if paywalls and heavy costs put it out
                      of reach for curious students.
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Polaris Resolution Callout */}
              <ScrollReveal direction="up" delay={160}>
                <div className="p-5 sm:p-6 rounded-xl border border-primary/30 bg-surface-2/90 backdrop-blur-sm space-y-2.5 shadow-lg">
                  <h3 className="text-base sm:text-lg font-bold font-display text-foreground">
                    Polaris exists to close that gap.
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By replacing passive rote learning with an authentic cycle:
                  </p>
                  <div className="text-xs font-semibold text-primary flex flex-wrap items-center gap-2 pt-1 font-mono">
                    <span className="text-foreground">Discover</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="text-foreground">Investigate</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="text-foreground">Build</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="text-foreground">Validate</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="text-foreground">Showcase</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="text-foreground">Progress</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Visual (Scroll Reveal Clip-path Entry Image) */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="clip" delay={60}>
                <div className="relative rounded-2xl overflow-hidden border border-white/12 shadow-2xl bg-card">
                  <img
                    src="/media/galaxy-wide.jpg"
                    alt="Observational astronomical galaxy wide structure"
                    loading="lazy"
                    className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-lg bg-surface/90 backdrop-blur-md border border-white/10">
                    <div className="text-[11px] font-mono text-primary font-semibold flex items-center gap-1.5">
                      <Sparkles className="size-3 text-gold" />
                      <span>Astronomical Research Dataset</span>
                    </div>
                    <div className="text-xs font-sans text-muted-foreground mt-0.5">
                      Interstellar edge-on spiral disk analysis & computational spectroscopy
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT'S HAPPENING NOW (Active Masterclass with Telescope Backdrop) ── */}
      <section className="section border-b border-border" id="whats-happening-now">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  What's Happening Now?
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="font-sans text-xs border-white/10 hover:border-white/20 active:scale-[0.97]"
              >
                <Link to="/programs">View All Programs →</Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Featured Astronomy Masterclass Card */}
          {whatsHappening && (
            <ScrollReveal direction="up" delay={40}>
              <div className="p-6 md:p-8 rounded-2xl border border-primary/25 bg-card relative overflow-hidden font-sans shadow-lg">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground text-xs font-mono">
                        <Calendar className="size-3 text-primary" />
                        <span>{whatsHappening.date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="size-3 text-primary" />
                        <span>{whatsHappening.time || "6:00 PM IST"}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 text-xs">
                        <MapPin className="size-3" />
                        <span>{whatsHappening.mode}</span>
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-snug">
                      {whatsHappening.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {whatsHappening.details}
                    </p>

                    {/* Speaker Box */}
                    {whatsHappening.speakerName && (
                      <div className="p-4 rounded-xl bg-surface-2/60 border border-white/6 flex items-center justify-between gap-3.5">
                        <div className="flex items-center gap-3.5">
                          <div className="size-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                            <Mic className="size-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold font-display text-foreground">
                              {whatsHappening.speakerName}
                            </div>
                            <div className="text-xs text-primary font-medium">
                              {whatsHappening.speakerDesignation}
                            </div>
                          </div>
                        </div>
                        {whatsHappening.speakerLinkedin && (
                          <a
                            href={whatsHappening.speakerLinkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="size-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            aria-label="Speaker LinkedIn Profile"
                          >
                            <Linkedin className="size-3.5" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Live Countdown HUD */}
                    <div
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={`Live countdown: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
                      className="p-3.5 rounded-xl bg-surface-2 border border-primary/20 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Session Starts In:</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <div className="px-2.5 py-1 rounded bg-background border border-border text-center min-w-[48px]">
                          <span className="text-sm font-bold text-primary block leading-none">
                            {String(timeLeft.days).padStart(2, "0")}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">Days</span>
                        </div>
                        <span className="text-primary font-bold">:</span>
                        <div className="px-2.5 py-1 rounded bg-background border border-border text-center min-w-[48px]">
                          <span className="text-sm font-bold text-primary block leading-none">
                            {String(timeLeft.hours).padStart(2, "0")}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">Hours</span>
                        </div>
                        <span className="text-primary font-bold">:</span>
                        <div className="px-2.5 py-1 rounded bg-background border border-border text-center min-w-[48px]">
                          <span className="text-sm font-bold text-primary block leading-none">
                            {String(timeLeft.minutes).padStart(2, "0")}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">Mins</span>
                        </div>
                        <span className="text-primary font-bold">:</span>
                        <div className="px-2.5 py-1 rounded bg-background border border-border text-center min-w-[48px]">
                          <span className="text-sm font-bold text-emerald-400 block leading-none">
                            {String(timeLeft.seconds).padStart(2, "0")}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">Secs</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        size="default"
                        className="h-11 px-7 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors text-xs active:scale-[0.97]"
                      >
                        <a
                          href={whatsHappening.ctaUrl || "/programs"}
                          target={whatsHappening.ctaUrl.startsWith("http") ? "_blank" : undefined}
                          rel={whatsHappening.ctaUrl.startsWith("http") ? "noreferrer" : undefined}
                          className="flex items-center gap-2"
                        >
                          <span>{whatsHappening.ctaText || "Explore Details"}</span>
                          <ArrowRight className="size-3.5" />
                        </a>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="default"
                        className="h-11 px-5 rounded-lg font-medium border-white/10 hover:border-white/20 text-xs bg-surface-2/60 text-foreground active:scale-[0.97]"
                      >
                        <a
                          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Exploring+the+Star+Universe%3A+A+Journey+into+Astronomy+%7C+Project+Polaris&dates=20260829T123000Z%2F20260829T143000Z&details=Live+Astronomy+Workshop+with+Scientist+Baldev+Krishan+Sharma+(Cosmo-scientist).+Hosted+by+Project+Polaris.&location=Online+Google+Meet"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5"
                        >
                          <CalendarPlus className="size-3.5 text-primary" />
                          <span>Add to Google Calendar</span>
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* What You Will Get (Subtle Telescope Image Background) */}
                  <div className="relative p-5 md:p-6 rounded-xl overflow-hidden border border-white/10 space-y-4 bg-surface-2/70">
                    <img
                      src="/media/telescope-milkyway.jpg"
                      alt="Telescope observing the Milky Way"
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover opacity-20 pointer-events-none mix-blend-screen"
                    />
                    <div className="relative z-10 space-y-4">
                      <h4 className="text-xs font-semibold uppercase text-primary tracking-wider font-mono">
                        What You Will Get
                      </h4>
                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        {(
                          featuredSession?.benefits || [
                            "Interactive Q&A Session with Researcher",
                            "Exclusive Astrophysics & Rocketry Resource Pack",
                            "Community Access & Verified Certificate",
                          ]
                        ).map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2.5">
                            <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/90">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 border-t border-white/10 text-[11px] text-muted-foreground">
                        Whether you are an astronomy enthusiast or simply curious about the
                        Universe, join us on this journey through the stars! 🌠
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── 4. JOIN OUR COMMUNITY (Student Image + Horizontal Snap Strip) ── */}
      <section className="section border-b border-border bg-surface/20" id="community">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 items-center mb-10">
            <div className="lg:col-span-8 space-y-2">
              <ScrollReveal direction="up">
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  More than a community. An environment to explore.
                </h2>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Connect with hundreds of students, participate in quizzes, and explore space
                  together.
                </p>
              </ScrollReveal>
            </div>

            {/* Human Element Break: Polaris Student Visual */}
            <div className="lg:col-span-4">
              <ScrollReveal direction="scale" delay={30}>
                <div className="flex items-center gap-3.5 p-3 rounded-xl border border-white/10 bg-card/80 backdrop-blur-sm">
                  <img
                    src="/media/polaris-student.jpg"
                    alt="Student representing Project Polaris"
                    loading="lazy"
                    className="size-14 rounded-lg object-cover border border-primary/20 shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold font-display text-foreground">
                      Student-Led & Independent
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Empowering young aerospace and physics researchers across India.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* 5 Community Cards with Horizontal Scroll-Snap on Mobile, 5-col on Desktop */}
          <div className="flex overflow-x-auto pb-4 gap-3.5 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible font-sans max-w-5xl mx-auto">
            {[
              {
                title: "Aaj Ka Gyan",
                desc: "Short, useful aerospace & physics knowledge drops daily.",
                icon: Sparkles,
              },
              {
                title: "Quizzes",
                desc: "Test what you know and compete in friendly astrophysics challenges.",
                icon: Award,
              },
              {
                title: "Sessions & Workshops",
                desc: "Learn directly from scientists and engineers doing the work.",
                icon: Mic,
              },
              {
                title: "People Like You",
                desc: "Meet curious students, peer coders, and space enthusiasts.",
                icon: Users,
              },
              {
                title: "Updates & Opps",
                desc: "Stay connected to competitions, internships, and build sprints.",
                icon: Compass,
              },
            ].map((c, i) => (
              <ScrollReveal
                key={c.title}
                direction="up"
                delay={i * 30}
                className="min-w-[240px] sm:min-w-0 snap-start"
              >
                <div className="p-4 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <div>
                    <div className="size-8 rounded-lg bg-surface-2 border border-white/8 flex items-center justify-center text-primary mb-3">
                      <c.icon className="size-4" />
                    </div>
                    <h3 className="text-sm font-bold font-display text-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              asChild
              size="default"
              className="h-11 px-7 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors active:scale-[0.97]"
            >
              <a
                href="https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <span className="size-2 rounded-full bg-emerald-400" />
                <span>Join the WhatsApp Community →</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 5. BUILD POLARIS WITH US (VOLUNTEER PROGRAM — Allowed Eyebrow 2 of 3) ── */}
      <section className="section border-b border-border" id="volunteer">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Left Description & Info Link */}
            <div className="lg:col-span-5 space-y-4">
              <ScrollReveal direction="up">
                <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold block">
                  Student Leadership
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Build Polaris With Us
                </h2>
                <p className="text-sm text-primary font-medium font-display">
                  Polaris isn't built only for students. It's built with students.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  Join our active student volunteer corps across four specialized departments. Gain
                  hands-on leadership, design simulations, moderate scientist sessions, and build
                  open resources.
                </p>

                <div className="pt-2">
                  <Button
                    asChild
                    size="sm"
                    className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-xs active:scale-[0.97]"
                  >
                    <a
                      href="https://drive.google.com/file/d/1YxoWvwXBQvJQ9gewJyEYhez-C1NpLPph/view?usp=drive_link"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <FileText className="size-3.5" />
                      <span>Volunteer Program Info Doc ↗</span>
                    </a>
                  </Button>
                </div>
              </ScrollReveal>

              {/* Scroll-reveal Visual: Students Building */}
              <ScrollReveal direction="clip" delay={40}>
                <div className="relative rounded-xl overflow-hidden border border-white/10 mt-6">
                  <img
                    src="/media/students-building.jpg"
                    alt="Students building and designing engineering models"
                    loading="lazy"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-foreground/80">
                    Engineering & Simulation Sprints in Action
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Department Registration Cards */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="up" delay={40}>
                <div className="grid gap-3 sm:grid-cols-2 font-sans">
                  {[
                    {
                      dept: "Operations",
                      desc: "Event logistics, session moderation & member onboarding.",
                      link: "https://forms.gle/ZXaxJH9k2ZUXVdYz6",
                    },
                    {
                      dept: "Outreach",
                      desc: "School partnerships, college clubs & community growth.",
                      link: "https://forms.gle/WoKGodwNCBp5wkcn8",
                    },
                    {
                      dept: "Research",
                      desc: "Projects, market research, scientific studies, problem exploration & technical analysis.",
                      link: "https://forms.gle/SnMhq9gNDLWmNqCF7",
                    },
                    {
                      dept: "Content & Design",
                      desc: "Technical explainers, graphics & publication articles.",
                      link: "https://forms.gle/qUtQhWUNhmWtuSQu8",
                    },
                  ].map((d) => (
                    <div
                      key={d.dept}
                      className="p-4 rounded-xl border border-white/8 bg-card flex flex-col justify-between hover:border-primary/30 transition-colors"
                    >
                      <div>
                        <h3 className="text-sm font-bold font-display text-foreground">{d.dept}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                          {d.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/6">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-7 px-0 text-xs font-semibold text-primary hover:text-foreground active:scale-[0.97]"
                        >
                          <a
                            href={d.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1"
                          >
                            <span>Apply ({d.dept})</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. UPCOMING INITIATIVES (Subtle Gold Border Hover) ── */}
      <section className="section border-b border-border bg-surface/20" id="initiatives">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Upcoming Initiatives
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                New programs launching across the Polaris ecosystem.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            {upcomingInitiatives.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={idx * 30}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full card-gold-hover">
                  <div>
                    <h3 className="text-base font-bold font-display text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/6">
                    {item.isDirectLink && item.to ? (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-7 px-0 text-xs font-medium text-primary hover:text-foreground active:scale-[0.97]"
                      >
                        <Link to={item.to}>{item.cta}</Link>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setWaitlistProgram(item.title)}
                        className="h-7 px-0 text-xs font-medium text-primary hover:text-foreground flex items-center gap-1 active:scale-[0.97]"
                      >
                        <Bell className="size-3" />
                        <span>{item.cta}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHAT IS PROJECT POLARIS (Rocket Assembly Visual) ── */}
      <section className="section border-b border-border" id="what-is-polaris">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <ScrollReveal direction="up">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  What is Project Polaris?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  Project Polaris is a student-led experiential learning ecosystem built by
                  students, for students.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  We bridge the gap between traditional education and real-world learning by
                  creating opportunities to build, research, experiment, collaborate, and showcase.
                </p>

                <div className="pt-2">
                  <Button
                    asChild
                    size="default"
                    className="h-10 px-6 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors text-xs active:scale-[0.97]"
                  >
                    <Link to="/about" className="flex items-center gap-1.5">
                      <span>Discover Polaris</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="clip" delay={40}>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-card aspect-[4/3] flex items-center justify-center p-8 shadow-xl">
                <img
                  src="/media/rocket-assembly.jpg"
                  alt="Aerospace launch vehicle staging and rocket assembly"
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-65 hover:opacity-85 transition-opacity duration-500"
                />
                <div className="relative z-10 p-5 rounded-xl bg-background/85 backdrop-blur-md border border-white/12 text-center max-w-xs shadow-2xl">
                  <img
                    src={polarisLogo}
                    alt="Polaris Logo"
                    className="size-8 mx-auto mb-2 object-contain"
                  />
                  <div className="text-xs font-bold font-display text-foreground">
                    Built by Students, for Students
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Empowering curious minds to build real systems
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 8. IMPACT / VERIFIED NUMBERS (CountUp Animation + Gold Accent) ── */}
      <section className="section border-b border-border bg-surface/30" id="impact">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Our Impact in Numbers
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center font-sans">
            {[
              {
                target: 1000,
                suffix: "+",
                label: "Students Reached",
                note: "Across interactive sessions",
              },
              {
                target: 230,
                suffix: "+",
                label: "Community Members",
                note: "Active WhatsApp learners",
              },
              {
                target: 28,
                suffix: "+",
                label: "Contributors",
                note: "Volunteers, associates & team",
              },
              {
                target: 100,
                suffix: "+",
                label: "Cumulative Participants",
                note: "Deep session attendance",
              },
              {
                target: 4,
                suffix: "",
                label: "Workshops Conducted",
                note: "1-day expert masterclasses",
              },
            ].map((stat, idx) => (
              <ScrollReveal key={stat.label} direction="up" delay={idx * 20}>
                <div className="p-4 rounded-xl border border-white/8 bg-card/90">
                  <div className="text-2xl sm:text-3xl font-bold font-display text-gold">
                    <CountUp target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-1">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                    {stat.note}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: IMAGE SHOWCASE (Cinematic Parallax Interstitial) ── */}
      <section className="cinematic-section border-b border-border py-24 md:py-32 relative">
        <ParallaxImage
          src="/media/black-hole-bg.jpeg"
          alt="Gravitational lensing around a celestial black hole in deep space"
          intensity={0.3}
          overlay={0.55}
          className="absolute inset-0 size-full pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-4">
          <ScrollReveal direction="scale">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-foreground leading-snug tracking-tight">
              "Somewhere, something incredible is waiting to be known."
            </blockquote>
            <cite className="text-xs font-mono text-muted-foreground uppercase tracking-widest block not-italic mt-3">
              — Carl Sagan · The Cosmic Perspective
            </cite>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 9. WHAT OUR STUDENTS SAY (Cross-fade Reviews) ── */}
      <section className="section border-b border-border" id="reviews">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  What Our Students Say
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous Review"
                  onClick={() =>
                    setReviewIndex((prev) =>
                      prev > 0 ? prev - 1 : (studentReviews.length || 1) - 1,
                    )
                  }
                  className="size-8 rounded-full border border-white/10 bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors active:scale-[0.97]"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next Review"
                  onClick={() =>
                    setReviewIndex((prev) =>
                      prev < (studentReviews.length || 1) - 1 ? prev + 1 : 0,
                    )
                  }
                  className="size-8 rounded-full border border-white/10 bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors active:scale-[0.97]"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Review Cards Grid with Cross-fade Transition */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="grid gap-4 md:grid-cols-2 font-sans"
          >
            {studentReviews.length > 0 &&
              [
                studentReviews[reviewIndex % studentReviews.length],
                studentReviews.length > 1
                  ? studentReviews[(reviewIndex + 1) % studentReviews.length]
                  : null,
              ]
                .filter((r): r is NonNullable<typeof r> => Boolean(r))
                .map((review) => (
                  <div
                    key={`${review.name}-${review.role}`}
                    className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between space-y-4 transition-opacity duration-300"
                  >
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans italic">
                      "{review.quote}"
                    </p>
                    <div className="pt-3 border-t border-white/6 flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground font-display">
                          {review.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{review.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ── 10. VOICES BEHIND POLARIS (Allowed Eyebrow 3 of 3) ── */}
      <section className="section bg-surface/20" id="speakers">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold block mb-1">
                Mentors & Collaborators
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Voices Behind Polaris
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Distinguished scientists, founders, and engineers who have led sessions for Polaris
                explorers.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-sans">
            {pastSessions.map((session, idx) => (
              <ScrollReveal key={session.id || session.title} direction="up" delay={idx * 30}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-primary/30 transition-colors group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="size-10 rounded-full bg-surface-2 border border-white/8 flex items-center justify-center text-primary font-bold text-sm group-hover:scale-105 transition-transform">
                        {session.speaker.charAt(0)}
                      </div>
                      {session.speakerLinkedin && (
                        <a
                          href={session.speakerLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg bg-surface-2/60 border border-white/6 hover:border-primary/30"
                          title={`View ${session.speaker} on LinkedIn`}
                          aria-label={`View ${session.speaker} on LinkedIn`}
                        >
                          <Linkedin className="size-3.5" />
                        </a>
                      )}
                    </div>
                    <h3 className="text-sm font-bold font-display text-foreground">
                      {session.speaker}
                    </h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{session.designation}</p>
                    <div className="mt-2 text-xs font-semibold text-foreground/90">
                      {session.title}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {session.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>{session.date}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {session.participants}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Waitlist Modal */}
      <WaitlistModal
        isOpen={!!waitlistProgram}
        onClose={() => setWaitlistProgram(null)}
        programTitle={waitlistProgram || "Polaris Initiative"}
      />
    </>
  );
}
