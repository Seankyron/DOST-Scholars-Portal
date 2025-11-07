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
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
  YEAR_LEVELS,
  SEMESTERS,
  PROVINCES,
} from '@/lib/utils/constants';

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
    url: string; // This should be the public URL from storage
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

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
          {/* --- Account Information --- */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="text-lg font-medium text-dost-title px-1">
              Account Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SPAS ID / Scholar ID"
                value={accountData.scholarId || 'N/A'}
                disabled
              />
              <Input label="Email" value={accountData.email || 'N/A'} disabled />
              {/* Password field is intentionally omitted */}
            </div>
          </fieldset>

          {/* --- Personal Information --- */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="text-lg font-medium text-dost-title px-1">
              Personal Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="First Name"
                value={accountData.firstName}
                disabled
              />
              <Input
                label="Middle Name"
                value={accountData.middleName || 'N/A'}
                disabled
              />
              <Input label="Surname" value={accountData.surname} disabled />
              <Input
                label="Suffix"
                value={accountData.suffix || 'N/A'}
                disabled
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Contact Number"
                value={accountData.contactNumber}
                disabled
              />
              <Input
                label="Date of Birth"
                value={accountData.dateOfBirth}
                disabled
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Province"
                options={provinceOptions}
                value={accountData.addressProvince}
                disabled
              />
              <Input
                label="City / Municipality"
                value={accountData.addressCity}
                disabled
              />
            </div>
            <Input
              label="Barangay, Street, House/Unit No."
              value={accountData.addressBrgy}
              disabled
            />
          </fieldset>

          {/* --- Curriculum & Scholarship --- */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="text-lg font-medium text-dost-title px-1">
              Curriculum & Scholarship
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Scholarship Type"
                options={scholarshipOptions}
                value={accountData.scholarshipType}
                disabled
              />
              <Input
                label="Year Awarded"
                value={accountData.yearAwarded}
                disabled
              />
              <Select
                label="School / University"
                options={universityOptions}
                value={accountData.university}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Program / Course" value={accountData.program} disabled />
              <Select
                label="Duration of Course"
                options={durationOptions}
                value={accountData.courseDuration}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="space-y-4">
                <Select
                  label="OJT Year"
                  options={yearOptions}
                  value={accountData.ojtYear}
                  disabled
                />
                <Select
                  label="OJT Semester"
                  options={semesterOptions}
                  value={accountData.ojtSemester}
                  disabled
                />
              </div>
            </div>

            {/* Read-only file display */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5">
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
          </fieldset>
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