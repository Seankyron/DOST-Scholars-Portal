'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { SupportFeedbackModal } from './SupportFeedbackModal';
import type { SupportFeedbackRequestDetails } from './SupportFeedbackTable';

interface SupportFeedbackRowProps {
  request: SupportFeedbackRequestDetails;
  onUpdate: () => void;
}

export function SupportFeedbackRow({ request, onUpdate }: SupportFeedbackRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scholarInfo, submissionInfo } = request;

  // Map 'Approved' status to 'Resolved' for display (aligns with Scholar View)
  const displayStatus = submissionInfo.status === 'Approved' ? 'Resolved' : submissionInfo.status;

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Scholar */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{scholarInfo.name}</span>
            <span className="text-xs text-gray-500">{request.spas_id}</span>
          </div>
        </td>

        {/* Category */}
        <td className="px-4 py-3 whitespace-nowrap">
           <span className="text-sm font-medium text-gray-900">
            {submissionInfo.category}
          </span>
        </td>

        {/* Date Submitted */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(submissionInfo.dateSubmitted)}
        </td>

        {/* Status */}
        <td className="px-4 py-3 whitespace-nowrap">
           <StatusBadge status={displayStatus} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-8 h-8 p-0" 
            onClick={() => setIsModalOpen(true)} 
            title="View Ticket"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      <SupportFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate}
      />
    </>
  );
}