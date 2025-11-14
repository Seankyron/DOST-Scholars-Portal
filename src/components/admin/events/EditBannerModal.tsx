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
import { supabase } from '@/lib/supabase/client';

interface Banner {
    id: number;
    title: string;
    address_link: string;
    image_file_key: string;
}

interface EditBannerModalProps {
    banner: Banner;
    open: boolean;
    onClose: () => void;
    onUpdate: (id: number, updatedData: Banner) => void;
}

export function EditBannerModal({ banner, open, onClose, onUpdate }: EditBannerModalProps) {
    const [title, setTitle] = useState(banner.title);
    const [addressLink, setAddressLink] = useState(banner.address_link);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Reset form when banner changes
    useEffect(() => {
        setTitle(banner.title);
        setAddressLink(banner.address_link);
        setFile(null);
        setPreview('');
    }, [banner]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !addressLink) {
            alert('Please fill in all required fields');
            return;
        }

        setIsUpdating(true);

        try {
            let newImageKey = banner.image_file_key;

            // If new file is selected, upload it
            if (file) {
                // Generate new filename in banners/ folder format
                const timestamp = Date.now();
                const fileExt = file.name.split('.').pop();
                newImageKey = `banners/${timestamp}.${fileExt}`;

                console.log('Uploading to:', newImageKey);

                // Upload new image
                const { error: uploadError } = await supabase.storage
                    .from('event-banners')
                    .upload(newImageKey, file, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.type,
                    });

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw new Error(uploadError.message);
                }

                // Delete old image if it exists and is different
                if (banner.image_file_key && banner.image_file_key !== newImageKey) {
                    const { error: deleteError } = await supabase.storage
                        .from('event-banners')
                        .remove([banner.image_file_key]);
                    
                    if (deleteError) {
                        console.warn('Could not delete old image:', deleteError);
                    }
                }
            }

            // Update event in database
            const { data, error: updateError } = await supabase
                .from('Event')
                .update({
                    title,
                    address_link: addressLink,
                    image_file_key: newImageKey,
                })
                .eq('id', banner.id)
                .select()
                .single();

            if (updateError) {
                // If update fails and we uploaded a new file, delete it
                if (file && newImageKey !== banner.image_file_key) {
                    await supabase.storage
                        .from('event-banners')
                        .remove([newImageKey]);
                }
                console.error('Update error:', updateError);
                throw new Error(updateError.message);
            }

            // Notify parent component with updated data
            onUpdate(banner.id, {
                id: banner.id,
                title,
                address_link: addressLink,
                image_file_key: newImageKey,
            });

            alert('Banner updated successfully!');
            onClose();
        } catch (error: any) {
            console.error('Update failed:', error);
            alert('Failed to update banner: ' + error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // Get public URL for preview
    const getImageUrl = () => {
        if (preview) return preview; // Show local preview if new file selected
        
        if (banner.image_file_key) {
            const { data } = supabase.storage
                .from('event-banners')
                .getPublicUrl(banner.image_file_key);
            return data.publicUrl;
        }
        return '';
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Title *
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Banner Title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Address Link *
                            </label>
                            <Input
                                value={addressLink}
                                onChange={(e) => setAddressLink(e.target.value)}
                                required
                                placeholder="https://..."
                                type="url"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Replace Image (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer"
                            />
                            {getImageUrl() && (
                                <div className="mt-3">
                                    <img 
                                        src={getImageUrl()} 
                                        alt="Preview" 
                                        className="h-32 w-auto object-contain rounded border border-gray-200 shadow-sm" 
                                    />
                                </div>
                            )}
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}