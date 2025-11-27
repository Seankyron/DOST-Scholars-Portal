'use client';

import { useState } from 'react';
import { ShiftingTransferringTable } from '@/components/admin/tables/ShiftingTransferring/ShiftingTransferringTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { ShiftingTransferringFilters } from '@/components/admin/tables/ShiftingTransferring/ShiftingTransferringFilters';

export default function ShiftingTransferringPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Shifting & Transferring Management
        </h1>
        <p className="text-gray-500">
          Manage scholar requests for course shifting and school transferring.
        </p>
      </div>

      {/* Filter Components */}
      <ShiftingTransferringFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Applications
          </h2>
          <SearchInput
            placeholder="Search by Name or SPAS ID..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <ShiftingTransferringTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}