import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Timeline } from "@/components/site/Timeline";
import { NorthStar } from "@/components/site/NorthStar";
import { SectionHeader } from "@/components/site/SectionHeader";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ConstellationCanvas } from "@/components/site/ConstellationCanvas";
import { Starfield } from "@/components/site/Starfield";
import { JOURNEY, VALUES, TEAM_MEMBERS, SITE } from "@/lib/site";
import polarisLogo from "@/assets/polaris-logo.png";
import {
  ExternalLink,
  Linkedin,
  Users,
  Compass,
  Hammer,
  Lightbulb,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Project Polaris" },
      {
        name: "description",
        content:
          "What if education wasn't just about passing exams? Discover why Project Polaris was built to turn curiosity into action and students into builders.",
      },
      { property: "og:title", content: "About — Project Polaris" },
      {
        property: "og:description",
        content:
          "A platform where curiosity becomes action, ideas become projects, and students become builders.",
      },
    ],
  }),
  component: About,
});

const DILEMMA_QUESTIONS = [
  { text: "Build something real?", icon: Hammer },
  { text: "Speak in front of an audience?", icon: Sparkles },
  { text: "Meet scientists and innovators?", icon: Users },
  { text: "Conduct authentic research?", icon: Lightbulb },
  { text: "Turn ideas into meaningful action?", icon: Flame },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="We believe education should create builders, not just learners."
        lead="Project Polaris is a student-led initiative dedicated to making practical, hands-on education accessible to every learner."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent hover:opacity-95 hover:scale-105 active:scale-95 text-primary-foreground border-none btn-shimmer transition-all duration-300">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join Our Community
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50 hover:scale-105 active:scale-95 transition-all duration-300">
            <Link to="/projects">Explore Projects</Link>
          </Button>
        </div>
      </PageHeader>

      {/* CORE PHILOSOPHY & THE GAP */}
      <section className="section relative overflow-hidden">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 items-center">
              <div>
                <span className="font-ui text-xs font-semibold uppercase tracking-wider text-primary">The Provocation</span>
                <h2 className="mt-3 text-3xl md:text-5xl font-display font-extrabold text-foreground leading-[1.15]">
                  What if education wasn't just about <span className="text-gradient-star">passing exams?</span>
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  Millions of students learn every single day. They solve equations, memorise formulas, and study for grades.
                  Yet how many actually get the chance to discover their true potential?
                </p>
                <p className="mt-4 text-foreground font-semibold">
                  That is the gap we are determined to close.
                </p>
              </div>

              {/* Interactive Dilemma Cards */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                {DILEMMA_QUESTIONS.map(({ text, icon: Icon }, i) => (
                  <ScrollReveal key={text} direction="up" delay={i * 60}>
                    <SpotlightCard
                      spotlightColor="rgba(197, 157, 255, 0.18)"
                      className="p-5 flex items-center gap-4 transition-all duration-300 hover:border-primary/50 group h-full"
                    >
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 transition-transform group-hover:scale-110">
                        <Icon className="size-5" />
                      </div>
                      <p className="font-display font-bold text-foreground text-sm leading-snug">{text}</p>
                    </SpotlightCard>
                  </ScrollReveal>
                ))}
                <ScrollReveal direction="up" delay={300} className="sm:col-span-2">
                  <SpotlightCard
                    spotlightColor="rgba(56, 189, 248, 0.2)"
                    className="p-5 flex items-center gap-4 border-primary/40 bg-primary/5 h-full"
                  >
                    <CheckCircle2 className="size-6 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      What if every student had the opportunity to build, experiment, lead, fail, improve, and discover what they are capable of?
                    </p>
                  </SpotlightCard>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MANIFESTO SECTION WITH INTERACTIVE CONSTELLATION */}
      <section className="section border-t border-border bg-surface/20 relative overflow-hidden">
        <ConstellationCanvas className="opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="shell relative z-10 max-w-4xl text-center">
          <ScrollReveal direction="scale">
            <span className="eyebrow mb-4">The Polaris Manifesto</span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-foreground leading-tight">
              So, we built <span className="text-gradient-star">Polaris</span>.
            </h2>
            <div className="mt-8 space-y-4 font-display text-xl md:text-2xl text-muted-foreground font-medium">
              <p className="text-slate-400">Not another coaching institute.</p>
              <p className="text-slate-400">Not another passive student club.</p>
              <p className="text-foreground font-bold text-2xl md:text-3xl pt-2">
                A platform where <span className="text-primary">curiosity becomes action</span>.
              </p>
              <p className="text-foreground font-bold text-2xl md:text-3xl">
                Where <span className="text-primary">ideas become projects</span>.
              </p>
              <p className="text-foreground font-bold text-2xl md:text-3xl">
                Where <span className="text-gradient-star">students become builders</span>.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-10 md:grid-cols-2">
              <article className="card-elevated p-8 md:p-10 border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 size-32 bg-primary/10 blur-2xl pointer-events-none rounded-full" />
                <p className="eyebrow mb-5 text-primary">Our Mission</p>
                <p className="font-display text-xl leading-relaxed md:text-2xl text-foreground font-bold">
                  To make practical, high-quality education accessible and affordable by providing students with real-world experiences, industry exposure, and opportunities to build skills that truly matter.
                </p>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  Through expert-led workshops, research opportunities, innovation challenges, and hands-on projects, we empower students to discover their potential and turn ideas into impact.
                </p>
              </article>

              <article className="card-elevated p-8 md:p-10 border-accent/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 size-32 bg-accent/10 blur-2xl pointer-events-none rounded-full" />
                <p className="eyebrow mb-5 text-accent">Our Vision</p>
                <p className="font-display text-xl leading-relaxed md:text-2xl text-foreground font-bold">
                  We envision a future where education is no longer limited by textbooks, classrooms, or examinations.
                </p>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  To build one of the world's most impactful student communities — one that nurtures curiosity, encourages innovation, and empowers young minds to become researchers, entrepreneurs, scientists, engineers, creators, and leaders capable of shaping the future.
                </p>
              </article>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <p className="eyebrow mb-3">Leadership & Team</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Behind Project Polaris
                </h2>
                <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
                  Project Polaris is founded, built, and led by students who believe in practical learning and scientific exploration.
                </p>
              </div>
              <span className="font-ui text-xs font-semibold px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                100% Student-Led Initiative
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <ScrollReveal key={member.name} direction="up" delay={i * 100}>
                <article
                  className="card-elevated p-7 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 h-full"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <img src={polarisLogo} alt="Polaris Logo" className="size-9 rounded-full ring-2 ring-primary/20" />
                      <span className="size-2 rounded-full bg-primary/60" />
                    </div>
                    <h3 className="mt-5 text-xl font-display font-bold text-foreground">{member.name}</h3>
                    <p className="font-ui text-xs text-primary font-semibold mt-1">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{member.note}</p>
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">Project Polaris</span>
                    <span className="text-primary font-medium">Core Member</span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Team Notice Card */}
          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-display font-bold text-foreground text-lg">Full Team & Advisory Board Roster Updating Soon</h3>
              <p className="text-sm text-muted-foreground">
                We are currently expanding our core departments, volunteer network, and advisory board across schools and universities. Official member portraits and bios will be published shortly.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full shrink-0">
              <Link to="/get-involved" className="flex items-center gap-2">
                <span>Join the Team</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-5">Our Values</p>
            <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold">What we hold ourselves to</h2>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value) => (
                <div key={value.name} className="bg-background p-6 hover:bg-surface transition-colors">
                  <dt className="font-display text-lg font-semibold text-foreground">{value.name}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{value.note}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </section>

      {/* WHY POLARIS */}
      <section className="veil section relative overflow-hidden border-t border-border">
        <div className="shell relative">
          <ScrollReveal direction="up">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 items-center">
              <div>
                <NorthStar className="size-10 text-primary" />
                <h2 className="mt-6 text-3xl md:text-4xl font-display font-bold">Why the name "Polaris"?</h2>
              </div>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  For centuries, the North Star has guided explorers through uncertainty. It does not tell
                  you where to go — it tells you where you are.
                </p>
                <p>
                  In the same way, we guide students toward opportunities, purpose, practical
                  learning, experimentation, and meaningful action in a fast-evolving world.
                </p>
                <p className="text-foreground font-medium">
                  Project Polaris is built on the conviction that learning becomes memorable when it is applied, that leadership is earned by creating value, and that young people build extraordinary things when given the right environment.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div>
                <p className="eyebrow mb-5">Our Journey</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Everything so far</h2>
                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                  Transparent, honest, and still very early. Every step has been driven by students who care.
                </p>
              </div>
              <Timeline items={JOURNEY} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHERE WE'RE GOING */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell max-w-4xl">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-5">Future Roadmaps</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Where we are heading next</h2>
            <p className="mt-3 text-muted-foreground">Programs, fellowships, camps, and global cohorts currently in development.</p>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                "Student Research Programs & Publications",
                "Educational Camps & Space Science Trips",
                "Structured Online Project-Based Courses",
                "International Workshop Expansions",
                "Innovation Fellowships & Grants",
                "Institutional School & College Partnerships",
                "Orbital Simulators & Ground Station Networks",
                "1-on-1 Mentorship Networks",
                "Global Student Builder Community",
              ].map((goal) => (
                <li
                  key={goal}
                  className="font-ui rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground flex items-center gap-2.5 backdrop-blur-md"
                >
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                  Join Community
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer">
                  Apply to Volunteer Program
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
