'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface PurposeSelectorProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function PurposeSelector({ title, description, icon: Icon, onClick }: PurposeSelectorProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg group",
        "border-2 border-transparent bg-white hover:border-dost-title/30"
      )}
    >
      <div className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
            "bg-dost-title/10 text-dost-title",
            "group-hover:bg-dost-title group-hover:text-white"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-dost-title transition-colors">
              {title}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-dost-title transition-colors" />
      </div>
    </Card>
  );
}