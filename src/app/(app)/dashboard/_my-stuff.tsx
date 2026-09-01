import { type Category, type Title } from "@/lib/titles";
import { TitleCard } from "../_components/title-card";
import { AddTitleButton } from "../_components/add-title-button";
import { SectionHeader } from "./_section-header";

export function MyStuff({
  titles,
  activeCat,
}: {
  titles: Title[]; // already filtered to activeCat
  activeCat: Category;
}) {
  return (
    <section>
      <SectionHeader
        title="My Binge Vault"
        subtitle="Everything you're tracking."
        viewAllHref={`/library?category=${activeCat}`}
        bgPos="100% 90%"
      />

      {titles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
          <p className="text-sm text-zinc-500">
            Nothing to {activeCat} yet.
          </p>
          <AddTitleButton label="Add a title" variant="ghost" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {titles.slice(0, 12).map((t) => (
            <TitleCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </section>
  );
}
