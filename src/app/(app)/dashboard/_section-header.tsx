import Link from "next/link";
import { ChevronDownIcon } from "../_components/icons";

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  bg = "/section-bg.webp",
  bgPos = "center",
  expanded,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  viewAllHref: string;
  bg?: string;
  bgPos?: string;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const heading = (
    <>
      <h2 className="font-display text-xl text-white sm:text-2xl">{title}</h2>
      {subtitle && (
        <p className="mt-1 truncate text-xs text-zinc-300/90">{subtitle}</p>
      )}
    </>
  );

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
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex min-w-0 items-center gap-2.5 text-left"
          >
            <ChevronDownIcon
              className={`size-4 shrink-0 text-zinc-400 transition-transform ${
                expanded ? "" : "-rotate-90"
              }`}
            />
            <span className="min-w-0">{heading}</span>
          </button>
        ) : (
          <div className="min-w-0">{heading}</div>
        )}
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
