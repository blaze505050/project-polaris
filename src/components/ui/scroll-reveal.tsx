import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade" | "clip" | "blur";
  duration?: number;
  threshold?: number;
  /** Stagger delay between children (ms). Applied per-child via CSS custom property. */
  stagger?: number;
}

/**
 * ScrollReveal — Intersection Observer-based entrance animation.
 *
 * Animation rules (Emil Kowalski / Taste Skill / Impeccable):
 * - Strong ease-out: cubic-bezier(0.23, 1, 0.32, 1) — never ease-in.
 * - translateY max 24px (subtle, not dramatic).
 * - Only transform + opacity animated (GPU composited).
 * - "clip" variant uses clip-path for image wipe reveals.
 * - "blur" variant fades from blur(6px) → blur(0) for soft entrance.
 * - "scale" starts at scale(0.96) — never scale(0) (Kowalski: "Nothing appears from nothing").
 * - Respects prefers-reduced-motion via CSS and JS check.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 600,
  threshold = 0.12,
  stagger,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "none";
    switch (direction) {
      case "up":
        return "translateY(24px)";
      case "down":
        return "translateY(-24px)";
      case "left":
        return "translateX(24px)";
      case "right":
        return "translateX(-24px)";
      case "scale":
        return "scale(0.96) translateY(12px)";
      case "blur":
        return "translateY(8px)";
      case "clip":
      case "fade":
      default:
        return "none";
    }
  };

  const getFilter = () => {
    if (direction !== "blur") return undefined;
    return isVisible ? "blur(0px)" : "blur(6px)";
  };

  const getClipPath = () => {
    if (direction !== "clip") return undefined;
    return isVisible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)";
  };

  const clipDuration = direction === "clip" ? Math.max(duration, 800) : duration;
  const blurDuration = direction === "blur" ? Math.max(duration, 700) : clipDuration;
  const finalDuration = direction === "blur" ? blurDuration : clipDuration;

  // Build willChange based on which properties we animate
  const willChangeProps = ["opacity", "transform"];
  if (direction === "clip") willChangeProps.push("clip-path");
  if (direction === "blur") willChangeProps.push("filter");

  // Build transition string
  const transitions = [
    `opacity ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
    `transform ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
  ];
  if (direction === "clip") {
    transitions.push(`clip-path ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`);
  }
  if (direction === "blur") {
    transitions.push(`filter ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`);
  }

  // If stagger is set, wrap children with staggered delays
  if (stagger && React.Children.count(children) > 1) {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {React.Children.map(children, (child, i) => {
          const childDelay = delay + i * stagger;
          return (
            <div
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : getTransform(),
                filter: getFilter(),
                transition: [
                  `opacity ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${childDelay}ms`,
                  `transform ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${childDelay}ms`,
                  direction === "blur"
                    ? `filter ${finalDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${childDelay}ms`
                    : "",
                ]
                  .filter(Boolean)
                  .join(", "),
                willChange: willChangeProps.join(", "),
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        clipPath: getClipPath(),
        filter: getFilter(),
        transition: transitions.filter(Boolean).join(", "),
        willChange: willChangeProps.join(", "),
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}
