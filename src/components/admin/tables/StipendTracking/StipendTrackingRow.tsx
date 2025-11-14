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
  const { scholarInfo, semesterInfo, stipend: stipendData } = stipend;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
          aria-label={`Select row for ${scholarInfo.name}`}
        />
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {scholarInfo.name}
        </div>
        <div className="text-xs text-gray-500">{scholarInfo.scholarId}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        <div>
          {semesterInfo.year}, {semesterInfo.semester}
        </div>
        <div className="text-xs text-gray-500">
          {semesterInfo.academicYear}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={stipendData.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {stipendData.dateSubmitted
          ? formatDate(stipendData.dateSubmitted, 'MMM dd, yyyy')
          : 'N/A'}
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
          title="Update Stipend"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}