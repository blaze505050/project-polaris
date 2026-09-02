import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
}

export function ConstellationCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isMobile = width < 768;
    const colors = ["#c59dff", "#38bdf8", "#818cf8", "#e0e7ff"];
    const starCount = isMobile ? 25 : Math.min(Math.floor((width * height) / 14000), 75);
    const stars: Star[] = [];

    const mouse = { x: -1000, y: -1000, active: false };

    for (let i = 0; i < starCount; i++) {
      const r = isMobile ? Math.random() * 1.4 + 0.6 : Math.random() * 1.8 + 0.8;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: r,
        baseRadius: r,
        color: colors[Math.floor(Math.random() * colors.length)] ?? "#C59DFF",
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Spawn burst of miniature stars
      for (let i = 0; i < 5; i++) {
        stars.push({
          x: clickX,
          y: clickY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 2 + 1,
          baseRadius: 1.5,
          color: colors[Math.floor(Math.random() * colors.length)] ?? "#C59DFF",
          alpha: 0.9,
        });
      }
      if (stars.length > 90) stars.splice(0, 5);
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      const maxDist = width < 768 ? 75 : 130;
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        if (!s1) continue;

        // Movement
        s1.x += s1.vx;
        s1.y += s1.vy;

        // Bounce from edges
        if (s1.x < 0 || s1.x > width) s1.vx *= -1;
        if (s1.y < 0 || s1.y > height) s1.vy *= -1;

        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - s1.x;
          const dy = mouse.y - s1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 10) {
            s1.x += (dx / dist) * 0.4;
            s1.y += (dy / dist) * 0.4;
            s1.radius = s1.baseRadius * 1.5;
          } else {
            s1.radius = s1.baseRadius;
          }
        }

        // Draw connections between close stars
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          if (!s2) continue;
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.25;
            ctx.strokeStyle = `rgba(197, 157, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }

        // Draw star
        ctx.save();
        ctx.globalAlpha = s1.alpha;
        ctx.fillStyle = s1.color;
        ctx.shadowColor = s1.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s1.x, s1.y, s1.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 size-full pointer-events-auto ${className}`}
      style={{ opacity: 0.75 }}
    />
  );
}
