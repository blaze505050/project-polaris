/**
 * AEROFORGE PRODUCT ANALYTICS INSTRUMENTATION
 * Conceptual privacy-first funnel telemetry service.
 * Tracks key activation, engagement, and growth loop events without capturing sensitive PII.
 */

export type FunnelStep =
  | "landing_viewed"
  | "demo_started"
  | "demo_completed"
  | "onboarding_started"
  | "onboarding_completed"
  | "project_created"
  | "first_tool_run"
  | "first_result_generated"
  | "result_saved"
  | "completed_investigation"
  | "experiment_created"
  | "notebook_edited"
  | "report_exported"
  | "public_artifact_shared"
  | "public_artifact_duplicated";

export interface AnalyticsEvent {
  event: FunnelStep;
  timestamp: number;
  properties?: Record<string, any>;
}

class ProductAnalytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

  public track(event: FunnelStep, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const payload: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      properties,
    };

    this.events.push(payload);

    // Developer console trace in non-production
    if (import.meta.env.MODE !== "production") {
      console.log(`[ANALYTICS FUNNEL]`, event, properties || "");
    }

    // Persist session telemetry locally
    try {
      const stored = localStorage.getItem("aeroforge_funnel_telemetry");
      const past = stored ? JSON.parse(stored) : [];
      past.push(payload);
      localStorage.setItem("aeroforge_funnel_telemetry", JSON.stringify(past.slice(-50)));
    } catch (e) {
      // Storage quota resilience
    }
  }

  public getSessionEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public clearSession() {
    this.events = [];
  }
}

export const analytics = new ProductAnalytics();
