'use client';

import { useState } from 'react';
import { ScholarRow, Scholar } from './ScholarRow';
import { EditScholarModal } from './EditScholarModal';
import { ViewScholarModal } from './ViewScholarModal';
import { HistoryScholarModal } from './HistoryScholarModal';
import { Pagination } from '@/components/shared/Pagination';

// Mock data
const mockScholars: Scholar[] = [
    {
        id: '1',
        name: 'Joshua De Larosa',
        scholarId: '2021-00123',
        scholarshipType: 'RA 7687',
        university: 'Laguna State Polytechnic',
        yearLevel: '4th Year',
        program: 'BS Electronics',
        status: 'Active',
        email: 'joshuadelarosa@lspu.edu.ph',
        profileImage: '/images/placeholders/avatar-placeholder.png',
    },
    {
        id: '2',
        name: 'Maloi Ricalde',
        scholarId: '2022-00456',
        scholarshipType: 'Merit',
        university: 'Batangas State University',
        yearLevel: '3rd Year',
        program: 'BS Information Technology',
        status: 'Warning',
        email: 'maloi.ricalde@batstate.edu.ph',
        profileImage: '',
    },
];

interface ScholarTableProps {
    searchTerm: string;
    filters: {
        type: string;
        status: string;
        university: string;
        year: string;
    };
}

export function ScholarTable({ searchTerm, filters }: ScholarTableProps) {
    const [scholars, setScholars] = useState<Scholar[]>(mockScholars);
    const [viewScholar, setViewScholar] = useState<Scholar | null>(null);
    const [editScholar, setEditScholar] = useState<Scholar | null>(null);
    const [historyScholar, setHistoryScholar] = useState<Scholar | null>(null);

    // Filtering
    const filteredScholars = scholars.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filters.type === 'All' || s.scholarshipType.includes(filters.type);
        const matchesStatus = filters.status === 'All' || s.status === filters.status;
        const matchesUniversity = filters.university === 'All' || s.university.includes(filters.university);
        const matchesYear = filters.year === 'All' || s.yearLevel.includes(filters.year);
        return matchesSearch && matchesType && matchesStatus && matchesUniversity && matchesYear;
    });

    const totalPages = Math.ceil(filteredScholars.length / 7);

    const handleUpdateScholar = (updatedScholar: Scholar) => {
        setScholars((prev) => prev.map((s) => (s.id === updatedScholar.id ? updatedScholar : s)));
        setEditScholar(null);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Scholar</th>
                                <th>SPAS ID</th>
                                <th>Type</th>
                                <th>University</th>
                                <th>Year Level</th>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredScholars.map((scholar) => (
                                <ScholarRow
                                    key={scholar.id}
                                    scholar={scholar}
                                    onView={setViewScholar}
                                    onEdit={setEditScholar}
                                    onHistory={setHistoryScholar}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewScholar && <ViewScholarModal scholar={viewScholar} onClose={() => setViewScholar(null)} />}

                {editScholar && (
                    <EditScholarModal
                        scholar={editScholar}
                        open={!!editScholar}
                        onClose={() => setEditScholar(null)}
                        onUpdate={handleUpdateScholar}
                    />
                )}

                {historyScholar && <HistoryScholarModal scholar={historyScholar} onClose={() => setHistoryScholar(null)} />}

            <div className="flex justify-between items-center mt-4">
                <p>Showing {filteredScholars.length} of {scholars.length} scholars</p>
                <Pagination currentPage={1} totalPages={totalPages} onPageChange={() => { }} />
            </div>
        </>
    );
}
