'use client';

import { useState } from 'react';
import { ReimbursementTable } from '@/components/admin/tables/Reimbursement/ReimbursementTable';
import { ReimbursementFilters } from '@/components/admin/tables/Reimbursement/ReimbursementFilters';
import { SearchInput } from '@/components/shared/SearchInput';

export default function ReimbursementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Reimbursement Management
        </h1>
      </div>

      {/* Filter Components */}
      <ReimbursementFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Reimbursement Requests
          </h2>
          <SearchInput
            placeholder="Search by Name or SPAS ID..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <ReimbursementTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}