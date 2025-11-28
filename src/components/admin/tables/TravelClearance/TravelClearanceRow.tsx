'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TravelClearanceModal } from './TravelClearanceModal';
import type { TravelRequestDetails } from './TravelClearanceTable';

interface TravelClearanceRowProps {
  request: TravelRequestDetails;
  onUpdate: () => void;
}

export function TravelClearanceRow({ request, onUpdate }: TravelClearanceRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLate = !!request.submissionInfo.delayReason;

  return (
    <>
      <tr className={`hover:bg-gray-50 transition-colors ${isLate ? 'bg-yellow-50/30' : ''}`}>
        {/* Scholar */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{request.scholarInfo.name}</span>
            <span className="text-xs text-gray-500">{request.spas_id}</span>
          </div>
        </td>

        {/* University / Program */}
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

        {/* Purpose */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {request.purpose}
        </td>

        {/* Destination */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {request.travelDetails.destination}
        </td>

        {/* Travel Dates */}
        <td className="px-4 py-3 whitespace-nowrap">
           <div className="flex flex-col">
             <span className="text-sm text-gray-900">{formatDate(request.travelDetails.departureDate)}</span>
             <span className="text-sm text-gray-500">to {formatDate(request.travelDetails.arrivalDate)}</span>
           </div>
        </td>

        {/* ADDED: Date Submitted Column */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {formatDate(request.submissionInfo.dateSubmitted)}
        </td>

        {/* Status (Updated to remove Date Submitted subtext) */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <StatusBadge status={request.submissionInfo.status} />
            
            {/* Late Warning Badge */}
            {isLate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-700 cursor-help">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase">Late</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border-yellow-200 text-gray-800 shadow-md">
                    <p className="font-semibold text-xs mb-1 text-yellow-700">Reason for Delay:</p>
                    <p className="max-w-xs text-xs">"{request.submissionInfo.delayReason}"</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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

      <TravelClearanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onUpdate={onUpdate}
      />
    </>
  );
}