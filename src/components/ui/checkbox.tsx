import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300',
              'checked:bg-dost-title checked:border-dost-title',
              'focus:outline-none focus:ring-2 focus:ring-dost-blue focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
        </div>
        {label && <span className="text-sm text-gray-700 leading-tight">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
