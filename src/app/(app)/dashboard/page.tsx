import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getContinueWatching,
  getStats,
  listTitles,
} from "@/lib/data/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";

function firstName(email: string) {
  const raw = email.split("@")[0] ?? "there";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [continueWatching, stats, library] = await Promise.all([
    getContinueWatching(),
    getStats(),
    listTitles(),
  ]);

  const statCards = [
    { label: "Tracked", value: stats.total },
    { label: "In progress", value: stats.inProgress },
    { label: "Completed", value: stats.completed },
    { label: "Planned", value: stats.planned },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 via-[#14141c] to-[#14141c] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Welcome back,
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
          {firstName(user?.email ?? "there")}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Track it all. Never lose your place again.
        </p>
        <div className="mt-5">
          <AddTitleButton label="Add a title" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/5 bg-[#14141c] p-4"
          >
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
          <Link
            href="/library"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            View all
          </Link>
        </div>
        {continueWatching.length === 0 ? (
          <EmptyState
            message={
              stats.total === 0
                ? "Nothing tracked yet."
                : "Nothing in progress. Bump a title to get going."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {continueWatching.map((t) => (
              <TitleCard key={t.id} title={t} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">My Library</h2>
          <Link
            href="/library"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            View all
          </Link>
        </div>
        {library.length === 0 ? (
          <EmptyState message="Your library is empty." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {library.slice(0, 12).map((t) => (
              <TitleCard key={t.id} title={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
      <p className="text-sm text-zinc-500">{message}</p>
      <AddTitleButton label="Add a title" variant="ghost" />
    </div>
  );
}
