"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTitle, setStatus, updateProgress } from "../actions";
import {
  progressPercent,
  STATUS_LABELS,
  TYPE_LABELS,
  type Title,
} from "@/lib/titles";
import { CheckIcon, PlusIcon, TrashIcon } from "./icons";

export function TitleCard({ title: t }: { title: Title }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const pct = progressPercent(t);

  function run(fn: () => Promise<{ error?: string } | undefined>) {
    startTransition(async () => {
      const res = await fn();
      if (res?.error) alert(res.error);
      else router.refresh();
      setMenuOpen(false);
    });
  }

  const atEnd = t.total_units != null && t.current_unit >= t.total_units;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0e0e16]/55 backdrop-blur-md transition hover:border-white/20">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
        {t.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.cover_url}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid size-full place-items-center p-3 text-center text-sm font-medium text-zinc-500">
            {t.title}
          </div>
        )}

        <div className="absolute right-1.5 top-1.5">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid size-7 place-items-center rounded-md bg-black/60 text-zinc-200 opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            aria-label="Options"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <circle cx="12" cy="5" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="12" cy="19" r="1.6" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-hidden
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-white/10 bg-[#1b1b24] py-1 text-xs shadow-xl">
                {t.status !== "completed" && (
                  <button
                    onClick={() => run(() => setStatus(t.id, "completed"))}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-zinc-200 hover:bg-white/5"
                  >
                    <CheckIcon className="size-3.5" /> Mark complete
                  </button>
                )}
                {t.status !== "in_progress" && (
                  <button
                    onClick={() => run(() => setStatus(t.id, "in_progress"))}
                    className="block w-full px-3 py-2 text-left text-zinc-200 hover:bg-white/5"
                  >
                    Move to In progress
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Delete "${t.title}"?`))
                      run(() => deleteTitle(t.id));
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-white/5"
                >
                  <TrashIcon className="size-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="line-clamp-2 text-sm font-medium text-zinc-100">
            {t.title}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {TYPE_LABELS[t.type]}
            {t.status === "completed"
              ? " · Completed"
              : ` · ${t.unit_label} ${t.current_unit}` +
                (t.total_units != null ? ` of ${t.total_units}` : "")}
          </p>
        </div>

        <div className="mt-auto">
          {pct != null && (
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {pct != null ? `${pct}%` : STATUS_LABELS[t.status]}
            </span>
            {t.status !== "completed" && (
              <button
                onClick={() =>
                  run(() => updateProgress(t.id, t.current_unit + 1))
                }
                disabled={pending || atEnd}
                className="flex items-center gap-1 rounded-md bg-violet-600/20 px-2 py-1 text-xs font-medium text-violet-300 transition hover:bg-violet-600/30 disabled:opacity-40"
              >
                <PlusIcon className="size-3.5" />
                {t.unit_label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
