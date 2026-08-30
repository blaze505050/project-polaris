import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveUserSubmission } from "@/lib/cms-store";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Cpu,
  Award,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help & Support Hub — Project Polaris" },
      {
        name: "description",
        content:
          "Find answers to frequently asked questions regarding Project Polaris masterclasses, industry sprints, AeroForge simulator, and technical certifications.",
      },
    ],
  }),
  component: SupportPage,
});

const FAQS = [
  {
    q: "How do I join the upcoming 29th August Astronomy Workshop?",
    a: "You can register directly via the registration form on the Home or Programs page. The workshop is free and live streaming access links are shared with registered participants via email and the WhatsApp community.",
  },
  {
    q: "What is AeroForge AI and how do I run numerical simulations?",
    a: "AeroForge is our open-source aerospace computational lab suite featuring 40+ physics engines, CFD solvers, and orbital trajectory simulators. You can launch it directly from the Projects page without installing any local software.",
  },
  {
    q: "How do Industry Sprints work and how are credits awarded?",
    a: "Industry Sprints are 4-to-8 week remote engineering sprints where student squads tackle real aerospace, astrophysics, and CSE engineering challenges mentored by scientists. Verified certificates and technical badges are awarded upon peer-reviewed code submission.",
  },
  {
    q: "How can my school or college institute launch a Polaris Chapter?",
    a: "Head to the Chapters page or Get Involved page and submit an institutional partnership inquiry. Our outreach team will connect with your faculty advisors to set up student chapter charters.",
  },
  {
    q: "Who can I contact if I face technical issues with my registration?",
    a: "You can submit the support inquiry form below or email projectpolaris.8@gmail.com. Our student support desk typically responds within 24 hours.",
  },
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General Support");
  const [message, setMessage] = useState("");

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error("Please fill in your email and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim() || "Student / Partner",
        email: email.trim(),
        topic: `Support: ${category}`,
        message: message.trim(),
      });

      if (error) {
        console.error("[Support] Ticket submission error:", error);
        toast.error(
          "Unable to submit support ticket. Please try again or email projectpolaris.8@gmail.com directly.",
        );
        setSubmitting(false);
        return;
      }

      saveUserSubmission({
        type: "contact_inquiry",
        name: name || "Student / Partner",
        email,
        programTitle: `Support Ticket: ${category}`,
        message,
      });

      setSubmitted(true);
      toast.success("Support ticket submitted — we'll reply by email within 24h.");
    } catch (err) {
      console.error("[Support] Network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Help & Resources"
        title="Support & Knowledge Hub"
        lead="Got questions about workshops, industry sprints, or simulations? We're here to help you navigate."
      />

      <section className="section font-sans">
        <div className="shell max-w-4xl mx-auto space-y-12">
          {/* Support Channels Quick Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-all block group space-y-2"
            >
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="size-5" />
              </div>
              <h3 className="font-bold text-foreground font-display text-sm">Community Support</h3>
              <p className="text-xs text-muted-foreground">
                Get real-time answers from student leads and peers on WhatsApp.
              </p>
            </a>

            <a
              href="mailto:projectpolaris.8@gmail.com"
              className="p-5 rounded-2xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-all block group space-y-2"
            >
              <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="size-5" />
              </div>
              <h3 className="font-bold text-foreground font-display text-sm">Email Helpdesk</h3>
              <p className="text-xs text-muted-foreground">
                projectpolaris.8@gmail.com for institutional and registration inquiries.
              </p>
            </a>

            <Link
              to="/programs"
              className="p-5 rounded-2xl border border-white/8 bg-card hover:border-primary/40 hover:bg-surface-2 transition-all block group space-y-2"
            >
              <div className="size-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="size-5" />
              </div>
              <h3 className="font-bold text-foreground font-display text-sm">Sprint Tracks</h3>
              <p className="text-xs text-muted-foreground">
                Explore available project tracks, mentorship schedules, and credits.
              </p>
            </Link>
          </div>

          {/* Categorized FAQs */}
          <div className="space-y-6">
            <div className="border-b border-white/8 pb-4">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-bold font-display text-foreground">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-white/8 bg-card overflow-hidden transition-colors hover:border-white/16"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm font-display text-foreground"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/6 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit a Support Request Form */}
          <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-card space-y-5">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold block mb-1">
                Submit a Query
              </span>
              <h3 className="text-xl font-bold font-display text-foreground">
                Direct Helpdesk Ticket
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Leave your query and our team will follow up via email within 24 hours.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-muted-foreground font-medium">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Aditya Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-muted-foreground font-medium">Your Email</label>
                    <Input
                      type="email"
                      placeholder="aditya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-surface text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-muted-foreground font-medium">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/50"
                  >
                    <option value="General Support">General Platform Support</option>
                    <option value="Workshop Registration">Workshop / Session Registration</option>
                    <option value="AeroForge Lab">AeroForge Simulation Sandbox</option>
                    <option value="Industry Sprint Squad">Industry Sprint Application</option>
                    <option value="Chapter Partnership">Chapter & Institutional Outreach</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-muted-foreground font-medium">
                    Message / Problem Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue or question in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs resize-none focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  size="default"
                  className="h-10 px-6 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90"
                >
                  <Send className="size-3.5 mr-1.5" />
                  {submitting ? "Submitting Ticket…" : "Submit Support Ticket"}
                </Button>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="size-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-foreground font-display text-base">
                  Support Ticket Received!
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thank you,{" "}
                  <span className="font-semibold text-foreground">{name || "Explorer"}</span>. Our
                  operations desk has logged your request and will reach out to{" "}
                  <span className="font-semibold text-foreground">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="text-xs text-primary font-semibold hover:underline pt-2 inline-block"
                >
                  Submit another ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
