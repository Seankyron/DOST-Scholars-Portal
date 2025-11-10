'use client';

import { Pagination } from '@/components/shared/Pagination';
import { VerificationRow } from './VerificationRow';
import type { ScholarshipType } from '@/types';
import { Button } from '@/components/ui/button'; // <-- ADDED
import { Download } from 'lucide-react';

// (mockPendingAccounts data remains the same)
const mockPendingAccounts = [
  {
    id: '1',
    name: 'Andrea Villanueva',
    scholarId: '2022-0001',
    scholarshipType: 'RA 7687' as ScholarshipType,
    university: 'Cavite State University - Indan...',
    program: 'BS Electronics Engineeri...',
    email: 'andreavillanueva@cvsu...',
    fullData: { /* ... */ },
  },
  {
    id: '2',
    name: 'Jericho Dela Cruz',
    scholarId: '2022-0002',
    scholarshipType: 'Merit' as ScholarshipType,
    university: 'University of the Philippines - L...',
    program: 'BS Agricultural Biotechn...',
    email: 'jerichodelacruz@up.edu...',
    fullData: { /* ... */ },
  },
  {
    id: '3',
    name: 'Aldrich Arenas',
    scholarId: '2022-0003',
    scholarshipType: 'RA 7687' as ScholarshipType,
    university: 'Batangas State University - Ma...',
    program: 'BS Computer Science',
    email: 'aldrich.arenas@g.batstat...',
    fullData: { /* ... */ },
  },
];

interface VerificationTableProps {
  searchTerm: string;
  selectedAccountIds: string[];
  onSelectAll: (isChecking: boolean) => void;
  onSelectOne: (id: string) => void;
}

export function VerificationTable({
  searchTerm,
  selectedAccountIds,
  onSelectAll,
  onSelectOne,
}: VerificationTableProps) {
  // (Filtering logic remains the same)
  const filteredAccounts = mockPendingAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.scholarId && account.scholarId.includes(searchTerm))
  );

  const paginatedAccounts = filteredAccounts;
  const totalAccounts = filteredAccounts.length;

  const isAllSelected =
    paginatedAccounts.length > 0 &&
    selectedAccountIds.length === paginatedAccounts.length;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* (Table headers remain the same) */}
            <tr>
              <th
                scope="col"
                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  disabled={paginatedAccounts.length === 0}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Scholar
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SPAS ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                University
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Course
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAccounts.map((account) => (
              <VerificationRow
                key={account.id}
                account={account as any}
                isSelected={selectedAccountIds.includes(account.id)}
                onSelect={() => onSelectOne(account.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODIFIED: Pagination and Export layout --- */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing 1-{paginatedAccounts.length} of {totalAccounts} pending
          accounts
        </p>
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          className="sm:justify-self-center" // <-- Center pagination
        />
        <div className="flex sm:justify-end"> {/* <-- Right-align export */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Export logic not yet implemented.')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
}