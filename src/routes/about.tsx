import { createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { TeamConstellation } from "@/components/site/TeamConstellation";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { Compass, Target, Sparkles } from "lucide-react";
import polarisLogo from "@/assets/polaris-logo.png";

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
          ]),
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      {/* ── 1. ABOUT HERO / STATEMENT (Subtle Ambient Glow + High Contrast Text) ── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24 border-b border-border bg-background">
        <ParallaxImage
          src="/media/nebula-hero.jpg"
          alt="Cosmic nebula deep space"
          intensity={0.12}
          imgOpacity={0.08}
          overlay={0.95}
          kenBurns={true}
          className="absolute inset-0 size-full pointer-events-none"
        />

        {/* Solid Center Contrast Mask */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_60%_at_50%_45%,rgba(8,10,15,0.7)_0%,rgba(8,10,15,0.98)_100%)]" />

        <div className="shell relative z-10 max-w-4xl space-y-5 font-sans">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              About Project Polaris
            </h1>
            <p className="mt-4 text-lg sm:text-2xl font-display text-primary font-medium max-w-2xl leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Project Polaris is a student-led organisation which aims to provide an experiential
              learning ecosystem to students.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={60}>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl font-sans">
              We bridge the gap between traditional education and real-world learning. Rather than
              focusing solely on theoretical knowledge and short-term opportunities, we create
              opportunities where students gain practical experience by working on projects,
              conducting research, participating in workshops, collaborating with industry
              professionals, and contributing to initiatives that create measurable impact.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-primary font-medium">
              We believe every student deserves access to quality learning opportunities regardless
              of their background, geography, or financial condition.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. MISSION & VISION (Allowed Eyebrow 1 of 2) ── */}
      <section className="section border-b border-border bg-surface/30" id="mission-vision">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2 font-sans max-w-4xl">
            {/* Mission Card */}
            <ScrollReveal direction="up" delay={0}>
              <div className="p-7 md:p-8 rounded-xl border border-primary/25 bg-card h-full flex flex-col justify-between space-y-4 shadow-lg card-gold-hover">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-2 font-semibold">
                    <Target className="size-4 text-gold" />
                    <span>OUR MISSION</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                    To make long-term practical, hands-on, and industry-relevant learning accessible
                    to every student.
                  </h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    By creating continuous opportunities to build, experiment, collaborate, and
                    innovate directly with mentors and peers.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/6 text-[11px] text-primary font-medium font-mono">
                  Built by Students, for Students
                </div>
              </div>
            </ScrollReveal>

            {/* Vision Card */}
            <ScrollReveal direction="up" delay={60}>
              <div className="p-7 md:p-8 rounded-xl border border-white/10 bg-card h-full flex flex-col justify-between space-y-4 shadow-lg hover:border-primary/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-2 font-semibold">
                    <Compass className="size-4 text-gold" />
                    <span>OUR VISION</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                    To become India's most trusted experiential learning ecosystem.
                  </h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Where students develop future-ready skills, critical thinking, and technical
                    confidence through real-world experiences.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/6 text-[11px] text-muted-foreground font-mono">
                  Empowering Every Curious Mind
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT PROJECT POLARIS IS NOT ── */}
      <section className="section border-b border-border" id="what-we-are-not">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-10 space-y-2">
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
                note: null,
              },
              {
                statement: "Project Polaris is not a school project.",
                note: null,
              },
              {
                statement: "Project Polaris is not just another student community.",
                note: null,
              },
              {
                statement: "Project Polaris is an experiential learning ecosystem.",
                highlight: true,
                note: "A collaborative environment where students learn by building, researching, and solving real challenges.",
              },
            ].map((card, i) => (
              <ScrollReveal key={card.statement} direction="up" delay={i * 30}>
                <div
                  className={`p-6 rounded-xl border h-full flex flex-col justify-between transition-all duration-200 ${
                    card.highlight
                      ? "border-primary/40 bg-primary/10 shadow-[0_0_24px_rgba(165,180,252,0.15)]"
                      : "border-white/8 bg-card hover:border-white/20"
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
                    {card.note ? (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-sans">
                        {card.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY WE STARTED (Integrated Astronomical Visual) ── */}
      <section className="section border-b border-border bg-surface/20" id="why-we-started">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <ScrollReveal direction="up">
              <div className="space-y-4 font-sans">
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  Why We Started
                </h2>
                <p className="text-sm text-foreground/90 font-medium font-display leading-snug">
                  Students are taught to ask, “What do you want to become?” — but rarely, “What
                  problem do you want to solve?”
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We saw a gap between learning and doing. Students prepare for exams, but often
                  lack opportunities to build, research, collaborate, and work with mentors.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Project Polaris began with a simple idea: students shouldn't have to wait until
                  college to start creating, researching, innovating, and leading.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inspired by the North Star, Polaris aims to guide students toward practical
                  learning, meaningful opportunities, and purpose — regardless of their age,
                  background, or location.
                </p>
                <div className="p-4 rounded-xl bg-card border border-primary/20 text-xs font-medium text-primary flex items-center gap-2">
                  <Sparkles className="size-4 text-gold shrink-0" />
                  <span>"Because learning becomes meaningful when you apply it."</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="clip" delay={40}>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-card aspect-[4/3] flex items-center justify-center p-8 shadow-xl">
                <img
                  src="/media/telescope-milkyway.jpg"
                  alt="Night Sky Observation & Astronomy"
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-500"
                />
                <div className="relative z-10 p-5 rounded-xl bg-background/85 backdrop-blur-md border border-white/12 text-center max-w-xs font-sans shadow-2xl">
                  <img
                    src={polarisLogo}
                    alt="Polaris North Star"
                    className="size-8 mx-auto mb-2 object-contain"
                  />
                  <div className="text-xs font-bold font-display text-foreground">
                    Guided by the North Star
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    A clear direction for curious explorers
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 5. PEOPLE BEHIND POLARIS (Allowed Eyebrow 2 of 2) ── */}
      <section className="section" id="team-constellation">
        <div className="shell space-y-6">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-6 font-sans">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                People Behind Project Polaris
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Polaris is the central direction. The people are the constellation that makes the
                mission possible.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Team Constellation Canvas & Profile Inspector */}
          <ScrollReveal direction="up" delay={40}>
            <TeamConstellation />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
