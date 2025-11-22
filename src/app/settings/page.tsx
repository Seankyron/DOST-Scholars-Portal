import { ProfileSettings } from '@/components/scholar/settings/ProfileSettings';

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dost-title">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>
      
      <ProfileSettings />
    </div>
  );
}