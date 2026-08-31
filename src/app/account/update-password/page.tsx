import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UpdatePasswordForm } from "./update-password-form";

// Reached via the password-reset email link, which establishes a recovery
// session first. Without a session there's nothing to update.
export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/forgot-password?error=session_expired");

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <UpdatePasswordForm />
    </main>
  );
}
