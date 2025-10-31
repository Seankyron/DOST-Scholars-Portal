'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light' as any}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-600',
          actionButton:
            'group-[.toast]:bg-dost-title group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-gray-200 group-[.toast]:text-gray-800',
        },
      }}
      {...props}
    />
  );
};

// Re-export toast function to be used easily
export { Toaster };
export { toast } from 'sonner';