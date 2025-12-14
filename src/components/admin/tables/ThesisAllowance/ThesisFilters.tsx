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
import { SEMESTERS, UNIVERSITIES } from '@/lib/utils/constants';
import { useCallback } from 'react';

export interface ThesisFiltersState {
  status: string;
  year: string;
  semester: string;
  academicYear: string;
  university: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface ThesisFiltersProps {
  filters: ThesisFiltersState;
  onFilterChange: (key: keyof ThesisFiltersState, value: any) => void;
  onReset: () => void;
}

export function ThesisFilters({
  filters,
  onFilterChange,
  onReset,
}: ThesisFiltersProps) {
  
  // Create a stable handler for the date filter
  const handleDateFilter = useCallback((start: string, end: string) => {
    onFilterChange('dateRange', { start, end });
  }, [onFilterChange]);

  return (
      <div className="flex flex-col gap-4">
        
        {/* Primary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          
          {/* 1. Status */}
          <Select
            value={filters.status}
            onValueChange={(val) => onFilterChange('status', val)}
          >
            <SelectTrigger className="bg-white h-10">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Resubmit">Resubmit</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
  
          {/* 3. Year (Labeled as Training Year in UI) */}
          <Select
            value={filters.year}
            onValueChange={(val) => onFilterChange('year', val)}
          >
            <SelectTrigger className="bg-white h-10">
              <SelectValue placeholder="Year: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
  
          {/* 4. Semester */}
          <Select
            value={filters.semester}
            onValueChange={(val) => onFilterChange('semester', val)}
          >
            <SelectTrigger className="bg-white h-10">
              <SelectValue placeholder="Semester: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Semesters</SelectItem>
              {SEMESTERS.map((sem) => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          {/* 5. Academic Year */}
          <Select
            value={filters.academicYear}
            onValueChange={(val) => onFilterChange('academicYear', val)}
          >
            <SelectTrigger className="bg-white h-10">
              <SelectValue placeholder="A.Y.: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Academic Years</SelectItem>
              <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
              <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
              <SelectItem value="2022-2023">AY 2022-2023</SelectItem>
            </SelectContent>
          </Select>
          
          {/* 6. University */}
          <Select
            value={filters.university}
            onValueChange={(val) => onFilterChange('university', val)}
          >
            <SelectTrigger className="bg-white h-10">
               <SelectValue placeholder="University: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Universities</SelectItem>
              {UNIVERSITIES.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      {/* Secondary Row: Date Range & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-50">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
           <div className="flex items-center gap-2 mb-1 sm:mb-0">
             <Calendar className="h-4 w-4" />
             <span className="sm:inline">Filter by Date Submitted:</span>
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
          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 w-full sm:w-auto"
        >
           <X className="h-4 w-4 mr-2" />
           Reset Filters
        </Button>
      </div>
    </div>
  );
}