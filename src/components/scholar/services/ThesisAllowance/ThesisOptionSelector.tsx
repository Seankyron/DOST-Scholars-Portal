'use client';

import { LucideIcon, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface ThesisOptionSelectorProps {
  title: string;
  description: string;
  amount: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
}

export function ThesisOptionSelector({ 
  title, 
  description, 
  amount,
  icon: Icon, 
  onClick, 
  className,
  disabled 
}: ThesisOptionSelectorProps) {
  return (
    <Card 
      onClick={disabled ? undefined : onClick}
      className={cn(
        "relative transition-all duration-200 border-2",
        disabled 
          ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-80" 
          : "cursor-pointer bg-white border-transparent hover:border-dost-title/30 hover:shadow-lg group",
        className
      )}
    >
      {/* Locked Overlay / Icon */}
      {disabled && (
        <div className="absolute top-3 right-3 text-gray-400">
          <Lock className="h-5 w-5" />
        </div>
      )}

      <div className="p-6 flex items-start gap-4 h-full">
        {/* Icon Circle */}
        <div className={cn(
            "h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors",
            disabled 
              ? "bg-gray-200 text-gray-400" 
              : "bg-dost-title/10 text-dost-title group-hover:bg-dost-title group-hover:text-white"
          )}>
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Content */}
        <div className="space-y-1 flex flex-col w-full">
          <h3 className={cn(
            "font-bold transition-colors",
            disabled ? "text-gray-500" : "text-gray-900 group-hover:text-dost-title"
          )}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {disabled && title.includes("10%") 
                ? "Requires 90% partial submission first." 
                : disabled && title.includes("90%") && !title.includes("100")
                ? "Already submitted or Full Release selected."
                : disabled && title.includes("100%")
                ? "Partial release already started."
                : description}
          </p>
          
          {/* Amount Badge */}
          <div className="pt-2 mt-auto">
             <span className={cn(
               "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
               disabled 
                 ? "bg-gray-200 text-gray-500" 
                 : "bg-blue-50 text-dost-title group-hover:bg-dost-title group-hover:text-white"
             )}>
                {amount}
             </span>
          </div>
        </div>
      </div>
    </Card>
  );
}