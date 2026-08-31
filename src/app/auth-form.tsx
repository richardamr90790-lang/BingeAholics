"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "./actions";

type Mode = "signin" | "signup";

function Logo() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="ba-logo"
          x1="0"
          y1="0"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path
        d="M18 11.9c0-2.3 2.5-3.8 4.5-2.6l19.6 11.8c1.9 1.2 1.9 4 0 5.2L22.5 43.9c-2 1.2-4.5-.3-4.5-2.6V11.9Z"
        fill="url(#ba-logo)"
      />
      <path
        d="M41 4.5 42.4 8 46 9.5 42.4 11 41 14.5 39.6 11 36 9.5 39.6 8 41 4.5Z"
        fill="#c4b5fd"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {off ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.3 17.3 0 0 1-3.3 4.1" />
          <path d="M6.6 6.6A17.3 17.3 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 5.4-1.5" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-black/40 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40";

function Fields({ mode }: { mode: Mode }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    mode === "signin" ? signIn : signUp,
    null,
  );
  const [showPw, setShowPw] = useState(false);

  return (
    <form action={formAction} className="space-y-3">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
          <MailIcon />
        </span>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className={`${fieldClass} pl-10 pr-3`}
        />
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
          <LockIcon />
        </span>
        <input
          name="password"
          type={showPw ? "text" : "password"}
          required
          minLength={6}
          placeholder="Password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className={`${fieldClass} pl-10 pr-10`}
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          aria-label={showPw ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 flex items-center px-1 text-zinc-500 hover:text-zinc-300"
        >
          <EyeIcon off={!showPw} />
        </button>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
      >
        {pending ? "…" : mode === "signin" ? "Log in" : "Create account"}
      </button>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.notice && <p className="text-sm text-emerald-400">{state.notice}</p>}
    </form>
  );
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/70 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-3 text-3xl font-extrabold uppercase italic tracking-tight text-white">
          Track <span className="text-violet-400">It</span> All
        </h1>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
          For the Bingeaholics
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Track. Watch. Read. Listen. Never lose your place again.
        </p>
      </div>

      <div className="mt-6">
        <Fields key={mode} mode={mode} />
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        {mode === "signin" ? (
          <>
            <p className="text-zinc-400">
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Create an account
              </button>
            </p>
            <Link
              href="/forgot-password"
              className="text-zinc-500 hover:text-zinc-300"
            >
              Forgot password?
            </Link>
          </>
        ) : (
          <p className="text-zinc-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
