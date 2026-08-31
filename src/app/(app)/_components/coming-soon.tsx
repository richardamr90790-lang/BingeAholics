export function ComingSoon({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-24 text-center">
        <p className="text-sm text-zinc-500">
          {note ?? "This section is coming in a later phase."}
        </p>
      </div>
    </div>
  );
}
