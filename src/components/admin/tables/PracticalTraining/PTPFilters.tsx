'use client';

import { Select } from '@/components/ui/select';
import { UNIVERSITIES } from '@/lib/utils/constants';

const statusOptions = [
  { value: 'All', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Resubmit', label: 'Resubmit' },
  { value: 'Rejected', label: 'Rejected' },
];

const typeOptions = [
  { value: 'All', label: 'All Transaction Types' },
  { value: 'Referral Letter', label: 'Referral Letter' },
  { value: 'Program Completion', label: 'Program Completion' },
];

const trainingYearOptions = [
  { value: 'All', label: 'All Training Years' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
];

const universityOptions = [
  { value: 'All', label: 'All Universities' },
  ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
];

export function PTPFilters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Status */}
      <Select
        options={statusOptions}
        defaultValue="All"
        placeholder="Status: All"
      />
      
      {/* 2. Request Detail (Type) */}
      <Select
        options={typeOptions}
        defaultValue="All"
        placeholder="Type: All"
      />

      {/* 3. Training Year (Added) */}
      <Select
        options={trainingYearOptions}
        defaultValue="All"
        placeholder="Training Year: All"
      />
      
      {/* 4. University ("Important ones") */}
      <Select
        options={universityOptions}
        defaultValue="All"
        placeholder="School: All"
      />
    </div>
  );
}