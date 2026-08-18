import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import {
  Award,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FolderKanban,
  Link2,
  MessageSquareQuote,
  Sparkles,
  Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Polaris Learning Dashboard — Student Portal" },
      {
        name: "description",
        content:
          "Track your course, attendance, assignments, quiz scores, project progress, mentor feedback, skills, portfolio and certificate status.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Polaris Learning Dashboard" },
      { property: "og:description", content: "Your Project Polaris student progress in one place." },
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
  eligible: "Eligible",
  issued: "Issued",
};

function Portal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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

  const name = profile.data?.full_name || user?.email?.split("@")[0] || "student";
  const rows = progress.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Polaris Learning Dashboard"
        title={`Welcome back, ${name}.`}
        lead="Everything the Polaris team records about your learning — updated after each session, assignment and review."
      />

      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-ui text-sm text-muted-foreground">
              Signed in as {user?.email ?? "…"}
              {profile.data?.school ? ` · ${profile.data.school}` : ""}
              {profile.data?.grade ? ` · ${profile.data.grade}` : ""}
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>

          {progress.isLoading && (
            <p className="mt-12 text-sm text-muted-foreground">Loading your dashboard…</p>
          )}

          {!progress.isLoading && rows.length === 0 && (
            <div className="card-elevated mt-12 p-9 text-center">
              <h2 className="text-2xl">Your dashboard is being set up</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
                Once you join a course, workshop or project, your records appear here.
              </p>
            </div>
          )}

          <div className="mt-12 space-y-10">
            {rows.map((row) => {
              const assignmentPct = row.assignments_total
                ? Math.round((row.assignments_completed / row.assignments_total) * 100)
                : 0;
              return (
                <article key={row.id} className="card-elevated p-7 md:p-9">
                  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                    <div className="flex items-center gap-3">
                      <BookOpen className="size-5 text-primary" />
                      <h2 className="text-2xl">{row.course}</h2>
                    </div>
                    <span className="font-ui rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
                      Certificate: {CERTIFICATE_LABELS[row.certificate_status] ?? row.certificate_status}
                    </span>
                  </header>

                  <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <Metric
                      icon={<CalendarCheck className="size-4" />}
                      label="Attendance"
                      value={`${row.attendance_percent}%`}
                      pct={row.attendance_percent}
                    />
                    <Metric
                      icon={<ClipboardList className="size-4" />}
                      label="Assignments"
                      value={`${row.assignments_completed}/${row.assignments_total}`}
                      pct={assignmentPct}
                    />
                    <Metric
                      icon={<Trophy className="size-4" />}
                      label="Quiz score"
                      value={`${row.quiz_score}%`}
                      pct={row.quiz_score}
                    />
                    <Metric
                      icon={<FolderKanban className="size-4" />}
                      label="Project progress"
                      value={`${row.project_progress}%`}
                      pct={row.project_progress}
                    />
                  </div>

                  <div className="mt-9 grid gap-8 md:grid-cols-2">
                    <div>
                      <p className="eyebrow-muted mb-3 flex items-center gap-2">
                        <MessageSquareQuote className="size-4" /> Mentor feedback
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {row.mentor_feedback || "No feedback recorded yet."}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow-muted mb-3 flex items-center gap-2">
                        <Sparkles className="size-4" /> Skills
                      </p>
                      {row.skills.length ? (
                        <ul className="flex flex-wrap gap-2">
                          {row.skills.map((s) => (
                            <li
                              key={s}
                              className="font-ui rounded-full border border-border px-3 py-1 text-xs"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Skills get added as you build.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-6 border-t border-border pt-6 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="size-4" />
                      Portfolio:{" "}
                      {row.portfolio_url ? (
                        <a
                          href={row.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "Not added yet"
                      )}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Award className="size-4" />
                      {CERTIFICATE_LABELS[row.certificate_status] ?? row.certificate_status}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({
  icon,
  label,
  value,
  pct,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <div>
      <p className="eyebrow-muted flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="font-display mt-3 text-3xl text-primary">{value}</p>
      <Progress value={Math.max(0, Math.min(100, pct))} className="mt-3 h-1.5" />
    </div>
  );
}
