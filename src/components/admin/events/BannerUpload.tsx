'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Plus } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/components/ui/toaster'; 

interface Banner {
  title: string;
  link: string;
  image: string; 
}

interface BannerUploadProps {
  onAddBanner: (banner: Banner) => void;
}

export function BannerUpload({ onAddBanner }: BannerUploadProps) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title || !link || !preview) {
      // --- 2a. Add error toast ---
      toast.error('Please fill all fields and upload an image.');
      return;
    }

    const newBanner: Banner = {
      title,
      link,
      image: preview, // Pass the object URL
    };

    onAddBanner(newBanner);
    toast.success('Banner added successfully!'); // <-- 2b. Add success toast

    setTitle('');
    setLink('');
    setFile(null);
    setPreview('');
    // Reset file input
    const fileInput = document.getElementById(
      'upload-banner'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* --- Updated Dropzone --- */}
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
              height={112} // 16:9 ratio
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
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        {/* --- 3. Fix the button --- */}
        <Button type="submit" className="sm:self-end" variant="primary">
          <Plus/>
        </Button>
      </div>
    </form>
  );
}