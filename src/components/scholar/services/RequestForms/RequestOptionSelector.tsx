'use client';

import { LucideIcon, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface RequestOptionSelectorProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function RequestOptionSelector({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: RequestOptionSelectorProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg group",
        "border-2 border-transparent bg-white hover:border-dost-title/30"
      )}
    >
      <div className="p-5 flex items-start gap-4 h-full">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-1",
          "bg-dost-title/10 text-dost-title",
          "group-hover:bg-dost-title group-hover:text-white"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 group-hover:text-dost-title transition-colors text-sm sm:text-base">
              {title}
            </h3>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-dost-title transition-colors" />
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}