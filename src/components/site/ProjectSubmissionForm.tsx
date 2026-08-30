import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SHOWCASE_CATEGORIES, SHOWCASE_STAGES } from "@/lib/showcase";

export function ProjectSubmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [category, setCategory] = useState("hardware");
  const [stage, setStage] = useState("in_progress");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const title = get("title");
    const summary = get("summary");
    const email = get("contact_email");
    const link = get("link");
    const consent = fd.get("consent") === "on";
    const botTrap = get("polaris_project_trap");

    // Silent drop for automated spam bots
    if (botTrap) {
      setDone(true);
      return;
    }

    if (title.length < 3 || title.length > 200) {
      toast.error("Please give your project a title.");
      return;
    }
    if (summary.length < 20 || summary.length > 1000) {
      toast.error("Please write a short summary (at least 20 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      toast.error("Please enter a valid contact email.");
      return;
    }
    if (link && !/^https?:\/\/\S+$/i.test(link)) {
      toast.error("Links must start with http:// or https://");
      return;
    }
    if (!consent) {
      toast.error("Please confirm we may publish this project if selected.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("project_submissions").insert({
      title,
      category,
      stage,
      summary,
      description: get("description").slice(0, 5000) || null,
      team: get("team").slice(0, 300) || null,
      contact_email: email,
      link: link.slice(0, 500) || null,
      consent: true,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset();
    setCategory("hardware");
    setStage("in_progress");
    setDone(true);
    toast.success("Project submitted — thanks for sharing it.");
  }

  if (done) {
    return (
      <div className="card-elevated p-8 text-center md:p-12">
        <h2 className="text-2xl">Submitted — we'll take a look.</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Every submission is reviewed by a student team before it appears in the showcase. We'll
          email you either way.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setDone(false)}>
          Submit another project
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-7 p-7 md:p-10">
      {/* Anti-spam Bot Honeypot */}
      <input
        type="text"
        name="polaris_project_trap"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Project title *</Label>
          <Input id="title" name="title" required maxLength={200} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">Who built it?</Label>
          <Input id="team" name="team" maxLength={300} placeholder="Names, school or team" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact email *</Label>
          <Input id="contact_email" name="contact_email" type="email" required maxLength={200} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="link">Link (repo, doc, video)</Label>
          <Input id="link" name="link" type="url" maxLength={500} placeholder="https://" />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm">Category</legend>
        <div className="flex flex-wrap gap-2">
          {SHOWCASE_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              aria-pressed={category === c.value}
              className={
                "font-ui rounded-full border px-4 py-2 text-xs transition-colors " +
                (category === c.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-strong")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm">Stage</legend>
        <div className="flex flex-wrap gap-2">
          {SHOWCASE_STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStage(s.value)}
              aria-pressed={stage === s.value}
              className={
                "font-ui rounded-full border px-4 py-2 text-xs transition-colors " +
                (stage === s.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-strong")
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="summary">One-line summary *</Label>
        <Textarea id="summary" name="summary" rows={2} required maxLength={1000} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Tell us more</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          maxLength={5000}
          placeholder="What problem does it solve, how did you build it, what's next?"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-[var(--color-primary)]"
        />
        <span>I confirm this is our own work and Polaris may publish it in the showcase.</span>
      </label>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Submit project"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Submissions are reviewed before publication. Your email is never shown publicly.
      </p>
    </form>
  );
}
