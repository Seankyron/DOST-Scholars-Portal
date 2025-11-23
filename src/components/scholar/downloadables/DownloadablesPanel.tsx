'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { downloadableFiles } from '@/config/downloadables';
import { CategoryAccordion } from './CategoryAccordion';
import { DownloadItem } from './DownloadItem';
import { FileCheck} from 'lucide-react';


export function DownloadablesPanel() {
  // Separate 'general' from other categories
  const { general, ...serviceFiles } = downloadableFiles;
  const serviceCategories = Object.keys(serviceFiles);

  return (
    <div className="space-y-8">

      {/* --- 1. General Documents (Card View) --- */}
      {general && general.length > 0 && (
        <Card className="shadow-md bg-white border-none">
          <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-dost-title      flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-dost-title" />
              General Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {general.map((file, idx) => (
                <DownloadItem key={`general-${idx}`} file={file} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- 2. Service-Specific Files (Accordion View) --- */}
      <Card className="shadow-md bg-white border-none">
          <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-dost-title flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-dost-title" />
            Service Templates & Forms
          </CardTitle>
          <p className="text-sm text-gray-500">
            Select a category to view available downloads.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="multiple" className="w-full">
            {serviceCategories.map((key) => (
              <CategoryAccordion 
                key={key} 
                categoryKey={key} 
                files={serviceFiles[key as keyof typeof serviceFiles]} 
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}