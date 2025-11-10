'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { GradeSubmission } from '@/types/services';
import { formatDate } from '@/lib/utils/date';
import { FileText, Edit, Download} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SubmissionReviewProps {
  submission: GradeSubmission;
  onEdit: () => void;
}

function FileDisplay({ 
  label, 
  fileName, 
  fileUrl 
}: { 
  label: string; 
  fileName: string; 
  fileUrl?: string 
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      
      <div className={cn(
        'relative border-2 border-dashed rounded-lg p-4 transition-all',
        'border-gray-300 bg-white' 
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-8 w-8 text-dost-blue flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
              <p className="text-xs text-gray-500">
                File submitted successfully
              </p>
            </div>
          </div>
          <a
            href={fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-dost-blue hover:bg-gray-100 rounded-md"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function SubmissionReview({ submission, onEdit }: SubmissionReviewProps) {
  const canEdit = submission.status === 'Pending' || submission.status === 'Resubmit';

  return (
    <div className="space-y-6">
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Status & History</h3>
        <div className="p-4 bg-white rounded-lg border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Current Status:</span>
            <StatusBadge status={submission.status} className="text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Submitted:</span>
            <span className="text-sm font-medium text-gray-700">
              {formatDate(submission.dateSubmitted)}
            </span>
          </div>
          {submission.dateProcessed && (
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Last Updated:</span>
              <span className="text-sm font-medium text-gray-700">
                {formatDate(submission.dateProcessed)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Submitted Documents</h3>
        <div className="space-y-4">
          <FileDisplay 
            label={`Official Registration Form ${submission.semester}`}
            fileName={submission.registrationForm} 
            // fileUrl={submission.registrationFormUrl} // Use the actual URL
          />
          <FileDisplay 
            label="Transcript of Records / Certified Complete Grades"
            fileName={submission.copyOfGrades} 
            // fileUrl={submission.copyOfGradesUrl} // Use the actual URL
          />
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Response
          </Button>
        </div>
      )}
    </div>
  );
}