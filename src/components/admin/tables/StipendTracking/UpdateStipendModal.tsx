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
import { formatCurrency } from '@/lib/utils/format';
import type { StipendDetails } from './StipendTrackingTable';
import type { Allowance, StipendUpdate } from '@/types';
import { toast } from '@/components/ui/toaster';
import { StatusDropdown } from './StatusDropdown';
import { Separator } from '@/components/ui/separator';

interface UpdateStipendModalProps {
  isOpen: boolean;
  onClose: () => void;
  stipendDetails: StipendDetails;
  onSave: (updatedStipend: StipendDetails) => void;
}

export function UpdateStipendModal({
  isOpen,
  onClose,
  stipendDetails,
  onSave,
}: UpdateStipendModalProps) {
  // (State and handlers remain the same)
  const [breakdown, setBreakdown] = useState(stipendDetails.stipend.breakdown);
  const [updates, setUpdates] = useState(stipendDetails.stipend.updates);
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
    // (This function remains the same)
    if (customUpdateMsg.trim() === '') {
      toast.error('Update message cannot be empty.');
      return;
    }
    const newUpdate: StipendUpdate = {
      message: `Admin Note: ${customUpdateMsg}`,
      type: 'info',
    };
    setUpdates((prev) => [newUpdate, ...prev]);
    setCustomUpdateMsg('');
  };

  const handleSaveChanges = () => {
    // (This function remains the same)
    const newReceived = breakdown
      .filter((item) => item.status === 'Released')
      .reduce((sum, item) => sum + item.amount, 0);
    const newPending = breakdown
      .filter((item) => item.status !== 'Released')
      .reduce((sum, item) => sum + item.amount, 0);
    const newOnHold = breakdown.some((item) => item.status === 'On hold');
    const newStatus =
      newPending === 0
        ? 'Released'
        : newOnHold
          ? 'On hold'
          : 'Processing';
    const updatedStipend: StipendDetails = {
      ...stipendDetails,
      stipend: {
        ...stipendDetails.stipend,
        received: newReceived,
        pending: newPending,
        onHold: newOnHold,
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
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>Update Stipend</ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6">
          {/* Scholar Info */}
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-dost-title">
              {stipendDetails.scholarInfo.name}
            </h3>
            <p className="text-sm text-gray-600">
              {stipendDetails.semesterInfo.year},{' '}
              {stipendDetails.semesterInfo.semester} (
              {stipendDetails.semesterInfo.academicYear})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* --- LEFT COLUMN (Allowances) --- */}
            <section className="md:col-span-3 space-y-3">
              <Label className="text-base font-semibold text-gray-800">
                Allowance Breakdown
              </Label>
              <div className="border p-3 rounded-md">
                {breakdown.map((allowance, index) => (
                  <div key={index}>
                    {/* --- 3. ADD the separator --- */}
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between gap-3 pt-1 pb-1">
                      <p className="text-sm font-medium">
                        {allowance.name} ({formatCurrency(allowance.amount)})
                      </p>
                      <StatusDropdown
                        currentStatus={allowance.status}
                        onChange={(newStatus) =>
                          handleBreakdownChange(index, newStatus)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- RIGHT COLUMN (Actions & Updates) --- */}
            <section className="md:col-span-2 space-y-4">
              {/* (Custom Updates & History sections remain the same) */}
              <div className="space-y-2">
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
              </div>

              <div className="space-y-1 pt-2">
                <Label className="text-base font-semibold text-gray-800">
                  Update History
                </Label>
                <div className="max-h-40 overflow-y-auto scrollbar-thin border p-3 rounded-md space-y-2">
                  {updates.length > 0 ? (
                    updates.map((update, index) => (
                      <p
                        key={index}
                        className="text-sm text-gray-700 border-b pb-2 last:border-b-0"
                      >
                        {update.message}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No custom updates posted.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
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