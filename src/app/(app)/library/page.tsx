import Link from "next/link";
import {
  CATEGORIES,
  categoryTypes,
  listTitles,
  STATUS_LABELS,
  type TitleStatus,
} from "@/lib/data/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";

const STATUSES = Object.keys(STATUS_LABELS) as TitleStatus[];

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const { category, status } = await searchParams;

  const activeCategory = CATEGORIES.find((c) => c.key === category)?.key;
  const catTypes = activeCategory ? categoryTypes(activeCategory) : null;
  const activeStatus = STATUSES.includes(status as TitleStatus)
    ? (status as TitleStatus)
    : undefined;

  const titles = await listTitles({
    ...(catTypes ? { types: catTypes } : {}),
    ...(activeStatus ? { status: activeStatus } : {}),
  });

  const heading = activeStatus
    ? STATUS_LABELS[activeStatus]
    : activeCategory
      ? CATEGORIES.find((c) => c.key === activeCategory)!.label
      : "My Stuff";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{heading}</h1>
        <AddTitleButton />
      </div>

      <div className="flex flex-wrap gap-2">
        <Tab
          href="/library"
          label="All"
          active={!activeCategory && !activeStatus}
        />
        {CATEGORIES.map((c) => (
          <Tab
            key={c.key}
            href={`/library?category=${c.key}`}
            label={c.label}
            active={activeCategory === c.key}
          />
        ))}
      </div>

      {activeStatus && (
        <p className="text-sm text-zinc-500">
          Showing {heading.toLowerCase()}.{" "}
          <Link href="/library" className="text-violet-400 hover:text-violet-300">
            Clear
          </Link>
        </p>
      )}

      {titles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          <p className="text-sm text-zinc-500">
            {activeStatus
              ? `Nothing ${heading.toLowerCase()}.`
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
