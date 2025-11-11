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
import { Select } from '@/components/ui/select';
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

interface EditScholarModalProps {
  scholar: ScholarRowData;
  onUpdate: (updatedScholar: ScholarRowData) => Promise<void>; // Make async
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
  // We'll handle file uploads separately if needed
  // const [newCurriculumFile, setNewCurriculumFile] = useState<File | null>(null);

  useEffect(() => {
    // Re-populate form when the scholar prop changes
    setFormData({ ...scholar });
  }, [scholar, open]); // Add 'open' to reset on re-open

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: keyof ScholarRowData,
    checked: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add file upload logic here if newCurriculumFile is set
    // 1. Upload new file to storage
    // 2. Get the new file_key
    // 3. Update formData.curriculumFile
    
    await onUpdate(formData); // Call the async function from the page
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

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Edit Scholar: {scholar.firstName} {scholar.surname}</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
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
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Contact Number"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                 <Input
                  label="SPAS ID"
                  name="scholarId"
                  value={formData.scholarId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Province"
                  name="addressProvince"
                  value={formData.addressProvince}
                  onChange={handleChange}
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
                <Select
                  label="Scholarship Type"
                  name="scholarshipType"
                  value={formData.scholarshipType}
                  onChange={handleChange}
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
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="University"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
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
                <Select
                  label="Duration of Course"
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleChange}
                  options={[
                    { value: '4', label: '4 Years' },
                    { value: '5', label: '5 Years' },
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Midyear Classes
                  </label>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      label="1st Year"
                      checked={formData.midyear1stYear}
                      onCheckedChange={(c) => handleCheckboxChange('midyear1stYear', !!c)}
                    />
                    <Checkbox
                      label="2nd Year"
                      checked={formData.midyear2ndYear}
                      onCheckedChange={(c) => handleCheckboxChange('midyear2ndYear', !!c)}
                    />
                    <Checkbox
                      label="3rd Year"
                      checked={formData.midyear3rdYear}
                      onCheckedChange={(c) => handleCheckboxChange('midyear3rdYear', !!c)}
                    />
                    <Checkbox
                      label="4th Year"
                      checked={formData.midyear4thYear}
                      onCheckedChange={(c) => handleCheckboxChange('midyear4thYear', !!c)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thesis
                  </label>
                  {/* Simplified to Select for easier state management */}
                  <Select
                    label="Thesis Year"
                    name="thesisYear"
                    value={
                      (formData.thesis1stYear && '1') ||
                      (formData.thesis2ndYear && '2') ||
                      (formData.thesis3rdYear && '3') ||
                      (formData.thesis4thYear && '4') || ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        thesis1stYear: val === '1',
                        thesis2ndYear: val === '2',
                        thesis3rdYear: val === '3',
                        thesis4thYear: val === '4',
                      }))
                    }}
                    options={thesisYearOptions}
                    placeholder="Select Thesis Year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="OJT Year"
                  name="ojtYear"
                  value={formData.ojtYear}
                  onChange={handleChange}
                  options={yearOptions.slice(0, 5)} // 1st-5th Year
                  required
                />
                <Select
                  label="OJT Semester"
                  name="ojtSemester"
                  value={formData.ojtSemester}
                  onChange={handleChange}
                  options={semesterOptions}
                  required
                />
              </div>

              <FileUpload
                label="Upload New Curriculum (PDF)"
                onChange={(file) => {
                  // setNewCurriculumFile(file);
                  alert('File upload logic is not yet implemented.');
                }}
                accept="application/pdf"
              />
              <p className="text-sm text-gray-500">
                Current file: {scholar.curriculumFile?.name || 'None'}
              </p>
            </fieldset>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
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
        </form>
      </ModalContent>
    </Modal>
  );
}