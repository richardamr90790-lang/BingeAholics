export type CalEventKind = "release" | "plan" | "note";

export type CalendarEvent = {
  id: string;
  user_id: string;
  title_id: string | null;
  label: string;
  event_date: string; // YYYY-MM-DD
  kind: CalEventKind;
  created_at: string;
};

export const CAL_KIND: Record<
  CalEventKind,
  { label: string; dot: string; text: string; chip: string }
> = {
  release: {
    label: "Release",
    dot: "bg-violet-400",
    text: "text-violet-300",
    chip: "bg-violet-500/15 text-violet-300",
  },
  plan: {
    label: "Plan",
    dot: "bg-sky-400",
    text: "text-sky-300",
    chip: "bg-sky-500/15 text-sky-300",
  },
  note: {
    label: "Note",
    dot: "bg-amber-400",
    text: "text-amber-300",
    chip: "bg-amber-500/15 text-amber-300",
  },
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Local YYYY-MM-DD for a given year/month(1-12)/day. */
export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Weekday index (0 = Sunday) of the 1st of the month. */
export function firstWeekday(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}
