import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-50 flex size-9 items-center justify-center rounded-lg border border-border bg-surface-2/90 text-muted-foreground backdrop-blur-md transition-all duration-200 hover:border-border-strong hover:bg-surface-3 hover:text-foreground active:scale-95 shadow-lg"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
