import Link from "next/link";
import {
  ACTIVITY_KIND,
  activitySentence,
  timeAgo,
  type Activity,
} from "@/lib/activity";

export function RecentActivity({ items }: { items: Activity[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#14141c] p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Recent Activity</h2>
        <Link
          href="/history"
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">No activity yet.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {items.map((a) => (
            <li key={a.id} className="flex items-start gap-2.5">
              <span
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${ACTIVITY_KIND[a.kind].dot}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-200">
                  {activitySentence(a)}
                </p>
                <p className="text-[11px] text-zinc-600">
                  {timeAgo(a.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
