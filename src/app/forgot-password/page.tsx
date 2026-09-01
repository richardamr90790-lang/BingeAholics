"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const linkError = searchParams.get("error");

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setStatus("sending");
    setMessage("");

    // Run on the client so @supabase/ssr stores the PKCE verifier in a cookie
    // that the /auth/confirm route can read back.
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/account/update-password`,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
      setMessage(
        "If that email has an account, a reset link is on its way. Open it in this browser.",
      );
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/70 p-8 shadow-2xl backdrop-blur-xl">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl uppercase text-white">
          Reset password
        </h1>
        <p className="text-sm text-zinc-400">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {linkError && (
        <p className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
          Reset link problem: {linkError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/40"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60"
        >
          {status === "sending" ? "…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-3 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
        Heads up: open the reset link in <strong>this same browser</strong>. For
        security, a link opened in a different browser or on another device
        won&apos;t work. If your email opens links in a different browser, copy
        the link and paste it into this one.
      </p>

      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "error" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-4 text-center text-sm">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300">
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
