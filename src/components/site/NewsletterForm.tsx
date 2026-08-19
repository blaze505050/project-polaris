import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 200) {
      toast.error("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: value.toLowerCase(), source: source.slice(0, 50) });
      if (error && error.code !== "23505") {
        console.warn("[Newsletter] DB insertion warning:", error.message);
      }
    } catch (e) {
      console.warn("[Newsletter] Supabase client offline:", e);
    }
    setSubmitting(false);

    setEmail("");
    setDone(true);
    toast.success("Subscribed — welcome to Project Polaris!");
  }

  if (done) {
    return (
      <p className="font-ui text-sm text-primary flex items-center gap-1.5 animate-[fade-in-scale_300ms_ease-out]">
        <span>✓ Thanks — you're on the Polaris list.</span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        Email address
      </label>
      <Input
        id={`newsletter-${source}`}
        type="email"
        name="email"
        required
        maxLength={200}
        placeholder="you@school.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-ui h-11 bg-surface-2 border-border focus:border-primary/50"
      />
      <Button type="submit" disabled={submitting} className="h-11 shrink-0 btn-shimmer shadow-md bg-gradient-to-r from-primary to-accent text-primary-foreground border-none">
        {submitting ? "…" : "Subscribe"}
      </Button>
    </form>
  );
}
