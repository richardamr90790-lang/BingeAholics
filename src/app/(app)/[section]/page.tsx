import { notFound } from "next/navigation";
import { ComingSoon } from "../_components/coming-soon";

const SECTIONS: Record<string, string> = {
  continue: "Continue Watching",
  discover: "Discover",
  watchlist: "Watchlist",
  collections: "Collections",
};

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const title = SECTIONS[section];
  if (!title) notFound();
  return <ComingSoon title={title} />;
}
