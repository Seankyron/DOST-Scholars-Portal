'use client';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils/cn';
import type { SemesterAvailability } from '@/types/curriculum';
import { FileText, Check, Clock, RefreshCw, X, EyeOff } from 'lucide-react';

interface SemesterCardProps {
  semester: SemesterAvailability;
  onSelect: () => void;
}

const statusIcons: Record<string, React.ElementType> = {
  Open: FileText,
  Approved: Check,
  Pending: Clock,
  Resubmit: RefreshCw,
  Rejected: X,
  'Not Available': EyeOff,
  Closed: Check,
};

export function SemesterCard({ semester, onSelect }: SemesterCardProps) {
  const { status, semester: semesterName } = semester;
  const Icon = statusIcons[status] || FileText;
  
  const isClickable = status === 'Open' || status === 'Resubmit' || status === 'Pending';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isClickable}
      className={cn(
        // Base card styles from src/components/ui/card.tsx
        'rounded-xl border bg-card text-card-foreground shadow', 
        // Custom styles
        'w-full p-4 text-left transition-all duration-200', 
        isClickable 
          ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' 
          : 'bg-gray-50 opacity-70 cursor-not-allowed',
        status === 'Resubmit' && 'border-orange-400 ring-1 ring-orange-400',
        status === 'Open' && 'border-dost-blue ring-1 ring-dost-blue',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{semesterName}</span>
        <Icon className={cn(
          'h-5 w-5',
          status === 'Open' && 'text-dost-blue',
          status === 'Approved' && 'text-green-600',
          status === 'Pending' && 'text-blue-600',
          status === 'Resubmit' && 'text-orange-600',
          status === 'Rejected' && 'text-red-600',
          status === 'Not Available' && 'text-gray-400',
        )} />
      </div>
      <div className="mt-3 text-left">
        <StatusBadge status={status} />
      </div>
    </button>
  );
}