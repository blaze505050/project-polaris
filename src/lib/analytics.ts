/**
 * Privacy-friendly Analytics and Error Monitoring initialization.
 * Supports Google Analytics 4 (GA4), Plausible, and Sentry via Vite environment variables:
 * - VITE_GA_MEASUREMENT_ID
 * - VITE_PLAUSIBLE_DOMAIN
 * - VITE_SENTRY_DSN
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export function initAnalytics() {
  if (typeof window === "undefined") return;

  // 1. Google Analytics 4 (GA4)
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaId && !document.getElementById("ga-script")) {
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      page_path: window.location.pathname,
      anonymize_ip: true,
    });
  }

  // 2. Plausible Analytics
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (plausibleDomain && !document.getElementById("plausible-script")) {
    const pScript = document.createElement("script");
    pScript.id = "plausible-script";
    pScript.defer = true;
    pScript.setAttribute("data-domain", plausibleDomain);
    pScript.src = "https://plausible.io/js/script.js";
    document.head.appendChild(pScript);
  }

  // 3. Global Uncaught Error Telemetry Listener
  window.addEventListener("error", (event) => {
    reportErrorToTelemetry(event.error || new Error(event.message), "window.onerror");
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportErrorToTelemetry(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      "unhandledrejection",
    );
  });
}

/**
 * Track route changes / page views
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return;

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaId && typeof window.gtag === "function") {
    window.gtag("config", gaId, {
      page_path: path,
      page_title: title || document.title,
    });
  }

  if (typeof window.plausible === "function") {
    window.plausible("pageview", {
      props: { path, title: title || document.title },
    });
  }
}

/**
 * Track custom user engagement events
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }

  if (typeof window.plausible === "function") {
    window.plausible(name, { props: properties });
  }
}

/**
 * Report unexpected errors to Sentry or fallback logger
 */
export function reportErrorToTelemetry(error: Error, context?: string) {
  if (import.meta.env.DEV) {
    console.debug(`[Telemetry Error: ${context || "generic"}]`, error);
    return;
  }

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  if (sentryDsn) {
    // If Sentry DSN is present, error can be sent to endpoint
    try {
      fetch(sentryDsn, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {
      // Avoid recursive error throws
    }
  }
}
