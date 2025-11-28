'use client';

import { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import type { GradeSubmissionDetails } from './GradeSubmissionsTable';
import { GradeSubmissionModal } from './GradeSubmissionModal'; 

interface GradeSubmissionRowProps {
  submission: GradeSubmissionDetails;
  onUpdate: () => void;
}

export function GradeSubmissionRow({ submission, onUpdate }: GradeSubmissionRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Scholar Name & SPAS ID */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{submission.scholarInfo.name}</span>
            <span className="text-xs text-gray-500">{submission.spas_id}</span>
          </div>
        </td>

        {/* Academic Term */}
        <td className="px-4 py-3 whitespace-nowrap">
           <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-900">{submission.submissionInfo.year}, {submission.submissionInfo.semester}</span>
             <span className="text-xs text-gray-500">{submission.submissionInfo.academicYear}</span>
           </div>
        </td>

        {/* University & Program */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col max-w-xs truncate">
            <span className="text-sm text-gray-900 truncate" title={submission.placementInfo.university}>
              {submission.placementInfo.university}
            </span>
            <span className="text-xs text-gray-500 truncate" title={submission.placementInfo.program}>
              {submission.placementInfo.program}
            </span>
          </div>
        </td>

        {/* Date Submitted */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(submission.submissionInfo.dateSubmitted)}
        </td>

        {/* Status */}
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={submission.submissionInfo.status} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => setIsModalOpen(true)} title="View Submission">
            <Eye className="h-4 w-4" />
          </Button>
        </td>
      </tr>
      
      <GradeSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={submission}
        onUpdate={onUpdate}
      />
    </>
  );
}