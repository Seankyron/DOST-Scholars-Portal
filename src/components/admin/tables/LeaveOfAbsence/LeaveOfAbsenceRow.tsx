'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { LeaveOfAbsenceModal } from './LeaveOfAbsenceModal';
import type { LOARequestDetails } from './LeaveOfAbsenceTable';

interface LOARowProps {
  request: LOARequestDetails;
  onUpdate: () => void;
}

export function LeaveOfAbsenceRow({ request, onUpdate }: LOARowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scholarInfo, currentPlacement, loaDetails, submissionInfo, applicationType } = request;

  // Helper to format the "Leave Period" column content
  const getLeavePeriod = () => {
    return (
      <div className="flex flex-col max-w-xs truncate">
         <span className="text-sm font-semibold text-gray-900 truncate">
             {loaDetails.startSemester} | {loaDetails.academicYear}
         </span>
         <span className="text-xs text-gray-500 truncate">
             Duration: {loaDetails.duration}
         </span>
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

        {/* LOA Type */}
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

        {/* Leave Period */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
           {getLeavePeriod()}
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

      <LeaveOfAbsenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate}
      />
    </>
  );
}