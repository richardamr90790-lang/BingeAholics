import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { AuthForm } from "./auth-form";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      {user ? (
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Bingeaholics</h1>
          <p className="text-sm text-zinc-500">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
          <form action={signOut}>
            <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <AuthForm />
      )}
    </main>
  );
}
