import {
  DashboardIcon,
  PlayCircleIcon,
  LibraryIcon,
  HistoryIcon,
  StatsIcon,
  CalendarIcon,
  SettingsIcon,
} from "./icons";

export const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  {
    href: "/library?status=in_progress",
    label: "One More.....",
    Icon: PlayCircleIcon,
  },
  { href: "/library", label: "My Binge Vault", Icon: LibraryIcon },
  { href: "/stats", label: "Binge Stats", Icon: StatsIcon },
  { href: "/history", label: "History", Icon: HistoryIcon },
  { href: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function navIsActive(
  href: string,
  pathname: string,
  inProgress: boolean,
): boolean {
  const [path, query] = href.split("?");
  if (path === "/library") {
    if (pathname !== "/library") return false;
    return query ? inProgress : !inProgress;
  }
  return pathname === path || pathname.startsWith(path + "/");
}
