'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

export function AddScholarModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Handle file state here, e.g., setFormData
      console.log(file.name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to submit form data
    alert('Scholar added!');
    setIsModalOpen(false);
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

  // --- Options based on constants.ts ---
  const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }));
  const scholarshipOptions = SCHOLARSHIP_TYPES.map((s) => ({
    value: s,
    label: s,
  }));
  const universityOptions = UNIVERSITIES.map((u) => ({ value: u, label: u }));
  const yearOptions = YEAR_LEVELS.map((y) => ({ value: y, label: y }));
  const semesterOptions = SEMESTERS.map((s) => ({ value: s, label: s }));

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <ModalTrigger asChild>
        <Button variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Scholar
        </Button>
      </ModalTrigger>

      <ModalContent size="4xl">
        <form onSubmit={handleFormSubmit}>
          <ModalHeader>
            <ModalTitle>Add New Scholar</ModalTitle>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            {/* --- Account Information --- */}
            <fieldset className="space-y-4 p-4 border rounded-md">
              <legend className="text-lg font-medium text-dost-title px-1">
                Account Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="SPAS ID / Scholar ID"
                  placeholder="YYYY-XXXX"
                  required
                />
                <Input label="Email" type="email" required />
                <Input
                  label="Password"
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
                <Input label="First Name" required />
                <Input label="Middle Name" />
                <Input label="Surname" required />
                <Input label="Suffix" placeholder="e.g. Jr., III" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Contact Number"
                  type="tel"
                  placeholder="+63"
                  required
                />
                <Input label="Date of Birth" type="date" required />
              </div>
              {/* --- Address Fields from Signup --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Province"
                  options={provinceOptions}
                  placeholder="Select Province"
                  required
                />
                <Input label="City / Municipality" required />
              </div>
              <Input
                label="Barangay, Street, House/Unit No."
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
                <Select
                  label="Scholarship Type"
                  options={scholarshipOptions}
                  placeholder="Select Scholarship Type"
                  required
                />
                <Input
                  label="Year Awarded"
                  type="number"
                  placeholder="YYYY"
                  required
                />
                <Select
                  label="School / University"
                  options={universityOptions}
                  placeholder="Select University"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Program / Course" required />
                <Select
                  label="Duration of Course"
                  options={[
                    { value: '4', label: '4 Years' },
                    { value: '5', label: '5 Years' },
                  ]}
                  placeholder="Select Duration"
                  required
                />
              </div>

              {/* --- MODIFIED GRID --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Midyear Classes
                  </Label>
                  <div className="flex flex-col gap-2">
                    <Checkbox label="1st Year" />
                    <Checkbox label="2nd Year" />
                    <Checkbox label="3rd Year" />
                    <Checkbox label="4th Year" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Thesis in Curriculum
                  </Label>
                  <div className="flex flex-col gap-2">
                    <Checkbox label="1st Year" />
                    <Checkbox label="2nd Year" />
                    <Checkbox label="3rd Year" />
                    <Checkbox label="4th Year" />
                  </div>
                </div>
              </div>

              {/* --- NEW GRID FOR OJT --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="OJT Year"
                  options={yearOptions.slice(0, 4)} // Only 1st-4th Year
                  placeholder="Select OJT Year"
                  required
                />
                <Select
                  label="OJT Semester"
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

              <Select
                label="Initial Status"
                options={statusOptions}
                placeholder="Select Status"
                required
              />
            </fieldset>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              ADD SCHOLAR
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}