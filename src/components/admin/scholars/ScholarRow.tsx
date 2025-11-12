'use client';

import { Eye, Pencil, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ScholarStatus } from '@/types/scholar';

// --- THIS IS NOW THE "SINGLE SOURCE OF TRUTH" ---
export interface ScholarRowData {
  id: string; // Added for React key
  scholarId: string;
  email: string;
  firstName: string;
  middleName: string; // Keep as string, handle ""
  surname: string;
  suffix: string; // Keep as string, handle ""
  dateOfBirth: string;
  contactNumber: string;
  addressBrgy: string;
  addressCity: string;
  addressProvince: string;
  scholarshipType: string;
  yearAwarded: string;
  university: string;
  program: string;
  status: ScholarStatus; // Added
  yearLevel: string; // Added
  midyear1stYear: boolean;
  midyear2ndYear: boolean;
  midyear3rdYear: boolean;
  midyear4thYear: boolean;
  thesis1stYear: boolean;
  thesis2ndYear: boolean;
  thesis3rdYear: boolean;
  thesis4thYear: boolean;
  courseDuration: string;
  ojtYear: string;
  ojtSemester: string;
  curriculumFile?: {
    name: string;
    url: string;
  };
}

interface ScholarRowProps {
  scholar: ScholarRowData;
  onView: (scholar: ScholarRowData) => void;
  onEdit: (scholar: ScholarRowData) => void;
  onHistory: (scholar: ScholarRowData) => void;
  onDelete: (scholar: ScholarRowData) => void;
}

export function ScholarRow({
  scholar,
  onView,
  onEdit,
  onHistory,
  onDelete,
}: ScholarRowProps) {
  const fullName = [
    scholar.firstName,
    scholar.middleName,
    scholar.surname,
    scholar.suffix,
  ]
    .filter(Boolean) // Remove empty strings
    .join(' ');

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{fullName}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.scholarId}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.scholarshipType}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.university}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.yearLevel}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.program}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={scholar.status} />
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.email}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          {/* --- (Buttons are correct and use the props) --- */}
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onView(scholar)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onEdit(scholar)}
            title="Edit Scholar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onHistory(scholar)}
            title="Scholar History"
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(scholar)}
            title="Delete Scholar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    </>
  );
}