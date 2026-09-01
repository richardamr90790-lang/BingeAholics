import { createClient } from "@/lib/supabase/server";
import { daysInMonth, isoDate, type CalendarEvent } from "@/lib/calendar";

export type { CalendarEvent, CalEventKind } from "@/lib/calendar";
export { CAL_KIND, MONTH_NAMES } from "@/lib/calendar";

export async function listEventsForMonth(
  year: number,
  month: number,
): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const start = isoDate(year, month, 1);
  const end = isoDate(year, month, daysInMonth(year, month));

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("event_date", start)
    .lte("event_date", end)
    .order("event_date", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CalendarEvent[];
}
