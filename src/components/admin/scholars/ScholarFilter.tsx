'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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

const courseOptions = [
  { value: 'All', label: 'All Courses' },
];

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
  onReset: () => void;
}

export function ScholarFilters({ filters, onFilterChange, onReset }: ScholarFiltersProps) {
  const handleValueChange = (filterName: keyof ScholarFiltersState) => (value: string) => {
    onFilterChange(filterName, value);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        
        {/* 1. Scholarship Type */}
        <Select
          value={filters.scholarshipType}
          onValueChange={handleValueChange('scholarshipType')}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Scholarship Type: All" />
          </SelectTrigger>
          <SelectContent>
            {scholarshipOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2. Status */}
        <Select
          value={filters.status}
          onValueChange={handleValueChange('status')}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 3. University */}
        <Select
          value={filters.university}
          onValueChange={handleValueChange('university')}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="University: All" />
          </SelectTrigger>
          <SelectContent>
            {universityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 4. Course (Enabled) */}
        <Select
          value={filters.course}
          onValueChange={handleValueChange('course')}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Course: All" />
          </SelectTrigger>
          <SelectContent>
            {courseOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 5. Year Level */}
        <Select
          value={filters.yearLevel}
          onValueChange={handleValueChange('yearLevel')}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Year Level: All" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* Secondary Row: Reset Button moved to the LEFT (justify-start) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 pt-2 border-t border-gray-50">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onReset}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 w-full sm:w-auto px-2"
        >
           <X className="h-4 w-4 mr-2" />
           Reset Filters
        </Button>
      </div>
    </div>
  );
}