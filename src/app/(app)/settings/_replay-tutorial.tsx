"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { replayOnboarding } from "../actions";
import { useToast } from "../_components/toast";

export function ReplayTutorialButton() {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();

  return (
    <div className="max-w-md rounded-xl border border-white/5 bg-[#14141c] p-5">
      <h2 className="text-sm font-medium text-zinc-200">Welcome tour</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Replay the short intro the next time the app loads.
      </p>
      <button
        onClick={() =>
          start(async () => {
            const res = await replayOnboarding();
            if (res?.error) {
              toast(res.error, "error");
              return;
            }
            router.push("/dashboard");
            router.refresh();
          })
        }
        disabled={pending}
        className="mt-3 rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/5 disabled:opacity-60"
      >
        {pending ? "Starting…" : "Replay tutorial"}
      </button>
    </div>
  );
}
