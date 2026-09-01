import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/titles";

export function CatTabs({ activeCat }: { activeCat: Category }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <Link
          key={c.key}
          href={`/dashboard?cat=${c.key}`}
          scroll={false}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            activeCat === c.key
              ? "bg-violet-600 font-medium text-white"
              : "border border-white/10 text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
