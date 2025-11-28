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
import { toast } from 'sonner'; // Ensure importing from sonner or your toaster re-export
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScholarStatus, SubmissionStatus } from '@/types';
import { QRCodeModal } from './QRCodeModal';
import { useFetchScholar } from "@/hooks/scholars/useFetchScholar";
import { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { useCurrentScholar } from "@/hooks/scholar/useCurrentScholar";


// Helper component for clean list items
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
  const { user: scholar } = useFetchScholar();
  
  const [isQROpen, setIsQROpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scholar) {
      sessionStorage.setItem("scholar", JSON.stringify(scholar));
    }
  }, [scholar]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        // FIXED: Correct Sonner syntax
        toast.error("Error", { description: "Please upload an image file." });
        return;
    }

    setIsUploading(true);

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'profile-pictures');

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Upload failed');

        // FIXED: Correct Sonner syntax
        toast.success("Success", { description: "Profile picture uploaded successfully!" });
        
        window.location.reload(); 

    } catch (error: any) {
        console.error(error);
        // FIXED: Correct Sonner syntax
        toast.error("Error", { description: "Failed to upload image." });
    } finally {
        setIsUploading(false);
    }
  };

  // FIXED: Handle profile_image (snake_case) vs profileImage (camelCase) mismatch
  // We check for both to be safe, or default to placeholder
  const profileImage = (scholar as any)?.profile_image || (scholar as any)?.profileImage || '/images/placeholders/avatar-placeholder.png';
  
  const scholarName = `${scholar?.first_name || ''} ${scholar?.last_name || ''}`;
  const spasId = scholar?.spas_id || 'N/A';

  return (
    <Card className="shadow-md bg-white">
      <CardContent className="relative p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* === AVATAR COLUMN === */}
          <div className="flex flex-col items-center justify-start space-y-4 md:col-span-1 md:border-r md:pr-6">
            
            <div className="relative group">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {isUploading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                    <img
                        src={profileImage}
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
                
                <button
                    onClick={handleEditClick}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-2 bg-dost-blue text-white rounded-full shadow-md hover:bg-blue-700 transition-colors z-10 border-2 border-white"
                    title="Change Profile Photo"
                >
                    <Camera className="h-4 w-4" />
                </button>

                <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                />
            </div>

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

          {/* === INFO COLUMN === */}
          <div className="flex flex-col space-y-4 md:col-span-3">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl font-bold text-dost-title">
                  {scholarName}
                </h2>
                <div className="flex items-center gap-2">
                  <StatusBadge status={scholar?.scholarship_status as SubmissionStatus}>
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {scholar?.scholarship_status} Scholar
                  </StatusBadge>
                  <InfoTooltip>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-center mb-2">Status Legend</h4>
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
              <InfoItem
                icon={GraduationCap}
                label="School"
                value={scholar?.university ?? 'N/A'}
              />
              <InfoItem
                icon={BookOpen}
                label="Program"
                value={scholar?.program_course ?? 'N/A'}
              />
              <InfoItem
                icon={Hash}
                label="Scholar ID"
                value={spasId}
              />
              <InfoItem
                icon={Award}
                label="Scholarship Type"
                value={scholar?.scholarship_type ?? 'N/A'}
              />
              <InfoItem
                icon={Calendar}
                label="Batch"
                value={scholar?.year_awarded ?? 'N/A'}
              />
            </div>
          </div>
        </div>
        
        <QRCodeModal
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          scholarId={spasId}
          scholarName={scholarName}
        />

      </CardContent>
    </Card>
  );
}