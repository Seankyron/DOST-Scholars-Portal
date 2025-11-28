import { ProfileSettings } from '@/components/scholar/settings/ProfileSettings';

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  );
}