import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * IntersectionObserver-based scroll reveal hook.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 * Once visible, stays visible (no un-reveal on scroll back).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/**
 * Animated count-up hook for stat numbers.
 * Starts counting when the element enters the viewport.
 */
export function useCountUp(
  target: number,
  duration = 1500,
): [RefObject<HTMLSpanElement | null>, number] {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    let animFrame: number;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [started, target, duration]);

  return [ref, count];
}
