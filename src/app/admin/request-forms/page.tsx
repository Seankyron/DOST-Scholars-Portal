'use client';

import { useState, useCallback } from 'react';
import { RequestFormsTable } from '@/components/admin/tables/RequestForms/RequestFormsTable';
import { 
  RequestFormsFilters, 
  type RequestFormsFiltersState 
} from '@/components/admin/tables/RequestForms/RequestFormsFilters';
import { SearchInput } from '@/components/shared/SearchInput';

const INITIAL_FILTERS: RequestFormsFiltersState = {
  status: 'All',
  requestType: 'All',
  university: 'All',
  dateRange: { start: null, end: null },
};

export default function RequestFormsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<RequestFormsFiltersState>(INITIAL_FILTERS);

  const handleFilterChange = useCallback((key: keyof RequestFormsFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Request Forms Management
        </h1>
      </div>

      {/* Filter Components */}
      <RequestFormsFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Requests
          </h2>
          <SearchInput
            placeholder="Search by Name or SPAS ID..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <RequestFormsTable 
          searchTerm={searchTerm} 
          filters={filters}
        />
      </div>
    </div>
  );
}