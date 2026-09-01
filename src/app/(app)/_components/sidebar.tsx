"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV, navIsActive } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inProgress = searchParams.get("status") === "in_progress";

  const isActive = (href: string) => navIsActive(href, pathname, inProgress);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/5 bg-[#0c0c12]/20 backdrop-blur-md lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.webp" alt="" className="size-8 rounded-lg" />
        <span className="font-display text-xl text-white">Bingeaholics</span>
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
