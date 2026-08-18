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
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      topic: String(fd.get("reason") ?? "").trim() || "General",
      message: [String(fd.get("organisation") ?? "").trim(), message].filter(Boolean).join(" — "),
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset();
    setDone(true);
    toast.success("Message sent — thank you.");
  }

  if (done) {
    return (
      <div className="card-elevated p-8 text-center">
        <h3 className="text-2xl">Message received.</h3>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
          We'll reply by email as soon as we can.
        </p>
        <Button variant="outline" className="mt-7" onClick={() => setDone(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-6 p-7 md:p-9">
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
