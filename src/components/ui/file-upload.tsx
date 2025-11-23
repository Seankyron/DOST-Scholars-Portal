'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { Upload, FileText, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  id?: string;             // Added to fix type error
  value?: File | null;     // Added for controlled state (resetting files)
  disabled?: boolean;      // Added for read-only mode
  label?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  error?: string;
  required?: boolean;
  helperText?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  id,
  value,
  disabled = false,
  label,
  accept = '.pdf',
  onChange,
  error,
  required,
  helperText,
  maxSizeMB = 10,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if the parent component updates the 'value' prop
  useEffect(() => {
    if (value !== undefined) {
      setFile(value);
    }
  }, [value]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (selectedFile: File | null) => {
    if (disabled) return; // Prevent changes if disabled
    setFile(selectedFile);
    onChange?.(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return; // Prevent drop if disabled
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleRemove = () => {
    if (disabled) return; // Prevent removal if disabled
    handleFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all',
          // Dynamic styling based on state
          disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75' 
            : isDragging 
              ? 'border-dost-blue bg-blue-50' 
              : error 
                ? 'border-red-500 bg-white' 
                : 'border-gray-300 bg-white hover:border-dost-blue cursor-pointer'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={triggerUpload}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          disabled={disabled}
        />

        {!file ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className={cn("h-10 w-10", disabled ? "text-gray-300" : "text-gray-400")} />
            <div>
              <p className={cn("text-sm font-medium", disabled ? "text-gray-400" : "text-gray-700")}>
                {disabled 
                  ? "Upload disabled" 
                  : isDragging 
                    ? "Drop your file here" 
                    : "Click to upload or drag and drop"
                }
              </p>
              {!disabled && (
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: {accept} • Max {maxSizeMB}MB per file
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className={cn(
            "flex items-center justify-between",
            isDragging && "opacity-50"
          )}>
            <div className="flex items-center gap-3 min-w-0">
              {preview ? (
                <img
                  src={preview}
                  alt={file.name}
                  className="h-10 w-10 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {file.type === 'application/pdf' ? (
                    <FileText className="h-6 w-6 text-red-600" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-500" />
                  )}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate break-all">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {/* Only show remove button if NOT disabled */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {isDragging && !disabled && file && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50/50">
            <Upload className="h-10 w-10 text-dost-blue" />
            <p className="text-sm font-medium text-dost-blue mt-2">
              Drop to replace the current file
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}