'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DateRangeFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
  className?: string;
}

export function DateRangeFilter({ onFilter, className }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    onFilter(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onFilter('', '');
  };

  return (
    <div className={`flex items-end gap-3 ${className}`}>
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
      <Button variant="primary" onClick={handleFilter}>
        Filter
      </Button>
      <Button variant="outline" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
}