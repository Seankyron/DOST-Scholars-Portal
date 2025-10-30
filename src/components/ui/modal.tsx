'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  closeOnBackdrop?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={cn(
            'relative bg-white rounded-xl shadow-2xl w-full my-8',
            'animate-in zoom-in-95 fade-in duration-200',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {showClose && (
            <button
              onClick={onClose}
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

export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5 border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

export function ModalTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900 pr-8', className)}>
      {children}
    </h2>
  );
}

export function ModalDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  );
}