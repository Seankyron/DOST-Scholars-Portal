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
import { UNIVERSITIES } from '@/lib/utils/constants';
import { useCallback } from 'react';

const PROVINCES = ['Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon'];

export interface StipendFiltersState {
  status: string;
  academicYear: string;
  semester: string;
  university: string;
  province: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface StipendTrackingFiltersProps {
  filters: StipendFiltersState;
  onFilterChange: (key: keyof StipendFiltersState, value: any) => void;
  onReset: () => void;
}

export function StipendTrackingFilters({
  filters,
  onFilterChange,
  onReset,
}: StipendTrackingFiltersProps) {

  // Create a stable handler for the date filter
  const handleDateFilter = useCallback((start: string, end: string) => {
    onFilterChange('dateRange', { start, end });
  }, [onFilterChange]);

  return (
    <div className="flex flex-col gap-4 bg-white p-1">
      {/* Primary Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="On hold">On Hold</SelectItem>
            <SelectItem value="Released">Released</SelectItem>
          </SelectContent>
        </Select>

        {/* 2. Academic Year */}
        <Select
          value={filters.academicYear}
          onValueChange={(val) => onFilterChange('academicYear', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="A.Y.: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Academic Years</SelectItem>
            <SelectItem value="AY 2024-2025">AY 2024-2025</SelectItem>
            <SelectItem value="AY 2023-2024">AY 2023-2024</SelectItem>
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
            <SelectItem value="1st Semester">1st Semester</SelectItem>
            <SelectItem value="2nd Semester">2nd Semester</SelectItem>
            <SelectItem value="Midyear">Midyear</SelectItem>
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
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 5. Province */}
        <Select
          value={filters.province}
          onValueChange={(val) => onFilterChange('province', val)}
        >
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="Province: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Provinces</SelectItem>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Filter & Reset Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-gray-50">
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-1 sm:mb-0">
             <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
             <span className="sm:inline text-nowrap">Filter by Date Submitted:</span>
          </div>
          
          <div className="flex-1 w-full sm:w-auto">
            <DateRangeFilter
              key={filters.dateRange.start ? 'active' : 'reset'}
              onFilter={handleDateFilter} // Use the stable handler
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