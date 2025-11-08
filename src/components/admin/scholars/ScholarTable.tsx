'use client';

import Image from 'next/image';
import { ScholarRow } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';
import type { ScholarStatus } from '@/types/scholar';

// --- MOCK DATA --- (same as yours)
interface MockScholar {
    id: string;
    name: string;
    scholarId: string;
    scholarshipType: string;
    university: string;
    yearLevel: string;
    program: string;
    status: ScholarStatus;
    email: string;
    profileImage: string;
}

const mockScholars: MockScholar[] = [
    {
        id: '1',
        name: 'Joshua De Larosa',
        scholarId: '2021-00123',
        scholarshipType: 'RA 7687',
        university: 'Laguna State Polytechnic...',
        yearLevel: '4th Year',
        program: 'BS Electronics',
        status: 'Active',
        email: 'joshuadelarosa@lspu.ed...',
        profileImage: '/images/placeholders/avatar-placeholder.png',
    },
    {
        id: '2',
        name: 'Maloi Ricalde',
        scholarId: '2022-00456',
        scholarshipType: 'Merit',
        university: 'Batangas State University...',
        yearLevel: '3rd Year',
        program: 'BS Information ...',
        status: 'Warning',
        email: 'maloi.ricalde@g.batstat...',
        profileImage: '',
    },
    {
        id: '3',
        name: 'Aiah Arceta',
        scholarId: '2021-00789',
        scholarshipType: 'JLSS, Merit',
        university: 'De La Salle University - Li...',
        yearLevel: '4th Year',
        program: 'BS Aeronautica...',
        status: 'Active',
        email: 'aiah.arceta@dlsu.edu.ph',
        profileImage: '',
    },
    {
        id: '4',
        name: 'John Cruz',
        scholarId: '2024-00111',
        scholarshipType: 'RA 7687',
        university: 'Cavite State University',
        yearLevel: '1st Year',
        program: 'BS Electronics',
        status: 'On hold',
        email: 'johncruz@cvsu.edu.ph',
        profileImage: '',
    },
    {
        id: '5',
        name: 'Luis Garcia',
        scholarId: '2021-00222',
        scholarshipType: 'Merit',
        university: 'Batangas State University ...',
        yearLevel: '4th Year',
        program: 'BS Biology',
        status: 'Active',
        email: 'luis.garcia@g.batstate-...',
        profileImage: '',
    },
    {
        id: '6',
        name: 'Vanessa De Guzman',
        scholarId: '2022-00333',
        scholarshipType: 'JLSS, Merit',
        university: 'Lyceum of the Philippines ...',
        yearLevel: '3rd Year',
        program: 'BS Nursing',
        status: 'Active',
        email: 'vanessa.deguzman@lpu...',
        profileImage: '',
    },
    {
        id: '7',
        name: 'Maria Santos',
        scholarId: '2020-00444',
        scholarshipType: 'RA 7687',
        university: 'Polytechnic University of t...',
        yearLevel: 'Graduated',
        program: 'BS Applied Mat...',
        status: 'Graduated',
        email: 'maria.santos@pup.edu.ph',
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
    // ✅ Enhanced filtering logic
    const filteredScholars = mockScholars.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filters.type === 'All' || s.scholarshipType.includes(filters.type);
        const matchesStatus = filters.status === 'All' || s.status === filters.status;
        const matchesUniversity = filters.university === 'All' || s.university.includes(filters.university);
        const matchesYear = filters.year === 'All' || s.yearLevel.includes(filters.year);
        return matchesSearch && matchesType && matchesStatus && matchesUniversity && matchesYear;
    });

    const totalScholars = filteredScholars.length;
    const itemsPerPage = 7;
    const totalPages = Math.ceil(totalScholars / itemsPerPage);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scholar</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SPAS ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year Level</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredScholars.map((scholar) => (
                                <ScholarRow key={scholar.id} scholar={scholar} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <p className="text-sm text-gray-700">
                    Showing {filteredScholars.length} of {mockScholars.length} scholars
                </p>
                <Pagination
                    currentPage={1}
                    totalPages={totalPages}
                    onPageChange={() => { }}
                />
            </div>
        </>
    );
}
