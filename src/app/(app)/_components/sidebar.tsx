"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  DashboardIcon,
  PlayCircleIcon,
  LibraryIcon,
  HistoryIcon,
  StatsIcon,
  CalendarIcon,
  SettingsIcon,
} from "./icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  {
    href: "/library?status=in_progress",
    label: "In Progress",
    Icon: PlayCircleIcon,
  },
  { href: "/library", label: "My Stuff", Icon: LibraryIcon },
  { href: "/stats", label: "Binge Stats", Icon: StatsIcon },
  { href: "/history", label: "History", Icon: HistoryIcon },
  { href: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inProgress = searchParams.get("status") === "in_progress";

  function isActive(href: string) {
    const [path, query] = href.split("?");
    if (path === "/library") {
      if (pathname !== "/library") return false;
      return query ? inProgress : !inProgress;
    }
    return pathname === path || pathname.startsWith(path + "/");
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/5 bg-[#0c0c12]/20 backdrop-blur-md lg:flex">
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
          const active = isActive(href);
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
    </aside>
  );
}
