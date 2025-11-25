'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { StipendDetails } from './StipendTrackingTable';
import { formatDate } from '@/lib/utils/date';
import { Checkbox } from '@/components/ui/checkbox';

interface StipendTrackingRowProps {
  stipend: StipendDetails;
  onUpdate: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function StipendTrackingRow({
  stipend,
  onUpdate,
  isSelected,
  onSelect,
}: StipendTrackingRowProps) {
  const { scholarInfo, placementInfo, semesterInfo, stipend: stipendData } = stipend;

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
      <td className="p-4 w-12">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect()}
          aria-label={`Select row for ${scholarInfo.name}`}
        />
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {scholarInfo.name}
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {scholarInfo.scholarId}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col max-w-[200px]">
          <span className="text-sm text-gray-800 truncate" title={placementInfo.university}>
            {placementInfo.university}
          </span>
          <span className="text-xs text-gray-500 truncate" title={placementInfo.program}>
            {placementInfo.program}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        <div className="flex flex-col">
          <span className="font-medium">{semesterInfo.semester}</span>
          <span className="text-xs text-gray-500">{semesterInfo.academicYear}</span>
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={stipendData.status} />
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {stipendData.dateApproved
          ? formatDate(stipendData.dateApproved, 'MMM dd, yyyy')
          : <span className="text-gray-400 italic">N/A</span>}
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 font-medium">
        {formatCurrency(stipendData.received)}
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-800 font-medium">
        {formatCurrency(stipendData.pending)}
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-8 h-8 p-0" 
          onClick={onUpdate}
          title="Update Stipend Details"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}