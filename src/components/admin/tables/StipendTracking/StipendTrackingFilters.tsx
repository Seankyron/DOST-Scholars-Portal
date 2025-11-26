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

export function StipendTrackingFilters() {
  return (
    <div className="flex flex-col gap-4 bg-white p-1">
      {/* Primary Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Status */}
        <Select>
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
        <Select>
          <SelectTrigger className="bg-white h-10 w-full">
            <SelectValue placeholder="A.Y.: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Academic Years</SelectItem>
            <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
            <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
          </SelectContent>
        </Select>

        {/* 3. Semester */}
        <Select>
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
        <Select>
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
      </div>

      {/* Secondary Row: Date Range & Reset */}
      {/* LAYOUT: Vertical Stack on Mobile (flex-col), Horizontal on Tablet+ (sm:flex-row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-50">
        
        {/* Date Filter Section */}
        <div className="w-full sm:flex-1 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 shrink-0" />
          {/* Label shortened to save space. If you see 'Submitted', the update didn't apply. */}
          <span className="hidden lg:inline text-nowrap">Filter by Date:</span>
          <div className="flex-1 sm:max-w-[260px]">
            <DateRangeFilter
              onFilter={(start, end) => console.log(start, end)}
              className="w-full h-9"
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button
          type="button"
          variant="ghost"
          // ON MOBILE: w-full (full width bar), h-9
          // ON DESKTOP: w-auto (fits content), sits to the right
          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-3 w-full sm:w-auto sm:shrink-0"
          title="Reset Filters"
        >
          <X className="h-4 w-4 mr-2" /> 
          Reset Filters
        </Button>
      </div>
    </div>
  );
}