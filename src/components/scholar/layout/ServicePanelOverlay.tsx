// src/components/scholar/layout/ServicePanelOverlay.tsx
'use client';

import { useServicePanelContext } from '@/context/ServicePanelContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GradeSubmissionPanel } from '../services/GradeSubmission/GradeSubmissionPanel';
import { cn } from '@/lib/utils/cn'; // <-- 1. Import cn

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

// --- 2. MODIFICATION: Accept className prop ---
export function ServicePanelOverlay({ className }: { className?: string }) {
  const { closePanel, activeService } = useServicePanelContext();

  const renderService = () => {
    switch (activeService) {
      case 'grade-submission':
        return <GradeSubmissionPanel />;
      // ... other cases
      default:
        const serviceTitle = activeService
          ? activeService.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : 'Service';
        return <MockServicePanel title={serviceTitle} />;
    }
  };
  
  if (!activeService) return null;

  return (
    <div
      // --- 3. MODIFICATION: Merge passed className ---
      className={cn(
        "relative w-full bg-[#f4f6fc] rounded-lg", 
        className // This now correctly applies "-mt-2"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={closePanel}
        className="absolute top-4 right-4 z-10 h-10 w-10 p-0 text-gray-500 hover:text-gray-900"
      >
        <X className="h-6 w-6" />
      </Button>
      

      <div className="h-full overflow-y-auto scrollbar-thin p-6 pt-16">
        {renderService()}
      </div>
    </div>
  );
}