'use client';

import { useState } from 'react';
import { GradeSubmissionsTable } from '@/components/admin/tables/GradeSubmissions/GradeSubmissionsTable';
import { 
  GradeSubmissionFilters, 
  GradeSubmissionFiltersState 
} from '@/components/admin/tables/GradeSubmissions/GradeSubmissionFilters';
import { SearchInput } from '@/components/shared/SearchInput';

// 1. Define initial state for filters
const initialFilters: GradeSubmissionFiltersState = {
  status: 'All',
  academicYear: 'All',
  semester: 'All',
  university: 'All',
  program: 'All',
  dateRange: {
    start: null,
    end: null,
  },
};

export default function AdminGradeSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // 2. Manage filter state
  const [filters, setFilters] = useState<GradeSubmissionFiltersState>(initialFilters);

  // 3. Handlers for filter changes
  const handleFilterChange = (key: keyof GradeSubmissionFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Grade Submission Management
      </h1>

      {/* Filter Components - Now passing required props */}
      <GradeSubmissionFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Submissions
          </h2>
          <SearchInput
            placeholder="Search Scholars..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        {/* Pass filters to the table so it can filter the data */}
        <GradeSubmissionsTable searchTerm={searchTerm} filters={filters} />
      </div>
    </div>
  );
}