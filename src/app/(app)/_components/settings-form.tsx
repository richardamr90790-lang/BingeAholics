"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDisplayName } from "../actions";

export function SettingsForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateDisplayName(name);
      if (res?.error) {
        setError(res.error);
      } else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={save}
      className="max-w-md space-y-4 rounded-xl border border-white/5 bg-[#14141c] p-5"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Display name
        </label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          maxLength={40}
          placeholder="Binge Master"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40"
        />
        <p className="mt-1 text-xs text-zinc-600">
          Shown in the dashboard greeting. Leave blank to use your email.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Email
        </label>
        <input
          value={email}
          disabled
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </form>
  );
}
