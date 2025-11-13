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
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/utils/format';
import type { StipendDetails } from './StipendTrackingTable';
import type { Allowance, StipendUpdate } from '@/types';
import { toast } from '@/components/ui/toaster';

interface UpdateStipendModalProps {
  isOpen: boolean;
  onClose: () => void;
  stipendDetails: StipendDetails;
  onSave: (updatedStipend: StipendDetails) => void;
}

const allowanceStatusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'On hold', label: 'On Hold' },
  { value: 'Released', label: 'Released' },
];

export function UpdateStipendModal({
  isOpen,
  onClose,
  stipendDetails,
  onSave,
}: UpdateStipendModalProps) {
  // --- STATE TO MANAGE EDITS ---
  const [breakdown, setBreakdown] = useState(stipendDetails.stipend.breakdown);
  const [updates, setUpdates] = useState(stipendDetails.stipend.updates);
  const [onHold, setOnHold] = useState(stipendDetails.stipend.onHold);
  const [customUpdateMsg, setCustomUpdateMsg] = useState('');

  const handleBreakdownChange = (
    index: number,
    newStatus: Allowance['status']
  ) => {
    setBreakdown((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleAddCustomUpdate = () => {
    if (customUpdateMsg.trim() === '') {
      toast.error('Update message cannot be empty.');
      return;
    }
    const newUpdate: StipendUpdate = {
      message: `Admin Note: ${customUpdateMsg}`,
      type: 'info', // Or 'warning' if you add a selector for it
    };
    setUpdates((prev) => [newUpdate, ...prev]);
    setCustomUpdateMsg('');
  };

  const handleSaveChanges = () => {
    // Recalculate totals based on the new breakdown
    const newReceived = breakdown
      .filter((item) => item.status === 'Released')
      .reduce((sum, item) => sum + item.amount, 0);
    const newPending = breakdown
      .filter((item) => item.status !== 'Released')
      .reduce((sum, item) => sum + item.amount, 0);

    const newStatus =
      newPending === 0
        ? 'Released'
        : onHold
          ? 'On hold'
          : 'Processing';

    // Create the updated stipend object
    const updatedStipend: StipendDetails = {
      ...stipendDetails,
      stipend: {
        ...stipendDetails.stipend,
        received: newReceived,
        pending: newPending,
        onHold: onHold,
        status: newStatus,
        breakdown: breakdown,
        updates: updates,
      },
    };
    
    onSave(updatedStipend);
    toast.success('Stipend updated successfully!');
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>Update Stipend</ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
          {/* Scholar Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-dost-title">
              {stipendDetails.scholarInfo.name}
            </h3>
            <p className="text-sm text-gray-600">
              {stipendDetails.semesterInfo.year},{' '}
              {stipendDetails.semesterInfo.semester} (
              {stipendDetails.semesterInfo.academicYear})
            </p>
          </div>

          {/* Allowance Breakdown Editor */}
          <section className="space-y-3">
            <Label className="text-base font-semibold text-gray-800">
              Allowance Breakdown
            </Label>
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin border p-3 rounded-md">
              {breakdown.map((allowance, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <p className="text-sm font-medium">
                    {allowance.name} ({formatCurrency(allowance.amount)})
                  </p>
                  <Select
                    value={allowance.status}
                    onChange={(e) =>
                      handleBreakdownChange(
                        index,
                        e.target.value as Allowance['status']
                      )
                    }
                    options={allowanceStatusOptions}
                    className="w-36"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Status Checkbox */}
          <Checkbox
            label="Place this semester's stipend 'On Hold'"
            checked={onHold}
            onChange={(e) => setOnHold(e.target.checked)}
          />

          {/* Custom Updates */}
          <section className="space-y-2">
            <Label className="text-base font-semibold text-gray-800">
              Add Custom Update
            </Label>
            <Textarea
              placeholder="e.g., 'On hold pending Form 5 submission...'"
              value={customUpdateMsg}
              onChange={(e) => setCustomUpdateMsg(e.target.value)}
              className="min-h-[70px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCustomUpdate}
            >
              Add Update Message
            </Button>
            <div className="space-y-1 pt-2">
              <Label className="text-xs text-gray-500">Update History</Label>
              {updates.map((update, index) => (
                <p key={index} className="text-sm text-gray-700 border-b pb-1">
                  {update.message}
                </p>
              ))}
            </div>
          </section>
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </ModalClose>
          <Button type="button" variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}