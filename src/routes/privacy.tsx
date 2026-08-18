import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

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
      { property: "og:description", content: "What we collect, why, and how you can have it removed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

const SECTIONS = [
  {
    heading: "What we collect",
    body: [
      "When you apply to join, contact us, or register for a session, we collect the details you type into that form — typically your name, email address, and whatever context you choose to share about yourself.",
      "Community programs and resources are free to access. For paid courses, bootcamps and space camps, we collect the information needed to process your enrolment and payment, including whatever payment details the secure payment provider asks for.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To respond to you, review applications, place people into programs, and share updates about sessions and opportunities you asked about.",
      "We may look at aggregate numbers — how many people applied, attended, or completed something — to understand whether our programs are working.",
    ],
  },
  {
    heading: "Who can see it",
    body: [
      "Only the Project Polaris core team and the coordinators of the program you applied to.",
      "We do not sell your information, and we do not share it with advertisers.",
    ],
  },
  {
    heading: "Where it is stored",
    body: [
      "Submissions are stored in our managed cloud database with access restricted to authorised team members.",
    ],
  },
  {
    heading: "Students under 18",
    body: [
      "Many of our participants are school students. We only ask for the minimum information needed to run a program, and a parent or guardian can contact us at any time to review or remove a young person's details.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us to correct or delete your information, or to stop contacting you, at any time. Write to us through the contact page and we will act on it.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "If this policy changes, the updated version will be posted on this page. Project Polaris is a young, student-led organisation and our practices will keep improving.",
    ],
  },
];

function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lead="Plain language, no dark patterns. This is everything we do with the information you give us."
      />

      <section className="section">
        <div className="shell max-w-3xl">
          <p className="font-ui text-xs tracking-wide text-muted-foreground uppercase">
            Last updated: August 2026
          </p>
          <div className="mt-12 space-y-12">
            {SECTIONS.map((s) => (
              <article key={s.heading}>
                <h2 className="text-2xl">{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-4 text-muted-foreground">
                    {p}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <p className="mt-14 text-sm text-muted-foreground">
            Questions about this policy?{" "}
            <Link to="/contact" className="text-primary underline-offset-4 hover:underline">
              Contact the team
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
