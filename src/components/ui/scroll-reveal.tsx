import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade" | "clip";
  duration?: number;
  threshold?: number;
}

/**
 * ScrollReveal — Intersection Observer-based entrance animation.
 *
 * Animation rules (Emil Kowalski / Taste Skill):
 * - Strong ease-out: cubic-bezier(0.23, 1, 0.32, 1) — never ease-in.
 * - translateY max 24px (subtle, not dramatic).
 * - Only transform + opacity animated (GPU composited).
 * - "clip" variant uses clip-path for image wipe reveals.
 * - Respects prefers-reduced-motion via CSS.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 600,
  threshold = 0.12,
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
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
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
      case "clip":
      case "fade":
      default:
        return "none";
    }
  };

  const getClipPath = () => {
    if (direction !== "clip") return undefined;
    return isVisible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)";
  };

  const clipDuration = direction === "clip" ? Math.max(duration, 800) : duration;

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        clipPath: getClipPath(),
        transition: [
          `opacity ${clipDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
          `transform ${clipDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
          direction === "clip" ? `clip-path ${clipDuration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms` : "",
        ]
          .filter(Boolean)
          .join(", "),
        willChange: direction === "clip" ? "opacity, clip-path" : "opacity, transform",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}
