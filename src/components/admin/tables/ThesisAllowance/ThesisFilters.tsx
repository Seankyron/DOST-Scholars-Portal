'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DateRangeFilter } from '@/components/shared/DateRangeFilter';
import { SEMESTERS } from '@/lib/utils/constants';

export function ThesisFilters() {
  return (
    <div className="flex flex-col gap-4">
      
      {/* Row 1: Dropdown Filters (Full Width Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Status Filter */}
        <Select>
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="resubmit">Resubmit</SelectItem>
          </SelectContent>
        </Select>

        {/* Release Type Filter */}
        <Select>
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Release Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="90">90% (Partial)</SelectItem>
            <SelectItem value="10">10% (Final)</SelectItem>
            <SelectItem value="100">100% (Full)</SelectItem>
          </SelectContent>
        </Select>

        {/* Semester Filter */}
        <Select>
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Semester: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {SEMESTERS.map((sem) => (
              <SelectItem key={sem} value={sem}>{sem}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Academic Year Filter */}
        <Select>
          <SelectTrigger className="bg-white h-10">
            <SelectValue placeholder="Academic Year: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Academic Years</SelectItem>
            <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
            <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
            <SelectItem value="2022-2023">AY 2022-2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row 2: Date Range & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t pt-4 sm:border-t-0 sm:pt-0">
        <DateRangeFilter 
            onFilter={(start, end) => console.log(start, end)} 
            className="w-full sm:w-auto"
        />
        
        <div className="flex w-full sm:w-auto justify-end">
            <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700">
               <X className="h-4 w-4 mr-2" />
               Reset Filters
            </Button>
        </div>
      </div>
    </div>
  );
}