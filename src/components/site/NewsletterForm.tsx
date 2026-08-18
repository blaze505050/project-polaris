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
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: value.toLowerCase(), source: source.slice(0, 50) });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setDone(true);
        toast.success("You're already on the list.");
        return;
      }
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setEmail("");
    setDone(true);
    toast.success("Subscribed — see you in your inbox.");
  }

  if (done) {
    return (
      <p className="font-ui text-sm text-muted-foreground">
        Thanks — you're on the Polaris list.
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
        className="font-ui h-11"
      />
      <Button type="submit" disabled={submitting} className="h-11 shrink-0">
        {submitting ? "…" : "Subscribe"}
      </Button>
    </form>
  );
}
