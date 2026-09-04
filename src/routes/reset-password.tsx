import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Mail, CheckCircle2, ArrowLeft, Lock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    // Check if arrived via recovery link
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setHasRecoverySession(true);
        setStep("verify");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setHasRecoverySession(true);
        setStep("verify");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid registered email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setStep("verify");
    } catch {
      setError("Unable to process password reset request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // If code was entered manually and not yet signed in via recovery session
      if (code && !hasRecoverySession && email) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: code.trim(),
          type: "recovery",
        });

        if (otpError) {
          setError(otpError.message || "Invalid or expired recovery code.");
          setLoading(false);
          return;
        }
      }

      // Update password with Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setStep("success");
    } catch {
      setError("Failed to update password. Please check your recovery session.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setResendStatus("✓ New recovery code sent to your email.");
      setTimeout(() => setResendStatus(""), 4000);
    } catch {
      setError("Could not resend recovery code.");
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {step === "request" && (
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-2xl space-y-5">
            <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <KeyRound className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold font-display text-foreground">Reset Password</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your registered email to receive password recovery instructions.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                    className="pl-9 bg-surface text-xs border-border"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="default"
                disabled={loading}
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90"
              >
                {loading ? "Sending Instructions..." : "Send Recovery Code"}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              <Link
                to="/auth"
                className="text-primary hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="size-3" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-2xl space-y-5">
            <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <Lock className="size-6" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold font-display text-foreground">Set New Password</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {hasRecoverySession
                  ? "Your recovery session is verified. Enter your new password below."
                  : `Enter the recovery code sent to ${email || "your email"} and choose a new password.`}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAndReset} className="space-y-3.5 text-xs pt-2">
              {!hasRecoverySession && (
                <div className="space-y-1 text-left">
                  <label className="text-muted-foreground font-medium">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="e.g. 784920"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-surface text-center tracking-widest font-mono text-sm border-border"
                    required
                  />
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-muted-foreground font-medium">
                  New Password (min. 8 characters)
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-surface text-xs border-border"
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
                  className="bg-surface text-xs border-border"
                  required
                />
              </div>

              <Button
                type="submit"
                size="default"
                disabled={loading}
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 mt-2"
              >
                {loading ? "Updating Password..." : "Update Password & Secure Account"}
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
              {email && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary hover:underline"
                >
                  {resendStatus || "Resend Code"}
                </button>
              )}
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
                Student Workspace.
              </p>
            </div>

            <div className="pt-2">
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs"
              >
                <Link to="/auth">Sign In to Workspace →</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
