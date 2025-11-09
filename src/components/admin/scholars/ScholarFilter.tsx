'use client';

// Assuming this is your custom Select component
import { Select } from '@/components/ui/select';
import {
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
  YEAR_LEVELS,
} from '@/lib/utils/constants'; // Using the constants path from your project
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

export interface ScholarFiltersState {
  scholarshipType: string;
  status: string;
  university: string;
  course: string;
  yearLevel: string;
}

interface ScholarFiltersProps {
  filters: ScholarFiltersState;
  onFilterChange: (
    filterName: keyof ScholarFiltersState,
    value: string
  ) => void;
}

export function ScholarFilters({ filters, onFilterChange }: ScholarFiltersProps) {
  // --- NEW: Define the change handler for a native <select> ---
  const handleChange =
    (filterName: keyof ScholarFiltersState) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange(filterName, e.target.value);
    };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <Select
        options={scholarshipOptions}
        value={filters.scholarshipType}
        // --- CHANGED ---
        // 'onValueChange' is now 'onChange'
        // The handler now expects an event object
        onChange={handleChange('scholarshipType')}
        // Using placeholder as a label, based on AddScholarModal
        placeholder="Scholarship Type: All Type"
      />
      <Select
        options={statusOptions}
        value={filters.status}
        // --- CHANGED ---
        onChange={handleChange('status')}
        placeholder="Status: All Status"
      />
      <Select
        options={universityOptions}
        value={filters.university}
        // --- CHANGED ---
        onChange={handleChange('university')}
        placeholder="School: All Universities"
      />
      <Select
        options={courseOptions}
        value={filters.course}
        // --- CHANGED ---
        onChange={handleChange('course')}
        placeholder="Course: All Courses"
        disabled
      />
      <Select
        options={yearOptions}
        value={filters.yearLevel}
        // --- CHANGED ---
        onChange={handleChange('yearLevel')}
        placeholder="Year Level: All Year Level"
      />
    </div>
  );
}