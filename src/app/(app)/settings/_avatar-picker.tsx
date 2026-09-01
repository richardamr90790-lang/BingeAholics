"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_COUNT, avatarSrc } from "@/lib/avatar";
import { updateAvatar } from "../actions";

export function AvatarPicker({ initialId }: { initialId: number | null }) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(initialId);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pick(id: number) {
    setSelected(id);
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await updateAvatar(id);
      if (res?.error) {
        setError(res.error);
      } else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-lg space-y-3 rounded-xl border border-white/5 bg-[#14141c] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Avatar</p>
        {saved && <span className="text-xs text-emerald-400">Saved</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
        {Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => pick(id)}
            disabled={pending}
            aria-label={`Avatar ${id}`}
            className={`overflow-hidden rounded-full border-2 transition ${
              selected === id
                ? "border-violet-500"
                : "border-transparent hover:border-white/30"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc(id)}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
