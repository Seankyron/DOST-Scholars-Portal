'use client';

import { AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SubmissionStatus } from '@/types/services';

interface AdminCommentAlertProps {
  status: SubmissionStatus;
  comment: string;
}

export function AdminCommentAlert({ status, comment }: AdminCommentAlertProps) {
  const isResubmit = status === 'Resubmit';
  
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        isResubmit
          ? 'bg-orange-50 border-orange-200'
          : 'bg-red-50 border-red-200'
      )}
    >
      {isResubmit ? (
        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
      )}
      <div>
        <h4 
          className={cn(
            'text-sm font-semibold',
            isResubmit ? 'text-orange-800' : 'text-red-800'
          )}
        >
          {status === 'Resubmit' ? 'Resubmission Required' : 'Submission Rejected'}
        </h4>
        <p className={cn(
          'text-sm mt-1',
           isResubmit ? 'text-orange-700' : 'text-red-700'
        )}>
          {comment}
        </p>
      </div>
    </div>
  );
}