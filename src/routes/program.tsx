import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { SITE } from "@/lib/site";
import {
  AWARDS,
  DOMAINS,
  PROGRAM,
  PROGRAM_PEOPLE,
  PROGRAM_PHASES,
  PROGRAM_STATS,
  PROJECT_TRACKS,
  QUALITY_BAR,
  SCHEDULE,
  SESSION_TYPES,
  ZERO_COST,
} from "@/lib/curriculum";
import { SITE_URL } from "@/lib/site";

const URL = `${SITE_URL}/program`;
const DESC =
  "The Polaris Innovation Program: a 14-day interdisciplinary space science, technology and innovation curriculum — discover, investigate, build and showcase a real project.";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Polaris Innovation Program — 14-Day Curriculum" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Polaris Innovation Program — 14-Day Curriculum" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: PROGRAM.name,
          description: DESC,
          url: URL,
          timeRequired: "P14D",
          provider: {
            "@type": "EducationalOrganization",
            name: "Project Polaris",
            url: SITE_URL,
          },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: "P14D",
          },
        }),
      },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  return (
    <>
      <PageHeader
        eyebrow="Polaris Innovation Program"
        title="Learn while building — not building after learning."
        lead={PROGRAM.lead}
      />

      <section className="section pt-0">
        <div className="shell">
          <div className="font-ui flex flex-wrap gap-3">
            {PROGRAM.arc.map((s) => (
              <span key={s} className="rounded-full border border-border px-4 py-1.5 text-xs">
                {s}
              </span>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10 md:grid-cols-5">
            {PROGRAM_STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl">{s.value}</dt>
                <dd className="font-ui mt-2 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHeader eyebrow="The central challenge" title="The Polaris Frontier Challenge" />
          <blockquote className="mt-8 border-l border-primary pl-6 text-lg text-muted-foreground">
            {PROGRAM.challenge}
          </blockquote>
          <p className="font-ui mt-6 text-xs tracking-widest text-muted-foreground uppercase">
            One problem → many domains → many solutions → one showcase
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHeader eyebrow="Program journey" title="Four phases, one repeating loop." />
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAM_PHASES.map((p) => (
              <div key={p.no} className="bg-background p-7">
                <span className="font-ui text-xs text-primary">{p.no}</span>
                <h3 className="mt-3 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="font-ui mt-6 text-xs text-muted-foreground">{PROGRAM.loop}</p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHeader
            eyebrow="How days work"
            title="Five session types — not fourteen lectures."
            lead="Short concept sessions are mixed with peer-led, mentor-led and self-directed time, so students spend most hours doing rather than listening."
          />
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {SESSION_TYPES.map((s) => (
              <li key={s.name} className="grid gap-2 py-6 md:grid-cols-[16rem_1fr] md:gap-8">
                <h3 className="font-ui text-sm tracking-wide">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHeader eyebrow="Day by day" title="The 14-day schedule." />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="font-ui border-b border-border text-xs tracking-widest text-muted-foreground uppercase">
                  <th className="py-3 pr-4 font-medium">Day</th>
                  <th className="py-3 pr-4 font-medium">Focus</th>
                  <th className="py-3 pr-4 font-medium">Session</th>
                  <th className="py-3 font-medium">Key output</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((d) => (
                  <tr key={d.day} className="border-b border-border">
                    <td className="font-ui py-4 pr-4 whitespace-nowrap">{d.day}</td>
                    <td className="py-4 pr-4">{d.focus}</td>
                    <td className="font-ui py-4 pr-4 text-xs text-muted-foreground">{d.type}</td>
                    <td className="py-4 text-muted-foreground">{d.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHeader eyebrow="Integrated domains" title="Every domain feeds every project." />
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {DOMAINS.map((d) => (
              <div key={d.name} className="bg-background p-6">
                <h3 className="text-lg">{d.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Final project" title="Ten tracks — pick a path, not a topic." />
            <ol className="mt-8 divide-y divide-border border-y border-border">
              {PROJECT_TRACKS.map((t, i) => (
                <li key={t.name} className="flex gap-4 py-4">
                  <span className="font-ui text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm">{t.name}</p>
                    <p className="font-ui mt-1 text-xs text-muted-foreground">{t.domains}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeader eyebrow="Quality bar" title="What every project must show." />
            <ul className="mt-8 space-y-4">
              {QUALITY_BAR.map((q) => (
                <li key={q} className="flex gap-3 text-sm text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                  />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHeader
            eyebrow="Zero-cost building"
            title="Hands-on, without spending a rupee."
            lead="Every physical build uses materials students already have at home. Every digital tool is free."
          />
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {ZERO_COST.map((g) => (
              <div key={g.title}>
                <h3 className="font-ui text-sm tracking-wide">{g.title}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="People" title="Mentors and project associates." />
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {PROGRAM_PEOPLE.map((p) => (
                <li key={p.role} className="flex gap-5 py-5">
                  <span className="font-display text-2xl text-primary">{p.count}</span>
                  <div>
                    <p className="text-sm">{p.role}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-ui mt-6 text-xs text-muted-foreground">
              Recommended first cohort: ~20–30 students, teams of 3–4.
            </p>
          </div>
          <div>
            <SectionHeader eyebrow="Day 14" title="Recognition and showcase." />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {AWARDS.map((a) => (
                <li key={a} className="font-ui text-sm text-muted-foreground">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Certificate of completion, website feature, letter of appreciation and reference
              letters — only when genuinely earned.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell border-t border-border pt-14">
          <SectionHeader
            eyebrow="Before enrollment"
            title="Free public demo session."
            lead="A 30–45 minute “Alien World Investigation” using a small planet dataset — experience the learning style before you register."
          />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild>
              <Link to="/join">Register interest</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={SITE.communityUrl} target="_blank" rel="noopener noreferrer">
                Join the community
              </a>
            </Button>
          </div>
          <div className="mt-12 border-t border-border pt-10">
            <h3 className="font-ui text-sm tracking-wide">Get cohort dates by email</h3>
            <p className="mt-2 mb-5 text-sm text-muted-foreground">
              One short email when applications open. No spam.
            </p>
            <NewsletterForm source="program" />
          </div>
        </div>
      </section>
    </>
  );
}
