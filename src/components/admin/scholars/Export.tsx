'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ExportProps {
  label?: string; // Button label
  accept?: string; // Accepted file types
  onFileSelect?: (file: File) => void; // Callback when file is selected
}

export default function Export({
  label = 'Export',
  accept = '.csv, .xlsx, .xls',
  onFileSelect,
}: ExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger hidden file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      if (onFileSelect) onFileSelect(file);
      else alert(`File "${file.name}" selected!`);
    }
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />

      {/* Upload/Export Button */}
      <Button variant="outline" size="sm" onClick={handleUploadClick}>
        <Upload className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </>
  );
}
