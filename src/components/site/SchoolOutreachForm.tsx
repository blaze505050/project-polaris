import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PROGRAM_TYPES = [
  { value: "workshop", label: "One-off workshop" },
  { value: "series", label: "Workshop series" },
  { value: "space-camp", label: "Space camp" },
  { value: "club", label: "Set up a school club" },
  { value: "talk", label: "Assembly / expert talk" },
  { value: "other", label: "Something else" },
];

const MAX = { text: 200, message: 2000 } as const;

export function SchoolOutreachForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [programType, setProgramType] = useState("workshop");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const schoolName = get("school_name");
    const contactName = get("contact_name");
    const email = get("email");
    const message = get("message");
    const consent = fd.get("consent") === "on";
    const botTrap = get("polaris_school_trap");

    // Silent drop for automated bots
    if (botTrap) {
      setDone(true);
      return;
    }

    if (schoolName.length < 2 || schoolName.length > MAX.text) {
      toast.error("Please enter your school or organisation name.");
      return;
    }
    if (contactName.length < 2 || contactName.length > 120) {
      toast.error("Please enter a contact name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX.text) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (message.length > MAX.message) {
      toast.error("Please shorten your message a little.");
      return;
    }
    if (!consent) {
      toast.error("Please confirm we can contact you about this request.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("school_outreach_requests").insert({
      school_name: schoolName,
      contact_name: contactName,
      contact_role: get("contact_role").slice(0, 120) || null,
      email,
      phone: get("phone").slice(0, 40) || null,
      city: get("city").slice(0, 120) || null,
      student_count: get("student_count").slice(0, 60) || null,
      program_type: programType,
      preferred_timeline: get("preferred_timeline").slice(0, 120) || null,
      message: message || null,
      consent: true,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset();
    setProgramType("workshop");
    setDone(true);
    toast.success("Request received — we'll get back to you.");
  }

  if (done) {
    return (
      <div className="card-elevated p-8 text-center md:p-12">
        <h2 className="text-2xl">Thank you — request received.</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          A member of our outreach team will email you to understand what your students need and
          propose a format, date and cost (if any).
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setDone(false)}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-7 p-7 md:p-10">
      {/* Anti-spam Bot Honeypot */}
      <input
        type="text"
        name="polaris_school_trap"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="school_name">School / organisation *</Label>
          <Input id="school_name" name="school_name" required maxLength={MAX.text} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_name">Your name *</Label>
          <Input
            id="contact_name"
            name="contact_name"
            required
            maxLength={120}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_role">Your role</Label>
          <Input
            id="contact_role"
            name="contact_role"
            maxLength={120}
            placeholder="Teacher, principal, coordinator…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={MAX.text}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" maxLength={120} autoComplete="address-level2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student_count">Approx. number of students</Label>
          <Input
            id="student_count"
            name="student_count"
            maxLength={60}
            placeholder="40, 150, whole school…"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="preferred_timeline">Preferred timeline</Label>
          <Input
            id="preferred_timeline"
            name="preferred_timeline"
            maxLength={120}
            placeholder="Next month, this term, flexible…"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm">What are you looking for?</legend>
        <div className="flex flex-wrap gap-2">
          {PROGRAM_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setProgramType(type.value)}
              aria-pressed={programType === type.value}
              className={
                "font-ui rounded-full border px-4 py-2 text-xs transition-colors " +
                (programType === type.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-strong")
              }
            >
              {type.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="message">Anything else we should know?</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          maxLength={MAX.message}
          placeholder="Grades involved, topics your students care about, facilities you have…"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-[var(--color-primary)]"
        />
        <span>I confirm I can be contacted about this collaboration request.</span>
      </label>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Request a collaboration"}
      </Button>
      <p className="text-xs text-muted-foreground">
        We only use these details to plan and confirm your school session.
      </p>
    </form>
  );
}
