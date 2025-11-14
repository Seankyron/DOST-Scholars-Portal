'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SubmissionStatus } from '@/types/services';

interface AdminCommentAlertProps {
  status: SubmissionStatus;
  comment: string;
}

export function AdminCommentAlert({ status, comment }: AdminCommentAlertProps) {
  const isResubmit = status === 'Resubmit';
  const isApproved = status === 'Approved';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        isResubmit && 'bg-orange-50 border-orange-200',
        isApproved && 'bg-green-50 border-green-200'
      )}
    >
      {isResubmit && (
        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
      )}
      {isApproved && (
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
      )}
      
      <div>
        <h4 
          className={cn(
            'text-sm font-semibold',
            isResubmit && 'text-orange-800',
            isApproved && 'text-green-800'
          )}
        >
          {isResubmit && 'Resubmission Required'}
          {isApproved && 'Submission Approved'}
        </h4>
        <p className={cn(
          'text-sm mt-1',
           isResubmit && 'text-orange-700',
           isApproved && 'text-green-700'
        )}>
          {comment}
        </p>
      </div>
    </div>
  );
}