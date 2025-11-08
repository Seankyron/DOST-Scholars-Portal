'use client';

import { useServicePanelContext } from '@/context/ServicePanelContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GradeSubmissionPanel } from '../services/GradeSubmission/GradeSubmissionPanel';

// Placeholder for services that are not yet built
const MockServicePanel = ({ title }: { title: string }) => (
  <div className="p-6">
    <h2 className="text-3xl font-bold text-dost-title mb-4">{title}</h2>
    <Card>
      <CardContent className="p-6">
        <p>This service is not yet implemented.</p>
      </CardContent>
    </Card>
  </div>
);

export function ServicePanelOverlay() {
  const { isOpen, closePanel, activeService } = useServicePanelContext();

  const renderService = () => {
    switch (activeService) {
      case 'grade-submission':
        return <GradeSubmissionPanel />;
      // Add other cases here as they are built
      // case 'stipend-tracking':
      //   return <StipendTrackingPanel />;
      default:
        return <MockServicePanel title="Service" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // This class is from your globals.css
          className="service-panel-overlay" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={closePanel} // Close when clicking the background
        >
          <motion.div
            className="absolute top-0 right-0 h-full w-full max-w-4xl bg-[#f4f6fc] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking panel
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={closePanel}
              className="absolute top-4 right-4 z-10 h-10 w-10 p-0 text-gray-500 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="h-full overflow-y-auto scrollbar-thin p-6 sm:p-8 lg:p-12 pt-16">
              {renderService()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}