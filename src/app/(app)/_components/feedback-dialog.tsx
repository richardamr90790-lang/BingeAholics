"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { submitSuggestion } from "../actions";
import { useToast } from "./toast";

const KINDS: { value: string; label: string }[] = [
  { value: "idea", label: "💡 Idea" },
  { value: "bug", label: "🐛 Bug" },
  { value: "other", label: "💬 Other" },
];

export function FeedbackDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState("idea");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [sent, onClose]);

  if (!open || typeof document === "undefined") return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitSuggestion(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSent(true);
        toast("Thanks — every suggestion gets read.", "success");
      }
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-6 shadow-2xl">
        {sent ? (
          <div className="py-6 text-center">
            <div className="text-4xl">🙌</div>
            <p className="mt-3 font-display text-xl text-white">Sent!</p>
            <p className="mt-1 text-sm text-zinc-400">
              Thanks for helping shape Bingeaholics.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-lg text-white">Got a suggestion?</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Ideas, bugs, gripes — all welcome. It goes straight to me.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input type="hidden" name="kind" value={kind} />
              {/* honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="flex gap-2">
                {KINDS.map((k) => (
                  <button
                    key={k.value}
                    type="button"
                    onClick={() => setKind(k.value)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      kind === k.value
                        ? "border-violet-500/60 bg-violet-500/15 text-violet-200"
                        : "border-white/10 text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>

              <textarea
                name="body"
                required
                autoFocus
                rows={4}
                maxLength={2000}
                placeholder="What would make Bingeaholics better?"
                className={`${inputClass} resize-none`}
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
