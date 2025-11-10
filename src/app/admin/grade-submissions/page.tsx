'use client';

import { useState } from 'react';
import { GradeSubmissionsTable } from '@/components/admin/tables/GradeSubmissions/GradeSubmissionsTable';
import { GradeSubmissionFilters } from '@/components/admin/tables/GradeSubmissions/GradeSubmissionFilters';
import { SearchInput } from '@/components/shared/SearchInput';
// --- MODIFICATION: Removed Button and Download imports ---

export default function AdminGradeSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Add other filter states here later

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Grade Submission Management
      </h1>

      {/* Filter Components */}
      <GradeSubmissionFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        {/* --- MODIFICATION: Simplified the header --- */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Submissions
          </h2>
          <SearchInput
            placeholder="Search Scholars..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
          {/* --- MODIFICATION: Export Button removed --- */}
        </div>
        <GradeSubmissionsTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}