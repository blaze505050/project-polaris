import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // Simulate clean adapter submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Save subscription locally for MVP
      const existing = JSON.parse(localStorage.getItem("polaris_newsletter_subscribers") || "[]");
      if (!existing.includes(email.toLowerCase().trim())) {
        existing.push(email.toLowerCase().trim());
        localStorage.setItem("polaris_newsletter_subscribers", JSON.stringify(existing));
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Failed to subscribe. Please try again or join our WhatsApp community.");
    }
  };

  return (
    <div className={`rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface/60 to-surface-2/80 p-6 md:p-8 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary font-ui mb-3">
            <Mail className="size-3.5" />
            <span>Project Polaris Dispatch</span>
          </div>
          <h3 className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">
            Stay in the loop with student engineering & research
          </h3>
          <p className="mt-2 text-sm text-muted-foreground font-sans leading-relaxed">
            Get quarterly field notes on AeroForge updates, new rocketry workshops, upcoming space science challenges, and student build logs. Zero spam.
          </p>
        </div>

        <div className="w-full md:w-auto md:min-w-[340px]">
          {status === "success" ? (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold font-ui">You're on the dispatch list!</p>
                <p className="text-xs text-emerald-400/80 mt-0.5">Welcome to the Project Polaris community.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  aria-label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter your student or work email"
                  required
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-input bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 px-5 shrink-0"
                >
                  {status === "loading" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-1.5 text-xs text-destructive pl-1">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <p className="text-[11px] text-muted-foreground pl-1">
                By subscribing you agree to our{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
