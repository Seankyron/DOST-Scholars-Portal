'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function BannerUpload({ onAddBanner }) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title || !link) return;

    const newBanner = {
      title,
      link,
      image: URL.createObjectURL(file),
    };

    onAddBanner(newBanner);
    setTitle('');
    setLink('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
          id="upload-banner"
        />
        <label htmlFor="upload-banner" className="cursor-pointer">
          📁 Click to upload or drag and drop
        </label>
        <p className="text-sm mt-1">Supported formats: PNG, JPG, WEBP</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Address Link *"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button type="submit">+ Add Banner</Button>
      </div>
    </form>
  );
}
