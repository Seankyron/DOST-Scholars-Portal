'use client';

import { useState } from 'react';
import { StipendTrackingTable } from '@/components/admin/tables/StipendTracking/StipendTrackingTable';
import { StipendTrackingFilters } from '@/components/admin/tables/StipendTracking/StipendTrackingFilters';
import { SearchInput } from '@/components/shared/SearchInput';

export default function AdminStipendTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Add other filter states here later

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Stipend Management
      </h1>

      {/* Filter Components */}
      <StipendTrackingFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Scholar Stipends
          </h2>
          <SearchInput
            placeholder="Search Scholars..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <StipendTrackingTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}