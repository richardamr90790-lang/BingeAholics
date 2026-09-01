"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, CloseIcon } from "../_components/icons";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function push(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim()) params.set("q", next.trim());
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onChange(v: string) {
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => push(v), 250);
  }

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    setValue("");
    push("");
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your vault…"
        className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pl-9 pr-8 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded text-zinc-500 hover:text-zinc-200"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
