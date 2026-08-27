import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Hammer,
  CheckCircle,
  Eye,
  TrendingUp,
  MessageCircle,
  Calendar,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  MapPin,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { getPrograms, INITIAL_PAST_SESSIONS } from "@/lib/cms-store";
import { SITE } from "@/lib/site";
import polarisLogo from "@/assets/polaris-logo.png";
import studentsBuildingImg from "@/assets/students-building.webp";
import nightObservationImg from "@/assets/night-observation.webp";

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
      { property: "og:url", content: "https://projectpolaris.in/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/" }],
  }),
  component: HomePage,
});

// The 6-Step Polaris Experiential Methodology
const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "DISCOVER",
    desc: "Find questions worth exploring.",
    detail: "Curiosity-driven inquiry into real astrophysical and physical phenomena.",
  },
  {
    step: "02",
    title: "INVESTIGATE",
    desc: "Go beyond what you're given.",
    detail: "Formulate hypotheses and model numerical constraints using mathematics.",
  },
  {
    step: "03",
    title: "BUILD",
    desc: "Turn knowledge into something tangible.",
    detail: "Construct numerical simulations, CAD models, and computational solvers.",
  },
  {
    step: "04",
    title: "VALIDATE",
    desc: "Test, refine, and challenge your work.",
    detail: "Peer review with engineers, ISRO scientists, and cohort teammates.",
  },
  {
    step: "05",
    title: "SHOWCASE",
    desc: "Put your work into the real world.",
    detail: "Publish verified artifacts, open notebooks, and technical papers.",
  },
  {
    step: "06",
    title: "PROGRESS",
    desc: "Learn from outcome and build again.",
    detail: "Iterate to higher complexity systems and lead new cohorts.",
  },
];

// Student Testimonials
const STUDENT_REVIEWS = [
  {
    name: "Arjun S.",
    role: "Aerospace Student, Class 12",
    quote:
      "Learning orbital transfers from textbook diagrams was confusing. In Polaris, simulating Keplerian mechanics in AeroForge made the physics finally click.",
  },
  {
    name: "Sneha P.",
    role: "B.Tech Mechanical 2nd Year",
    quote:
      "Interacting directly with an ISRO scientist during the career masterclass gave me a clear, realistic roadmap for spacecraft engineering.",
  },
  {
    name: "Rohan M.",
    role: "High School Physics Enthusiast",
    quote:
      "Polaris isn't like typical coaching. You are actually encouraged to build your own numerical codes and debate hypotheses with peers.",
  },
  {
    name: "Ananya K.",
    role: "Astrophysics Explorer",
    quote:
      "The Galaxies & Nebulae session was phenomenal! Mapping interstellar spectroscopy gave me a taste of real research.",
  },
];

// Voices Behind Polaris (Past Speakers & Mentors)
const PAST_SPEAKERS = [
  {
    name: "Scientist Baldev Krishan Sharma",
    designation: "Cosmo-scientist & Author",
    topic: "Exploring the Star Universe: A Journey into Wonders of Astronomy",
    date: "29 August 2026",
  },
  {
    name: "Mr. Ankit Gupta",
    designation: "Scientist/Engineer 'SC' at ISRO",
    topic: "How to Pursue Your Career in ISRO & Spacecraft Systems",
    date: "12 July 2026",
  },
  {
    name: "Mr. Prakhar Vishwakarma",
    designation: "Missile Man of MP",
    topic: "Fundamentals of Rocket Development & Staging Dynamics",
    date: "2 July 2026",
  },
  {
    name: "Ms. Vranda Gupta",
    designation: "Founder, Stellar Freaks",
    topic: "Dive into the World of Galaxies & Nebulas",
    date: "9 August 2026",
  },
];

function HomePage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const allPrograms = getPrograms();
  const featuredSession = allPrograms.find((p) => p.id === "star-universe-aug29") || allPrograms[0];

  return (
    <>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        {/* Subtle Constellation Ambient Canvas */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <ConstellationCanvas />
        </div>

        <div className="shell relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <ScrollReveal direction="up" delay={20}>
            <span className="text-[11px] font-sans text-primary uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-3">
              Experiential Learning Ecosystem
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.08]">
              PROJECT POLARIS
            </h1>
            <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-display text-primary/95 font-medium leading-snug">
              Learn by building, rather than building after learning.
            </p>
          </ScrollReveal>

          {/* Primary Action Buttons */}
          <ScrollReveal direction="up" delay={80}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-sans text-xs">
              <Button
                asChild
                size="default"
                className="h-11 px-7 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
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
                className="h-11 px-6 rounded-full font-medium border-white/15 bg-surface hover:bg-surface-2 text-foreground transition-colors"
              >
                <Link to="/programs">View Programs</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="default"
                className="h-11 px-5 rounded-full font-medium text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <a href="https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5 text-emerald-400" />
                  <span>Join the Community</span>
                </a>
              </Button>
            </div>
          </ScrollReveal>

          {/* ── The 6-Step Visual Methodology Chain ── */}
          <ScrollReveal direction="up" delay={120}>
            <div className="mt-14 pt-8 border-t border-white/8">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block mb-4">
                The Polaris Learning Methodology
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-left font-sans">
                {METHODOLOGY_STEPS.map((m, idx) => {
                  const isHovered = activeStep === idx;
                  return (
                    <div
                      key={m.title}
                      onMouseEnter={() => setActiveStep(idx)}
                      onMouseLeave={() => setActiveStep(null)}
                      className={`p-3.5 rounded-xl border transition-all cursor-default ${
                        isHovered
                          ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(165,180,252,0.15)]"
                          : "border-white/8 bg-card hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                        <span className="font-mono text-primary font-bold">{m.step}</span>
                        <span>→</span>
                      </div>
                      <h3 className="text-xs font-bold font-display text-foreground">{m.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. THE PROBLEM SECTION ("THE GAP") ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="the-gap">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block">
                The Gap
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-foreground leading-tight">
                The world doesn't have a knowledge problem.
                <br />
                <span className="text-primary">It has an action problem.</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Three Key Realities */}
          <div className="grid gap-4 md:grid-cols-3 font-sans max-w-5xl mx-auto">
            <ScrollReveal direction="up" delay={40}>
              <div className="p-6 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between hover:border-white/16 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2 font-mono">
                    01. Application
                  </span>
                  <h3 className="text-lg font-bold font-display text-foreground">KNOWLEDGE ≠ ACTION</h3>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    Knowing a concept or memorizing textbook formulas doesn't mean knowing how to build, test, and deploy something real with it.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="p-6 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between hover:border-white/16 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2 font-mono">
                    02. Ecosystem
                  </span>
                  <h3 className="text-lg font-bold font-display text-foreground">CURIOSITY ≠ ACCESS</h3>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    Being deeply curious doesn't guarantee access to the tools, mentorship, computational software, or environment to explore freely.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120}>
              <div className="p-6 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between hover:border-white/16 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2 font-mono">
                    03. Democratization
                  </span>
                  <h3 className="text-lg font-bold font-display text-foreground">OPPORTUNITY ≠ AFFORDABILITY</h3>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    An opportunity isn't truly accessible if paywalls and heavy costs put it out of reach for curious students.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Polaris Resolution Callout */}
          <ScrollReveal direction="up" delay={160}>
            <div className="mt-10 max-w-2xl mx-auto p-6 rounded-xl border border-primary/20 bg-primary/5 text-center space-y-3">
              <h3 className="text-xl font-bold font-display text-foreground">
                Polaris exists to close that gap.
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By replacing passive rote learning with an authentic cycle:
              </p>
              <div className="text-xs font-semibold text-primary flex flex-wrap items-center justify-center gap-2 pt-1 font-mono">
                <span>Discover</span>
                <span>→</span>
                <span>Investigate</span>
                <span>→</span>
                <span>Build</span>
                <span>→</span>
                <span>Validate</span>
                <span>→</span>
                <span>Showcase</span>
                <span>→</span>
                <span>Progress</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. WHAT'S HAPPENING NOW (FEATURED 29TH AUGUST SESSION) ── */}
      <section className="section border-b border-white/8" id="whats-happening-now">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                  Active Masterclass
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  What's Happening Now?
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Upcoming live session and hands-on masterclass details.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="font-sans text-xs border-white/10 hover:border-white/20">
                <Link to="/programs">View All Programs →</Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Featured 29 August Astronomy Masterclass Card */}
          <ScrollReveal direction="up" delay={40}>
            <div className="p-6 md:p-8 rounded-2xl border border-primary/25 bg-card relative overflow-hidden font-sans">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-bold text-[10px] uppercase">
                      LIVE ASTRONOMY WORKSHOP
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Calendar className="size-3 text-primary" />
                      <span>{featuredSession.date}</span>
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="size-3 text-primary" />
                      <span>{featuredSession.time || "6:00 PM IST"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <MapPin className="size-3" />
                      <span>{featuredSession.mode}</span>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground leading-snug">
                    {featuredSession.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {featuredSession.details}
                  </p>

                  {/* Speaker Box */}
                  {featuredSession.speaker && (
                    <div className="p-4 rounded-xl bg-surface-2/60 border border-white/6 flex items-center gap-3.5">
                      <div className="size-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                        <Mic className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold font-display text-foreground">
                          {featuredSession.speaker.name}
                        </div>
                        <div className="text-xs text-primary font-medium">
                          {featuredSession.speaker.designation}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      asChild
                      size="default"
                      className="h-11 px-7 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
                    >
                      <a href={featuredSession.ctaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                        <span>Register Now (Free)</span>
                        <ArrowRight className="size-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* What You Will Get */}
                <div className="p-5 md:p-6 rounded-xl bg-surface-2/40 border border-white/6 space-y-4">
                  <h4 className="text-xs font-semibold uppercase text-primary tracking-wider font-mono">
                    What You Will Get
                  </h4>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {featuredSession.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5">
                        <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-white/6 text-[11px] text-muted-foreground">
                    Whether you are an astronomy enthusiast or simply curious about the Universe, join us on this journey through the stars! 🌠
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 4. JOIN OUR COMMUNITY ── */}
      <section className="section border-b border-white/8 bg-surface-2/10" id="community">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block">
                The Community
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                More than a community. An environment to explore.
              </h2>
              <p className="text-xs text-muted-foreground">
                Connect with hundreds of students, participate in quizzes, and explore space together.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 font-sans max-w-5xl mx-auto">
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
              <ScrollReveal key={c.title} direction="up" delay={i * 30}>
                <div className="p-4 rounded-xl border border-white/8 bg-card h-full flex flex-col justify-between hover:border-white/16 transition-colors">
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
              className="h-10 px-6 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
            >
              <a href="https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <MessageCircle className="size-4 text-emerald-950" />
                <span>Join the Community →</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 5. BUILD POLARIS WITH US (VOLUNTEER PROGRAM) ── */}
      <section className="section border-b border-white/8" id="volunteer">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
            <ScrollReveal direction="up">
              <div className="space-y-4">
                <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block">
                  Student Leadership
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Build Polaris With Us
                </h2>
                <p className="text-sm text-primary font-medium font-display">
                  Polaris isn't built only for students. It's built with students.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  Join our active student volunteer corps across four specialized departments. Gain hands-on leadership, design simulations, moderate scientist sessions, and build open resources.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-xs"
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
              </div>
            </ScrollReveal>

            {/* Department Registration Cards */}
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
                    desc: "Physics simulation, paper writing & study datasets.",
                    link: "https://forms.gle/SnMhq9gNDLWmNqCF7",
                  },
                  {
                    dept: "Content & Design",
                    desc: "Technical explainers, graphics & publication articles.",
                    link: "https://forms.gle/qUtQhWUNhmWtuSQu8",
                  },
                ].map((d) => (
                  <div key={d.dept} className="p-4 rounded-xl border border-white/8 bg-card flex flex-col justify-between hover:border-white/16 transition-colors">
                    <div>
                      <h3 className="text-sm font-bold font-display text-foreground">{d.dept}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{d.desc}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/6">
                      <Button asChild size="sm" variant="ghost" className="h-7 px-0 text-xs font-semibold text-primary hover:text-foreground">
                        <a href={d.link} target="_blank" rel="noreferrer" className="flex items-center gap-1">
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
      </section>

      {/* ── 6. UPCOMING INITIATIVES (DYNAMIC CARDS) ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="initiatives">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Roadmap & Pipelines
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Upcoming Initiatives
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                New programs launching across the Polaris ecosystem.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            {[
              {
                title: "Remote Industry Sprints",
                status: "Open for Squads",
                desc: "Collaborate in remote squads on industry-standard problems across Aero, Astro, CSE, and Systems with scientist reviews.",
                cta: "Explore Sprints →",
                to: "/programs",
              },
              {
                title: "Polaris Innovation Program",
                status: "Coming Soon",
                desc: "Long-term build cohorts developing verified aerospace simulations and physical hardware prototypes.",
                cta: "Details to be disclosed soon",
                to: "/programs",
              },
              {
                title: "Chapter Lead Program",
                status: "Coming Soon",
                desc: "Lead and launch a Polaris chapter at your school or college in Tier-2/3 cities and remote regions.",
                cta: "Explore Chapters →",
                to: "/chapters",
              },
              {
                title: "Mentor Panel",
                status: "Coming Soon",
                desc: "Technical code and flight mechanics reviews directly from aerospace scientists and researchers.",
                cta: "Get Involved →",
                to: "/get-involved",
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={idx * 30}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20 inline-block mb-3">
                      {item.status}
                    </span>
                    <h3 className="text-base font-bold font-display text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/6">
                    <Button asChild size="sm" variant="ghost" className="h-7 px-0 text-xs font-medium text-primary hover:text-foreground">
                      <Link to={item.to}>{item.cta}</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHAT IS PROJECT POLARIS? ── */}
      <section className="section border-b border-white/8" id="what-is-polaris">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <ScrollReveal direction="up">
              <div className="space-y-4">
                <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block">
                  About the Ecosystem
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  What is Project Polaris?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  Project Polaris is a student-led experiential learning ecosystem built by students, for students.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  We bridge the gap between traditional education and real-world learning by creating opportunities to build, research, experiment, collaborate, and showcase.
                </p>

                <div className="pt-2">
                  <Button
                    asChild
                    size="default"
                    className="h-10 px-6 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors text-xs"
                  >
                    <Link to="/about" className="flex items-center gap-1.5">
                      <span>Discover Polaris</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={40}>
              <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-card aspect-[4/3] flex items-center justify-center p-8">
                <img
                  src={studentsBuildingImg}
                  alt="Students building and experimenting in Project Polaris"
                  className="absolute inset-0 size-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-500"
                />
                <div className="relative z-10 p-5 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-center max-w-xs">
                  <img src={polarisLogo} alt="Polaris Logo" className="size-8 mx-auto mb-2 object-contain" />
                  <div className="text-xs font-bold font-display text-foreground">Built by Students, for Students</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Empowering curious minds to build real systems</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 8. IMPACT / VERIFIED NUMBERS ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="impact">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Verified Progress
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Our Impact in Numbers
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center font-sans">
            {[
              { value: "1000+", label: "Students Reached", note: "Across interactive sessions" },
              { value: "230+", label: "Community Members", note: "Active WhatsApp learners" },
              { value: "28+", label: "Contributors", note: "Volunteers, associates & team" },
              { value: "100+", label: "Cumulative Participants", note: "Deep session attendance" },
              { value: "4", label: "Workshops Conducted", note: "1-day expert masterclasses" },
            ].map((stat, idx) => (
              <ScrollReveal key={stat.label} direction="up" delay={idx * 20}>
                <div className="p-4 rounded-xl border border-white/8 bg-card">
                  <div className="text-2xl sm:text-3xl font-bold font-display text-primary">{stat.value}</div>
                  <div className="text-xs font-semibold text-foreground mt-1">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{stat.note}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. WHAT OUR STUDENTS SAY (SLIDING REVIEWS) ── */}
      <section className="section border-b border-white/8" id="reviews">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                  Community Voices
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  What Our Students Say
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous Review"
                  onClick={() => setReviewIndex((prev) => (prev > 0 ? prev - 1 : STUDENT_REVIEWS.length - 1))}
                  className="size-8 rounded-full border border-white/10 bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next Review"
                  onClick={() => setReviewIndex((prev) => (prev < STUDENT_REVIEWS.length - 1 ? prev + 1 : 0))}
                  className="size-8 rounded-full border border-white/10 bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Review Slider */}
          <div className="grid gap-4 md:grid-cols-2 font-sans">
            {[
              STUDENT_REVIEWS[reviewIndex],
              STUDENT_REVIEWS[(reviewIndex + 1) % STUDENT_REVIEWS.length],
            ].map((review) => (
              <div key={review.name} className="p-6 rounded-xl border border-white/8 bg-card flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans italic">
                  "{review.quote}"
                </p>
                <div className="pt-3 border-t border-white/6 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground font-display">{review.name}</div>
                    <div className="text-[10px] text-muted-foreground">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. VOICES BEHIND POLARIS (PAST SPEAKERS & COLLABORATORS) ── */}
      <section className="section bg-surface-2/10" id="speakers">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Mentors & Collaborators
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Voices Behind Polaris
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Distinguished scientists, founders, and engineers who have led sessions for Polaris explorers.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            {PAST_SPEAKERS.map((speaker, idx) => (
              <ScrollReveal key={speaker.name} direction="up" delay={idx * 30}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <div className="size-10 rounded-full bg-surface-2 border border-white/8 flex items-center justify-center text-primary font-bold text-sm mb-3">
                      {speaker.name.charAt(0)}
                    </div>
                    <h3 className="text-sm font-bold font-display text-foreground">{speaker.name}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{speaker.designation}</p>
                    <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                      "{speaker.topic}"
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-white/6 text-[10px] text-muted-foreground font-mono">
                    Session: {speaker.date}
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
