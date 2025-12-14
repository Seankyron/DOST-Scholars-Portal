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

// 1. Define the shape of the filter state (mirrors the structure in StipendTracking)
export interface TravelClearanceFiltersState {
  status: string;
  purpose: string;
  university: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// 2. Define props for the component
interface TravelClearanceFiltersProps {
  filters: TravelClearanceFiltersState;
  onFilterChange: (key: keyof TravelClearanceFiltersState, value: any) => void;
  onReset: () => void;
}

export function TravelClearanceFilters({
  filters,
  onFilterChange,
  onReset,
}: TravelClearanceFiltersProps) {

  // Create a stable handler for the date filter
  const handleDateFilter = useCallback((start: string, end: string) => {
    onFilterChange('dateRange', { start, end });
  }, [onFilterChange]);

  return (
    <div className="flex flex-col gap-4">
      
      {/* Primary Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
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
        
        {/* 2. Purpose (Specific to Travel) */}
        <Select
          value={filters.purpose}
          onValueChange={(val) => onFilterChange('purpose', val)}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Purpose: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Purposes</SelectItem>
            <SelectItem value="Official Business Travel">Official Business</SelectItem>
            <SelectItem value="Other">Other / Personal</SelectItem>
          </SelectContent>
        </Select>

        
        {/* 3. University */}
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
              <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="sm:inline text-nowrap">Filter by Date Submitted:</span>
           </div>

           <div className="flex-1 w-full sm:w-auto">
             <DateRangeFilter 
                // Force re-render on reset to clear internal state of DateRangeFilter if needed
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