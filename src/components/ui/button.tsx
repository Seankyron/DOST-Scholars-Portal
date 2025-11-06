'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean; 
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      asChild = false, 
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const variants = {
      primary:
        'bg-dost-title text-white hover:bg-dost-title/90 disabled:opacity-50',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
      outline:
        'border-2 border-dost-title text-dost-title hover:bg-dost-title/5 disabled:border-dost-title/40 disabled:text-dost-title/40',
      ghost: 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          'rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Updated loading logic to correctly wrap children */}
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';