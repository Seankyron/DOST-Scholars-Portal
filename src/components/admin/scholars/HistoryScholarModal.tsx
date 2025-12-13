'use client';

import { useState, useEffect } from 'react';
import { type ScholarRowData } from './ScholarRow';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/ui/modal';
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/date'; 
import { StatusBadge } from '@/components/shared/StatusBadge';

// Define the shape of the data from all_transactions_view
interface Transaction {
  id: string;
  activity: string;
  created_at: string;
  status: string;
  type: string;
  spas_id: string;
}

interface HistoryScholarModalProps {
  scholar: ScholarRowData;
  onClose: () => void;
  open: boolean;
}

export function HistoryScholarModal({
  scholar,
  onClose,
  open,
}: HistoryScholarModalProps) {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data when modal opens or scholar changes
  useEffect(() => {
    if (open && scholar.scholarId) {
      fetchHistory();
    }
  }, [open, scholar.scholarId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        view: 'all_transactions_view',
        column: 'spas_id',       // Filter by this column
        value: scholar.scholarId, // Value to match
        orderBy: 'created_at',
        ascending: 'false',      // Newest first
      });

      const res = await fetch(`/api/admin/get_view?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch history');
      }

      const result = await res.json();
      setHistory(result.data || []);
    } catch (error) {
      console.error('Error fetching scholar history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent size="2xl" className="max-h-[85vh] flex flex-col">
        <ModalHeader>
          <ModalTitle>
            Scholar History: <span className="text-dost-title">{scholar.firstName} {scholar.surname}</span>
          </ModalTitle>
        </ModalHeader>
        
        <div className="flex-1 overflow-y-auto p-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
              <p className="text-sm text-gray-500">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed m-4">
              <p className="text-gray-500">No history records found for this scholar.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Activity</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                        {item.created_at ? formatDate(item.created_at) : 'N/A'}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {item.activity}
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {item.type || '-'}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={item.status as any} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}