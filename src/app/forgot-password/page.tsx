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

      <form onSubmit={handleSubmit} className="space-y-3">
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
          disabled={status === "sending"}
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {status === "sending" ? "…" : "Send reset link"}
        </button>
      </form>

      <p className="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-500">
        Heads up: open the reset link in <strong>this same browser</strong>. For
        security, a link opened in a different browser or on another device
        won&apos;t work. If your email opens links in a different browser, copy
        the link and paste it into this one.
      </p>

      {message && (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

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
