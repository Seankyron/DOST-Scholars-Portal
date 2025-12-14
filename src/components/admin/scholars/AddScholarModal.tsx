'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// CHANGE: Import SelectInput instead of Select
import { SelectInput } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import {
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
  YEAR_LEVELS,
  SEMESTERS,
  PROVINCES,
} from '@/lib/utils/constants';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';

const initialState = {
  scholarId: '',
  email: '',
  password: '',
  firstName: '',
  middleName: '',
  surname: '',
  suffix: '',
  contactNumber: '+63',
  dateOfBirth: '',
  addressProvince: '',
  addressCity: '',
  addressBarangay: '',
  scholarshipType: '',
  yearAwarded: '',
  university: '',
  program: '',
  courseDuration: '4',
  midyearClasses: { '1': false, '2': false, '3': false, '4': false },
  thesisYear: '',
  ojtYear: '',
  ojtSemester: '',
  scholarship_status: 'Active',
};

export function AddScholarModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialState);
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // --- Handlers ---
  
  // For standard HTML Inputs (Input, Checkbox that emits event)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // NEW: Specific handler for SelectInput which returns { target: { value } } but NO name
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMidyearChange = (year: string) => {
    setFormData((prev) => ({
      ...prev,
      midyearClasses: {
        ...prev.midyearClasses,
        [year]: !prev.midyearClasses[year as keyof typeof prev.midyearClasses],
      },
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setCurriculumFile(file);
      // Removed duplicate setCurriculumFile(file)
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!curriculumFile) {
      setError('Course Curriculum (PDF) is required.');
      return;
    }
    
    if (!formData.scholarId || !formData.email || !formData.password || !formData.firstName || !formData.surname) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsConfirmOpen(true);
  };
  
  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false); 
    setLoading(true);
    setError(null);

    try {
      const submissionData = new FormData();
      submissionData.append('curriculumFile', curriculumFile as File);
      submissionData.append('scholarData', JSON.stringify(formData));

      const response = await fetch('/api/admin/create-scholar', {
        method: 'POST',
        body: submissionData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create scholar');
      }

      toast.success('Scholar added successfully!'); 
      setFormData(initialState); 
      setCurriculumFile(null);
      setIsModalOpen(false); 
      
      window.location.reload(); 
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An unknown error occurred.');    
    } finally {
      setLoading(false);
    }
  };

  // --- Options ---
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
    <>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Scholar
          </Button>
        </ModalTrigger>

        <ModalContent size="3xl">
          <ModalHeader>
            <ModalTitle>Add New Scholar</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <form id="add-scholar-form" onSubmit={handleFormSubmit} className="space-y-6">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* --- Account Information --- */}
              <fieldset className="space-y-4 p-4 border rounded-md">
                <legend className="text-lg font-medium text-dost-title px-1">
                  Account Information
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="SPAS ID / Scholar ID"
                    name="scholarId"
                    value={formData.scholarId}
                    onChange={handleChange}
                    placeholder="YYYY-XXXX"
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                  />
                  <Input
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Min. 8 characters"
                    required
                  />
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
                    placeholder="e.g. Jr., III"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+63"
                    required
                  />
                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    type="date"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CHANGED: Use SelectInput and handleSelectChange */}
                  <SelectInput
                    label="Province"
                    value={formData.addressProvince}
                    onChange={(e) => handleSelectChange('addressProvince', e.target.value)}
                    options={provinceOptions}
                    placeholder="Select Province"
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
                  name="addressBarangay"
                  value={formData.addressBarangay}
                  onChange={handleChange}
                  placeholder="e.g., Brgy. San Juan, 123 Rizal St."
                  required
                />
              </fieldset>

              {/* --- Curriculum & Scholarship --- */}
              <fieldset className="space-y-4 p-4 border rounded-md">
                <legend className="text-lg font-medium text-dost-title px-1">
                  Curriculum & Scholarship
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectInput
                    label="Scholarship Type"
                    value={formData.scholarshipType}
                    onChange={(e) => handleSelectChange('scholarshipType', e.target.value)}
                    options={scholarshipOptions}
                    placeholder="Select Scholarship Type"
                    required
                  />
                  <Input
                    label="Year Awarded"
                    name="yearAwarded"
                    value={formData.yearAwarded}
                    onChange={handleChange}
                    type="number"
                    placeholder="YYYY"
                    required
                  />
                  <SelectInput
                    label="School / University"
                    value={formData.university}
                    onChange={(e) => handleSelectChange('university', e.target.value)}
                    options={universityOptions}
                    placeholder="Select University"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Program / Course"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                  />
                  <SelectInput
                    label="Duration of Course"
                    value={formData.courseDuration}
                    onChange={(e) => handleSelectChange('courseDuration', e.target.value)}
                    options={[
                      { value: '4', label: '4 Years' },
                      { value: '5', label: '5 Years' },
                    ]}
                    placeholder="Select Duration"
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
                        checked={formData.midyearClasses['1']}
                        onChange={() => handleMidyearChange('1')}
                      />
                      <Checkbox
                        label="2nd Year"
                        checked={formData.midyearClasses['2']}
                        onChange={() => handleMidyearChange('2')}
                      />
                      <Checkbox
                        label="3rd Year"
                        checked={formData.midyearClasses['3']}
                        onChange={() => handleMidyearChange('3')}
                      />
                      <Checkbox
                        label="4th Year"
                        checked={formData.midyearClasses['4']}
                        onChange={() => handleMidyearChange('4')}
                      />
                    </div>
                  </div>
                  <div>
                    <SelectInput
                      label="Thesis in Curriculum"
                      value={formData.thesisYear}
                      onChange={(e) => handleSelectChange('thesisYear', e.target.value)}
                      options={thesisYearOptions}
                      placeholder="Select Thesis Year"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectInput
                    label="OJT Year"
                    value={formData.ojtYear}
                    onChange={(e) => handleSelectChange('ojtYear', e.target.value)}
                    options={yearOptions.slice(0, 5)}
                    placeholder="Select OJT Year"
                    required
                  />
                  <SelectInput
                    label="OJT Semester"
                    value={formData.ojtSemester}
                    onChange={(e) => handleSelectChange('ojtSemester', e.target.value)}
                    options={semesterOptions}
                    placeholder="Select OJT Semester"
                    required
                  />
                </div>

                <FileUpload
                  label="Course Curriculum (PDF)"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  required
                />

                <SelectInput
                  label="Initial Status"
                  value={formData.scholarship_status}
                  onChange={(e) => handleSelectChange('scholarship_status', e.target.value)}
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
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              form="add-scholar-form" 
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'ADD SCHOLAR'
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm New Scholar"
        description={`Are you sure you want to create an account for ${formData.firstName} ${formData.surname} with ID ${formData.scholarId}?`}
        variant="info"
        confirmText="Yes, create account"
        isLoading={loading}
      />
    </>
  );
}