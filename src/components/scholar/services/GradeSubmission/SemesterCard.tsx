'use client';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils/cn';
import type { SemesterAvailability } from '@/types/curriculum';
import { FileText, Check, Clock, RefreshCw, EyeOff, UploadCloud } from 'lucide-react';

interface SemesterCardProps {
  semester: SemesterAvailability;
  onSelect: () => void;
}

const statusConfig: Record<string, { icon: React.ElementType, cta: string, iconColor: string }> = {
  Open: { icon: UploadCloud, cta: 'Submit Requirements', iconColor: 'text-dost-blue' },
  Approved: { icon: Check, cta: 'View Submission', iconColor: 'text-green-600' },
  Pending: { icon: Clock, cta: 'View Submission', iconColor: 'text-yellow-800' },
  Resubmit: { icon: RefreshCw, cta: 'Resubmission Required', iconColor: 'text-orange-600' },
  'Not Available': { icon: EyeOff, cta: 'Locked', iconColor: 'text-gray-400' },
  Closed: { icon: Check, cta: 'View Submission', iconColor: 'text-green-600' },
};

export function SemesterCard({ semester, onSelect }: SemesterCardProps) {
  const { status, semester: semesterName } = semester;
  const config = statusConfig[status] || { icon: FileText, cta: 'View', iconColor: 'text-gray-500' };
  const Icon = config.icon;
  
  const isClickable = status !== 'Not Available';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'rounded-xl border bg-white shadow-md',   
        'p-4 text-left transition-all duration-200 w-full flex flex-col h-full justify-between',
        isClickable 
          ? 'hover:shadow-lg cursor-pointer' 
          : 'bg-gray-50 opacity-80', 
      )}
    >
      {/* Top Section: Icon + Status Badge */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', 
          'bg-gray-100', 
          config.iconColor
        )}>
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </div>
        
        <StatusBadge status={status} />
      </div>
      
      {/* Middle Section: Semester Name */}
      <div className="my-3">
        <h4 className="text-xl font-bold text-dost-title">{semesterName}</h4>
      </div>

      {/* Bottom Section: Call to Action */}
      <div className="flex items-center justify-start text-xs font-medium">
        <span className={cn(
          'font-semibold',
          isClickable ? 'text-dost-title' : 'text-gray-500'
        )}>
          {config.cta}
        </span>
      </div>
    </button>
  );
}