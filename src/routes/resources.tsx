import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BookOpen, Code, FileText, Globe } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { EmptyState, ErrorState, LoadingCards } from "@/components/site/StateBlocks";
import { resourcesQuery, type Resource } from "@/lib/db";
import { RESOURCE_CATEGORIES, RESOURCE_CATEGORY_LABELS, formatDate } from "@/lib/labels";

const CURATED_RESOURCES: Resource[] = [
  {
    id: "cfd-aerodynamics-primer",
    title: "Introduction to Aerodynamic CFD Solvers & Boundary Layers",
    category: "guide",
    description: "A student reference guide explaining Navier-Stokes approximations, pressure coefficients, and NACA airfoil mesh resolution.",
    author: "Polaris Propulsion & Aero Guild",
    url: "/aeroforge",
    published_date: "2026-08-15",
  },
  {
    id: "orbital-mechanics-handbook",
    title: "Two-Body Keplerian Dynamics & Hohmann Transfer Notebook",
    category: "reading",
    description: "Python and numerical formulas for calculating orbital eccentricity, semi-major axis, vis-viva velocity, and delta-v budgets.",
    author: "Astrophysics Research Team",
    url: "/projects",
    published_date: "2026-08-10",
  },
  {
    id: "deep-sky-observational-protocol",
    title: "Standard Astrophotography Calibration & Stacking Protocol",
    category: "session",
    description: "Field manual for telescope alignment, dark frame calibration, and photometry processing for student observation networks.",
    author: "Astronomy Outreach",
    url: "/community",
    published_date: "2026-08-05",
  },
  {
    id: "isro-propulsion-masterclass-notes",
    title: "Liquid Rocket Engine Cycle Architecture & Injector Mechanics",
    category: "session",
    description: "Archived lecture notes from the ISRO Masterclass covering expander, staged combustion, and gas-generator cycles.",
    author: "Masterclass Archive",
    url: "/programs",
    published_date: "2026-07-28",
  },
];

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Project Polaris" },
      {
        name: "description",
        content:
          "Open guides, session recaps, numerical solvers, and engineering reading lists shared openly by Project Polaris.",
      },
      { property: "og:title", content: "Resources — Project Polaris" },
      { property: "og:description", content: "Guides, recaps and reading lists for student builders." },
    ],
  }),
  component: Resources,
});

function Resources() {
  const { data, isLoading, isError } = useQuery(resourcesQuery);
  const [category, setCategory] = useState("all");
  
  const allResources = [...CURATED_RESOURCES, ...(data ?? [])];
  const items = allResources.filter((r) => category === "all" || r.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Open Resources"
        title="Everything we build and learn, documented."
        lead="Technical manuals, solver blueprints, and lecture notes curated by student researchers."
      />

      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-6 font-mono text-xs">
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  category === cat.value
                    ? "bg-surface-3 text-foreground font-bold border border-border-strong"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {isLoading ? <LoadingCards count={4} /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && items.length === 0 ? (
              <EmptyState
                title="Nothing in this category yet"
                note="We publish technical notes after each sprint — check back soon."
              />
            ) : null}
            {!isLoading && items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((resource, i) => (
                  <ScrollReveal key={resource.id} direction="up" delay={i * 60}>
                    <article className="card-premium p-6 flex flex-col justify-between h-full group relative">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-3">
                          <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-primary font-medium text-[11px]">
                            {RESOURCE_CATEGORY_LABELS[resource.category] ?? resource.category}
                          </span>
                          <span className="text-muted-foreground text-[11px]">{formatDate(resource.published_date)}</span>
                        </div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {resource.url ? (
                            <a
                              href={resource.url}
                              target={resource.url.startsWith("http") ? "_blank" : undefined}
                              rel={resource.url.startsWith("http") ? "noreferrer" : undefined}
                              className="after:absolute after:inset-0"
                            >
                              {resource.title}
                            </a>
                          ) : (
                            resource.title
                          )}
                        </h3>
                        {resource.description ? (
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                        ) : null}
                      </div>
                      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span className="text-[11px]">{resource.author ?? "Project Polaris"}</span>
                        <ArrowUpRight className="size-3.5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
