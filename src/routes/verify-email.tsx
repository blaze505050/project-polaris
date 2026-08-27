import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Your Email — Project Polaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VerifyEmailPage,
});

export function VerifyEmailPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(false);

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    // Auto-focus next input if filled
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 800);
  };

  const handleResend = () => {
    setResendStatus(true);
    setTimeout(() => setResendStatus(false), 4000);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {!verified ? (
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card shadow-2xl space-y-5 text-center">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <MailCheck className="size-7" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-display text-foreground">
                Verify Your Email
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We've sent a 6-digit confirmation code to your email. Enter it below to activate your student workspace credentials.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5 pt-2">
              <div className="flex justify-center gap-2">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    className="size-11 sm:size-12 rounded-xl bg-surface border border-white/10 text-center font-mono text-lg font-bold text-foreground focus:outline-none focus:border-primary/60"
                  />
                ))}
              </div>

              <Button
                type="submit"
                size="default"
                disabled={loading}
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90"
              >
                {loading ? "Verifying..." : "Confirm & Activate Account"}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              {resendStatus ? (
                <span className="text-emerald-400 font-medium">✓ New 6-digit verification code sent!</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="hover:text-foreground transition-colors"
                >
                  Didn't receive the email? <span className="text-primary hover:underline font-semibold">Resend Code</span>
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
                Your email is confirmed and your Polaris profile is active. You can now access AeroForge labs, session registrations, and certification records.
              </p>
            </div>

            <div className="pt-2">
              <Button asChild size="default" className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg text-xs">
                <Link to="/dashboard" className="flex items-center justify-center gap-1.5">
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
