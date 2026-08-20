import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { NorthStar } from "@/components/site/NorthStar";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  JOURNEY,
  VALUES,
  TEAM_MEMBERS,
  DEPARTMENTS,
  RECOGNITION_SYSTEM,
  WORKING_CULTURE,
  SITE,
  BRAND_POSITIONING,
  THREE_PILLARS,
} from "@/lib/site";
import polarisLogo from "@/assets/polaris-logo.png";
import {
  Users,
  Hammer,
  Lightbulb,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  HeartHandshake,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Project Polaris — Mission, Leadership & Values" },
      {
        name: "description",
        content:
          "Discover why Project Polaris was founded, our student engineering ecosystem, leadership team, and working principles.",
      },
      { property: "og:title", content: "About Project Polaris — Mission, Leadership & Values" },
      {
        property: "og:description",
        content:
          "Building real things. Learning along the way. The story, leadership, and operating culture of Project Polaris.",
      },
    ],
  }),
  component: AboutPage,
});

const DILEMMA_QUESTIONS = [
  { text: "Build authentic physics & software systems?", icon: Hammer },
  { text: "Present research in front of peers and engineers?", icon: Sparkles },
  { text: "Meet ISRO scientists and propulsion innovators?", icon: Users },
  { text: "Conduct verified, peer-reviewed experiments?", icon: Lightbulb },
  { text: "Turn textbook theory into public platforms?", icon: Flame },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Polaris Story"
        title="Building real things. Learning along the way."
        lead="Project Polaris is a student engineering ecosystem bridging traditional education and real-world skills through interactive simulations, research cohorts, and collaborative build squads."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-bold font-mono text-xs shadow-md">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join WhatsApp Community
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40">
            <Link to="/showcase">View Student Artifacts</Link>
          </Button>
        </div>
      </PageHeader>

      {/* ── CORE PHILOSOPHY & PROVOCATION ── */}
      <section className="section">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-2">
                  The Provocation
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground leading-tight">
                  What if education wasn't just about memorizing textbooks?
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                  Millions of students solve theoretical problems for grades every semester, yet rarely configure a CFD mesh, calculate orbital transfer burns, or defend technical research in front of practicing aerospace engineers.
                </p>
                <p className="mt-3 text-xs sm:text-sm text-[#e8d7ff] font-semibold font-body">
                  Project Polaris is built to bridge that gap through student-led build cohorts.
                </p>
              </div>

              {/* Dilemma Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {DILEMMA_QUESTIONS.map(({ text, icon: Icon }, i) => (
                  <ScrollReveal key={text} direction="up" delay={i * 50}>
                    <div className="p-4 rounded-xl border border-white/8 bg-surface/70 backdrop-blur-xl flex items-center gap-3 h-full hover:border-primary/30 transition-colors">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-primary shrink-0 border border-white/8">
                        <Icon className="size-4 text-gold" />
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-snug">{text}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section className="section border-t border-white/8 bg-surface-2/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Operating Architecture"
            title="The Three Pillars of Polaris"
            lead="Everything in the ecosystem connects to one of three core principles."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {THREE_PILLARS.map((pillar, i) => (
              <ScrollReveal key={pillar.key} direction="up" delay={i * 50}>
                <article className="p-6 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl h-full flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        {pillar.key}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">{pillar.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold font-display text-foreground">{pillar.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="section border-t border-white/8">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal direction="up" delay={0}>
              <article className="p-6 md:p-8 rounded-2xl border border-primary/25 bg-surface/80 backdrop-blur-xl h-full">
                <p className="eyebrow mb-2 text-primary font-mono text-xs uppercase tracking-wider">Our Mission</p>
                <h3 className="text-lg sm:text-xl font-bold font-display text-foreground leading-snug">
                  {SITE.mission}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-body">
                  Through workshops, innovation challenges, research programs, mentorship, and industry collaborations, we empower students to explore, build, and solve meaningful problems.
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <article className="p-6 md:p-8 rounded-2xl border border-gold/25 bg-surface/80 backdrop-blur-xl h-full">
                <p className="eyebrow mb-2 text-gold font-mono text-xs uppercase tracking-wider">Our Vision</p>
                <h3 className="text-lg sm:text-xl font-bold font-display text-foreground leading-snug">
                  {SITE.vision}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-body">
                  To create a generation of curious thinkers, innovators, and future leaders who learn beyond textbooks through authentic building and scientific inquiry.
                </p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP & TEAM ── */}
      <section className="section border-t border-white/8 bg-surface-2/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Core Team
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Behind Project Polaris</h2>
                <p className="mt-1 text-xs text-muted-foreground font-body">
                  Founded and led by students who believe in open computational tools, reproducible science, and peer-to-peer building.
                </p>
              </div>
              <span className="font-mono text-xs text-gold px-3 py-1 rounded-full bg-surface-2 border border-gold/30">
                Student-Led Ecosystem
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <ScrollReveal key={member.name} direction="up" delay={i * 50}>
                <article className="p-6 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/30 transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <img src={polarisLogo} alt="Polaris Logo" className="size-7 rounded-full border border-primary/30" />
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground font-display">{member.name}</h3>
                    <p className="font-mono text-xs text-primary mt-0.5">{member.role}</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">{member.note}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="text-[11px]">Polaris Core</span>
                    <span className="text-primary text-[11px]">Member</span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION & CULTURE ── */}
      <section className="section border-t border-white/8">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <ScrollReveal direction="up" delay={0}>
              <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-surface/80 backdrop-blur-xl h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-3">
                  <Award className="size-4 text-gold" />
                  <span>Merit-Based Recognition</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Recognition Framework</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  We recognize verified student contributions through a structured, merit-based reward system that validates real engineering skills.
                </p>

                <ul className="mt-6 space-y-2 text-xs font-body">
                  {RECOGNITION_SYSTEM.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-2 border border-white/6">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="p-6 md:p-8 rounded-2xl border border-gold/20 bg-surface/80 backdrop-blur-xl h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase mb-3">
                  <HeartHandshake className="size-4 text-primary" />
                  <span>Operating Principles</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Working Culture</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  Every volunteer, associate, and core team member operates with professional standards, code peer reviews, and high empathy.
                </p>

                <div className="mt-6 space-y-2 font-body">
                  {WORKING_CULTURE.map(({ rule, detail }) => (
                    <div key={rule} className="p-2.5 rounded-lg bg-surface-2 border border-white/6">
                      <p className="font-semibold text-xs text-primary">{rule}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="section border-t border-white/8 bg-surface-2/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Our 9 Core Values</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.name} direction="up" delay={i * 40}>
                <div className="p-6 rounded-2xl border border-white/8 bg-surface/70 backdrop-blur-xl h-full hover:border-primary/30 transition-colors">
                  <h3 className="font-bold text-sm text-primary font-display">{value.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">{value.note}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
