'use client';

import { Select } from '@/components/ui/select';
import { UNIVERSITIES } from '@/lib/utils/constants';

// Mock options for filters
const statusOptions = [
  { value: 'All', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Resubmit', label: 'Resubmit' },
];

const academicYearOptions = [
    { value: 'All', label: 'All Academic Years' },
    { value: '2024-2025', label: 'AY 2024-2025' },
    { value: '2023-2024', label: 'AY 2023-2024' },
];

const courseOptions = [{ value: 'All', label: 'All Courses' }];

const universityOptions = [
  { value: 'All', label: 'All Universities' },
  ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
];


export function GradeSubmissionFilters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
        options={courseOptions}
        defaultValue="All"
        placeholder="Course: All"
        disabled
      />
      <Select
        options={universityOptions}
        defaultValue="All"
        placeholder="School: All"
      />
    </div>
  );
}