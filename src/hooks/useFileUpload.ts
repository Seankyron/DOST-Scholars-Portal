'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { isValidFileType, isValidFileSize } from '@/lib/utils/file';

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useFileUpload(bucketName: string) {
  const [uploads, setUploads] = useState<Record<string, UploadProgress>>({});

  const uploadFile = useCallback(
    async (
      file: File,
      path: string,
      options?: {
        acceptedTypes?: string[];
        maxSizeMB?: number;
      }
    ): Promise<string | null> => {
      const { acceptedTypes = ['.pdf'], maxSizeMB = 10 } = options || {};

      // Validation
      if (!isValidFileType(file, acceptedTypes)) {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            fileName: file.name,
            progress: 0,
            status: 'error',
            error: 'Invalid file type',
          },
        }));
        return null;
      }

      if (!isValidFileSize(file, maxSizeMB)) {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            fileName: file.name,
            progress: 0,
            status: 'error',
            error: `File size must be less than ${maxSizeMB}MB`,
          },
        }));
        return null;
      }

      // Start upload
      setUploads(prev => ({
        ...prev,
        [file.name]: {
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        },
      }));

      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(path, file, {
            upsert: true,
          });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        setUploads(prev => ({
          ...prev,
          [file.name]: {
            fileName: file.name,
            progress: 100,
            status: 'success',
          },
        }));

        return urlData.publicUrl;
      } catch (error: any) {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            fileName: file.name,
            progress: 0,
            status: 'error',
            error: error.message || 'Upload failed',
          },
        }));
        return null;
      }
    },
    [bucketName]
  );

  const clearUploads = useCallback(() => {
    setUploads({});
  }, []);

  return {
    uploads,
    uploadFile,
    clearUploads,
  };
}
