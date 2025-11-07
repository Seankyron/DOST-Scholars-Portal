'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, FileText } from 'lucide-react';
import {
  YEAR_LEVELS,
  SEMESTERS,
  PROVINCES,
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
} from '@/lib/utils/constants';

/**
 * A small helper component to render the "Label" and "Value" pairs
 * consistently, for fields that don't need the grid layout.
 */
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mb-4 break-words">
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );
}

// This interface matches the FormData from the signup page
interface VerificationAccountData {
  scholarId?: string;
  email?: string;
  firstName: string;
  middleName?: string;
  surname: string;
  suffix?: string;
  dateOfBirth: string;
  contactNumber: string;
  addressBrgy: string;
  addressCity: string;
  addressProvince: string;
  scholarshipType: string;
  yearAwarded: string;
  university: string;
  program: string;
  midyear1stYear: boolean;
  midyear2ndYear: boolean;
  midyear3rdYear: boolean;
  midyear4thYear: boolean;
  thesis1stYear: boolean;
  thesis2ndYear: boolean;
  thesis3rdYear: boolean;
  thesis4thYear: boolean;
  courseDuration: string;
  ojtYear: string;
  ojtSemester: string;
  curriculumFile?: {
    name: string;
    url: string;
  };
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountData?: VerificationAccountData;
}

export function VerificationModal({
  isOpen,
  onClose,
  accountData,
}: VerificationModalProps) {
  if (!accountData) return null;

  // --- Options for Select components ---
  const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }));
  const scholarshipOptions = SCHOLARSHIP_TYPES.map((s) => ({
    value: s,
    label: s,
  }));
  const universityOptions = UNIVERSITIES.map((u) => ({ value: u, label: u }));
  const yearOptions = YEAR_LEVELS.map((y) => ({ value: y, label: y }));
  const semesterOptions = SEMESTERS.map((s) => ({ value: s, label: s }));
  const durationOptions = [
    { value: '4', label: '4 Years' },
    { value: '5', label: '5 Years' },
  ];

  // --- Process data for display ---
  const name = [
    accountData.firstName,
    accountData.middleName,
    accountData.surname,
    accountData.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const curriculumFileName =
    accountData.curriculumFile?.name || 'No File Submitted';
  const curriculumFileUrl = accountData.curriculumFile?.url;

  const handleVerify = () => {
    // TODO: Add verification logic
    console.log('Verifying account:', accountData.scholarId);
    onClose();
  };

  const handleReject = () => {
    // TODO: Add rejection logic
    console.log('Rejecting account:', accountData.scholarId);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>Account Verification</ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6">
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
              {/* --- Midyear/Thesis Grid --- */}
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

              {/* --- OJT Grid --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InfoItem label="OJT Year" value={accountData.ojtYear} />
                 <InfoItem label="OJT Semester" value={accountData.ojtSemester} />
              </div>

              {/* --- Read-only file display --- */}
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
          <Button
            type="button"
            variant="primary"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-2" />
            REJECT
          </Button>
          <Button
            type="button"
            variant="primary"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleVerify}
          >
            <Check className="h-4 w-4 mr-2" />
            VERIFY
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}