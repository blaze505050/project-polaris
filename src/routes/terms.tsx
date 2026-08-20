import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Project Polaris" },
      {
        name: "description",
        content:
          "The terms for participating in Project Polaris programs, using this website, and sharing work within our community.",
      },
      { property: "og:title", content: "Terms & Conditions — Project Polaris" },
      { property: "og:description", content: "How participation, content and conduct work at Project Polaris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

const SECTIONS = [
  {
    heading: "Institutional Scope",
    body: [
      "Project Polaris is a student-led experiential engineering and research organisation. We provide collaborative projects, simulation platforms, and peer cohorts. We are not an accredited university or granting body, and participation does not confer formal academic degrees.",
    ],
  },
  {
    heading: "Participation & Cohort Standards",
    body: [
      "Participation in open community challenges, masterclasses, and open-source simulators is open to all students. In specialised build cohorts, contributors are expected to actively collaborate and respect peer reviews.",
      "Credentials and verified project trajectories are awarded solely based on authentic technical contributions and project milestones.",
    ],
  },
  {
    heading: "Intellectual Property & Open Source",
    body: [
      "Students retain original copyright and ownership of the code, hardware designs, and research digests they build at Project Polaris. By submitting work to the public showcase, you grant Polaris the right to feature and credit your work.",
      "Contributors must ensure all submitted code, models, and data sets are original or properly cited under open-source licenses.",
    ],
  },
  {
    heading: "Community Conduct",
    body: [
      "We maintain a rigorous, welcoming, and high-empathy environment. Harassment, plagiarised work, commercial spam, and destructive behavior will result in removal from community channels and build teams.",
    ],
  },
];

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal & Governance"
        title="Terms of Service"
        lead="Standards of collaboration, code ownership, and conduct across Project Polaris."
      />

      <section className="section">
        <div className="shell max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Effective: August 2026
            </span>
            <div className="mt-8 space-y-8 divide-y divide-border">
              {SECTIONS.map((s, i) => (
                <article key={s.heading} className={i > 0 ? "pt-8" : ""}>
                  <h2 className="text-xl font-bold text-foreground">{s.heading}</h2>
                  <div className="mt-3 space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {s.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
              See also our{" "}
              <Link to="/privacy" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
