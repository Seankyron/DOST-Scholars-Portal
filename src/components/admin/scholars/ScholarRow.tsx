'use client';

import { useState } from 'react'; // <-- Import useState
import { Eye, Pencil, History, Trash2 } from 'lucide-react'; // <-- Import Trash2
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ScholarStatus } from '@/types/scholar';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'; // <-- Import ConfirmDialog
import { toast } from '@/components/ui/toaster'; // <-- Import toast

// Interface for the scholar prop
interface Scholar {
  id: string;
  name: string;
  scholarId: string;
  scholarshipType: string;
  university: string;
  yearLevel: string;
  program: string;
  status: ScholarStatus;
  email: string;
  profileImage: string;
}

interface ScholarRowProps {
  scholar: Scholar;
}

export function ScholarRow({ scholar }: ScholarRowProps) {
  // --- ADDED: State to manage the confirmation dialog ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // --- ADDED: Handler for when deletion is confirmed ---
  const handleDelete = () => {
    // In a real app, you would make your API call to delete the scholar here
    // e.g., await deleteScholar(scholar.id);
    console.log(`Deleting scholar: ${scholar.name} (ID: ${scholar.id})`);
    
    // Close the dialog
    setIsConfirmOpen(false);
    
    // Show a success message
    toast.success(`${scholar.name} has been deleted.`);
    
    // You might want to refresh the data on the page after deletion
    // e.g., router.refresh();
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* --- MODIFIED: Profile Picture Removed --- */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {scholar.name}
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.scholarId}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.scholarshipType}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.university}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.yearLevel}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.program}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <StatusBadge status={scholar.status} />
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {scholar.email}
        </td>
        {/* --- MODIFIED: Actions updated to icon buttons --- */}
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => alert(`Viewing details for ${scholar.name}`)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => alert(`Editing scholar ${scholar.name}`)}
            title="Edit Scholar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => alert(`Viewing history for ${scholar.name}`)}
            title="Scholar History"
          >
            <History className="h-4 w-4" />
          </Button>
          
          {/* --- ADDED: Delete button --- */}
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setIsConfirmOpen(true)} // <-- This opens the pop-up
            title="Delete Scholar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      {/* --- ADDED: Confirmation Pop-up (Dialog) --- */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Scholar"
        description={`Are you sure you want to delete ${scholar.name}? This action cannot be undone.`}
        variant="danger"
        confirmText="Yes, delete scholar"
      />
    </>
  );
}