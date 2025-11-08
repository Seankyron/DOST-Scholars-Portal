'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { GradeSubmission } from '@/types/services';
import { formatDate } from '@/lib/utils/date';
import { FileText, Edit, Download } from 'lucide-react';

interface SubmissionReviewProps {
  submission: GradeSubmission;
  onEdit: () => void;
}

// Helper component to display a file
function FileDisplay({ fileName, fileUrl }: { fileName: string; fileUrl?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="h-6 w-6 text-dost-blue flex-shrink-0" />
        <span className="text-sm font-medium text-gray-800 truncate">{fileName}</span>
      </div>
      <a
        href={fileUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 text-gray-500 hover:text-dost-blue hover:bg-gray-100 rounded-md"
        title="Download"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}

export function SubmissionReview({ submission, onEdit }: SubmissionReviewProps) {
  const canEdit = submission.status === 'Pending' || submission.status === 'Resubmit';

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
        <div className="flex items-center justify-between">
          <StatusBadge status={submission.status} className="text-base px-4 py-1.5" />
          <p className="text-sm text-gray-500">
            Submitted: {formatDate(submission.dateSubmitted)}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Uploaded Documents</h4>
        <div className="space-y-3">
          <FileDisplay 
            fileName={submission.registrationForm} 
            // fileUrl={submission.registrationFormUrl} // Use the actual URL
          />
          <FileDisplay 
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