'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { VerificationModal } from './VerificationModal';
import type { ScholarStatus } from '@/types/scholar';

// --- NEW: This is our "Single Source of Truth" ---
// This detailed type will be used by the Table, Row, and Modal
export interface VerificationRowData {
  id: string; // The auth.users UUID
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

// --- MODIFIED: Props updated ---
interface VerificationRowProps {
  account: VerificationRowData;
  isSelected: boolean;
  onSelect: () => void;
  // --- NEW: Handlers for modal verification ---
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export function VerificationRow({
  account,
  isSelected,
  onSelect,
  onVerify,
  onReject,
}: VerificationRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-4">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={isSelected}
            onChange={onSelect}
          />
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {/* --- MODIFIED: Use new data shape --- */}
          <div className="text-sm font-medium text-gray-900">
            {account.fullName}
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {account.scholarId}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {account.scholarshipType}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {account.university}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {account.program}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {account.email}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setIsModalOpen(true)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountData={account}
        // --- NEW: Pass handlers to the modal ---
        onVerify={() => onVerify(account.id)}
        onReject={() => onReject(account.id)}
      />
    </>
  );
}