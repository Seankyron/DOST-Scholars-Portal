'use client';

import { useState } from 'react';
import { ThesisTable } from '@/components/admin/tables/ThesisAllowance/ThesisTable';
import { ThesisFilters } from '@/components/admin/tables/ThesisAllowance/ThesisFilters';
import { SearchInput } from '@/components/shared/SearchInput';

export default function ThesisAllowancePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Thesis Allowance Management
      </h1>

      {/* Filter Components */}
      <ThesisFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Transactions
          </h2>
          <SearchInput
            placeholder="Search Scholars..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <ThesisTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}