import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  /** Target number to count to */
  target: number;
  /** Suffix like "+" or "%" */
  suffix?: string;
  /** Prefix like "$" */
  prefix?: string;
  /** Duration in ms. Default 1800 */
  duration?: number;
  className?: string;
}

/**
 * CountUp — Scroll-triggered number animation.
 *
 * Uses requestAnimationFrame with ease-out curve (Kowalski-correct).
 * Cheapest tool: no library, pure JS + RAF.
 */
export function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      // Ease-out curve: 1 - (1 - t)^3
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * target);
      setCount(current);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasTriggered, target, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}{count}{suffix}
    </span>
  );
}
