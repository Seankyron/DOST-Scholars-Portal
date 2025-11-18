import { useCallback } from 'react';
import { toast } from '@/components/ui/toaster';

export function useCloudinaryUpload() {
  const uploadDocument = useCallback(async (file: File, folder: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/cloudinary', { method: 'POST', body: formData });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      toast.success(`Uploaded "${file.name}" successfully!`);
      return data.publicId;
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      return null;
    }
  }, []);

  return { uploadDocument };
}
