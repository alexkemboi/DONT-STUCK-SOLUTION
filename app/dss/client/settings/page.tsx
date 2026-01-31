import { getCurrentUser } from "@/app/actions/auth";
import { ClientSettings } from "@/components/client/settings/client-settings";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">
          Manage your account preferences and security.
        </p>
      </div>

      <ClientSettings
        user={
          user
            ? {
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
              }
            : null
        }
      />
    </div>
  );
}
