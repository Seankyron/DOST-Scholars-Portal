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

export function GradeSubmissionFilters() {
  return (
    <div className="flex flex-col gap-4">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        
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
          </SelectContent>
        </Select>

        {/* 2. Academic Year */}
        <Select>
          <SelectTrigger className="bg-white h-10">
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
        <Select>
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

        {/* 4. University */}
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

        {/* 5. Program */}
        <Select>
          <SelectTrigger className="bg-white h-10">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-50">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
           <div className="flex items-center gap-2 mb-1 sm:mb-0">
             <Calendar className="h-4 w-4" />
             <span className="sm:inline">Filter by Date:</span>
           </div>
           
           <div className="flex-1 w-full sm:w-auto">
             {/* Removed fixed h-9 to prevent clipping on mobile */}
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