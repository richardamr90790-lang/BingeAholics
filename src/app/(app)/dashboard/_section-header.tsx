import Link from "next/link";

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  bg = "/section-bg.webp",
  bgPos = "center",
}: {
  title: string;
  subtitle?: string;
  viewAllHref: string;
  bg?: string;
  bgPos?: string;
}) {
  return (
    <div className="relative mb-4 overflow-hidden rounded-xl border border-white/10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: bgPos,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b12]/94 via-[#0b0b12]/45 to-[#0b0b12]/72" />
      <div className="relative flex items-center justify-between gap-3 px-5 py-6 sm:py-7">
        <div className="min-w-0">
          <h2 className="font-display text-xl text-white sm:text-2xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 truncate text-xs text-zinc-300/90">{subtitle}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className="acc-text shrink-0 text-sm transition hover:opacity-80"
        >
          View all
        </Link>
      </div>
    </div>
  );
}
