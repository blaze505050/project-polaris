export const CATEGORY_LABELS: Record<string, string> = {
  research: "Research",
  workshops: "Workshops",
  events: "Events",
  projects: "Innovation Projects",
  mentorship: "Mentorship",
  volunteer: "Volunteer",
};

export const CATEGORY_FILTERS = [
  { value: "all", label: "All" },
  { value: "research", label: "Research" },
  { value: "workshops", label: "Workshops" },
  { value: "events", label: "Events" },
  { value: "projects", label: "Projects" },
  { value: "mentorship", label: "Mentorship" },
  { value: "volunteer", label: "Volunteer" },
] as const;

export const LEVEL_FILTERS = [
  { value: "all", label: "Any level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "open_to_all", label: "Open to all" },
] as const;

export const AUDIENCE_FILTERS = [
  { value: "all", label: "Anyone" },
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "open_to_all", label: "Open to all" },
] as const;

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  open_to_all: "Open to all",
};

export const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  ongoing: "Ongoing",
  coming_soon: "Coming soon",
  closed: "Closed",
};

export const RESOURCE_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "articles", label: "Articles" },
  { value: "educational-content", label: "Educational Content" },
  { value: "research", label: "Research" },
  { value: "guides", label: "Guides" },
  { value: "session-materials", label: "Session Materials" },
  { value: "videos", label: "Videos" },
] as const;

export const RESOURCE_CATEGORY_LABELS: Record<string, string> = {
  articles: "Articles",
  "educational-content": "Educational Content",
  research: "Research",
  guides: "Guides",
  "session-materials": "Session Materials",
  videos: "Videos",
};

export function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
