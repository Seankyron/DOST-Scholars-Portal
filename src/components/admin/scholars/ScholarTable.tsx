'use client';

import Image from 'next/image';
import { ScholarRow } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';
import type { ScholarStatus } from '@/types/scholar';

// This interface matches the data structure in the PDF
interface MockScholar {
  id: string;
  name: string;
  scholarshipType: string;
  university: string;
  yearLevel: string;
  program: string;
  status: ScholarStatus;
  email: string;
  profileImage: string;
}

// --- MOCK DATA MATCHING PDF PAGE 4 ---
const mockScholars: MockScholar[] = [
  {
    id: '1',
    name: 'Joshua De Larosa',
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
    scholarshipType: 'Merit',
    university: 'Batangas State University...',
    yearLevel: '3rd Year',
    program: 'BS Information ...',
    status: 'Warning',
    email: 'maloi.ricalde@g.batstat...',
    profileImage: '', // Will use placeholder
  },
  {
    id: '3',
    name: 'Aiah Arceta',
    scholarshipType: 'JLSS, Merit',
    university: 'De La Salle University - Li...',
    yearLevel: '4th Year',
    program: 'BS Aeronautica...',
    status: 'Active',
    email: 'aiah.arceta@dlsu.edu.ph',
    profileImage: '', // Will use placeholder
  },
  {
    id: '4',
    name: 'John Cruz',
    scholarshipType: 'RA 7687',
    university: 'Cavite State University',
    yearLevel: '1st Year',
    program: 'BS Electronics',
    status: 'On hold',
    email: 'johncruz@cvsu.edu.ph',
    profileImage: '', // Will use placeholder
  },
  {
    id: '5',
    name: 'Luis Garcia',
    scholarshipType: 'Merit',
    university: 'Batangas State University ...',
    yearLevel: '4th Year',
    program: 'BS Biology',
    status: 'Active',
    email: 'luis.garcia@g.batstate-...',
    profileImage: '', // Will use placeholder
  },
  {
    id: '6',
    name: 'Vanessa De Guzman',
    scholarshipType: 'JLSS, Merit',
    university: 'Lyceum of the Philippines ...',
    yearLevel: '3rd Year',
    program: 'BS Nursing',
    status: 'Active',
    email: 'vanessa.deguzman@lpu...',
    profileImage: '', // Will use placeholder
  },
  {
    id: '7',
    name: 'Maria Santos',
    scholarshipType: 'RA 7687',
    university: 'Polytechnic University of t...',
    yearLevel: 'Graduated', // Custom year level from PDF
    program: 'BS Applied Mat...',
    status: 'Graduated',
    email: 'maria.santos@pup.edu.ph',
    profileImage: '', // Will use placeholder
  },
];

interface ScholarTableProps {
  searchTerm: string;
}

export function ScholarTable({ searchTerm }: ScholarTableProps) {
  const filteredScholars = mockScholars.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FIX: Base total count on the mock data array ---
  const totalScholars = mockScholars.length;
  
  // --- FIX: Calculate total pages based on mock data count ---
  // (Assuming 7 items per page as per your mock data)
  const itemsPerPage = 7;
  const totalPages = Math.ceil(totalScholars / itemsPerPage);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Scholar
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  University
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Year Level
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Use ScholarRow component */}
              {filteredScholars.map((scholar) => (
                <ScholarRow key={scholar.id} scholar={scholar} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <p className="text-sm text-gray-700">
          {/* --- FIX: Dynamic count text --- */}
          Showing 1-{filteredScholars.length} of {totalScholars} scholars
        </p>
        <Pagination
          currentPage={1}
          totalPages={totalPages} // --- FIX: Use calculated total pages ---
          onPageChange={() => {}}
        />
      </div>
    </>
  );
}