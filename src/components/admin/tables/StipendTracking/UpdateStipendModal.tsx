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
import type { Allowance} from '@/types';
import type { StipendUpdate } from '@/types/admin';
import { toast } from '@/components/ui/toaster';
import { StatusDropdown } from './StatusDropdown';
import { Separator } from '@/components/ui/separator';

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
    </div>
  );
}

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
  const { scholarInfo, placementInfo, semesterInfo } = stipendDetails;
  
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
          <ModalTitle>Update Stipend Details</ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
             Manage allowances and status for {semesterInfo.semester}, {semesterInfo.academicYear}
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
          
          {/* --- TOP SECTION: Info Grid (Matches PTP Layout) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Scholar Information Column */}
            <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 h-full">
                <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                </h2>
                <InfoItem label="Name" value={scholarInfo.name} />
                <InfoItem label="SPAS ID" value={scholarInfo.scholarId} />
                <InfoItem label="Email" value={scholarInfo.email} />
                {/* --- ADDED CONTACT NUMBER --- */}
                <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
            </section>

            {/* Placement / Academic Info Column */}
            <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 h-full">
                <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement & Term
                </h2>
                <InfoItem label="University" value={placementInfo.university} />
                <InfoItem label="Program" value={placementInfo.program} />
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Year Level" value={semesterInfo.year} />
                    <InfoItem label="Academic Year" value={semesterInfo.academicYear} />
                </div>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* --- LEFT COLUMN (Allowances) --- */}
            <section className="md:col-span-3 space-y-3 bg-white border rounded-lg shadow-sm p-5">
              <Label className="text-base font-semibold text-gray-800 border-b pb-2 block">
                Allowance Breakdown
              </Label>
              <div className="space-y-1">
                {breakdown.map((allowance, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between gap-3 pt-1 pb-1">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{allowance.name}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(allowance.amount)}</p>
                      </div>
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
            <section className="md:col-span-2 space-y-4 bg-white border rounded-lg shadow-sm p-5">
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-800 border-b pb-2 block">
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
                  className="w-full"
                >
                  Add Update Message
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Update History
                </Label>
                <div className="max-h-40 overflow-y-auto scrollbar-thin border p-3 rounded-md space-y-2 bg-gray-50">
                  {updates.length > 0 ? (
                    updates.map((update, index) => (
                      <div key={index} className="border-b pb-2 last:border-b-0">
                        <p className="text-xs font-semibold text-gray-600 mb-0.5">
                          {update.type === 'info' ? 'Admin Note' : 'System Update'}
                        </p>
                        <p className="text-sm text-gray-700">{update.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      No updates yet.
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