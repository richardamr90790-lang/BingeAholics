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
import { PageHeader } from "../_components/page-header";
import { SearchBox } from "./_search-box";

// AI cover generation (a Server Action reached from the title cards / add
// dialog on this page) can take longer than the default function budget.
export const maxDuration = 60;

const STATUSES = Object.keys(STATUS_LABELS) as TitleStatus[];

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; q?: string }>;
}) {
  const { category, status, q: qParam } = await searchParams;
  const q = (qParam ?? "").trim();

  const activeCategory = CATEGORIES.find((c) => c.key === category)?.key;
  const catTypes = activeCategory ? categoryTypes(activeCategory) : null;
  const activeStatus = STATUSES.includes(status as TitleStatus)
    ? (status as TitleStatus)
    : undefined;

  const titles = await listTitles({
    ...(catTypes ? { types: catTypes } : {}),
    ...(activeStatus ? { status: activeStatus } : {}),
  });

  const shown = q
    ? titles.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()))
    : titles;

  const heading =
    activeStatus === "in_progress"
      ? "One More....."
      : activeStatus
        ? STATUS_LABELS[activeStatus]
        : activeCategory
          ? CATEGORIES.find((c) => c.key === activeCategory)!.label
          : "My Binge Vault";

  const withQ = (base: string) =>
    q
      ? `${base}${base.includes("?") ? "&" : "?"}q=${encodeURIComponent(q)}`
      : base;

  return (
    <div className="space-y-5">
      <PageHeader
        title={heading}
        subtitle={
          activeStatus === "in_progress"
            ? "Whatever you're currently into — jump back in."
            : "Everything you're tracking, all in one place."
        }
        bgPos={activeStatus === "in_progress" ? "100% 18%" : "100% 88%"}
        action={<AddTitleButton />}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Tab
            href={withQ("/library")}
            label="All"
            active={!activeCategory && !activeStatus}
          />
          {CATEGORIES.map((c) => (
            <Tab
              key={c.key}
              href={withQ(`/library?category=${c.key}`)}
              label={c.label}
              active={activeCategory === c.key}
            />
          ))}
        </div>
        <SearchBox />
      </div>

      {activeStatus && (
        <p className="text-sm text-zinc-500">
          Showing {heading.toLowerCase()}.{" "}
          <Link href="/library" className="text-violet-400 hover:text-violet-300">
            Clear
          </Link>
        </p>
      )}

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          <p className="text-sm text-zinc-500">
            {q
              ? `No titles match “${q}”.`
              : activeStatus
                ? `Nothing ${heading.toLowerCase()}.`
                : activeCategory
                  ? `Nothing to ${activeCategory} yet.`
                  : "Nothing here yet."}
          </p>
          {!q && <AddTitleButton label="Add a title" variant="ghost" />}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {shown.map((t) => (
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
