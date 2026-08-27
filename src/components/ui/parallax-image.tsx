import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Image opacity from 0 to 1. Default 1 */
  imgOpacity?: number;
  /** Parallax intensity: 0 = none, 1 = strong. Default 0.15 */
  intensity?: number;
  /** Optional overlay gradient opacity 0–1 */
  overlay?: number;
  /** Ken Burns slow zoom animation */
  kenBurns?: boolean;
  style?: CSSProperties;
}

/**
 * ParallaxImage — Lightweight scroll-linked parallax using IntersectionObserver + scroll listener.
 *
 * No heavy library. Uses CSS transform (GPU composited).
 * Cheapest tool that works (Kowalski rule #3).
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  imgOpacity,
  intensity = 0.15,
  overlay = 0.45,
  kenBurns = false,
  style,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;
        // Normalize: -1 when element is at bottom of viewport, +1 when at top
        const progress = (viewportH - rect.top) / (viewportH + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        // Map to a range around center (0.5)
        const parallaxOffset = (clampedProgress - 0.5) * intensity * rect.height;
        setOffset(parallaxOffset);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [intensity]);

  return (
    <div
      ref={wrapRef}
      className={cn("overflow-hidden relative", className)}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          kenBurns && "animate-[ken-burns_25s_ease-in-out_infinite]",
          imgClassName
        )}
        style={{
          transform: `translateY(${offset}px) scale(1.12)`,
          opacity: imgOpacity !== undefined ? imgOpacity : undefined,
          transition: "transform 100ms linear",
          willChange: "transform",
        }}
      />
      {overlay > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, var(--background) 0%, rgba(8,10,15,${overlay * 0.6}) 25%, rgba(8,10,15,${overlay * 0.4}) 75%, var(--background) 100%)`,
          }}
        />
      )}
    </div>
  );
}
