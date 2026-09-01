"use client";

import { usePathname } from "next/navigation";

// A dim nebula wash behind every app page, tinted a different colour per
// section so each tab has its own feel while staying in the dark cosmic theme.
const TINTS: { test: (p: string) => boolean; rgb: string }[] = [
  { test: (p) => p.startsWith("/dashboard"), rgb: "139,92,246" }, // violet
  { test: (p) => p.startsWith("/library"), rgb: "34,211,238" }, // cyan
  { test: (p) => p.startsWith("/stats"), rgb: "232,121,249" }, // magenta
  { test: (p) => p.startsWith("/history"), rgb: "251,146,60" }, // amber
  { test: (p) => p.startsWith("/calendar"), rgb: "56,189,248" }, // sky
  { test: (p) => p.startsWith("/settings"), rgb: "244,114,182" }, // pink
];

export function PageAmbience() {
  const pathname = usePathname();
  const rgb = TINTS.find((t) => t.test(pathname))?.rgb ?? "139,92,246";

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.34]"
        style={{
          backgroundImage: "url(/section-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[#0a0a10]/62" />
      <div
        className="absolute inset-0 transition-[background] duration-700 ease-out"
        style={{
          background: `radial-gradient(1400px 950px at 85% -16%, rgba(${rgb},0.36), transparent 62%), radial-gradient(1200px 820px at -12% 116%, rgba(${rgb},0.24), transparent 58%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a10]/12 to-[#0a0a10]/52" />
    </div>
  );
}
