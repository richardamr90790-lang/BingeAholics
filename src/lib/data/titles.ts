import { createClient } from "@/lib/supabase/server";
import type { Title, TitleType, TitleStatus } from "@/lib/titles";

export type { Title, TitleType, TitleStatus, Category } from "@/lib/titles";
export {
  TYPE_LABELS,
  STATUS_LABELS,
  CATEGORIES,
  categoryTypes,
  progressPercent,
} from "@/lib/titles";

export async function listTitles(opts?: {
  type?: TitleType;
  types?: TitleType[];
  status?: TitleStatus;
}): Promise<Title[]> {
  const supabase = await createClient();
  let query = supabase
    .from("titles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (opts?.type) query = query.eq("type", opts.type);
  else if (opts?.types && opts.types.length > 0)
    query = query.in("type", opts.types);
  if (opts?.status) query = query.eq("status", opts.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Title[];
}

export async function getContinueWatching(): Promise<Title[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("titles")
    .select("*")
    .eq("status", "in_progress")
    .order("updated_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data ?? []) as Title[];
}

export type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  planned: number;
};

export async function getStats(): Promise<Stats> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("titles").select("status");
  if (error) throw error;
  const rows = (data ?? []) as { status: TitleStatus }[];
  return {
    total: rows.length,
    inProgress: rows.filter((r) => r.status === "in_progress").length,
    completed: rows.filter((r) => r.status === "completed").length,
    planned: rows.filter((r) => r.status === "planned").length,
  };
}
