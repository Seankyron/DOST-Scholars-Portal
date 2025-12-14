'use client';

import { useState, useCallback } from 'react';
import { ReimbursementTable } from '@/components/admin/tables/Reimbursement/ReimbursementTable';
import { 
  ReimbursementFilters, 
  type ReimbursementFiltersState 
} from '@/components/admin/tables/Reimbursement/ReimbursementFilters';
import { SearchInput } from '@/components/shared/SearchInput';

const INITIAL_FILTERS: ReimbursementFiltersState = {
  status: 'All',
  type: 'All',
  university: 'All',
  dateRange: { start: null, end: null },
};

export default function ReimbursementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ReimbursementFiltersState>(INITIAL_FILTERS);

  const handleFilterChange = useCallback((key: keyof ReimbursementFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Reimbursement Management
        </h1>
      </div>

      {/* Filter Components */}
      <ReimbursementFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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
        <ReimbursementTable 
          searchTerm={searchTerm} 
          filters={filters}
        />
      </div>
    </div>
  );
}