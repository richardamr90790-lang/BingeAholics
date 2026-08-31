"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "../actions";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const linkError = searchParams.get("error");

  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    null,
  );

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-zinc-500">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {linkError && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">
          Reset link problem: {linkError}
        </p>
      )}

      <form action={formAction} className="space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {pending ? "…" : "Send reset link"}
        </button>
      </form>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.notice && <p className="text-sm text-green-600">{state.notice}</p>}

      <p className="text-center text-sm">
        <Link
          href="/"
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
