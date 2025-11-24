'use client';

import { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import type { PTPRequestDetails } from './PTPTable';
import { PTPModal } from './PTPModal'; 

interface PTPRowProps {
  request: PTPRequestDetails; 
  onUpdate: () => void; // FIXED: Added missing prop definition
}

export function PTPRow({ request, onUpdate }: PTPRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
          {request.scholarInfo.name}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          <div className="font-medium">{request.type}</div>
          <div className="text-xs text-gray-500">Training Year: {request.submissionInfo.trainingYear || 'N/A'}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {request.placementInfo.university}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(request.submissionInfo.dateSubmitted)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={request.submissionInfo.status} />
        </td>
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
        onUpdate={onUpdate} // FIXED: Passing the prop to the modal
      />
    </>
  );
}