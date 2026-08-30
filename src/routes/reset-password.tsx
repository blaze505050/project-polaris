import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Mail, CheckCircle2, ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Workspace Password — Project Polaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

export function ResetPasswordPage() {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }
    setError("");
    setStep("verify");
  };

  const handleVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      setError("Please enter the recovery verification code sent to your email.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setStep("success");
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {step === "request" && (
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card shadow-2xl space-y-5">
            <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <KeyRound className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold font-display text-foreground">Reset Password</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter the email address associated with your Polaris workspace or admin account to
                receive recovery instructions.
              </p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-4 text-xs pt-2">
              <div className="space-y-1.5 text-left">
                <label className="text-muted-foreground font-medium">Registered Email</label>
                <div className="relative">
                  <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-surface text-xs"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-rose-400 text-xs">{error}</p>}

              <Button
                type="submit"
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90"
              >
                Send Recovery Code
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              <Link
                to="/dashboard"
                className="text-primary hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="size-3" />
                <span>Return to Portal Login</span>
              </Link>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card shadow-2xl space-y-5">
            <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <Lock className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Enter Verification Code
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-foreground">{email}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifyAndReset} className="space-y-3.5 text-xs pt-2">
              <div className="space-y-1 text-left">
                <label className="text-muted-foreground font-medium">Verification Code</label>
                <Input
                  type="text"
                  placeholder="e.g. 784920"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-surface text-center tracking-widest font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-muted-foreground font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-surface text-xs"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-muted-foreground font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-surface text-xs"
                  required
                />
              </div>

              {error && <p className="text-rose-400 text-xs">{error}</p>}

              <Button
                type="submit"
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 mt-2"
              >
                Update Password & Secure Account
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep("request")}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Change Email
              </button>
              <button
                type="button"
                onClick={() => alert("A new recovery code has been re-dispatched.")}
                className="text-primary hover:underline"
              >
                Resend Code
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-6 md:p-8 rounded-2xl border border-emerald-500/25 bg-card shadow-2xl space-y-5 text-center">
            <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Password Successfully Reset
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your workspace credentials have been updated securely. You may now log in to the
                Student Dashboard or Admin CMS.
              </p>
            </div>

            <div className="pt-2">
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs"
              >
                <Link to="/dashboard">Go to Student Dashboard →</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
