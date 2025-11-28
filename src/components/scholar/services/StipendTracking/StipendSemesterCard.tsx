'use client';

import { InfoTooltip } from '@/components/shared/InfoToolTip';
import { cn } from '@/lib/utils/cn';
import type { StipendSemesterAvailability } from '@/types';
import { 
  Check, 
  ChevronRight,
  PauseCircle, 
  AlertTriangle,
  EyeOff
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StipendSemesterCardProps {
  semester: StipendSemesterAvailability;
  onSelect: () => void;
}

const statusConfig: Record<string, { icon: React.ElementType, cta: string, colorClass: string, tooltip: string }> = {
  'Released': { 
    icon: Check, 
    cta: 'View Details',
    colorClass: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    tooltip: "All expected stipend/allowances have been released."
  },
  'Pending': { 
    icon: AlertTriangle, 
    cta: 'View Details',
    colorClass: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    tooltip: "Stipend is currently being processed by DOST-SEI."
  },
  'On hold': { 
    icon: PauseCircle, 
    cta: 'View Details (On Hold)',
    colorClass: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    tooltip: "Stipend is temporarily on hold due to missing requirements or internal review."
  },
  'Not Available': { 
    icon: EyeOff, 
    cta: 'Grade Submission Pending',
    colorClass: "bg-gray-100 text-gray-400",
    tooltip: "Stipend is locked. You must have an 'Approved' Grade Submission for this period first."
  },
};

export function StipendSemesterCard({ semester, onSelect }: StipendSemesterCardProps) {
  const { status, semester: semesterName, isGradeApproved } = semester;
  
  const config = statusConfig[status] || statusConfig['Not Available'];
  const Icon = config.icon;
  
  // Only clickable if Grade Submission is approved
  const isClickable = isGradeApproved;

  return (
    <Card
      onClick={isClickable ? onSelect : undefined}
      className={cn(
        "transition-all duration-200 border-2 border-transparent bg-white relative",
        isClickable 
          ? "cursor-pointer hover:shadow-lg hover:border-dost-title/30 group" 
          : "opacity-70 bg-gray-50 cursor-not-allowed border-gray-100"
      )}
    >
      <InfoTooltip 
         side="top" 
         className="absolute top-3 right-3 opacity-70"
         iconClassName={cn(!isClickable && "text-gray-600 hover:text-gray-600")}
      >
        {config.tooltip}
      </InfoTooltip>

      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200",
            config.colorClass
          )}>
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className={cn(
              "font-bold text-lg truncate transition-colors",
              isClickable ? "text-gray-900 group-hover:text-dost-title" : "text-gray-500"
            )}>
              {semesterName}
            </h4>
            <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">
              {config.cta}
            </p>
          </div>
        </div>

        {isClickable && (
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-dost-title transition-colors flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}