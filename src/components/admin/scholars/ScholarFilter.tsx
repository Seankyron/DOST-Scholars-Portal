'use client';

import { Select } from '@/components/ui/select';
import {
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
  YEAR_LEVELS,
} from '@/lib/utils/constants';
import type { ScholarStatus } from '@/types/scholar';

const statuses: ScholarStatus[] = [
  'Active',
  'Warning',
  '2nd Warning',
  'Suspended',
  'Graduated',
  'Terminated',
  'On hold',
];

// Options for filters
const scholarshipOptions = [
  { value: 'All', label: 'All Type' },
  ...SCHOLARSHIP_TYPES.map((s) => ({ value: s, label: s })),
];

const statusOptions = [
  { value: 'All', label: 'All Status' },
  ...statuses.map((s) => ({ value: s, label: s })),
];

const universityOptions = [
  { value: 'All', label: 'All Universities' },
  ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
];

const courseOptions = [{ value: 'All', label: 'All Courses' }];

const yearOptions = [
  { value: 'All', label: 'All Year Level' },
  ...YEAR_LEVELS.map((y) => ({ value: y, label: y })),
];

export function ScholarFilters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <Select
        // No label, placeholder is used
        options={scholarshipOptions}
        defaultValue="All"
        placeholder="Scholarship Type: All Type"
      />
      <Select
        options={statusOptions}
        defaultValue="All"
        placeholder="Status: All Status"
      />
      <Select
        options={universityOptions}
        defaultValue="All"
        placeholder="School: All Universities"
      />
      <Select
        options={courseOptions}
        defaultValue="All"
        placeholder="Course: All Courses"
        disabled
      />
      <Select
        options={yearOptions}
        defaultValue="All"
        placeholder="Year Level: All Year Level"
      />
    </div>
  );
}