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

export function avatarStyleOf(user: MinimalUser): string {
  const meta = (user?.user_metadata ?? {}) as { avatar_style?: string };
  return typeof meta.avatar_style === "string" && meta.avatar_style
    ? meta.avatar_style
    : "adventurer";
}

export function avatarSeedOf(user: MinimalUser): string {
  const meta = (user?.user_metadata ?? {}) as { avatar_seed?: string };
  if (typeof meta.avatar_seed === "string" && meta.avatar_seed)
    return meta.avatar_seed;
  return user?.email ?? "bingeaholic";
}
