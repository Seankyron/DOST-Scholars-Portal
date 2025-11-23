import { ProfileSettings } from '@/components/scholar/settings/ProfileSettings';

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-dost-title">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information and update your contact details.
          </p>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  );
}