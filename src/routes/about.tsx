import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TeamConstellation } from "@/components/site/TeamConstellation";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import {
  Compass,
  Target,
  Sparkles,
  Award,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import polarisLogo from "@/assets/polaris-logo.png";
import nightObservationImg from "@/assets/night-observation.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Mission, Vision & Team | Project Polaris" },
      {
        name: "description",
        content:
          "Discover why Project Polaris was founded, our student engineering ecosystem, mission, vision, and the interactive team constellation.",
      },
      { property: "og:title", content: "About Us — Mission, Vision & Team | Project Polaris" },
      {
        property: "og:description",
        content:
          "Project Polaris is a student-led organisation which aims to provide an experiential learning ecosystem to students.",
      },
      { property: "og:url", content: "https://projectpolaris.in/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getBreadcrumbSchema([
            { name: "Home", item: "/" },
            { name: "About Us", item: "/about" },
          ])
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      {/* ── 1. ABOUT HERO / STATEMENT ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        <div className="shell max-w-4xl mx-auto text-center space-y-5 font-sans">
          <ScrollReveal direction="up">
            <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-2">
              Our Identity
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight leading-tight">
              About Project Polaris
            </h1>
            <p className="mt-4 text-lg sm:text-2xl font-display text-primary/95 font-medium max-w-2xl mx-auto leading-snug">
              Project Polaris is a student-led organisation which aims to provide an experiential learning ecosystem to students.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={60}>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
              We bridge the gap between traditional education and real-world learning. Rather than focusing solely on theoretical knowledge and short-term opportunities, we create opportunities where students gain practical experience by working on projects, conducting research, participating in workshops, collaborating with industry professionals, and contributing to initiatives that create measurable impact.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-primary font-medium">
              We believe every student deserves access to quality learning opportunities regardless of their background, geography, or financial condition.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. MISSION & VISION ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="mission-vision">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2 font-sans max-w-4xl mx-auto">
            {/* Mission Card */}
            <ScrollReveal direction="up" delay={0}>
              <div className="p-7 md:p-8 rounded-xl border border-primary/20 bg-card h-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-2 font-semibold">
                    <Target className="size-4" />
                    <span>OUR MISSION</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                    To make long-term practical, hands-on, and industry-relevant learning accessible to every student.
                  </h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    By creating continuous opportunities to build, experiment, collaborate, and innovate directly with mentors and peers.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/6 text-[11px] text-primary font-medium">
                  Built by Students, for Students
                </div>
              </div>
            </ScrollReveal>

            {/* Vision Card */}
            <ScrollReveal direction="up" delay={60}>
              <div className="p-7 md:p-8 rounded-xl border border-white/10 bg-card h-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-2 font-semibold">
                    <Compass className="size-4" />
                    <span>OUR VISION</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                    To become India's most trusted experiential learning ecosystem.
                  </h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Where students develop future-ready skills, critical thinking, and technical confidence through real-world experiences.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/6 text-[11px] text-muted-foreground">
                  Empowering Every Curious Mind
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT PROJECT POLARIS IS NOT ── */}
      <section className="section border-b border-white/8" id="what-we-are-not">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block">
                Clear Differentiation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                What Project Polaris Is NOT
              </h2>
              <p className="text-xs text-muted-foreground font-sans">
                Understanding our exact positioning and purpose.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans max-w-5xl mx-auto">
            {[
              {
                statement: "Project Polaris is not a coaching institute.",
                note: "We do not sell rote test prep or exam formulas. We provide computational simulation and research tools.",
              },
              {
                statement: "Project Polaris is not a school project.",
                note: "Our programs create verified public artifacts, CFD solvers, and open-access scientific datasets.",
              },
              {
                statement: "Project Polaris is not just another student community.",
                note: "We are an active engineering ecosystem with structured cohorts, ISRO masterclasses, and sprint squads.",
              },
              {
                statement: "Project Polaris is an experiential learning ecosystem.",
                highlight: true,
                note: "A collaborative environment where students learn by building, researching, and solving real challenges.",
              },
            ].map((card, i) => (
              <ScrollReveal key={card.statement} direction="up" delay={i * 30}>
                <div
                  className={`p-6 rounded-xl border h-full flex flex-col justify-between transition-colors ${
                    card.highlight
                      ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(165,180,252,0.1)]"
                      : "border-white/8 bg-card hover:border-white/16"
                  }`}
                >
                  <div>
                    <div className="mb-3">
                      {card.highlight ? (
                        <span className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="size-6 rounded-full bg-white/6 text-muted-foreground flex items-center justify-center text-xs font-bold">
                          ✕
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold font-display text-foreground leading-snug">
                      {card.statement}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-sans">
                      {card.note}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY WE STARTED ── */}
      <section className="section border-b border-white/8 bg-surface-2/20" id="why-we-started">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <ScrollReveal direction="up">
              <div className="space-y-4 font-sans">
                <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block">
                  The Genesis
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Why We Started
                </h2>
                <p className="text-sm text-foreground/90 font-medium font-display leading-snug">
                  Students are taught to ask, “What do you want to become?” — but rarely, “What problem do you want to solve?”
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We saw a gap between learning and doing. Students prepare for exams, but often lack opportunities to build, research, collaborate, and work with mentors.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Project Polaris began with a simple idea: students shouldn't have to wait until college to start creating, researching, innovating, and leading.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inspired by the North Star, Polaris aims to guide students toward practical learning, meaningful opportunities, and purpose — regardless of their age, background, or location.
                </p>
                <div className="p-4 rounded-xl bg-card border border-primary/20 text-xs font-medium text-primary">
                  "Because learning becomes meaningful when you apply it."
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={40}>
              <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-card aspect-[4/3] flex items-center justify-center p-8">
                <img
                  src={nightObservationImg}
                  alt="Night Sky Observation & Astronomy"
                  className="absolute inset-0 size-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-500"
                />
                <div className="relative z-10 p-5 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-center max-w-xs font-sans">
                  <img src={polarisLogo} alt="Polaris North Star" className="size-8 mx-auto mb-2 object-contain" />
                  <div className="text-xs font-bold font-display text-foreground">Guided by the North Star</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">A clear direction for curious explorers</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 5. PEOPLE BEHIND POLARIS (INTERACTIVE TEAM CONSTELLATION) ── */}
      <section className="section" id="team-constellation">
        <div className="shell space-y-6">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-6 font-sans">
              <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold block mb-1">
                Core Constellation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                People Behind Polaris
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Polaris is the central direction. The people are the constellation that makes the mission possible.
              </p>
            </div>
          </ScrollReveal>

          {/* The Interactive Draggable Constellation Canvas & Profile Inspector */}
          <ScrollReveal direction="up" delay={40}>
            <TeamConstellation />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
