'use client';

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription,
  ModalBody,
  ModalFooter 
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmDialogProps) {
  
  // Icon background colors
  const bgColors = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
  };

  // Icon colors
  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  // Button colors
  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="sm">
        
        {/* --- THIS IS THE FIX --- */}
        <ModalHeader 
          className={cn(
            // Changed "items-start" to "items-center"
            "flex flex-row items-center gap-4 space-y-0"
          )}
        >
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            bgColors[variant]
          )}>
            <AlertTriangle className={cn("h-6 w-6", iconColors[variant])} />
          </div>

          {/* Title */}
          <div> {/* Removed "pt-1" */}
            <ModalTitle>{title}</ModalTitle>
          </div>
        </ModalHeader>
        
        <ModalBody className="pt-0 pb-2">
          <ModalDescription>
            {description}
          </ModalDescription>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant='primary' // Base variant
            onClick={onConfirm}
            isLoading={isLoading}
            className={cn(
              // Apply specific danger/warning colors
              buttonColors[variant]
            )}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}