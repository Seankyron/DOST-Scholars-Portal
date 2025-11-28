'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { ShiftingTransferringModal } from './ShiftingTransferringModal';
import type { ShiftingRequestDetails } from './ShiftingTransferringTable';

interface ShiftingTransferringRowProps {
  request: ShiftingRequestDetails;
  onUpdate: () => void;
}

export function ShiftingTransferringRow({ request, onUpdate }: ShiftingTransferringRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scholarInfo, currentPlacement, newPlacement, submissionInfo, applicationType } = request;

  // Helper to format the "Proposed Changes" column content
  const getProposedChange = () => {
    return (
      <div className="flex flex-col max-w-xs truncate">
         {newPlacement.university && (
            <span className="text-sm text-gray-900 truncate" title={newPlacement.university}>
                {newPlacement.university}
            </span>
         )}
         {newPlacement.program && (
            <span className="text-sm text-gray-900 truncate" title={newPlacement.program}>
                {newPlacement.program}
            </span>
         )}
         {!newPlacement.university && !newPlacement.program && (
            <span className="text-sm text-gray-500 italic">No specific change</span>
         )}
      </div>
    );
  };

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

        {/* Application Type */}
        <td className="px-4 py-3 whitespace-nowrap">
           <span className="text-sm font-medium text-gray-900">
            {applicationType}
          </span>
        </td>

        {/* Current Placement */}
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

        {/* Proposed Changes */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
           {getProposedChange()}
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

      <ShiftingTransferringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate}
      />
    </>
  );
}