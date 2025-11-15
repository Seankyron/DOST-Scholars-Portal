'use client';

import type { SyntheticEvent } from 'react';
import {
  BadgeCheck,
  QrCode,
  GraduationCap,
  BookOpen,
  Hash,
  Award,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/shared/InfoToolTip';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScholarStatus } from '@/types';
import { cn } from '@/lib/utils/cn';
import { useCurrentUser } from "@/hooks/useCurrentUser";


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

// A new helper component just for this file to make the list cleaner
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        className="h-5 w-5 text-dost-blue flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function ProfileSection() {
  const { user, loading } = useCurrentUser();
  const userInfo = user?.user_metadata;
  
  return (
    // SIMPLIFIED CONTAINER: Removed the outer gradient <div>
    <Card className="shadow-md bg-white">
      <CardContent className="relative p-6">
        {/* NEW LAYOUT: Grid for better responsive control */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* === AVATAR COLUMN === */}
          <div className="flex flex-col items-center justify-start space-y-4 md:col-span-1 md:border-r md:pr-6">
            <img
              src={mockScholar.profileImage}
              alt="Profile Picture"
              width={128} // Slightly larger
              height={128} // Slightly larger
              className="rounded-full border-4 border-white shadow-lg h-32 w-32 object-cover"
              onError={(e: SyntheticEvent<HTMLImageElement>) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/images/placeholders/avatar-placeholder.png';
              }}
            />
            {/* MOVED QR BUTTON: Grouped with the avatar */}
            <Button
              variant="outline"
              size="sm"
              className="w-full" // Full-width in its column
              onClick={() => toast.info('QR Code modal is not yet built!')}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Show QR Code
            </Button>
          </div>

          {/* === INFO COLUMN === */}
          <div className="flex flex-col space-y-4 md:col-span-3">
            {/* Name and Status */}
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl font-bold text-dost-title">
                  {userInfo?.first_name } {userInfo?.last_name}
                </h2>
                <div className="flex items-center gap-2">
                  <StatusBadge status={userInfo?.scholarship_status}>
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {userInfo?.scholarship_status} Scholar
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

            {/* NEW INFO GRID: Cleaner, icon-based */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
              <InfoItem
                icon={GraduationCap}
                label="School"
                value={userInfo?.university}
              />
              <InfoItem
                icon={BookOpen}
                label="Program"
                value={userInfo?.program_course}
              />
              <InfoItem
                icon={Hash}
                label="Scholar ID"
                value={userInfo?.spas_id}
              />
              <InfoItem
                icon={Award}
                label="Scholarship Type"
                value={userInfo?.scholarship_type}
              />
              <InfoItem
                icon={Calendar}
                label="Batch"
                value={userInfo?.year_awarded}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}