import React from "react";
import studentsBuildingWebp from "@/assets/students-building.webp";
import studentsBuilding from "@/assets/students-building.jpg";
import polarisLogo from "@/assets/polaris-logo.png";

export function PolarisStarCenterpiece() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Main Card Frame */}
      <div className="relative rounded-2xl border border-white/10 bg-surface/90 p-5 shadow-lg overflow-hidden transition-colors hover:border-white/20">
        {/* Header Ribbon inside card */}
        <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <img
              src={polarisLogo}
              alt="Polaris Emblem"
              className="size-8 object-contain"
            />
            <div>
              <div className="text-xs font-bold text-foreground tracking-wide font-sans">
                PROJECT POLARIS
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Student Engineering Ecosystem
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono text-emerald-400 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Student-Led
          </span>
        </div>

        {/* Real Student Collaborative Photo */}
        <div className="relative z-10 rounded-xl overflow-hidden border border-white/10 shadow-sm">
          <picture>
            <source srcSet={studentsBuildingWebp} type="image/webp" />
            <img
              src={studentsBuilding}
              alt="Students collaborating and building projects at Project Polaris"
              className="w-full aspect-[16/10] object-cover"
            />
          </picture>

          {/* Overlay Tagline Badge */}
          <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-black/75 backdrop-blur-sm border border-white/10">
            <p className="text-xs text-slate-100 text-center font-medium font-sans leading-snug">
              "Learn by building, rather than building after learning."
            </p>
          </div>
        </div>

        {/* 3 Authentic Pillars Bar */}
        <div className="relative z-10 mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg border border-white/6 bg-surface-2/60">
            <div className="font-semibold text-xs text-foreground">Research</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Evidence & Solvers</div>
          </div>
          <div className="p-2.5 rounded-lg border border-white/6 bg-surface-2/60">
            <div className="font-semibold text-xs text-foreground">Content</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Aaj Ka Gyan Daily</div>
          </div>
          <div className="p-2.5 rounded-lg border border-white/6 bg-surface-2/60">
            <div className="font-semibold text-xs text-foreground">Operations</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Sprint Squads</div>
          </div>
        </div>
      </div>
    </div>
  );
}
