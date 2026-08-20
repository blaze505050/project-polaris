import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Rocket, Calendar, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Project Polaris" },
      {
        name: "description",
        content:
          "Project Polaris courses are cohort-based experiential programs designed around building tangible engineering systems.",
      },
      { property: "og:title", content: "Courses — Project Polaris" },
      {
        property: "og:description",
        content:
          "Hands-on engineering courses. Join our WhatsApp community for cohort registrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Courses,
});

const HOW = [
  { step: "Short Cohorts", note: "3 to 6 weeks of intense, focused sprints so momentum and accountability stay high." },
  { step: "Project-Centric", note: "Every module produces a tangible simulator, CAD assembly, or verified dataset." },
  { step: "Industry Mentors", note: "Live feedback and code reviews from aerospace engineers and researchers." },
  {
    step: "Transparent & Accessible",
    note: "All course roadmaps are open, with scholarships available for students in need.",
  },
];

function Courses() {
  return (
    <>
      <PageHeader
        eyebrow="Courses & Cohorts"
        title="Courses that finish with a working system."
        lead="Experiential learning cohorts built for students who want to build, test, and publish real engineering artifacts."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <Bell className="size-3.5" />
              <span>Get Cohort Notifications</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4">
            <Link to="/programs">Explore All Programs</Link>
          </Button>
        </div>
      </PageHeader>

      {/* LAUNCH BANNER SECTION */}
      <section className="section">
        <div className="shell">
          <ScrollReveal direction="scale">
            <div className="card-premium relative overflow-hidden p-8 md:p-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-surface-2 border border-border text-primary mb-6">
                <Rocket className="size-6" />
              </div>

              <span className="font-mono inline-flex items-center gap-2 rounded px-3 py-1 text-xs font-medium text-primary bg-primary/10 border border-primary/20 mb-4">
                <Calendar className="size-3" /> Next Cohort Registration Opening Soon
              </span>

              <h2 className="text-2xl sm:text-4xl font-bold text-foreground max-w-2xl mx-auto">
                Experiential Aerospace & Computation Cohorts
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Hands-on project tracks covering aerodynamics simulation (CFD), Python numerical solvers, orbital dynamics, and space instrumentation.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="sm" className="h-9 px-5 bg-foreground text-background font-medium">
                  <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                    Join WhatsApp for Early Access
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-9 px-5">
                  <Link to="/contact">Contact Team</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* HOW COURSES WORK */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-2">Pedagogy</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Sprint-based, practical, and finished.</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h, i) => (
              <ScrollReveal key={h.step} direction="up" delay={i * 60}>
                <div className="card-premium p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-foreground">{h.step}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{h.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEACH WITH US */}
      <section className="section border-t border-border">
        <div className="shell max-w-2xl text-center">
          <ScrollReveal direction="up">
            <GraduationCap className="mx-auto size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">Want to mentor a student sprint?</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If you work in aerospace, scientific computing, robotics, or astrophysics, lead a Polaris sprint with our student community.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="sm" className="h-9 px-5 bg-foreground text-background">
                <Link to="/get-involved">Become a Mentor</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-9 px-5">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
