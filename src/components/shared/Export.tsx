'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportProps {
  data: any[];       // The data to export (array of objects)
  fileName?: string; // The name of the downloaded file
  label?: string;    // Button label
}

export default function Export({
  data,
  fileName = 'Exported_Data',
  label = 'Export to Excel',
}: ExportProps) {

  const handleExport = () => {
    // 1. Create a new workbook
    const wb = XLSX.utils.book_new();

    // 2. Convert JSON data to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // 3. Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 4. Write file and trigger download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport}
      disabled={!data || data.length === 0} // Disable if no data
    >
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}