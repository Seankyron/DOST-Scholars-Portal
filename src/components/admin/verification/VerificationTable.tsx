'use client';

import { Pagination } from '@/components/shared/Pagination';
import { VerificationRow } from './VerificationRow';
import type { ScholarshipType } from '@/types';

// This mock data is based on your PDF mockup
const mockPendingAccounts = [
  {
    id: '1',
    name: 'Andrea Villanueva',
    scholarId: '2022-0001', // <-- ADDED
    scholarshipType: 'RA 7687' as ScholarshipType,
    university: 'Cavite State University - Indan...',
    program: 'BS Electronics Engineeri...',
    email: 'andreavillanueva@cvsu...',
    fullData: {
      scholarId: '2022-0001',
      email: 'andreavillanueva@cvsu.edu.ph',
      firstName: 'Andrea',
      surname: 'Villanueva',
      dateOfBirth: '2004-01-01',
      contactNumber: '+639123456789',
      addressBrgy: 'Brgy. Hall',
      addressCity: 'Indang',
      addressProvince: 'Cavite',
      scholarshipType: 'RA 7687',
      yearAwarded: '2022',
      university: 'Cavite State University - Indang',
      program: 'BS Electronics Engineering',
      midyear1stYear: false, midyear2ndYear: false, midyear3rdYear: true, midyear4thYear: false,
      thesis1stYear: false, thesis2ndYear: false, thesis3rdYear: false, thesis4thYear: true,
      courseDuration: '4',
      ojtYear: '3',
      ojtSemester: '2nd Semester',
      curriculumFile: { name: 'Villanueva_Curriculum.pdf', url: '#' },
    },
  },
  {
    id: '2',
    name: 'Jericho Dela Cruz',
    scholarId: '2022-0002', // <-- ADDED
    scholarshipType: 'Merit' as ScholarshipType,
    university: 'University of the Philippines - L...',
    program: 'BS Agricultural Biotechn...',
    email: 'jerichodelacruz@up.edu...',
    fullData: {
      scholarId: '2022-0002',
      email: 'jerichodelacruz@up.edu.ph',
      firstName: 'Jericho',
      surname: 'Dela Cruz',
      dateOfBirth: '2004-02-02',
      contactNumber: '+639123456780',
      addressBrgy: 'Brgy. Batong Malake',
      addressCity: 'Los Baños',
      addressProvince: 'Laguna',
      scholarshipType: 'Merit',
      yearAwarded: '2022',
      university: 'University of the Philippines - Los Baños',
      program: 'BS Agricultural Biotechnology',
      midyear1stYear: false, midyear2ndYear: false, midyear3rdYear: false, midyear4thYear: false,
      thesis1stYear: false, thesis2ndYear: false, thesis3rdYear: false, thesis4thYear: true,
      courseDuration: '4',
      ojtYear: '4',
      ojtSemester: '1st Semester',
      curriculumFile: { name: 'DelaCruz_Curriculum.pdf', url: '#' },
    },
  },
  {
    id: '3',
    name: 'Aldrich Arenas',
    scholarId: '2022-0003', // <-- ADDED
    scholarshipType: 'RA 7687' as ScholarshipType,
    university: 'Batangas State University - Ma...',
    program: 'BS Computer Science',
    email: 'aldrich.arenas@g.batstat...',
    fullData: {
      scholarId: '2022-0003',
      email: 'aldrich.arenas@g.batstate-u.edu.ph',
      firstName: 'Aldrich Amiel',
      middleName: '',
      surname: 'Arenas',
      suffix: '',
      dateOfBirth: '09/06/2004',
      contactNumber: '+639203430975',
      addressBrgy: 'Brgy. Poblacion',
      addressCity: 'Balayan',
      addressProvince: 'Batangas',
      scholarshipType: 'RA 7687',
      yearAwarded: '2022',
      university: 'Batangas State University - Main 2',
      program: 'BS Computer Science',
      midyear1stYear: true, midyear2ndYear: false, midyear3rdYear: true, midyear4thYear: false,
      thesis1stYear: false, thesis2ndYear: false, thesis3rdYear: false, thesis4thYear: true,
      courseDuration: '4',
      ojtYear: '3',
      ojtSemester: 'Midyear',
      curriculumFile: { name: 'Arenas_Curriculum.pdf', url: '#' }, // Mock URL
    },
  },
];

interface VerificationTableProps {
  searchTerm: string;
}

export function VerificationTable({ searchTerm }: VerificationTableProps) {
  const filteredAccounts = mockPendingAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.scholarId && account.scholarId.includes(searchTerm)) // Also filter by scholarId
  );

  const paginatedAccounts = filteredAccounts;
  const totalAccounts = filteredAccounts.length;

  return (
    <>
      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Scholar
                </th>
                {/* --- ADDED HEADER --- */}
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SPAS ID
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
                  Course
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
              {paginatedAccounts.map((account) => (
                <VerificationRow key={account.id} account={account as any} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <p className="text-sm text-gray-700">
          Showing 1-{paginatedAccounts.length} of {totalAccounts} pending
          accounts
        </p>
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </div>
    </>
  );
}