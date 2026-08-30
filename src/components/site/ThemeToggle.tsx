import { useEffect, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";

export type ThemePreference = "dark" | "light" | "system";

export function getResolvedTheme(pref: ThemePreference): "dark" | "light" {
  if (pref === "system") {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }
    return "dark";
  }
  return pref;
}

export function applyTheme(pref: ThemePreference) {
  const resolved = getResolvedTheme(pref);
  document.documentElement.classList.toggle("light", resolved === "light");
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [pref, setPref] = useState<ThemePreference>("dark");

  useEffect(() => {
    const stored = (window.localStorage.getItem("polaris-theme") as ThemePreference) || "system";
    setPref(stored);
    applyTheme(stored);

    // Listen for system theme changes if set to system
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => {
      const current = (window.localStorage.getItem("polaris-theme") as ThemePreference) || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function cycleTheme() {
    // Cycle: dark -> light -> system -> dark
    const next: ThemePreference = pref === "dark" ? "light" : pref === "light" ? "system" : "dark";
    setPref(next);
    window.localStorage.setItem("polaris-theme", next);
    applyTheme(next);
  }

  const label =
    pref === "light"
      ? "Theme: Light (Click for System)"
      : pref === "system"
        ? "Theme: System (Click for Dark)"
        : "Theme: Dark (Click for Light)";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className={
        "flex size-10 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition-all hover:border-primary hover:bg-surface " +
        (className ?? "")
      }
    >
      {pref === "light" ? (
        <Sun className="size-4 text-amber-500" />
      ) : pref === "system" ? (
        <Laptop className="size-4 text-primary" />
      ) : (
        <Moon className="size-4 text-cyan-400" />
      )}
    </button>
  );
}
