import { createFileRoute, Link } from "@tanstack/react-router";
import { School, Rocket, Users, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { SchoolOutreachForm } from "@/components/site/SchoolOutreachForm";

const TITLE = "School Outreach — Bring Polaris to Your School";
const DESCRIPTION =
  "Partner with Project Polaris to run space science workshops, space camps, expert talks and student clubs at your school. Request a collaboration in a minute.";

export const Route = createFileRoute("/schools")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "School Outreach Workshops",
          serviceType: "Educational workshops for schools",
          provider: { "@type": "Organization", name: "Project Polaris" },
          areaServed: "IN",
          audience: { "@type": "EducationalAudience", educationalRole: "student" },
          description: DESCRIPTION,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Schools,
});

const FORMATS = [
  {
    icon: Rocket,
    name: "Space science workshop",
    note: "A 60–120 minute hands-on session run by our team and an expert guest, built around a problem your students actually solve.",
  },
  {
    icon: CalendarDays,
    name: "Workshop series or space camp",
    note: "A multi-day programme across a term or holiday break, ending with a student build and a showcase.",
  },
  {
    icon: Users,
    name: "Polaris school club",
    note: "We help you set up a student-run club with a curriculum, activity calendar and mentor support from Polaris.",
  },
  {
    icon: School,
    name: "Assembly or expert talk",
    note: "A single large-format talk for the whole school with a researcher or industry practitioner.",
  },
];

const STEPS = [
  { step: "Request", note: "You send this form with your school, size and what you need." },
  { step: "Call", note: "A short conversation to shape the format and pick a date." },
  { step: "Plan", note: "We share the session plan, requirements and cost, if any." },
  { step: "Run", note: "We deliver it with your teachers, and share outcomes afterwards." },
];

const FAQS = [
  {
    q: "Is a school workshop free?",
    a: "Single community workshops and talks are usually free. Multi-day camps, series and paid courses have a transparent fee shared before we confirm anything.",
  },
  {
    q: "What do we need to host a session?",
    a: "A room, a projector and interested students. For build sessions we bring or specify the materials in advance.",
  },
  {
    q: "Which grades is this for?",
    a: "Middle school upwards. We adapt the depth of the session to the grade and the group size.",
  },
  {
    q: "Do you travel outside your city?",
    a: "We run online sessions anywhere, and in-person sessions where travel is workable. Tell us your city in the form.",
  },
];

function Schools() {
  return (
    <>
      <PageHeader
        eyebrow="School Outreach"
        title="Bring Polaris into your classroom."
        lead="We work with schools to run space science workshops, camps, expert talks and student clubs — designed so students build something, not just listen to something."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
            <a href="#request">Request a collaboration</a>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10">
            <Link to="/programs">See our programs</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Formats"
            title="Four ways we work with schools"
            lead="Pick the one closest to what you need — we shape the rest with you."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {FORMATS.map((f, i) => (
              <article
                key={f.name}
                className="card-elevated p-7 md:p-8"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 80}ms both` }}
              >
                <f.icon className="size-6 text-primary" aria-hidden="true" />
                <h2 className="mt-5 text-2xl font-display font-bold text-white">{f.name}</h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{f.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <p className="eyebrow mb-5">How it works</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold text-white">From request to running session.</h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.step} className="bg-[#04060e] p-7 hover:bg-slate-900/80 transition-colors">
                <span className="font-ui text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-display font-bold text-white">{s.step}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="request" className="section scroll-mt-24 border-t border-border">
        <div className="shell">
          <SectionHeader
            eyebrow="Request"
            title="Tell us about your school"
            lead="One form, a few details, and we take it from there."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <SchoolOutreachForm />
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell max-w-3xl">
          <p className="eyebrow mb-5">Questions</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Before you ask</h2>
          <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-lg font-display font-semibold text-white">{f.q}</dt>
                <dd className="mt-2 text-sm text-slate-300 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

