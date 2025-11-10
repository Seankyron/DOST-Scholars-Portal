'use client';

import { useState } from 'react';
import { BannerUpload } from '@/components/admin/event/BannerUpload';
import { BannerList, Banner } from '@/components/admin/event/BannerList';
import { CarouselSettings } from '@/components/admin/event/CarouselSettings';
import { EditBannerModal } from '@/components/admin/event/EditBannerModal';

export default function EventBannerManagementPage() {
    const [banners, setBanners] = useState<Banner[]>([
        {
            id: 1,
            title: 'Scholars Leadership Camp',
            link: 'https://patriot.science-scholarships.ph/',
            image: '/placeholder1.png',
        },
        {
            id: 2,
            title: 'YUGTO 2025',
            link: 'https://facebook.com/DOST.RPCA4A/',
            image: '/placeholder2.png',
        },
    ]);

    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleAddBanner = (newBanner: Omit<Banner, 'id'>) => {
        setBanners([...banners, { id: Date.now(), ...newBanner }]);
    };

    const handleDeleteBanner = (id: number) => {
        setBanners(banners.filter((b) => b.id !== id));
    };

    const handleUpdateBanner = (id: number, updatedData: Partial<Banner>) => {
        setBanners(banners.map((b) => (b.id === id ? { ...b, ...updatedData } : b)));
    };

    const openEditModal = (banner: Banner | undefined) => {
        if (banner) {
            setSelectedBanner(banner);
            setIsEditOpen(true);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-dost-title">Event Banner Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Banner Images</h2>
                        <BannerUpload onAddBanner={handleAddBanner} />
                    </div>

                    <BannerList
                        banners={banners}
                        onEdit={(banner: Banner) => openEditModal(banner)}
                        onDelete={handleDeleteBanner}
                    />
                </div>

                <div>
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
