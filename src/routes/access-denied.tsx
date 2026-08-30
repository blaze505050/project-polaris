import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock, ArrowLeft, Home, UserCheck } from "lucide-react";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "403 — Access Denied | Project Polaris" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccessDeniedPage,
});

export function AccessDeniedPage() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-lg w-full text-center relative z-10 space-y-6">
        <div className="mx-auto size-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-lg">
          <ShieldAlert className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block">
            403 Security Protocol
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-foreground">
            Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            You do not have the required role or administrative clearance to access this sector.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-card text-left space-y-2.5 text-xs">
          <div className="font-bold text-foreground font-display flex items-center gap-2">
            <Lock className="size-4 text-amber-400" />
            <span>Sector Requirements</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            This module requires verified Admin CMS credentials or specific mentor privileges. If
            you are an authorized Polaris team member, please authenticate via the Admin Portal.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="default"
            className="h-10 px-6 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90"
          >
            <Link to="/dashboard" className="flex items-center gap-1.5">
              <UserCheck className="size-3.5" />
              <span>Go to Admin Login</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="h-10 px-5 border-white/10 text-xs text-foreground hover:border-white/20"
          >
            <Link to="/" className="flex items-center gap-1.5">
              <Home className="size-3.5 text-primary" />
              <span>Return Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
