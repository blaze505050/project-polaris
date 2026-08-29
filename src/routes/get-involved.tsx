import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { saveUserSubmission } from "@/lib/cms-store";
import {
  Handshake,
  Users,
  Send,
  MessageCircle,
  Instagram,
  Linkedin,
  Mail,
  ExternalLink,
  CheckCircle,
  FileText,
  Building,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved & Partnerships — Project Polaris" },
      {
        name: "description",
        content:
          "Partner with Polaris as a school, institution, or mentor. Join our core team, apply to the volunteer program, or get in touch.",
      },
      { property: "og:title", content: "Get Involved & Partnerships — Project Polaris" },
      {
        property: "og:description",
        content:
          "Collaborate with Project Polaris to expand experiential aerospace and science learning.",
      },
      { property: "og:url", content: "https://projectpolaris.in/get-involved" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/get-involved" }],
  }),
  component: GetInvolvedPage,
});

function GetInvolvedPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    saveUserSubmission({
      type: "contact_inquiry",
      name: formData.name || "Inquirer",
      email: formData.email,
      programTitle: formData.subject || "General Inquiry",
      message: formData.message,
    });

    setFormSubmitted(true);
  };

  return (
    <>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/8">
        <div className="shell max-w-4xl space-y-4 font-sans text-left">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              Get Involved with Polaris
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Whether you are an institution looking to partner, an educator, or a student ready to join our engineering and volunteer cohorts.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. PARTNERSHIPS & JOIN TEAM TRACKS ── */}
      <section className="section border-b border-white/8 bg-surface-2/15" id="tracks">
        <div className="shell font-sans space-y-10">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Track 1: Partner With Us */}
            <ScrollReveal direction="up" delay={0}>
              <div className="p-7 md:p-8 rounded-2xl border border-primary/25 bg-card flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Building className="size-5" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">
                    Partner With Us
                  </h2>
                  <p className="text-xs text-primary font-medium">
                    For Schools, Institutions, Universities, Organizations & Mentors
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Collaborate to bring hands-on astronomy workshops, experiential science sessions, and practical project-based learning to your students.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/6">
                  <Button
                    asChild
                    size="default"
                    className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm active:scale-[0.97]"
                  >
                    <a href="https://tally.so/r/LZL56l" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5">
                      <span>Submit Partnership Inquiry ↗</span>
                    </a>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Track 2: Join Our Core Team */}
            <ScrollReveal direction="up" delay={40}>
              <div className="p-7 md:p-8 rounded-2xl border border-white/10 bg-card flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-surface-2 border border-white/8 flex items-center justify-center text-primary">
                    <Users className="size-5" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">
                    Join Our Core Team
                  </h2>
                  <p className="text-xs text-primary font-medium">
                    For Student Leaders, Researchers, Designers & Organizers
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Work directly with founders and core team members to build student initiatives, manage community programs, organize workshops, and lead regional outreach.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/6">
                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="w-full h-10 border-white/15 hover:border-white/25 text-foreground font-semibold rounded-lg text-xs active:scale-[0.97]"
                  >
                    <a href="https://tally.so/r/RGy8ad" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5">
                      <span>Apply to Core Team ↗</span>
                    </a>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Visual Showcase: Student Community in Action */}
          <ScrollReveal direction="clip" delay={60}>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 relative bg-card aspect-[21/9] flex items-end p-6">
              <img
                src="/media/students-building.jpg"
                alt="Students collaborating and building models together"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative z-10 max-w-xl">
                <div className="text-sm font-bold font-display text-foreground">Built by Students, for Students</div>
                <div className="text-xs text-muted-foreground mt-1">Connecting passionate builders, curious researchers, and leaders across India to learn by doing.</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. VOLUNTEER PROGRAM BY DEPARTMENT ── */}
      <section className="section border-b border-white/8" id="volunteers">
        <div className="shell font-sans space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Volunteer Departments
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your department and register via dedicated Google Forms.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                dept: "Operations",
                desc: "Session schedules, platform moderation, student certificates & event execution.",
                form: "https://forms.gle/ZXaxJH9k2ZUXVdYz6",
              },
              {
                dept: "Outreach",
                desc: "School connections, university astronomy clubs & regional tier-2/3 expansion.",
                form: "https://forms.gle/WoKGodwNCBp5wkcn8",
              },
              {
                dept: "Research",
                desc: "Projects, market research, scientific studies, problem exploration & technical analysis.",
                form: "https://forms.gle/SnMhq9gNDLWmNqCF7",
              },
              {
                dept: "Content & Design",
                desc: "Technical writing, social media explainers, graphic assets & article reviews.",
                form: "https://forms.gle/qUtQhWUNhmWtuSQu8",
              },
            ].map((d, i) => (
              <ScrollReveal key={d.dept} direction="up" delay={i * 30}>
                <div className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between h-full hover:border-white/16 transition-colors">
                  <div>
                    <h3 className="text-base font-bold font-display text-foreground">{d.dept}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{d.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/6">
                    <Button asChild size="sm" variant="ghost" className="h-7 px-0 text-xs font-medium text-primary hover:text-foreground active:scale-[0.97]">
                      <a href={d.form} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                        <span>Register for {d.dept} ↗</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="https://drive.google.com/file/d/1YxoWvwXBQvJQ9gewJyEYhez-C1NpLPph/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
            >
              <FileText className="size-3.5" />
              <span>Read Full Volunteer Program Description Document ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. INBUILT GENERAL INQUIRIES FORM ── */}
      <section className="section border-b border-white/8 bg-surface-2/15" id="contact-form">
        <div className="shell max-w-2xl mx-auto font-sans space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              General Inquiries & Contact
            </h2>
            <p className="text-xs text-muted-foreground">
              Send us a direct message and our team will get back to you within 24–48 hours.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-white/8 bg-card">
            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="size-10 text-primary mx-auto" />
                <h3 className="text-lg font-bold font-display text-foreground">Message Received</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thank you for reaching out to Project Polaris. Our team will review your inquiry and follow up shortly.
                </p>
                <Button onClick={() => setFormSubmitted(false)} variant="outline" size="sm" className="mt-2 text-xs">
                  Send Another Note
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-name" className="font-medium text-foreground">Your Name</label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      placeholder="e.g. Aditya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-email" className="font-medium text-foreground">Email Address</label>
                    <input
                      id="inquiry-email"
                      type="email"
                      required
                      placeholder="e.g. aditya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiry-subject" className="font-medium text-foreground">Subject / Context</label>
                  <input
                    id="inquiry-subject"
                    type="text"
                    required
                    placeholder="e.g. Workshop inquiry for DPS school students"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiry-message" className="font-medium text-foreground">Your Message</label>
                  <textarea
                    id="inquiry-message"
                    required
                    rows={4}
                    placeholder="Tell us what you'd like to explore, build, or collaborate on..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 text-xs resize-none"
                  />
                </div>

                <Button type="submit" size="default" className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs">
                  <span>Send Message</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. OUR SOCIALS ── */}
      <section className="section" id="socials">
        <div className="shell max-w-3xl mx-auto text-left font-sans space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Connect Across Official Channels
            </h2>
            <p className="text-xs text-muted-foreground">
              Follow real-time announcements, discussion channels, and publications.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {[
              {
                name: "WhatsApp Community",
                note: "Daily discussions & quizzes",
                url: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
                icon: MessageCircle,
              },
              {
                name: "WhatsApp Channel",
                note: "Broadcast updates & events",
                url: "https://whatsapp.com/channel/0029VbDrFjTDJ6H506hXDG2h",
                icon: Send,
              },
              {
                name: "Instagram",
                note: "@project_polaris_",
                url: "https://www.instagram.com/project_polaris_?igsi=MTM1cWxldXBlM2sybA==",
                icon: Instagram,
              },
              {
                name: "LinkedIn",
                note: "Company & institutional page",
                url: "https://www.linkedin.com/company/nova-next-gen-of-vision-and-astronomy/",
                icon: Linkedin,
              },
              {
                name: "Direct Email",
                note: "projectpolaris.8@gmail.com",
                url: "mailto:projectpolaris.8@gmail.com",
                icon: Mail,
              },
            ].map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl border border-white/8 bg-card flex items-center gap-3.5 hover:border-primary/40 hover:bg-surface-2 transition-colors text-left"
              >
                <div className="size-9 rounded-lg bg-surface-2 border border-white/8 flex items-center justify-center text-primary shrink-0">
                  <soc.icon className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-display text-foreground">{soc.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{soc.note}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
