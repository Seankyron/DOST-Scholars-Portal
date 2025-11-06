'use client';

import { Select } from '@/components/ui/select';
import { 
  SCHOLARSHIP_TYPES, 
  UNIVERSITIES, 
  YEAR_LEVELS 
} from '@/lib/utils/constants';
import type { ScholarStatus } from '@/types/scholar';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <Select
        label="Scholarship Type"
        options={[
          { value: '', label: 'All Types' },
          ...SCHOLARSHIP_TYPES.map(type => ({ value: type, label: type }))
        ]}
        placeholder="All Types"
      />
      <Select
        label="Status"
        options={[
          { value: '', label: 'All Statuses' },
          ...statuses.map(status => ({ value: status, label: status }))
        ]}
        placeholder="All Statuses"
      />
      <Select
        label="School / University"
        options={[
          { value: '', label: 'All Universities' },
          ...UNIVERSITIES.map(uni => ({ value: uni, label: uni }))
        ]}
        placeholder="All Universities"
      />
      <Select
        label="Course"
        options={[{ value: '', label: 'All Courses' }]}
        placeholder="All Courses"
        disabled
      />
      <Select
        label="Year Level"
        options={[
          { value: '', label: 'All Years' },
          ...YEAR_LEVELS.map(year => ({ value: year, label: year }))
        ]}
        placeholder="All Years"
      />
    </div>
  );
}