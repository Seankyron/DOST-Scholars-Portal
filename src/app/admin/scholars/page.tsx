'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScholarFilters } from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Plus, Upload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';

export default function ScholarManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) alert(`File "${file.name}" selected!`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-dost-title">Scholar Management</h1>

            {/* Filters Section */}
            <ScholarFilters />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".csv, .xlsx, .xls"
                    />

                    <Button variant="outline" size="sm" onClick={handleUploadClick}>
                        <Upload className="h-4 w-4 mr-2" />
                        Export
                    </Button>

                    {/* Add Scholar Dialog */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="primary" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Scholar
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="w-[50vw] max-w-[1200px] sm:max-w-[1200px] lg:max-w-[1400px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center text-blue-700">
                                    Add Scholar
                                </DialogTitle>
                            </DialogHeader>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert('Scholar added!');
                                    setOpen(false);
                                }}
                                className="space-y-4"
                            >
                                {/* First Row */}
                                <div className="grid grid-cols-4 gap-3">
                                    <div>
                                        <Label>First Name *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>Middle Name</Label>
                                        <Input />
                                    </div>
                                    <div>
                                        <Label>Surname *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>Suffix</Label>
                                        <Input />
                                    </div>
                                </div>

                                {/* Second Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label>Contact Number *</Label>
                                        <Input
                                            type="tel"
                                            placeholder="+63"
                                            required
                                            maxLength={12}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, ''); // remove non-numeric chars
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Date of Birth</Label>
                                        <Input type="date" />
                                    </div>
                                    <div>
                                        <Label>Complete Address</Label>
                                        <Input />
                                    </div>
                                </div>

                                {/* Third Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label>Scholarship Type *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>Year Awarded *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>School / University *</Label>
                                        <Input required />
                                    </div>
                                </div>

                                {/* Fourth Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Program / Course *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>Midyear Classes in the Curriculum *</Label>
                                        <div className="flex flex-wrap gap-3 mt-1">
                                            {['1st', '2nd', '3rd', '4th'].map((year) => (
                                                <label key={year} className="flex items-center gap-1">
                                                    <input type="radio" name="midyear" value={year} required />
                                                    {year} Year
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Fifth Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Duration of Course *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>Thesis in the Curriculum *</Label>
                                        <div className="flex flex-wrap gap-3 mt-1">
                                            {['1st', '2nd', '3rd', '4th'].map((year) => (
                                                <label key={year} className="flex items-center gap-1">
                                                    <input type="radio" name="thesis" value={year} required />
                                                    {year} Year
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sixth Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Year and Semester of OJT *</Label>
                                        <Input required />
                                    </div>
                                    <div>
                                        <Label>Course Curriculum (PDF) *</Label>
                                        <div
                                            className="border border-dashed border-gray-300 rounded-md p-3 text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                                            onClick={handleUploadClick}
                                        >
                                            Click or drag to upload a file
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="application/pdf"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Last Row */}
                                <div className="flex justify-between items-center mt-4">
                                    <select className="border border-gray-300 rounded-md p-2 text-sm">
                                        <option value="">Select Status</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>

                                    <Button type="submit" className="bg-blue-600 text-white">
                                        ADD SCHOLAR
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <SearchInput
                    placeholder="Search scholars..."
                    onSearch={(query) => setSearchTerm(query)}
                    className="w-full sm:max-w-xs"
                />
            </div>

            {/* Table Section */}
            <ScholarTable />
        </div>
    );
}
