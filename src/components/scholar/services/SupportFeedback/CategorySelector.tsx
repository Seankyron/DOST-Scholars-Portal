// src/components/scholar/services/SupportFeedback/CategorySelector.tsx
'use client';

import { LucideIcon, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface CategorySelectorProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function CategorySelector({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: CategorySelectorProps) {
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
          {/* Icon Container */}
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
            "bg-dost-title/10 text-dost-title",
            "group-hover:bg-dost-title group-hover:text-white"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-dost-title transition-colors">
              {title}
            </h3>
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