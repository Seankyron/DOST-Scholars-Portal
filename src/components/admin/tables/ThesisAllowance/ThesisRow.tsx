'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ThesisModal } from './ThesisModal';
import type { ThesisRequestDetails } from '@/types/admin'; 

interface ThesisRowProps {
  request: ThesisRequestDetails;
  onUpdate: () => void;
}

export function ThesisRow({ request, onUpdate }: ThesisRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Scholar Name & SPAS ID */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{request.scholarInfo.name}</span>
            <span className="text-xs text-gray-500">{request.scholarInfo.spas_id}</span>
          </div>
        </td>

        {/* Release Type (Isolated) */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
            {request.percentage}% Release
        </td>

        {/* Academic Term (New Column) */}
        <td className="px-4 py-3 whitespace-nowrap">
           <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-900">{request.semester}</span>
             <span className="text-xs text-gray-500">{request.academicYear}</span>
           </div>
        </td>

        {/* University & Program */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col max-w-xs truncate">
            <span className="text-sm text-gray-900 truncate" title={request.scholarInfo.university}>
              {request.scholarInfo.university}
            </span>
            <span className="text-xs text-gray-500 truncate" title={request.scholarInfo.program}>
              {request.scholarInfo.program}
            </span>
          </div>
        </td>

        {/* Date Submitted */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(request.dateSubmitted)}
        </td>

        {/* Status */}
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={request.status} />
        </td>

        {/* Actions (Icon Only) */}
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
      
      <ThesisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate} 
      />
    </>
  );
}