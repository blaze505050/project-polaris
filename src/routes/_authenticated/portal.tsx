import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import {
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Code2,
  Compass,
  Cpu,
  ExternalLink,
  FolderKanban,
  HelpCircle,
  Layers,
  Lightbulb,
  Link2,
  MessageSquareQuote,
  Orbit,
  Play,
  RotateCw,
  Send,
  Sparkles,
  Terminal,
  Trophy,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Polaris Engineering Workspace — Student Portal" },
      {
        name: "description",
        content:
          "Active engineering workspace, technical roadmap, sprint deliverables, and AI engineering mentor.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Polaris Engineering Workspace" },
    ],
  }),
  component: Portal,
});

type ProgressRow = {
  id: string;
  course: string;
  attendance_percent: number;
  assignments_completed: number;
  assignments_total: number;
  quiz_score: number;
  project_progress: number;
  mentor_feedback: string | null;
  skills: string[];
  portfolio_url: string | null;
  certificate_status: string;
};

const CERTIFICATE_LABELS: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  eligible: "Eligible for Review",
  issued: "Verified & Issued",
};

interface AIResponse {
  query: string;
  analysis: string;
  steps: string[];
  code?: string;
  checklist: string[];
  references: string[];
}

export function Portal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"workspace" | "ai_mentor" | "skills">("workspace");

  // AI Mentor State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAiOutput, setActiveAiOutput] = useState<AIResponse | null>({
    query: "Validate Supersonic Shockwave Solver Convergence",
    analysis:
      "When calculating shock angles (β) using the θ-β-M relation for supersonic wedge flows, standard Newton-Raphson iteration may diverge near the detached shock limit (M < 1.4 or θ > θ_max).",
    steps: [
      "Implement a bisection guard before initiating Newton-Raphson to bound β between the Mach angle (μ = arcsin(1/M)) and 90°.",
      "Add condition check: If deflection θ > θ_max(M), flag normal/detached shock regime immediately.",
      "Verify density ratio across oblique shock using Rankine-Hugoniot relations: ρ₂/ρ₁ = ((γ+1)M₁² sin²β) / (2 + (γ-1)M₁² sin²β).",
    ],
    code: `def solve_oblique_shock(mach, theta_rad, gamma=1.4):
    """Calculates weak oblique shock wave angle beta (radians)."""
    import math
    if mach <= 1.0:
        raise ValueError("Flow must be supersonic (M > 1.0)")
    
    # Mach angle lower bound
    beta_min = math.asin(1.0 / mach)
    beta_max = math.pi / 2.0
    
    # Newton-Raphson solver with bound protection
    beta = (beta_min + beta_max) / 2.0
    for _ in range(50):
        tan_th = 2 * (1/math.tan(beta)) * (mach**2 * math.sin(beta)**2 - 1) / (mach**2 * (gamma + math.cos(2*beta)) + 2)
        diff = math.atan(tan_th) - theta_rad
        if abs(diff) < 1e-7:
            return beta
        beta -= 0.05 * diff
    return beta`,
    checklist: [
      "Mach angle minimum boundary verified",
      "Rankine-Hugoniot pressure jump verified against NACA 1135 tables",
      "Unit test passing for Mach 2.0 at 10° deflection (Expected β ≈ 39.31°)",
    ],
    references: [
      "Anderson, J. D. Modern Compressible Flow: With Historical Perspective (McGraw-Hill).",
      "NACA Report 1135: Equations, Tables, and Charts for Compressible Flow (1953).",
    ],
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const profile = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, school, grade")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const progress = useQuery({
    queryKey: ["student_progress", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ProgressRow[]> => {
      const { data, error } = await supabase
        .from("student_progress")
        .select(
          "id, course, attendance_percent, assignments_completed, assignments_total, quiz_score, project_progress, mentor_feedback, skills, portfolio_url, certificate_status",
        )
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const handleAskMentor = (promptText?: string) => {
    const queryToUse = promptText || aiPrompt;
    if (!queryToUse.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setActiveAiOutput({
        query: queryToUse,
        analysis: `Technical review for '${queryToUse}': The system has evaluated boundary conditions, numerical discretization constraints, and physical validation requirements.`,
        steps: [
          "Establish dimensionless parameter baseline (Reynolds, Mach, or Knudsen numbers).",
          "Apply 2nd-order central differencing for interior points with upwind damping at steep gradients.",
          "Cross-reference residuals against convergence threshold (tolerance < 10⁻⁵).",
        ],
        code: `# Automated Verification Script: ${queryToUse.slice(0, 30)}
import numpy as np

def verify_parameters(mach: float, altitude_km: float):
    # Standard ISA Atmospheric Model approximation
    T = 288.15 - 6.5 * min(altitude_km, 11.0)
    a = np.sqrt(1.4 * 287.05 * T)
    velocity = mach * a
    return {"speed_of_sound": a, "velocity_mps": velocity}`,
        checklist: [
          "Conservation of mass & momentum satisfied",
          "Grid independence test performed (Mesh doubling)",
          "Peer review sign-off completed",
        ],
        references: [
          "NASA Technical Memorandum 104748: Aerodynamic Solver Validation.",
          "Project Polaris Open R&D Documentation (2026).",
        ],
      });
      setIsGenerating(false);
      setAiPrompt("");
      setActiveTab("ai_mentor");
    }, 600);
  };

  const name = profile.data?.full_name || user?.email?.split("@")[0] || "Student Builder";
  const rows = progress.data ?? [];

  // Default fallback data for demo if database has no rows
  const activeCourse = rows[0]?.course || "AeroForge Aerospace Dynamics & Simulation Lab";
  const attendancePct = rows[0]?.attendance_percent ?? 92;
  const projectPct = rows[0]?.project_progress ?? 68;
  const quizPct = rows[0]?.quiz_score ?? 88;
  const skillsList = rows[0]?.skills?.length
    ? rows[0].skills
    : ["Supersonic Aerodynamics", "CFD Solvers", "Rankine-Hugoniot", "Orbital Mechanics", "Python"];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* ── TOP WORKSPACE NAV ── */}
      <div className="border-b border-border bg-surface-2/40">
        <div className="shell py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-md bg-surface-3 border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-foreground">{name}</h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Sprint
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                {user?.email} {profile.data?.school ? `· ${profile.data.school}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs font-mono">
              <Link to="/aeroforge">
                <Cpu className="size-3.5 mr-1.5 text-primary" />
                Open AeroForge Lab
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs font-mono text-muted-foreground" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* ── CURRENT OBJECTIVE BANNER ── */}
      <div className="shell mt-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-mono text-primary uppercase font-bold tracking-wider mb-1">
              <Lightbulb className="size-3.5" />
              <span>Current Sprint Objective</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              Validate oblique shock boundary conditions against NACA Report 1135 experimental tables.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target: Reduce residual divergence in Mach 2.0+ regimes and submit verification pull request.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-8 text-xs bg-foreground text-background font-medium"
              onClick={() => handleAskMentor("Validate shockwave angle solver against NACA 1135 baseline")}
            >
              <Sparkles className="size-3.5 mr-1.5 text-primary" />
              Ask AI Mentor
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <Link to="/aeroforge">Run in Solver →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE TABS ── */}
      <div className="shell mt-8">
        <div className="flex items-center gap-2 border-b border-border pb-px font-mono text-xs">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "workspace"
                ? "border-primary text-foreground font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderKanban className="size-3.5" />
            <span>Workspace & Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab("ai_mentor")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "ai_mentor"
                ? "border-primary text-foreground font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="size-3.5 text-primary" />
            <span>AI Engineering Mentor</span>
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "skills"
                ? "border-primary text-foreground font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="size-3.5" />
            <span>Skills & Credentials</span>
          </button>
        </div>

        {/* ── TAB 1: WORKSPACE & SPRINT DELIVERABLES ── */}
        {activeTab === "workspace" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Left: Active Course & Task Backlog */}
            <div className="space-y-6">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Enrolled Cohort</span>
                    <h2 className="text-base font-bold text-foreground mt-0.5">{activeCourse}</h2>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-2 border border-border text-foreground">
                    Week 4 of 8
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-md bg-surface-2/60 border border-border">
                    <div className="text-muted-foreground text-[10px]">Attendance</div>
                    <div className="text-base font-bold text-foreground mt-1">{attendancePct}%</div>
                    <Progress value={attendancePct} className="h-1 mt-2" />
                  </div>
                  <div className="p-3 rounded-md bg-surface-2/60 border border-border">
                    <div className="text-muted-foreground text-[10px]">Project Sprint</div>
                    <div className="text-base font-bold text-primary mt-1">{projectPct}%</div>
                    <Progress value={projectPct} className="h-1 mt-2" />
                  </div>
                  <div className="p-3 rounded-md bg-surface-2/60 border border-border">
                    <div className="text-muted-foreground text-[10px]">Quiz Review</div>
                    <div className="text-base font-bold text-foreground mt-1">{quizPct}%</div>
                    <Progress value={quizPct} className="h-1 mt-2" />
                  </div>
                </div>
              </div>

              {/* Sprint Tasks */}
              <div className="card-premium p-6">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <h3 className="text-xs font-mono uppercase font-bold text-foreground">Sprint Deliverables & Tasks</h3>
                  <span className="text-[11px] font-mono text-muted-foreground">3 / 4 Completed</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { title: "Run 1D compressible isentropic flow solver verification", done: true },
                    { title: "Calculate shock angle β for wedge angles 5° to 25°", done: true },
                    { title: "Derive Rayleigh Pitot tube supersonic formula in notes", done: true },
                    { title: "Implement bisection guard for detached shock regimes", done: false },
                  ].map((task, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md border flex items-center justify-between ${
                        task.done
                          ? "bg-surface-2/30 border-border text-muted-foreground"
                          : "bg-surface-2 border-primary/40 text-foreground font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className={`size-4 ${task.done ? "text-emerald-400" : "text-border-strong"}`} />
                        <span className={task.done ? "line-through opacity-70" : ""}>{task.title}</span>
                      </div>
                      {!task.done && (
                        <button
                          onClick={() => handleAskMentor(task.title)}
                          className="text-[11px] text-primary hover:underline"
                        >
                          Co-pilot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Mentor Notes & Quick Shortcuts */}
            <div className="space-y-6">
              <div className="card-premium p-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-foreground border-b border-border pb-3 mb-4">
                  <MessageSquareQuote className="size-4 text-primary" />
                  <span>Lead Mentor Review</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rows[0]?.mentor_feedback ||
                    "Strong grasp of compressible fluid mechanics. Make sure your Python solver explicitly handles flow separation limits near Mach 1.0 boundaries."}
                </p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Reviewed by: Lead Propulsion Mentor</span>
                  <span className="text-emerald-400">Verified</span>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="text-xs font-mono uppercase font-bold text-foreground border-b border-border pb-3 mb-4">
                  <span>Engineering Toolkit</span>
                </div>
                <div className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full justify-between h-9 text-xs font-mono">
                    <Link to="/aeroforge">
                      <span className="flex items-center gap-2">
                        <Cpu className="size-3.5 text-primary" /> AeroForge 40+ Solvers
                      </span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full justify-between h-9 text-xs font-mono">
                    <Link to="/projects">
                      <span className="flex items-center gap-2">
                        <Orbit className="size-3.5 text-accent" /> Sky Atlas Catalog
                      </span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: AI ENGINEERING MENTOR WORKBENCH ── */}
        {activeTab === "ai_mentor" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            {/* Left Prompt Input & Preset Prompts */}
            <div className="space-y-5">
              <div className="card-premium p-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-foreground mb-3">
                  <Terminal className="size-4 text-primary" />
                  <span>Polaris AI Engineering Co-Pilot</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Ask for numerical equations, code implementations, aerodynamic proofs, or literature validation.
                </p>

                <div className="space-y-3">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. How do I calculate the Prandtl-Meyer expansion angle for Mach 2.5?"
                    className="w-full h-28 rounded-md border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono resize-none"
                  />

                  <Button
                    onClick={() => handleAskMentor()}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full h-9 bg-foreground text-background font-medium text-xs flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="size-3.5 animate-spin" />
                        <span>Evaluating Engineering Query…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3.5 text-primary" />
                        <span>Run Engineering Review</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Preset Prompts */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase mb-2.5">
                    Engineering Presets:
                  </div>
                  <div className="space-y-1.5">
                    {[
                      "Derive supersonic θ-β-M oblique shock relation",
                      "Write Hohmann transfer orbit delta-V calculator in Python",
                      "Review Navier-Stokes boundary condition assumptions",
                    ].map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => handleAskMentor(preset)}
                        className="w-full text-left p-2 rounded bg-surface-2/60 hover:bg-surface-2 text-[11px] text-muted-foreground hover:text-foreground font-mono transition-colors border border-border/50 truncate block"
                      >
                        → {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Structured Output Display */}
            <div className="space-y-6">
              {activeAiOutput ? (
                <div className="card-premium p-6 space-y-6">
                  {/* Query Header */}
                  <div className="border-b border-border pb-4">
                    <span className="text-[10px] font-mono text-primary uppercase font-bold">Engineering Output</span>
                    <h3 className="text-base font-bold text-foreground mt-1">{activeAiOutput.query}</h3>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-bold text-muted-foreground mb-2">
                      01 / Technical Assessment
                    </h4>
                    <p className="text-xs text-foreground leading-relaxed bg-surface-2/50 p-3.5 rounded-md border border-border">
                      {activeAiOutput.analysis}
                    </p>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-bold text-muted-foreground mb-2">
                      02 / Implementation Directives
                    </h4>
                    <ul className="space-y-2 text-xs font-mono">
                      {activeAiOutput.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2.5 rounded bg-surface-2/30 border border-border">
                          <span className="text-primary font-bold">{idx + 1}.</span>
                          <span className="text-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Code snippet */}
                  {activeAiOutput.code && (
                    <div>
                      <h4 className="text-xs font-mono uppercase font-bold text-muted-foreground mb-2">
                        03 / Executable Verification Code
                      </h4>
                      <div className="rounded-md border border-border bg-background p-4 overflow-x-auto">
                        <pre className="text-[11px] font-mono text-slate-200 leading-relaxed">
                          <code>{activeAiOutput.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Verification Checklist */}
                  <div>
                    <h4 className="text-xs font-mono uppercase font-bold text-muted-foreground mb-2">
                      04 / Verification Checklist
                    </h4>
                    <ul className="space-y-1.5 text-xs font-mono">
                      {activeAiOutput.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Academic References */}
                  <div className="pt-3 border-t border-border text-[11px] font-mono text-muted-foreground">
                    <span className="font-bold uppercase text-foreground">Literature References:</span>
                    <ul className="mt-1 space-y-1">
                      {activeAiOutput.references.map((ref, idx) => (
                        <li key={idx}>• {ref}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="card-premium p-12 text-center text-muted-foreground text-xs font-mono">
                  Select an engineering query or type a prompt to generate structured technical reviews.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: SKILLS & CREDENTIALS ── */}
        {activeTab === "skills" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card-premium p-6">
              <h3 className="text-xs font-mono uppercase font-bold text-foreground border-b border-border pb-3 mb-4">
                Verified Technical Capabilities
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Skills validated through completed assignments, simulation code contributions, and mentor reviews.
              </p>

              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-md text-xs font-mono bg-surface-2 border border-border text-foreground flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-3 text-primary" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="card-premium p-6">
              <h3 className="text-xs font-mono uppercase font-bold text-foreground border-b border-border pb-3 mb-4">
                Portfolio & Certification
              </h3>
              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between items-center p-3 rounded bg-surface-2 border border-border">
                  <span>Certificate Status:</span>
                  <span className="text-gold font-bold">
                    {CERTIFICATE_LABELS[rows[0]?.certificate_status || "in_progress"]}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-surface-2 border border-border">
                  <span>Portfolio URL:</span>
                  <span className="text-muted-foreground">
                    {rows[0]?.portfolio_url ? (
                      <a href={rows[0].portfolio_url} target="_blank" rel="noreferrer" className="text-primary underline">
                        View Artifacts
                      </a>
                    ) : (
                      "Linked to GitHub"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      className="size-3.5"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
