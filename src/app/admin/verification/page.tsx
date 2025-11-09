'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import { VerificationTable } from '@/components/admin/verification/VerificationTable';
import { Check, X } from 'lucide-react';
import { SCHOLARSHIP_TYPES, UNIVERSITIES } from '@/lib/utils/constants';

export default function VerificationPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const scholarshipOptions = [
        { value: 'All', label: 'All Type' },
        ...SCHOLARSHIP_TYPES.map((s) => ({ value: s, label: s })),
    ];

    const universityOptions = [
        { value: 'All', label: 'All Universities' },
        ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
    ];

    const courseOptions = [{ value: 'All', label: 'All Courses' }];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-dost-title">
                Account Verification
            </h1>

            {/* Filters Section */}
            <div className="bg-white rounded-t-lg shadow-md p-4 mb-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end">
                    <Select
                        label="Scholarship Type"
                        options={scholarshipOptions}
                        defaultValue="All"
                        className="w-full"
                    />
                    <Select
                        label="Course"
                        options={courseOptions}
                        defaultValue="All"
                        disabled
                        className="w-full"
                    />
                    <Select
                        label="School / University"
                        options={universityOptions}
                        defaultValue="All"
                        className="w-full"
                    />
                    <SearchInput
                        placeholder="Search Scholars..."
                        onSearch={(query: string) => setSearchTerm(query)}
                        className="w-full"
                    />
                </div>

                {/* Header and bulk actions */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Pending Accounts (3)
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Check className="h-4 w-4 mr-2" /> Verify
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <X className="h-4 w-4 mr-2" /> Reject
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <VerificationTable searchTerm={searchTerm} />
        </div>
    );
}
