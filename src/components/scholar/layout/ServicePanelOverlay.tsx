'use client';

import { useServicePanelContext } from '@/context/ServicePanelContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GradeSubmissionPanel } from '../services/GradeSubmission/GradeSubmissionPanel';
import { StipendTrackingPanel } from '../services/StipendTracking/StipendTrackingPanel';
import { LeaveOfAbsencePanel } from '../services/LeaveOfAbsence/LeaveOfAbsencePanel';
import { PracticalTrainingPanel } from '../services/PracticalTraining/PracticalTrainingPanel';
import { ThesisAllowancePanel } from '../services/ThesisAllowance/ThesisAllowancePanel';
import { TravelClearancePanel } from '../services/TravelClearance/TravelClearancePanel';
import { ShiftingTransferringPanel } from '../services/ShiftingTransferring/ShiftingTransferringPanel';
import { RequestFormsPanel } from '../services/RequestForms/RequestFormsPanel';
import { ReimbursementPanel } from '../services/Reimbursement/ReimbursementPanel';
import { SupportFeedbackPanel } from '../services/SupportFeedback/SupportFeedbackPanel';
import { cn } from '@/lib/utils/cn'; 


export function ServicePanelOverlay({ className }: { className?: string }) {
  const { closePanel, activeService } = useServicePanelContext();

  const renderService = () => {
  switch (activeService) {
    case 'grade-submission':
      return <GradeSubmissionPanel />;
    case 'stipend-tracking':
      return <StipendTrackingPanel />;
    case 'leave-of-absence':
      return <LeaveOfAbsencePanel />;
    case 'practical-training':
      return <PracticalTrainingPanel />;
    case 'thesis-allowance':
      return <ThesisAllowancePanel />;
    case 'travel-clearance':
      return <TravelClearancePanel />;
    case 'shifting-transferring':
      return <ShiftingTransferringPanel />;
    case 'request-forms':
      return <RequestFormsPanel />;
    case 'reimbursement':
      return <ReimbursementPanel />;
    case 'support-feedback':
      return <SupportFeedbackPanel />;
    default: {
      const service = activeService ?? "service";

      const serviceTitle = service
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      return <div>{serviceTitle}</div>;
    }
  }
};
  
  if (!activeService) return null;

  return (
    <div
      className={cn(
        "relative w-full bg-[#f4f6fc] rounded-lg", 
        className 
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
      

      <div className="h-full overflow-y-auto scrollbar-thin p-6">
        {renderService()}
      </div>
    </div>
  );
}