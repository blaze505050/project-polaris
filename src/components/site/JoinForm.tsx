import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const INTERESTS = [
  "Research",
  "Workshops",
  "Innovation projects",
  "Volunteering",
  "Content & design",
  "Mentorship",
];

export function JoinForm({ opportunitySlug }: { opportunitySlug?: string | undefined }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  function toggle(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const consent = fd.get("consent") === "on";

    if (name.length < 2 || name.length > 100) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (!consent) {
      toast.error("Please agree to be contacted so we can reply.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      full_name: name,
      email,
      role: opportunitySlug ?? "student",
      age_group: String(fd.get("education_level") ?? "").trim() || null,
      organisation: String(fd.get("institution") ?? "").trim() || null,
      location: String(fd.get("location") ?? "").trim() || null,
      interests,
      motivation:
        String(fd.get("motivation") ?? "")
          .trim()
          .slice(0, 2000) || null,
      consent: true,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset();
    setInterests([]);
    setDone(true);
    toast.success("Application received — we'll be in touch.");
  }

  if (done) {
    return (
      <div className="card-elevated p-8 text-center md:p-12">
        <h2 className="text-2xl">Thank you — we've got it.</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          We read every application ourselves. Expect an email from us soon with next steps and how
          to join the community.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setDone(false)}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-7 p-7 md:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">City</Label>
          <Input id="location" name="location" autoComplete="address-level2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education_level">Current level of study</Label>
          <Input
            id="education_level"
            name="education_level"
            placeholder="Class 11, 2nd year B.Tech…"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="institution">School / college</Label>
          <Input id="institution" name="institution" />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm">What are you interested in?</legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              aria-pressed={interests.includes(interest)}
              className={
                "font-ui rounded-full border px-4 py-2 text-xs transition-colors " +
                (interests.includes(interest)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-strong")
              }
            >
              {interest}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="motivation">Why do you want to join?</Label>
        <Textarea
          id="motivation"
          name="motivation"
          rows={5}
          placeholder="Tell us what you're curious about, or something you'd like to build."
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 rounded border-border accent-primary"
        />
        <span>
          I agree that Project Polaris may contact me by email about opportunities, and store the
          details I've shared here.
        </span>
      </label>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Submit application"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Joining the Polaris community is free. We only use your details to contact you about
        opportunities.
      </p>
    </form>
  );
}
