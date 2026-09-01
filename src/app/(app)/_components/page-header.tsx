export function PageHeader({
  title,
  subtitle,
  bgPos = "center",
  action,
}: {
  title: string;
  subtitle?: string;
  bgPos?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative -mx-4 -mt-4 overflow-hidden border-b border-white/10 sm:-mx-6 sm:-mt-6">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/section-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: bgPos,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b12]/95 via-[#0b0b12]/50 to-[#0b0b12]/80" />
      <div className="relative flex items-end justify-between gap-3 px-4 py-8 sm:px-6 sm:py-10">
        <div className="min-w-0">
          <h1 className="font-display text-3xl text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-zinc-300/90">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
