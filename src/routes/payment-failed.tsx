import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  Mail,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/payment-failed")({
  head: () => ({
    meta: [
      { title: "Payment Incomplete — Project Polaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaymentFailedPage,
});

export function PaymentFailedPage() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-rose-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-6">
        <div className="mx-auto size-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-lg">
          <AlertTriangle className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold block">
            Transaction Incomplete / Declined
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-foreground">
            Payment Could Not Be Processed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your recent transaction for Project Polaris was interrupted or rejected by the issuing
            bank/gateway. No enrollment charges have been confirmed.
          </p>
        </div>

        {/* Possible Causes Card */}
        <div className="p-5 rounded-2xl border border-white/10 bg-card text-left space-y-3 text-xs">
          <div className="font-bold text-foreground font-display flex items-center gap-2">
            <ShieldAlert className="size-4 text-rose-400" />
            <span>Common Causes & Troubleshooting:</span>
          </div>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>Bank OTP authentication timed out or was entered incorrectly.</li>
            <li>UPI app authorization request expired on your mobile device.</li>
            <li>Daily e-commerce or international transaction limits exceeded on card.</li>
            <li>Temporary gateway latency during banking server reconciliation.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="default"
            className="h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90"
          >
            <Link to="/programs" className="flex items-center gap-1.5">
              <RefreshCw className="size-3.5" />
              <span>Retry Registration / Payment</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="h-10 px-5 border-white/10 text-xs text-foreground hover:border-white/20"
          >
            <Link to="/support" className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" />
              <span>Contact Support Desk</span>
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-white/8 text-[11px] text-muted-foreground">
          If your bank account was debited, your bank will automatically reverse the hold within
          24–48 hours. If you need assistance, email{" "}
          <a href="mailto:projectpolaris.8@gmail.com" className="text-primary hover:underline">
            projectpolaris.8@gmail.com
          </a>
          .
        </div>
      </div>
    </div>
  );
}
