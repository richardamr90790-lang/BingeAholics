"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTitle, setStatus } from "../actions";
import {
  progressPercent,
  STATUS_LABELS,
  TYPE_LABELS,
  titleHue,
  type Title,
  type TitleType,
} from "@/lib/titles";
import {
  BookIcon,
  CheckIcon,
  GamepadIcon,
  GradCapIcon,
  HeadphonesIcon,
  LibraryIcon,
  PlayCircleIcon,
  TrashIcon,
  TvIcon,
} from "./icons";
import { EditTitleDialog } from "./edit-title-dialog";
import { AdvanceDialog } from "./advance-dialog";

const PLACEHOLDER_ICON: Record<TitleType, typeof BookIcon> = {
  anime: TvIcon,
  video: PlayCircleIcon,
  manga: BookIcon,
  manhwa: BookIcon,
  book: BookIcon,
  podcast: HeadphonesIcon,
  game: GamepadIcon,
  course: GradCapIcon,
  other: LibraryIcon,
};

function CoverPlaceholder({
  title,
  type,
}: {
  title: string;
  type: TitleType;
}) {
  const hue = titleHue(title);
  const Icon = PLACEHOLDER_ICON[type];
  return (
    <div
      className="relative flex size-full items-center justify-center p-3 text-center"
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 42% 22%), hsl(${(hue + 55) % 360} 36% 10%))`,
      }}
    >
      <Icon className="absolute size-16 text-white/10" />
      <span className="relative line-clamp-3 text-sm font-medium text-white/85">
        {title}
      </span>
    </div>
  );
}

export function TitleCard({ title: t }: { title: Title }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [advancing, setAdvancing] = useState(false);
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#14141c] transition hover:border-white/10">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
        {t.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.cover_url}
            alt=""
            className="size-full object-cover"
            style={{ objectPosition: t.cover_position || "50% 50%" }}
            loading="lazy"
          />
        ) : (
          <CoverPlaceholder title={t.title} type={t.type} />
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
                <button
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-zinc-200 hover:bg-white/5"
                >
                  Edit
                </button>
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
                className="acc-bg h-full rounded-full transition-[background-color,width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          {t.link_url && (
            <a
              href={t.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="acc-text mb-1.5 inline-flex items-center gap-1 text-[11px] font-medium transition hover:brightness-125"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
              {t.status === "planned"
                ? "Start"
                : t.status === "completed"
                  ? "Revisit"
                  : "Jump back in"}
            </a>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-xs text-zinc-500">
              {t.current_unit > 0
                ? `${t.unit_label} ${t.current_unit} · ${STATUS_LABELS[t.status]}`
                : STATUS_LABELS[t.status]}
            </span>
            {t.status !== "completed" && (
              <button
                onClick={() => setAdvancing(true)}
                disabled={pending || atEnd}
                className="acc-bg-soft acc-text flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition hover:brightness-125 disabled:opacity-40"
              >
                Next {t.unit_label}
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <EditTitleDialog
        key={editing ? "open" : "closed"}
        title={t}
        open={editing}
        onClose={() => setEditing(false)}
      />

      <AdvanceDialog
        key={advancing ? "adv-open" : "adv-closed"}
        title={t}
        open={advancing}
        onClose={() => setAdvancing(false)}
      />
    </div>
  );
}
