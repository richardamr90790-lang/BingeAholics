"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { updateTitle } from "../actions";
import {
  STATUS_LABELS,
  TYPE_LABELS,
  type Title,
  type TitleStatus,
} from "@/lib/titles";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

export function EditTitleDialog({
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateTitle(t.id, formData);
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
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">Edit title</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Title
            </label>
            <input
              name="title"
              required
              defaultValue={t.title}
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
                defaultValue={t.type}
                className={`${inputClass} [&_option]:bg-[#0b0b12] [&_option]:text-zinc-100`}
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
                defaultValue={t.unit_label}
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
                defaultValue={t.current_unit}
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
                defaultValue={t.total_units ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Status
              </label>
              <select
                name="status"
                defaultValue={t.status}
                className={`${inputClass} [&_option]:bg-[#0b0b12] [&_option]:text-zinc-100`}
              >
                {(Object.keys(STATUS_LABELS) as TitleStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Rating <span className="text-zinc-600">(1–10)</span>
              </label>
              <input
                name="rating"
                type="number"
                min={1}
                max={10}
                defaultValue={t.rating ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Time spent{" "}
              <span className="text-zinc-600">(minutes, optional)</span>
            </label>
            <input
              name="minutes"
              type="number"
              min={0}
              defaultValue={t.minutes || ""}
              placeholder="e.g. 320"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Cover image URL <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              name="cover_url"
              type="url"
              defaultValue={t.cover_url ?? ""}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Notes <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={t.notes ?? ""}
              className={`${inputClass} resize-none`}
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
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
