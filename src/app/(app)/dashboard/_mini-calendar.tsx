"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  CAL_KIND,
  MONTH_NAMES,
  daysInMonth,
  firstWeekday,
  isoDate,
  type CalEventKind,
  type CalendarEvent,
} from "@/lib/calendar";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function MiniCalendar({
  initialYear,
  initialMonth,
  initialEvents,
}: {
  initialYear: number;
  initialMonth: number;
  initialEvents: CalendarEvent[];
}) {
  const now = new Date();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [fetched, setFetched] = useState<CalendarEvent[] | null>(null);

  const isInitial = year === initialYear && month === initialMonth;
  const events = isInitial ? initialEvents : (fetched ?? []);
  const isThisMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;
  const todayDay = now.getDate();

  useEffect(() => {
    if (isInitial) return;
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("calendar_events")
      .select("*")
      .gte("event_date", isoDate(year, month, 1))
      .lte("event_date", isoDate(year, month, daysInMonth(year, month)))
      .then(({ data }) => {
        if (!cancelled) setFetched((data ?? []) as CalendarEvent[]);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month, isInitial]);

  function shift(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const kindByDay = new Map<number, CalEventKind>();
  for (const e of events) {
    const d = parseInt(e.event_date.slice(8, 10), 10);
    if (!kindByDay.has(d)) kindByDay.set(d, e.kind);
  }

  const total = daysInMonth(year, month);
  const lead = firstWeekday(year, month);
  const cells: (number | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#14141c] p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Binge Calendar</h2>
        <Link
          href={`/calendar?y=${year}&m=${month}`}
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          View full calendar
        </Link>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-300">
          {MONTH_NAMES[month - 1]} {year}
        </p>
        <div className="flex items-center gap-1">
          {!isThisMonth && (
            <button
              onClick={() => {
                setYear(now.getFullYear());
                setMonth(now.getMonth() + 1);
              }}
              className="mr-1 text-[11px] text-violet-400 hover:text-violet-300"
            >
              Today
            </button>
          )}
          <button
            onClick={() => shift(-1)}
            className="grid size-6 place-items-center rounded-md border border-white/10 text-zinc-400 hover:text-white"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            onClick={() => shift(1)}
            className="grid size-6 place-items-center rounded-md border border-white/10 text-zinc-400 hover:text-white"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-600">
        {WEEKDAYS.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isToday = isThisMonth && d === todayDay;
          const kind = kindByDay.get(d);
          return (
            <Link
              key={i}
              href={`/calendar?y=${year}&m=${month}&d=${d}`}
              className={`relative grid aspect-square place-items-center rounded-md text-xs transition ${
                isToday
                  ? "bg-violet-600 font-semibold text-white"
                  : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              {d}
              {kind && !isToday && (
                <span
                  className={`absolute bottom-1 size-1 rounded-full ${CAL_KIND[kind].dot}`}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-violet-600" />
          Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-violet-400" />
          Event
        </span>
      </div>
    </div>
  );
}
