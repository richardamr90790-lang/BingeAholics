"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "./actions";

type Mode = "signin" | "signup";

function Fields({ mode }: { mode: Mode }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    mode === "signin" ? signIn : signUp,
    null,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        autoComplete="email"
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder="Password (min 6 characters)"
        autoComplete={mode === "signin" ? "current-password" : "new-password"}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {pending ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
      </button>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.notice && <p className="text-sm text-green-600">{state.notice}</p>}
    </form>
  );
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Bingeaholics</h1>
        <p className="text-sm text-zinc-500">
          {mode === "signin"
            ? "Sign in to your account."
            : "Create a new account."}
        </p>
      </div>

      <div className="flex rounded-md border border-zinc-300 p-1 text-sm dark:border-zinc-700">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded px-3 py-1.5 transition-colors ${
              mode === m
                ? "bg-foreground text-background"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      {/* key={mode} remounts the fields so stale errors clear on toggle */}
      <Fields key={mode} mode={mode} />

      {mode === "signin" && (
        <p className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Forgot password?
          </Link>
        </p>
      )}
    </div>
  );
}
