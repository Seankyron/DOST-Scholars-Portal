'use client';

import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadableFile {
  name: string;
  filename: string;
  url: string;
  size: string;
}

interface DownloadItemProps {
  file: DownloadableFile;
}

export function DownloadItem({ file }: DownloadItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
      <div className="flex items-center gap-4 min-w-0">
        {/* Icon Box */}
        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-dost-title group-hover:scale-105 transition-all duration-300">
          <FileText className="h-6 w-6 text-dost-title group-hover:text-white transition-colors" />
        </div>
        
        {/* Text Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-dost-title transition-colors">
            {file.name}
          </h4>
          <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
            <span className="truncate max-w-[150px] sm:max-w-[200px]" title={file.filename}>
              {file.filename}
            </span>
            <span className="text-gray-300">•</span>
            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
              {file.size}
            </span>
          </p>
        </div>
      </div>

      {/* Download Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className="h-9 w-9 p-0 rounded-full text-gray-400 hover:text-dost-title hover:bg-blue-50 ml-2 flex-shrink-0"
      >
        <a href={file.url} target="_blank" rel="noopener noreferrer" download title="Download File">
          <Download className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}