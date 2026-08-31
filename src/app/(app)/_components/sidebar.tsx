"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  PlayCircleIcon,
  LibraryIcon,
  CompassIcon,
  BookmarkIcon,
  CollectionsIcon,
  HistoryIcon,
  StatsIcon,
  CalendarIcon,
  SettingsIcon,
} from "./icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/continue", label: "Continue Watching", Icon: PlayCircleIcon },
  { href: "/library", label: "My Library", Icon: LibraryIcon },
  { href: "/discover", label: "Discover", Icon: CompassIcon },
  { href: "/watchlist", label: "Watchlist", Icon: BookmarkIcon },
  { href: "/collections", label: "Collections", Icon: CollectionsIcon },
  { href: "/history", label: "History", Icon: HistoryIcon },
  { href: "/stats", label: "Stats", Icon: StatsIcon },
  { href: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/5 bg-[#0c0c12] lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
          <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden>
            <path d="M8 5.5c0-1.1 1.2-1.8 2.1-1.2l9 6c.9.6.9 1.9 0 2.4l-9 6c-1 .6-2.1-.1-2.1-1.2v-12Z" />
          </svg>
        </span>
        <span className="text-lg font-extrabold tracking-tight text-white">
          Bingeaholics
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ href, label, Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-gradient-to-r from-violet-600/90 to-indigo-600/80 font-medium text-white shadow-lg shadow-violet-900/30"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-violet-300">
          <span aria-hidden>🔥</span> Binge Mode
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Hyper-focus mode is coming soon.
        </p>
      </div>
    </aside>
  );
}
