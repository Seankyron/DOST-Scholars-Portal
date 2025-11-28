'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Allowance } from '@/types';
import { getStatusColor } from '@/lib/utils/constants';

interface StatusDropdownProps {
  currentStatus: Allowance['status'];
  onChange: (newStatus: Allowance['status']) => void;
}

const options: Allowance['status'][] = ['Pending', 'Processing', 'On hold', 'Released'];

export function StatusDropdown({ currentStatus, onChange }: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex items-center justify-between rounded-full text-xs font-medium h-7 px-3 min-w-[110px] border',
            getStatusColor(currentStatus)
          )}
        >
          <span>{currentStatus}</span>
          <ChevronDown className="h-3 w-3 ml-2 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {options.map((status) => (
          <DropdownMenuItem
            key={status}
            onSelect={() => onChange(status)}
            className={cn(
              'font-medium text-xs cursor-pointer my-0.5',
              status === 'Pending' && 'text-yellow-700 focus:text-yellow-800 focus:bg-yellow-50',
              status === 'Processing' && 'text-blue-700 focus:text-blue-800 focus:bg-blue-50',
              status === 'On hold' && 'text-red-700 focus:text-red-800 focus:bg-red-50',
              status === 'Released' && 'text-green-700 focus:text-green-800 focus:bg-green-50'
            )}
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}