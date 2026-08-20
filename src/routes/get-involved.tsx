import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/site";
import { ExternalLink, UserPlus, HeartHandshake, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Project Polaris" },
      {
        name: "description",
        content:
          "Join as a student, associate, mentor, speaker, volunteer, school or partner organisation — and help build practical learning for everyone.",
      },
      { property: "og:title", content: "Get Involved — Project Polaris" },
      { property: "og:description", content: "Ways to contribute: students, associates, mentors, volunteers, schools and partners." },
    ],
  }),
  component: GetInvolved,
});

const PATHS = [
  {
    name: "Join Core Team & Lead",
    note: "Take ownership of engineering departments, lead software architectures, manage sprints, and shape the direction of Project Polaris.",
    action: "Apply as Team Lead / Associate",
    link: SITE.associateFormUrl,
    external: true,
  },
  {
    name: "Become a Research Volunteer",
    note: "Assist in running data analyses, writing technical digests, managing community build challenges, and supporting astronomy outreach.",
    action: "Volunteer Program Portal",
    link: SITE.volunteerUrl,
    external: true,
  },
  {
    name: "Deliver a Masterclass or Mentor",
    note: "Inspire student builders by delivering technical workshops, CFD masterclasses, or sprint code reviews in your domain of expertise.",
    action: "Propose a Masterclass",
    link: "/contact",
    external: false,
  },
  {
    name: "Join as a Student Learner",
    note: "Join the open community, access daily space science telemetry drops (Aaj Ka Gyan), weekly challenges, and collaborative build cohorts.",
    action: "Join WhatsApp Community",
    link: SITE.communityUrl,
    external: true,
  },
  {
    name: "Schools & Educational Institutions",
    note: "Partner with us to host hands-on aerospace workshops, telescope observation nights, and computational science labs for your students.",
    action: "Request School Collaboration",
    link: "/schools",
    external: false,
  },
  {
    name: "Scientific Advisory",
    note: "Provide research guidance, peer-review support, and institutional backing to empower student researchers and builders.",
    action: "Connect with Founders",
    link: "/contact",
    external: false,
  },
];

function GetInvolved() {
  return (
    <>
      <PageHeader
        eyebrow="Get Involved"
        title="More than one way to build with us."
        lead="Whether you're a student engineer, an associate, a volunteer or an industry mentor — there is an active track for you."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <HeartHandshake className="size-3.5" />
              <span>Apply to Volunteer</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <a href={SITE.associateFormUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <UserPlus className="size-3.5" />
              <span>Associate Application</span>
            </a>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PATHS.map((path, i) => (
              <ScrollReveal key={path.name} direction="up" delay={i * 60}>
                <article className="card-premium flex flex-col p-6 h-full justify-between">
                  <div>
                    <span className="font-mono text-xs text-primary font-bold">0{i + 1}</span>
                    <h3 className="mt-2 text-lg font-bold text-foreground">{path.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{path.note}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    {path.external ? (
                      <a
                        href={path.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>{path.action}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <Link
                        to={path.link}
                        className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>{path.action}</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface/20">
        <div className="shell max-w-2xl mx-auto text-center">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Direct Contact</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Have a specific idea or proposal?</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If your proposal doesn't fit a standard category, get in touch directly. We review every message.
            </p>
            <Button asChild size="sm" className="mt-6 h-9 px-5 bg-foreground text-background font-medium">
              <Link to="/contact">Send a Message</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
