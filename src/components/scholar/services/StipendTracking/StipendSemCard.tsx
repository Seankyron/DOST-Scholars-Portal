'use client';

import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils/cn';
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  AlertOctagon, 
  ChevronRight,
  Coins
} from 'lucide-react';
import type { SubmissionStatus, ScholarStatus } from '@/types';

interface StipendSemCardProps {
  title: string;
  subtitle: string;
  status: SubmissionStatus | ScholarStatus | 'Locked';
  amountReleased?: number;
  onClick?: () => void;
}

// Visual configuration for each status
const statusConfig: Record<string, { icon: React.ElementType, colorClass: string, label: string }> = {
  Released: { 
    icon: CheckCircle, 
    colorClass: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    label: "Fully Released"
  },
  'Partial': { 
    icon: Coins, 
    colorClass: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    label: "Partially Released"
  },
  Processing: { 
    icon: Clock, 
    colorClass: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white",
    label: "Processing"
  },
  'On hold': { 
    icon: AlertOctagon, 
    colorClass: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    label: "On Hold"
  },
  Locked: { 
    icon: Lock, 
    colorClass: "bg-gray-100 text-gray-400",
    label: "Requires Grades"
  },
};

export function StipendSemCard({ title, subtitle, status, amountReleased, onClick }: StipendSemCardProps) {
  const config = statusConfig[status] || statusConfig['Locked'];
  const Icon = config.icon;
  const isLocked = status === 'Locked';

  return (
    <Card
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        "relative overflow-hidden transition-all duration-200 border-2 border-transparent bg-white",
        !isLocked 
          ? "cursor-pointer hover:shadow-lg hover:border-dost-title/30 group" 
          : "opacity-80 bg-gray-50 border-gray-100 cursor-not-allowed"
      )}
    >
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200",
            config.colorClass
          )}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Text Info */}
          <div>
            <h4 className={cn(
              "font-bold text-base truncate transition-colors",
              !isLocked ? "text-gray-900 group-hover:text-dost-title" : "text-gray-500"
            )}>
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            
            {/* Optional Amount Display for released items */}
            {!isLocked && amountReleased !== undefined && amountReleased > 0 && (
               <p className="text-xs font-medium text-green-600 mt-1">
                 ₱{amountReleased.toLocaleString()} Received
               </p>
            )}
          </div>
        </div>

        {/* Right Side: Status & Action */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
           {isLocked ? (
             <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
               Locked
             </span>
           ) : (
             <>
               <StatusBadge status={status as any} className="text-[10px] px-2 h-5" />
               <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-dost-title transition-colors hidden sm:block" />
             </>
           )}
        </div>
      </div>
    </Card>
  );
}