'use client';

import Image from 'next/image';
import { BadgeCheck, Info, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStatusColor } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { toast } from '@/components/ui/toaster';

// Mock data
const mockScholar = {
  firstName: 'Joshua',
  surname: 'De Larosa',
  scholarId: '2021-00123',
  scholarshipProgram: 'Merit',
  batch: 2021,
  course: 'BS Electronics and Commuications Engineering',
  school: 'Laguna State Polytechnic University - San Pablo',
  status: 'Active',
  profileImage: '/images/placeholders/avatar-placeholder.png',
};

export function ProfileSection() {
  const statusColor = getStatusColor(mockScholar.status);

  return (
    <div className="rounded-lg bg-auth-gradient p-[3px] h-full">
      <Card className="shadow-md h-full border-0">
        {/* 1. Added 'relative' to CardContent to act as a positioning container */}
        <CardContent className="relative flex flex-col sm:flex-row items-center gap-4 p-6">
          
          {/* 2. Moved QR Button here and positioned it absolutely */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-6 right-6 hidden sm:flex" // Aligns with p-6 padding
            onClick={() => toast.info('QR Code modal is not yet built!')}
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </Button>
          
          <Image
            src={mockScholar.profileImage}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-md flex-shrink-0"
            onError={(e) =>
              (e.currentTarget.src =
                '/images/placeholders/avatar-placeholder.png')
            }
          />
          <div className="w-full">
            {/* 3. Removed 'justify-between' from this div as button is no longer in it */}
            <div className="flex items-center">
              <div>
                <h2 className="text-xl font-semibold text-dost-title">
                  {mockScholar.firstName} {mockScholar.surname}
                </h2>
                <p className="text-sm text-gray-600">
                  Scholar ID: <strong>{mockScholar.scholarId}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Scholarship Program: <strong>{mockScholar.scholarshipProgram}</strong>
                </p>
                <p className="text-sm text-gray-600">Batch: <strong>{mockScholar.batch}</strong></p>
                <p className="text-sm text-gray-600">
                  {mockScholar.course} - {mockScholar.school}
                </p>
              </div>
              {/* Button was moved from here */}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                  statusColor
                )}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {mockScholar.status} Scholar
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your scholarship status is active.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}