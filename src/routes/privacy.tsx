import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Project Polaris" },
      {
        name: "description",
        content:
          "How Project Polaris collects, uses and protects the information you share through our forms and community.",
      },
      { property: "og:title", content: "Privacy Policy — Project Polaris" },
      {
        property: "og:description",
        content: "What we collect, why, and how you can have it removed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

const SECTIONS = [
  {
    heading: "What We Collect",
    body: [
      "When you apply to join, submit contact messages, or register for a workshop, we collect the details you enter into the form — typically your name, email address, school affiliation, and engineering interests.",
      "Open community resources and software tools are accessible without registration. For specialised cohort programs, we collect the necessary project and technical background to place you into the appropriate sprint team.",
    ],
  },
  {
    heading: "Why We Collect It",
    body: [
      "To review engineering project submissions, coordinate cohort sprint teams, communicate event details, and share peer-reviewed student research digests.",
      "We aggregate non-identifiable usage statistics (such as simulator session counts and project completions) solely to verify and improve curriculum effectiveness.",
    ],
  },
  {
    heading: "Data Privacy & Access Control",
    body: [
      "Submissions are strictly accessible only by the Project Polaris core engineering and outreach team.",
      "We do not sell, monetize, or share your personal information with third-party advertisers or external commercial brokers.",
    ],
  },
  {
    heading: "Students & Youth Under 18",
    body: [
      "Many of our contributors are middle, high school, and university students. We collect only the minimum required information to facilitate project cohorts, and parents or guardians may request record removal at any time.",
    ],
  },
  {
    heading: "Data Deletion & Rights",
    body: [
      "You have the right to inspect, update, or permanently delete your stored application records at any time. Simply submit a deletion request through our contact page.",
    ],
  },
];

function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal & Governance"
        title="Privacy Policy"
        lead="Transparent, disciplined, and privacy-first. Everything we do with the data you entrust to us."
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
              Questions about this policy?{" "}
              <Link to="/contact" className="text-primary font-semibold hover:underline">
                Contact the engineering team
              </Link>
              .
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
