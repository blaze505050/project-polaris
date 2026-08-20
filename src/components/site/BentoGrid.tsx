import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import {
  Orbit,
  ArrowRight,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Compass,
  Layers,
  Code2,
  GraduationCap,
} from "lucide-react";

export function BentoGrid() {
  const [activeTab, setActiveTab] = useState<"research" | "content" | "operations">("research");

  return (
    <section className="section border-b border-border bg-surface/10">
      <div className="shell">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow">The Polaris Model</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How experiential learning happens in practice.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Instead of standard lectures and passive notes, students organize into functional teams, solve tangible engineering problems, and publish verifiable work.
          </p>
        </div>

        {/* ── 3-COLUMN RESTRAINED GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. RESEARCH & SIMULATION */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-4 mb-4 border-b border-border">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <Compass className="size-3.5" /> 01 / LABS
                </span>
                <span>Active Sprints</span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Engineering & Simulation
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Student software and hardware teams building authentic tools like AeroForge AI (aerodynamics & orbital solvers) and Sky Atlas deep-sky catalogs.
              </p>

              <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-primary" />
                  <span>Peer code & physics reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-primary" />
                  <span>Open-source reproducibility</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Link to="/projects" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
                <span>View active projects</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* 2. DAILY LEARNING & CONTENT */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-4 mb-4 border-b border-border">
                <span className="flex items-center gap-1.5 text-gold font-semibold">
                  <Flame className="size-3.5" /> 02 / DAILY RHYTHM
                </span>
                <span>Mon–Fri Drops</span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Daily Scientific Inquiries
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Curated morning deeptech drops ("Aaj Ka Gyan") based on weekly scientific themes — turning curious questions into daily discussion threads.
              </p>

              <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-gold" />
                  <span>Verified scientific sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-gold" />
                  <span>Weekend interactive polls</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <a
                href={SITE.communityUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-gold hover:underline inline-flex items-center gap-1"
              >
                <span>Read in WhatsApp Community</span>
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </div>

          {/* 3. MENTORSHIP & COHORTS */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-4 mb-4 border-b border-border">
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <GraduationCap className="size-3.5" /> 03 / MENTORSHIP
                </span>
                <span>Practitioner Guidance</span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Practitioner Cohorts
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Interactive masterclasses and direct reviews from aerospace propulsion leads, space scientists, and university educators.
              </p>

              <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-accent" />
                  <span>Direct Q&A with researchers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-accent" />
                  <span>Portfolio & skill validation</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Link to="/programs" className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1">
                <span>Explore program archives</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
