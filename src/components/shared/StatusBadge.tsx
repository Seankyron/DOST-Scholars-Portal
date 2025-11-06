// src/components/shared/StatusBadge.tsx
'use client';

import { cn } from '@/lib/utils/cn';
import { getStatusColor } from '@/lib/utils/constants';
import type { ScholarStatus } from '@/types/scholar';
import type { SubmissionStatus } from '@/types/services';

interface StatusBadgeProps {
  // Allow either type of status
  status: ScholarStatus | SubmissionStatus;
  className?: string;
  // Add children to allow custom text like "Active Scholar"
  children?: React.ReactNode; 
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        getStatusColor(status), // Uses the function from your constants!
        className
      )}
    >
      {children || status}
    </span>
  );
}