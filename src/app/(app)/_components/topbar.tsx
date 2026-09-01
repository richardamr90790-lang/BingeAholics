"use client";

import { useState } from "react";
import { signOut } from "@/app/actions";
import { SearchIcon, BellIcon, ChevronDownIcon } from "./icons";
import { AddTitleButton } from "./add-title-button";

export function Topbar({ email }: { email: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-[#0b0b12]/25 px-4 py-3 backdrop-blur-lg sm:px-6">
      <div className="relative hidden max-w-md flex-1 sm:block">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
          <SearchIcon className="size-4" />
        </span>
        <input
          type="search"
          disabled
          placeholder="Search is coming soon…"
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <AddTitleButton />

        <button
          className="grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-100"
          aria-label="Notifications"
        >
          <BellIcon className="size-[18px]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-white/10 py-1.5 pl-1.5 pr-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
              {email.charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-[12ch] truncate sm:inline">
              {email}
            </span>
            <ChevronDownIcon className="size-4 text-zinc-500" />
          </button>

          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-hidden
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-[#14141c] py-1 text-sm shadow-xl">
                <div className="truncate px-3 py-2 text-xs text-zinc-500">
                  {email}
                </div>
                <form action={signOut}>
                  <button className="w-full px-3 py-2 text-left text-zinc-200 hover:bg-white/5">
                    Sign out
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
