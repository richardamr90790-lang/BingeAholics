"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_STYLES, avatarUrl } from "@/lib/avatar";
import { updateAvatar } from "../actions";

export function AvatarPicker({
  initialStyle,
  initialSeed,
}: {
  initialStyle: string;
  initialSeed: string;
}) {
  const router = useRouter();
  const [style, setStyle] = useState(initialStyle);
  const [seed, setSeed] = useState(initialSeed);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(false);
    startTransition(async () => {
      const res = await updateAvatar(style, seed);
      if (!res?.error) {
        setSaved(true);
        router.refresh();
      }
    });
  }

  function shuffle() {
    setSeed(Math.random().toString(36).slice(2, 10));
    setSaved(false);
  }

  return (
    <div className="max-w-md space-y-4 rounded-xl border border-white/5 bg-[#14141c] p-5">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl(style, seed, 128)}
          alt=""
          className="size-16 rounded-full bg-white/5"
        />
        <div>
          <p className="text-sm font-medium text-white">Avatar</p>
          <button
            type="button"
            onClick={shuffle}
            className="mt-1 text-xs text-violet-400 hover:text-violet-300"
          >
            Shuffle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {AVATAR_STYLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStyle(s);
              setSaved(false);
            }}
            aria-label={s}
            className={`rounded-lg border p-1.5 transition ${
              style === s
                ? "border-violet-500 bg-violet-500/10"
                : "border-white/10 hover:border-white/25"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl(s, seed, 96)}
              alt={s}
              className="size-full rounded-md"
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save avatar"}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved</span>}
      </div>
    </div>
  );
}
