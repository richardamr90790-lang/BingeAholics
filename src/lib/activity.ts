export type ActivityKind =
  | "added"
  | "progress"
  | "completed"
  | "status"
  | "removed";

export type Activity = {
  id: string;
  user_id: string;
  title_id: string | null;
  title_name: string;
  kind: ActivityKind;
  detail: string | null;
  created_at: string;
};

export const ACTIVITY_KIND: Record<ActivityKind, { label: string; dot: string }> =
  {
    added: { label: "Added", dot: "bg-sky-400" },
    progress: { label: "Progress", dot: "bg-violet-400" },
    completed: { label: "Completed", dot: "bg-emerald-400" },
    status: { label: "Status", dot: "bg-amber-400" },
    removed: { label: "Removed", dot: "bg-red-400" },
  };

export function activitySentence(
  a: Pick<Activity, "kind" | "title_name" | "detail">,
): string {
  switch (a.kind) {
    case "added":
      return `Added ${a.title_name}`;
    case "progress":
      return `${a.title_name} · ${a.detail ?? "progressed"}`;
    case "completed":
      return `Finished ${a.title_name}`;
    case "status":
      return `${a.title_name} · ${a.detail ?? "status changed"}`;
    case "removed":
      return `Removed ${a.title_name}`;
  }
}

export function timeAgo(iso: string): string {
  const secs = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}
