"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "../actions";
import { CATEGORY_ACCENT, type Category } from "@/lib/titles";
import { AddTitleDialog } from "./add-title-dialog";
import { useToast } from "./toast";

const MODES: { key: Category; emoji: string; label: string; blurb: string }[] = [
  { key: "watch", emoji: "🎬", label: "Watch", blurb: "Anime · shows · recap videos" },
  { key: "read", emoji: "📖", label: "Read", blurb: "Manga · manhwa · books" },
  { key: "listen", emoji: "🎧", label: "Listen", blurb: "Podcasts" },
  { key: "play", emoji: "🎮", label: "Play", blurb: "Games" },
  { key: "learn", emoji: "🎓", label: "Learn", blurb: "Courses" },
];

const STEPS = 5; // 0..4
const KICKER = "text-[11px] font-semibold uppercase tracking-[0.18em] acc-text";
const H2 = "font-display mt-1 text-xl text-white";

export function Onboarding() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Category>("watch");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function finish(goDashboard: boolean) {
    startSaving(async () => {
      const res = await completeOnboarding();
      if (res?.error) {
        toast(res.error, "error");
        return;
      }
      if (goDashboard) router.push(`/dashboard?cat=${mode}`);
      router.refresh();
    });
  }

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(STEPS - 1, s + 1));

  const primary =
    step === 4
      ? { label: "Start bingeing  😈", onClick: () => finish(true) }
      : step === 2
        ? { label: "Skip this step  →", onClick: next }
        : step === 0
          ? { label: "Take the quick tour  →", onClick: next }
          : { label: "Next  →", onClick: next };

  return (
    <div
      className="accent-scope fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ "--accent": CATEGORY_ACCENT[mode] } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative flex w-full max-w-md flex-col rounded-2xl border border-white/10 bg-[#14141c] p-6 shadow-2xl">
        <button
          onClick={() => finish(false)}
          disabled={saving}
          className="absolute right-4 top-4 text-xs text-zinc-500 transition hover:text-zinc-300 disabled:opacity-50"
        >
          Skip tutorial
        </button>

        <div className="min-h-[15rem] pt-6">
          {step === 0 && (
            <div className="text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="font-display mt-3 text-2xl text-white">
                Welcome to Bingeaholics
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Your binge. Your place. Never lose it again.
              </p>
              <p className="mt-4 text-xs text-zinc-600">
                Takes about 30 seconds — skip anytime.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className={KICKER}>Step 1</p>
              <h2 className={H2}>Pick your binge</h2>
              <p className="mt-1 text-sm text-zinc-400">
                What do you want to track? You can mix modes anytime.
              </p>
              <div className="mt-4 grid gap-2">
                {MODES.map((m) => {
                  const sel = mode === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                        sel
                          ? "acc-ring acc-bg-soft"
                          : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span>
                        <span
                          className={`block text-sm font-medium ${
                            sel ? "acc-text" : "text-zinc-100"
                          }`}
                        >
                          {m.label}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {m.blurb}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className={KICKER}>Step 2</p>
              <h2 className={H2}>Add your first title</h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>
                  Look for the{" "}
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs font-medium text-zinc-200">
                    + Add title
                  </span>{" "}
                  button — on the dashboard and the Vault.
                </li>
                <li>
                  Got a <span className="text-zinc-200">YouTube link</span>? Paste
                  it and we&apos;ll auto-fill the name, type, and cover.
                </li>
                <li>
                  No link? Just type the name. Add a cover later, or let us
                  generate one.
                </li>
              </ul>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-4 w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500"
              >
                + Add my first title
              </button>
              <p className="mt-2 text-center text-xs text-zinc-600">
                Optional — you can do this later.
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className={KICKER}>Step 3</p>
              <h2 className={H2}>Tell us where you are</h2>
              <p className="mt-2 text-sm text-zinc-400">
                When you add something, set{" "}
                <span className="text-zinc-200">Currently on</span> to the exact
                spot you stopped.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                {["Chapter 187", "Episode 15", "Part 32", "Page 140"].map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-zinc-300"
                  >
                    {x}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-zinc-400">
                Every time you pick it back up, bump the number with{" "}
                <span className="acc-text font-medium">Next →</span>. That&apos;s
                your place — saved.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="text-5xl">😈</div>
              <h2 className="font-display mt-3 text-2xl text-white">
                You&apos;re a Bingeaholic now
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                That&apos;s it. We&apos;ll remember your place so you don&apos;t
                have to.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={back}
            className={`text-sm text-zinc-400 transition hover:text-zinc-200 ${
              step === 0 ? "invisible" : ""
            }`}
          >
            ← Back
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: STEPS }).map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-full transition ${
                  i === step ? "acc-bg" : "bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={primary.onClick}
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
          >
            {primary.label}
          </button>
        </div>
      </div>

      <AddTitleDialog
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setStep(3);
        }}
      />
    </div>
  );
}
