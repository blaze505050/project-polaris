import { useState, useEffect } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify Your Email — Project Polaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VerifyEmailPage,
});

export function VerifyEmailPage() {
  const search = useSearch({ from: "/verify-email" });
  const [email, setEmail] = useState(search.email || "");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If user arrived via confirmation link with an active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setVerified(true);
      }
    });
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    setErrorMessage("");

    // Auto-focus next input if filled
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = digits.join("").trim();
    if (token.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please provide a valid registered email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "signup",
      });

      if (error) {
        // Also try email_change or recovery in case of different OTP flow
        const fallback = await supabase.auth.verifyOtp({
          email: email.trim(),
          token,
          type: "email",
        });

        if (fallback.error) {
          setErrorMessage(error.message || "Invalid or expired verification code.");
          setLoading(false);
          return;
        }
      }

      setVerified(true);
    } catch {
      setErrorMessage("Failed to verify code. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter your registered email address first.");
      return;
    }

    setResendLoading(true);
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setResendStatus("✓ Verification code resent to your email.");
        setTimeout(() => setResendStatus(""), 5000);
      }
    } catch {
      setErrorMessage("Unable to resend code right now. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {!verified ? (
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-2xl space-y-5 text-center">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <MailCheck className="size-7" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-display text-foreground">Verify Your Email</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your confirmation code to activate your Project Polaris workspace.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center gap-2 text-left">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4 pt-2 text-left">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Registered Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="h-10 text-xs bg-surface border-border"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  6-Digit OTP Code
                </label>
                <div className="flex justify-center gap-2">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      className="size-11 sm:size-12 rounded-xl bg-surface border border-border text-center font-mono text-lg font-bold text-foreground focus:outline-none focus:border-primary/60"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="default"
                disabled={loading}
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 mt-2"
              >
                {loading ? "Verifying..." : "Confirm & Activate Account"}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              {resendStatus ? (
                <span className="text-emerald-400 font-medium">{resendStatus}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="hover:text-foreground transition-colors"
                >
                  Didn't receive the email?{" "}
                  <span className="text-primary hover:underline font-semibold">
                    {resendLoading ? "Resending..." : "Resend Code"}
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 rounded-2xl border border-emerald-500/25 bg-card shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Email Successfully Verified!
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your email is confirmed and your Polaris profile is active. You can now access
                AeroForge labs, session registrations, and certification records.
              </p>
            </div>

            <div className="pt-2">
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs"
              >
                <Link to="/portal" className="flex items-center justify-center gap-1.5">
                  <span>Enter Student Workspace</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
