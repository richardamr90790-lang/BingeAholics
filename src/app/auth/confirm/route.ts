import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Only allow same-origin relative paths as the post-verification destination.
function safeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

// Verifies email links (currently: password recovery). Handles both the
// token_hash flow (works in any browser) and the PKCE code flow (same browser
// only), so it works whether or not the Supabase email template is customised.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("[auth/confirm] verifyOtp failed:", error.message);
    return NextResponse.redirect(
      `${origin}/forgot-password?error=${encodeURIComponent(error.message)}`,
    );
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("[auth/confirm] exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(
      `${origin}/forgot-password?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/forgot-password?error=invalid_link`);
}
