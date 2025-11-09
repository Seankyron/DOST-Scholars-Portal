'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalContent,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';

interface Banner {
    id: number;
    title: string;
    link: string;
    image: string;
}

interface EditBannerModalProps {
    banner: Banner;
    open: boolean;
    onClose: () => void;
    onUpdate: (id: number, updatedData: Partial<Banner>) => void;
}

export function EditBannerModal({
    banner,
    open,
    onClose,
    onUpdate,
}: EditBannerModalProps) {
    const [formData, setFormData] = useState<Partial<Banner>>({ ...banner });

    useEffect(() => {
        setFormData({ ...banner });
    }, [banner]);

    const handleChange = (field: keyof Banner, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(banner.id, formData);
        onClose();
    };

    return (
        <Modal open={open} onOpenChange={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>Edit Banner</ModalTitle>
                    </ModalHeader>

                    <ModalBody className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <Input
                                value={formData.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address Link</label>
                            <Input
                                value={formData.link || ''}
                                onChange={(e) => handleChange('link', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Replace Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleChange('image', URL.createObjectURL(file));
                                }}
                            />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
