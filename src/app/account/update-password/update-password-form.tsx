"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "../../actions";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    null,
  );

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Set a new password</h1>
      </div>

      <form action={formAction} className="space-y-3">
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="New password (min 6 characters)"
          autoComplete="new-password"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {pending ? "…" : "Update password"}
        </button>
      </form>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    </div>
  );
}
