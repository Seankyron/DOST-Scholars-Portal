'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertOctagon, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type StipendUpdate = {
  message: string;
  type: 'info' | 'warning' | 'success';
};

interface StipendUpdatesProps {
  updates: StipendUpdate[];
}

export function StipendUpdates({ updates }: StipendUpdatesProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-dost-title">
          Your Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 divide-y divide-gray-200">
          {updates.map((update, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 pt-3 first:pt-0',
                update.type === 'warning' && 'text-orange-800',
                update.type === 'info' && 'text-gray-700',
                update.type === 'success' && 'text-green-800'
              )}
            >
              {update.type === 'warning' ? (
                <AlertOctagon className="h-5 w-5 flex-shrink-0 mt-0.5 text-orange-600" />
              ) : update.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
              ) : (
                <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{update.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}