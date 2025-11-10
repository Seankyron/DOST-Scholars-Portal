'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { type Database } from '@/lib/supabase/type';


interface Banner {
  title: string;
  address_link: string;
  image_file_key: string;
}

interface BannerUploadProps {
  onAddBanner: (banner: Banner) => void;
}


export function BannerUpload({ onAddBanner }: BannerUploadProps) {
  const [title, setTitle] = useState('');
  const [address_link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title || !address_link) return;

    setIsUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `banners/${timestamp}.${fileExt}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Create new event via API
      
      const res = await fetch('/api/admin/events/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          address_link,
          image_file_key: fileName,
        }),
      });
      console.log(res)
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.error || 'Failed to create event');

      onAddBanner({
        title,
        address_link,
        image_file_key: fileName,
      });

      // Reset form
      setTitle('');
      setLink('');
      setFile(null);
      setPreview('');
      const fileInput = document.getElementById('upload-banner') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('Upload failed:', error.message);
      alert('Failed to upload banner: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 transition-colors hover:border-dost-blue">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="upload-banner"
        />
        <label htmlFor="upload-banner" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                📄 Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PNG, JPG, WEBP • Max 10MB
              </p>
            </div>
          </div>
        </label>
        {preview && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={112}
              className="mx-auto max-h-36 w-auto object-contain rounded border"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
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
          required
        />
        <Button type="submit" className="sm:self-end" variant="primary" disabled={isUploading}>
          {isUploading ? 'Uploading...' : '+ Add Banner'}
        </Button>
      </div>
    </form>
  );
}
