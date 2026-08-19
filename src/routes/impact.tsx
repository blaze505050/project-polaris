import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
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
          "An honest account of what Project Polaris has done so far, what we're measuring, and what comes next.",
      },
      { property: "og:title", content: "Impact — Project Polaris" },
      { property: "og:description", content: "Our progress so far, told without inflated numbers." },
    ],
  }),
  component: Impact,
});

const MEASURES = [
  { label: "Students who built something", note: "Not attendance — completed projects and research work." },
  { label: "Sessions run", note: "Workshops and expert-led sessions delivered end to end." },
  { label: "Mentor connections", note: "Real conversations between learners and practitioners." },
  { label: "Open to all", note: "Students from any school, college or background can take part." },
];

const NEXT = [
  {
    title: "Reaching schools directly",
    note: "We are preparing a ready-to-run outreach kit so schools can host a Polaris workshop with their own students.",
  },
  {
    title: "Paid courses with a finished output",
    note: "Short, project-based courses in space science, rocketry and research methods, with transparent pricing and scholarships.",
  },
  {
    title: "Student-built projects",
    note: "AeroForge AI research lab, an open sky atlas and a student research digest, all built in collaborative teams.",
  },
];

function ImpactStatCell({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const numericPart = parseInt(stat.value.replace(/[^0-9]/g, ""), 10);
  const suffix = stat.value.replace(/[0-9]/g, "");
  const [ref, count] = useCountUp(isNaN(numericPart) ? 0 : numericPart, 1200);

  return (
    <div
      className="bg-background px-6 py-9 text-center"
      style={{ animation: `fade-in-up 500ms ease-out ${index * 100}ms both` }}
    >
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span ref={ref} className="font-display block text-4xl text-gradient-star font-extrabold md:text-5xl">
          {isNaN(numericPart) ? stat.value : `${count}${suffix}`}
        </span>
        <span className="font-ui mt-3 block text-sm font-semibold text-foreground">{stat.label}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{stat.note}</span>
      </dd>
    </div>
  );
}

function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Impact"
        title="We'd rather be honest than impressive."
        lead="Project Polaris started on 7 June. Here is exactly where we are — and how we intend to measure whether this works."
      />

      <section className="border-b border-border bg-surface/30">
        <div className="shell">
          <dl className="grid grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4">
            {STATS.map((s, i) => (
              <ImpactStatCell key={s.label} stat={s} index={i} />
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5">The record</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Everything that has happened</h2>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              No vanity metrics. When there's more to report, this page grows.
            </p>
          </div>
          <Timeline items={JOURNEY} />
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <p className="eyebrow mb-5">What we measure</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold text-foreground">The numbers we care about</h2>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {MEASURES.map((m, i) => (
              <div
                key={m.label}
                className="bg-background p-6 hover:bg-surface transition-colors"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 70}ms both` }}
              >
                <dt className="font-display text-lg font-bold text-foreground">{m.label}</dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell">
          <p className="eyebrow mb-5">What comes next</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold text-foreground">Where we are heading</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {NEXT.map((n, i) => (
              <article
                key={n.title}
                className="card-elevated p-7"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 80}ms both` }}
              >
                <h3 className="text-xl font-display font-bold text-foreground">{n.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{n.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Help make the next entry bigger.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Every session, project and mentor connection comes from someone deciding to take part.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
              <Link to="/join">Join Polaris</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/get-involved">Support the work</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

