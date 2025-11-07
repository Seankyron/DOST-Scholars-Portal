'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import { VerificationTable } from '@/components/admin/verification/VerificationTable';
import { Check, X } from 'lucide-react';
import {
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
} from '@/lib/utils/constants';

export default function VerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock options for filters, matching the PDF
  const scholarshipOptions = [
    { value: 'All', label: 'All Type' },
    ...SCHOLARSHIP_TYPES.map((s) => ({ value: s, label: s })),
  ];

  const universityOptions = [
    { value: 'All', label: 'All Universities' },
    ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
  ];

  // TODO: This should be populated based on the selected university
  const courseOptions = [{ value: 'All', label: 'All Courses' }];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Account Verification
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Select
          label="Scholarship Type"
          options={scholarshipOptions}
          defaultValue="All"
        />
        <Select
          label="Course"
          options={courseOptions}
          defaultValue="All"
          disabled // Disabled until programs are loaded
        />
        <Select
          label="School / University"
          options={universityOptions}
          defaultValue="All"
        />
      </div>

      {/* Header for the table */}
      <div className="bg-white rounded-t-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Accounts (3)
            </h2>
            {/* These buttons would eventually control bulk actions */}
            <Button
              variant="primary"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Verify
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
          {/* --- FIX: Correctly implemented SearchInput --- */}
          <SearchInput
            placeholder="Search Scholars..."
            onSearch={(query: string) => setSearchTerm(query)}
            className="w-full md:max-w-xs"
          />
        </div>
      </div>

      {/* Table Section */}
      <VerificationTable searchTerm={searchTerm} />
    </div>
  );
}