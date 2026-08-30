import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Cookie, ShieldCheck, Check, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy & Preferences — Project Polaris" },
      {
        name: "description",
        content:
          "Manage your cookie settings and learn how Project Polaris uses minimal local storage and analytical cookies for platform telemetry.",
      },
    ],
  }),
  component: CookiesPage,
});

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  preferences: boolean;
}

export function CookiesPage() {
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    functional: true,
    preferences: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("polaris_cookie_prefs");
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("polaris_cookie_prefs", JSON.stringify(prefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch {
      // ignore
    }
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      functional: true,
      preferences: true,
    };
    setPrefs(allEnabled);
    try {
      localStorage.setItem("polaris_cookie_prefs", JSON.stringify(allEnabled));
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch {
      // ignore
    }
  };

  const handleRejectOptional = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      functional: false,
      preferences: false,
    };
    setPrefs(essentialOnly);
    try {
      localStorage.setItem("polaris_cookie_prefs", JSON.stringify(essentialOnly));
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Privacy & Compliance"
        title="Cookie Policy & Preferences"
        lead="We prioritize student privacy and telemetry transparency. Manage your cookie and local storage preferences below."
      />

      <section className="section font-sans">
        <div className="shell max-w-3xl mx-auto space-y-10">
          <ScrollReveal direction="up">
            {/* Preferences Management Card */}
            <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card space-y-6 shadow-lg">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                <div className="flex items-center gap-2 text-primary font-display font-bold text-lg">
                  <Cookie className="size-5" />
                  <span>Interactive Preference Center</span>
                </div>
                {saved && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                    <Check className="size-3.5" />
                    <span>Preferences Saved</span>
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {/* 1. Necessary */}
                <div className="p-4 rounded-xl bg-surface-2 border border-white/6 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm font-display">
                        Essential & Security Cookies
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                        Always Active
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Required for basic route navigation, CSRF security verification, and theme
                      preference persistence. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="size-4 accent-primary rounded cursor-not-allowed mt-1"
                  />
                </div>

                {/* 2. Analytics */}
                <div className="p-4 rounded-xl bg-surface-2 border border-white/6 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground text-sm font-display">
                      Performance & Telemetry
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Helps us understand simulator execution times, popular masterclass topics, and
                      aggregated platform performance to improve educational tools.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                    className="size-4 accent-primary rounded cursor-pointer mt-1"
                  />
                </div>

                {/* 3. Functional */}
                <div className="p-4 rounded-xl bg-surface-2 border border-white/6 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground text-sm font-display">
                      Functional & Workspace State
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Saves your active AeroForge workspace configurations, solver settings, and
                      waitlist confirmation state locally in your browser.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.functional}
                    onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                    className="size-4 accent-primary rounded cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAcceptAll}
                    size="sm"
                    className="h-9 px-4 bg-primary text-primary-foreground font-semibold rounded-lg text-xs"
                  >
                    Accept All
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRejectOptional}
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-white/10 text-xs text-foreground hover:border-white/20"
                  >
                    Reject Optional
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={handleSave}
                  size="sm"
                  className="h-9 px-5 bg-white/10 text-foreground hover:bg-white/15 text-xs font-semibold rounded-lg"
                >
                  Save Custom Preferences
                </Button>
              </div>
            </div>

            {/* Policy Explanations */}
            <div className="mt-10 space-y-6 divide-y divide-white/8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <div className="space-y-2 pt-4">
                <h3 className="text-lg font-bold font-display text-foreground">
                  What Are Cookies & Local Storage?
                </h3>
                <p>
                  Cookies and Local Storage are small text data fragments placed on your device by
                  websites you visit. They are widely used to make websites work efficiently,
                  remember your session credentials, and provide essential telemetry.
                </p>
              </div>

              <div className="space-y-2 pt-6">
                <h3 className="text-lg font-bold font-display text-foreground">
                  Our Anti-Tracking Guarantee
                </h3>
                <p>
                  Project Polaris does not use third-party cross-site advertising pixels (e.g. Meta
                  Pixel, TikTok tracking, or ad retargeting cookies). All data stored is strictly
                  limited to improving the educational and simulation experience for students.
                </p>
              </div>

              <div className="space-y-2 pt-6">
                <h3 className="text-lg font-bold font-display text-foreground">
                  How Can You Control Cookies in Your Browser?
                </h3>
                <p>
                  You can configure your browser (Chrome, Firefox, Safari, Edge) to block or alert
                  you about cookies. Note that disabling essential cookies may impact interactive
                  simulations in the AeroForge computational suite.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/8 text-xs text-muted-foreground">
              Need more details? Review our{" "}
              <Link to="/privacy" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </Link>{" "}
              or contact us at{" "}
              <a href="mailto:projectpolaris.8@gmail.com" className="text-primary hover:underline">
                projectpolaris.8@gmail.com
              </a>
              .
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
