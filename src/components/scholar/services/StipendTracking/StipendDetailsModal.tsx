'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { FlippableStipendCard } from './FlippableStipendCard';
import { StipendUpdates, type StipendUpdate } from './StipendUpdates';
import { formatDate } from '@/lib/utils/date';
import { createClient } from '@/lib/supabase/client';

interface StipendDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: {
    received: number;
    pending: number;
    total: number;
    dbRecord?: any; 
  } | null;
}

export function StipendDetailsModal({ isOpen, onClose, data, title }: StipendDetailsModalProps) {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [updates, setUpdates] = useState<StipendUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  const handleFlip = (cardId: string) => {
    setFlippedCard((prev) => (prev === cardId ? null : cardId));
  };

  useEffect(() => {
    async function fetchUpdates() {
      if (!isOpen || !data?.dbRecord?.spas_id) return;
      
      setLoadingUpdates(true);
      const supabase = createClient();
      
      try {
        const { data: activities, error } = await supabase
          .from('Recent Activities')
          .select('activity, status, created_at, type')
          .eq('spas_id', data.dbRecord.spas_id)
          .eq('activity', 'Stipend Tracking')
          .eq('year_level', data.dbRecord.year_level)
          .eq('semester', data.dbRecord.semester)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching stipend updates:', error);
          return;
        }
        
        console.log('Data: ', activities)
        const mappedUpdates: StipendUpdate[] = (activities || []).map((item) => {
          let type: 'info' | 'success' | 'warning' = 'info';
          // Logic: Pending -> info, Released -> success, On hold -> warning
          // Note: 'Partial' status often treated similarly to Released or Pending depending on context, 
          // but strict rules were: Pending->info, Released->success, On hold->warning.
          
          const statusLower = item.status?.toLowerCase() || '';
          
          if (statusLower === 'released') {
            type = 'success';
          } else if (statusLower === 'on hold') {
            type = 'warning';
          } else {
            // Default to info for Pending and others
            type = 'info';
          }
          
          return {
            message: item.type || 'Stipend update', // 'activity' column often holds the description
            type,
            date: formatDate(item.created_at)
          };
        });
        
        console.log("Mapped Updates: ", mappedUpdates)
        setUpdates(mappedUpdates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUpdates(false);
      }
    }

    fetchUpdates();
  }, [isOpen, data?.dbRecord?.spas_id]);


  if (!data || !data.dbRecord) return null;

  const { allowance_breakdown, status: dbStatus } = data.dbRecord;

  // --- Calculate Lists from allowance_breakdown Column ---
  const allItems = (allowance_breakdown as any[]) || [];
  const receivedAllowances = allItems.filter((item: any) => item.status === 'Released');
  const pendingAllowances = allItems.filter((item: any) => item.status !== 'Released');

  const calculatedReceived = receivedAllowances.reduce((sum, item) => sum + (item.amount || 0), 0);
  const calculatedPending = pendingAllowances.reduce((sum, item) => sum + (item.amount || 0), 0);
  const calculatedTotal = allItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const isHold = dbStatus === 'On hold';

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <p className="text-sm text-gray-500 font-normal">
             Status: <span className={`font-semibold ${isHold ? 'text-red-600' : 'text-dost-title'}`}>
               {dbStatus || 'Unknown'}
             </span>
          </p>
        </ModalHeader>

        <ModalBody>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlippableStipendCard
              title="Total Received"
              value={calculatedReceived}
              tooltip="Total amount credited to your Landbank account."
              variant="complete"
              breakdown={receivedAllowances}
              isFlipped={flippedCard === 'received'}
              onFlip={() => handleFlip('received')}
            />
            <FlippableStipendCard
              title={isHold ? 'On Hold' : 'Pending Release'}
              value={calculatedPending}
              tooltip={isHold ? 'Amount withheld pending requirements.' : 'Amount being processed.'}
              variant={isHold ? 'on hold' : 'pending'}
              breakdown={pendingAllowances}
              isFlipped={flippedCard === 'pending'}
              onFlip={() => handleFlip('pending')}
            />
            <FlippableStipendCard
              title="Expected Total"
              value={calculatedTotal}
              tooltip="Total expected allowance for this term."
              variant="processing"
              breakdown={allItems} 
              isFlipped={flippedCard === 'total'}
              onFlip={() => handleFlip('total')}
            />
          </div>

          {/* Updates Timeline */}
          <div>
             <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Updates</h4>
             {loadingUpdates ? (
               <p className="text-sm text-gray-500 italic">Loading updates...</p>
             ) : updates.length > 0 ? (
               <StipendUpdates updates={updates} />
             ) : (
               <p className="text-sm text-gray-500 italic">No recent updates available.</p>
             )}
          </div>

        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}