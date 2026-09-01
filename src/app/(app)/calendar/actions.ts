"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CalActionResult = { error?: string } | undefined;

export async function createEvent(
  formData: FormData,
): Promise<CalActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const label = String(formData.get("label") ?? "").trim();
  const event_date = String(formData.get("event_date") ?? "").trim();
  const kind = String(formData.get("kind") ?? "release");
  const title_id = String(formData.get("title_id") ?? "").trim() || null;

  if (!label) return { error: "Add a label" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event_date)) return { error: "Pick a date" };
  if (!["release", "plan", "note"].includes(kind))
    return { error: "Invalid kind" };

  const { error } = await supabase.from("calendar_events").insert({
    user_id: user.id,
    label,
    event_date,
    kind,
    title_id,
  });
  if (error) return { error: error.message };

  revalidatePath("/calendar");
}

export async function deleteEvent(id: string): Promise<CalActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/calendar");
}
