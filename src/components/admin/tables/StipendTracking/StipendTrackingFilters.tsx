'use client';

import { Select } from '@/components/ui/select';
import { UNIVERSITIES } from '@/lib/utils/constants';
import { DateRangeFilter } from '@/components/shared/DateRangeFilter';

const statusOptions = [
  { value: 'All', label: 'All Status' },
  { value: 'Processing', label: 'Processing' },
  { value: 'On hold', label: 'On Hold' },
  { value: 'Released', label: 'Released' },
];

const academicYearOptions = [
  { value: 'All', label: 'All Academic Years' },
  { value: '2024-2025', label: 'AY 2024-2025' },
  { value: '2023-2024', label: 'AY 2023-2024' },
];

const universityOptions = [
  { value: 'All', label: 'All Universities' },
  ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
];


export function StipendTrackingFilters() {
  const handleDateFilter = (startDate: string, endDate: string) => {
    // In a real app, you'd set state here
    console.log('Filtering from', startDate, 'to', endDate);
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Select
          options={statusOptions}
          defaultValue="All"
          placeholder="Status: All"
        />
        <Select
          options={academicYearOptions}
          defaultValue="All"
          placeholder="Academic Year: All"
        />
        <Select
          options={universityOptions}
          defaultValue="All"
          placeholder="School: All"
        />
      </div>

      {/* Row 2: Date Range Filter */}
      <DateRangeFilter onFilter={handleDateFilter} />
    </div>
  );
}