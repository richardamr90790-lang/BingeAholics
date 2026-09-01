"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createTitle, generateCover, youtubeMeta } from "../actions";
import { TYPE_LABELS, type TitleType } from "@/lib/titles";
import { CoverInput } from "./cover-input";
import { useToast } from "./toast";

const TYPE_DEFAULT_UNIT: Record<TitleType, string> = {
  anime: "Episode",
  manga: "Chapter",
  manhwa: "Part",
  book: "Page",
  video: "Part",
  podcast: "Episode",
  game: "Chapter",
  course: "Lesson",
  other: "Part",
};

export function AddTitleDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [titleValue, setTitleValue] = useState("");
  const [type, setType] = useState<TitleType>("other");
  const [unitLabel, setUnitLabel] = useState("Part");
  const [linkValue, setLinkValue] = useState("");
  const [autoCover, setAutoCover] = useState(true);

  const [ytUrl, setYtUrl] = useState("");
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);
  const [thumb, setThumb] = useState("");
  const [coverKey, setCoverKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  async function fillFromYouTube() {
    const url = ytUrl.trim();
    if (!url) return;
    setYtError(null);
    setYtLoading(true);
    const res = await youtubeMeta(url);
    setYtLoading(false);
    if (res.error) {
      setYtError(res.error);
      return;
    }
    if (res.title) setTitleValue(res.title);
    setType("video");
    setUnitLabel("Part");
    setLinkValue(url);
    if (res.thumbnail) {
      setThumb(res.thumbnail);
      setCoverKey((k) => k + 1);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const wantsCover =
      autoCover && !String(formData.get("cover_url") ?? "").trim();
    startTransition(async () => {
      const res = await createTitle(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        onClose();
        router.refresh();
        if (wantsCover && res?.id) {
          // Detached: runs as its own request; the card shows its placeholder
          // until this lands, then we refresh again.
          generateCover(res.id).then((r) => {
            if (r?.error) toast(`Cover generation failed: ${r.error}`, "error");
            else router.refresh();
          });
        }
      }
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#14141c] p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">Add a title</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Track anything — an anime, a manhwa recap series, a book.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <label className="mb-1 block text-xs font-medium text-zinc-300">
              Paste a YouTube link{" "}
              <span className="text-zinc-600">— auto-fills the rest</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fillFromYouTube();
                  }
                }}
                placeholder="https://youtube.com/watch?v=…"
                className={inputClass}
              />
              <button
                type="button"
                onClick={fillFromYouTube}
                disabled={ytLoading || !ytUrl.trim()}
                className="shrink-0 rounded-lg border border-white/15 px-3 text-sm text-zinc-200 transition hover:bg-white/5 disabled:opacity-40"
              >
                {ytLoading ? "…" : "Fill"}
              </button>
            </div>
            {ytError && <p className="mt-1 text-xs text-red-400">{ytError}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Title
            </label>
            <input
              name="title"
              required
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              placeholder="Solo Leveling (Recap)"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Type
              </label>
              <select
                name="type"
                value={type}
                onChange={(e) => {
                  const next = e.target.value as TitleType;
                  setType(next);
                  setUnitLabel(TYPE_DEFAULT_UNIT[next] ?? "Part");
                }}
                className={inputClass}
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Unit label
              </label>
              <input
                name="unit_label"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                placeholder="Part"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Currently on
              </label>
              <input
                name="current_unit"
                type="number"
                min={0}
                defaultValue={0}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Total <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                name="total_units"
                type="number"
                min={0}
                placeholder="45"
                className={inputClass}
              />
            </div>
          </div>

          <CoverInput key={coverKey} initialUrl={thumb} />

          <label className="flex items-start gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={autoCover}
              onChange={(e) => setAutoCover(e.target.checked)}
              className="mt-0.5 accent-violet-500"
            />
            <span>
              ✨ Generate a cover from the title if I don&apos;t upload one
              <span className="mt-0.5 block text-zinc-600">
                Takes a few seconds after saving. You can redo it from the card
                menu.
              </span>
            </span>
          </label>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Link <span className="text-zinc-600">(where to watch / read)</span>
            </label>
            <input
              name="link_url"
              type="url"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {pending ? "Adding…" : "Add title"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
