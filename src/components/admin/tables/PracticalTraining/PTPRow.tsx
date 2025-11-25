'use client';

import { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { PTPModal } from './PTPModal'; 
import type { PTPRequestDetails } from '@/types/admin';

interface PTPRowProps {
  request: PTPRequestDetails; 
  onUpdate: () => void;
}

export function PTPRow({ request, onUpdate }: PTPRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Scholar Name & SPAS ID */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{request.scholarInfo.name}</span>
            <span className="text-xs text-gray-500">{request.spas_id}</span>
          </div>
        </td>

        {/* Transaction Type */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {request.type}   
        </td>

        {/* Academic Term */}
        <td className="px-4 py-3 whitespace-nowrap">
           <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-900">{request.submissionInfo.semester}</span>
             <span className="text-xs text-gray-500">{request.submissionInfo.academicYear}</span>
           </div>
        </td>

        {/* University & Program */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col max-w-xs truncate">
            <span className="text-sm text-gray-900 truncate" title={request.placementInfo.university}>
              {request.placementInfo.university}
            </span>
            <span className="text-xs text-gray-500 truncate" title={request.placementInfo.program}>
              {request.placementInfo.program}
            </span>
          </div>
        </td>

        {/* Date Submitted */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(request.submissionInfo.dateSubmitted)}
        </td>

        {/* Status */}
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={request.submissionInfo.status} />
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
      
      <PTPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate} 
      />
    </>
  );
}