import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Timeline } from "@/components/site/Timeline";
import { useCountUp } from "@/hooks/use-reveal";
import { JOURNEY, STATS } from "@/lib/site";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact — Project Polaris" },
      {
        name: "description",
        content:
          "An honest account of what Project Polaris has built so far, what we're measuring, and what comes next.",
      },
      { property: "og:title", content: "Impact — Project Polaris" },
      { property: "og:description", content: "Our progress so far, told without inflated numbers." },
    ],
  }),
  component: Impact,
});

const MEASURES = [
  { label: "Verified Project Artifacts", note: "Working CFD models, orbital solvers, and research digests — not just meeting attendance." },
  { label: "Delivered Masterclasses", note: "Technical workshops run end-to-end with scientists from ISRO and industry mentors." },
  { label: "Direct Mentor Reviews", note: "One-on-one and sprint cohort technical reviews with experienced practitioners." },
  { label: "Open-Access Architecture", note: "Open-source computational tools and free community inquiry access for all students." },
];

const NEXT = [
  {
    title: "School Simulation Workstations",
    note: "Providing schools with turn-key computational aerodynamics and astrodynamics curriculum kits.",
  },
  {
    title: "Experiential Engineering Sprints",
    note: "Short, intense cohorts in rocketry propulsion, finite element analysis, and computational fluid dynamics.",
  },
  {
    title: "Flagship Software Platforms",
    note: "Scaling AeroForge AI, Sky Atlas astrophotography database, and peer-reviewed student research digests.",
  },
];

function ImpactStatCell({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const numericPart = parseInt(stat.value.replace(/[^0-9]/g, ""), 10);
  const suffix = stat.value.replace(/[0-9]/g, "");
  const [ref, count] = useCountUp(isNaN(numericPart) ? 0 : numericPart, 1200);

  return (
    <div className="bg-card p-6 text-center border border-border">
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span ref={ref} className="font-mono block text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {isNaN(numericPart) ? stat.value : `${count}${suffix}`}
        </span>
        <span className="font-mono text-xs font-semibold text-primary mt-2 block uppercase tracking-wider">{stat.label}</span>
        <span className="mt-1 block text-[11px] text-muted-foreground">{stat.note}</span>
      </dd>
    </div>
  );
}

function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Verified Impact"
        title="We'd rather be honest than impressive."
        lead="Project Polaris was founded to turn passive learners into active builders. Here is our exact record and roadmap."
      />

      <section className="border-b border-border bg-surface/20">
        <div className="shell">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 py-8">
            {STATS.map((s, i) => (
              <ImpactStatCell key={s.label} stat={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <ScrollReveal direction="left">
            <p className="eyebrow mb-2">The Record</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Chronological Milestones</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              No vanity metrics or inflated stats. Every milestone represents authentic student output, workshops run, or software deployed.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <Timeline items={JOURNEY} />
          </ScrollReveal>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Metrics</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">The metrics we prioritize</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEASURES.map((m, i) => (
              <ScrollReveal key={m.label} direction="up" delay={i * 60}>
                <div className="card-premium p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{m.label}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{m.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Roadmap</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Where we are heading</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {NEXT.map((n, i) => (
              <ScrollReveal key={n.title} direction="up" delay={i * 60}>
                <article className="card-premium p-6 h-full">
                  <h3 className="font-bold text-base text-foreground">{n.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{n.note}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/20">
        <div className="shell max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Help make the next milestone bigger.</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every build, simulation, and mentor review comes from students choosing to learn by doing.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="sm" className="h-9 px-5 bg-foreground text-background font-medium">
                <Link to="/join">Join Polaris</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-9 px-5">
                <Link to="/get-involved">Support the Work</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
