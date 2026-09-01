"use client";

import { useState } from "react";
import { avatarSrc } from "@/lib/avatar";

export function Avatar({
  id,
  fallback,
  size = 24,
  className = "",
}: {
  id: number | null;
  fallback: string;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (id == null || broken) {
    return (
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
      >
        {fallback.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarSrc(id)}
      alt=""
      width={size}
      height={size}
      onError={() => setBroken(true)}
      className={`shrink-0 rounded-full bg-white/5 object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
