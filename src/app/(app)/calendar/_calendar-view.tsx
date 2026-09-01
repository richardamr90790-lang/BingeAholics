"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CAL_KIND,
  MONTH_NAMES,
  daysInMonth,
  firstWeekday,
  isoDate,
  type CalEventKind,
  type CalendarEvent,
} from "@/lib/calendar";
import { createEvent, deleteEvent } from "./actions";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

export function CalendarView({
  year,
  month,
  initialDay,
  events,
  titles,
}: {
  year: number;
  month: number;
  initialDay?: number;
  events: CalendarEvent[];
  titles: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;
  const todayDay = now.getDate();

  const [selected, setSelected] = useState<number | null>(
    initialDay ?? (isCurrentMonth ? todayDay : null),
  );
  const [adding, setAdding] = useState(false);

  const thisYear = now.getFullYear();
  const yearOptions = Array.from({ length: 9 }, (_, i) => thisYear - 3 + i);

  function goTo(y: number, m: number) {
    router.push(`/calendar?y=${y}&m=${m}`);
  }

  const byDay = new Map<number, CalendarEvent[]>();
  for (const e of events) {
    const d = parseInt(e.event_date.slice(8, 10), 10);
    const arr = byDay.get(d) ?? [];
    arr.push(e);
    byDay.set(d, arr);
  }

  const total = daysInMonth(year, month);
  const lead = firstWeekday(year, month);
  const cells: (number | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const next = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];
  const titleName = (id: string | null) =>
    id ? (titles.find((t) => t.id === id)?.title ?? null) : null;

  function run(fn: () => Promise<{ error?: string } | undefined>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createEvent(fd);
      if (res?.error) {
        setError(res.error);
      } else {
        setAdding(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        {!isCurrentMonth && (
          <Link
            href="/calendar"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Jump to today
          </Link>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        {/* Month grid */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => goTo(year, Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-[#0b0b12] px-2 py-1.5 text-sm font-medium text-violet-300 outline-none focus:border-violet-500/70 [&_option]:bg-[#0b0b12] [&_option]:text-violet-300"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => goTo(Number(e.target.value), month)}
                className="rounded-lg border border-white/10 bg-[#0b0b12] px-2 py-1.5 text-sm font-medium text-violet-300 outline-none focus:border-violet-500/70 [&_option]:bg-[#0b0b12] [&_option]:text-violet-300"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-1">
              <Link
                href={`/calendar?y=${prev.y}&m=${prev.m}`}
                className="grid size-8 place-items-center rounded-lg border border-white/10 text-zinc-400 hover:text-white"
                aria-label="Previous month"
              >
                ‹
              </Link>
              <Link
                href={`/calendar?y=${next.y}&m=${next.m}`}
                className="grid size-8 place-items-center rounded-lg border border-white/10 text-zinc-400 hover:text-white"
                aria-label="Next month"
              >
                ›
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
            {WEEKDAYS.map((w, i) => (
              <div key={i} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dayEvents = byDay.get(d) ?? [];
              const isToday = isCurrentMonth && d === todayDay;
              const isSelected = d === selected;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelected(d);
                    setAdding(false);
                  }}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-violet-600 font-semibold text-white"
                      : isToday
                        ? "bg-white/10 font-semibold text-white"
                        : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span>{d}</span>
                  <span className="flex h-1.5 gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={`size-1.5 rounded-full ${
                          isSelected ? "bg-white" : CAL_KIND[e.kind].dot
                        }`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
            {(Object.keys(CAL_KIND) as CalEventKind[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${CAL_KIND[k].dot}`} />
                {CAL_KIND[k].label}
              </span>
            ))}
          </div>
        </div>

        {/* Day panel */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-4 sm:p-5">
          {selected === null ? (
            <p className="text-sm text-zinc-500">
              Pick a day to see or add events.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {MONTH_NAMES[month - 1]} {selected}
                </h3>
                <button
                  onClick={() => setAdding((v) => !v)}
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  {adding ? "Cancel" : "+ Add"}
                </button>
              </div>

              {adding && (
                <form onSubmit={handleAdd} className="mt-3 space-y-2">
                  <input
                    type="hidden"
                    name="event_date"
                    value={isoDate(year, month, selected)}
                  />
                  <input
                    name="label"
                    required
                    autoFocus
                    placeholder="e.g. Solo Leveling Part 46"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="kind"
                      defaultValue="release"
                      className={inputClass}
                    >
                      <option value="release">Release</option>
                      <option value="plan">Plan</option>
                      <option value="note">Note</option>
                    </select>
                    <select
                      name="title_id"
                      defaultValue=""
                      className={inputClass}
                    >
                      <option value="">No title</option>
                      {titles.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
                  >
                    {pending ? "Saving…" : "Add event"}
                  </button>
                </form>
              )}

              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

              <ul className="mt-3 space-y-2">
                {selectedEvents.length === 0 && !adding && (
                  <li className="text-sm text-zinc-500">Nothing on this day.</li>
                )}
                {selectedEvents.map((e) => {
                  const name = titleName(e.title_id);
                  return (
                    <li
                      key={e.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-white/5 bg-black/20 p-2.5"
                    >
                      <div className="min-w-0">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${CAL_KIND[e.kind].chip}`}
                        >
                          {CAL_KIND[e.kind].label}
                        </span>
                        <p className="mt-1 text-sm text-zinc-100">{e.label}</p>
                        {name && <p className="text-xs text-zinc-500">{name}</p>}
                      </div>
                      <button
                        onClick={() => run(() => deleteEvent(e.id))}
                        disabled={pending}
                        className="shrink-0 text-xs text-zinc-500 hover:text-red-400"
                        aria-label="Delete event"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
