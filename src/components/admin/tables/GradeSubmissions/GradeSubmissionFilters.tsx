'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Calendar } from 'lucide-react';
import { DateRangeFilter } from '@/components/shared/DateRangeFilter';
import { UNIVERSITIES, SEMESTERS } from '@/lib/utils/constants';
import { useCallback } from 'react';

// Define the interface for the filter state to be used by the parent component
export interface GradeSubmissionFiltersState {
  status: string;
  academicYear: string;
  semester: string;
  university: string;
  program: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface GradeSubmissionFiltersProps {
  filters: GradeSubmissionFiltersState;
  onFilterChange: (key: keyof GradeSubmissionFiltersState, value: any) => void;
  onReset: () => void;
}

export function GradeSubmissionFilters({
  filters,
  onFilterChange,
  onReset,
}: GradeSubmissionFiltersProps) {

  // Create a stable handler for the date filter
  const handleDateFilter = useCallback((start: string, end: string) => {
    onFilterChange('dateRange', { start, end });
  }, [onFilterChange]);

  return (
    <div className="flex flex-col gap-4 bg-white p-1">
      
      {/* Primary Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        
        {/* 1. Status */}
        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange('status', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Resubmit">Resubmit</SelectItem>
          </SelectContent>
        </Select>

        {/* 2. Academic Year */}
        <Select
          value={filters.academicYear}
          onValueChange={(val) => onFilterChange('academicYear', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="Academic Year: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Academic Years</SelectItem>
            <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
            <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
            <SelectItem value="2022-2023">AY 2022-2023</SelectItem>
          </SelectContent>
        </Select>

        {/* 3. Semester */}
        <Select
          value={filters.semester}
          onValueChange={(val) => onFilterChange('semester', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="Semester: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Semesters</SelectItem>
            {SEMESTERS.map((sem) => (
              <SelectItem key={sem} value={sem}>{sem}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 4. University */}
        <Select
          value={filters.university}
          onValueChange={(val) => onFilterChange('university', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="University: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Universities</SelectItem>
            {UNIVERSITIES.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 5. Program */}
        <Select
          value={filters.program}
          onValueChange={(val) => onFilterChange('program', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="Program: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Programs</SelectItem>
            <SelectItem value="BS Computer Science">BS Computer Science</SelectItem>
            <SelectItem value="BS Information Technology">BS Information Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Row: Date Range & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-gray-50">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
           <div className="flex items-center gap-2 mb-1 sm:mb-0">
             <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
             <span className="sm:inline text-nowrap">Filter by Date:</span>
           </div>
           
           <div className="flex-1 w-full sm:w-auto">
             <DateRangeFilter 
                key={filters.dateRange.start ? 'active' : 'reset'}
                onFilter={handleDateFilter} 
                className="w-full"
             />
           </div>
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onReset}
          className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-3 flex items-center justify-center sm:justify-start"
          title="Reset Filters"
        >
           <X className="h-4 w-4 mr-2" />
           Reset Filters
        </Button>
      </div>
    </div>
  );
}