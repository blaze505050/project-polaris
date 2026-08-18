import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState, ErrorState, LoadingCards } from "@/components/site/StateBlocks";
import { resourcesQuery } from "@/lib/db";
import { RESOURCE_CATEGORIES, RESOURCE_CATEGORY_LABELS, formatDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Project Polaris" },
      {
        name: "description",
        content:
          "Guides, session recaps, reading lists and learning material shared openly by the Project Polaris community.",
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
  const items = (data ?? []).filter((r) => category === "all" || r.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Everything we learn, shared back."
        lead="Session recaps, guides and reading lists — shared openly with the community."
      />

      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-8">
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                aria-pressed={category === cat.value}
                className={cn(
                  "font-ui rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                  category === cat.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-12">
            {isLoading ? <LoadingCards count={6} /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && !isError && items.length === 0 ? (
              <EmptyState
                title="Nothing here yet"
                note="We publish material after each session — check back soon."
              />
            ) : null}
            {!isLoading && !isError && items.length > 0 ? (
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((resource) => (
                  <li key={resource.id} className="card-elevated group relative flex flex-col p-6">
                    <span className="eyebrow-muted">
                      {RESOURCE_CATEGORY_LABELS[resource.category] ?? resource.category}
                    </span>
                    <h2 className="mt-4 text-xl">
                      {resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="after:absolute after:inset-0"
                        >
                          {resource.title}
                        </a>
                      ) : (
                        resource.title
                      )}
                    </h2>
                    {resource.description ? (
                      <p className="mt-3 flex-1 text-sm text-muted-foreground">{resource.description}</p>
                    ) : null}
                    <div className="font-ui mt-6 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{resource.author ?? "Project Polaris"}</span>
                      <span className="flex items-center gap-1.5">
                        {formatDate(resource.published_date)}
                        {resource.url ? <ArrowUpRight className="size-3.5 text-primary" /> : null}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
