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

export function EditBannerModal({ banner, open, onClose, onUpdate }) {
  const [formData, setFormData] = useState({ ...banner });

  useEffect(() => {
    setFormData({ ...banner });
  }, [banner]);

  const handleChange = (field: string, value: any) => {
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
