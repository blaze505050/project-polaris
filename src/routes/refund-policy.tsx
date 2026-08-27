import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShieldCheck, RefreshCcw, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Project Polaris" },
      {
        name: "description",
        content:
          "Clear refund guidelines, cohort cancellation timelines, and payment resolution procedures for Project Polaris workshops, sprints, and certifications.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

const POLICIES = [
  {
    title: "1. Free Open-Access Workshops & Masterclasses",
    content:
      "All open community masterclasses (including ISRO scientist sessions and live astronomy webinars) are 100% free of charge. No payment or refund processing applies to these sessions.",
  },
  {
    title: "2. Specialized Industry Sprints & Paid Cohorts",
    content:
      "For paid, hands-on engineering cohorts, industry sprint tracks, and verified hardware simulation programs, fees cover computational compute allocation, scientist mentorship hours, and verified credential generation. If you wish to cancel your enrollment, you may request a 100% refund up to 48 hours prior to the official cohort kickoff date.",
  },
  {
    title: "3. Cancellation After Cohort Kickoff",
    content:
      "Once a sprint squad has commenced, project computational resources have been provisioned, or scientist mentor panels have initiated 1-on-1 sprint reviews, cancellations are eligible for a prorated credit toward future Project Polaris cohorts rather than direct bank refunds.",
  },
  {
    title: "4. Session Rescheduling by Project Polaris",
    content:
      "If a live session or masterclass is rescheduled due to speaker availability or unforeseen technical issues, registered participants will receive automatic access to the rescheduled session, recorded archives, and the option for a full refund upon written request.",
  },
  {
    title: "5. Processing Timeline & Resolution",
    content:
      "Approved refunds are processed to the original payment source (UPI, Debit/Credit Card, or Netbanking) within 5 to 7 business days. If you experience unexpected delays, our finance support team will trace the bank reference ARN.",
  },
];

export function RefundPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Financial Governance"
        title="Refund & Cancellation Policy"
        lead="Transparent, fair, and student-first terms for cohort registrations, industry sprints, and workshops."
      />

      <section className="section font-sans">
        <div className="shell max-w-3xl mx-auto space-y-8">
          <ScrollReveal direction="up">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Student Protection Standard:</span> We are committed to an equitable educational experience. If you face genuine academic schedule conflicts or financial distress, reach out directly to our operations panel.
              </div>
            </div>

            <div className="mt-8 space-y-8 divide-y divide-white/8">
              {POLICIES.map((p, idx) => (
                <article key={p.title} className={idx > 0 ? "pt-8" : ""}>
                  <h2 className="text-lg font-bold font-display text-foreground">{p.title}</h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {p.content}
                  </p>
                </article>
              ))}
            </div>

            {/* Support Box */}
            <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-card space-y-4">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <HelpCircle className="size-4 text-primary" />
                <span>Need Assistance with a Transaction?</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If your payment was debited but registration was interrupted, or if you need to submit a cancellation request, send your transaction ID and registered email to our support team:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="sm" className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs">
                  <a href="mailto:projectpolaris.8@gmail.com?subject=Refund%20/%20Payment%20Inquiry" className="flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    <span>Email Support Desk</span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-9 px-4 border-white/10 text-xs text-foreground hover:border-white/20">
                  <Link to="/support">Visit Support Hub</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
