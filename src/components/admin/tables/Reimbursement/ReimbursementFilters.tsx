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

export function ReimbursementFilters() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* 1. Status */}
        <Select>
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
        
        {/* 2. Reimbursement Type */}
        <Select>
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Type: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
            <SelectItem value="Transportation Allowance">Transportation Allowance</SelectItem>
            <SelectItem value="Review Fee">Review Fee</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>

        {/* 3. University */}
        <Select>
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
              <Calendar className="h-4 w-4" />
              <span className="sm:inline">Filter by Date Submitted:</span>
           </div>
           <div className="flex-1 w-full sm:w-auto">
             <DateRangeFilter 
                onFilter={(start, end) => console.log(start, end)} 
                className="w-full"
             />
           </div>
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 w-full sm:w-auto"
        >
           <X className="h-4 w-4 mr-2" />
           Reset Filters
        </Button>
      </div>
    </div>
  );
}