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
import type { ScholarStatus } from '@/types/scholar';

// Interface for the scholar prop
interface Scholar {
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

interface ScholarRowProps {
  scholar: Scholar;
}

export function ScholarRow({ scholar }: ScholarRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-9 w-9">
            <Image
              className="h-9 w-9 rounded-full object-cover"
              src={
                scholar.profileImage ||
                '/images/placeholders/avatar-placeholder.png'
              }
              alt={`${scholar.name}'s profile`}
              width={36}
              height={36}
              onError={(e) => {
                e.currentTarget.src =
                  '/images/placeholders/avatar-placeholder.png';
              }}
            />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {scholar.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {scholar.scholarshipType}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {scholar.university}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {scholar.yearLevel}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {scholar.program}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={scholar.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
        {scholar.email}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => alert(`Viewing details for ${scholar.name}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`Editing scholar ${scholar.name}`)}
            >
              Edit Scholar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`Viewing history for ${scholar.name}`)}
            >
              Scholar History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}