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
}

export function GradeSubmissionRow({ submission }: GradeSubmissionRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{submission.scholarInfo.name}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          <div>{submission.submissionInfo.year}, {submission.submissionInfo.semester}</div>
          <div className="text-xs text-gray-500">{submission.submissionInfo.academicYear}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{submission.placementInfo.university}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(submission.submissionInfo.dateSubmitted)}</td>
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={submission.submissionInfo.status} />
        </td>
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
      />
    </>
  );
}