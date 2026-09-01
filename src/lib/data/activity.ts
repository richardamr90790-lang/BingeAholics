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
