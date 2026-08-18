import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { LoadingCards, EmptyState, ErrorState } from "@/components/site/StateBlocks";
import { opportunitiesQuery } from "@/lib/db";
import { CATEGORY_FILTERS, LEVEL_FILTERS } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/opportunities/")({
  head: () => ({
    meta: [
      { title: "Opportunities — Project Polaris" },
      {
        name: "description",
        content:
          "Browse open research projects, workshops, volunteer roles and innovation programs you can join at Project Polaris.",
      },
      { property: "og:title", content: "Opportunities — Project Polaris" },
      {
        property: "og:description",
        content: "Research, workshops, volunteering and innovation projects open to students.",
      },
    ],
  }),
  component: OpportunitiesIndex,
});

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { readonly value: string; readonly label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow-muted mr-1">{label}</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            "font-ui rounded-full border px-3.5 py-1.5 text-xs transition-colors",
            value === opt.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function OpportunitiesIndex() {
  const { data, isLoading, isError } = useQuery(opportunitiesQuery);
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const items = (data ?? []).filter(
    (o) =>
      (category === "all" || o.category === category) && (level === "all" || o.level === level),
  );

  return (
    <>
      <PageHeader
        eyebrow="Opportunities"
        title="Find something worth building."
        lead="Everything here is open to students. No prior experience is assumed unless we say so."
      />

      <section className="section">
        <div className="shell">
          <div className="flex flex-col gap-4 border-b border-border pb-8">
            <FilterRow label="Type" options={CATEGORY_FILTERS} value={category} onChange={setCategory} />
            <FilterRow label="Level" options={LEVEL_FILTERS} value={level} onChange={setLevel} />
          </div>

          <div className="mt-12">
            {isLoading ? <LoadingCards count={6} /> : null}
            {isError ? <ErrorState /> : null}
            {!isLoading && !isError && items.length === 0 ? (
              <EmptyState
                title="Nothing matches those filters yet"
                note="We're a young organisation and we add opportunities as they open. Try clearing a filter."
              />
            ) : null}
            {!isLoading && !isError && items.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
