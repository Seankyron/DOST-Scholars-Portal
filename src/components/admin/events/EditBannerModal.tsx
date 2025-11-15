'use client';

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toaster'; // <-- Import toast
import { cn } from '@/lib/utils/cn';

// FIX 1: Change the prop to a simple function
interface BannerUploadProps {
  onAddBanner: () => void;
}

// (Helper functions remain the same)
const autoFormatUrl = (url: string) => {
  const trimmedUrl = url.trim();
  if (trimmedUrl && !trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
};
function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function BannerUpload({ onAddBanner }: BannerUploadProps) {
  const [title, setTitle] = useState('');
  const [address_link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); 
  const inputRef = useRef<HTMLInputElement>(null); 

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
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile ?? null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    } else {
      toast.error('Invalid file type. Please upload an image.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const formattedLink = autoFormatUrl(address_link);
    setLink(formattedLink);

    if (!file || !title || !formattedLink) {
      toast.error('Please fill in all fields and select an image.');
      return;
    }
    if (!isValidUrl(formattedLink)) {
      toast.error('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload file
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

      // 2. Post to API
      const res = await fetch('/api/admin/events/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          address_link: formattedLink,
          image_file_key: fileName,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      // 3. Call the parent's refetch function
      onAddBanner(); // <-- FIX 2

      // 4. Reset form
      setTitle('');
      setLink('');
      setFile(null);
      if (inputRef.current) inputRef.current.value = ''; 
    } catch (error: any) {
      console.error('Upload failed:', error.message);
      toast.error('Failed to upload banner: ' + error.message); // Use toast
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // ... (The form JSX remains unchanged from our previous fix) ...
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center text-gray-500 transition-colors',
          'flex flex-col items-center justify-center min-h-[160px]',
          isDragging ? 'border-dost-blue bg-blue-50' : 'border-gray-300',
          'cursor-pointer hover:border-dost-blue'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="upload-banner"
          ref={inputRef}
        />
        {!file ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                📄 {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PNG, JPG, WEBP • Max 10MB
              </p>
            </div>
          </div>
        ) : isDragging ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-10 w-10 text-dost-blue" />
            <p className="text-sm font-medium text-dost-blue mt-2">
              Drop to replace the current image
            </p>
          </div>
        ) : (
          preview && (
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={200}
                height={112}
                className="mx-auto max-h-36 w-auto object-contain rounded border"
              />
              <p className="text-xs text-gray-500 mt-2">
                Click or drag to replace this image
              </p>
            </div>
          )
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
          onBlur={() => setLink(autoFormatUrl(address_link))}
          required
        />
        <Button type="submit" className="sm:self-end" variant="primary" disabled={isUploading}>
          {isUploading ? 'Uploading...' : '+'}
        </Button>
      </div>
    </form>
  );
}