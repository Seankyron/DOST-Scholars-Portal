'use client';

import { useState, useEffect } from 'react';
import { BannerUpload } from '@/components/admin/events/BannerUpload';
import { BannerList, Banner } from '@/components/admin/events/BannerList';
import { CarouselSettings } from '@/components/admin/events/CarouselSettings';
import { EditBannerModal } from '@/components/admin/events/EditBannerModal';
import { toast } from '@/components/ui/toaster'; // Import toast

export default function EventBannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // FIX 1: Create a single, reusable function to fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true); // Show loading spinner
      const response = await fetch('/api/admin/events/get');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      setBanners(data.events);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message); // Show toast on error
      console.error(err);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // FIX 2: Call the fetch function on initial load
  useEffect(() => {
    fetchBanners();
  }, []);

  // FIX 3: These functions now just trigger the refetch
  const onUploadSuccess = () => {
    toast.success('Banner uploaded! Reloading list...');
    fetchBanners(); // Reload all banners from the server
  };

  const onDeleteSuccess = (id: number) => {
    // Optimistically remove from UI, then refetch to confirm
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success('Banner deleted! Reloading list...');
    fetchBanners(); // Reload all banners from the server
  };

  const onEditSuccess = () => {
    toast.success('Banner updated! Reloading list...');
    fetchBanners(); // Reload all banners from the server
  };
  // --- End of FIX 3 ---

  const openEditModal = (banner: Banner | undefined) => {
    if (banner) {
      setSelectedBanner(banner);
      setIsEditOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Event Banner Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* --- Card 1: Banner Upload --- */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Upload New Banner
              </h2>
            </div>
            <div className="p-4">
              {/* FIX 4: Pass the new handler */}
              <BannerUpload onAddBanner={onUploadSuccess} />
            </div>
          </div>

          {/* --- Card 2: Banner List --- */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Banners
              </h2>
            </div>
            <div className="p-4">
              <BannerList
                banners={banners}
                onEdit={(banner: Banner) => openEditModal(banner)}
                onDelete={onDeleteSuccess}
                loading={loading} // <-- Pass the loading prop
              />
            </div>
          </div>
        </div>

        {/* --- Card 3: Settings --- */}
        <div className="lg:col-span-1">
          <CarouselSettings />
        </div>
      </div>

      {selectedBanner && (
        <EditBannerModal
          banner={selectedBanner}
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUpdate={onEditSuccess} // <-- Pass the new handler
        />
      )}
    </div>
  );
}