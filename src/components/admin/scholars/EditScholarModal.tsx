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
import { FileUpload } from '@/components/ui/file-upload';
import { SCHOLARSHIP_TYPES, UNIVERSITIES, YEAR_LEVELS, SEMESTERS, PROVINCES } from '@/lib/utils/constants';
import type { Scholar } from './ScholarRow';

interface EditScholarModalProps {
    scholar: Scholar;
    onUpdate: (updatedScholar: Scholar) => void;
    onClose: () => void;
    open: boolean;
}

export function EditScholarModal({ scholar, onUpdate, onClose, open }: EditScholarModalProps) {
    const [formData, setFormData] = useState<Scholar>({ ...scholar });

    useEffect(() => {
        setFormData({ ...scholar });
    }, [scholar]);

    const handleChange = (field: keyof Scholar, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    const statusOptions = ['Active', 'Warning', '2nd Warning', 'Suspended', 'Graduated', 'Terminated', 'On hold'];
    const provinceOptions = PROVINCES.map(p => ({ value: p, label: p }));
    const scholarshipOptions = SCHOLARSHIP_TYPES.map(s => ({ value: s, label: s }));
    const universityOptions = UNIVERSITIES.map(u => ({ value: u, label: u }));
    const yearOptions = YEAR_LEVELS.map(y => ({ value: y, label: y }));
    const semesterOptions = SEMESTERS.map(s => ({ value: s, label: s }));

    return (
        <Modal open={open} onOpenChange={onClose}>
            <ModalContent size="4xl">
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>Edit Scholar</ModalTitle>
                    </ModalHeader>

                    <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
                        {/* Personal Information */}
                        <fieldset className="space-y-4 p-4 border rounded-md">
                            <legend className="text-lg font-medium text-dost-title px-1">Personal Information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input label="Name" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
                                <Input label="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
                                <Input label="SPAS ID" value={formData.scholarId} onChange={e => handleChange('scholarId', e.target.value)} required />
                                <Input label="Program / Course" value={formData.program} onChange={e => handleChange('program', e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <Select label="Scholarship Type" options={scholarshipOptions} value={formData.scholarshipType} onChange={v => handleChange('scholarshipType', v)} required />
                                <Select label="University" options={universityOptions} value={formData.university} onChange={v => handleChange('university', v)} required />
                                <Select label="Year Level" options={yearOptions} value={formData.yearLevel} onChange={v => handleChange('yearLevel', v)} required />
                            </div>
                        </fieldset>

                        {/* Status & Curriculum */}
                        <fieldset className="space-y-4 p-4 border rounded-md">
                            <legend className="text-lg font-medium text-dost-title px-1">Status & Curriculum</legend>
                            <Select label="Status" options={statusOptions.map(s => ({ value: s, label: s }))} value={formData.status} onChange={v => handleChange('status', v)} required />
                            <FileUpload label="Upload Curriculum (PDF)" onChange={file => handleChange('curriculumFile' as keyof Scholar, file)} accept="application/pdf" />
                        </fieldset>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
