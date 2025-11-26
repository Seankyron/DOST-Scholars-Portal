'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils/cn';

interface DateRangeFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
  className?: string;
}

export function DateRangeFilter({ onFilter, className }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- 2. DEBOUNCE the inputs ---
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  useEffect(() => {
    onFilter(debouncedStartDate, debouncedEndDate);
  }, [debouncedStartDate, debouncedEndDate, onFilter]);

  return (
    // Changed flex-col to grid-cols-2 for side-by-side inputs on mobile
    <div className={cn('grid grid-cols-2 sm:flex sm:flex-row items-center gap-2', className)}>
       {/* Start Date */}
       <div className="w-full sm:w-auto relative">
          <Input
            type="date"
            // Ensure width fills the grid cell on mobile
            className="h-10 py-2 w-full sm:w-[160px] rounded-md" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
       </div>

      {/* Separator - Hidden on mobile grid layout */}
      <span className="text-gray-400 hidden sm:block">-</span>

      {/* End Date */}
      <div className="w-full sm:w-auto relative">
          <Input
            type="date"
            // Ensure width fills the grid cell on mobile
            className="h-10 py-2 w-full sm:w-[160px] rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
      </div>
    </div>
  );
}