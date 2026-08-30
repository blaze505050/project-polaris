import { cn } from "@/lib/utils";

// Deterministic star positions — no Math.random, so SSR and hydration agree.
// [left%, top%, baseSizePx, animDelayS]
const STARS = [
  [4, 18, 1.4, 0],
  [11, 62, 1, 1.2],
  [17, 33, 1.8, 2.4],
  [23, 78, 1, 0.6],
  [29, 12, 1.2, 3.1],
  [34, 51, 1.6, 1.8],
  [41, 27, 1, 2.2],
  [46, 71, 1.3, 0.4],
  [52, 8, 1.7, 2.8],
  [58, 44, 1, 1.1],
  [63, 86, 1.4, 3.6],
  [69, 21, 1.1, 0.9],
  [74, 58, 1.9, 2.1],
  [79, 37, 1, 1.5],
  [84, 74, 1.3, 3.3],
  [88, 15, 1.6, 0.2],
  [92, 49, 1, 2.6],
  [96, 82, 1.2, 1.7],
  [7, 91, 1.1, 2.9],
  [37, 95, 1.5, 0.8],
  [66, 5, 1, 1.9],
  [21, 46, 1, 3.4],
  [55, 66, 1.2, 0.5],
  [86, 92, 1.4, 2.3],
] as const;

type DepthLayer = "far" | "mid" | "near";

function getDepthProps(
  i: number,
  size: number,
): { layer: DepthLayer; scale: number; opacity: number; duration: number } {
  if (i % 3 === 0) return { layer: "near", scale: 1.4, opacity: 0.55, duration: 3.5 + (i % 4) };
  if (i % 3 === 1) return { layer: "mid", scale: 1.0, opacity: 0.35, duration: 4.5 + (i % 4) };
  return { layer: "far", scale: 0.7, opacity: 0.2, duration: 6 + (i % 4) };
}

export function Starfield({ className, density = 1 }: { className?: string; density?: number }) {
  const stars = STARS.slice(0, Math.round(STARS.length * density));
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {stars.map(([left, top, size, delay], i) => {
        const depth = getDepthProps(i, size);
        const finalSize = size * depth.scale;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-foreground"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${finalSize}px`,
              height: `${finalSize}px`,
              opacity: depth.opacity,
              animation: `polaris-twinkle ${depth.duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
