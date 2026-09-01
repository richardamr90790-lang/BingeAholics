import {
  formatMinutes,
  listTitles,
  STATUS_LABELS,
  TYPE_LABELS,
  type TitleStatus,
  type TitleType,
} from "@/lib/data/titles";
import { listActivity } from "@/lib/data/activity";

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function StatsPage() {
  const [titles, activity] = await Promise.all([
    listTitles(),
    listActivity(1000),
  ]);

  const total = titles.length;

  const byStatus = new Map<TitleStatus, number>();
  const byType = new Map<TitleType, number>();
  for (const t of titles) {
    byStatus.set(t.status, (byStatus.get(t.status) ?? 0) + 1);
    byType.set(t.type, (byType.get(t.type) ?? 0) + 1);
  }

  const completed = byStatus.get("completed") ?? 0;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const unitsConsumed = titles.reduce((s, t) => s + (t.current_unit || 0), 0);
  const totalMinutes = titles.reduce((s, t) => s + (t.minutes || 0), 0);

  const typeRows = [...byType.entries()].sort((a, b) => b[1] - a[1]);
  const statusRows = (Object.keys(STATUS_LABELS) as TitleStatus[])
    .map((s) => [s, byStatus.get(s) ?? 0] as const)
    .filter(([, n]) => n > 0);

  const maxType = Math.max(1, ...typeRows.map(([, n]) => n));
  const maxStatus = Math.max(1, ...statusRows.map(([, n]) => n));

  // activity for the last 14 days
  const days: { label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = activity.filter((a) => {
      const ts = new Date(a.created_at).getTime();
      return ts >= d.getTime() && ts < next.getTime();
    }).length;
    days.push({
      label: d.toLocaleDateString(undefined, { day: "numeric" }),
      count,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));
  const weekCount = days.slice(7).reduce((s, d) => s + d.count, 0);

  const rated = titles
    .filter((t) => t.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  const tiles = [
    { label: "Tracked", value: total },
    { label: "Completed", value: completed },
    { label: "Total time", value: formatMinutes(totalMinutes) },
    { label: "Completion rate", value: `${completionRate}%` },
    { label: "Units logged", value: unitsConsumed },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Binge Stats</h1>

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-zinc-500">
          Add and track some titles to see stats here.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {tiles.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-white/5 bg-[#14141c] p-4"
              >
                <p className="text-2xl font-bold text-white">{t.value}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{t.label}</p>
              </div>
            ))}
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#14141c] p-5">
              <h2 className="mb-4 font-semibold text-white">By type</h2>
              <ul className="space-y-3">
                {typeRows.map(([type, n]) => (
                  <li key={type} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{TYPE_LABELS[type]}</span>
                      <span>{n}</span>
                    </div>
                    <Bar value={n} max={maxType} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#14141c] p-5">
              <h2 className="mb-4 font-semibold text-white">By status</h2>
              <ul className="space-y-3">
                {statusRows.map(([status, n]) => (
                  <li key={status} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{STATUS_LABELS[status]}</span>
                      <span>{n}</span>
                    </div>
                    <Bar value={n} max={maxStatus} />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-white/10 bg-[#14141c] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Activity — last 14 days</h2>
              <span className="text-xs text-zinc-500">
                {weekCount} this week
              </span>
            </div>
            <div className="flex h-24 items-end gap-1.5">
              {days.map((d, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1"
                  title={`${d.count} on the ${d.label}`}
                >
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-violet-600 to-indigo-500"
                    style={{
                      height: `${Math.max(4, (d.count / maxDay) * 100)}%`,
                    }}
                  />
                  <span className="text-[9px] text-zinc-600">{d.label}</span>
                </div>
              ))}
            </div>
          </section>

          {rated.length > 0 && (
            <section className="rounded-2xl border border-white/10 bg-[#14141c] p-5">
              <h2 className="mb-4 font-semibold text-white">Top rated</h2>
              <ul className="space-y-2">
                {rated.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="min-w-0 truncate text-zinc-200">
                      {t.title}
                    </span>
                    <span className="ml-3 shrink-0 rounded bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-300">
                      {t.rating}/10
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
