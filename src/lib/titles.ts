// Pure types + constants shared by server and client code (no server imports).

export type TitleType =
  | "anime"
  | "manga"
  | "manhwa"
  | "book"
  | "video"
  | "podcast"
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
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
};

export const TYPE_LABELS: Record<TitleType, string> = {
  anime: "Anime",
  manga: "Manga",
  manhwa: "Manhwa",
  book: "Book",
  video: "Video",
  podcast: "Podcast",
  other: "Other",
};

export const STATUS_LABELS: Record<TitleStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
  on_hold: "On hold",
  dropped: "Dropped",
};

export function progressPercent(
  t: Pick<Title, "current_unit" | "total_units">,
): number | null {
  if (!t.total_units || t.total_units <= 0) return null;
  return Math.min(100, Math.round((t.current_unit / t.total_units) * 100));
}
