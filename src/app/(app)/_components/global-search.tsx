"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  STATUS_LABELS,
  TYPE_LABELS,
  type TitleStatus,
  type TitleType,
} from "@/lib/titles";
import { SearchIcon } from "./icons";

type Hit = {
  id: string;
  title: string;
  type: TitleType;
  status: TitleStatus;
};

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [all, setAll] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const loadedRef = useRef(false);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQ("");
    setActive(0);
    if (loadedRef.current) return;
    setLoading(true);
    createClient()
      .from("titles")
      .select("id,title,type,status")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setAll((data ?? []) as Hit[]);
        loadedRef.current = true;
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPalette]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const query = q.trim().toLowerCase();
  const results = query
    ? all.filter((t) => t.title.toLowerCase().includes(query)).slice(0, 8)
    : all.slice(0, 6);

  function go(title: string) {
    setOpen(false);
    router.push(`/library?q=${encodeURIComponent(title)}`);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active].title);
      else if (query) go(q.trim());
    }
  }

  return (
    <>
      <button
        onClick={openPalette}
        aria-label="Search titles"
        className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5"
      >
        <SearchIcon className="size-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden rounded border border-white/10 bg-white/5 px-1 text-[10px] text-zinc-500 md:inline">
          ⌘K
        </kbd>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
            <button
              aria-label="Close"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#14141c] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-4">
                <SearchIcon className="size-4 shrink-0 text-zinc-500" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKey}
                  placeholder="Search your titles…"
                  className="w-full bg-transparent py-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                />
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2">
                {loading ? (
                  <p className="px-3 py-8 text-center text-sm text-zinc-500">
                    Loading…
                  </p>
                ) : results.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-zinc-500">
                    {query ? `No titles match “${q.trim()}”.` : "Nothing yet."}
                  </p>
                ) : (
                  results.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => go(t.title)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                        i === active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-zinc-100">
                          {t.title}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {TYPE_LABELS[t.type]} · {STATUS_LABELS[t.status]}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 px-3 py-2 text-[11px] text-zinc-600">
                ↑↓ navigate · ↵ open · esc close
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
