'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils/cn'; // Import cn

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
        <div className={cn('flex flex-col sm:flex-row items-end gap-3', className)}>
      <Input
        type="date"
        label="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        type="date"
        label="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  );
}