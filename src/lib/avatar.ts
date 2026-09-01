export const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "fun-emoji",
  "notionists",
  "open-peeps",
  "micah",
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number];

export function isAvatarStyle(v: string): v is AvatarStyle {
  return (AVATAR_STYLES as readonly string[]).includes(v);
}

/** DiceBear-generated SVG avatar (cartoon / caricature) for a style + seed. */
export function avatarUrl(style: string, seed: string, size = 96): string {
  const s = isAvatarStyle(style) ? style : "adventurer";
  const params = new URLSearchParams({
    seed: seed || "bingeaholic",
    size: String(size),
    radius: "50",
    backgroundType: "gradientLinear",
  });
  return `https://api.dicebear.com/9.x/${s}/svg?${params.toString()}`;
}
