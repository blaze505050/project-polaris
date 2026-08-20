import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileCheck2, Sparkles, ArrowRight, Download, Layers, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE, DEPARTMENTS } from "@/lib/site";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Technical Research & Science Digest — Project Polaris" },
      {
        name: "description",
        content:
          "Student-led aerospace and physics research papers, peer-reviewed literature surveys, and bi-weekly scientific digests at Project Polaris.",
      },
      { property: "og:title", content: "Technical Research & Science Digest — Project Polaris" },
      {
        property: "og:description",
        content:
          "Read student-authored space science research digests, verification papers, and computational whitepapers.",
      },
    ],
  }),
  component: ResearchPage,
});

const RESEARCH_DIGEST_ISSUES = [
  {
    issue: "Vol. 1 · Issue 04",
    title: "Transonic Airfoil Flow & Supercritical Shock Delay",
    date: "August 2026",
    authors: "Research Department & AeroForge CFD Squad",
    blurb:
      "A comparative analysis of Prandtl-Glauert compressibility corrections versus full 2D Euler equations for predicting wave drag rise on transonic wing sections.",
    tags: ["CFD AERODYNAMICS", "NUMERICAL METHODS"],
  },
  {
    issue: "Vol. 1 · Issue 03",
    title: "Orbital State Propagation Using Runge-Kutta 4 Integrators",
    date: "July 2026",
    authors: "Astrodynamics Squad",
    blurb:
      "Numerical verification of J2 zonal harmonic gravitational perturbations in Low Earth Orbit (LEO) using Cowell's formulation against NASA SPICE ephemerides.",
    tags: ["ASTRODYNAMICS", "NUMERICAL ORBITS"],
  },
  {
    issue: "Vol. 1 · Issue 02",
    title: "Photometric Calibration of Deep-Sky Stargazing Data",
    date: "July 2026",
    authors: "Sky Atlas Team",
    blurb:
      "Methods for standardizing consumer DSLR and amateur telescope FITS data into calibrated B-V stellar color indices across community observation nights.",
    tags: ["ASTRONOMY", "DATA PIPELINES"],
  },
  {
    issue: "Vol. 1 · Issue 01",
    title: "Specific Impulse Optimization in Solid Sounding Rockets",
    date: "June 2026",
    authors: "Propulsion Working Group",
    blurb:
      "Nozzle expansion ratio trade-offs and chamber pressure curves for potassium nitrate / sucrose propellant motors at sea level.",
    tags: ["PROPULSION", "THERMODYNAMICS"],
  },
];

function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Polaris Research"
        title="Student-led technical inquiry & research digests."
        lead="We believe young students should learn real research methodology: formulating hypotheses, simulating physical constraints, verifying code, and publishing findings."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-9 px-4 bg-gradient-to-r from-primary via-[#e8d7ff] to-gold text-background font-bold font-mono text-xs shadow-md">
            <a href={SITE.communityUrl} target="_blank" rel="noreferrer">
              Join Research Cohort
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-4 font-mono text-xs border-white/15 hover:border-primary/40">
            <Link to="/projects">Launch AeroForge Lab</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Publications & Digests"
            title="Bi-Weekly Science & Technical Digests"
            lead="Peer-reviewed literature summaries, verification papers, and numerical analyses authored by student researchers."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {RESEARCH_DIGEST_ISSUES.map((doc, idx) => (
              <ScrollReveal key={doc.title} direction="up" delay={idx * 60}>
                <article className="p-6 md:p-8 rounded-2xl border border-white/8 bg-surface/80 backdrop-blur-xl flex flex-col justify-between h-full hover:border-primary/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                        {doc.issue}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{doc.date}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">{doc.title}</h3>
                    <p className="mt-1 font-mono text-xs text-primary/80">{doc.authors}</p>
                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                      {doc.blurb}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {doc.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-surface-2 border border-white/6 text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      <span>Peer Reviewed</span>
                    </span>
                    <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs font-mono border-white/15 hover:border-primary/40">
                      <a href={SITE.communityUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                        <span>Read in Community</span>
                        <ArrowRight className="size-3 text-primary" />
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
