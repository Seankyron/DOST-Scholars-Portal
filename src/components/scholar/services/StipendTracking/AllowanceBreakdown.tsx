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

// --- Helper component for the list item ---
function AllowanceItem({ item }: { item: Allowance }) {
  return (
    <li className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{item.name}</p>
        <StatusBadge status={item.status} className="mt-1 md:hidden" />
      </div>
      <div className="flex items-center gap-4">
        <p
          className={cn(
            'text-sm font-semibold',
            item.status === 'Released' ? 'text-green-700' : 'text-gray-900'
          )}
        >
          {formatCurrency(item.amount)}
        </p>
        <StatusBadge status={item.status} className="hidden md:flex" />
      </div>
    </li>
  );
}

export function AllowanceBreakdown({ breakdown }: AllowanceBreakdownProps) {
  const receivedAllowances = breakdown.filter(
    (item) => item.status === 'Released'
  );
  const pendingAllowances = breakdown.filter(
    (item) => item.status === 'Pending' || item.status === 'On hold'
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-dost-title">
          Allowance Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-green-700 mb-2">
            Received
          </h4>
          {receivedAllowances.length > 0 ? (
            <ul className="divide-y divide-gray-200 border-t">
              {receivedAllowances.map((item) => (
                <AllowanceItem key={item.name} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic pt-2 border-t">
              No allowances received yet for this semester.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            Pending / On Hold
          </h4>
          {pendingAllowances.length > 0 ? (
            <ul className="divide-y divide-gray-200 border-t">
              {pendingAllowances.map((item) => (
                <AllowanceItem key={item.name} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic pt-2 border-t">
              No pending allowances for this semester.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}