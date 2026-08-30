import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SITE } from "@/lib/site";
import {
  Mail,
  Instagram,
  Linkedin,
  MessageCircle,
  HeartHandshake,
  UserPlus,
  Clock,
  Phone,
  FileText,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Inquiries — Project Polaris" },
      {
        name: "description",
        content:
          "Get in touch with the Project Polaris team about joining, school collaborations, masterclasses, mentorship, or technical partnerships.",
      },
      { property: "og:title", content: "Contact & Inquiries — Project Polaris" },
      {
        property: "og:description",
        content: "Reach out to Project Polaris. We read and respond to every message.",
      },
    ],
  }),
  component: Contact,
});

const CONTACT_FAQS = [
  {
    q: "How can my school or institution collaborate with Project Polaris?",
    a: "We offer experiential astronomy kits, telescope observation workshops, and interactive physics modules for middle and high schools. You can submit an outreach inquiry or email us directly.",
  },
  {
    q: "Can I join a project build squad if I'm just getting started?",
    a: "Yes! Polaris is built for learners of all skill levels. We place members into sprint squads where you learn by contributing to real simulation and research workflows.",
  },
  {
    q: "How can domain experts or scientists host a masterclass?",
    a: "We regularly host ISRO scientists, university researchers, and propulsion engineers. Send us a message via the form below with your proposed topic.",
  },
];

function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Direct Line"
        title="Get in touch with Project Polaris."
        lead="Questions, school collaborations, research pitches, or mentorship opportunities — we read and respond to every message."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left Column: Direct Channels & Socials */}
          <div className="space-y-6">
            <ScrollReveal direction="up">
              <div className="card-premium p-6 space-y-4 border-primary/25 bg-surface-2/40">
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block">
                  Direct Communications
                </span>
                <div className="space-y-3 font-mono text-xs sm:text-sm">
                  <a
                    href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg bg-surface hover:bg-surface-3"
                  >
                    <Phone className="size-4 text-gold shrink-0" />
                    <span>{SITE.phone}</span>
                  </a>
                  <a
                    href={`mailto:${SITE.emails[0]}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg bg-surface hover:bg-surface-3"
                  >
                    <Mail className="size-4 text-primary shrink-0" />
                    <span>{SITE.emails[0]}</span>
                  </a>
                  <a
                    href={`mailto:${SITE.emails[1]}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg bg-surface hover:bg-surface-3"
                  >
                    <Mail className="size-4 text-primary shrink-0" />
                    <span>{SITE.emails[1]}</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="card-premium p-6 space-y-4 border-border">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold block">
                  Community & Social Channels
                </span>
                <div className="flex flex-col gap-2.5 text-xs font-mono">
                  <a
                    href={SITE.communityUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between p-2.5 rounded-lg bg-surface text-primary hover:bg-surface-3 transition-colors border border-primary/20 font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="size-4 text-emerald-400" />
                      <span>WhatsApp Community</span>
                    </span>
                    <span className="text-[11px] text-gold">Join 120+ Builders ↗</span>
                  </a>
                  <a
                    href={SITE.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 p-2 rounded-lg bg-surface text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="size-4 text-primary shrink-0" />
                    <span>Instagram (@project_polaris_) ↗</span>
                  </a>
                  <a
                    href={SITE.linkedinCompanyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 p-2 rounded-lg bg-surface text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="size-4 text-primary shrink-0" />
                    <span>LinkedIn Organization Page ↗</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={140}>
              <div className="rounded-xl border border-border bg-surface-2/60 p-5 flex items-start gap-3.5">
                <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                    Response SLA
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed font-body">
                    We are a student-led engineering collective — incoming messages are reviewed
                    daily, with typical replies within 24 to 48 hours.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick FAQs */}
            <ScrollReveal direction="up" delay={200}>
              <div className="card-premium p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
                  <HelpCircle className="size-4 text-gold" />
                  <span>Frequent Questions</span>
                </div>
                <div className="divide-y divide-border pt-1">
                  {CONTACT_FAQS.map((faq, idx) => (
                    <div key={faq.q} className="py-2.5">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left text-xs font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`size-3.5 text-muted-foreground transition-transform ${
                            openFaq === idx ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>
                      {openFaq === idx && (
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-body">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Contact Message Form */}
          <ScrollReveal direction="up" delay={80}>
            <div className="card-premium p-6 sm:p-10 border-primary/30 bg-surface/90 backdrop-blur-xl shadow-2xl relative">
              <div className="mb-6 border-b border-border pb-4">
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-semibold block mb-1">
                  Direct Dispatch
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                  Send Us a Transmission
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-body">
                  Fill out the form below. Messages are dispatched directly to the core coordination
                  team.
                </p>
              </div>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
