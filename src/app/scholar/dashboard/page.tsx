// src/app/scholar/dashboard/page.tsx
'use client';

import { ProfileSection } from '@/components/scholar/profile/ProfileSection';
import { EventBannerSection } from '@/components/scholar/event-banner/EventBannerSection';
import { NavigationTabs } from '@/components/scholar/layout/NavigationTabs';
import { RecentActivity } from '@/components/scholar/layout/RecentActivity';
import { WelcomeHeader } from '@/components/scholar/layout/WelcomeHeader';
import { Card } from '@/components/ui/card';
import {
  ServicePanelProvider,
  useServicePanelContext,
} from '@/context/ServicePanelContext';
import { ServicePanelOverlay } from '@/components/scholar/layout/ServicePanelOverlay';
import { cn } from '@/lib/utils/cn';

function DashboardContentWrapper() {
  const { isOpen } = useServicePanelContext();

  if (isOpen) {
    return <ServicePanelOverlay className="-mt-2" />;
  }

  return (
    <div className="space-y-6">
      <NavigationTabs />
      <RecentActivity />
    </div>
  );
}

function DashboardPageContent() {
  const { isOpen } = useServicePanelContext();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto max-w-7xl bg-[#f4f6fc] shadow-xl">
        <div
          className={cn(
            'p-6 sm:p-8',
            !isOpen && 'space-y-6'
          )}
        >
          <WelcomeHeader />
          {isOpen && <div className="mt-6" />}
          
          <ProfileSection />
          {isOpen && <div className="mt-6" />}

          <EventBannerSection />
          <div className={cn(isOpen ? 'mt-2' : 'mt-6')} />
          
          <DashboardContentWrapper />
        </div>
      </Card>
    </div>
  );
}

export default function ScholarDashboardPage() {
  return (
    <ServicePanelProvider>
      <DashboardPageContent />
    </ServicePanelProvider>
  );
}