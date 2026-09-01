import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/user";
import {
  CATEGORIES,
  CATEGORY_ACCENT,
  categoryTypes,
  formatMinutes,
  getContinueWatching,
  getStats,
  listTitles,
  type Category,
} from "@/lib/data/titles";
import { listEventsForMonth } from "@/lib/data/calendar";
import { listActivity, getStreak } from "@/lib/data/activity";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";
import { MiniCalendar } from "./_mini-calendar";
import { RecentActivity } from "./_recent-activity";
import { MyStuff } from "./_my-stuff";
import { SectionHeader } from "./_section-header";
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
  HistoryIcon,
  PauseIcon,
  XCircleIcon,
} from "../_components/icons";

// AI cover generation (a Server Action reached from the title cards on this
// page) can take longer than the default function budget.
export const maxDuration = 60;

const CATEGORY_STYLE: Record<
  Category,
  { Icon: typeof TvIcon; color: string }
> = {
  watch: { Icon: TvIcon, color: "text-rose-400" },
  read: { Icon: BookIcon, color: "text-emerald-400" },
  listen: { Icon: HeadphonesIcon, color: "text-cyan-400" },
  play: { Icon: GamepadIcon, color: "text-violet-400" },
  learn: { Icon: GradCapIcon, color: "text-amber-400" },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { cat } = await searchParams;
  const activeCat: Category =
    CATEGORIES.find((c) => c.key === cat)?.key ?? "watch";
  const vaultTypes = categoryTypes(activeCat) ?? [];

  const now = new Date();
  const [
    continueWatching,
    stats,
    library,
    calendarEvents,
    recentActivity,
    streak,
  ] = await Promise.all([
    getContinueWatching(),
    getStats(),
    listTitles(),
    listEventsForMonth(now.getFullYear(), now.getMonth() + 1),
    listActivity(5),
    getStreak(),
  ]);

  const vaultTitles = library.filter((t) => vaultTypes.includes(t.type));
  const oneMore = continueWatching.filter((t) => vaultTypes.includes(t.type));

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
    ...(stats.onHold > 0
      ? [
          {
            label: "On hold",
            value: stats.onHold,
            Icon: PauseIcon,
            color: "text-orange-400",
          },
        ]
      : []),
    ...(stats.dropped > 0
      ? [
          {
            label: "Dropped",
            value: stats.dropped,
            Icon: XCircleIcon,
            color: "text-zinc-500",
          },
        ]
      : []),
    {
      label: "Total time",
      value: formatMinutes(stats.totalMinutes),
      Icon: HistoryIcon,
      color: "text-fuchsia-400",
    },
  ];

  return (
    <>
      <div
        className="accent-scope space-y-8"
        style={{ "--accent": CATEGORY_ACCENT[activeCat] } as React.CSSProperties}
      >
        {/* Full-bleed hero banner: breaks out of <main>'s padding so the
            artwork sits flush against the sidebar, the right edge and the
            topbar. Welcome on the left, stats on the right. */}
        <section className="relative -mx-4 -mt-4 min-h-[20rem] overflow-hidden border-b border-white/10 sm:-mx-6 sm:-mt-6 lg:min-h-[24rem]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/hero.png)",
              backgroundSize: "cover",
              backgroundPosition: "center 45%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a10]/95 via-[#0a0a10]/25 to-[#0a0a10]/70" />

          <div className="relative flex flex-col lg:flex-row">
            <div className="flex-1 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Welcome back,
              </p>
              <h1 className="mt-1 text-4xl text-white">
                {displayName(user)}
              </h1>
              <p className="mt-2 text-sm text-zinc-300/90">
                Track it all. Never lose your place again.
              </p>

              <div className="mt-6 flex flex-wrap items-start gap-3">
                {CATEGORIES.map((c) => {
                  const { Icon, color } = CATEGORY_STYLE[c.key];
                  const active = activeCat === c.key;
                  return (
                    <Link
                      key={c.key}
                      href={`/dashboard?cat=${c.key}`}
                      scroll={false}
                      className={`flex flex-col items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                        active
                          ? "acc-bg-soft acc-ring"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Icon className={`size-6 ${color}`} />
                      <span className={`text-xs font-medium ${color}`}>
                        {c.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="w-full border-t border-white/10 bg-[#0a0a10]/55 p-5 backdrop-blur-sm lg:w-80 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Binge Stats</h2>
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

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0 space-y-8">
            <div className="flex items-center justify-between gap-3">
              <StreakBadge days={streak} />
              <AddTitleButton />
            </div>

            <section>
              <SectionHeader
                title="One More....."
                subtitle="Whatever you're currently into — jump back in."
                viewAllHref={`/library?status=in_progress&category=${activeCat}`}
                bgPos="100% 18%"
              />
              {oneMore.length === 0 ? (
                <EmptyState
                  message={
                    stats.total === 0
                      ? "Nothing tracked yet."
                      : `Nothing in progress to ${activeCat}.`
                  }
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {oneMore.map((t) => (
                    <TitleCard key={t.id} title={t} />
                  ))}
                </div>
              )}
            </section>

            <MyStuff titles={vaultTitles} activeCat={activeCat} />
          </div>

          <aside className="space-y-4">
            <MiniCalendar
              initialYear={now.getFullYear()}
              initialMonth={now.getMonth() + 1}
              initialEvents={calendarEvents}
            />
            <RecentActivity items={recentActivity} />
          </aside>
        </div>
      </div>
    </>
  );
}

function StreakBadge({ days }: { days: number }) {
  if (days <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400">
        🔥 No streak yet — log progress today
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-200">
      🔥 {days}-day streak
    </span>
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
