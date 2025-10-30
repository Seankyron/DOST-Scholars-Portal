'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');

  const handleClick = () => context.setOpen(true);

  if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
    return <div onClick={handleClick}>{children}</div>;
  }

  return <div onClick={handleClick}>{children}</div>;
}

export function DialogContent({ 
  children, 
  className,
  showClose = true,
}: { 
  children: React.ReactNode; 
  className?: string;
  showClose?: boolean;
}) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  if (!context.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={() => context.setOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden',
            'animate-in zoom-in-95 fade-in',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {showClose && (
            <button
              onClick={() => context.setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5 border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function DialogBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5 overflow-y-auto max-h-[60vh]', className)}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  );
}
