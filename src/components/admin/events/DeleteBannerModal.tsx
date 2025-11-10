'use client';

import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalDescription, 
  ModalFooter,
} from '@/components/ui/modal';
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'; 

interface DeleteBannerModalProps {
  open: boolean;
  onClose: () => void;
  bannerTitle?: string;
  onConfirm: () => void;
}

export function DeleteBannerModal({
  open,
  onClose,
  bannerTitle,
  onConfirm,
}: DeleteBannerModalProps) {
  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="sm">
        <ModalHeader
          className={cn('flex flex-row items-center gap-4 space-y-0')}
        >
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              'bg-red-100' 
            )}
          >
            <AlertTriangle className={cn('h-6 w-6', 'text-red-600')} />
          </div>
          <div>
            <ModalTitle>Confirm Deletion</ModalTitle>
          </div>
        </ModalHeader>

        <ModalBody className="pt-0 pb-2">
          <ModalDescription>
            Are you sure you want to delete{' '}
            <strong>{bannerTitle || 'this banner'}</strong>? This action cannot
            be undone.
          </ModalDescription>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary" 
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}