"use client";

import { useEffect, useState } from "react";
import { type Category, type Title } from "@/lib/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";
import { SectionHeader } from "./_section-header";

const STORE_KEY = "bv:vault-open";

export function MyStuff({
  titles,
  activeCat,
}: {
  titles: Title[]; // already filtered to activeCat
  activeCat: Category;
}) {
  const [open, setOpen] = useState(false);

  // restore the collapsed/expanded choice after mount (kept out of the initial
  // render so server and client markup match)
  useEffect(() => {
    try {
      if (localStorage.getItem(STORE_KEY) === "1")
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(true);
    } catch {}
  }, []);

  function toggle() {
    setOpen((v) => {
      const next = !v;
      try {
        localStorage.setItem(STORE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <section>
      <SectionHeader
        title="My Binge Vault"
        subtitle={
          titles.length
            ? `${titles.length} tracked — tap to ${open ? "hide" : "browse"}`
            : "Everything you're tracking."
        }
        viewAllHref={`/library?category=${activeCat}`}
        bgPos="100% 90%"
        expanded={open}
        onToggle={toggle}
      />

      {open &&
        (titles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-sm text-zinc-500">Nothing to {activeCat} yet.</p>
            <AddTitleButton label="Add a title" variant="ghost" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {titles.slice(0, 12).map((t) => (
              <TitleCard key={t.id} title={t} />
            ))}
          </div>
        ))}
    </section>
  );
}
