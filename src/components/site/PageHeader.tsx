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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="veil relative overflow-hidden border-b border-border">
      <Starfield density={0.85} />
      <div className="blueprint absolute inset-0 opacity-60" aria-hidden="true" />

      {/* Gradient mesh for depth */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 blur-[100px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="shell relative pt-28 pb-14 md:pt-36 md:pb-20 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl md:text-6xl">{title}</h1>
        {lead ? <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{lead}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}

