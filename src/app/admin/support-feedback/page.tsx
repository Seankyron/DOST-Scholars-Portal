'use client';

import { useState } from 'react';
import { SupportFeedbackTable } from '@/components/admin/tables/SupportFeedback/SupportFeedbackTable';
import { SupportFeedbackFilters } from '@/components/admin/tables/SupportFeedback/SupportFeedbackFilters';
import { SearchInput } from '@/components/shared/SearchInput';

export default function SupportFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dost-title">
          Support & Feedback
        </h1>
      </div>

      {/* Filter Components */}
      <SupportFeedbackFilters />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Tickets
          </h2>
          <SearchInput
            placeholder="Search by Scholar, ID, or Topic..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <SupportFeedbackTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}