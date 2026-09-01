export const AVATAR_COUNT = 50;

export function isAvatarId(v: unknown): v is number {
  return (
    typeof v === "number" &&
    Number.isInteger(v) &&
    v >= 1 &&
    v <= AVATAR_COUNT
  );
}

export function avatarSrc(id: number): string {
  const n = isAvatarId(id) ? id : 1;
  return `/avatars/${n}.webp`;
}
