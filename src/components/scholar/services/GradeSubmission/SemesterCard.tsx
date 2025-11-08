'use client';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils/cn';
import type { SemesterAvailability } from '@/types/curriculum';
import { FileText, Check, Clock, RefreshCw, X, EyeOff, Eye, UploadCloud } from 'lucide-react';

interface SemesterCardProps {
  semester: SemesterAvailability;
  onSelect: () => void;
}

const statusConfig: Record<string, { icon: React.ElementType, text: string, cta: string, iconColor: string }> = {
  Open: { icon: UploadCloud, text: 'Open for Submission', cta: 'Submit Grades', iconColor: 'text-dost-blue' },
  Approved: { icon: Check, text: 'Approved', cta: 'Submission Approved', iconColor: 'text-green-600' }, // Changed
  Pending: { icon: Clock, text: 'Pending Review', cta: 'View Submission', iconColor: 'text-blue-600' },
  Resubmit: { icon: RefreshCw, text: 'Resubmission Required', cta: 'Resubmit Grades', iconColor: 'text-orange-600' },
  Rejected: { icon: X, text: 'Submission Rejected', cta: 'View Details', iconColor: 'text-red-600' },
  'Not Available': { icon: EyeOff, text: 'Not Available', cta: 'Locked', iconColor: 'text-gray-400' },
  Closed: { icon: Check, text: 'Closed', cta: 'Submission Closed', iconColor: 'text-green-600' }, // Changed
};

export function SemesterCard({ semester, onSelect }: SemesterCardProps) {
  const { status, semester: semesterName } = semester;
  const config = statusConfig[status] || { icon: FileText, text: status, cta: 'View', iconColor: 'text-gray-500' };
  const Icon = config.icon;
  
  const isClickable = status === 'Open' || status === 'Resubmit' || status === 'Pending' || status === 'Rejected';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isClickable}
      className={cn(
        'rounded-xl border shadow-sm',
        'p-4 text-left transition-all duration-200 w-full flex flex-col h-full justify-between',
        'bg-white',
        isClickable 
          ? 'hover:shadow-md hover:border-dost-blue/80 cursor-pointer' 
          : 'bg-gray-50 opacity-80 cursor-not-allowed',
        
        // --- MODIFICATION 2: Added green border for Approved/Closed ---
        (status === 'Approved' || status === 'Closed') && 'border-green-500',
        status === 'Resubmit' && 'border-orange-400',
        status === 'Open' && 'border-dost-blue',
        status === 'Pending' && 'border-',
      )}
    >
      {/* Top Section: Icon + Status Text */}
      <div className="flex items-center gap-3">
        <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', 'bg-gray-100 border', config.iconColor)}>
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </div>
        <p className="text-sm font-semibold text-gray-700">{config.text}</p>
      </div>
      
      {/* Middle Section: Semester Name */}
      <div className="my-3">
        <h4 className="text-xl font-bold text-dost-title">{semesterName}</h4>
      </div>

      {/* Bottom Section: Call to Action */}
      <div className="flex items-center justify-between text-xs font-medium">
        <span className={cn(
          'font-semibold',
          isClickable ? 'text-dost-blue' : 'text-gray-500'
        )}>
          {config.cta}
        </span>
        {/* This icon will correctly hide itself on non-clickable cards */}
        {isClickable && <Eye className="h-4 w-4 text-gray-400" />}
      </div>
    </button>
  );
}