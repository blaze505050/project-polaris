import { type ReactNode, useEffect, useRef, useState } from "react";
import { Starfield } from "./Starfield";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-surface/20 pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="shell">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="max-w-3xl text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
        {lead ? <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">{lead}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  );
}

