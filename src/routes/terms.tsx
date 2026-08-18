import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

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
    heading: "Who we are",
    body: [
      "Project Polaris is a student-led experiential learning initiative. We are not a school, a coaching institute, or an accredited academic body, and nothing we issue is a formal academic qualification.",
    ],
  },
  {
    heading: "Participation",
    body: [
      "Community programs and resources are free and open to the people described on each program page. Courses, bootcamps, mini courses and space camps are paid; fees are shown clearly before you enrol and we may offer scholarships where available.",
      "Places may be limited, and we may decline or end a participation where someone is inactive, misrepresents themselves, or breaks our community rules.",
      "Certificates, badges and recommendation letters are issued for genuine contribution only.",
    ],
  },
  {
    heading: "Your work",
    body: [
      "You keep ownership of what you create at Polaris. By taking part, you allow us to showcase your work — with credit — on our website, community and social channels.",
      "Do not submit work that is plagiarised or that you do not have the right to share.",
    ],
  },
  {
    heading: "Community conduct",
    body: [
      "Be respectful. Harassment, discrimination, spam, self-promotion without permission, and sharing of misinformation are not allowed and can lead to removal from the community.",
    ],
  },
  {
    heading: "This website",
    body: [
      "Content here is provided for information. We try to keep dates, sessions and opportunities accurate, but details can change and some sections describe programs that are still being finalised.",
      "Links to external sites are provided for convenience; we are not responsible for their content.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "Participation is voluntary and at your own risk. Project Polaris is not liable for indirect losses arising from use of this site or from taking part in a program.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "These terms may be updated as the organisation grows. The current version always lives on this page.",
    ],
  },
];

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        lead="What you can expect from Project Polaris, and what we expect from participants."
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
            See also our{" "}
            <Link to="/privacy" className="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
