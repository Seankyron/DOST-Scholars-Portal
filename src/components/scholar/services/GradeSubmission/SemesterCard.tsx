'use client';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils/cn';
import type { SemesterAvailability } from '@/types/curriculum';
import { 
  FileText, 
  Check, 
  Clock, 
  RefreshCw, 
  EyeOff, 
  UploadCloud, 
  ChevronRight 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SemesterCardProps {
  semester: SemesterAvailability;
  onSelect: () => void;
}

const statusConfig: Record<string, { icon: React.ElementType, cta: string, colorClass: string }> = {
  Open: { 
    icon: UploadCloud, 
    cta: 'Submit Requirements',
    colorClass: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
  },
  Approved: { 
    icon: Check, 
    cta: 'View Submission',
    colorClass: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
  },
  Pending: { 
    icon: Clock, 
    cta: 'View Submission',
    colorClass: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white"
  },
  Resubmit: { 
    icon: RefreshCw, 
    cta: 'Resubmission Required',
    colorClass: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
  },
  'Not Available': { 
    icon: EyeOff, 
    cta: 'Locked',
    colorClass: "bg-gray-100 text-gray-400"
  },
  Closed: { 
    icon: Check, 
    cta: 'View Submission',
    colorClass: "bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white"
  },
};

export function SemesterCard({ semester, onSelect }: SemesterCardProps) {
  const { status, semester: semesterName } = semester;
  
  // Fallback to Open or Not Available if status is unknown
  const config = statusConfig[status] || statusConfig['Not Available'];
  const Icon = config.icon;
  
  const isClickable = status !== 'Not Available';

  return (
    <Card
      onClick={isClickable ? onSelect : undefined}
      className={cn(
        "transition-all duration-200 border-2 border-transparent bg-white",
        isClickable 
          ? "cursor-pointer hover:shadow-lg hover:border-dost-title/30 group" 
          : "opacity-70 bg-gray-50 cursor-not-allowed border-gray-100"
      )}
    >
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          
          {/* Icon Container with Dynamic Colors */}
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200",
            config.colorClass
          )}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Text Content */}
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

        {/* Right Side: Status & Arrow */}
        <div className="flex items-center gap-3 flex-shrink-0">
           {/* Only show status badge if available/relevant */}
           {status !== 'Not Available' && (
             <StatusBadge status={status} />
           )}
           
           {isClickable && (
             <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-dost-title transition-colors" />
           )}
        </div>
      </div>
    </Card>
  );
}