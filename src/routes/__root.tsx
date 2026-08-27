import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { NorthStar } from "@/components/site/NorthStar";
import { getOrganizationSchema } from "@/lib/structured-data";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import {
  FolderKanban,
  Home as HomeIcon,
  RotateCcw,
} from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Ambient Celestial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 size-64 bg-gold/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/25 shadow-sm">
          <NorthStar className="size-3.5 text-primary" />
          <span>Coordinates Not Found</span>
        </div>

        <h1 className="text-7xl sm:text-9xl font-sans font-bold tracking-tight text-foreground/20 leading-none">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-foreground">
            Lost in Deep Space?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed font-sans">
            The orbital trajectory or page you are looking for has decayed or does not exist. Let's recalculate your state vectors.
          </p>
        </div>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono text-left">
          <Link
            to="/"
            className="p-3 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <HomeIcon className="size-4 text-primary mb-1.5" />
            <span className="font-bold text-foreground block">Home</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Main platform</span>
          </Link>
          <Link
            to="/projects"
            className="p-3 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <FolderKanban className="size-4 text-primary mb-1.5" />
            <span className="font-bold text-foreground block">Projects</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">AeroForge Lab</span>
          </Link>
          <Link
            to="/about"
            className="p-3 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <span className="font-bold text-foreground block">About Us</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Mission & team</span>
          </Link>
          <Link
            to="/contact"
            className="p-3 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-surface-2 transition-colors block"
          >
            <span className="font-bold text-foreground block">Contact</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Direct message</span>
          </Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Button asChild size="default" className="h-10 px-6 font-mono text-xs bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90">
            <Link to="/">
              <HomeIcon className="size-3.5 mr-1.5" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="h-10 px-5 font-mono text-xs border-border hover:border-primary/40">
            <Link to="/contact">Report Broken Link</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("[Project Polaris Root Error]:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center rounded-xl border border-destructive/30 bg-card p-8 md:p-10 shadow-lg">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-6 border border-destructive/20 font-bold font-mono text-lg">
          !
        </div>
        <span className="font-mono text-xs text-destructive uppercase tracking-widest font-semibold block mb-2">
          Telemetry Alert
        </span>
        <h1 className="text-2xl font-bold font-sans text-foreground">Application Encountered an Exception</h1>
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-sans">
          We encountered an unexpected state while initializing this component. You can reload this state or return to the main hub.
        </p>

        {error?.message && (
          <div className="mt-5 text-left p-3.5 rounded-lg bg-background border border-border text-xs font-mono text-muted-foreground overflow-auto max-h-36">
            <span className="text-destructive font-semibold">Message:</span> {error.message}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono text-xs">
          <Button
            size="sm"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="h-9 px-5 bg-primary text-primary-foreground font-bold hover:bg-primary/90"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Retry Component
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 px-5 border-border hover:border-primary/40">
            <a href="/">Go to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Project Polaris — Learn by Building" },
      {
        name: "description",
        content:
          "Project Polaris is a student-led experiential engineering and research ecosystem bridging textbook education with real simulation software and physical systems.",
      },
      { property: "og:site_name", content: "Project Polaris" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://projectpolaris.in/" },
      { property: "og:image", content: "https://projectpolaris.in/polaris-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@project_polaris" },
      { name: "color-scheme", content: "dark light" },
      { name: "theme-color", content: "#0a0b0e" },
      { name: "google-site-verification", content: "googled78f9368e7e1e969" },
      { name: "msvalidate.01", content: "bing-site-verification-polaris" },
    ],
    links: [
      { rel: "icon", href: "/polaris-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/polaris-logo.png" },
      { rel: "canonical", href: "https://projectpolaris.in/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children:
          "try{var t=localStorage.getItem('polaris-theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme: light)').matches)){document.documentElement.classList.add('light');document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light'}}catch(e){}",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(getOrganizationSchema()),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <ScrollProgress />
      <a
        href="#main"
        className="font-mono sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-xs focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
