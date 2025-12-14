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
import { useCallback } from 'react';

export interface SupportFeedbackFiltersState {
  status: string;
  category: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface SupportFeedbackFiltersProps {
  filters: SupportFeedbackFiltersState;
  onFilterChange: (key: keyof SupportFeedbackFiltersState, value: any) => void;
  onReset: () => void;
}

export function SupportFeedbackFilters({
  filters,
  onFilterChange,
  onReset,
}: SupportFeedbackFiltersProps) {

  const handleDateFilter = useCallback((start: string, end: string) => {
    onFilterChange('dateRange', { start, end });
  }, [onFilterChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* 1. Status Filter */}
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
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Resubmit">Resubmit / Info Needed</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
          </SelectContent>
        </Select>
        
        {/* 2. Category Filter (Matches Scholar View) */}
        <Select
          value={filters.category}
          onValueChange={(val) => onFilterChange('category', val)}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Category: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Technical Issue">Technical Issue</SelectItem>
            <SelectItem value="Scholarship Inquiry">Scholarship Inquiry</SelectItem>
            <SelectItem value="Suggestion / Feedback">Suggestion / Feedback</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

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