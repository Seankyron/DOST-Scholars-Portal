// src/components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/label';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, required, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <Label className={cn("text-gray-700", error && "text-red-500")}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-dost-title focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : '',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';