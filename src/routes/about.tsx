import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Timeline } from "@/components/site/Timeline";
import { NorthStar } from "@/components/site/NorthStar";
import { JOURNEY, VALUES, TEAM_MEMBERS, SITE } from "@/lib/site";
import polarisLogo from "@/assets/polaris-logo.png";
import { ExternalLink, Linkedin, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Project Polaris" },
      {
        name: "description",
        content:
          "Why Project Polaris exists, what we believe, and where a student-led experiential learning organisation is heading.",
      },
      { property: "og:title", content: "About — Project Polaris" },
      {
        property: "og:description",
        content: "Why we started, what we believe, and why we chose the name Polaris.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Education should create builders, not just learners."
        lead="Project Polaris is a student-led initiative making practical, hands-on education accessible to every learner."
      />

      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold">What is Project Polaris?</h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Project Polaris is an education organisation focused on helping students learn through
              building, researching, collaborating and solving real-world problems. We work with
              middle-school students, high-school students, college students, and anyone who simply
              wants to learn.
            </p>
            <p>
              Rather than focusing on theoretical knowledge alone, we create opportunities where
              students gain practical experience: working on projects, conducting research,
              participating in workshops, collaborating with professionals, and contributing to
              initiatives that create measurable impact.
            </p>
            <p className="text-foreground font-medium">
              We believe every student deserves access to quality learning opportunities regardless
              of their background or financial condition.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-3">Our Team</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Who is behind Project Polaris?</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Project Polaris is driven by a passionate network of student leaders, associates, volunteers, and guest speakers who believe in hands-on learning.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member, i) => (
              <article
                key={member.name}
                className="card-elevated p-7 flex flex-col justify-between"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 80}ms both` }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <img src={polarisLogo} alt="Polaris Logo" className="size-8 rounded-full" />
                    {"link" in member && member.link ? (
                      <a
                        href={member.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="size-4" />
                      </a>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-xl font-display font-bold text-foreground">{member.name}</h3>
                  <p className="font-ui text-xs text-primary font-semibold mt-1">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{member.note}</p>
                </div>

                {"link" in member && member.link ? (
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-ui mt-6 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                  >
                    <span>View LinkedIn Profile</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5">Why we started</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              "What do you want to become?" is the wrong first question.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Countless students spend years preparing for exams, yet rarely get the chance to build
              something meaningful, conduct real research, work with mentors, or collaborate on
              projects that create impact. Curiosity gives way to marks. Creativity gets limited by
              textbooks. Learning becomes something to memorise instead of experience.
            </p>
            <p>
              We believed education could be different — not by replacing schools, but by
              complementing them with the opportunities traditional systems struggle to provide.
            </p>
            <p className="border-l-2 border-primary pl-6 font-display text-xl text-foreground font-medium">
              What if students didn't have to wait until college or a job to start creating,
              researching, innovating and leading?
            </p>
            <p>That question became our starting point.</p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell grid gap-10 md:grid-cols-2">
          <article className="card-elevated p-8 md:p-10 border-primary/30">
            <p className="eyebrow mb-5">Our mission</p>
            <p className="font-display text-xl leading-relaxed md:text-2xl text-foreground font-bold">
              To make practical, high-quality education accessible and affordable by giving students
              real-world experiences, industry exposure and opportunities to build skills that truly
              matter.
            </p>
          </article>
          <article className="card-elevated p-8 md:p-10 border-accent/30">
            <p className="eyebrow mb-5 text-accent">Our vision</p>
            <p className="font-display text-xl leading-relaxed md:text-2xl text-foreground font-bold">
              A future where education isn't limited by textbooks, classrooms or examinations — and
              where every learner can experiment, innovate, collaborate and contribute, regardless of
              background.
            </p>
          </article>
        </div>
      </section>


      <section className="section border-t border-border">
        <div className="shell">
          <p className="eyebrow mb-5">Core values</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold">What we hold ourselves to</h2>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.name} className="bg-background p-6">
                <dt className="font-display text-lg font-semibold">{value.name}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{value.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="veil section relative overflow-hidden border-t border-border">
        <div className="shell relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <NorthStar className="size-8 text-primary" />
            <h2 className="mt-6 text-3xl md:text-4xl font-display font-bold">Why "Polaris"?</h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              For centuries, the North Star has guided explorers through uncertainty. It doesn't tell
              you where to go — it tells you where you are.
            </p>
            <p>
              In the same way, we want to guide students toward opportunities, purpose, practical
              learning, experimentation and meaningful action in a world that keeps changing shape.
            </p>
            <p className="text-foreground">
              Project Polaris isn't just another student community. It's built on the belief that
              learning becomes meaningful when it's applied, that leadership is earned by creating
              value, and that young people build extraordinary things when given the right
              environment.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5">Our journey</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Everything so far</h2>
            <p className="mt-5 text-sm text-muted-foreground">
              Short, honest and still very early.
            </p>
          </div>
          <Timeline items={JOURNEY} />
        </div>
      </section>

      <section className="section border-t border-border bg-surface/30">
        <div className="shell max-w-3xl">
          <p className="eyebrow mb-5">Where we're going</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">The long version of this project</h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "Launch structured online courses",
              "Expand workshops internationally",
              "Build research collaborations",
              "Develop innovation fellowships",
              "Partner with educational institutions",
              "Create mentorship programs",
              "Build a global student community",
              "Support student-led innovations",
              "Provide educational trips and camps",
            ].map((goal) => (
              <li
                key={goal}
                className="font-ui rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground"
              >
                {goal}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild>
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                Join Community
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer">
                Volunteer Program
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
