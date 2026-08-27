import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Move,
  ArrowRight,
  ExternalLink,
  Calendar,
  Cpu,
  Layers,
  Users,
  Compass,
  BookOpen,
  Award,
  MessageCircle,
  CheckCircle,
  Activity,
  Zap,
  Globe,
  Radio,
} from "lucide-react";
import polarisLogo from "@/assets/polaris-logo.png";

export interface BrainSector {
  id: string;
  name: string;
  category: string;
  lobeRole: string; // The cognitive function in the Polaris Digital Brain
  lat: number;
  lon: number;
  icon: any;
  status: string;
  headline: string;
  description: string;
  telemetry: string;
  activeDetails: string[];
  ctaLabel: string;
  ctaUrl: string;
  isExternal?: boolean;
}

export const POLARIS_BRAIN_SECTORS: BrainSector[] = [
  {
    id: "hub-aeroforge",
    name: "Computational Engine (AeroForge AI)",
    category: "Physics Simulation Core",
    lobeRole: "Analytical & Simulation Cortex",
    lat: 15,
    lon: 45,
    icon: Cpu,
    status: "Active • 40+ Numerical Solvers",
    telemetry: "40+ CFD, FEA, Keplerian physics solvers running live in browser",
    headline: "Democratizing High-End Aerospace & Numerical Physics",
    description:
      "The computational core of Polaris. Instead of abstract textbook formulas, students simulate compressible transonic aerodynamics, orbital satellite maneuvers, and structural finite element stress directly in their browsers.",
    activeDetails: [
      "Navier-Stokes Euler compressible aerodynamic mesh solvers",
      "Runge-Kutta 4th order orbital trajectory & Lagrange point stationkeeping",
      "Interactive WebGL 2.0 pressure, Mach shock, and von Mises stress contours",
    ],
    ctaLabel: "Launch AeroForge Lab →",
    ctaUrl: "/projects#aeroforge-lab",
  },
  {
    id: "hub-masterclasses",
    name: "Scientist & Masterclass Network",
    category: "Expert Knowledge Transfer",
    lobeRole: "Direct Mentorship Cortex",
    lat: 38,
    lon: -40,
    icon: Calendar,
    status: "Active • 29 August Masterclass",
    telemetry: "100+ session participants, ISRO scientists & astrophysics mentors",
    headline: "Direct Dialogue with Scientists & Practicing Engineers",
    description:
      "The knowledge-acquisition lobe. Connecting curious students directly with ISRO scientists, missile engineers, and astrophysicists through interactive masterclasses, live Q&As, and practical activities.",
    activeDetails: [
      "Upcoming: 'Exploring the Star Universe' with Scientist Baldev Krishan Sharma",
      "Past Sessions with ISRO Scientist Ankit Gupta & Missile Man Prakhar Vishwakarma",
      "Verified participation certificates and direct Q&A interactive format",
    ],
    ctaLabel: "Register for 29th Aug Masterclass (Free) →",
    ctaUrl: "https://forms.gle/EaZUGjUd7spcQfoF7",
    isExternal: true,
  },
  {
    id: "hub-sprints",
    name: "Collaborative Industry Sprints",
    category: "Experiential Squads",
    lobeRole: "Collaborative Build Cortex",
    lat: -25,
    lon: 10,
    icon: Layers,
    status: "Open for Squads (4 Domains)",
    telemetry: "Remote squads solving authentic industry briefs with code reviews",
    headline: "Solve Authentic Industry Problem Specs in Remote Squads",
    description:
      "The collaborative execution lobe. Remote squads (2–4 students) tackle industry-standard problem statements across Aero, Astro, CSE, and Systems Engineering with weekly mentor code reviews and co-author credits.",
    activeDetails: [
      "4 Tracks: Transonic CFD, PINNs AI, Exoplanet Photometry, CubeSat FEA",
      "Weekly 1-on-1 and squad technical critique from aerospace researchers",
      "Verified digital portfolio credentials and public repository recognition",
    ],
    ctaLabel: "Explore Sprint Squads →",
    ctaUrl: "/programs",
  },
  {
    id: "hub-volunteers",
    name: "Student Leadership & Volunteer Corps",
    category: "Ecosystem Operations",
    lobeRole: "Operational Nervous System",
    lat: 48,
    lon: 110,
    icon: Users,
    status: "28+ Core Contributors",
    telemetry: "Student-led operations, outreach, research, and content pipelines",
    headline: "Built by Students, for Students",
    description:
      "The driving nervous system of Polaris. Our active student volunteer corps coordinates scientist sessions, moderates community cohorts, writes open educational resources, and leads national outreach.",
    activeDetails: [
      "4 Specialized Tracks: Operations, Outreach, Research, and Content",
      "Direct collaboration with founding team on real strategic initiatives",
      "Verified leadership recommendations and executive experience",
    ],
    ctaLabel: "Apply to Volunteer Corps →",
    ctaUrl: "/get-involved#volunteers",
  },
  {
    id: "hub-chapters",
    name: "Regional Chapters Network",
    category: "Geographic Expansion",
    lobeRole: "Decentralized Regional Cortex",
    lat: -40,
    lon: 85,
    icon: Compass,
    status: "Launching Soon (Tier-2/3 Cities)",
    telemetry: "Bringing astronomy toolkits and build sprints to regional hubs",
    headline: "Reaching Tier 2, 3 Cities & Remote Regions",
    description:
      "The spatial distribution lobe. Establishing student-led space and physics chapters at schools and universities in Tier-2/3 cities, providing observation kits, workshop curricula, and regional build sprints.",
    activeDetails: [
      "Official institutional chapter kits and observation tools",
      "Telescopic night sky observation events and CFD workshops",
      "Connecting regional students into national research sprints",
    ],
    ctaLabel: "Register Chapter Lead Interest →",
    ctaUrl: "/chapters",
  },
  {
    id: "hub-publications",
    name: "Research Commons & Articles Portal",
    category: "Open Knowledge",
    lobeRole: "Memory & Publication Cortex",
    lat: -10,
    lon: -110,
    icon: BookOpen,
    status: "Weekly Drops • Open Submissions",
    telemetry: "Curated research explainers, Aaj Ka Gyan drops, and student papers",
    headline: "Explore. Learn. Share.",
    description:
      "The shared memory lobe. A repository of student-written technical explainers, computational notebooks, research hypotheses, and weekly curated science dispatch drops.",
    activeDetails: [
      "Curated categories: Science, Technology, Research, Student Perspectives",
      "Weekly curated newsletter dispatch on innovations & competitions",
      "Open student submission portal with editorial reviews via Tally",
    ],
    ctaLabel: "Read Articles & Submit →",
    ctaUrl: "/articles",
  },
  {
    id: "hub-spotlight",
    name: "Merit Spotlight & Recognition",
    category: "Verified Proof-of-Work",
    lobeRole: "Recognition & Reward Cortex",
    lat: 25,
    lon: -140,
    icon: Award,
    status: "Editorial Recognition",
    telemetry: "Noticing the students who go out and build with what they learn",
    headline: "Recognising the People & Ideas Moving Polaris Forward",
    description:
      "The recognition lobe. Polaris selectively highlights standout student projects, breakthrough simulation models, competition winners, and top community contributors with editorial profiles.",
    activeDetails: [
      "Editorial features on student breakthroughs and open-source simulators",
      "Verified badges linked to portfolio proof-of-work",
      "Recognising impact, curiosity, and tangible building",
    ],
    ctaLabel: "Explore Polaris Spotlight →",
    ctaUrl: "/spotlight",
  },
  {
    id: "hub-community",
    name: "Synaptic Community Network",
    category: "Peer Connection",
    lobeRole: "Collective Synapse",
    lat: -45,
    lon: -40,
    icon: MessageCircle,
    status: "230+ Active Explorers",
    telemetry: "Daily 'Aaj Ka Gyan' drops, astrophysics quizzes, and peer collabs",
    headline: "More Than a Community. An Environment to Explore.",
    description:
      "The real-time peer synapse. Connect directly with curious students, participate in daily astrophysics quizzes, receive 'Aaj Ka Gyan' knowledge drops, and debate space missions.",
    activeDetails: [
      "Daily 'Aaj Ka Gyan' aerospace knowledge drops",
      "Weekly astrophysical quizzes and interactive challenges",
      "Instant updates on live sessions, build sprints, and opportunities",
    ],
    ctaLabel: "Join WhatsApp Community →",
    ctaUrl: "https://chat.whatsapp.com/FdbxPikc9aGLxiHu0gWqIX",
    isExternal: true,
  },
];

interface PulseParticle {
  hubIndex: number;
  progress: number;
  speed: number;
}

export function PolarisEcosystemGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedSector, setSelectedSector] = useState<BrainSector>(POLARIS_BRAIN_SECTORS[0]);
  const [hoveredSector, setHoveredSector] = useState<BrainSector | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<"brain" | "flowchart">("brain");

  // 3D Globe Rotation Angles (in radians)
  const rotationRef = useRef({ rotX: 0.25, rotY: -0.4 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  // Synaptic electric pulses traveling between Polaris Core and Sector nodes
  const pulsesRef = useRef<PulseParticle[]>([
    { hubIndex: 0, progress: 0.1, speed: 0.012 },
    { hubIndex: 1, progress: 0.4, speed: 0.015 },
    { hubIndex: 2, progress: 0.7, speed: 0.011 },
    { hubIndex: 3, progress: 0.2, speed: 0.014 },
    { hubIndex: 4, progress: 0.5, speed: 0.013 },
    { hubIndex: 5, progress: 0.8, speed: 0.016 },
    { hubIndex: 6, progress: 0.3, speed: 0.012 },
    { hubIndex: 7, progress: 0.6, speed: 0.014 },
  ]);

  const focusSector = (sector: BrainSector) => {
    setSelectedSector(sector);
    autoRotateRef.current = false;
    const targetRotY = -((sector.lon * Math.PI) / 180) - Math.PI / 2;
    const targetRotX = ((sector.lat * Math.PI) / 180) * 0.5;

    rotationRef.current = {
      rotX: targetRotX,
      rotY: targetRotY,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Auto-rotation when idle
      if (autoRotateRef.current) {
        rotationRef.current.rotY += 0.0025;
      }

      const { rotX, rotY } = rotationRef.current;

      // ── 3D Projection Math ──
      const project3D = (latDeg: number, lonDeg: number, r: number) => {
        const phi = (latDeg * Math.PI) / 180;
        const theta = (lonDeg * Math.PI) / 180;

        let x = r * Math.cos(phi) * Math.sin(theta);
        let y = -r * Math.sin(phi);
        let z = r * Math.cos(phi) * Math.cos(theta);

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = 1 + z2 / (r * 3.5);
        return {
          px: centerX + x1 * scale,
          py: centerY + y2 * scale,
          pz: z2,
          visible: z2 > -r * 0.3,
        };
      };

      // 1. Atmosphere Neural Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.4);
      glowGrad.addColorStop(0, "rgba(165, 180, 252, 0.08)");
      glowGrad.addColorStop(0.6, "rgba(165, 180, 252, 0.02)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Neural Sphere Lattice Rings
      ctx.strokeStyle = "rgba(165, 180, 252, 0.05)";
      ctx.lineWidth = 1;

      [-50, -25, 0, 25, 50].forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 12) {
          const pt = project3D(lat, lon, radius);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.px, pt.py);
              first = false;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      [-120, -60, 0, 60, 120].forEach((lon) => {
        ctx.beginPath();
        let first = true;
        for (let lat = -75; lat <= 75; lat += 10) {
          const pt = project3D(lat, lon, radius);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.px, pt.py);
              first = false;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      // 3. Synaptic Particle Cloud (Neural Dust)
      for (let lat = -65; lat <= 65; lat += 25) {
        for (let lon = -160; lon <= 160; lon += 30) {
          const pt = project3D(lat, lon, radius);
          if (pt.visible && pt.pz > 0) {
            const alpha = Math.max(0.04, (pt.pz / radius) * 0.25);
            ctx.fillStyle = `rgba(165, 180, 252, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Draw Inter-Synaptic Connection Lines & Animated Electrical Pulses
      POLARIS_BRAIN_SECTORS.forEach((hub, idx) => {
        const pt = project3D(hub.lat, hub.lon, radius);
        const isSelected = selectedSector.id === hub.id;
        const isHovered = hoveredSector?.id === hub.id;

        if (pt.visible) {
          // Neural Synapse Filament Line to Polaris Brain Core
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(pt.px, pt.py);
          if (isSelected || isHovered) {
            ctx.strokeStyle = "rgba(165, 180, 252, 0.85)";
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = "rgba(165, 180, 252, 0.15)";
            ctx.lineWidth = 1;
          }
          ctx.stroke();

          // Sector Star Node
          const nodeRadius = isSelected ? 8.5 : isHovered ? 7.5 : 5.5;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? "#a5b4fc" : "#0f1117";
          ctx.fill();
          ctx.strokeStyle = isSelected ? "#ffffff" : "rgba(165, 180, 252, 0.7)";
          ctx.lineWidth = isSelected ? 2.5 : 1;
          ctx.stroke();

          // Pulsing Synaptic Ring around selected node
          if (isSelected || isHovered) {
            const pulseRadius = nodeRadius + 4 + Math.sin(time * 3) * 3;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(165, 180, 252, 0.4)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          // Node Label
          ctx.font = `${isSelected ? "bold 11px" : "10px"} Inter, sans-serif`;
          ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.75)";
          ctx.textAlign = "center";
          ctx.fillText(hub.name.split(" ")[0], pt.px, pt.py + (isSelected ? 20 : 16));
        }
      });

      // 5. Draw Animated Neural Pulse Packets Traveling Along Synapses
      pulsesRef.current.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const hub = POLARIS_BRAIN_SECTORS[pulse.hubIndex];
        const pt = project3D(hub.lat, hub.lon, radius);

        if (pt.visible) {
          const pulseX = centerX + (pt.px - centerX) * pulse.progress;
          const pulseY = centerY + (pt.py - centerY) * pulse.progress;

          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#a5b4fc";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 6. Central Polaris Brain Core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0b0e";
      ctx.fill();
      ctx.strokeStyle = "rgba(165, 180, 252, 0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const coreGlow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 28);
      coreGlow.addColorStop(0, "rgba(165, 180, 252, 0.4)");
      coreGlow.addColorStop(1, "rgba(165, 180, 252, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedSector, hoveredSector]);

  // Drag Event Handlers for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.rotY += deltaX * 0.008;
    rotationRef.current.rotX = Math.max(-0.8, Math.min(0.8, rotationRef.current.rotX + deltaY * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="rounded-2xl border border-primary/25 bg-surface/70 backdrop-blur-2xl overflow-hidden font-sans space-y-6 p-6 md:p-8 relative shadow-2xl">
      {/* ── 1. DIGITAL BRAIN HUD / TELEMETRY STATUS BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-semibold">
            <Radio className="size-3.5 text-emerald-400 animate-pulse" />
            <span>Digital Brain of Project Polaris</span>
            <span className="text-white/20">|</span>
            <span className="text-muted-foreground">Neural Ecosystem Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground leading-tight">
            The Polaris Brain: Complete Ecosystem at a Glance
          </h2>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Polaris is not a fragmented collection of courses — it is an interconnected digital brain built to turn curiosity into verifiable, real-world engineering impact.
          </p>
        </div>

        {/* Live Telemetry Pill */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/8 text-muted-foreground">
            <Activity className="size-3 text-primary" />
            <span>Telemetry: <strong className="text-emerald-400">8 Sectors Firing</strong></span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/8 text-muted-foreground">
            <Move className="size-3 text-primary" />
            <span>Drag to Rotate 3D Brain</span>
          </div>
        </div>
      </div>

      {/* ── 2. SECTOR FILTER BUTTONS ── */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {POLARIS_BRAIN_SECTORS.map((sector) => {
          const isSelected = selectedSector.id === sector.id;
          const Icon = sector.icon;
          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => focusSector(sector)}
              onMouseEnter={() => setHoveredSector(sector)}
              onMouseLeave={() => setHoveredSector(null)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-[0_0_15px_rgba(165,180,252,0.3)]"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8 hover:border-white/20"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{sector.name.split("(")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. MAIN 3D BRAIN CANVAS & COGNITIVE SECTOR INSPECTOR ── */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] items-center min-h-[480px]">
        {/* Left: 3D Neural Sphere Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative size-full min-h-[380px] sm:min-h-[460px] rounded-xl bg-card border border-white/8 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        >
          <canvas ref={canvasRef} className="size-full absolute inset-0 pointer-events-none" />

          {/* Central Polaris Star Core Logo Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
            <img src={polarisLogo} alt="Polaris Neural Core" className="size-6 mx-auto object-contain" />
          </div>

          {/* Subtle Canvas Watermark */}
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground/60 pointer-events-none">
            3D Neural Projection Core • Drag with Mouse / Touch
          </div>
        </div>

        {/* Right: Dynamic Cognitive Sector Inspector Panel */}
        <div className="p-6 md:p-7 rounded-xl border border-primary/30 bg-card space-y-5 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold text-[10px] uppercase font-mono">
                {selectedSector.lobeRole}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedSector.status}</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <selectedSector.icon className="size-4" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">
                  {selectedSector.name}
                </h3>
              </div>
              <p className="text-xs text-primary font-medium font-display">
                "{selectedSector.headline}"
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedSector.description}
            </p>

            {/* Telemetry Metric Box */}
            <div className="p-3 rounded-lg bg-surface-2 border border-white/6 text-xs text-foreground/90 font-mono flex items-center gap-2">
              <Zap className="size-3.5 text-primary shrink-0" />
              <span>{selectedSector.telemetry}</span>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block font-mono">
                Active Operations in this Sector
              </span>
              <ul className="space-y-1.5 text-xs text-foreground/90 font-medium">
                {selectedSector.activeDetails.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/6 flex items-center justify-between gap-3">
            {selectedSector.isExternal ? (
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
              >
                <a href={selectedSector.ctaUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5">
                  <span>{selectedSector.ctaLabel}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            ) : (
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
              >
                <Link to={selectedSector.ctaUrl} className="flex items-center justify-center gap-1.5">
                  <span>{selectedSector.ctaLabel}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
