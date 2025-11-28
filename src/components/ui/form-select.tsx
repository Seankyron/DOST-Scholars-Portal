'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  disabled,
  required,
  className,
}: FormSelectProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      <Label className={cn("text-gray-700", error && "text-red-500")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn(error && "border-red-500 focus:ring-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No options available</div>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}