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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';

interface ViewScholarModalProps {
  scholar: ScholarRowData;
  onClose: () => void;
  open: boolean;
}

const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="mb-4 break-words">
    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
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

  const thesisYear =
    (scholar.thesis1stYear && '1st Year') ||
    (scholar.thesis2ndYear && '2nd Year') ||
    (scholar.thesis3rdYear && '3rd Year') ||
    (scholar.thesis4thYear && '4th Year') ||
    'N/A';

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>Scholar Details: {fullName}</ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* --- Column 1: Scholar Information --- */}
            <div className="md:border-r md:pr-6 md:border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-dost-title mb-2">
                Scholar Information
              </h3>
              <InfoRow label="Full Name" value={fullName} />
              <InfoRow label="SPAS ID" value={scholar.scholarId} />
              <InfoRow label="Email" value={scholar.email} />
              <InfoRow label="Contact Number" value={scholar.contactNumber} />
              <InfoRow label="Date of Birth" value={scholar.dateOfBirth} />
              <InfoRow label="Status" value={scholar.status} />
              <InfoRow label="Full Address" value={fullAddress} />
            </div>

            {/* --- Column 2: Study Placement --- */}
            <div className="md:border-r md:pr-6 md:border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-dost-title mb-2">
                Year of Award and Study Placement
              </h3>
              <InfoRow
                label="Scholarship Type"
                value={scholar.scholarshipType}
              />
              <InfoRow label="Batch / Year Awarded" value={scholar.yearAwarded} />
              <InfoRow label="School / University" value={scholar.university} />
              <InfoRow label="Program / Course" value={scholar.program} />
              <InfoRow label="Current Year Level" value={scholar.yearLevel} />
            </div>

            {/* --- Column 3: Curriculum Information --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dost-title mb-2">
                Curriculum Information
              </h3>
              <InfoRow
                label="Duration of Course"
                value={`${scholar.courseDuration} Years`}
              />

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {/* Midyear Checkboxes */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Midyear Classes
                  </Label>
                  <div className="flex flex-col gap-2 mt-2">
                    <Checkbox
                      label="1st Year"
                      checked={scholar.midyear1stYear}
                      disabled
                    />
                    <Checkbox
                      label="2nd Year"
                      checked={scholar.midyear2ndYear}
                      disabled
                    />
                    <Checkbox
                      label="3rd Year"
                      checked={scholar.midyear3rdYear}
                      disabled
                    />
                    <Checkbox
                      label="4th Year"
                      checked={scholar.midyear4thYear}
                      disabled
                    />
                  </div>
                </div>
                {/* Thesis Checkboxes */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Thesis in Curriculum
                  </Label>
                  <div className="flex flex-col gap-2 mt-2">
                    <Checkbox
                      label="1st Year"
                      checked={scholar.thesis1stYear}
                      disabled
                    />
                    <Checkbox
                      label="2nd Year"
                      checked={scholar.thesis2ndYear}
                      disabled
                    />
                    <Checkbox
                      label="3rd Year"
                      checked={scholar.thesis3rdYear}
                      disabled
                    />
                    <Checkbox
                      label="4th Year"
                      checked={scholar.thesis4thYear}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* OJT Info */}
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="OJT Year" value={scholar.ojtYear} />
                <InfoRow label="OJT Semester" value={scholar.ojtSemester} />
              </div>

              {/* Curriculum File */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1.5 mt-4">
                  Course Curriculum (PDF)
                </Label>
                {scholar.curriculumFile?.url ? (
                  <a
                    href={scholar.curriculumFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-300 text-blue-600 hover:text-blue-800 hover:bg-gray-100"
                  >
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">
                      {scholar.curriculumFile.name}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-300 text-gray-500">
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">
                      {scholar.curriculumFile?.name || 'No file available'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        {/* --- END OF MODIFIED BODY --- */}

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}