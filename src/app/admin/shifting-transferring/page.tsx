'use client';

import { useState, useCallback } from 'react';
import { ShiftingTransferringTable } from '@/components/admin/tables/ShiftingTransferring/ShiftingTransferringTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { 
  ShiftingTransferringFilters, 
  type ShiftingTransferringFiltersState 
} from '@/components/admin/tables/ShiftingTransferring/ShiftingTransferringFilters';

const INITIAL_FILTERS: ShiftingTransferringFiltersState = {
  status: 'All',
  type: 'All',
  university: 'All',
  dateRange: { start: null, end: null },
};

export default function ShiftingTransferringPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ShiftingTransferringFiltersState>(INITIAL_FILTERS);

  const handleFilterChange = useCallback((key: keyof ShiftingTransferringFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Shifting & Transferring Management
        </h1>
      </div>

      {/* Filter Components */}
      <ShiftingTransferringFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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
        <ShiftingTransferringTable 
          searchTerm={searchTerm} 
          filters={filters}
        />
      </div>
    </div>
  );
}