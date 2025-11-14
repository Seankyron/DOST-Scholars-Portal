'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils/cn';
import { Separator } from '@/components/ui/separator';

export type BulkAction = 'Release' | 'On Hold';
export interface BulkActionPayload {
  allowancesToRelease?: string[];
  adminNote?: string;
}

interface BulkStipendActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: BulkActionPayload) => void;
  action: BulkAction;
  pendingAllowances: string[];
  selectedCount: number;
  isLoading: boolean;
}

export function BulkStipendActionModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  pendingAllowances,
  selectedCount,
  isLoading,
}: BulkStipendActionModalProps) {
  const [adminNote, setAdminNote] = useState('');
  const [selectedAllowances, setSelectedAllowances] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAdminNote('');
      setSelectedAllowances([]);
    }
  }, [isOpen, action]);

  const handleToggle = (allowanceName: string) => {
    setSelectedAllowances((prev) =>
      prev.includes(allowanceName)
        ? prev.filter((item) => item !== allowanceName)
        : [...prev, allowanceName]
    );
  };

  const handleSelectAll = () => {
    if (selectedAllowances.length === pendingAllowances.length) {
      setSelectedAllowances([]);
    } else {
      setSelectedAllowances(pendingAllowances);
    }
  };

  const handleConfirm = () => {
    if (action === 'Release') {
      if (selectedAllowances.length === 0) {
        toast.error('Please select at least one allowance to release.');
        return;
      }
      onConfirm({ allowancesToRelease: selectedAllowances });
    } else {
      if (adminNote.trim() === '') {
        toast.error('An admin note is required to place stipends on hold.');
        return;
      }
      onConfirm({ adminNote: adminNote });
    }
  };

  const isDanger = action === 'On Hold';

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>
            Bulk Stipend Action: {action}
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <p>
            You are about to{' '}
            <strong
              className={cn(
                isDanger ? 'text-red-600' : 'text-green-600'
              )}
            >
              {action}
            </strong>{' '}
            allowances for{' '}
            <strong className="font-bold">{selectedCount}</strong>{' '}
            selected scholar(s).
          </p>


          {action === 'Release' ? (
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-800">
                Allowances to Release
              </Label>
              <div className="max-h-60 overflow-y-auto scrollbar-thin border p-3 rounded-md">
                <div className="flex items-center justify-between py-2">
                  <Label
                    htmlFor="select-all-allowances"
                    className="font-semibold"
                  >
                    Select All
                  </Label>
                  <Checkbox
                    id="select-all-allowances"
                    checked={
                      pendingAllowances.length > 0 &&
                      selectedAllowances.length === pendingAllowances.length
                    }
                    onChange={handleSelectAll}
                  />
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  {pendingAllowances.length > 0 ? (
                    pendingAllowances.map((allowanceName) => (
                      <div
                        key={allowanceName}
                        className="flex items-center justify-between py-1"
                      >
                        <Label htmlFor={allowanceName}>{allowanceName}</Label>
                        <Checkbox
                          id={allowanceName}
                          checked={selectedAllowances.includes(allowanceName)}
                          // --- THIS IS THE FIX ---
                          onChange={() => handleToggle(allowanceName)}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center py-2">
                      No pending allowances found for selected scholars.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="bulk-admin-note" className="text-base font-semibold">
                Admin Note (Required)
              </Label>
              <Textarea
                id="bulk-admin-note"
                placeholder="e.g., 'Placed on hold pending mid-year processing...'"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-xs text-gray-500">
                This note will be added to the "Updates" section for all
                selected scholars.
              </p>
            </div>
          )}
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
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            )}
          >
            {action === 'Release' ? 'Confirm Release' : 'Confirm On Hold'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}