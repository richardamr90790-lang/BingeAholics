import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { AuthForm } from "./auth-form";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-6">
      {user ? (
        <div className="m-auto w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-8 text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-extrabold uppercase italic tracking-tight text-white">
            Bingeaholics
          </h1>
          <p className="text-sm text-zinc-400">
            Signed in as <span className="font-medium text-zinc-200">{user.email}</span>
          </p>
          <form action={signOut}>
            <button className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-auto w-full max-w-md pb-24">
          <AuthForm />
        </div>
      )}
    </main>
  );
}
