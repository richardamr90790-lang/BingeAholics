"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Title } from "@/lib/titles";

export type ActionResult = { error?: string } | undefined;

function revalidateApp() {
  revalidatePath("/dashboard");
  revalidatePath("/library");
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
  const { error } = await supabase.from("titles").insert({
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
  });
  if (error) return { error: error.message };

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

  revalidateApp();
}

export async function setStatus(
  id: string,
  status: Title["status"],
): Promise<ActionResult> {
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "completed") patch.completed_at = new Date().toISOString();
  if (status === "in_progress") patch.completed_at = null;

  const { error } = await supabase.from("titles").update(patch).eq("id", id);
  if (error) return { error: error.message };

  revalidateApp();
}

export async function deleteTitle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("titles").delete().eq("id", id);
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
