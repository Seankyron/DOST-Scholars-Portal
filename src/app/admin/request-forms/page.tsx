'use client';

import { useState } from 'react';
import { RequestFormsTable } from '@/components/admin/tables/RequestForms/RequestFormsTable';
import { RequestFormsFilters } from '@/components/admin/tables/RequestForms/RequestFormsFilters';
import { SearchInput } from '@/components/shared/SearchInput';

export default function RequestFormsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Request Forms Management
        </h1>
      </div>

      {/* Filter Components */}
      <RequestFormsFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Requests
          </h2>
          <SearchInput
            placeholder="Search by Name..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <RequestFormsTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}