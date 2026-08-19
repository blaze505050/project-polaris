import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { SITE } from "@/lib/site";
import { Mail, Instagram, Linkedin, MessageCircle, HeartHandshake, UserPlus, Clock, Phone, FileText } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Project Polaris" },
      {
        name: "description",
        content:
          "Get in touch with Project Polaris about joining, mentoring, speaking, partnerships or anything else.",
      },
      { property: "og:title", content: "Contact — Project Polaris" },
      { property: "og:description", content: "Reach out to the Project Polaris team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        lead="Questions, ideas, collaborations or feedback — we read every single message."
      />
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="space-y-8">
            <div className="card-elevated p-6 space-y-4">
              <p className="eyebrow mb-2">Direct Contact Channels</p>
              <div className="space-y-3 font-mono text-sm">
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="size-4 text-primary shrink-0" />
                  <span>{SITE.phone}</span>
                </a>
                <a
                  href={`mailto:${SITE.emails[0]}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="size-4 text-primary shrink-0" />
                  <span>{SITE.emails[0]}</span>
                </a>
                <a
                  href={`mailto:${SITE.emails[1]}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="size-4 text-primary shrink-0" />
                  <span>{SITE.emails[1]}</span>
                </a>
              </div>
            </div>

            <div className="card-elevated p-6 space-y-4">
              <p className="eyebrow mb-2">Community & Socials</p>
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href={SITE.communityUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-primary hover:underline font-semibold"
                >
                  <MessageCircle className="size-4 shrink-0" />
                  <span>Join WhatsApp Community ↗</span>
                </a>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="size-4 text-primary shrink-0" />
                  <span>Follow on Instagram ↗</span>
                </a>
                <a
                  href={SITE.linkedinCompanyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="size-4 text-primary shrink-0" />
                  <span>Project Polaris LinkedIn Page ↗</span>
                </a>
              </div>
            </div>

            <div className="card-elevated p-6 space-y-4">
              <p className="eyebrow mb-2">Application Links</p>
              <div className="flex flex-col gap-2.5 text-sm font-semibold">
                <a
                  href={SITE.volunteerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <HeartHandshake className="size-4 shrink-0" />
                  <span>Volunteer Program Portal ↗</span>
                </a>
                <a
                  href={SITE.associateFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <UserPlus className="size-4 shrink-0" />
                  <span>Associate Application Form ↗</span>
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 flex items-start gap-3">
              <Clock className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-ui text-xs font-semibold text-foreground uppercase tracking-wider mb-1">Response time</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We are a student-led team — we review incoming messages daily and usually respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="card-elevated p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

