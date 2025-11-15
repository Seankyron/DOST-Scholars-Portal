'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toaster';
import { type Banner } from './BannerList';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn'; // Import cn

// Helper function to auto-format URL
const autoFormatUrl = (url: string) => {
  const trimmedUrl = url.trim();
  if (trimmedUrl && !trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
};

// Helper function to validate URL
function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

interface EditBannerModalProps {
  banner: Banner;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditBannerModal({
  banner,
  open,
  onClose,
  onUpdate,
}: EditBannerModalProps) {
  const [title, setTitle] = useState('');
  const [address_link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [isChangingImage, setIsChangingImage] = useState(false);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setLink(banner.address_link);
      setFile(null);
      setIsChangingImage(false);
    }
  }, [banner, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formattedLink = autoFormatUrl(address_link);
    setLink(formattedLink);

    if (!title || !formattedLink) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!isValidUrl(formattedLink)) {
      toast.error('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading('Saving changes...');

    try {
      let final_image_file_key = banner.image_file_key;
      let old_image_file_key: string | null = null;

      if (file) {
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `banners/${timestamp}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event-banners')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        final_image_file_key = fileName;
        old_image_file_key = banner.image_file_key;
      }

      const res = await fetch('/api/admin/events/put', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: banner.id,
          title,
          address_link: formattedLink,
          image_file_key: final_image_file_key,
          old_image_file_key: old_image_file_key,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update event');

      toast.success('Banner updated successfully!', { id: toastId });
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Update failed:', error.message);
      toast.error('Failed to update banner: ' + error.message, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelImageChange = () => {
    setFile(null);
    setIsChangingImage(false);
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Banner</ModalTitle>
        </ModalHeader>
        <form id="edit-banner-form" onSubmit={handleSubmit}>
          <ModalBody className="space-y-4">
            <Input
              label="Title"
              placeholder="Banner Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Address Link"
              placeholder="https://... *"
              value={address_link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => setLink(autoFormatUrl(address_link))}
              required
            />
            
            {!isChangingImage ? (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="relative h-36 w-full rounded-lg border bg-gray-100 overflow-hidden">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    layout="fill"
                    objectFit="contain"
                    className="p-2"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingImage(true)}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <FileUpload
                  label="Upload New Image"
                  accept="image/*"
                  onChange={(file) => setFile(file)}
                  helperText="Select a new image to replace the old one."
                  maxSizeMB={10}
                />
                {/* --- THIS IS THE UPDATED BUTTON --- */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    'text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700',
                    'focus:ring-red-500' // Optional: for focus state
                  )}
                  onClick={handleCancelImageChange}
                >
                  Cancel Change
                </Button>
              </div>
            )}
            
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" form="edit-banner-form" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}