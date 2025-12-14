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

// Export this type so the parent Page and Table can use it
export interface RequestFormsFiltersState {
  status: string;
  requestType: string;
  university: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface RequestFormsFiltersProps {
  filters: RequestFormsFiltersState;
  onFilterChange: (key: keyof RequestFormsFiltersState, value: any) => void;
  onReset: () => void;
}

export function RequestFormsFilters({
  filters,
  onFilterChange,
  onReset,
}: RequestFormsFiltersProps) {

  // Create a stable handler for the date filter
  const handleDateFilter = useCallback((start: Date | null, end: Date | null) => {
    onFilterChange('dateRange', { start, end });
  }, [onFilterChange]);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg border shadow-sm">
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
        
        {/* 2. Request Type */}
        <Select
          value={filters.requestType}
          onValueChange={(val) => onFilterChange('requestType', val)}
        >
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Type: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Certificate of Scholarship">Certificate of Scholarship</SelectItem>
            <SelectItem value="Letter of Endorsement">Letter of Endorsement</SelectItem>
            <SelectItem value="Certificate of Grades">Certificate of Grades</SelectItem>
            <SelectItem value="Certificate of Good Moral">Certificate of Good Moral</SelectItem>
            <SelectItem value="Financial Breakdown">Financial Breakdown</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-50">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
           <div className="flex items-center gap-2 mb-1 sm:mb-0">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="sm:inline text-nowrap">Filter by Date Submitted:</span>
           </div>
           <div className="flex-1 w-full sm:w-auto">
             <DateRangeFilter 
                key={filters.dateRange.start ? 'active' : 'reset'} // Force re-render on reset
                onFilter={handleDateFilter as any} 
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