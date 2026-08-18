import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ShowcaseProject = {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string | null;
  team: string | null;
  link: string | null;
  stage: string;
  created_at: string;
};

export const SHOWCASE_CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hardware", label: "Hardware & Rocketry" },
  { value: "software", label: "Software & Data" },
  { value: "research", label: "Research" },
  { value: "outreach", label: "Outreach & Education" },
  { value: "design", label: "Design & Media" },
  { value: "other", label: "Other" },
];

export const SHOWCASE_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SHOWCASE_CATEGORIES.map((c) => [c.value, c.label]),
);

export const SHOWCASE_STAGES: { value: string; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export const SHOWCASE_STAGE_LABELS: Record<string, string> = Object.fromEntries(
  SHOWCASE_STAGES.map((s) => [s.value, s.label]),
);

export const showcaseQuery = queryOptions({
  queryKey: ["showcase-projects"],
  queryFn: async (): Promise<ShowcaseProject[]> => {
    const { data, error } = await supabase
      .from("project_submissions")
      .select("id,title,category,summary,description,team,link,stage,created_at")
      .eq("approved", true)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ShowcaseProject[];
  },
});
