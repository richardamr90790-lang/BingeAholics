"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { updateProgress } from "../actions";
import type { Title } from "@/lib/titles";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

function prettyLink(url: string): string {
  try {
    const u = new URL(url);
    const tail = (u.pathname + u.search).replace(/^\//, "");
    return u.host.replace(/^www\./, "") + (tail ? "/" + tail : "");
  } catch {
    return url;
  }
}

export function AdvanceDialog({
  title: t,
  open,
  onClose,
}: {
  title: Title;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState(false);
  const [link, setLink] = useState("");

  const nextUnit = t.current_unit + 1;
  const unit = t.unit_label.toLowerCase();
  const hasLink = Boolean(t.link_url);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  function save() {
    setError(null);
    const newLink = editingLink ? link.trim() : "";
    startTransition(async () => {
      const res = await updateProgress(t.id, nextUnit, newLink || undefined);
      if (res?.error) {
        setError(res.error);
      } else {
        onClose();
        router.refresh();
      }
    });
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#14141c] p-5 shadow-2xl">
        <p className="text-base font-semibold text-white">
          🎬 {t.unit_label} {nextUnit}
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          You&apos;re moving to the next {unit}.
        </p>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs font-medium text-zinc-300">
            {hasLink
              ? "Update your watch link?"
              : "Add a watch link for this part?"}
          </p>
          {hasLink && !editingLink && (
            <p className="mt-1 truncate text-xs text-zinc-500">
              Current link:{" "}
              <span className="text-zinc-400">{prettyLink(t.link_url!)}</span>
            </p>
          )}

          {editingLink ? (
            <>
              <input
                autoFocus
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://…  (paste the new link)"
                className={`${inputClass} mt-2`}
              />
              <button
                type="button"
                onClick={() => {
                  setEditingLink(false);
                  setLink("");
                }}
                className="mt-1.5 text-[11px] text-zinc-500 underline transition hover:text-zinc-300"
              >
                {hasLink ? "keep current link instead" : "skip the link"}
              </button>
            </>
          ) : (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="flex-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/5 disabled:opacity-50"
              >
                {hasLink ? "Keep current link" : "Skip for now"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLink("");
                  setEditingLink(true);
                }}
                className="flex-1 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
              >
                {hasLink ? "Update link" : "Add link"}
              </button>
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save & continue"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
