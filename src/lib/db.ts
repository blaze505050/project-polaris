import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Opportunity = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string | null;
  what_you_do: string[];
  who_can_apply: string[];
  requirements: string[];
  timeline: string[];
  what_you_gain: string[];
  faqs: { q: string; a: string }[];
  level: string;
  audience: string;
  status: string;
  start_date: string | null;
  deadline: string | null;
  featured: boolean;
};

export type PolarisEvent = {
  id: string;
  title: string;
  description: string | null;
  speaker: string | null;
  speaker_note: string | null;
  event_date: string | null;
  registration_link: string | null;
  status: string;
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  author: string | null;
  url: string | null;
  published_date: string | null;
};

export const opportunitiesQuery = queryOptions({
  queryKey: ["opportunities"],
  queryFn: async (): Promise<Opportunity[]> => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) {
        console.warn(
          "[Supabase] Failed to fetch opportunities, falling back to empty list:",
          error.message,
        );
        return [];
      }
      return (data ?? []) as unknown as Opportunity[];
    } catch (err) {
      console.warn("[Supabase] Error in opportunitiesQuery:", err);
      return [];
    }
  },
});

export const opportunityQuery = (slug: string) =>
  queryOptions({
    queryKey: ["opportunity", slug],
    queryFn: async (): Promise<Opportunity | null> => {
      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        if (error) {
          console.warn(`[Supabase] Failed to fetch opportunity ${slug}:`, error.message);
          return null;
        }
        return (data as unknown as Opportunity) ?? null;
      } catch (err) {
        console.warn(`[Supabase] Error in opportunityQuery for ${slug}:`, err);
        return null;
      }
    },
  });

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: async (): Promise<PolarisEvent[]> => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .order("event_date", { ascending: false });
      if (error) {
        console.warn(
          "[Supabase] Failed to fetch events, falling back to empty list:",
          error.message,
        );
        return [];
      }
      return (data ?? []) as unknown as PolarisEvent[];
    } catch (err) {
      console.warn("[Supabase] Error in eventsQuery:", err);
      return [];
    }
  },
});

export const resourcesQuery = queryOptions({
  queryKey: ["resources"],
  queryFn: async (): Promise<Resource[]> => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: true });
      if (error) {
        console.warn(
          "[Supabase] Failed to fetch resources, falling back to empty list:",
          error.message,
        );
        return [];
      }
      return (data ?? []) as unknown as Resource[];
    } catch (err) {
      console.warn("[Supabase] Error in resourcesQuery:", err);
      return [];
    }
  },
});
