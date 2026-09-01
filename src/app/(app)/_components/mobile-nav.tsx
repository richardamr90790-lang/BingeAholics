"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV, navIsActive } from "./nav-items";
import { MenuIcon, CloseIcon } from "./icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inProgress = searchParams.get("status") === "in_progress";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mr-auto grid size-9 place-items-center rounded-lg border border-white/10 text-zinc-200 transition hover:bg-white/5 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col border-r border-white/10 bg-[#0c0c12] shadow-2xl">
              <div className="flex items-center justify-between px-5 py-5">
                <span className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-mark.webp"
                    alt=""
                    className="size-7 rounded-lg"
                  />
                  <span className="font-display text-xl text-white">
                    Bingeaholics
                  </span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
                  aria-label="Close menu"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
                {NAV.map(({ href, label, Icon }) => {
                  const active = navIsActive(href, pathname, inProgress);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-gradient-to-r from-violet-600/90 to-indigo-600/80 font-medium text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                      }`}
                    >
                      <Icon className="size-[18px]" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
