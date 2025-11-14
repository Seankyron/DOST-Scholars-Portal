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

const options: Allowance['status'][] = ['Pending', 'On hold', 'Released'];

export function StatusDropdown({ currentStatus, onChange }: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'flex w-32 items-center justify-between rounded-full text-xs font-medium',
            'py-1 px-3 h-auto',
            getStatusColor(currentStatus)
          )}
        >
          <span>{currentStatus}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {options.map((status) => (
          <DropdownMenuItem
            key={status}
            onSelect={() => onChange(status)}
            className={cn(
              'font-medium',
              status === 'Pending' && 'text-yellow-800 focus:text-yellow-800 focus:bg-yellow-50',
              status === 'On hold' && 'text-purple-800 focus:text-purple-800 focus:bg-purple-50',
              status === 'Released' && 'text-green-800 focus:text-green-800 focus:bg-green-50'
            )}
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}