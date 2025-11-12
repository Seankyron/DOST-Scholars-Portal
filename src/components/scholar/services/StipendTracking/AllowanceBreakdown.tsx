'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export type Allowance = {
  name: string;
  amount: number;
  status: 'Released' | 'Pending' | 'On hold';
};

interface AllowanceBreakdownProps {
  breakdown: Allowance[];
}

export function AllowanceBreakdown({ breakdown }: AllowanceBreakdownProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-dost-title">
          Allowance Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-gray-200">
          {breakdown.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <StatusBadge
                  status={item.status}
                  className="mt-1 md:hidden"
                />
              </div>
              <div className="flex items-center gap-4">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    item.status === 'Released'
                      ? 'text-green-700'
                      : 'text-gray-900'
                  )}
                >
                  {formatCurrency(item.amount)}
                </p>
                <StatusBadge status={item.status} className="hidden md:flex" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}