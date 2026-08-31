import { createClient } from "@/lib/supabase/server";
import { storedDisplayName } from "@/lib/user";
import { SettingsForm } from "../_components/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <SettingsForm
        initialName={storedDisplayName(user)}
        email={user?.email ?? ""}
      />
    </div>
  );
}
