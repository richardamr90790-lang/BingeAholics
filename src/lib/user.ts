import type { User } from "@supabase/supabase-js";

type MinimalUser = Pick<User, "email" | "user_metadata"> | null | undefined;

/** The name to store from Settings. Empty string if none set. */
export function storedDisplayName(user: MinimalUser): string {
  const meta = (user?.user_metadata ?? {}) as { display_name?: string };
  return typeof meta.display_name === "string" ? meta.display_name.trim() : "";
}

/** What to actually show in the UI: the stored name, or a tidy guess from the email. */
export function displayName(user: MinimalUser): string {
  const stored = storedDisplayName(user);
  if (stored) return stored;

  const local = (user?.email ?? "there").split("@")[0] ?? "there";
  const firstChunk = local.split(/[.\-_0-9]+/).filter(Boolean)[0] ?? local;
  return firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);
}

export function avatarIdOf(user: MinimalUser): number | null {
  const meta = (user?.user_metadata ?? {}) as { avatar_id?: unknown };
  const v = meta.avatar_id;
  return typeof v === "number" && v >= 1 && v <= 50 ? Math.floor(v) : null;
}

/** A user-uploaded avatar URL, if they set one (takes precedence over avatar_id). */
export function avatarUrlOf(user: MinimalUser): string | null {
  const meta = (user?.user_metadata ?? {}) as { avatar_url?: unknown };
  const v = meta.avatar_url;
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}

/** Has the user finished (or skipped) the welcome tour? */
export function hasOnboarded(user: MinimalUser): boolean {
  const meta = (user?.user_metadata ?? {}) as { onboarded_at?: unknown };
  return typeof meta.onboarded_at === "string" && meta.onboarded_at.length > 0;
}
