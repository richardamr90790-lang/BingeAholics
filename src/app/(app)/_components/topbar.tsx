"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/actions";
import { replayOnboarding } from "../actions";
import { ChevronDownIcon } from "./icons";
import { Avatar } from "./avatar";
import { MobileNav } from "./mobile-nav";
import { useToast } from "./toast";

export function Topbar({
  email,
  avatarId,
  avatarUrl,
}: {
  email: string;
  avatarId: number | null;
  avatarUrl: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [replaying, startReplay] = useTransition();

  function replayTutorial() {
    setMenuOpen(false);
    startReplay(async () => {
      const res = await replayOnboarding();
      if (res?.error) {
        toast(res.error, "error");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end gap-3 border-b border-white/5 bg-[#0b0b12]/15 px-4 py-3 backdrop-blur-md sm:px-6">
      <MobileNav />
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-white/10 py-1.5 pl-1.5 pr-2 text-sm text-zinc-200 hover:bg-white/5"
        >
          <Avatar id={avatarId} url={avatarUrl} fallback={email} size={24} />
          <span className="hidden max-w-[12ch] truncate sm:inline">{email}</span>
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
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-zinc-200 hover:bg-white/5"
              >
                Settings &amp; avatar
              </Link>
              <button
                onClick={replayTutorial}
                disabled={replaying}
                className="block w-full px-3 py-2 text-left text-zinc-200 hover:bg-white/5 disabled:opacity-60"
              >
                {replaying ? "Starting…" : "Replay tutorial"}
              </button>
              <form action={signOut}>
                <button className="w-full px-3 py-2 text-left text-zinc-200 hover:bg-white/5">
                  Sign out
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
