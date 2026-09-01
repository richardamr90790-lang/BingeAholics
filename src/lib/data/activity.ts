import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/lib/activity";

export type { Activity, ActivityKind } from "@/lib/activity";
export { ACTIVITY_KIND, activitySentence, timeAgo } from "@/lib/activity";

export async function listActivity(limit = 100): Promise<Activity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Activity[];
}

// Consecutive days (UTC) with a logged "progress" or "completed" entry, counting
// back from today — or from yesterday if nothing's been logged yet today, so the
// streak doesn't read as broken until a full day is actually missed.
export async function getStreak(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity")
    .select("created_at, kind")
    .in("kind", ["progress", "completed"])
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data || data.length === 0) return 0;

  const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);
  const days = new Set(
    data.map((r) => dayKey(new Date(r.created_at as string).getTime())),
  );

  const DAY = 86_400_000;
  const midnightUTC = new Date();
  midnightUTC.setUTCHours(0, 0, 0, 0);
  let cursor = midnightUTC.getTime();

  if (!days.has(dayKey(cursor))) {
    cursor -= DAY;
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor -= DAY;
  }
  return streak;
}
