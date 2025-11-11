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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, FileText } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
// --- NEW: Import the data type ---
import { type VerificationRowData } from './VerificationRow';

// (InfoItem helper component remains the same)
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mb-4 break-words">
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );
}

// --- MODIFIED: Props updated ---
interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountData: VerificationRowData; // Use the new type
  onVerify: () => void; // Function from parent
  onReject: () => void; // Function from parent
}

export function VerificationModal({
  isOpen,
  onClose,
  accountData,
  onVerify,
  onReject,
}: VerificationModalProps) {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  if (!accountData) return null;

  // --- MODIFIED: Use the pre-formatted fullName ---
  const name = accountData.fullName;

  // --- MODIFIED: Handlers now call props ---
  const handleVerify = () => {
    onVerify(); // Call the function passed from parent
    setIsVerifyOpen(false); // Close dialog
    onClose(); // Close modal
  };

  const handleReject = () => {
    onReject(); // Call the function passed from parent
    setIsRejectOpen(false); // Close dialog
    onClose(); // Close modal
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
            <ModalTitle>Account Verification</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6">
            {/* --- All this display logic now works perfectly --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:border-r md:pr-6 md:border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold text-dost-title mb-2">
                  Scholar Information
                </h3>
                <InfoItem label="Name" value={name} />
                <InfoItem label="SPAS ID" value={accountData.scholarId} />
                <InfoItem label="Email" value={accountData.email} />
                <InfoItem label="Contact Number" value={accountData.contactNumber} />
                <InfoItem label="Date of Birth" value={accountData.dateOfBirth} />
                <InfoItem label="Province" value={accountData.addressProvince} />
                <InfoItem label="City/Municipality" value={accountData.addressCity} />
                <InfoItem label="Barangay, Street, House/Unit No." value={accountData.addressBrgy} />
              </div>

              {/* --- Column 2: Study Placement --- */}
              <div className="md:border-r md:pr-6 md:border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold text-dost-title mb-2">
                  Year of Award and Study Placement
                </h3>
                <InfoItem
                  label="Scholarship Type"
                  value={accountData.scholarshipType}
                />
                <InfoItem
                  label="Batch / Year Awarded"
                  value={accountData.yearAwarded}
                />
                <InfoItem
                  label="School / University"
                  value={accountData.university}
                />
                <InfoItem label="Program / Course" value={accountData.program} />
              </div>

              {/* --- Column 3: Curriculum Information --- */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-dost-title mb-2">
                  Curriculum Information
                </h3>
                <InfoItem label="Duration of Course" value={accountData.courseDuration} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Midyear Classes
                    </Label>
                    <div className="flex flex-col gap-2 mt-2">
                      <Checkbox
                        label="1st Year"
                        checked={accountData.midyear1stYear}
                        disabled
                      />
                      <Checkbox
                        label="2nd Year"
                        checked={accountData.midyear2ndYear}
                        disabled
                      />
                      <Checkbox
                        label="3rd Year"
                        checked={accountData.midyear3rdYear}
                        disabled
                      />
                      <Checkbox
                        label="4th Year"
                        checked={accountData.midyear4thYear}
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Thesis in Curriculum
                    </Label>
                    <div className="flex flex-col gap-2 mt-2">
                      <Checkbox
                        label="1st Year"
                        checked={accountData.thesis1stYear}
                        disabled
                      />
                      <Checkbox
                        label="2nd Year"
                        checked={accountData.thesis2ndYear}
                        disabled
                      />
                      <Checkbox
                        label="3rd Year"
                        checked={accountData.thesis3rdYear}
                        disabled
                      />
                      <Checkbox
                        label="4th Year"
                        checked={accountData.thesis4thYear}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <InfoItem label="OJT Year" value={accountData.ojtYear} />
                   <InfoItem label="OJT Semester" value={accountData.ojtSemester} />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1.5 mt-4">
                    Course Curriculum (PDF)
                  </Label>
                  {accountData.curriculumFile?.url ? (
                    <a
                      href={accountData.curriculumFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-300 text-blue-600 hover:text-blue-800 hover:bg-gray-100"
                    >
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">
                        {accountData.curriculumFile.name}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-300 text-gray-500">
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">No file submitted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </ModalClose>
            <Button
              type="button"
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsRejectOpen(true)}
            >
              <X className="h-4 w-4 mr-2" />
              REJECT
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsVerifyOpen(true)}
            >
              <Check className="h-4 w-4 mr-2" />
              VERIFY
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onConfirm={handleVerify}
        title="Verify Account"
        description={`Are you sure you want to verify the account for ${name}? An email will be sent to the scholar.`}
        variant="info"
        confirmText="Yes, verify"
      />
      
      <ConfirmDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject Account"
        description={`Are you sure you want to reject the account for ${name}? This action cannot be undone.`}
        variant="danger"
        confirmText="Yes, reject"
      />
    </>
  );
}