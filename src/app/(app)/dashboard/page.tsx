import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/user";
import {
  CATEGORIES,
  getContinueWatching,
  getStats,
  listTitles,
  type Category,
} from "@/lib/data/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";
import {
  TvIcon,
  BookIcon,
  HeadphonesIcon,
  GamepadIcon,
  GradCapIcon,
  BookmarkIcon,
  PlayCircleIcon,
  CheckIcon,
  CalendarIcon,
} from "../_components/icons";

const CATEGORY_STYLE: Record<
  Category,
  { Icon: typeof TvIcon; color: string }
> = {
  watch: { Icon: TvIcon, color: "text-rose-400" },
  read: { Icon: BookIcon, color: "text-emerald-400" },
  listen: { Icon: HeadphonesIcon, color: "text-sky-400" },
  play: { Icon: GamepadIcon, color: "text-violet-400" },
  learn: { Icon: GradCapIcon, color: "text-amber-400" },
};

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

  const statRows = [
    {
      label: "Tracked",
      value: stats.total,
      Icon: BookmarkIcon,
      color: "text-violet-400",
    },
    {
      label: "In progress",
      value: stats.inProgress,
      Icon: PlayCircleIcon,
      color: "text-sky-400",
    },
    {
      label: "Completed",
      value: stats.completed,
      Icon: CheckIcon,
      color: "text-emerald-400",
    },
    {
      label: "Planned",
      value: stats.planned,
      Icon: CalendarIcon,
      color: "text-amber-400",
    },
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Full-bleed hero banner: breaks out of <main>'s padding so the
            artwork sits flush against the sidebar, the right edge and the
            topbar. Welcome on the left, stats on the right. */}
        <section className="relative -mx-4 -mt-4 overflow-hidden border-b border-white/10 sm:-mx-6 sm:-mt-6">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/hero.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 38%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a10]/95 via-[#0a0a10]/25 to-[#0a0a10]/70" />

          <div className="relative flex flex-col lg:flex-row">
            <div className="flex-1 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Welcome back,
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                {displayName(user)}
              </h1>
              <p className="mt-2 text-sm text-zinc-300/90">
                Track it all. Never lose your place again.
              </p>

              <div className="mt-6 flex flex-wrap items-start gap-6">
                {CATEGORIES.map((c) => {
                  const { Icon, color } = CATEGORY_STYLE[c.key];
                  return (
                    <Link
                      key={c.key}
                      href={`/library?category=${c.key}`}
                      className="flex flex-col items-center gap-1.5 transition hover:-translate-y-0.5"
                    >
                      <Icon className={`size-6 ${color}`} />
                      <span className={`text-xs font-medium ${color}`}>
                        {c.label}
                      </span>
                    </Link>
                  );
                })}

                <div className="ml-auto self-center">
                  <AddTitleButton label="Add a title" />
                </div>
              </div>
            </div>

            <div className="w-full border-t border-white/10 bg-[#0a0a10]/55 p-5 backdrop-blur-sm lg:w-80 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Your Stats</h2>
                <span className="text-xs text-zinc-400">All time</span>
              </div>
              <ul className="mt-2 divide-y divide-white/10">
                {statRows.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-xs text-zinc-400">{r.label}</p>
                      <p className="text-lg font-bold text-white">{r.value}</p>
                    </div>
                    <span
                      className={`grid size-8 place-items-center rounded-lg bg-white/10 ${r.color}`}
                    >
                      <r.Icon className="size-4" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Continue Watching
            </h2>
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
    </>
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
