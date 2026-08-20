import React from "react";
import studentsBuildingWebp from "@/assets/students-building.webp";
import studentsBuilding from "@/assets/students-building.jpg";
import polarisLogo from "@/assets/polaris-logo.png";

export function PolarisStarCenterpiece() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent rounded-3xl blur-3xl opacity-50 pointer-events-none" />

      {/* Main Card Frame */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-950/75 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20">
        {/* Subtle Blueprint grid texture */}
        <div className="blueprint-grid absolute inset-0 opacity-30 pointer-events-none" />

        {/* Header Ribbon inside card */}
        <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={polarisLogo}
              alt="Polaris Emblem"
              className="size-8 rounded-full border border-accent/40 shadow-sm"
            />
            <div>
              <div className="text-xs font-serif font-bold text-foreground tracking-wide">
                PROJECT POLARIS
              </div>
              <div className="text-[10px] font-sans text-accent tracking-wider uppercase font-semibold">
                Experiential Learning Ecosystem
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-[10px] font-sans font-semibold text-accent">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            100% Student-Led
          </span>
        </div>

        {/* Real Student Collaborative Photo */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
          <picture>
            <source srcSet={studentsBuildingWebp} type="image/webp" />
            <img
              src={studentsBuilding}
              alt="Students collaborating and building projects at Project Polaris"
              className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </picture>
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Overlay Tagline Badge */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
            <p className="font-serif italic text-xs sm:text-sm text-slate-100 text-center leading-snug">
              "Learn by building, rather than building after learning."
            </p>
          </div>
        </div>

        {/* 3 Authentic Pillars Bar */}
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-2.5 pt-2 text-center font-sans text-xs">
          <div className="p-2.5 rounded-xl border border-white/5 bg-surface/60 hover:bg-surface/90 transition-colors">
            <div className="font-serif font-bold text-sm sm:text-base text-accent">Research</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Evidence & Tools</div>
          </div>
          <div className="p-2.5 rounded-xl border border-white/5 bg-surface/60 hover:bg-surface/90 transition-colors">
            <div className="font-serif font-bold text-sm sm:text-base text-primary">Content</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Aaj Ka Gyan Daily</div>
          </div>
          <div className="p-2.5 rounded-xl border border-white/5 bg-surface/60 hover:bg-surface/90 transition-colors">
            <div className="font-serif font-bold text-sm sm:text-base text-emerald-400">Operations</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Community & Cohorts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
