'use client';

import { useState, useCallback } from 'react';
import { LeaveOfAbsenceTable } from '@/components/admin/tables/LeaveOfAbsence/LeaveOfAbsenceTable';
import { 
  LeaveOfAbsenceFilters, 
  type LeaveOfAbsenceFiltersState 
} from '@/components/admin/tables/LeaveOfAbsence/LeaveOfAbsenceFilters';
import { SearchInput } from '@/components/shared/SearchInput';

const INITIAL_FILTERS: LeaveOfAbsenceFiltersState = {
  status: 'All',
  reason: 'All',
  university: 'All',
  dateRange: { start: null, end: null },
};

export default function LeaveOfAbsencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LeaveOfAbsenceFiltersState>(INITIAL_FILTERS);

  const handleFilterChange = useCallback((key: keyof LeaveOfAbsenceFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Leave of Absence Management
        </h1>
      </div>

      {/* Filter Components */}
      <LeaveOfAbsenceFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All LOA Applications
          </h2>
          <SearchInput
            placeholder="Search by Name or SPAS ID..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <LeaveOfAbsenceTable 
          searchTerm={searchTerm} 
          filters={filters}
        />
      </div>
    </div>
  );
}