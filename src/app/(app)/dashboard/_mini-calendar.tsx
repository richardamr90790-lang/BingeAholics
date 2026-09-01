import Link from "next/link";
import {
  CAL_KIND,
  MONTH_NAMES,
  daysInMonth,
  firstWeekday,
  type CalEventKind,
  type CalendarEvent,
} from "@/lib/calendar";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function MiniCalendar({ events }: { events: CalendarEvent[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const todayDay = now.getDate();

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
          href="/calendar"
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          View full calendar
        </Link>
      </div>

      <p className="mt-3 text-sm font-medium text-zinc-300">
        {MONTH_NAMES[month - 1]} {year}
      </p>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-600">
        {WEEKDAYS.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isToday = d === todayDay;
          const kind = kindByDay.get(d);
          return (
            <Link
              key={i}
              href="/calendar"
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
