import { ProfileSection } from '@/components/scholar/profile/ProfileSection';
import { EventBannerSection } from '@/components/scholar/event-banner/EventBannerSection';
import { NavigationTabs } from '@/components/scholar/layout/NavigationTabs';
import { RecentActivity } from '@/components/scholar/layout/RecentActivity';
import { WelcomeHeader } from '@/components/scholar/layout/WelcomeHeader';
import { Card } from '@/components/ui/card';

export default function ScholarDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      
      <Card className="mx-auto max-w-7xl bg-[#f4f6fc] shadow-xl">
        <div className="p-6 sm:p-8 space-y-6">
          
          <WelcomeHeader />
          
          <ProfileSection />
          
          <EventBannerSection />

          <NavigationTabs />
          
          <RecentActivity />
            </div>
          </Card>
    </div>
  );
}