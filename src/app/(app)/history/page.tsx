import {
  ACTIVITY_KIND,
  activitySentence,
  listActivity,
  timeAgo,
  type Activity,
} from "@/lib/data/activity";
import { PageHeader } from "../_components/page-header";

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default async function HistoryPage() {
  const items = await listActivity(300);

  const groups: { label: string; items: Activity[] }[] = [];
  for (const a of items) {
    const label = dayLabel(a.created_at);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(a);
    else groups.push({ label, items: [a] });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="History"
        subtitle="Everything you've logged."
        bgPos="0% 45%"
      />


      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-zinc-500">
          Nothing here yet. Add a title or bump some progress.
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.label}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {g.label}
            </h2>
            <ul className="rounded-xl border border-white/10 bg-[#14141c] p-2">
              {g.items.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.03]"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${ACTIVITY_KIND[a.kind].dot}`}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                    {activitySentence(a)}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-600">
                    {timeAgo(a.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
