"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_COUNT, avatarSrc } from "@/lib/avatar";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar, updateAvatarUrl } from "../actions";

export function AvatarPicker({
  initialId,
  initialUrl,
  email,
}: {
  initialId: number | null;
  initialUrl: string | null;
  email: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(initialId);
  const [customUrl, setCustomUrl] = useState<string | null>(initialUrl);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function done() {
    setSaved(true);
    router.refresh();
  }

  function pick(id: number) {
    setSelected(id);
    setCustomUrl(null);
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await updateAvatar(id);
      if (res?.error) setError(res.error);
      else done();
    });
  }

  function removeCustom() {
    setCustomUrl(null);
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await updateAvatarUrl("");
      if (res?.error) setError(res.error);
      else done();
    });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setSaved(false);

    if (!file.type.startsWith("image/")) {
      setError("Pick an image file (jpg, png, …)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in");
        return;
      }
      const ext = (file.name.split(".").pop() || "jpg")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const path = `${user.id}/avatar-${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("covers")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setError(upErr.message);
        return;
      }
      const { data } = supabase.storage.from("covers").getPublicUrl(path);
      setCustomUrl(data.publicUrl);
      startTransition(async () => {
        const res = await updateAvatarUrl(data.publicUrl);
        if (res?.error) setError(res.error);
        else done();
      });
    } finally {
      setUploading(false);
    }
  }

  const previewSrc =
    customUrl ?? (selected != null ? avatarSrc(selected) : null);

  return (
    <div className="max-w-lg space-y-4 rounded-xl border border-white/5 bg-[#14141c] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Avatar</p>
        {saved && <span className="text-xs text-emerald-400">Saved</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <div className="flex items-center gap-3">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="" className="size-full object-cover" />
          ) : (
            email.charAt(0).toUpperCase()
          )}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5">
            {uploading
              ? "Uploading…"
              : customUrl
                ? "Replace photo"
                : "Upload a photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
              disabled={uploading || pending}
            />
          </label>
          {customUrl && (
            <button
              type="button"
              onClick={removeCustom}
              disabled={pending}
              className="text-xs text-zinc-500 hover:text-red-400"
            >
              Remove
            </button>
          )}
          <span className="text-[11px] text-zinc-600">
            jpg / png / webp · up to 5 MB
          </span>
        </div>
      </div>

      <div className="border-t border-white/5 pt-3">
        <p className="mb-2 text-xs text-zinc-500">…or pick one</p>
        <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
          {Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              disabled={pending}
              aria-label={`Avatar ${id}`}
              className={`overflow-hidden rounded-full border-2 transition ${
                !customUrl && selected === id
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
    </div>
  );
}
