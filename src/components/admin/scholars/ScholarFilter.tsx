'use client';

import { Select } from '@/components/ui/select';
import { 
  SCHOLARSHIP_TYPES, 
  UNIVERSITIES, 
  YEAR_LEVELS 
} from '@/lib/utils/constants';
import type { ScholarStatus } from '@/types/scholar';

// Manually define statuses based on your types
const statuses: ScholarStatus[] = [
  'Active', 
  'Warning', 
  '2nd Warning', 
  'Suspended', 
  'Graduated', 
  'Terminated', 
  'On hold'
];

export function ScholarFilters() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
      <Select
        label="Scholarship Type"
        options={SCHOLARSHIP_TYPES.map(type => ({ value: type, label: type }))}
      />
      <Select
        label="Status"
        options={statuses.map(status => ({ value: status, label: status }))}
      />
      <Select
        label="School / University"
        options={UNIVERSITIES.map(uni => ({ value: uni, label: uni }))}
      />
      <Select
        label="Course"
        options={[]} // Add course options later
        disabled // Disabled for now
      />
      <Select
        label="Year Level"
        options={YEAR_LEVELS.map(year => ({ value: year, label: year }))}
      />
    </div>
  );
}