import { createFileRoute, Link } from "@tanstack/react-router";
import { School, Rocket, Users, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SchoolOutreachForm } from "@/components/site/SchoolOutreachForm";

const TITLE = "School Outreach — Bring Polaris to Your School";
const DESCRIPTION =
  "Partner with Project Polaris to run space science workshops, space camps, expert talks and student clubs at your school. Request a collaboration in a minute.";

const FORMATS = [
  {
    icon: Rocket,
    name: "Hands-on Engineering Workshop",
    note: "A 60–120 minute practical workshop run by our team and expert guests, built around aerodynamics, rocketry, or space telemetry.",
  },
  {
    icon: CalendarDays,
    name: "Multi-Day Space Camp",
    note: "A multi-day sprint across term breaks, ending with functional hardware prototypes, aerodynamic simulations, and a live presentation.",
  },
  {
    icon: Users,
    name: "Polaris Student Club Setup",
    note: "We assist in launching and mentoring a student-led space club with open activity calendars, software access, and mentor check-ins.",
  },
  {
    icon: School,
    name: "Keynote / Expert Masterclass",
    note: "Direct technical interactive lecture for middle and high schools with aerospace researchers and industry engineers.",
  },
];

const STEPS = [
  { step: "Request", note: "Submit your school details, target student group size, and preferred topics." },
  { step: "Curriculum Alignment", note: "A short sync with our educators to align with your school's academic timetable." },
  { step: "Logistics & Materials", note: "We share laboratory kits, software requirements, and session blueprints." },
  { step: "Delivery & Verification", note: "We facilitate the workshop with student mentors and provide verified certificates." },
];

const FAQS = [
  {
    q: "Is a school workshop free?",
    a: "Single community workshops and introductory talks are supported through our open outreach initiative. Multi-day experiential camps have transparent subsidised kit costs.",
  },
  {
    q: "What infrastructure does the school need?",
    a: "A standard AV-enabled classroom or lab. For computational simulation workshops, standard student laptops or computer labs are sufficient.",
  },
  {
    q: "Which grades are eligible?",
    a: "Grades 6 through 12. We customize curriculum depth from observational astronomy to advanced numerical physics.",
  },
  {
    q: "Do you facilitate sessions outside tier-1 cities?",
    a: "Yes. We deliver live virtual interactive workshops across all regions and in-person sessions with partner schools.",
  },
];

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

function Schools() {
  return (
    <>
      <PageHeader
        eyebrow="School Outreach"
        title="Bring experiential aerospace into your school."
        lead="We partner with educators to run practical space science workshops, simulation labs, and student clubs."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <a href="#request">Request a Workshop</a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <Link to="/programs">View All Programs</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <ScrollReveal direction="up">
            <SectionHeader
              eyebrow="Formats"
              title="Four ways we collaborate with schools"
              lead="Select the model that best fits your students' current curriculum."
            />
          </ScrollReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FORMATS.map((f, i) => (
              <ScrollReveal key={f.name} direction="up" delay={i * 60}>
                <article className="card-premium p-6 md:p-7 h-full flex flex-col justify-between">
                  <div>
                    <f.icon className="size-5 text-primary mb-3" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.note}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Process</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">From initial request to classroom delivery</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.step} direction="up" delay={i * 60}>
                <div className="card-premium p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-2 text-base font-bold text-foreground">{s.step}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="section scroll-mt-20 border-t border-border">
        <div className="shell max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-8">
              <p className="eyebrow mb-2">Inquiry Form</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Request a School Collaboration</h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Submit your school's details and our academic outreach team will contact you within 24 hours.
              </p>
            </div>
            <SchoolOutreachForm />
          </ScrollReveal>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/20">
        <div className="shell max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Frequently Asked Questions</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">School FAQ</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {FAQS.map((f) => (
                <div key={f.q} className="py-5">
                  <h3 className="text-sm font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
