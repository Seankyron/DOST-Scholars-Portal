'use client';

import { CheckCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FileDisplayReadOnlyProps {
  label: string;
  fileName: string;
  fileUrl?: string;
  className?: string;
}

export function FileDisplayReadOnly({ 
  label, 
  fileName, 
  fileUrl,
  className 
}: FileDisplayReadOnlyProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className={cn(
        'relative border-2 border-dashed rounded-lg p-4 transition-colors',
        'border-green-500 bg-green-50/50' // Consistent success styling
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
              <p className="text-xs text-green-700 font-medium">
                File submitted.
              </p>
            </div>
          </div>
          
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-700 hover:bg-green-100 rounded-full transition-colors"
              title="View/Download File"
            >
              <Download className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}