import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { NorthStar } from "@/components/site/NorthStar";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProjectSubmissionForm } from "@/components/site/ProjectSubmissionForm";
import {
  JOURNEY,
  VALUES,
  TEAM_MEMBERS,
  DEPARTMENTS,
  RECOGNITION_SYSTEM,
  WORKING_CULTURE,
  SITE,
  BRAND_POSITIONING,
} from "@/lib/site";
import {
  SHOWCASE_CATEGORIES,
  SHOWCASE_CATEGORY_LABELS,
  showcaseQuery,
  type ShowcaseProject,
} from "@/lib/showcase";
import polarisLogo from "@/assets/polaris-logo.png";
import {
  ExternalLink,
  Users,
  Hammer,
  Lightbulb,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  HeartHandshake,
  FolderKanban,
  Plus,
  Rocket,
  Compass,
  BookOpen,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Student Showcase — Project Polaris" },
      {
        name: "description",
        content:
          "Discover why Project Polaris was founded, explore student-built space and physics projects, and submit your own work to be featured.",
      },
      { property: "og:title", content: "About & Student Showcase — Project Polaris" },
      {
        property: "og:description",
        content:
          "Learn by building rather than building after learning. The story, leadership, values, and student project showcase of Project Polaris.",
      },
    ],
  }),
  component: AboutAndShowcase,
});

const DILEMMA_QUESTIONS = [
  { text: "Build authentic physics & software systems?", icon: Hammer },
  { text: "Present research in front of peers and engineers?", icon: Sparkles },
  { text: "Meet ISRO scientists and propulsion innovators?", icon: Users },
  { text: "Conduct verified, peer-reviewed experiments?", icon: Lightbulb },
  { text: "Turn textbook theory into public platforms?", icon: Flame },
];

const FLAGSHIP_SHOWCASE: ShowcaseProject[] = [
  {
    id: "aeroforge-ai",
    title: "AeroForge AI Simulation Workstation",
    category: "software",
    summary:
      "Browser-based engineering research workstation with 40+ physics solvers across CFD aerodynamics, structural FEA, and orbital mechanics.",
    description: null,
    team: "Core Engineering Team",
    link: "/projects",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "sky-atlas",
    title: "Sky Atlas Deep-Sky Network",
    category: "software",
    summary:
      "An open, student-maintained deep-sky catalog and constellation mapping database with observations recorded across community stargazing nights.",
    description: null,
    team: "Astrophysics Squad",
    link: "/projects",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "polaris-research-digest",
    title: "Polaris Daily Science Digest",
    category: "research",
    summary:
      "A recurring student-written and peer-reviewed technical digest that summarises and verifies recent space science research papers.",
    description: null,
    team: "Research Department",
    link: "/programs",
    stage: "in_progress",
    created_at: "",
  },
  {
    id: "schools-outreach-kit",
    title: "Schools Experiential Science Kit",
    category: "outreach",
    summary:
      "A ready-to-run interactive laboratory curriculum and telescope workshop kit for middle and high schools.",
    description: null,
    team: "Outreach Team",
    link: "/schools",
    stage: "in_progress",
    created_at: "",
  },
];

function AboutAndShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: dbProjects = [] } = useQuery(showcaseQuery);

  const projects = useMemo(() => {
    const list = dbProjects.length > 0 ? dbProjects : FLAGSHIP_SHOWCASE;
    if (selectedCategory === "all") return list;
    return list.filter((p) => p.category === selectedCategory);
  }, [dbProjects, selectedCategory]);

  return (
    <>
      <PageHeader
        eyebrow="Project Polaris"
        title="Learn by building rather than building after learning."
        lead="We are a student-led experiential learning ecosystem bridging traditional education and real-world skills through workshops, research programs, mentorship, and hands-on experiences."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-foreground text-background font-medium font-mono text-xs shadow-md">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join WhatsApp Community
            </a>
          </Button>
          <Button
            onClick={() => setShowSubmitModal(true)}
            variant="outline"
            size="sm"
            className="h-9 px-4 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            <Plus className="size-3.5 mr-1 text-gold" />
            Submit Your Project
          </Button>
        </div>
      </PageHeader>

      {/* ── CORE PHILOSOPHY & PROVOCATION ── */}
      <section className="section">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-2">
                  The Provocation
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground leading-tight">
                  What if education wasn't just about memorising textbooks?
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                  Millions of students solve theoretical problems for grades every semester, yet rarely configure a CFD mesh, calculate orbital transfer burns, or defend technical research in front of practicing aerospace engineers.
                </p>
                <p className="mt-3 text-xs sm:text-sm text-[#e8d7ff] font-semibold font-body">
                  Project Polaris is built to bridge that gap through student-led build cohorts.
                </p>
              </div>

              {/* Dilemma Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {DILEMMA_QUESTIONS.map(({ text, icon: Icon }, i) => (
                  <ScrollReveal key={text} direction="up" delay={i * 50}>
                    <div className="card-premium p-4 flex items-center gap-3 h-full hover:border-primary/40 transition-colors">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-primary shrink-0 border border-border">
                        <Icon className="size-4 text-gold" />
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-snug">{text}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal direction="up" delay={0}>
              <article className="card-premium p-6 md:p-8 h-full border-primary/25 bg-surface-2/40">
                <p className="eyebrow mb-2 text-primary font-mono text-xs uppercase tracking-wider">Our Mission</p>
                <h3 className="text-lg sm:text-xl font-bold font-display text-foreground leading-snug">
                  {SITE.mission}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-body">
                  Through workshops, innovation challenges, research programs, mentorship, and industry collaborations, we empower students to explore, build, and solve meaningful problems.
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <article className="card-premium p-6 md:p-8 h-full border-gold/25 bg-surface-2/40">
                <p className="eyebrow mb-2 text-gold font-mono text-xs uppercase tracking-wider">Our Vision</p>
                <h3 className="text-lg sm:text-xl font-bold font-display text-foreground leading-snug">
                  {SITE.vision}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-body">
                  To create a generation of curious thinkers, innovators, and future leaders who learn beyond textbooks through authentic building and scientific inquiry.
                </p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── MERGED STUDENT PROJECT SHOWCASE ── */}
      <section className="section border-t border-border bg-gradient-to-b from-surface-2/30 via-background to-surface/20" id="showcase">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Student Project Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  What Polaris Students Are Building
                </h2>
                <p className="mt-1 text-xs text-muted-foreground font-body">
                  Explore peer-reviewed software tools, observation catalogs, and research digests built by student makers.
                </p>
              </div>

              <Button
                onClick={() => setShowSubmitModal(true)}
                size="sm"
                className="h-9 px-4 bg-gradient-to-r from-primary to-gold text-background font-bold font-mono text-xs shadow-md transition-transform active:scale-95"
              >
                <Plus className="size-3.5 mr-1" />
                Submit Your Project
              </Button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedCategory === "all"
                    ? "bg-foreground text-background font-bold"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                All Projects ({FLAGSHIP_SHOWCASE.length})
              </button>
              {SHOWCASE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? "bg-foreground text-background font-bold"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {SHOWCASE_CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Project Showcase Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <ScrollReveal key={p.id} direction="up" delay={i * 60}>
                <article className="card-premium p-6 md:p-8 flex flex-col justify-between h-full hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="px-2.5 py-0.5 rounded bg-surface-2 text-primary font-semibold border border-border capitalize">
                        {p.category}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{p.team}</span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-foreground">{p.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                      {p.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-medium">● Verified Artifact</span>
                    {p.link ? (
                      <Link to={p.link} className="text-primary hover:underline flex items-center gap-1 font-semibold">
                        <span>Launch Project</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">In Review</span>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT SUBMISSION MODAL ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-mono"
            >
              ✕ Close
            </button>
            <h3 className="text-xl font-bold font-display text-foreground mb-1">Submit Your Project</h3>
            <p className="text-xs text-muted-foreground mb-6 font-body">
              Submit your space, physics, software, or hardware project to be peer-reviewed and featured on Project Polaris.
            </p>
            <ProjectSubmissionForm onSuccess={() => setShowSubmitModal(false)} />
          </div>
        </div>
      )}

      {/* ── LEADERSHIP & TEAM ── */}
      <section className="section border-t border-border">
        <div className="shell">
          <ScrollReveal direction="up">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Leadership
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Behind Project Polaris</h2>
                <p className="mt-1 text-xs text-muted-foreground font-body">
                  Project Polaris is founded and led by students who believe in open computational tools and authentic science.
                </p>
              </div>
              <span className="font-mono text-xs text-gold px-3 py-1 rounded-full bg-surface-2 border border-gold/30">
                Student-Led Ecosystem
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <ScrollReveal key={member.name} direction="up" delay={i * 60}>
                <article className="card-premium p-6 flex flex-col justify-between h-full hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <img src={polarisLogo} alt="Polaris Logo" className="size-7 rounded-full border border-primary/30" />
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground font-display">{member.name}</h3>
                    <p className="font-mono text-xs text-primary mt-0.5">{member.role}</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">{member.note}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="text-[11px]">Polaris Core</span>
                    <span className="text-primary text-[11px]">Leadership</span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE DEPARTMENTS ── */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
              Structure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Core Departments</h2>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {DEPARTMENTS.map((dept, idx) => (
              <ScrollReveal key={dept.name} direction="up" delay={idx * 60}>
                <article className="card-premium p-6 h-full flex flex-col justify-between hover:border-primary/40 transition-colors">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-border font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
                      {dept.role}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-foreground font-display">{dept.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">{dept.blurb}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION & CULTURE ── */}
      <section className="section border-t border-border">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <ScrollReveal direction="up" delay={0}>
              <div className="card-premium p-6 md:p-8 h-full border-primary/20 bg-surface-2/30">
                <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase mb-3">
                  <Award className="size-4 text-gold" />
                  <span>Merit-Based Recognition</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Recognition Framework</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  We recognize verified student contributions through a structured, merit-based reward system that validates real engineering skills.
                </p>

                <ul className="mt-6 space-y-2 text-xs font-body">
                  {RECOGNITION_SYSTEM.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-2 border border-border">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="card-premium p-6 md:p-8 h-full border-gold/20 bg-surface-2/30">
                <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase mb-3">
                  <HeartHandshake className="size-4 text-primary" />
                  <span>Operating Principles</span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Working Culture</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                  Every volunteer, associate, and core team member operates with professional standards, code peer reviews, and high empathy.
                </p>

                <div className="mt-6 space-y-2 font-body">
                  {WORKING_CULTURE.map(({ rule, detail }) => (
                    <div key={rule} className="p-2.5 rounded-lg bg-surface-2 border border-border">
                      <p className="font-semibold text-xs text-foreground text-primary">{rule}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="section border-t border-border bg-surface/20">
        <div className="shell">
          <ScrollReveal direction="up">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Our 9 Core Values</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.name} direction="up" delay={i * 40}>
                <div className="card-premium p-6 h-full hover:border-primary/40 transition-colors">
                  <h3 className="font-bold text-sm text-primary font-display">{value.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">{value.note}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
