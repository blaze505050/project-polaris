import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[999] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-gold transition-all duration-75 ease-out shadow-[0_0_8px_rgba(56,189,248,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
