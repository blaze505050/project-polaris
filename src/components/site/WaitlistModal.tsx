import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveUserSubmission } from "@/lib/cms-store";
import { Sparkles, CheckCircle2, Bell, X } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  programCategory?: string;
}

export function WaitlistModal({
  isOpen,
  onClose,
  programTitle,
  programCategory = "Polaris Initiative",
}: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("applications").insert({
        full_name: name.trim() || "Explorer",
        email: email.trim(),
        role: `Waitlist: ${programTitle}`.slice(0, 100),
        motivation:
          interest.trim().slice(0, 1000) || `Priority waitlist registration for ${programTitle}`,
        consent: true,
      });

      if (error) {
        console.error("[Waitlist] Submission error:", error);
        toast.error(
          "Unable to join waitlist. Please try again or email projectpolaris.8@gmail.com.",
        );
        setSubmitting(false);
        return;
      }

      saveUserSubmission({
        type: "waitlist",
        name: name || "Explorer",
        email,
        programTitle,
        message: interest || `Priority waitlist registration for ${programTitle}`,
      });

      setSubmitted(true);
      toast.success("You're on the priority waitlist!");
    } catch (err) {
      console.error("[Waitlist] Client error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setInterest("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-md rounded-2xl border border-primary/25 bg-card p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <X className="size-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-foreground">
                You're on the Priority List!
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thank you, <strong>{name || "Explorer"}</strong>. We've recorded your interest for{" "}
                <strong>{programTitle}</strong>. You'll receive early access and cohort briefing
                directly at <strong>{email}</strong> before public release.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleReset}
              className="w-full h-9 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary uppercase font-semibold mb-1">
                <Bell className="size-3.5" />
                <span>Priority Early Access</span>
              </div>
              <h3 className="text-xl font-bold font-display text-foreground">
                Join Waitlist for {programTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Get notified first when registration and cohort applications open.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Your Full Name</label>
                <Input
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs bg-surface border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs bg-surface border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  What are you most excited to build/learn?
                </label>
                <Input
                  placeholder="e.g. Aerodynamics simulations, organizing a college chapter, etc."
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="h-9 text-xs bg-surface border-white/10"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/6 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
              >
                <span>{submitting ? "Joining Waitlist…" : "Notify Me on Launch →"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
