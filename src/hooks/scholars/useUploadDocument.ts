import { useCallback } from 'react';
import { toast } from '@/components/ui/toaster';

export function useUploadDocument() {
  const uploadDocument = useCallback(async (file: File, folder: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/scholar/file-upload', { method: 'POST', body: formData });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      return null;
    }
  }, []);

  return { uploadDocument };
}