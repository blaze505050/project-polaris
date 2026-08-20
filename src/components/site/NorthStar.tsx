import { cn } from "@/lib/utils";
import polarisLogoWebp from "@/assets/polaris-logo.webp";
import polarisLogo from "@/assets/polaris-logo.png";

export function NorthStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("size-6 shrink-0", className)}>
      <path
        d="M 50 2 C 51.5 35 63 37 84 16 C 63 37 65 48.5 98 50 C 65 51.5 63 63 84 84 C 63 63 51.5 65 50 98 C 48.5 65 37 63 16 84 C 37 63 35 51.5 2 50 C 35 48.5 37 37 16 16 C 37 37 48.5 35 50 2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 group", className)}>
      <picture>
        <source srcSet={polarisLogoWebp} type="image/webp" />
        <img
          src={polarisLogo}
          alt="Project Polaris Logo"
          width={30}
          height={30}
          className="size-7 rounded-full object-cover ring-1 ring-border transition-transform duration-200 group-hover:scale-105"
        />
      </picture>
      <span className="flex items-center gap-1.5 leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground font-sans">
          Project Polaris
        </span>
        <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 text-muted-foreground border border-border">
          Labs
        </span>
      </span>
    </span>
  );
}
