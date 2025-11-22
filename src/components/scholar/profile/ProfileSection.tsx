'use client';

import { useState, useRef, type SyntheticEvent } from 'react';
import {
  BadgeCheck,
  QrCode,
  GraduationCap,
  BookOpen,
  Hash,
  Award,
  Calendar,
  Camera,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/shared/InfoToolTip';
import { toast } from '@/components/ui/toaster'; 
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScholarStatus } from '@/types';
import { QRCodeModal } from './QRCodeModal';
import { cn } from '@/lib/utils/cn';

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
        className="h-5 w-5 text-dost-title flex-shrink-0 mt-0.5"
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
  const [isQROpen, setIsQROpen] = useState(false);
  
  // -- New State for Profile Upload --
  const [avatarUrl, setAvatarUrl] = useState(mockScholar.profileImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger the hidden file input
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic Validation
    if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG).');
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB.');
        return;
    }

    setIsUploading(true);

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'profile-pictures'); // Use a specific folder name

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        // Success: Update the avatar URL
        setAvatarUrl(data.url);
        toast.success('Profile picture updated successfully!');

    } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Failed to update profile picture.');
    } finally {
        setIsUploading(false);
        // Reset input so sending the same file again works if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="shadow-md bg-white">
      <CardContent className="relative p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* === AVATAR COLUMN === */}
          <div className="flex flex-col items-center justify-start space-y-4 md:col-span-1 md:border-r md:pr-6">
            
            {/* Wrapper for Image and Edit Button */}
            <div className="relative group">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {isUploading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                    <img
                        src={avatarUrl}
                        alt="Profile Picture"
                        className={cn(
                            "h-full w-full object-cover transition-opacity",
                            isUploading && "opacity-50"
                        )}
                        onError={(e: SyntheticEvent<HTMLImageElement>) => {
                            (e.currentTarget as HTMLImageElement).src =
                            '/images/placeholders/avatar-placeholder.png';
                        }}
                    />
                </div>
                
                {/* Edit Button Overlay */}
                <button
                    onClick={handleEditClick}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-2 bg-dost-title text-white rounded-full shadow-md hover:bg-blue-700 transition-colors z-10 border-2 border-white"
                    title="Change Profile Photo"
                >
                    <Camera className="h-4 w-4" />
                </button>

                {/* Hidden File Input */}
                <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                />
            </div>

            {/* Buttons Group */}
            <div className="w-full space-y-2">
                 <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsQROpen(true)}
                 >
                    <QrCode className="h-4 w-4 mr-2" />
                    Show QR Code
                 </Button>
            </div>
          </div>

          {/* === INFO COLUMN (Unchanged) === */}
          <div className="flex flex-col space-y-4 md:col-span-3">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl font-bold text-dost-blue">
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
                      {/* ... Legend content ... */}
                       <ul className="space-y-1.5 text-sm">
                        <li><span className="font-medium text-green-300">Active:</span> In good standing.</li>
                        <li><span className="font-medium text-yellow-300">Warning:</span> Has academic deficiencies.</li>
                        <li><span className="font-medium text-orange-300">2nd Warning:</span> Has repeated deficiencies.</li>
                        <li><span className="font-medium text-red-300">Suspended:</span> Scholarship is suspended.</li>
                        <li><span className="font-medium text-purple-300">On hold:</span> Stipend held pending requirements.</li>
                        <li><span className="font-medium text-blue-300">Graduated:</span> Program completed.</li>
                        <li><span className="font-medium text-gray-400">Terminated:</span> Scholarship terminated.</li>
                      </ul>
                    </div>
                  </InfoTooltip>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
              <InfoItem icon={GraduationCap} label="School" value={mockScholar.school} />
              <InfoItem icon={BookOpen} label="Program" value={mockScholar.course} />
              <InfoItem icon={Hash} label="Scholar ID" value={mockScholar.scholarId} />
              <InfoItem icon={Award} label="Scholarship Type" value={mockScholar.scholarshipProgram} />
              <InfoItem icon={Calendar} label="Batch" value={mockScholar.batch} />
            </div>
          </div>
        </div>

        <QRCodeModal
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          scholarId={mockScholar.scholarId}
          scholarName={`${mockScholar.firstName} ${mockScholar.surname}`}
        />
      </CardContent>
    </Card>
  );
}