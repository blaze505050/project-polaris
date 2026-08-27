import { useEffect, useRef, useState } from "react";
import { TEAM_CONSTELLATION_MEMBERS, type TeamMemberNode } from "@/lib/cms-store";
import { NorthStar } from "./NorthStar";
import { Sparkles, Move, UserCheck, X } from "lucide-react";
import polarisLogo from "@/assets/polaris-logo.png";

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

export function TeamConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMemberNode | null>(TEAM_CONSTELLATION_MEMBERS[0]);
  const [hoveredMember, setHoveredMember] = useState<TeamMemberNode | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  // Store calculated animated positions
  const nodePositions = useRef<Map<string, NodePosition>>(new Map());

  // Initialize node positions
  useEffect(() => {
    TEAM_CONSTELLATION_MEMBERS.forEach((m) => {
      const angle = m.orbitAngle;
      const x = Math.cos(angle) * m.orbitRadius;
      const y = Math.sin(angle) * m.orbitRadius;
      nodePositions.current.set(m.id, {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        baseX: x,
        baseY: y,
      });
    });
  }, []);

  // Canvas drawing & animation loop
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
      const centerX = width / 2 + offsetRef.current.x;
      const centerY = height / 2 + offsetRef.current.y;

      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      // 1. Draw central gravitational orbit rings (subtle hairline)
      [130, 180, 230].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(165, 180, 252, 0.04)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 2. Calculate current positions with orbital drift
      const positions: { member: TeamMemberNode; x: number; y: number }[] = [];

      TEAM_CONSTELLATION_MEMBERS.forEach((member) => {
        const currentAngle = member.orbitAngle + time * member.speed * 8;
        const radiusDrift = member.orbitRadius + Math.sin(time + member.orbitRadius) * 4;
        const x = centerX + Math.cos(currentAngle) * radiusDrift;
        const y = centerY + Math.sin(currentAngle) * radiusDrift;
        positions.push({ member, x, y });
      });

      // 3. Draw Constellation lines between nodes and to Polaris center
      positions.forEach(({ member, x, y }) => {
        const isSelected = selectedMember?.id === member.id || hoveredMember?.id === member.id;
        const isOtherSelected = (selectedMember || hoveredMember) && !isSelected;

        // Line to Central Polaris Star
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        if (isSelected) {
          ctx.strokeStyle = "rgba(165, 180, 252, 0.6)";
          ctx.lineWidth = 1.5;
        } else if (isOtherSelected) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
          ctx.lineWidth = 0.8;
        } else {
          ctx.strokeStyle = "rgba(165, 180, 252, 0.15)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // Inter-connecting constellation links between neighboring members
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const p1 = positions[i];
          const p2 = positions[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 4. Central Polaris Star Node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0b0e";
      ctx.fill();
      ctx.strokeStyle = "rgba(165, 180, 252, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Subtle glow around center
      const gradient = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 30);
      gradient.addColorStop(0, "rgba(165, 180, 252, 0.3)");
      gradient.addColorStop(1, "rgba(165, 180, 252, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw center label
      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = "#a5b4fc";
      ctx.textAlign = "center";
      ctx.fillText("POLARIS", centerX, centerY + 28);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedMember, hoveredMember]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    // Bound movement
    const boundedX = Math.max(-120, Math.min(120, newX));
    const boundedY = Math.max(-100, Math.min(100, newY));
    setDragOffset({ x: boundedX, y: boundedY });
    offsetRef.current = { x: boundedX, y: boundedY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative rounded-2xl border border-white/8 bg-surface/50 backdrop-blur-xl overflow-hidden min-h-[560px] flex flex-col lg:flex-row">
      {/* ── Left / Center Canvas Area ── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 min-h-[420px] lg:min-h-[560px] cursor-${isDragging ? "grabbing" : "grab"} select-none`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none" />

        {/* Floating UI Cues */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[11px] font-sans text-muted-foreground bg-surface-2/70 border border-white/8 px-3 py-1 rounded-full backdrop-blur-md">
          <Move className="size-3 text-primary animate-pulse" />
          <span>Drag to explore constellation</span>
        </div>

        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 text-[11px] font-sans text-muted-foreground bg-surface-2/70 border border-white/8 px-3 py-1 rounded-full backdrop-blur-md">
          <Sparkles className="size-3 text-primary" />
          <span>Click any star node to meet team lead</span>
        </div>

        {/* Central Polaris Icon Visual Overlay */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform"
          style={{ transform: `translate(calc(-50% + ${dragOffset.x}px), calc(-50% + ${dragOffset.y}px))` }}
        >
          <img src={polarisLogo} alt="Polaris Center Star" className="size-6 object-contain" />
        </div>

        {/* Clickable HTML Node Overlays for Team Members */}
        {TEAM_CONSTELLATION_MEMBERS.map((member, idx) => {
          const angle = member.orbitAngle;
          const x = Math.cos(angle) * member.orbitRadius;
          const y = Math.sin(angle) * member.orbitRadius;
          const isSelected = selectedMember?.id === member.id;

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => setSelectedMember(member)}
              onMouseEnter={() => setHoveredMember(member)}
              onMouseLeave={() => setHoveredMember(null)}
              style={{
                left: `calc(50% + ${x + dragOffset.x}px)`,
                top: `calc(50% + ${y + dragOffset.y}px)`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                isSelected ? "scale-110" : "hover:scale-105"
              }`}
            >
              {/* Circular Star Node */}
              <div
                className={`size-10 sm:size-11 rounded-full border flex items-center justify-center transition-all bg-card ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 shadow-[0_0_16px_rgba(165,180,252,0.4)]"
                    : "border-white/12 hover:border-primary/50"
                }`}
              >
                <div className="size-8 sm:size-9 rounded-full bg-surface-2 flex items-center justify-center text-xs font-semibold text-primary overflow-hidden">
                  {member.name.charAt(0)}
                </div>
              </div>

              {/* Name Tag Pill */}
              <span
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-surface-2/90 text-foreground border border-white/8 group-hover:border-primary/40"
                }`}
              >
                {member.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Right: Selected Team Member Profile Inspector ── */}
      <div className="w-full lg:w-96 p-6 border-t lg:border-t-0 lg:border-l border-white/8 bg-surface-2/40 flex flex-col justify-between font-sans">
        {selectedMember ? (
          <div className="space-y-5 animate-[fade-in_300ms_ease-out]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-primary tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {selectedMember.department}
              </span>
              <span className="text-xs text-muted-foreground font-mono">Constellation Node</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-full border border-primary/30 bg-card flex items-center justify-center text-base font-bold text-primary">
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-foreground">{selectedMember.name}</h3>
                <p className="text-xs text-primary font-medium">{selectedMember.role}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-card border border-white/6 space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider block">
                  Role & Background
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedMember.intro}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] uppercase text-primary font-semibold tracking-wider block">
                  What Do I Bring to Polaris?
                </span>
                <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                  "{selectedMember.whatIBring}"
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-2">
              <UserCheck className="size-3.5 text-emerald-400" />
              <span>Verified Core Contributor</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground text-xs space-y-2">
            <Sparkles className="size-6 text-primary/60 animate-pulse" />
            <p>Click any star node in the constellation to inspect their contributions.</p>
          </div>
        )}

        <div className="pt-4 border-t border-white/6 mt-6 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Project Polaris Ecosystem</span>
          <span className="text-primary font-medium">Built by Students</span>
        </div>
      </div>
    </div>
  );
}
