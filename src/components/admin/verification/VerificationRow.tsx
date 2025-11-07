'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { VerificationModal } from './VerificationModal';

// This type should match the data structure from the mock data
type PendingAccount = {
  id: string;
  name: string;
  scholarId: string; // <-- ADDED
  scholarshipType: string;
  university: string;
  program: string;
  email: string;
  fullData: any;
};

interface VerificationRowProps {
  account: PendingAccount;
}

export function VerificationRow({ account }: VerificationRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerify = () => {
    alert(`Verifying ${account.name}...`);
  };

  const handleReject = () => {
    alert(`Rejecting ${account.name}...`);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-4">
          <input type="checkbox" className="rounded border-gray-300" />
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {account.name}
          </div>
        </td>
        {/* --- ADDED CELL --- */}
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
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setIsModalOpen(true)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
            onClick={handleVerify}
            title="Verify"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700"
            onClick={handleReject}
            title="Reject"
          >
            <X className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountData={account.fullData}
      />
    </>
  );
}