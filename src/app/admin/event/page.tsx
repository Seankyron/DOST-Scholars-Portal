'use client';

import { useState, useEffect } from 'react';
import { BannerUpload } from '@/components/admin/events/BannerUpload';
import { BannerList, Banner } from '@/components/admin/events/BannerList';
import { CarouselSettings } from '@/components/admin/events/CarouselSettings';
import { EditBannerModal } from '@/components/admin/events/EditBannerModal';
import { toast } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

export default function EventBannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 1. Created a reusable function to fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/events/get');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch events');
      }
      const data = await response.json();
      setBanners(data.events);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch events', { description: err.message });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Call the fetch function on initial page load
  useEffect(() => {
    fetchBanners();
  }, []);

  // 3. All handlers now simply refetch the data
  // The child components (BannerUpload, DeleteBannerModal, EditBannerModal)
  // are responsible for their own API POST/PUT/DELETE calls.
  
  const handleAddBanner = () => {
    toast.success('Banner added! Refreshing list...');
    fetchBanners();
  };

  const handleDeleteBanner = (id: number) => {
    toast.success('Banner deleted! Refreshing list...');
    fetchBanners();
  };

  const handleUpdateBanner = () => {
    // The success toast is already handled in EditBannerModal
    // We just need to refetch.
    fetchBanners();
  };

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
              {/* 4. Prop simplified */}
              <BannerUpload onAddBanner={handleAddBanner} />
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
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-dost-title" />
                </div>
              ) : error ? (
                <p className="text-center text-red-600">{error}</p>
              ) : (
                <BannerList
                  banners={banners}
                  onEdit={(banner: Banner) => openEditModal(banner)}
                  onDelete={handleDeleteBanner} // 5. Prop simplified
                />
              )}
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
          onUpdate={handleUpdateBanner} // 6. Prop simplified
        />
      )}
    </div>
  );
}