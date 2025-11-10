'use client';

import { AnimatePresence, motion } from 'framer-motion';
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

function DashboardContentWrapper() {
  const { isOpen } = useServicePanelContext();

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="service-panel"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
        >
          <ServicePanelOverlay className="-mt-2" />
        </motion.div>
      ) : (
        <motion.div
          key="default-content"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-6">
            <NavigationTabs />
            <RecentActivity />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ScholarDashboardPage() {
  return (
    <ServicePanelProvider>
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-7xl bg-[#f4f6fc] shadow-xl">
          <div className="p-6 sm:p-8 space-y-6">
            <WelcomeHeader />

            <ProfileSection />

            <EventBannerSection />

            <DashboardContentWrapper />
          </div>
        </Card>
      </div>
    </ServicePanelProvider>
  );
}