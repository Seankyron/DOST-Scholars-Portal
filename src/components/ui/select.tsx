import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string; // <-- ADD THIS PROP
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, required, placeholder, ...props }, ref) => { // <-- Add placeholder to destructuring
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 pr-10 border rounded-lg appearance-none transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-dost-title focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300',
              className
            )}
            {...props}
          >
            {/* MODIFICATION: Use placeholder prop */}
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';