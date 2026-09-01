import { listEventsForMonth } from "@/lib/data/calendar";
import { listTitles } from "@/lib/data/titles";
import { CalendarView } from "./_calendar-view";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const { y, m } = await searchParams;
  const now = new Date();

  let year = parseInt(y ?? "", 10);
  let month = parseInt(m ?? "", 10);
  if (!Number.isInteger(year) || year < 1970 || year > 3000)
    year = now.getFullYear();
  if (!Number.isInteger(month) || month < 1 || month > 12)
    month = now.getMonth() + 1;

  const [events, titles] = await Promise.all([
    listEventsForMonth(year, month),
    listTitles(),
  ]);

  return (
    <CalendarView
      year={year}
      month={month}
      events={events}
      titles={titles.map((t) => ({ id: t.id, title: t.title }))}
    />
  );
}
