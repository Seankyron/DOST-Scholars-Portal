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
import type { Allowance } from '@/types';
import type { StipendUpdate } from '@/types/admin';
import { toast } from '@/components/ui/toaster';
import { StatusDropdown } from './StatusDropdown';

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
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex flex-col">
              <ModalTitle>Update Stipend Details</ModalTitle>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Manage allowances and status for {semesterInfo.semester}, {semesterInfo.academicYear}
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
          
          {/* --- TOP SECTION: Info Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Scholar Information Column */}
            <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 h-full">
                <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                </h2>
                <InfoItem label="Name" value={scholarInfo.name} />
                <InfoItem label="SPAS ID" value={scholarInfo.scholarId} />
                <InfoItem label="Email" value={scholarInfo.email} />
                <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
            </section>

            {/* Placement Information Column */}
            <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 h-full">
                <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement Information
                </h2>
                <InfoItem label="Scholarship Type" value={scholarInfo.scholarshipType} />
                <InfoItem label="Batch / Year Awarded" value={scholarInfo.batch} />
                <InfoItem label="School / University" value={placementInfo.university} />
                <InfoItem label="Program / Course" value={placementInfo.program} />
            </section>
          </div>

          {/* --- MIDDLE SECTION: Allowance Breakdown (Maximized Spacing & Columns) --- */}
          <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
            <Label className="text-base font-semibold text-gray-800 border-b pb-2 block">
              Allowance Breakdown
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breakdown.map((allowance, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-md bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">{allowance.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{formatCurrency(allowance.amount)}</p>
                  </div>
                  <StatusDropdown
                    currentStatus={allowance.status}
                    onChange={(newStatus) =>
                      handleBreakdownChange(index, newStatus)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* --- BOTTOM SECTION: Admin Custom Update (Below Whole Row) --- */}
          <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
            <Label className="text-base font-semibold text-gray-800 border-b pb-2 block">
              Add Custom Update
            </Label>
            <div className="space-y-3">
              <Textarea
                placeholder="e.g., 'On hold pending Form 5 submission...'"
                value={customUpdateMsg}
                onChange={(e) => setCustomUpdateMsg(e.target.value)}
                className="min-h-[100px]"
              />
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