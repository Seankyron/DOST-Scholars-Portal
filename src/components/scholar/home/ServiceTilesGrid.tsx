'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { scholarServices } from '@/config/services';
import { cn } from '@/lib/utils/cn';
import { toast } from '@/components/ui/toaster';

export function ServiceTilesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {scholarServices.map((service) => (
        <button
          key={service.id}
          onClick={() =>
            toast.info(`${service.title} service is not yet built!`)
          }
          className="group text-left h-full"
        >
          <div
            className={cn(
              'rounded-xl p-0.5 transition-all duration-300 h-full',
              'bg-gradient-to-r from-blue-200/80 to-blue-300/80',
              'group-hover:from-dost-bgstart group-hover:to-dost-bgend',
              'group-hover:scale-[1.03] group-hover:shadow-lg'
            )}
          >
            {/* This is the inner card */}
            <Card
              className={cn(
                'h-full w-full rounded-[10px] bg-white',
                'flex flex-col justify-center'
              )}
            >
              <CardHeader className="flex flex-col items-center justify-center p-5 pb-0">
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-xl',
                    'bg-gradient-to-br from-dost-bgstart to-dost-bgend text-white',
                    'transition-all duration-300 group-hover:scale-105'
                  )}
                >
                  <service.icon className="h-7 w-7" />
                </div>
                <CardTitle className="mt-4 text-center text-dost-title text-base font-semibold">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-3 text-center text-sm text-gray-600">
                {service.description}
              </CardContent>
            </Card>
          </div>
        </button>
      ))}
    </div>
  );
}