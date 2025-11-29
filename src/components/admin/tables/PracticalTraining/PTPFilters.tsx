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

interface PTPFiltersProps {
  showPlanFilter?: boolean;
}

export function PTPFilters({ showPlanFilter = false }: PTPFiltersProps) {
  return (
    <div className="flex flex-col gap-4 bg-white p-1">
      
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* 1. Status */}
        <Select>
          <SelectTrigger className="bg-white h-10 w-full">
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
        
        {/* 2. Training Year */}
        <Select>
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="Training Year: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Years</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>

        {/* 3. Semester */}
        <Select>
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

        {/* 4. Academic Year */}
        <Select>
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="A.Y.: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Academic Years</SelectItem>
            <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
            <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
            <SelectItem value="2022-2023">AY 2022-2023</SelectItem>
          </SelectContent>
        </Select>
        
        {/* 5. University */}
        <Select>
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

        {/* 6. Plan (Conditional) */}
        {showPlanFilter && (
          <Select>
            <SelectTrigger className="bg-white h-10 w-full">
               <SelectValue placeholder="Plan: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Plans</SelectItem>
              <SelectItem value="undertake_ptp">Will Undertake PTP</SelectItem>
              <SelectItem value="ojt_midyear_and_ptp">OJT Included in Curriculum</SelectItem>
              <SelectItem value="cannot_participate">Cannot Participate</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Secondary Row: Date Range & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-gray-50">
        <div className="w-full sm:flex-1 flex items-center gap-2 text-sm text-gray-500">
           <Calendar className="h-4 w-4 shrink-0 text-gray-400 hidden sm:block" />
           <span className="hidden lg:inline text-nowrap">Filter by Date Submitted:</span>
           <div className="w-full sm:max-w-[260px]">
             <DateRangeFilter 
                onFilter={(start, end) => console.log(start, end)} 
                className="w-full h-9"
             />
           </div>
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
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