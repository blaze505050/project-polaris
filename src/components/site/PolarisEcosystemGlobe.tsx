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
} from "lucide-react";
import polarisLogo from "@/assets/polaris-logo.png";

export interface EcosystemHub {
  id: string;
  name: string;
  category: string;
  lat: number; // degrees -90 to 90
  lon: number; // degrees -180 to 180
  icon: any;
  status: string;
  headline: string;
  description: string;
  activeDetails: string[];
  ctaLabel: string;
  ctaUrl: string;
  isExternal?: boolean;
}

export const ECOSYSTEM_HUBS: EcosystemHub[] = [
  {
    id: "hub-masterclasses",
    name: "Live Masterclasses Hub",
    category: "Expert Workshops",
    lat: 35,
    lon: -40,
    icon: Calendar,
    status: "Active • 29 August 2026",
    headline: "Exploring the Star Universe: A Journey into Astronomy",
    description:
      "Interactive live masterclasses hosted by scientists and researchers. Deep-dive into cosmos physics, ISRO careers, rocket development, and astronomy.",
    activeDetails: [
      "Speaker: Scientist Baldev Krishan Sharma (Cosmo-scientist)",
      "Interactive Q&A and practical astronomy activity",
      "Free verified participation certificate for all attendees",
    ],
    ctaLabel: "Register for 29th Aug Workshop →",
    ctaUrl: "https://forms.gle/EaZUGjUd7spcQfoF7",
    isExternal: true,
  },
  {
    id: "hub-aeroforge",
    name: "AeroForge AI Simulation Lab",
    category: "Computational Workstation",
    lat: 15,
    lon: 45,
    icon: Cpu,
    status: "Production • 40+ Solvers",
    headline: "Browser-Based Numerical Aerospace Simulation",
    description:
      "Our open-source physics laboratory. Practice transonic CFD airfoil aerodynamics, Keplerian orbital mechanics, and structural FEA directly in your browser without supercomputing clusters.",
    activeDetails: [
      "Euler & Navier-Stokes compressible flow grid solvers",
      "4th-Order Runge-Kutta orbital trajectory integrators",
      "Interactive WebGL 2.0 pressure and stress contour mapping",
    ],
    ctaLabel: "Launch AeroForge Lab →",
    ctaUrl: "/projects#aeroforge-lab",
  },
  {
    id: "hub-sprints",
    name: "Remote Industry Project Sprints",
    category: "Collaborative Engineering",
    lat: -25,
    lon: 10,
    icon: Layers,
    status: "Open for Squads",
    headline: "Collaborate Remotely on Industry-Standard Problem Briefs",
    description:
      "Work in remote squads (2–4 explorers) on real engineering briefs across Aero, Astro, CSE & Systems. Get reviewed weekly by aerospace scientists and earn verified portfolio credits.",
    activeDetails: [
      "4 Domains: Aero CFD, PINNs, Exoplanet Photometry, CubeSat FEA",
      "Weekly 1-on-1 and squad technical code/physics reviews",
      "Verified digital credentials and co-author paper credits",
    ],
    ctaLabel: "Explore Sprint Squads →",
    ctaUrl: "/programs",
  },
  {
    id: "hub-volunteers",
    name: "Student Volunteer Corps",
    category: "Student Leadership",
    lat: 48,
    lon: 110,
    icon: Users,
    status: "28+ Active Contributors",
    headline: "Built by Students, for Students",
    description:
      "Join our student leadership corps across Operations, Outreach, Research, and Content. Gain hands-on leadership, coordinate scientist sessions, and build open resources.",
    activeDetails: [
      "4 Specialized Tracks: Operations, Outreach, Research, Content",
      "Direct collaboration with core engineering and outreach leads",
      "Official leadership certificates and recommendations",
    ],
    ctaLabel: "Apply to Volunteer Corps →",
    ctaUrl: "/get-involved#volunteers",
  },
  {
    id: "hub-chapters",
    name: "Polaris Chapters Network",
    category: "Regional Expansion",
    lat: -40,
    lon: 85,
    icon: Compass,
    status: "Launching Soon",
    headline: "Reaching Tier 2, 3 Cities & Remote Regions",
    description:
      "Democratizing space science and engineering education across school and university student chapters in regional cities with observation toolkits and build kits.",
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
    name: "Publications & Articles Portal",
    category: "Knowledge & Research",
    lat: -10,
    lon: -110,
    icon: BookOpen,
    status: "Open Submissions",
    headline: "Explore. Learn. Share.",
    description:
      "A platform for original scientific explainers, research notebooks, and student perspectives. Weekly newsletter drops delivered straight to your WhatsApp.",
    activeDetails: [
      "Curated categories: Science, Technology, Research, Perspectives",
      "Weekly curated newsletter dispatch on innovations & competitions",
      "Open student submission portal with editorial reviews",
    ],
    ctaLabel: "Read Articles & Newsletter →",
    ctaUrl: "/articles",
  },
  {
    id: "hub-spotlight",
    name: "Polaris Spotlight",
    category: "Editorial Recognition",
    lat: 25,
    lon: -140,
    icon: Award,
    status: "Monthly Recognition",
    headline: "Recognising the People & Ideas Moving Polaris Forward",
    description:
      "Editorial recognition for exceptional student projects, breakthrough simulation models, competition winners, and top community contributors.",
    activeDetails: [
      "Editorial spotlights with full project journeys and technical specs",
      "Features for standout simulation builders and student researchers",
      "Verified badges linked to portfolio proof-of-work",
    ],
    ctaLabel: "Explore Polaris Spotlight →",
    ctaUrl: "/spotlight",
  },
  {
    id: "hub-community",
    name: "Community & Daily Knowledge Drops",
    category: "Explorer Network",
    lat: -45,
    lon: -40,
    icon: MessageCircle,
    status: "230+ Active Explorers",
    headline: "More Than a Community. An Environment to Explore.",
    description:
      "Connect directly with curious students, participate in daily astrophysics quizzes, receive 'Aaj Ka Gyan' knowledge drops, and discuss space missions.",
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

export function PolarisEcosystemGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedHub, setSelectedHub] = useState<EcosystemHub>(ECOSYSTEM_HUBS[0]);
  const [hoveredHub, setHoveredHub] = useState<EcosystemHub | null>(null);

  // 3D Globe Rotation Angles (in radians)
  const rotationRef = useRef({ rotX: 0.25, rotY: -0.4 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  // Focus on a specific hub on the globe
  const focusHub = (hub: EcosystemHub) => {
    setSelectedHub(hub);
    autoRotateRef.current = false;
    // Calculate target rotation angles to bring this hub to the front facing camera
    const targetRotY = -((hub.lon * Math.PI) / 180) - Math.PI / 2;
    const targetRotX = ((hub.lat * Math.PI) / 180) * 0.5;

    // Smooth tween
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

      // Auto-rotation when not interacting
      if (autoRotateRef.current) {
        rotationRef.current.rotY += 0.003;
      }

      const { rotX, rotY } = rotationRef.current;

      // ── Helper 3D Projection ──
      const project3D = (latDeg: number, lonDeg: number, r: number) => {
        const phi = (latDeg * Math.PI) / 180;
        const theta = (lonDeg * Math.PI) / 180;

        // Spherical to 3D Cartesian
        let x = r * Math.cos(phi) * Math.sin(theta);
        let y = -r * Math.sin(phi);
        let z = r * Math.cos(phi) * Math.cos(theta);

        // Rotate Y (longitude)
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate X (latitude/tilt)
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective scale factor
        const scale = 1 + z2 / (r * 3.5);
        return {
          px: centerX + x1 * scale,
          py: centerY + y2 * scale,
          pz: z2,
          visible: z2 > -r * 0.25, // Front facing
        };
      };

      // 1. Draw outer ambient atmosphere glow
      const atmGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.35);
      atmGrad.addColorStop(0, "rgba(165, 180, 252, 0.08)");
      atmGrad.addColorStop(0.5, "rgba(165, 180, 252, 0.02)");
      atmGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = atmGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Sphere Latitude & Longitude Wireframe Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;

      // Latitude Rings
      [-60, -30, 0, 30, 60].forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 10) {
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

      // Longitude Meridians
      [-150, -100, -50, 0, 50, 100, 150].forEach((lon) => {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 8) {
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

      // 3. Draw Celestial Dotted Surface Stars
      for (let lat = -70; lat <= 70; lat += 20) {
        for (let lon = -170; lon <= 170; lon += 25) {
          const pt = project3D(lat, lon, radius);
          if (pt.visible && pt.pz > 0) {
            const alpha = Math.max(0.05, (pt.pz / radius) * 0.3);
            ctx.fillStyle = `rgba(165, 180, 252, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Draw Central Polaris North Star Core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0b0e";
      ctx.fill();
      ctx.strokeStyle = "rgba(165, 180, 252, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 5. Draw Connection Beams & Active Hub Nodes
      ECOSYSTEM_HUBS.forEach((hub) => {
        const pt = project3D(hub.lat, hub.lon, radius);
        const isSelected = selectedHub.id === hub.id;
        const isHovered = hoveredHub?.id === hub.id;

        if (pt.visible) {
          // Connection beam to Polaris Center
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(pt.px, pt.py);
          if (isSelected || isHovered) {
            ctx.strokeStyle = "rgba(165, 180, 252, 0.7)";
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = "rgba(165, 180, 252, 0.12)";
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();

          // Hub Node Star
          const nodeRadius = isSelected ? 8 : isHovered ? 7 : 5.5;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? "#a5b4fc" : "#111318";
          ctx.fill();
          ctx.strokeStyle = isSelected ? "#ffffff" : "rgba(165, 180, 252, 0.6)";
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.stroke();

          // Pulsing Halo on Selected Node
          if (isSelected || isHovered) {
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, nodeRadius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(165, 180, 252, 0.35)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Node Label
          ctx.font = `${isSelected ? "bold 11px" : "10px"} Inter, sans-serif`;
          ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.7)";
          ctx.textAlign = "center";
          ctx.fillText(hub.name.split(" ")[0], pt.px, pt.py + (isSelected ? 18 : 16));
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedHub, hoveredHub]);

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
    <div className="rounded-2xl border border-white/8 bg-surface/50 backdrop-blur-xl overflow-hidden font-sans space-y-6 p-6 md:p-8">
      {/* ── Header & Topic Navigation Filter Pills ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-semibold mb-1">
            <Sparkles className="size-3.5" />
            <span>Interactive Celestial Navigator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            The Polaris Ecosystem Globe
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click any initiative node or drag the 3D globe to inspect everything happening in our universe.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-surface-2 px-3 py-1.5 rounded-full border border-white/8">
          <Move className="size-3 text-primary animate-pulse" />
          <span>Drag 3D Globe to Rotate</span>
        </div>
      </div>

      {/* Hub Filter Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {ECOSYSTEM_HUBS.map((hub) => {
          const isSelected = selectedHub.id === hub.id;
          const Icon = hub.icon;
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => focusHub(hub)}
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8 hover:border-white/20"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{hub.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Canvas & Inspector Area ── */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] items-center min-h-[460px]">
        {/* Left: 3D Interactive Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative size-full min-h-[380px] sm:min-h-[440px] rounded-xl bg-card border border-white/6 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        >
          <canvas ref={canvasRef} className="size-full absolute inset-0 pointer-events-none" />

          {/* Central Polaris Star Badge Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
            <img src={polarisLogo} alt="Polaris Center" className="size-6 mx-auto object-contain" />
          </div>
        </div>

        {/* Right: Dynamic Hub Inspector Card */}
        <div className="p-6 md:p-7 rounded-xl border border-primary/20 bg-card space-y-5 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold text-[10px] uppercase font-mono">
                {selectedHub.category}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedHub.status}</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <selectedHub.icon className="size-4" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">
                  {selectedHub.name}
                </h3>
              </div>
              <p className="text-xs text-primary font-medium font-display">
                "{selectedHub.headline}"
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedHub.description}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block font-mono">
                What's Happening in this Sector
              </span>
              <ul className="space-y-1.5 text-xs text-foreground/90 font-medium">
                {selectedHub.activeDetails.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/6 flex items-center justify-between gap-3">
            {selectedHub.isExternal ? (
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
              >
                <a href={selectedHub.ctaUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5">
                  <span>{selectedHub.ctaLabel}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            ) : (
              <Button
                asChild
                size="default"
                className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 text-xs shadow-sm"
              >
                <Link to={selectedHub.ctaUrl} className="flex items-center justify-center gap-1.5">
                  <span>{selectedHub.ctaLabel}</span>
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
