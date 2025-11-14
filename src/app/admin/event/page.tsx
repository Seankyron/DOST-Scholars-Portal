'use client';

import { useActionState, useState, useEffect } from 'react';
import { BannerUpload } from '@/components/admin/events/BannerUpload';
import { BannerList, Banner } from '@/components/admin/events/BannerList';
import { CarouselSettings } from '@/components/admin/events/CarouselSettings';
import { EditBannerModal } from '@/components/admin/events/EditBannerModal';

export default function EventBannerManagementPage() {
  // const [banners, setBanners] = useState<Banner[]>([
  //   {
  //     id: 1,
  //     title: 'Scholars Leadership Camp',
  //     address_link: 'https://patriot.science-scholarships.ph/',
  //     image_file_key: '/images/banners/banner-1.jpg', // Using a real placeholder
  //   },
  //   {
  //     id: 2,
  //     title: 'YUGTO 2025',
  //     address_link: 'https://facebook.com/DOST.RPCA4A/',
  //     image_file_key: '/images/placeholders/avatar-placeholder.png', // Using a real placeholder
  //   },
  // ]);
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events/get');
      const data = await response.json();
      setBanners(data.events);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }};fetchBanners();}, []);

  const handleAddBanner = (newBanner: Omit<Banner, 'id'>) => {
    setBanners([...banners, { id: Date.now(), ...newBanner }]);
  };

  const handleDeleteBanner = (id: number) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  const handleUpdateBanner = (id: number, updatedData: Partial<Banner>) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
    );
  };

  const openEditModal = (banner: Banner | undefined) => {
    if (banner) {
      setSelectedBanner(banner);
      setIsEditOpen(true);
    }
  };
  console.log("Banners: \n", banners);
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
              <BannerList
                banners={banners}
                onEdit={(banner: Banner) => openEditModal(banner)}
                onDelete={handleDeleteBanner}
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
          onUpdate={handleUpdateBanner}
        />
      )}
    </div>
  );
}