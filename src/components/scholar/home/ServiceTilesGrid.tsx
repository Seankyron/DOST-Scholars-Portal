'use client';

import { Card } from '@/components/ui/card'; 
import { scholarServices } from '@/config/services';
import { cn } from '@/lib/utils/cn';
import { toast } from '@/components/ui/toaster';

export function ServiceTilesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
      {scholarServices.map((service) => (
      
        <Card
          key={service.id}
          variant="service" 
          onClick={() =>
            toast.info(`${service.title} service is not yet built!`)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toast.info(`${service.title} service is not yet built!`);
            }
          }}
          className={cn(
            'group h-full text-left', 
            'flex flex-col items-center justify-start text-center', 
            'p-5 sm:p-6', 
            'transition-all duration-300 ease-in-out', 
            'hover:shadow-xl hover:-translate-y-1' 
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-xl', 
              'bg-gradient-to-br from-dost-bgstart to-dost-bgend text-white', 
              'transition-transform duration-300 ease-in-out',
              'group-hover:scale-110' 
            )}
          >
            <service.icon className="h-8 w-8" />
          </div>

          <h3 className="mt-4 text-dost-title text-base font-semibold">
            {service.title}
          </h3>

          <p className="mt-1 text-sm text-gray-600 flex-1">
            {service.description}
          </p>
        </Card>
      ))}
    </div>
  );
}