'use client';

import { useState } from 'react';
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
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DeleteBannerModalProps {
  open: boolean;
  onClose: () => void;
  bannerId?: number;
  bannerTitle?: string;
  onDeleted?: (id: number) => void; // callback to refresh or update UI
}

export function DeleteBannerModal({
  open,
  onClose,
  bannerId,
  bannerTitle,
  onDeleted,
}: DeleteBannerModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!bannerId) return;

    try {
      setIsDeleting(true);
      setError(null);

      const res = await fetch('/api/admin/events/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bannerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete event');
      }

      onDeleted?.(bannerId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="sm">
        <ModalHeader className={cn('flex flex-row items-center gap-4 space-y-0')}>
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              'bg-red-100'
            )}
          >
            <AlertTriangle className={cn('h-6 w-6', 'text-red-600')} />
          </div>
          <ModalTitle>Confirm Deletion</ModalTitle>
        </ModalHeader>

        <ModalBody className="pt-0 pb-2 space-y-2">
          <ModalDescription>
            Are you sure you want to delete{' '}
            <strong>{bannerTitle || 'this banner'}</strong>? This action cannot be undone.
          </ModalDescription>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
