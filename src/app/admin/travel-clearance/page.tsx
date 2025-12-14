'use client';

import { useState } from 'react';
import { TravelClearanceTable } from '@/components/admin/tables/TravelClearance/TravelClearanceTable';
import { 
  TravelClearanceFilters, 
  TravelClearanceFiltersState 
} from '@/components/admin/tables/TravelClearance/TravelClearanceFilters';
import { SearchInput } from '@/components/shared/SearchInput';

export default function TravelClearancePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Initialize Filter State
  const [filters, setFilters] = useState<TravelClearanceFiltersState>({
    status: 'All',
    purpose: 'All',
    university: 'All',
    dateRange: {
      start: null,
      end: null,
    },
  });

  // 2. Filter Change Handler
  const handleFilterChange = (key: keyof TravelClearanceFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 3. Reset Handler
  const handleReset = () => {
    setFilters({
      status: 'All',
      purpose: 'All',
      university: 'All',
      dateRange: {
        start: null,
        end: null,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Travel Clearance Management
      </h1>

      {/* Filter Components */}
      <TravelClearanceFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

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
        {/* Pass filters to the table */}
        <TravelClearanceTable searchTerm={searchTerm} filters={filters} />
      </div>
    </div>
  );
}