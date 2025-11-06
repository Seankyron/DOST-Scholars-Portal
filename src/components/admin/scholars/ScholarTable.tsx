// src/components/admin/scholars/ScholarTable.tsx
'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { Pagination } from '@/components/shared/Pagination';


const mockScholars = [
  {
    id: '1',
    firstName: 'Joshua',
    surname: 'De Larosa',
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
    firstName: 'Maloi',
    surname: 'Ricalde',
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
    firstName: 'Aiah',
    surname: 'Arceta',
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
    firstName: 'John',
    surname: 'Cruz',
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
    firstName: 'Luis',
    surname: 'Garcia',
    scholarshipType: 'Merit',
    university: 'Batangas State University ...',
    yearLevel: '4th Year',
    program: 'BS Biology',
    status: 'Active',
    email: 'luis.garcia@g.batstate-...',
    profileImage: '',
  },
];

export function ScholarTable() {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Level</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockScholars.map((scholar) => (
                <tr key={scholar.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          className="h-10 w-10 rounded-full object-cover"
                          src={scholar.profileImage || '/images/placeholders/avatar-placeholder.png'}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{scholar.firstName} {scholar.surname}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scholar.scholarshipType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scholar.university}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scholar.yearLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scholar.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* 4. HERE is the connected status badge, just passing the status string */}
                    <StatusBadge status={scholar.status as any} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scholar.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Scholar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Scholar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-700">
          Showing 1-5 of 254 scholars
        </p>
        <Pagination
          currentPage={1}
          totalPages={37}
          onPageChange={() => {}}
        />
      </div>
    </>
  );
}