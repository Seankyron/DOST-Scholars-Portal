'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/shared/InfoToolTip';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/format';
import type { Allowance } from '@/types/services'; 
import { ArrowLeft } from 'lucide-react';

interface FlippableStipendCardProps {
  title: string;
  value: number;
  tooltip: string;
  variant: 'success' | 'warning' | 'info';
  breakdown: Allowance[];
  isFlipped: boolean;
  onFlip: () => void;
}

function CardBreakdown({ breakdown }: { breakdown: Allowance[] }) {
  return (
    <ul className="divide-y divide-gray-200">
      {breakdown.length > 0 ? (
        breakdown.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between py-2.5"
          >
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(item.amount)}
            </p>
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic py-2.5">
          No items to show.
        </p>
      )}
    </ul>
  );
}

export function FlippableStipendCard({
  title,
  value,
  tooltip,
  variant,
  breakdown,
  isFlipped,
  onFlip,
}: FlippableStipendCardProps) {
  const frontVariants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="perspective w-full h-48">
      <div
        className={cn(
          'relative w-full h-full flip-card-inner',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* --- CARD FRONT --- */}
        <Card
          className={cn(
            'absolute w-full h-full flip-card-front cursor-pointer',
            frontVariants[variant]
          )}
          onClick={onFlip}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <InfoTooltip
              side="top"
              className="absolute top-3 right-3 opacity-70"
            >
              {tooltip}
            </InfoTooltip>
            <div>
              <p className="text-sm font-medium opacity-80">{title}</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(value)}</p>
            </div>
            <p className="text-xs font-semibold opacity-70 text-right">
              Click to see details
            </p>
          </CardContent>
        </Card>

        {/* --- CARD BACK --- */}
        <Card
          className={cn(
            'absolute w-full h-full flip-card-back',
            'bg-white border-gray-200'
          )}
        >
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-dost-title">{title}</h4>
              <Button variant="ghost" size="sm" onClick={onFlip} className="h-7 px-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
              <CardBreakdown breakdown={breakdown} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}