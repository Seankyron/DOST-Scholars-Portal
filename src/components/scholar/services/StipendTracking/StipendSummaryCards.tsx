'use client';

import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/shared/InfoToolTip';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/format';

interface StipendSummaryCardProps {
  title: string;
  value: number;
  tooltip: string;
  variant: 'success' | 'warning' | 'info';
}

export function StipendSummaryCard({
  title,
  value,
  tooltip,
  variant,
}: StipendSummaryCardProps) {
  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <Card className={cn('relative shadow-sm', variants[variant])}>
      <CardContent className="p-4">
        <InfoTooltip side="top" className="absolute top-3 right-3 opacity-70">
          {tooltip}
        </InfoTooltip>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(value)}</p>
      </CardContent>
    </Card>
  );
}