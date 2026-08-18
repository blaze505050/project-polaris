import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-elevated p-6">
          <Skeleton className="h-4 w-24 bg-surface-2" />
          <Skeleton className="mt-4 h-6 w-3/4 bg-surface-2" />
          <Skeleton className="mt-3 h-4 w-full bg-surface-2" />
          <Skeleton className="mt-2 h-4 w-5/6 bg-surface-2" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function EmptyState({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border-strong px-6 py-14 text-center">
      <h3 className="font-display text-xl">{title}</h3>
      {note ? <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{note}</p> : null}
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ note }: { note?: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-10 text-center"
    >
      <h3 className="font-display text-xl">We couldn't load this right now</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        {note ?? "Please refresh the page. If it keeps happening, get in touch and we'll look into it."}
      </p>
    </div>
  );
}
