"use client";

import { useActionState, useState } from "react";
import { updatePassword, type AuthState } from "../../actions";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    null,
  );
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/70 p-8 shadow-2xl backdrop-blur-xl">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl uppercase text-white">
          Set a new password
        </h1>
      </div>

      <form action={formAction} className="mt-6 space-y-3">
        <input
          name="password"
          type={showPw ? "text" : "password"}
          required
          minLength={6}
          placeholder="New password (min 6 characters)"
          autoComplete="new-password"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40"
        />
        <label className="flex items-center gap-2 text-xs text-zinc-500">
          <input
            type="checkbox"
            checked={showPw}
            onChange={(e) => setShowPw(e.target.checked)}
            className="accent-violet-500"
          />
          Show password
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
        >
          {pending ? "…" : "Update password"}
        </button>
      </form>

      {state?.error && (
        <p className="mt-3 text-sm text-red-400">{state.error}</p>
      )}
    </div>
  );
}
