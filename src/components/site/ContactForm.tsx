import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const botTrap = String(fd.get("polaris_company_trap") ?? "");

    // Silent rejection for automated bot submissions
    if (botTrap) {
      setDone(true);
      return;
    }

    if (name.length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (message.length < 10) {
      toast.error("Please add a little more detail.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        topic: String(fd.get("reason") ?? "").trim() || "General",
        message: [String(fd.get("organisation") ?? "").trim(), message].filter(Boolean).join(" — "),
      });
      if (error) {
        console.error("[Contact] DB insertion failed:", error);
        toast.error(
          "Unable to send message right now. Please try again or email projectpolaris.8@gmail.com directly.",
        );
        setSubmitting(false);
        return;
      }
    } catch (e) {
      console.error("[Contact] Supabase client error:", e);
      toast.error("Network error. Please verify your connection and try again.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);

    form.reset();
    setDone(true);
    toast.success("Message sent — thank you for reaching out!");
  }

  if (done) {
    return (
      <div className="card-elevated p-8 text-center animate-[fade-in-scale_400ms_ease-out]">
        <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          ✓
        </div>
        <h3 className="text-2xl font-display font-bold text-foreground">Message received.</h3>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground leading-relaxed text-sm">
          We read every message and will reply by email as soon as possible.
        </p>
        <Button
          variant="outline"
          className="mt-7 rounded-full hover:border-primary/50"
          onClick={() => setDone(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-6 p-7 md:p-9">
      {/* Anti-spam Bot Honeypot */}
      <input
        type="text"
        name="polaris_company_trap"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-name">Name *</Label>
          <Input id="c-name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">Email *</Label>
          <Input id="c-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-org">Organisation</Label>
          <Input id="c-org" name="organisation" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-reason">Reason for contact</Label>
          <Input id="c-reason" name="reason" placeholder="Mentoring, partnership, speaking…" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-message">Message *</Label>
        <Textarea id="c-message" name="message" rows={5} required />
      </div>
      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
