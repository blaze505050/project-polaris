import { useState } from "react";
import { TEAM_CONSTELLATION_MEMBERS, type TeamMemberNode } from "@/lib/cms-store";
import { UserCheck, Sparkles, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function TeamConstellation() {
  const [selectedId, setSelectedId] = useState<string>(
    TEAM_CONSTELLATION_MEMBERS[0]?.id || "engineering-lead",
  );

  const selectedMember =
    TEAM_CONSTELLATION_MEMBERS.find((m) => m.id === selectedId) || TEAM_CONSTELLATION_MEMBERS[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Team Member Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM_CONSTELLATION_MEMBERS.map((member) => {
          const isSelected = selectedId === member.id;
          return (
            <div
              key={member.id}
              onClick={() => setSelectedId(member.id)}
              className={cn(
                "p-5 rounded-xl border bg-card cursor-pointer transition-all flex flex-col justify-between h-full",
                isSelected
                  ? "border-primary/50 shadow-[0_0_24px_rgba(197,157,255,0.12)] bg-surface-2/60"
                  : "border-white/8 hover:border-white/20",
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full border border-primary/30 bg-surface-2 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-xs text-primary font-medium">{member.role}</p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-muted-foreground">
                  {member.department}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{member.intro}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="italic text-foreground/80 font-sans line-clamp-1">
                  "{member.whatIBring}"
                </span>
                <UserCheck className="size-3.5 text-emerald-400 shrink-0 ml-2" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Focus Detail for Selected Member */}
      {selectedMember && (
        <div className="p-6 md:p-7 rounded-2xl border border-white/10 bg-surface-2/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full border border-primary/40 bg-card flex items-center justify-center text-base font-bold text-primary shrink-0">
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  {selectedMember.name}
                </h3>
                <p className="text-xs text-primary font-medium">
                  {selectedMember.role} · {selectedMember.department}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <UserCheck className="size-3.5" />
              <span>Core Contributor</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-card border border-white/6 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block font-mono">
                Role & Focus
              </span>
              <p className="text-muted-foreground leading-relaxed font-sans">
                {selectedMember.intro}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-white/6 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-primary tracking-wider block font-mono">
                Contribution to Polaris
              </span>
              <p className="text-foreground/90 leading-relaxed font-sans font-medium">
                "{selectedMember.whatIBring}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
