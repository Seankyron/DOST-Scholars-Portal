'use client';

import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export interface VerificationRowData {
  id: string; 
  scholarId: string;
  email: string;
  firstName: string;
  middleName: string;
  surname: string;
  suffix: string;
  fullName: string;
  dateOfBirth: string;
  contactNumber: string;
  addressBrgy: string;
  addressCity: string;
  addressProvince: string;
  scholarshipType: string;
  yearAwarded: string;
  university: string;
  program: string;
  courseDuration: string;
  ojtYear: string;
  ojtSemester: string;
  midyear1stYear: boolean;
  midyear2ndYear: boolean;
  midyear3rdYear: boolean;
  midyear4thYear: boolean;
  thesis1stYear: boolean;
  thesis2ndYear: boolean;
  thesis3rdYear: boolean;
  thesis4thYear: boolean;
  curriculumFile?: {
    name: string;
    url: string;
  };
}

interface VerificationRowProps {
  account: VerificationRowData;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
}

export function VerificationRow({
  account,
  isSelected,
  onSelect,
  onView,
}: VerificationRowProps) {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
      <td className="p-4 w-12">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect()}
          aria-label={`Select row for ${account.fullName}`}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {account.fullName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {account.scholarId}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {account.scholarshipType}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        <div className="max-w-[180px] truncate" title={account.university}>
            {account.university}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        <div className="max-w-[150px] truncate" title={account.program}>
            {account.program}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {account.email}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        <Button
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={onView}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}