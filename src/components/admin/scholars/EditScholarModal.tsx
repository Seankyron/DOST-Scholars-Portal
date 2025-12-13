'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
// CHANGE 1: Import FormSelect instead of Select
import { FormSelect } from '@/components/ui/form-select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import {
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
  YEAR_LEVELS,
  SEMESTERS,
  PROVINCES,
} from '@/lib/utils/constants';
import type { ScholarRowData } from './ScholarRow';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface EditScholarModalProps {
  scholar: ScholarRowData;
  onUpdate: (updatedScholar: ScholarRowData) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

export function EditScholarModal({
  scholar,
  onUpdate,
  onClose,
  open,
}: EditScholarModalProps) {
  const [formData, setFormData] = useState<ScholarRowData>({ ...scholar });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...scholar });
  }, [scholar, open]);

  // Handler for standard Inputs (text, date, number)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CHANGE 2: Helper for FormSelect components (which return value string directly)
  const handleSelectChange = (name: keyof ScholarRowData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: keyof ScholarRowData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add file upload logic here

    await onUpdate(formData);
    setLoading(false);
  };

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Warning', label: 'Warning' },
    { value: '2nd Warning', label: '2nd Warning' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Graduated', label: 'Graduated' },
    { value: 'Terminated', label: 'Terminated' },
    { value: 'On hold', label: 'On hold' },
  ];
  const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }));
  const scholarshipOptions = SCHOLARSHIP_TYPES.map((s) => ({
    value: s,
    label: s,
  }));
  const universityOptions = UNIVERSITIES.map((u) => ({ value: u, label: u }));
  const yearOptions = YEAR_LEVELS.map((y) => ({ value: y, label: y }));
  const semesterOptions = SEMESTERS.map((s) => ({ value: s, label: s }));
  const thesisYearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
    { value: '5', label: '5th Year' },
  ];
  const durationOptions = [
    { value: '4', label: '4 Years' },
    { value: '5', label: '5 Years' },
  ];

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const fileKey = String(scholar.curriculumFile?.name || ''); 
  const fileUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${fileKey}.pdf`;

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>
            Edit Scholar: {scholar.firstName} {scholar.surname}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <form
            id="edit-scholar-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Personal Information */}
            <fieldset className="space-y-4 p-4 border rounded-md">
              <legend className="text-lg font-medium text-dost-title px-1">
                Personal Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
                <Input
                  label="Surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Suffix"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Number"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CHANGE 3: Used FormSelect and handleSelectChange */}
                <FormSelect
                  label="Province"
                  value={formData.addressProvince}
                  onChange={(val) => handleSelectChange('addressProvince', val)}
                  options={provinceOptions}
                  required
                />
                <Input
                  label="City / Municipality"
                  name="addressCity"
                  value={formData.addressCity}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                label="Barangay, Street, House/Unit No."
                name="addressBrgy"
                value={formData.addressBrgy}
                onChange={handleChange}
                required
              />
            </fieldset>

            {/* Scholarship & Curriculum */}
            <fieldset className="space-y-4 p-4 border rounded-md">
              <legend className="text-lg font-medium text-dost-title px-1">
                Scholarship & Curriculum
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect
                  label="Scholarship Type"
                  value={formData.scholarshipType}
                  onChange={(val) => handleSelectChange('scholarshipType', val)}
                  options={scholarshipOptions}
                  required
                />
                <Input
                  label="Year Awarded"
                  name="yearAwarded"
                  type="number"
                  value={formData.yearAwarded}
                  onChange={handleChange}
                  required
                />
                <FormSelect
                  label="Status"
                  value={formData.status}
                  onChange={(val) => handleSelectChange('status', val)}
                  options={statusOptions}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect
                  label="University"
                  value={formData.university}
                  onChange={(val) => handleSelectChange('university', val)}
                  options={universityOptions}
                  required
                />
                <Input
                  label="Program / Course"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                />
                <FormSelect
                  label="Duration of Course"
                  value={formData.courseDuration}
                  onChange={(val) => handleSelectChange('courseDuration', val)}
                  options={durationOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Midyear Classes
                  </Label>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      label="1st Year"
                      checked={formData.midyear1stYear}
                      onChange={(e) =>
                        handleCheckboxChange('midyear1stYear', e)
                      }
                    />
                    <Checkbox
                      label="2nd Year"
                      checked={formData.midyear2ndYear}
                      onChange={(e) =>
                        handleCheckboxChange('midyear2ndYear', e)
                      }
                    />
                    <Checkbox
                      label="3rd Year"
                      checked={formData.midyear3rdYear}
                      onChange={(e) =>
                        handleCheckboxChange('midyear3rdYear', e)
                      }
                    />
                    <Checkbox
                      label="4th Year"
                      checked={formData.midyear4thYear}
                      onChange={(e) =>
                        handleCheckboxChange('midyear4thYear', e)
                      }
                    />
                  </div>
                </div>
                <div>
                  <FormSelect
                    label="Thesis in Curriculum"
                    value={
                      (formData.thesis1stYear && '1') ||
                      (formData.thesis2ndYear && '2') ||
                      (formData.thesis3rdYear && '3') ||
                      (formData.thesis4thYear && '4') ||
                      ''
                    }
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        thesis1stYear: val === '1',
                        thesis2ndYear: val === '2',
                        thesis3rdYear: val === '3',
                        thesis4thYear: val === '4',
                      }));
                    }}
                    options={thesisYearOptions}
                    placeholder="Select Thesis Year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="OJT Year"
                  value={formData.ojtYear}
                  onChange={(val) => handleSelectChange('ojtYear', val)}
                  options={yearOptions.slice(0, 5)}
                  required
                />
                <FormSelect
                  label="OJT Semester"
                  value={formData.ojtSemester}
                  onChange={(val) => handleSelectChange('ojtSemester', val)}
                  options={semesterOptions}
                  required
                />
              </div>

              <FileUpload
                label="Upload New Curriculum (PDF)"
                onChange={(file) => {
                  alert('File upload logic is not yet implemented.');
                }}
                accept="application/pdf"
              />
              <a 
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer">
                <p className="text-sm text-gray-500">
                  Current file: {scholar.scholarId} - Curriculum File.pdf
                </p>
              </a>

              <FormSelect
                label="Initial Status"
                value={formData.status}
                onChange={(val) => handleSelectChange('status', val)}
                options={statusOptions}
                placeholder="Select Status"
                required
              />

            </fieldset>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            form="edit-scholar-form" 
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}