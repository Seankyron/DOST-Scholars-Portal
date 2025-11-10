'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteBannerModal } from '@/components/admin/events/DeleteBannerModal';

export interface Banner {
    id: number;
    title: string;
    link: string;
    image: string;
}

interface BannerListProps {
    banners: Banner[];
    onEdit: (banner: Banner) => void;
    onDelete: (id: number) => void;
}

export function BannerList({ banners, onEdit, onDelete }: BannerListProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const openDeleteModal = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedBanner) {
            onDelete(selectedBanner.id);
            setIsDeleteOpen(false);
            setSelectedBanner(null);
        }
    };

    return (
        <>
            <div className="space-y-3">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="flex items-center justify-between border rounded-lg p-3 bg-white shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-14 bg-gray-200 flex items-center justify-center text-xs text-gray-600 rounded">
                                16:9 image
                            </div>
                            <div>
                                <p className="font-semibold">{banner.title}</p>
                                <p className="text-sm text-gray-500 truncate w-64">{banner.link}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(banner)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline" // <-- Use outline + custom class instead of "destructive"
                                size="sm"
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() => openDeleteModal(banner)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <DeleteBannerModal
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                bannerTitle={selectedBanner?.title}
                onConfirm={confirmDelete}
            />
        </>
    );
}
