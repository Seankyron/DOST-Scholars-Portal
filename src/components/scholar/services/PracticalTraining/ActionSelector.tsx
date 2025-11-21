import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface ActionSelectorProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

export function ActionSelector({ title, description, icon: Icon, onClick, className }: ActionSelectorProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg group",
        // Border changes to dost-title on hover
        "border-2 border-transparent bg-white hover:border-dost-title/30"
      )}
    >
      <div className="p-6 flex items-start gap-4">
        <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
            "bg-dost-title/10 text-dost-title",
            "group-hover:bg-dost-title group-hover:text-white"
          )}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 group-hover:text-dost-title transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}