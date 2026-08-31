import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "./auth-form";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-6">
      <div className="mt-auto w-full max-w-md pb-24">
        <AuthForm />
      </div>
    </main>
  );
}
