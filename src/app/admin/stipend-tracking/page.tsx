'use client';

import { useState } from 'react';
import { StipendTrackingTable } from '@/components/admin/tables/StipendTracking/StipendTrackingTable';
import { 
  StipendTrackingFilters, 
  type StipendFiltersState 
} from '@/components/admin/tables/StipendTracking/StipendTrackingFilters';
import { SearchInput } from '@/components/shared/SearchInput';

const INITIAL_FILTERS: StipendFiltersState = {
  status: 'All',
  academicYear: 'All',
  semester: 'All',
  university: 'All',
  province: 'All',
  dateRange: { start: null, end: null },
};

export default function AdminStipendTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StipendFiltersState>(INITIAL_FILTERS);

  const handleFilterChange = (key: keyof StipendFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Stipend Management
      </h1>

      {/* Filter Components */}
      <StipendTrackingFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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
        {/* Pass both search term and filters to the table */}
        <StipendTrackingTable 
          searchTerm={searchTerm} 
          filters={filters}
        />
      </div>
    </div>
  );
}