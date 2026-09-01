"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, categoryTypes, type Title } from "@/lib/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";

type Filter = "all" | (typeof CATEGORIES)[number]["key"];

export function MyStuff({ titles }: { titles: Title[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const shown =
    filter === "all"
      ? titles
      : titles.filter((t) => {
          const types = categoryTypes(filter) ?? [];
          return types.includes(t.type);
        });

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">My Stuff</h2>
        <Link
          href="/library"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          View all
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterTab
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {CATEGORIES.map((c) => (
          <FilterTab
            key={c.key}
            label={c.label}
            active={filter === c.key}
            onClick={() => setFilter(c.key)}
          />
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
          <p className="text-sm text-zinc-500">
            {titles.length === 0
              ? "Nothing here yet."
              : "Nothing in this category."}
          </p>
          <AddTitleButton label="Add a title" variant="ghost" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {shown.slice(0, 12).map((t) => (
            <TitleCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-violet-600 font-medium text-white"
          : "border border-white/10 text-zinc-400 hover:text-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}
