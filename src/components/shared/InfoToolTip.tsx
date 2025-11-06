// src/components/shared/InfoTooltip.tsx
'use client';

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider, // Import Provider
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/cn';

interface InfoTooltipProps {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({
  children,
  side = 'bottom',
  className,
  iconClassName,
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn('inline-flex items-center', className)}
          >
            <Info
              className={cn(
                'h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors',
                iconClassName
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent className="p-3 max-w-xs" side={side}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}