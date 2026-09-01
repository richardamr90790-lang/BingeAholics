import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { avatarIdOf, hasOnboarded } from "@/lib/user";
import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";
import { ToastProvider } from "./_components/toast";
import { Onboarding } from "./_components/onboarding";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <ToastProvider>
      <div className="relative z-0 flex min-h-screen bg-[#0b0b12] text-zinc-100">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar email={user.email ?? ""} avatarId={avatarIdOf(user)} />
          <main className="w-full flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
      {!hasOnboarded(user) && <Onboarding />}
    </ToastProvider>
  );
}
