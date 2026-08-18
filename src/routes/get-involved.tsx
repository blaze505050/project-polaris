import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { SITE } from "@/lib/site";
import { ExternalLink, UserPlus, HeartHandshake, Users, ArrowRight } from "lucide-react";

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
    name: "Students",
    note: "Join the WhatsApp community, take part in live sessions and work on real projects. Open to all backgrounds.",
    action: "Join WhatsApp Community",
    link: SITE.communityUrl,
    external: true,
  },
  {
    name: "Associates",
    note: "Take on active operational, design, technical or leadership roles within the organisation.",
    action: "Fill Associate Form",
    link: SITE.associateFormUrl,
    external: true,
  },
  {
    name: "Volunteers",
    note: "Help with operations, design, research, writing, outreach or community management.",
    action: "Volunteer Program Portal",
    link: SITE.volunteerUrl,
    external: true,
  },
  {
    name: "Mentors & Speakers",
    note: "Guide a small group of learners through a project or run an interactive session in your domain.",
    action: "Propose a session",
    link: "/contact",
    external: false,
  },
  {
    name: "Schools & Colleges",
    note: "Bring Polaris hands-on workshops to your students as a complement to existing curriculum.",
    action: "Partner with us",
    link: "/schools",
    external: false,
  },
  {
    name: "Organisations",
    note: "Collaborate on projects, sponsor access for students, or co-host an event.",
    action: "Start a conversation",
    link: "/contact",
    external: false,
  },
];

function GetInvolved() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="There's more than one way in."
        lead="Whether you're a student, an associate, a volunteer or a mentor — there is a place for you to build and lead here."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
            <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <HeartHandshake className="size-4" />
              <span>Apply to Volunteer Program</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10">
            <a href={SITE.associateFormUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <UserPlus className="size-4" />
              <span>Associate Application Form</span>
            </a>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PATHS.map((path, i) => (
            <article
              key={path.name}
              className="card-elevated flex flex-col p-7 transition-all duration-300 hover:border-primary/50 justify-between"
              style={{ animation: `fade-in-up 500ms ease-out ${i * 70}ms both` }}
            >
              <div>
                <h2 className="text-xl font-display font-bold text-white">{path.name}</h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{path.note}</p>
              </div>
              
              {path.external ? (
                <a
                  href={path.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-ui mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <span>{path.action}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <Link
                  to={path.link}
                  className="font-ui mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <span>{path.action}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5">Talk to us</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Tell us what you'd like to do</h2>
            <p className="mt-5 text-slate-300 leading-relaxed">
              We read every message ourselves. Whether it's a partnership, a session proposal, or a
              question about getting involved — send it here.
            </p>
            <div className="mt-8 space-y-2 text-sm text-slate-400 font-mono">
              <p>Email: <a href={`mailto:${SITE.emails[0]}`} className="text-primary hover:underline">{SITE.emails[0]}</a></p>
              <p>Email: <a href={`mailto:${SITE.emails[1]}`} className="text-primary hover:underline">{SITE.emails[1]}</a></p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

