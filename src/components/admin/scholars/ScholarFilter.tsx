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

const yearOptions = [
  { value: 'All', label: 'All Year Level' },
  ...YEAR_LEVELS.map((y) => ({ value: y, label: y })),
];

export function ScholarFilters({ filters, onChange }: any) {
  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <Select
        options={scholarshipOptions}
        value={filters.type}
        placeholder="Scholarship Type"
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      />
      <Select
        options={statusOptions}
        value={filters.status}
        placeholder="Status"
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      />
      <Select
        options={universityOptions}
        value={filters.university}
        placeholder="University"
        onChange={(e) => onChange({ ...filters, university: e.target.value })}
      />
      <Select
        options={yearOptions}
        value={filters.year}
        placeholder="Year Level"
        onChange={(e) => onChange({ ...filters, year: e.target.value })}
      />
    </div>
  );
}
