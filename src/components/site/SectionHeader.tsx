import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem]">{title}</h2>
      {lead ? <p className="mt-5 text-base text-muted-foreground md:text-lg">{lead}</p> : null}
      {children}
    </div>
  );
}
