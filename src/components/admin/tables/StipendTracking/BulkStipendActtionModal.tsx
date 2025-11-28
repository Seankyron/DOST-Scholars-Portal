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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAdminNote('');
      // Pre-select all pending allowances for convenience if action is Release
      if (action === 'Release') {
        setSelectedAllowances(pendingAllowances);
      } else {
        setSelectedAllowances([]);
      }
    }
  }, [isOpen, action, pendingAllowances]);

  const handleToggle = (allowanceName: string) => {
    setSelectedAllowances((prev) =>
      prev.includes(allowanceName)
        ? prev.filter((item) => item !== allowanceName)
        : [...prev, allowanceName]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAllowances(pendingAllowances);
    } else {
      setSelectedAllowances([]);
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
          <ModalTitle className={cn(isDanger ? 'text-red-600' : 'text-green-600')}>
            Bulk Action: {action}
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="space-y-4 py-4">
          <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
            You are about to apply the <strong>{action}</strong> status to{' '}
            <strong className="text-gray-900">{selectedCount}</strong> selected scholar(s).
          </div>

          {action === 'Release' ? (
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-800">
                Select Allowances to Release
              </Label>
              <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between p-3 bg-gray-50">
                  <Label htmlFor="select-all-allowances" className="font-semibold cursor-pointer">
                    Select All Available
                  </Label>
                  <Checkbox
                    id="select-all-allowances"
                    checked={
                      pendingAllowances.length > 0 &&
                      selectedAllowances.length === pendingAllowances.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>
                
                {pendingAllowances.length > 0 ? (
                  pendingAllowances.map((allowanceName) => (
                    <div key={allowanceName} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                      <Label htmlFor={allowanceName} className="cursor-pointer font-normal">
                        {allowanceName}
                      </Label>
                      <Checkbox
                        id={allowanceName}
                        checked={selectedAllowances.includes(allowanceName)}
                        onChange={() => handleToggle(allowanceName)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 italic">
                    No pending allowances found across the selected scholars.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="bulk-admin-note" className="text-base font-semibold">
                Reason for Hold (Required)
              </Label>
              <Textarea
                id="bulk-admin-note"
                placeholder="e.g., 'Pending submission of Form 5 for the current semester...'"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-gray-500">
                This note will be visible to the scholars in their portal.
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
            Proceed to Confirmation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}