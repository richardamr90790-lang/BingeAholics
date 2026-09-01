import { createClient } from "@/lib/supabase/server";
import { avatarIdOf, storedDisplayName } from "@/lib/user";
import { SettingsForm } from "../_components/settings-form";
import { PageHeader } from "../_components/page-header";
import { AvatarPicker } from "./_avatar-picker";
import { ReplayTutorialButton } from "./_replay-tutorial";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Customize your experience. Make it yours."
        bgPos="50% 15%"
      />

      <SettingsForm
        initialName={storedDisplayName(user)}
        email={user?.email ?? ""}
      />
      <AvatarPicker initialId={avatarIdOf(user)} />
      <ReplayTutorialButton />
    </div>
  );
}
