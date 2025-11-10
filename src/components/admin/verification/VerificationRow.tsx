'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react'; // <-- Removed Check, X
import { VerificationModal } from './VerificationModal';
// <-- Removed ConfirmDialog and toast

// This type should match the data structure from the mock data
type PendingAccount = {
  id: string;
  name: string;
  scholarId: string;
  scholarshipType: string;
  university: string;
  program: string;
  email: string;
  fullData: any;
};

// --- MODIFIED: Props updated ---
interface VerificationRowProps {
  account: PendingAccount;
  isSelected: boolean;
  onSelect: () => void;
}

export function VerificationRow({
  account,
  isSelected,
  onSelect,
}: VerificationRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // <-- Removed all state and handlers for verify/reject dialogs -->

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-4">
          {/* This checkbox is for bulk actions and remains */}
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={isSelected}
            onChange={onSelect}
          />
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {account.name}
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
        <td className="px-4 py-3 whitespace-nowrowrap text-sm text-gray-700">
          {account.program}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {account.email}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          {/* This is now the only button in the row */}
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setIsModalOpen(true)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {/* <-- Removed Verify and Reject buttons --> */}
        </td>
      </tr>

      {/* This modal now contains the verify/reject buttons */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountData={account.fullData}
      />

      {/* <-- Removed the two ConfirmDialog components --> */}
    </>
  );
}