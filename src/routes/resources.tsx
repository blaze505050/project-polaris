import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  FileText,
  Code,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Open Resources & Technical Notes — Project Polaris" },
      {
        name: "description",
        content:
          "Free, self-paced knowledge guides, mathematical primers, solver blueprints, and lecture notes curated by student researchers at Project Polaris.",
      },
      { property: "og:title", content: "Open Resources & Technical Notes — Project Polaris" },
      {
        property: "og:description",
        content: "Free guides, mathematical primers, solver blueprints, and lecture notes.",
      },
    ],
  }),
  component: ResourcesPage,
});

interface ResourceItem {
  id: string;
  title: string;
  type: "guide" | "reading" | "blueprint" | "session-notes";
  readTime: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  author: string;
  topic: string;
  date: string;
  relatedCourse?: { label: string; to: string };
  relatedLab?: { label: string; to: string };
  downloadOrUrl: string;
}

const RICH_RESOURCES: ResourceItem[] = [
  {
    id: "hohmann-transfers-explained",
    title: "Understanding Hohmann Transfers & The Vis-Viva Equation",
    type: "guide",
    readTime: "12 min read",
    level: "beginner",
    topic: "Astrodynamics · Physics",
    description:
      "Learn how spacecraft transition between circular planetary orbits using two-impulse tangential burns. Understand orbital energy conservation and calculate delta-v budgets from first principles.",
    author: "Astrodynamics Working Group",
    date: "August 2026",
    relatedCourse: { label: "Orbital Mechanics Mini-Course", to: "/courses" },
    relatedLab: { label: "AeroForge Orbital Lab", to: "/projects" },
    downloadOrUrl: "/courses",
  },
  {
    id: "navier-stokes-airfoil-cfd",
    title: "Navier-Stokes Simplified: Compressible Flow on Lifting Surfaces",
    type: "guide",
    readTime: "15 min read",
    level: "intermediate",
    topic: "Aerodynamics · CFD",
    description:
      "A conceptual and mathematical breakdown of boundary layer separation, pressure coefficients ($C_p$), and Prandtl-Glauert compressibility corrections for transonic airfoils.",
    author: "AeroForge CFD Guild",
    date: "August 2026",
    relatedCourse: { label: "Airfoil Aerodynamics Course", to: "/courses" },
    relatedLab: { label: "Run Airfoil CFD in AeroForge", to: "/projects" },
    downloadOrUrl: "/projects",
  },
  {
    id: "deep-sky-observational-protocol",
    title: "Standard Astrophotography Calibration & Photometry Protocol",
    type: "blueprint",
    readTime: "10 min read",
    level: "beginner",
    topic: "Astronomy · Instrumentation",
    description:
      "A field manual for telescope alignment, bias subtraction, dark frame calibration, and aperture photometry processing for student observation networks.",
    author: "Sky Atlas Team",
    date: "July 2026",
    relatedCourse: { label: "Astronomical Data Course", to: "/courses" },
    downloadOrUrl: "/projects",
  },
  {
    id: "isro-propulsion-notes",
    title: "Liquid Rocket Engine Cycles & Regenerative Nozzle Cooling",
    type: "session-notes",
    readTime: "18 min read",
    level: "intermediate",
    topic: "Propulsion · Thermodynamics",
    description:
      "Archived lecture notes from the ISRO Masterclass covering expander, staged combustion, and gas-generator cycles with thrust chamber heat transfer equations.",
    author: "Masterclass Archive",
    date: "July 2026",
    relatedCourse: { label: "Rocket Propulsion Workshop", to: "/courses?type=workshop" },
    downloadOrUrl: "/courses",
  },
  {
    id: "kalman-filter-sounding-rockets",
    title: "Kalman Filter Sensor Fusion for Sounding Rocket Altitude",
    type: "blueprint",
    readTime: "14 min read",
    level: "intermediate",
    topic: "Embedded Avionics · State Estimation",
    description:
      "Mathematical state-space formulation for fusing noisy barometric pressure data and 3-axis accelerometer readings to reliably predict apogee events.",
    author: "Avionics Team",
    date: "June 2026",
    relatedCourse: { label: "Avionics Bootcamp", to: "/courses?type=bootcamp" },
    downloadOrUrl: "/courses",
  },
];

function ResourcesPage() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const items = useMemo(() => {
    if (selectedType === "all") return RICH_RESOURCES;
    return RICH_RESOURCES.filter((r) => r.type === selectedType);
  }, [selectedType]);

  return (
    <>
      <PageHeader
        eyebrow="Open Knowledge"
        title="Free guides, solver blueprints & lecture notes."
        lead="Everything we investigate, simulate, and verify is documented for students to learn from freely."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="sm"
            className="h-9 px-4 bg-primary text-primary-foreground font-bold font-mono text-xs shadow-sm hover:bg-primary/90 transition-colors"
          >
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join WhatsApp for Daily Drops
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40"
          >
            <Link to="/courses">Explore Learning Catalog</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          {/* Type Filter Pills */}
          <ScrollReveal direction="up">
            <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
              {[
                { id: "all", label: "All Resources" },
                { id: "guide", label: "Technical Guides" },
                { id: "blueprint", label: "Solver Blueprints" },
                { id: "session-notes", label: "Masterclass Notes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full transition-colors ${
                    selectedType === tab.id
                      ? "bg-foreground text-background font-bold"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 font-mono">
            {items.map((r, i) => (
              <ScrollReveal key={r.id} direction="up" delay={i * 40}>
                <article className="p-6 md:p-8 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase text-[10px]">
                        {r.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>{r.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-foreground">{r.title}</h3>
                    <p className="mt-1 text-[11px] text-primary/80 font-mono">{r.topic}</p>
                    <p className="mt-3 text-xs text-muted-foreground font-body leading-relaxed">
                      {r.description}
                    </p>

                    {/* Connected Learning Links (The Learning Graph) */}
                    {(r.relatedCourse || r.relatedLab) && (
                      <div className="mt-4 pt-3 border-t border-white/6 space-y-1 text-xs">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                          Connected next steps:
                        </span>
                        {r.relatedCourse && (
                          <Link
                            to={r.relatedCourse.to}
                            className="flex items-center gap-1.5 text-primary hover:text-foreground transition-colors text-[11px]"
                          >
                            <ArrowRight className="size-3 text-gold" />
                            <span>Course: {r.relatedCourse.label}</span>
                          </Link>
                        )}
                        {r.relatedLab && (
                          <Link
                            to={r.relatedLab.to}
                            className="flex items-center gap-1.5 text-emerald-400 hover:text-foreground transition-colors text-[11px]"
                          >
                            <Cpu className="size-3 text-emerald-400" />
                            <span>Interactive Lab: {r.relatedLab.label}</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">By {r.author}</span>
                    <Button
                      asChild
                      size="sm"
                      className="h-8 px-3.5 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg"
                    >
                      <a
                        href={SITE.communityUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1"
                      >
                        <span>Read in Community</span>
                        <ArrowUpRight className="size-3 text-primary" />
                      </a>
                    </Button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
