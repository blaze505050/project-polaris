import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Wrench, Clock, Activity, MessageCircle, RefreshCw, Send } from "lucide-react";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "System Maintenance — Project Polaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MaintenancePage,
});

export function MaintenancePage() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-6">
        <div className="mx-auto size-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-lg animate-pulse">
          <Wrench className="size-8 text-primary" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold block">
            Scheduled Platform Upgrade
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            System Upgrades in Progress
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            We are deploying numerical solver updates and infrastructure enhancements to the Project Polaris ecosystem. All systems will be back online shortly.
          </p>
        </div>

        {/* Live Systems Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-left">
          <div className="p-4 rounded-xl bg-card border border-white/8 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px] uppercase">AeroForge Solvers</span>
              <span className="size-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="font-bold text-foreground">Upgrading</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-white/8 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px] uppercase">Masterclass CDN</span>
              <span className="size-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-bold text-foreground">Operational</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-white/8 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px] uppercase">Estimated Uptime</span>
              <Clock className="size-3 text-primary" />
            </div>
            <div className="font-bold text-foreground">~15 Minutes</div>
          </div>
        </div>

        {/* Community Announcements */}
        <div className="p-5 rounded-2xl border border-white/10 bg-surface-2/40 text-left space-y-2 text-xs">
          <div className="font-bold text-foreground font-display flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <span>Need Urgent Access or Live Workshop Inquiries?</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Live broadcasts and upcoming workshops remain unaffected. Check real-time announcements in our student community channel.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="default" className="h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90">
            <a href="https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
              <MessageCircle className="size-3.5" />
              <span>Join WhatsApp Updates ↗</span>
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => window.location.reload()}
            className="h-10 px-5 border-white/10 text-xs text-foreground hover:border-white/20 flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5 text-primary" />
            <span>Check Platform Status</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
