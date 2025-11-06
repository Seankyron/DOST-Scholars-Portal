'use client';

import type { SyntheticEvent } from 'react';
import { BadgeCheck, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/shared/InfoToolTip';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScholarStatus } from '@/types';

// Mock data
const mockScholar = {
  firstName: 'Joshua',
  surname: 'De Larosa',
  scholarId: '2021-00123',
  scholarshipProgram: 'Merit',
  batch: 2021,
  course: 'BS Electronics and Communications Engineering',
  school: 'Laguna State Polytechnic University - San Pablo',
  status: 'Active' as const satisfies ScholarStatus,
  profileImage: '/images/placeholders/avatar-placeholder.png',
};

export function ProfileSection() {
  return (
    <div className="rounded-lg bg-auth-gradient p-[3px]">
      <Card className="shadow-md border-0">
        <CardContent className="relative p-6">
          {/* QR Code Button - Top Right */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10"
            onClick={() => toast.info('QR Code modal is not yet built!')}
          >
            <QrCode className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">QR Code</span>
          </Button>

          {/* Main Content */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={mockScholar.profileImage}
                alt="Profile Picture"
                width={112}
                height={112}
                className="rounded-full border-4 border-white shadow-lg"
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/images/placeholders/avatar-placeholder.png';
                }}
              />
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4 text-center sm:text-left w-full sm:pr-24">
              {/* Name and Status */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-dost-title">
                    {mockScholar.firstName} {mockScholar.surname}
                  </h2>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={mockScholar.status}>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {mockScholar.status} Scholar
                    </StatusBadge>

                    <InfoTooltip>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-center mb-2">
                          Status Legend
                        </h4>
                        <ul className="space-y-1.5 text-sm">
                          <li>
                            <span className="font-medium text-green-300">
                              Active:
                            </span>{' '}
                            In good standing.
                          </li>
                          <li>
                            <span className="font-medium text-yellow-300">
                              Warning:
                            </span>{' '}
                            Has academic deficiencies.
                          </li>
                          <li>
                            <span className="font-medium text-orange-300">
                              2nd Warning:
                            </span>{' '}
                            Has repeated deficiencies.
                          </li>
                          <li>
                            <span className="font-medium text-red-300">
                              Suspended:
                            </span>{' '}
                            Scholarship is suspended.
                          </li>
                          <li>
                            <span className="font-medium text-purple-300">
                              On hold:
                            </span>{' '}
                            Stipend held pending requirements.
                          </li>
                          <li>
                            <span className="font-medium text-blue-300">
                              Graduated:
                            </span>{' '}
                            Program completed.
                          </li>
                          <li>
                            <span className="font-medium text-gray-400">
                              Terminated:
                            </span>{' '}
                            Scholarship terminated.
                          </li>
                        </ul>
                      </div>
                    </InfoTooltip>
                  </div>
                </div>
              </div>

              {/* Scholar Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Scholar ID:</span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {mockScholar.scholarId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Scholarship Type:</span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {mockScholar.scholarshipProgram}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Batch:</span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {mockScholar.batch}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Program:</span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {mockScholar.course}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">School:</span>
                    <span className="ml-2 font-semibold text-gray-700">
                      {mockScholar.school}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
