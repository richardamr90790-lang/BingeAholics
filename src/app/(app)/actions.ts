"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS, TYPE_LABELS, type Title } from "@/lib/titles";
import type { ActivityKind } from "@/lib/activity";
import { isAvatarId } from "@/lib/avatar";

export type ActionResult = { error?: string } | undefined;

function revalidateApp() {
  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath("/history");
}

async function logActivity(
  supabase: SupabaseClient,
  userId: string,
  entry: {
    title_id: string | null;
    title_name: string;
    kind: ActivityKind;
    detail?: string | null;
  },
) {
  try {
    await supabase.from("activity").insert({
      user_id: userId,
      title_id: entry.title_id,
      title_name: entry.title_name,
      kind: entry.kind,
      detail: entry.detail ?? null,
    });
  } catch {
    // activity logging is best-effort; never block the main action
  }
}

export async function createTitle(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };

  const type = String(formData.get("type") ?? "other");
  const unit_label =
    String(formData.get("unit_label") ?? "Part").trim() || "Part";

  const totalRaw = String(formData.get("total_units") ?? "").trim();
  const total_units = totalRaw ? Math.max(0, parseInt(totalRaw, 10) || 0) : null;

  const currentRaw = String(formData.get("current_unit") ?? "").trim();
  const current_unit = currentRaw
    ? Math.max(0, parseInt(currentRaw, 10) || 0)
    : 0;

  const cover_url = String(formData.get("cover_url") ?? "").trim() || null;

  let status: Title["status"] = "planned";
  if (current_unit > 0) status = "in_progress";
  if (total_units && total_units > 0 && current_unit >= total_units)
    status = "completed";

  const nowIso = new Date().toISOString();
  const { data: inserted, error } = await supabase
    .from("titles")
    .insert({
      user_id: user.id,
      title,
      type,
      unit_label,
      total_units,
      current_unit,
      status,
      cover_url,
      started_at: current_unit > 0 ? nowIso : null,
      completed_at: status === "completed" ? nowIso : null,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await logActivity(supabase, user.id, {
    title_id: inserted?.id ?? null,
    title_name: title,
    kind: "added",
    detail: TYPE_LABELS[type as Title["type"]] ?? null,
  });

  revalidateApp();
}

export async function updateProgress(
  id: string,
  nextUnit: number,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: row, error: fetchError } = await supabase
    .from("titles")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !row) return { error: fetchError?.message ?? "Not found" };

  const current = Math.max(0, Math.floor(nextUnit));
  const nowIso = new Date().toISOString();
  const patch: Record<string, unknown> = { current_unit: current };

  if (current > 0 && !row.started_at) patch.started_at = nowIso;

  if (row.total_units && row.total_units > 0 && current >= row.total_units) {
    patch.status = "completed";
    patch.completed_at = row.completed_at ?? nowIso;
  } else if (current > 0) {
    patch.status = "in_progress";
    patch.completed_at = null;
  } else {
    patch.status = "planned";
    patch.completed_at = null;
  }

  const { error } = await supabase.from("titles").update(patch).eq("id", id);
  if (error) return { error: error.message };

  if (patch.status === "completed" && row.status !== "completed") {
    await logActivity(supabase, row.user_id, {
      title_id: id,
      title_name: row.title,
      kind: "completed",
    });
  } else if (current !== row.current_unit) {
    await logActivity(supabase, row.user_id, {
      title_id: id,
      title_name: row.title,
      kind: "progress",
      detail: `${row.unit_label} ${row.current_unit} → ${current}`,
    });
  }

  revalidateApp();
}

export async function setStatus(
  id: string,
  status: Title["status"],
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("titles")
    .select("title, status, user_id")
    .eq("id", id)
    .single();

  const patch: Record<string, unknown> = { status };
  if (status === "completed") patch.completed_at = new Date().toISOString();
  if (status === "in_progress") patch.completed_at = null;

  const { error } = await supabase.from("titles").update(patch).eq("id", id);
  if (error) return { error: error.message };

  if (row && row.status !== status) {
    await logActivity(supabase, row.user_id, {
      title_id: id,
      title_name: row.title,
      kind: status === "completed" ? "completed" : "status",
      detail:
        status === "completed"
          ? null
          : `${STATUS_LABELS[row.status as Title["status"]]} → ${STATUS_LABELS[status]}`,
    });
  }

  revalidateApp();
}

export async function deleteTitle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("titles")
    .select("title, type, user_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("titles").delete().eq("id", id);
  if (error) return { error: error.message };

  if (row) {
    await logActivity(supabase, row.user_id, {
      title_id: null,
      title_name: row.title,
      kind: "removed",
      detail: TYPE_LABELS[row.type as Title["type"]] ?? null,
    });
  }

  revalidateApp();
}

export async function updateTitle(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };

  const type = String(formData.get("type") ?? "other");
  const unit_label =
    String(formData.get("unit_label") ?? "Part").trim() || "Part";

  const totalRaw = String(formData.get("total_units") ?? "").trim();
  const total_units = totalRaw ? Math.max(0, parseInt(totalRaw, 10) || 0) : null;

  const currentRaw = String(formData.get("current_unit") ?? "").trim();
  const current_unit = currentRaw
    ? Math.max(0, parseInt(currentRaw, 10) || 0)
    : 0;

  const cover_url = String(formData.get("cover_url") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "planned") as Title["status"];
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const rating = ratingRaw
    ? Math.min(10, Math.max(1, parseInt(ratingRaw, 10) || 1))
    : null;

  const minutesRaw = String(formData.get("minutes") ?? "").trim();
  const minutes = minutesRaw ? Math.max(0, parseInt(minutesRaw, 10) || 0) : 0;

  const patch: Record<string, unknown> = {
    title,
    type,
    unit_label,
    total_units,
    current_unit,
    cover_url,
    status,
    rating,
    minutes,
    notes,
    completed_at: status === "completed" ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("titles").update(patch).eq("id", id);
  if (error) return { error: error.message };

  revalidateApp();
}

export async function updateDisplayName(name: string): Promise<ActionResult> {
  const supabase = await createClient();
  const clean = name.trim().slice(0, 40);
  const { error } = await supabase.auth.updateUser({
    data: { display_name: clean },
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
}

export async function updateAvatar(id: number): Promise<ActionResult> {
  if (!isAvatarId(id)) return { error: "Invalid avatar" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { avatar_id: id },
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
}
