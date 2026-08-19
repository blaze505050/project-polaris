import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Off course</p>
        <h1 className="mt-4 font-display text-5xl">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page doesn't exist. Let's get you back to something useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/opportunities">Explore opportunities</Link>
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
      <div className="max-w-lg w-full text-center rounded-3xl border border-destructive/30 bg-card/80 backdrop-blur-2xl p-8 md:p-10 shadow-2xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6 ring-8 ring-destructive/5">
          <span className="text-2xl font-bold">!</span>
        </div>
        <p className="eyebrow mb-2 !text-destructive">Runtime Alert</p>
        <h1 className="font-display text-3xl font-bold text-foreground">Application Encountered an Issue</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We encountered an unexpected error while initializing this section. You can retry the operation or return to the main dashboard.
        </p>

        {error?.message && (
          <div className="mt-5 text-left p-3.5 rounded-xl bg-surface border border-border text-xs font-mono text-muted-foreground overflow-auto max-h-36">
            <span className="text-destructive font-semibold">Error:</span> {error.message}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary text-primary-foreground font-semibold px-6"
          >
            Try again
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <a href="/">Go home</a>
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
          "Project Polaris is a student-led experiential learning organisation where students research, build and solve real problems.",
      },
      { property: "og:site_name", content: "Project Polaris" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "color-scheme", content: "dark light" },
      { name: "theme-color", content: "#050505" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children:
          "try{var t=localStorage.getItem('polaris-theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme: light)').matches)){document.documentElement.classList.add('light');document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light'}}catch(e){}",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://projectpolaris.in/#organization",
              name: "Project Polaris",
              url: "https://projectpolaris.in/",
              logo: "https://projectpolaris.in/polaris-logo.png",
              description:
                "A student-led experiential learning organisation bridging traditional education and real-world space & engineering practice.",
              slogan: "Learning through Building, rather than Building after learning.",
              foundingDate: "2026-06-07",
              sameAs: [
                "https://www.instagram.com/project_polaris_?igsh=cGR3aGdkdjd2Y2hm",
                "https://www.linkedin.com/company/nova-next-gen-of-vision-and-astronomy/"
              ]
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://projectpolaris.in/aeroforge/#app",
              name: "AeroForge AI",
              url: "https://projectpolaris.in/aeroforge",
              applicationCategory: "EngineeringApplication",
              operatingSystem: "All modern web browsers",
              description:
                "Browser-based aerospace and mechanical simulation workstation with 40+ numerical solvers, CFD aerodynamics, structural FEA, and orbital mechanics.",
              creator: {
                "@id": "https://projectpolaris.in/#organization"
              }
            }
          ]
        }),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <a
        href="#main"
        className="font-ui sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

