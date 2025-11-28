'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { ReimbursementModal } from './ReimbursementModal';
import type { ReimbursementRequestDetails } from './ReimbursementTable';

interface ReimbursementRowProps {
  request: ReimbursementRequestDetails;
  onUpdate: () => void;
}

export function ReimbursementRow({ request, onUpdate }: ReimbursementRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scholarInfo, currentPlacement, reimbursementType, amount, submissionInfo } = request;

  // Format amount to currency
  const formattedAmount = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);

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

        {/* University */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col max-w-xs truncate">
            <span className="text-sm text-gray-900 truncate" title={currentPlacement.university}>
              {currentPlacement.university}
            </span>
            <span className="text-xs text-gray-500 truncate" title={currentPlacement.program}>
              {currentPlacement.program}
            </span>
          </div>
        </td>

        {/* Type */}
        <td className="px-4 py-3 whitespace-nowrap">
           <span className="text-sm font-medium text-gray-900">
            {reimbursementType}
          </span>
        </td>

        {/* Amount */}
        <td className="px-4 py-3 whitespace-nowrap">
           <span className="text-sm font-semibold text-dost-title">
            {formattedAmount}
           </span>
        </td>

        {/* Date Submitted */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(submissionInfo.dateSubmitted)}
        </td>

        {/* Status */}
        <td className="px-4 py-3 whitespace-nowrap">
           <StatusBadge status={submissionInfo.status} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-8 h-8 p-0" 
            onClick={() => setIsModalOpen(true)} 
            title="View Request"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      <ReimbursementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate}
      />
    </>
  );
}