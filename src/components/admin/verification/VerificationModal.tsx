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
import { Check, X, FileText } from 'lucide-react';

/**
 * A small helper component to render the "Label" and "Value" pairs
 * consistently, as seen in the PDF mockup.
 */
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mb-4 break-words">
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );
}

/**
 * Helper to format year numbers into ordinal strings (1st, 2nd, etc.)
 */
const formatYear = (year: number) => {
  if (year === 1) return '1st Year';
  if (year === 2) return '2nd Year';
  if (year === 3) return '3rd Year';
  if (year === 4) return '4th Year';
  if (year === 5) return '5th Year';
  return `${year}th Year`;
};

// This interface should match the `FormData` from the signup page
interface AccountData {
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
    url: string; // Assuming 'url' is available after upload
  };
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountData?: AccountData;
}

export function VerificationModal({
  isOpen,
  onClose,
  accountData,
}: VerificationModalProps) {
  if (!accountData) return null;

  // --- Process data for display ---
  const name = [
    accountData.firstName,
    accountData.middleName,
    accountData.surname,
    accountData.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const address = [
    accountData.addressBrgy,
    accountData.addressCity,
    accountData.addressProvince,
  ]
    .filter(Boolean)
    .join(', ');

  // Process boolean flags into a readable string
  const midyearYears: number[] = [];
  if (accountData.midyear1stYear) midyearYears.push(1);
  if (accountData.midyear2ndYear) midyearYears.push(2);
  if (accountData.midyear3rdYear) midyearYears.push(3);
  if (accountData.midyear4thYear) midyearYears.push(4);
  const midyearDisplay =
    midyearYears.length > 0
      ? midyearYears.map(formatYear).join(', ')
      : 'None';

  // Find the single thesis year
  let thesisYear = 0;
  if (accountData.thesis1stYear) thesisYear = 1;
  else if (accountData.thesis2ndYear) thesisYear = 2;
  else if (accountData.thesis3rdYear) thesisYear = 3;
  else if (accountData.thesis4thYear) thesisYear = 4;
  const thesisDisplay = thesisYear > 0 ? formatYear(thesisYear) : 'N/A';

  const ojtDisplay = `${formatYear(parseInt(accountData.ojtYear))}, ${
    accountData.ojtSemester
  }`;
  
  const durationDisplay = `${accountData.courseDuration} years`;
  
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
    // --- FIX: Changed `isOpen` to `open` ---
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>Account Verification</ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* --- Column 1: Scholar Information --- */}
            <div className="md:border-r md:pr-6 md:border-gray-200">
              <h3 className="text-lg font-semibold text-dost-title mb-4">
                Scholar Information
              </h3>
              <InfoItem label="Name" value={name} />
              <InfoItem label="SPAS ID" value={accountData.scholarId} />
              <InfoItem label="Email" value={accountData.email} />
              <InfoItem label="Contact Number" value={accountData.contactNumber} />
              <InfoItem label="Date of Birth" value={accountData.dateOfBirth} />
              <InfoItem label="Complete Address" value={address} />
            </div>

            {/* --- Column 2: Study Placement --- */}
            <div className="md:border-r md:pr-6 md:border-gray-200">
              <h3 className="text-lg font-semibold text-dost-title mb-4">
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
            <div>
              <h3 className="text-lg font-semibold text-dost-title mb-4">
                Curriculum Information
              </h3>
              <InfoItem
                label="Duration of Course"
                value={durationDisplay}
              />
              <InfoItem
                label="Midyear Classes"
                value={midyearDisplay}
              />
              <InfoItem label="Thesis in Curriculum" value={thesisDisplay} />
              <InfoItem label="Year and Semester of OJT" value={ojtDisplay} />
              <InfoItem
                label="Course Curriculum"
                value={
                  curriculumFileUrl ? (
                    <a
                      href={curriculumFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{curriculumFileName}</span>
                    </a>
                  ) : (
                    <p className="flex items-center gap-2 text-gray-600">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{curriculumFileName}</span>
                    </p>
                  )
                }
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="primary"
            className="bg-red-600 hover:bg-red-700" // Red color from PDF
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-2" />
            REJECT
          </Button>
          <Button
            type="button"
            variant="primary"
            className="bg-green-600 hover:bg-green-700" // Green color from PDF
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