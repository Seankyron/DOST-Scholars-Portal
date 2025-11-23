'use client';

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { DownloadItem } from './DownloadItem';
import { FolderOpen } from 'lucide-react';

interface CategoryAccordionProps {
  categoryKey: string;
  files: Array<{
    name: string;
    filename: string;
    url: string;
    size: string;
  }>;
}

const formatTitle = (key: string) => {
  if (key === 'general') return 'General Documents';
  if (key === 'faqs') return 'Frequently Asked Questions';
  return key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function CategoryAccordion({ categoryKey, files }: CategoryAccordionProps) {
  const title = formatTitle(categoryKey);

  return (
    <AccordionItem value={categoryKey} className="border-b border-gray-100 last:border-0">
      <AccordionTrigger 
        // Added 'hover:no-underline' to remove the default hover effect
        className="hover:no-underline hover:bg-gray-50 px-6 py-4 group transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-md text-dost-blue group-hover:bg-dost-title group-hover:text-white transition-colors">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="block text-base font-semibold text-gray-800 group-hover:text-dost-title transition-colors">
              {title}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {files.length} {files.length === 1 ? 'file' : 'files'} available
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6 pt-2 bg-gray-50/30">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
          {files.map((file, index) => (
            <DownloadItem key={`${file.filename}-${index}`} file={file} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}