import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  CalendarRange,
  Compass,
  Hammer,
  Presentation,
  Sparkles,
  Users,
  Quote,
  MessageCircle,
  ExternalLink,
  Linkedin,
  Calendar,
  HeartHandshake,
  UserPlus,
  CheckCircle2,
  FolderKanban,
  Mail,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Starfield } from "@/components/site/Starfield";
import { Newsletter } from "@/components/site/Newsletter";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { Timeline } from "@/components/site/Timeline";
import { LoadingCards, ErrorState } from "@/components/site/StateBlocks";
import { useReveal, useCountUp } from "@/hooks/use-reveal";
import { opportunitiesQuery } from "@/lib/db";
import { JOURNEY, PATHWAY, SITE, STATS, TEAM_MEMBERS, TESTIMONIALS, WORKSHOPS } from "@/lib/site";
import heroImageWebp from "@/assets/students-building.webp";
import heroImage from "@/assets/students-building.jpg";
import nightImageWebp from "@/assets/night-observation.webp";
import nightImage from "@/assets/night-observation.jpg";
import polarisLogoWebp from "@/assets/polaris-logo.webp";
import polarisLogo from "@/assets/polaris-logo.png";

/** Stagger delay helper for hero entrance animations */
const stagger = (i: number) => ({ animationDelay: `${150 + i * 120}ms` });
const heroEntrance = "opacity-0 animate-[fade-in-up_600ms_ease-out_forwards]";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polaris — Learn by Building" },
      {
        name: "description",
        content:
          "A student-led experiential learning organisation. Research, build, experiment and collaborate on real problems — starting with space science.",
      },
      { property: "og:title", content: "Project Polaris — Learn by Building" },
      {
        property: "og:description",
        content:
          "Where curiosity becomes action. Workshops, innovation projects and mentorship for students who want to build.",
      },
    ],
  }),
  component: Home,
});

const WHAT_WE_DO = [
  {
    icon: Presentation,
    name: "Workshops",
    note: "Interactive sessions conducted by ISRO scientists, missile experts, educators & mentors.",
  },
  {
    icon: Sparkles,
    name: "Community Learning",
    note: "Daily educational content (Aaj Ka Gyan), polls, discussions and learning challenges.",
  },
  {
    icon: Hammer,
    name: "Innovation Projects",
    note: "Collaborative projects like CanSat prototypes and Sky Atlas built by student teams.",
  },
  {
    icon: Compass,
    name: "Mentorship",
    note: "Connecting learners with mentors who can guide them academically and professionally.",
  },
  {
    icon: CalendarRange,
    name: "Events & Competitions",
    note: "Webinars, speaker sessions, quizzes, star-hunting challenges and community meetups.",
  },
];

const GAPS = [
  "Years of preparing for exams, with few chances to build anything",
  "Curiosity that gives way to marks",
  "Creativity limited by the boundaries of a textbook",
  "Almost no access to researchers, engineers or mentors",
  "Learning that becomes memorisation instead of experience",
];

function Home() {
  const { data, isLoading, isError } = useQuery(opportunitiesQuery);
  const featured = (data ?? []).slice(0, 3);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHeroVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="veil relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-28">
        <Starfield density={0.9} />
        
        {/* Ambient Aurora Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-accent/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="blueprint absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {/* Live Badge — stagger 0 */}
            <div className={`${heroEntrance} inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary mb-8 backdrop-blur-md`} style={heroVisible ? stagger(0) : { opacity: 0 }}>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
              </span>
              <span className="font-ui font-semibold tracking-wide uppercase text-[0.7rem]">Student-Led Experiential Learning</span>
            </div>

            {/* Headline — stagger 1 */}
            <h1 className={`${heroEntrance} text-4xl sm:text-5xl lg:text-[4.25rem] font-display font-extrabold tracking-tight text-foreground leading-[1.15]`} style={heroVisible ? stagger(1) : { opacity: 0 }}>
              Learning through <span className="text-gradient-star">Building</span>,
              <span className="block text-lg sm:text-xl lg:text-2xl text-muted-foreground font-ui font-medium tracking-normal mt-4">
                rather than Building after learning.
              </span>
            </h1>

            {/* Description — stagger 2 */}
            <p className={`${heroEntrance} mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed`} style={heroVisible ? stagger(2) : { opacity: 0 }}>
              Project Polaris gives students the chance to research, build, experiment and
              collaborate on real problems — long before anyone tells them they're ready.
            </p>

            {/* Hero CTAs — stagger 3 */}
            <div className={`${heroEntrance} mt-9 flex flex-wrap gap-3.5`} style={heroVisible ? stagger(3) : { opacity: 0 }}>
              <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none">
                <Link to="/projects" className="flex items-center gap-2">
                  <FolderKanban className="size-4" />
                  <span>Explore Our Projects</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 font-semibold backdrop-blur-md">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-primary" />
                  <span>Join WhatsApp Community</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground font-semibold">
                <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <span>Volunteer Program</span>
                  <ExternalLink className="size-3.5 opacity-70" />
                </a>
              </Button>
            </div>

            {/* Footer note — stagger 4 */}
            <p className={`${heroEntrance} font-ui mt-8 text-xs tracking-wider text-muted-foreground uppercase font-medium`} style={heroVisible ? stagger(4) : { opacity: 0 }}>
              Currently centred on space science · Open to school, college & self-taught learners
            </p>
          </div>

          {/* Hero Visual Card — stagger 2 */}
          <div className={`${heroEntrance} relative group`} style={heroVisible ? stagger(2) : { opacity: 0 }}>
            <div className="overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:scale-[1.01]" style={{ animation: 'gentle-float 6s ease-in-out infinite' }}>
              <picture>
                <source srcSet={heroImageWebp} type="image/webp" />
                <img
                  src={heroImage}
                  alt="Students building and experimenting in a Project Polaris workshop"
                  width={800}
                  height={600}
                  fetchPriority="high"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              </picture>
            </div>
            
            <div className="font-ui absolute -bottom-5 left-6 rounded-full border border-border bg-background/90 px-5 py-2.5 text-xs text-slate-200 backdrop-blur-xl shadow-xl flex items-center gap-2.5">
              <picture>
                <source srcSet={polarisLogoWebp} type="image/webp" />
                <img src={polarisLogo} alt="Polaris" className="size-4 rounded-full" />
              </picture>
              <span>Ideas → Projects → People who build</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTION BAR */}
      <section className="border-y border-border bg-surface/60 backdrop-blur-md py-4">
        <div className="shell flex flex-wrap items-center justify-between gap-4 text-xs font-ui">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="size-4 text-primary" />
            <span>Fast registration · Free community access</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="text-slate-100 hover:text-primary font-medium transition-colors flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-primary" /> WhatsApp Community ↗
            </a>
            <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="text-slate-100 hover:text-primary font-medium transition-colors flex items-center gap-1.5">
              <HeartHandshake className="size-3.5 text-primary" /> Volunteer Portal ↗
            </a>
            <a href={SITE.associateFormUrl} target="_blank" rel="noreferrer" className="text-slate-100 hover:text-primary font-medium transition-colors flex items-center gap-1.5">
              <UserPlus className="size-3.5 text-primary" /> Associate Form ↗
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-surface/30">
        <div className="shell">
          <dl className="grid grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4">
            {STATS.map((s, i) => (
              <StatCell key={s.label} stat={s} index={i} />
            ))}
          </dl>
        </div>
      </section>


      {/* FIRST COURSE LAUNCH SPOTLIGHT */}
      <section className="section">
        <div className="shell">
          <div className="card-elevated relative overflow-hidden p-8 md:p-14 text-center border border-primary/30 bg-gradient-to-b from-primary/10 via-slate-900/60 to-slate-950/80">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-6 ring-8 ring-primary/10">
              <Rocket className="size-8" />
            </div>

            <span className="font-ui inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              <Calendar className="size-3.5" /> Launch Date: August 20th
            </span>

            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white max-w-3xl mx-auto">
              Our First Course Launches On <span className="text-gradient-star">August 20th</span>
            </h2>

            <p className="mt-5 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We are introducing our very first hands-on student course. Designed around practical building, real-world problems, and mentor guidance.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                  Join Community for Enrolment Updates
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/programs">View All Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSHOPS & EXPERT SESSIONS */}
      <section className="section border-t border-border bg-surface/30">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Hands-On Masterclasses"
              title="Workshops with real practitioners"
              lead="Direct interactions between young builders and leaders across ISRO, aerospace research, and astronomy initiatives."
            />
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/programs">Explore all programs</Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {WORKSHOPS.map((workshop, idx) => (
              <article
                key={workshop.id}
                className="card-elevated flex flex-col justify-between p-7 md:p-8 border border-border bg-card transition-all duration-300 hover:border-primary/40"
                style={{ animation: `fade-in-up 500ms ease-out ${idx * 100}ms both` }}
              >
                <div>
                  <div className="font-ui flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold text-primary tracking-wider uppercase">
                      {workshop.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                      <Calendar className="size-3.5 text-primary" />
                      <span>{workshop.date}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-foreground leading-snug">
                    {workshop.title}
                  </h3>

                  {/* Mentor Badge */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3">
                    <div>
                      <p className="font-display font-bold text-sm text-foreground">{workshop.mentor}</p>
                      <p className="font-ui text-xs text-primary font-medium">{workshop.mentorTitle}</p>
                      <p className="text-[11px] text-muted-foreground">{workshop.mentorOrg}</p>
                    </div>
                    {workshop.linkedin ? (
                      <a
                        href={workshop.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-primary transition-colors"
                        aria-label={`${workshop.mentor} LinkedIn Profile`}
                        title={`View ${workshop.mentor}'s LinkedIn`}
                      >
                        <Linkedin className="size-4" />
                      </a>
                    ) : null}
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {workshop.summary}
                  </p>

                  {/* Session Highlights */}
                  <div className="mt-5 space-y-2 border-t border-border pt-4">
                    <p className="font-ui text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Session Highlights:
                    </p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {workshop.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-ui">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    Completed & Archived
                  </span>
                  <a
                    href={SITE.communityUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Community Notes</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BEHIND PROJECT POLARIS - THE TEAM */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Behind Project Polaris"
            title="Built and led by students, for students"
            lead="Over 28 passionate individuals have contributed to shaping Project Polaris. Meet the people driving this movement."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <article key={member.name} className="card-elevated p-7 flex flex-col justify-between">
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
                    View LinkedIn Profile <ExternalLink className="size-3" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section border-t border-border">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="What We Do"
              title="Five core ways students engage with Polaris"
              lead="Each one is an active initiative you can participate in right now."
            />
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/programs">All programs</Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map(({ icon: Icon, name, note }) => (
              <article key={name} className="card-elevated group p-7">
                <Icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-display font-bold text-foreground">{name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{note}</p>
                <Link
                  to="/programs"
                  className="font-ui mt-6 inline-flex items-center gap-1.5 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 font-semibold"
                >
                  Explore <ArrowRight className="size-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Community Voice"
            title="What workshop participants say"
            lead="Real feedback from students and attendees across our expert sessions and workshops."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <article key={idx} className="card-elevated p-7 flex flex-col justify-between">
                <div>
                  <Quote className="size-6 text-primary/40 mb-4" />
                  <p className="text-sm text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-display font-bold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-primary font-ui mt-0.5">{t.event}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / THE GAP */}
      <section className="section border-t border-border">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-6">The Gap</p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-foreground leading-tight">
              Every student is asked what they want to become.
            </h2>
            <p className="mt-6 font-display text-2xl text-primary md:text-3xl">
              Almost none are asked what problem they want to solve.
            </p>
            <p className="mt-6 max-w-lg text-muted-foreground leading-relaxed">
              We don't think schools are the problem. We think there's a gap next to them — the
              part where you actually try something, get it wrong, and try again.
            </p>
          </div>
          <ul className="space-y-0 self-center">
            {GAPS.map((gap, i) => (
              <li
                key={gap}
                className="flex items-baseline gap-5 border-b border-border py-5 first:border-t"
              >
                <span className="font-ui text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SOLUTION / PATHWAY */}
      <section className="section relative overflow-hidden border-t border-border bg-surface/30">
        <div className="shell relative">
          <SectionHeader
            eyebrow="So We Built Polaris"
            title="What if learning started with building?"
            lead="Not another coaching institute. Not another student club. A place where curiosity becomes action, ideas become projects, and students become builders."
            align="center"
          />

          <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PATHWAY.map((item, i) => (
              <li key={item.step} className="group bg-background p-7 transition-colors hover:bg-surface">
                <span className="font-ui text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-display font-bold text-foreground">{item.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CURRENT FOCUS WITH PHOTO */}
      <section className="section border-t border-border">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl">
            <picture>
              <source srcSet={nightImageWebp} type="image/webp" />
              <img
                src={nightImage}
                alt="Students observing the night sky through a telescope"
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </picture>
          </div>
          <div>
            <p className="eyebrow mb-6">Current Focus</p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-foreground">Start with space. Think beyond it.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Right now almost everything we run is centred around space science — because that's
              what fascinates most of our community. It gives us a shared language and a genuinely
              hard set of problems to learn on.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              It is a starting point, not a boundary. The long-term work is experiential learning
              across disciplines.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {["Astronomy", "Rocketry", "Space science", "Engineering", "Research", "Technology"].map(
                (tag) => (
                  <li
                    key={tag}
                    className="font-ui rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-6">Where We Are</p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-foreground">We're early. We're building.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              We started on 7 June with a WhatsApp group and a few friends. Here's honestly
              everything that has happened since — no inflated numbers.
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-full">
              <Link to="/impact">Read the full story</Link>
            </Button>
          </div>
          <Timeline items={JOURNEY.slice(0, 5)} />
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="section border-t border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 blur-[160px] pointer-events-none rounded-full" />
        <div className="shell relative">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/60 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-6 ring-8 ring-primary/5">
                <Mail className="size-6" />
              </div>
              <p className="eyebrow mb-3">Stay in the Loop</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Get weekly updates from <span className="text-gradient-star">Polaris</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Workshops, project launches, community stories, and learning resources — delivered to your inbox every week.
              </p>
            </div>
            <Newsletter className="mt-8 max-w-xl mx-auto" />
          </div>
        </div>
      </section>

      {/* JOIN WHATSAPP COMMUNITY */}
      <section className="section border-t border-border bg-surface/20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />
        <div className="shell relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow mb-4 !text-emerald-400">Community</p>
              <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-foreground leading-tight">
                Join <span className="text-emerald-400">400+ builders</span> on WhatsApp
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
                Our WhatsApp community is where daily learning happens — "Aaj Ka Gyan" science posts, live workshop announcements, project discussions, and real conversations between students and mentors.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Daily educational content & science discussions",
                  "First access to workshop registrations",
                  "Project collaboration & team formation",
                  "Direct interaction with mentors & experts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/25 font-semibold">
                  <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    <span>Join WhatsApp Community</span>
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <HeartHandshake className="size-4" />
                    <span>Volunteer Program</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Community stats card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-primary/10 blur-xl opacity-30 rounded-3xl" />
              <div className="relative rounded-3xl border border-emerald-500/20 bg-card/60 backdrop-blur-2xl p-7 md:p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "400+", label: "Community Members", color: "text-emerald-400" },
                    { value: "3", label: "Expert Workshops", color: "text-primary" },
                    { value: "28+", label: "Team Contributors", color: "text-sky-400" },
                    { value: "7+", label: "Active Projects", color: "text-amber-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-2xl bg-surface/50 border border-border">
                      <span className={`font-display text-3xl font-extrabold ${stat.color}`}>{stat.value}</span>
                      <p className="font-ui text-xs text-muted-foreground mt-1.5 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground font-ui">
                    Started June 7th, 2026 · Growing every day
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="veil relative overflow-hidden border-t border-border">
        <Starfield density={0.8} />
        <div className="shell relative py-24 text-center md:py-32">
          <Users className="mx-auto size-7 text-primary" aria-hidden="true" />
          <h2 className="mx-auto mt-8 max-w-3xl text-3xl md:text-5xl font-display font-bold text-foreground">
            The future doesn't belong only to those who study it.
            <span className="block text-gradient-star mt-2">It belongs to those who build it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{SITE.tagline}</p>
          <div className="mt-10 flex flex-col justify-center items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none px-8">
              <Link to="/projects" className="flex items-center gap-2">
                <FolderKanban className="size-4" />
                <span>Explore Our Projects</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-8">
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <MessageCircle className="size-4" />
                <span>Join the Community</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/** Animated stat cell with count-up on scroll intersection */
function StatCell({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const numericPart = parseInt(stat.value.replace(/[^0-9]/g, ""), 10);
  const suffix = stat.value.replace(/[0-9]/g, "");
  const [ref, count] = useCountUp(isNaN(numericPart) ? 0 : numericPart, 1200);

  return (
    <div
      className="bg-background px-6 py-9 text-center"
      style={{ animation: `fade-in-up 500ms ease-out ${index * 100}ms both` }}
    >
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span ref={ref} className="font-display block text-4xl text-gradient-star font-extrabold md:text-5xl">
          {isNaN(numericPart) ? stat.value : `${count}${suffix}`}
        </span>
        <span className="font-ui mt-3 block text-sm font-semibold text-foreground">{stat.label}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{stat.note}</span>
      </dd>
    </div>
  );
}
