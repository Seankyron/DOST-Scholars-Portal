'use client';

// --- MODIFIED: Import the correct type ---
import { type ScholarRowData } from './ScholarRow';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalBody,
} from '@/components/ui/modal';

interface ViewScholarModalProps {
  scholar: ScholarRowData;
  onClose: () => void;
  open: boolean;
}

// --- NEW: Helper component for displaying info ---
const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
  </div>
);

export function ViewScholarModal({
  scholar,
  onClose,
  open,
}: ViewScholarModalProps) {
  const fullName = [
    scholar.firstName,
    scholar.middleName,
    scholar.surname,
    scholar.suffix,
  ]
    .filter(Boolean)
    .join(' ');
  
  const fullAddress = [
    scholar.addressBrgy,
    scholar.addressCity,
    scholar.addressProvince,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>Scholar Details</ModalTitle>
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* --- Personal Information --- */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="text-lg font-medium text-dost-title px-1">
              Personal Information
            </legend>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <InfoRow label="Full Name" value={fullName} />
              <InfoRow label="SPAS ID" value={scholar.scholarId} />
              <InfoRow label="Email" value={scholar.email} />
              <InfoRow label="Contact Number" value={scholar.contactNumber} />
              <InfoRow label="Date of Birth" value={scholar.dateOfBirth} />
              <InfoRow label="Status" value={scholar.status} />
              <div className="md:col-span-2">
                <InfoRow label="Address" value={fullAddress} />
              </div>
            </dl>
          </fieldset>

          {/* --- Scholarship Details --- */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="text-lg font-medium text-dost-title px-1">
              Scholarship Details
            </legend>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <InfoRow
                label="Scholarship Type"
                value={scholar.scholarshipType}
              />
              <InfoRow label="Year Awarded" value={scholar.yearAwarded} />
              <InfoRow label="University" value={scholar.university} />
              <InfoRow label="Program" value={scholar.program} />
              <InfoRow label="Course Duration" value={scholar.courseDuration} />
              <InfoRow label="Year Level" value={scholar.yearLevel} />
              <InfoRow label="OJT" value={`${scholar.ojtYear}, ${scholar.ojtSemester}`} />
              <InfoRow
                label="Thesis"
                value={
                  scholar.thesis1stYear ? '1st Year' :
                  scholar.thesis2ndYear ? '2nd Year' :
                  scholar.thesis3rdYear ? '3rd Year' :
                  scholar.thesis4thYear ? '4th Year' : 'N/A'
                }
              />
            </dl>
          </fieldset>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}