// Pure types + constants shared by server and client code (no server imports).

export type TitleType =
  | "anime"
  | "manga"
  | "manhwa"
  | "book"
  | "video"
  | "podcast"
  | "game"
  | "course"
  | "other";

export type TitleStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "on_hold"
  | "dropped";

export type Title = {
  id: string;
  user_id: string;
  title: string;
  type: TitleType;
  unit_label: string;
  total_units: number | null;
  current_unit: number;
  status: TitleStatus;
  cover_url: string | null;
  rating: number | null;
  notes: string | null;
  minutes: number;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
};

export function formatMinutes(mins: number): string {
  if (!mins || mins < 1) return "0m";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export const TYPE_LABELS: Record<TitleType, string> = {
  anime: "Anime",
  manga: "Manga",
  manhwa: "Manhwa",
  book: "Book",
  video: "Video",
  podcast: "Podcast",
  game: "Game",
  course: "Course",
  other: "Other",
};

export const STATUS_LABELS: Record<TitleStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
  on_hold: "On hold",
  dropped: "Dropped",
};

export type Category = "watch" | "read" | "listen" | "play" | "learn";

export const CATEGORIES: {
  key: Category;
  label: string;
  types: TitleType[];
}[] = [
  { key: "watch", label: "Watch", types: ["anime", "video"] },
  { key: "read", label: "Read", types: ["manga", "manhwa", "book"] },
  { key: "listen", label: "Listen", types: ["podcast"] },
  { key: "play", label: "Play", types: ["game"] },
  { key: "learn", label: "Learn", types: ["course"] },
];

export function categoryTypes(key: string): TitleType[] | null {
  return CATEGORIES.find((c) => c.key === key)?.types ?? null;
}

/** Accent hex per mode — layered subtly over the base purple/cosmic theme. */
export const CATEGORY_ACCENT: Record<Category, string> = {
  watch: "#fb7185", // rose
  read: "#34d399", // emerald
  listen: "#22d3ee", // cyan
  play: "#a78bfa", // violet
  learn: "#fbbf24", // gold
};

export function progressPercent(
  t: Pick<Title, "current_unit" | "total_units">,
): number | null {
  if (!t.total_units || t.total_units <= 0) return null;
  return Math.min(100, Math.round((t.current_unit / t.total_units) * 100));
}
