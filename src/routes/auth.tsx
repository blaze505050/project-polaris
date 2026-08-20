import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Student Portal Sign Up — Project Polaris" },
      {
        name: "description",
        content:
          "Create your Polaris Student Portal account to track courses, attendance, assignments, quiz scores, projects, skills and certificates.",
      },
      { property: "og:title", content: "Student Portal Sign Up — Project Polaris" },
      {
        property: "og:description",
        content: "Your Polaris Learning Dashboard: progress, mentor feedback, portfolio and certificates.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const fullName = String(fd.get("full_name") ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 8 || password.length > 72) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (mode === "signup" && (fullName.length < 2 || fullName.length > 100)) {
      toast.error("Please enter your full name.");
      return;
    }

    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal`,
          data: { full_name: fullName },
        },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. Check your email to confirm, then sign in.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate({ to: "/portal" });
    }
  }

  async function google() {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/portal` },
      });
    } catch {
      toast.error("Google sign-in is unavailable right now.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Student Authentication"
        title="Access your engineering workspace."
        lead="Manage active simulation solvers, peer review logs, technical roadmaps, and AI mentor sessions."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
          <div className="card-premium p-6 sm:p-8">
            <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface-2 p-1 text-xs font-mono">
              {(["signup", "signin"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={
                    "flex-1 rounded py-1.5 transition-colors " +
                    (mode === m
                      ? "bg-surface-3 text-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {m === "signup" ? "Create Account" : "Sign In"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-4 font-mono text-xs">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-foreground text-xs">Full Name</Label>
                  <Input id="full_name" name="full_name" maxLength={100} required autoComplete="name" className="bg-background border-border h-9" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground text-xs">Email Address</Label>
                <Input id="email" name="email" type="email" maxLength={255} required autoComplete="email" className="bg-background border-border h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground text-xs">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  maxLength={72}
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="bg-background border-border h-9"
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full h-9 bg-foreground text-background font-medium text-xs mt-2">
                {busy ? "Processing…" : mode === "signup" ? "Initialize Workspace Account" : "Sign In to Workspace"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>OR</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button type="button" variant="outline" className="w-full h-9 text-xs font-mono" onClick={google}>
              Continue with Google
            </Button>

            <p className="mt-5 text-[11px] font-mono text-muted-foreground leading-relaxed">
              Open to all learners. Workspace accounts include access to community discussion channels and baseline simulation tools.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="eyebrow mb-2">Workspace Capabilities</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Progress backed by real artifacts.
              </h2>
            </div>

            <ul className="space-y-3 font-mono text-xs">
              {[
                { title: "Sprint Backlog & Deliverables", desc: "Live tracking of numerical verification scripts and sprint tasks." },
                { title: "Polaris AI Engineering Co-Pilot", desc: "Structured reviews of aerodynamic relations, code, and literature." },
                { title: "Domain Practitioner Endorsements", desc: "Verified written feedback from ISRO & propulsion mentors." },
                { title: "Open-Source Verification", desc: "Linked GitHub repositories and reproducible technical documentation." },
              ].map((item, i) => (
                <li key={i} className="p-3.5 rounded-lg border border-border bg-surface-2/40">
                  <div className="text-foreground font-semibold mb-0.5">{item.title}</div>
                  <div className="text-muted-foreground text-[11px] font-sans">{item.desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
