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
    <span className={cn("flex items-center gap-3 group", className)}>
      <picture>
        <source srcSet={polarisLogoWebp} type="image/webp" />
        <img
          src={polarisLogo}
          alt="Project Polaris Logo"
          width={36}
          height={36}
          className="size-9 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </picture>
      <span className="leading-none">
        <span className="block text-[0.7rem] font-bold tracking-widest text-primary uppercase">Project</span>
        <span className="font-display block text-xl font-bold tracking-tight text-foreground">
          Polaris
        </span>
      </span>
    </span>
  );
}
