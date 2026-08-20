import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Timeline } from "@/components/site/Timeline";
import { NorthStar } from "@/components/site/NorthStar";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { JOURNEY, VALUES, TEAM_MEMBERS, DEPARTMENTS, RECOGNITION_SYSTEM, WORKING_CULTURE, SITE } from "@/lib/site";
import polarisLogo from "@/assets/polaris-logo.png";
import {
  ExternalLink,
  Users,
  Hammer,
  Lightbulb,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  HeartHandshake,
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
  { text: "Build authentic physics & software systems?", icon: Hammer },
  { text: "Present research in front of peers and engineers?", icon: Sparkles },
  { text: "Meet ISRO scientists and propulsion innovators?", icon: Users },
  { text: "Conduct verified, peer-reviewed experiments?", icon: Lightbulb },
  { text: "Turn textbook theory into public platforms?", icon: Flame },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Polaris"
        title="We believe education should create builders, not just test takers."
        lead="Project Polaris is an experiential engineering and science organisation turning curiosity into public artifacts."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join WhatsApp Community
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <Link to="/projects">Explore Projects</Link>
          </Button>
        </div>
      </PageHeader>

      {/* CORE PHILOSOPHY */}
      <section className="section">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div>
                <p className="eyebrow mb-2">The Provocation</p>
                <h2 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight">
                  What if education wasn't just about passing exams?
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Millions of students memorize formulas and solve problem sets for grades every year. Yet very few ever get to configure a CFD mesh, calculate orbital state vectors, or present to a propulsion engineer.
                </p>
                <p className="mt-3 text-xs sm:text-sm text-foreground font-semibold">
                  Polaris closes that gap through sprint-based build cohorts.
                </p>
              </div>

              {/* Dilemma Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {DILEMMA_QUESTIONS.map(({ text, icon: Icon }, i) => (
                  <ScrollReveal key={text} direction="up" delay={i * 50}>
                    <div className="card-premium p-4 flex items-center gap-3 h-full">
                      <div className="flex size-8 items-center justify-center rounded bg-surface-2 text-primary shrink-0 border border-border">
                        <Icon className="size-4" />
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

      {/* MISSION & VISION */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal direction="up" delay={0}>
              <article className="card-premium p-6 md:p-8 h-full">
                <p className="eyebrow mb-2">Our Mission</p>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  To make experiential engineering education universally accessible by giving students real-world simulation tools, research mentors, and build sprints.
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Through expert masterclasses, computational research cohorts, and software development, we empower students to turn theoretical physics into tangible systems.
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <article className="card-premium p-6 md:p-8 h-full">
                <p className="eyebrow mb-2">Our Vision</p>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  A future where engineering capabilities are measured by working artifacts and verified technical portfolios, not rote test scores.
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Building one of the world's most disciplined student research communities — empowering young builders to become computational scientists and engineers.
                </p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <p className="eyebrow mb-1">Leadership</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Behind Project Polaris</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Project Polaris is founded and led by students who believe in open computational tools and authentic science.
                </p>
              </div>
              <span className="font-mono text-xs text-primary px-3 py-1 rounded bg-surface-2 border border-border">
                Student-Led Initiative
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <ScrollReveal key={member.name} direction="up" delay={i * 60}>
                <article className="card-premium p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between">
                      <img src={polarisLogo} alt="Polaris Logo" className="size-7 rounded-full border border-border" />
                      <span className="size-1.5 rounded-full bg-primary" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground">{member.name}</h3>
                    <p className="font-mono text-xs text-primary mt-0.5">{member.role}</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{member.note}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="text-[11px]">Polaris Core</span>
                    <span className="text-primary text-[11px]">Engineering</span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CORE DEPARTMENTS */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Architecture</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Core Departments</h2>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {DEPARTMENTS.map((dept, idx) => (
              <ScrollReveal key={dept.name} direction="up" delay={idx * 60}>
                <article className="card-premium p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-border font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
                      {dept.role}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-foreground">{dept.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{dept.blurb}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION & CULTURE */}
      <section className="section border-t border-border">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <ScrollReveal direction="up" delay={0}>
              <div className="card-premium p-6 md:p-8 h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-3">
                  <Award className="size-4" />
                  <span>Merit-Based Recognition</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Recognition Framework</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  We recognize verified student contributions through a structured, merit-based reward system that validates real engineering skills.
                </p>

                <ul className="mt-6 space-y-2 text-xs">
                  {RECOGNITION_SYSTEM.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 p-2 rounded bg-surface-2 border border-border">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="card-premium p-6 md:p-8 h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-3">
                  <HeartHandshake className="size-4" />
                  <span>Operating Principles</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Working Culture</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Every volunteer, associate, and core team member operates with professional standards, code peer reviews, and high empathy.
                </p>

                <div className="mt-6 space-y-2">
                  {WORKING_CULTURE.map(({ rule, detail }) => (
                    <div key={rule} className="p-2.5 rounded bg-surface-2 border border-border">
                      <p className="font-semibold text-xs text-foreground">{rule}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Values</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What we hold ourselves to</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.name} direction="up" delay={i * 50}>
                <div className="card-premium p-6 h-full">
                  <h3 className="font-bold text-sm text-foreground">{value.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{value.note}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY POLARIS */}
      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-center">
              <div>
                <NorthStar className="size-8 text-primary" />
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">Why the name "Polaris"?</h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p>
                  For centuries, the North Star has guided explorers through uncharted territory. It does not dictate where you go — it provides an immutable reference point for where you are.
                </p>
                <p>
                  In the same way, Project Polaris guides student engineers toward practical computation, simulation tools, and verified research trajectories.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
