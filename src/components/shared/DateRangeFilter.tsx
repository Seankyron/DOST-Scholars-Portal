'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Use a ref to hold the latest onFilter function
  // This allows us to call it inside useEffect without adding it to the dependency array
  const onFilterRef = useRef(onFilter);

  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter]);

  useEffect(() => {
    // Only call the function when the DATES change, not when the function reference changes
    onFilterRef.current(debouncedStartDate, debouncedEndDate);
  }, [debouncedStartDate, debouncedEndDate]);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center gap-2', className)}>
       {/* Start Date */}
       <div className="w-full sm:w-auto relative">
          <Input
            type="date"
            className="h-10 py-2 w-full sm:w-[160px] rounded-md" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
       </div>

      {/* Separator */}
      <span className="text-gray-400 hidden sm:block">-</span>

      {/* End Date */}
      <div className="w-full sm:w-auto relative">
          <Input
            type="date"
            className="h-10 py-2 w-full sm:w-[160px] rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
      </div>
    </div>
  );
}