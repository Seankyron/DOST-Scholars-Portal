'use client';

import { Card, CardContent } from '@/components/ui/card';
import { scholarServices } from '@/config/services';
import { cn } from '@/lib/utils/cn';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/toaster';

export function ServiceTilesGrid() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {scholarServices.map((service) => (
          <button
            key={service.id}
            onClick={() =>
              toast.info(`${service.title} service is not yet built!`)
            }
            className="group text-left"
          >
            <Card className="h-full transform-gpu overflow-hidden bg-white shadow-md transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-[1.02] group-hover:border-dost-title/50 border-2 border-transparent">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg text-white mb-4',
                      service.color
                    )}
                  >
                    <service.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-dost-title" />
                </div>
                <h3 className="text-lg font-semibold text-dost-title">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}