'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteBannerModal } from '@/components/admin/events/DeleteBannerModal';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; // <-- FIX 1: Import spinner

export interface Banner {
  id: number;
  title: string;
  address_link: string;
  image_file_key: string;
  image_url: string; // This field is crucial
}

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: number) => void;
  loading: boolean; // <-- FIX 2: Accept the loading prop
}

export function BannerList({ banners, onEdit, onDelete, loading }: BannerListProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const openDeleteModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  // FIX 3: Add the loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // FIX 4: Add the empty state
  if (!loading && banners.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No banners have been uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0">
              <Image
                src={banner.image_url || '/images/placeholders/no-image.png'} // Add fallback
                alt={banner.title}
                width={96}
                height={56}
                className="w-24 h-14 object-cover rounded bg-gray-200 flex-shrink-0"
                onError={(e) => {
                  // Fallback for broken images
                  e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }}
              />
              <div className="min-w-0">
                <p className="font-semibold truncate">{banner.title}</p>
                <p className="text-sm text-gray-500 truncate">
                  {banner.address_link}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onEdit(banner)}
                title="Edit Banner"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => openDeleteModal(banner)}
                title="Delete Banner"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteBannerModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        bannerId={selectedBanner?.id}
        bannerTitle={selectedBanner?.title}
        onDeleted={(id) => onDelete(id)} // This prop name is from the modal
      />
    </>
  );
}