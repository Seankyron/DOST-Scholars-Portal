'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils/cn';

interface BulkStipendUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminNote: string) => void;
  action: 'Release' | 'On Hold';
  selectedCount: number;
  isLoading: boolean;
}

export function BulkReleaseModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  selectedCount,
  isLoading,
}: BulkStipendUpdateModalProps) {
  const [adminNote, setAdminNote] = useState('');

  const handleConfirm = () => {
    if (action === 'On Hold' && adminNote.trim() === '') {
      toast.error('An admin note is required to place stipends on hold.');
      return;
    }
    onConfirm(adminNote);
  };

  const isDanger = action === 'On Hold';

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>
            Bulk Update Stipends: {action}
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <p>
            You are about to set{' '}
            <strong className="font-bold">{selectedCount}</strong>{' '}
            stipend record(s) to{' '}
            <strong
              className={cn(
                isDanger ? 'text-red-600' : 'text-green-600'
              )}
            >
              "{action}"
            </strong>
            .
          </p>
          <div className="space-y-2">
            <Label htmlFor="bulk-admin-note">
              Admin Note (Required for "On Hold")
            </Label>
            <Textarea
              id="bulk-admin-note"
              placeholder="e.g., 'Placed on hold pending mid-year processing...'"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500">
              This note will be added to the "Updates" section for all selected
              scholars.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </ModalClose>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            isLoading={isLoading}
            className={cn(
              isDanger &&
                'bg-red-600 hover:bg-red-700'
            )}
          >
            Confirm Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}