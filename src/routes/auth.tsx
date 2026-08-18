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
        eyebrow="Student Portal"
        title="Your Polaris Learning Dashboard."
        lead="One place for your course, attendance, assignments, quiz scores, project progress, mentor feedback, skills, portfolio and certificate status."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div className="card-elevated p-7 md:p-9">
            <div className="font-ui mb-7 flex gap-1 rounded-full border border-border p-1 text-sm">
              {(["signup", "signin"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={
                    "flex-1 rounded-full px-4 py-2 transition-colors " +
                    (mode === m
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {m === "signup" ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" name="full_name" maxLength={100} required autoComplete="name" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" maxLength={255} required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  maxLength={72}
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Please wait…" : mode === "signup" ? "Create my portal account" : "Sign in"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span className="font-ui">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={google}>
              Continue with Google
            </Button>

            <p className="mt-6 text-xs text-muted-foreground">
              Creating a portal account is free. Paid courses, bootcamps and space camps are enrolled
              separately.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5">What you get</p>
            <h2 className="text-3xl md:text-4xl">Progress you can actually see</h2>
            <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
              {[
                "Course enrolment and attendance record",
                "Assignments completed vs assigned",
                "Quiz scores over time",
                "Project progress across your build",
                "Mentor feedback written for you",
                "Skills, portfolio link and certificate status",
              ].map((line) => (
                <li key={line} className="flex gap-3 border-b border-border pb-4">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm text-muted-foreground">
              While the platform grows, the Polaris team keeps your dashboard updated after each session,
              assignment and review.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
