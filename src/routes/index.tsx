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
  Rocket,
  Calendar,
  HeartHandshake,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Starfield } from "@/components/site/Starfield";
import { Newsletter } from "@/components/site/Newsletter";
import { InteractiveAeroForgeDemo } from "@/components/site/InteractiveAeroForgeDemo";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { Timeline } from "@/components/site/Timeline";
import { LoadingCards, ErrorState } from "@/components/site/StateBlocks";
import { useReveal, useCountUp } from "@/hooks/use-reveal";
import { opportunitiesQuery } from "@/lib/db";
import { JOURNEY, PATHWAY, SITE, STATS, TEAM_MEMBERS, TESTIMONIALS } from "@/lib/site";
import heroImage from "@/assets/students-building.jpg";
import nightImage from "@/assets/night-observation.jpg";
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
            <h1 className={`${heroEntrance} text-4xl sm:text-5xl lg:text-[4.25rem] font-display font-extrabold tracking-tight text-white leading-[1.15]`} style={heroVisible ? stagger(1) : { opacity: 0 }}>
              Learning through <span className="text-gradient-star">Building</span>,
              <span className="block text-lg sm:text-xl lg:text-2xl text-slate-300 font-ui font-medium tracking-normal mt-4">
                rather than Building after learning.
              </span>
            </h1>

            {/* Description — stagger 2 */}
            <p className={`${heroEntrance} mt-7 max-w-xl text-lg text-slate-300 leading-relaxed`} style={heroVisible ? stagger(2) : { opacity: 0 }}>
              Project Polaris gives students the chance to research, build, experiment and
              collaborate on real problems — long before anyone tells them they're ready.
            </p>

            {/* Hero CTAs — stagger 3 */}
            <div className={`${heroEntrance} mt-9 flex flex-wrap gap-3.5`} style={heroVisible ? stagger(3) : { opacity: 0 }}>
              <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none">
                <Link to="/aeroforge" className="flex items-center gap-2">
                  <Rocket className="size-4" />
                  <span>Launch AeroForge Lab</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 font-semibold backdrop-blur-md">
                <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-primary" />
                  <span>Join WhatsApp Community</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full text-slate-300 hover:text-white font-semibold">
                <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <span>Volunteer Program</span>
                  <ExternalLink className="size-3.5 opacity-70" />
                </a>
              </Button>
            </div>

            {/* Footer note — stagger 4 */}
            <p className={`${heroEntrance} font-ui mt-8 text-xs tracking-wider text-slate-400 uppercase font-medium`} style={heroVisible ? stagger(4) : { opacity: 0 }}>
              Currently centred on space science · Open to school, college & self-taught learners
            </p>
          </div>

          {/* Hero Visual Card — stagger 2 */}
          <div className={`${heroEntrance} relative group`} style={heroVisible ? stagger(2) : { opacity: 0 }}>
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:scale-[1.01]" style={{ animation: 'gentle-float 6s ease-in-out infinite' }}>
              <img
                src={heroImage}
                alt="Students building and experimenting in a Project Polaris workshop"
                width={1600}
                height={1104}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </div>
            
            <div className="font-ui absolute -bottom-5 left-6 rounded-full border border-white/15 bg-[#04060e]/90 px-5 py-2.5 text-xs text-slate-200 backdrop-blur-xl shadow-xl flex items-center gap-2.5">
              <img src={polarisLogo} alt="Polaris" className="size-4 rounded-full" />
              <span>Ideas → Projects → People who build</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTION BAR */}
      <section className="border-y border-white/10 bg-slate-950/60 backdrop-blur-md py-4">
        <div className="shell flex flex-wrap items-center justify-between gap-4 text-xs font-ui">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="size-4 text-primary" />
            <span>Fast registration · Free community access</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-primary" /> WhatsApp Community ↗
            </a>
            <a href={SITE.volunteerUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5">
              <HeartHandshake className="size-3.5 text-primary" /> Volunteer Portal ↗
            </a>
            <a href={SITE.associateFormUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5">
              <UserPlus className="size-3.5 text-primary" /> Associate Form ↗
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/10 bg-surface/30">
        <div className="shell">
          <dl className="grid grid-cols-2 gap-px overflow-hidden bg-white/10 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <StatCell key={s.label} stat={s} index={i} />
            ))}
          </dl>
        </div>
      </section>

      {/* AEROFORGE SHOWCASE */}
      <section className="section border-b border-white/10 bg-[#060B18]/60 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="shell grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow mb-4 block">Flagship Platform</span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
              AeroForge AI <span className="text-gradient-star">Space Engineering Lab</span>
            </h2>
            <p className="mt-6 text-slate-300 text-lg leading-relaxed">
              We believe in learning by doing. AeroForge is our custom, student-built aerospace and mechanical research laboratory running right in your browser.
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Equipped with over 40 numerical solvers, aerospace atmospheric models, structural calculators, orbital trajectory integrators, and aerodynamics tools.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Aerodynamics & CFD</h4>
                  <p className="text-xs text-slate-400 mt-1">Airfoil analysers, compressible flows, boundary layer estimation, and Mach sweeps.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Orbital Mechanics</h4>
                  <p className="text-xs text-slate-400 mt-1">Keplerian orbit prediction, 2-body numerical integrators, and satellite ground tracks.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Structural Lab</h4>
                  <p className="text-xs text-slate-400 mt-1">Beam bending mechanics, Mohr's circle, thin-walled pressure vessel stress analysis.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">ISA Atmosphere Solver</h4>
                  <p className="text-xs text-slate-400 mt-1">Accurate international standard atmosphere solver up to the mesosphere.</p>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none">
                <Link to="/aeroforge" className="flex items-center gap-2">
                  <Rocket className="size-4" />
                  <span>Launch AeroForge Lab</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative group justify-self-center lg:justify-self-end w-full max-w-[450px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-30 rounded-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080d1e] p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">aeroforge-simulation-node</span>
              </div>
              <div className="space-y-4 font-mono text-xs text-slate-300">
                <div className="text-primary">// Initiating computational flow solver</div>
                <div className="text-slate-400">&gt; aeroforge-solver --airfoil naca4412 --mach 0.8 --alpha 4.0</div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-white/5 text-[11px] leading-relaxed">
                  <span className="text-accent"> Reynolds Number:</span> 3.1e6 <br />
                  <span className="text-accent"> Lift Coefficient (Cl):</span> 0.824 <br />
                  <span className="text-accent"> Drag Coefficient (Cd):</span> 0.0125 <br />
                  <span className="text-accent"> L/D Ratio:</span> 65.92 <br />
                  <span className="text-green-400"> ✓ Convergence reached in 143 iterations</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span>RAM: 124MB</span>
                  <span>CPU: 4.2%</span>
                  <span>Latency: 12ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Interactive Hands-on Demonstration Sandbox */}
          <div className="lg:col-span-2 pt-6">
            <InteractiveAeroForgeDemo />
          </div>
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

      {/* BEHIND PROJECT POLARIS - THE TEAM */}
      <section className="section border-t border-white/10 bg-surface/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Behind Project Polaris"
            title="Built and led by students, for students"
            lead="Over 28 passionate individuals have contributed to shaping Project Polaris. Meet the people driving this movement."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <article key={member.name} className="card-elevated p-7 flex flex-col justify-between bg-slate-900/60">
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
                  <h3 className="mt-5 text-xl font-display font-bold text-white">{member.name}</h3>
                  <p className="font-ui text-xs text-primary font-semibold mt-1">{member.role}</p>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">{member.note}</p>
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
      <section className="section border-t border-white/10">
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
                <h3 className="mt-5 text-xl font-display font-bold text-white">{name}</h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{note}</p>
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
      <section className="section border-t border-white/10 bg-surface/20">
        <div className="shell">
          <SectionHeader
            eyebrow="Community Voice"
            title="What workshop participants say"
            lead="Real feedback from students and attendees across our expert sessions and workshops."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <article key={idx} className="card-elevated p-7 flex flex-col justify-between bg-slate-900/60">
                <div>
                  <Quote className="size-6 text-primary/40 mb-4" />
                  <p className="text-sm text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-display font-bold text-sm text-white">{t.author}</p>
                  <p className="text-xs text-primary font-ui mt-0.5">{t.event}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / THE GAP */}
      <section className="section border-t border-white/10">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-6">The Gap</p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-white leading-tight">
              Every student is asked what they want to become.
            </h2>
            <p className="mt-6 font-display text-2xl text-primary md:text-3xl">
              Almost none are asked what problem they want to solve.
            </p>
            <p className="mt-6 max-w-lg text-slate-300 leading-relaxed">
              We don't think schools are the problem. We think there's a gap next to them — the
              part where you actually try something, get it wrong, and try again.
            </p>
          </div>
          <ul className="space-y-0 self-center">
            {GAPS.map((gap, i) => (
              <li
                key={gap}
                className="flex items-baseline gap-5 border-b border-white/10 py-5 first:border-t"
              >
                <span className="font-ui text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-300">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SOLUTION / PATHWAY */}
      <section className="section relative overflow-hidden border-t border-white/10 bg-surface/30">
        <div className="shell relative">
          <SectionHeader
            eyebrow="So We Built Polaris"
            title="What if learning started with building?"
            lead="Not another coaching institute. Not another student club. A place where curiosity becomes action, ideas become projects, and students become builders."
            align="center"
          />

          <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {PATHWAY.map((item, i) => (
              <li key={item.step} className="group bg-[#04060e] p-7 transition-colors hover:bg-slate-900/80">
                <span className="font-ui text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-display font-bold text-white">{item.step}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{item.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CURRENT FOCUS WITH PHOTO */}
      <section className="section border-t border-white/10">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
            <img
              src={nightImage}
              alt="Students observing the night sky through a telescope"
              width={1408}
              height={1008}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-6">Current Focus</p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-white">Start with space. Think beyond it.</h2>
            <p className="mt-6 text-slate-300 leading-relaxed">
              Right now almost everything we run is centred around space science — because that's
              what fascinates most of our community. It gives us a shared language and a genuinely
              hard set of problems to learn on.
            </p>
            <p className="mt-4 text-slate-300 leading-relaxed">
              It is a starting point, not a boundary. The long-term work is experiential learning
              across disciplines.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {["Astronomy", "Rocketry", "Space science", "Engineering", "Research", "Technology"].map(
                (tag) => (
                  <li
                    key={tag}
                    className="font-ui rounded-full border border-white/10 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-300"
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
      <section className="section border-t border-white/10 bg-surface/20">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-6">Where We Are</p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-bold text-white">We're early. We're building.</h2>
            <p className="mt-6 text-slate-300 leading-relaxed">
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

      {/* FINAL CTA */}
      <section className="veil relative overflow-hidden border-t border-white/10">
        <Starfield density={0.8} />
        <div className="shell relative py-24 text-center md:py-32">
          <Users className="mx-auto size-7 text-primary" aria-hidden="true" />
          <h2 className="mx-auto mt-8 max-w-3xl text-3xl md:text-5xl font-display font-bold text-white">
            The future doesn't belong only to those who study it.
            <span className="block text-gradient-star mt-2">It belongs to those who build it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-slate-300">{SITE.tagline}</p>
          <div className="mt-10 flex flex-col justify-center items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-none px-8">
              <Link to="/aeroforge" className="flex items-center gap-2">
                <Rocket className="size-4" />
                <span>Launch AeroForge Lab</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-8">
              <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
                Join WhatsApp Community
              </a>
            </Button>
          </div>

          <Newsletter className="mt-16 max-w-4xl mx-auto text-left" />
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
      className="bg-[#04060e] px-6 py-9 text-center"
      style={{ animation: `fade-in-up 500ms ease-out ${index * 100}ms both` }}
    >
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span ref={ref} className="font-display block text-4xl text-gradient-star font-extrabold md:text-5xl">
          {isNaN(numericPart) ? stat.value : `${count}${suffix}`}
        </span>
        <span className="font-ui mt-3 block text-sm font-semibold text-slate-200">{stat.label}</span>
        <span className="mt-1 block text-xs text-slate-400">{stat.note}</span>
      </dd>
    </div>
  );
}
