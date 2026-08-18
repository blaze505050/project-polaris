import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Rocket, Calendar, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Project Polaris" },
      {
        name: "description",
        content:
          "Project Polaris courses are launching soon! On August 20th, we will unveil our very first course. Stay tuned for registration and cohort details.",
      },
      { property: "og:title", content: "Courses — Project Polaris" },
      {
        property: "og:description",
        content:
          "First Project Polaris course launching on August 20th! Join our WhatsApp community for instant launch updates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Courses,
});

const HOW = [
  { step: "Short cohorts", note: "Three to six weeks, so momentum never dies." },
  { step: "Built around a project", note: "Every course ends with something real you built." },
  { step: "Taught by practitioners", note: "Mentors, researchers and experts, not recorded lectures." },
  {
    step: "Priced transparently",
    note: "Course fees are listed up front; scholarships are available for students who need them.",
  },
];

function Courses() {
  return (
    <>
      <PageHeader
        eyebrow="Courses"
        title="Courses that end with something you built."
        lead="We are launching our very first hands-on course on August 20th! Detailed syllabus, schedule, and enrolment details will be updated right here."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <Bell className="size-4" />
              <span>Get Notified on WhatsApp</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10">
            <Link to="/programs">Explore Programs</Link>
          </Button>
        </div>
      </PageHeader>

      {/* LAUNCH BANNER SECTION */}
      <section className="section">
        <div className="shell">
          <div className="card-elevated relative overflow-hidden p-8 md:p-14 text-center border border-primary/40 bg-gradient-to-b from-primary/15 via-slate-900/60 to-slate-950/80">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-6 ring-8 ring-primary/10">
              <Rocket className="size-8" />
            </div>

            <span className="font-ui inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              <Calendar className="size-3.5" /> Launch Date: August 20th
            </span>

            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white max-w-3xl mx-auto">
              Our First Course Launches On <span className="text-gradient-star">August 20th</span>
            </h2>

            <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We're preparing a brand-new experiential learning experience designed specifically for students who want to build, experiment, and solve real-world problems.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none px-7">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                  Join Community for Early Access
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 px-7">
                <Link to="/contact">Contact Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW COURSES WORK */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <p className="eyebrow mb-5">How Polaris courses work</p>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-display font-bold text-white">Short, practical, and finished.</h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h, i) => (
              <li
                key={h.step}
                className="bg-[#04060e] p-7 hover:bg-slate-900/80 transition-colors"
                style={{ animation: `fade-in-up 500ms ease-out ${i * 70}ms both` }}
              >
                <span className="font-ui text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-display font-bold text-white">{h.step}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{h.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TEACH WITH US */}
      <section className="section border-t border-border">
        <div className="shell max-w-2xl text-center">
          <GraduationCap className="mx-auto size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-6 text-3xl md:text-4xl font-display font-bold text-white">Want to teach or mentor a course?</h2>
          <p className="mt-5 text-slate-300 leading-relaxed">
            If you work in space science, engineering, tech or research, you can design and lead a Polaris
            course with our support.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full shadow-md">
              <Link to="/get-involved">Become a Mentor</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10">
              <Link to="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

