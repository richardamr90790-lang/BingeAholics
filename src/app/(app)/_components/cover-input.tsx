"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INPUT =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

function parsePos(p: string): [number, number] {
  const m = /(-?\d+)%\s+(-?\d+)%/.exec(p || "");
  if (!m) return [50, 50];
  return [
    Math.min(100, Math.max(0, Number(m[1]))),
    Math.min(100, Math.max(0, Number(m[2]))),
  ];
}

export function CoverInput({
  initialUrl = "",
  initialPos = "50% 50%",
}: {
  initialUrl?: string;
  initialPos?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [[x, y], setXY] = useState<[number, number]>(parsePos(initialPos));
  const [showUrl, setShowUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pos = `${x}% ${y}%`;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);

    if (!file.type.startsWith("image/")) {
      setErr("Pick an image file (jpg, png, …)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setErr("Not signed in");
        return;
      }
      const ext = (file.name.split(".").pop() || "jpg")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("covers")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        setErr(error.message);
        return;
      }
      const { data } = supabase.storage.from("covers").getPublicUrl(path);
      setUrl(data.publicUrl);
      setXY([50, 50]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="cover_url" value={url} />
      <input type="hidden" name="cover_position" value={pos} />

      <label className="mb-1 block text-xs font-medium text-zinc-400">
        Cover image <span className="text-zinc-600">(optional)</span>
      </label>

      <div className="flex gap-3">
        <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="size-full object-cover"
              style={{ objectPosition: pos }}
            />
          ) : (
            <div className="grid size-full place-items-center text-[10px] text-zinc-600">
              none
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5">
              {uploading
                ? "Uploading…"
                : url
                  ? "Replace image"
                  : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFile}
                disabled={uploading}
              />
            </label>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setShowUrl(false);
                }}
                className="text-xs text-zinc-500 hover:text-red-400"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowUrl((v) => !v)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              {showUrl ? "Hide URL field" : "Use a URL instead"}
            </button>
          </div>

          {showUrl && (
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={INPUT}
            />
          )}

          {url && (
            <div className="space-y-1.5 pt-1">
              <Slider
                label="Horizontal"
                value={x}
                onChange={(v) => setXY([v, y])}
              />
              <Slider
                label="Vertical"
                value={y}
                onChange={(v) => setXY([x, v])}
              />
              <button
                type="button"
                onClick={() => setXY([50, 50])}
                className="text-[11px] text-zinc-500 hover:text-zinc-300"
              >
                Re-centre
              </button>
            </div>
          )}
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-zinc-500">
      <span className="w-16 shrink-0">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 accent-violet-500"
      />
    </label>
  );
}
