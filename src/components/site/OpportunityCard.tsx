import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Opportunity } from "@/lib/db";
import { CATEGORY_LABELS, LEVEL_LABELS, STATUS_LABELS, formatDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

function StatusPill({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={cn(
        "font-ui inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] tracking-wide uppercase",
        status === "open" && "border-success/40 text-success",
        status === "ongoing" && "border-primary/40 text-primary",
        status === "coming_soon" && "border-gold/40 text-gold",
        status === "closed" && "border-border-strong text-muted-foreground",
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const deadline = formatDate(opportunity.deadline);
  const start = formatDate(opportunity.start_date);

  return (
    <article className="card-elevated group relative flex flex-col p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="eyebrow-muted">
          {CATEGORY_LABELS[opportunity.category] ?? opportunity.category}
        </span>
        <StatusPill status={opportunity.status} />
      </div>

      <h3 className="mt-4 text-xl">
        <Link
          to="/opportunities/$slug"
          params={{ slug: opportunity.slug }}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {opportunity.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm text-muted-foreground">{opportunity.summary}</p>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <div className="font-ui flex items-center gap-2">
          <dt className="sr-only">Level</dt>
          <dd>{LEVEL_LABELS[opportunity.level] ?? opportunity.level}</dd>
        </div>
        {start ? (
          <div className="font-ui flex items-center gap-2">
            <dt className="sr-only">Starts</dt>
            <dd className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Starts {start}
            </dd>
          </div>
        ) : null}
        {deadline ? (
          <div className="font-ui flex items-center gap-2">
            <dt className="sr-only">Apply by</dt>
            <dd>Apply by {deadline}</dd>
          </div>
        ) : null}
      </dl>

      <span className="font-ui mt-6 inline-flex items-center gap-1.5 text-sm text-primary">
        View details
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </article>
  );
}
