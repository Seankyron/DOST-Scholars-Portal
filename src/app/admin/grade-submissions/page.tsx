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
import { cn } from '@/lib/utils/cn'; // <-- 1. Import cn

function DashboardContent() {
  const { isOpen } = useServicePanelContext();

  if (isOpen) {
    return <ServicePanelOverlay />;
  }

  return (
    <div className="space-y-6">
      <NavigationTabs />
      <RecentActivity />
    </div>
  );
}

// --- 2. New component to get context ---
function DashboardPageContent() {
  const { isOpen } = useServicePanelContext();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto max-w-7xl bg-[#f4f6fc] shadow-xl">
        {/* --- 3. Apply conditional spacing --- */}
        <div
          className={cn(
            'p-6 sm:p-8',
            !isOpen && 'space-y-6' // Use space-y-6 only when panel is closed
          )}
        >
          <WelcomeHeader />
          {isOpen && <div className="mt-6" />} {/* Manual spacing when open */}
          <ProfileSection />
          {isOpen && <div className="mt-6" />} {/* Manual spacing when open */}
          <EventBannerSection />
          {/* This margin is now conditional */}
          <div className={cn(isOpen ? 'mt-2' : 'mt-6')} />
          <DashboardContent />
        </div>
      </Card>
    </div>
  );
}

// --- 4. Main export now uses the provider and new layout component ---
export default function ScholarDashboardPage() {
  return (
    <ServicePanelProvider>
      <DashboardPageContent />
    </ServicePanelProvider>
  );
}