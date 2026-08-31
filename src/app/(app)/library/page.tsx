import Link from "next/link";
import {
  CATEGORIES,
  categoryTypes,
  listTitles,
  TYPE_LABELS,
  type TitleType,
} from "@/lib/data/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";

const TYPES = Object.keys(TYPE_LABELS) as TitleType[];

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string }>;
}) {
  const { type, category } = await searchParams;

  const activeType = TYPES.includes(type as TitleType)
    ? (type as TitleType)
    : undefined;
  const activeCategory = CATEGORIES.find((c) => c.key === category)?.key;
  const catTypes = activeCategory ? categoryTypes(activeCategory) : null;

  const titles = await listTitles(
    activeType
      ? { type: activeType }
      : catTypes
        ? { types: catTypes }
        : undefined,
  );

  const heading = activeCategory
    ? CATEGORIES.find((c) => c.key === activeCategory)!.label
    : "My Library";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{heading}</h1>
        <AddTitleButton />
      </div>

      <div className="flex flex-wrap gap-2">
        <Tab href="/library" label="All" active={!activeType && !activeCategory} />
        {TYPES.map((t) => (
          <Tab
            key={t}
            href={`/library?type=${t}`}
            label={TYPE_LABELS[t]}
            active={activeType === t}
          />
        ))}
      </div>

      {activeCategory && (
        <p className="text-sm text-zinc-500">
          Showing {heading.toLowerCase()} titles.{" "}
          <Link href="/library" className="text-violet-400 hover:text-violet-300">
            Clear
          </Link>
        </p>
      )}

      {titles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          <p className="text-sm text-zinc-500">
            {activeType
              ? `No ${TYPE_LABELS[activeType].toLowerCase()} titles yet.`
              : activeCategory
                ? `Nothing to ${activeCategory} yet.`
                : "Nothing here yet."}
          </p>
          <AddTitleButton label="Add a title" variant="ghost" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {titles.map((t) => (
            <TitleCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-violet-600 font-medium text-white"
          : "border border-white/10 text-zinc-400 hover:text-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}
