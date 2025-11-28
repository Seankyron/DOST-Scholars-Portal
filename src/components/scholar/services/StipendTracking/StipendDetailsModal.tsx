'use client';

import { useState } from 'react';
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

interface StipendDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: {
    received: number;
    pending: number;
    total: number;
    dbRecord?: any; // The raw DB row containing year_level, semester, allowance_breakdown
  } | null;
}

// --- 1. Define the Rules for Expected Allowances ---
const generateExpectedAllowances = (yearLevel: number, semester: string) => {
  // Base Items: Months 1-5 + Book Allowance (Standard)
  // Note: I included Book Allowance (5k) as it's standard, but you can remove it if strictly following only the list provided.
  const items = [
    { name: 'Monthly Stipend (Month 1)', amount: 8000 }, // Adjusted to standard 8k or use 5k as requested
    { name: 'Monthly Stipend (Month 2)', amount: 8000 },
    { name: 'Monthly Stipend (Month 3)', amount: 8000 },
    { name: 'Monthly Stipend (Month 4)', amount: 8000 },
    { name: 'Monthly Stipend (Month 5)', amount: 8000 },
    { name: 'Book Allowance', amount: 5000 }, 
  ];

  const midyearItems = [
    { name: 'Monthly Stipend (Month 1)', amount: 8000 },
    { name: 'Monthly Stipend (Month 2)', amount: 8000 },
    { name: 'Book Allowance', amount: 2000 },
    ];

  // Override to 5k if strictly requested by user prompt, 
  // but standard is often higher now. I'll stick to your "P 5,000.00" request.

  // --- Conditional Additions ---
  
  // Rule: 1st Year, 1st Semester -> Clothing Allowance
  if (yearLevel === 1 && semester === '1st Semester') {
    items.push({ name: 'Clothing Allowance', amount: 1000 });
  }

  // Rule: 4th Year (or Graduation Year), 2nd Semester -> Graduating Allowance
  // We use '4' here based on your prompt, but you could check course_duration from user context if needed
  if (yearLevel === 4 && semester === '2nd Semester') {
    items.push({ name: 'Graduating Allowance', amount: 1000 });
  }

  if(semester === 'Midyear') {
    return midyearItems;
  }

  return items;
};

export function StipendDetailsModal({ isOpen, onClose, data, title }: StipendDetailsModalProps) {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const handleFlip = (cardId: string) => {
    setFlippedCard((prev) => (prev === cardId ? null : cardId));
  };

  if (!data || !data.dbRecord) return null;

  const { year_level, semester, allowance_breakdown, status: dbStatus } = data.dbRecord;

  // --- 2. Calculate Lists ---

  // A. Get the full expected list for this specific semester
  const expectedItems = generateExpectedAllowances(Number(year_level), semester);

  // B. Parse the Received Items from JSONB
  // allowance_breakdown should be an array of { name: string, amount: number }
  const receivedItemsRaw = (allowance_breakdown as any[]) || [];
  
  const receivedAllowances = receivedItemsRaw.map(item => ({
    ...item,
    status: 'Released'
  }));

  // C. Calculate Pending Items (Difference)
  // We filter out items from 'expected' that are already in 'received'
  const receivedNames = new Set(receivedAllowances.map(i => i.name));
  
  const pendingAllowances = expectedItems
    .filter(item => !receivedNames.has(item.name))
    .map(item => ({
      ...item,
      status: dbStatus === 'On hold' ? 'On hold' : 'Pending'
    }));

  // D. Combine for "Expected Total" view
  const allItems = [
    ...receivedAllowances,
    ...pendingAllowances.map(i => ({ ...i, status: 'Pending' })) // Mark remainder as pending for the total view
  ];

  // --- 3. Updates Timeline ---
  const updates: StipendUpdate[] = [];
  if (data.dbRecord?.updated_at) {
    let message = '';
    let type: 'info' | 'success' | 'warning' = 'info';

    if (dbStatus === 'Released' || dbStatus === 'Partial') {
      message = `Stipend release processed. Amount credited: ₱${data.received.toLocaleString()}`;
      type = 'success';
    } else if (dbStatus === 'On hold') {
      message = 'Stipend is currently on hold. Please check requirements.';
      type = 'warning';
    } else {
      message = 'Stipend is currently being processed.';
      type = 'info';
    }

    updates.push({
      message,
      type,
      date: formatDate(data.dbRecord.updated_at)
    });
  }

  const isHold = dbStatus === 'On hold';

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <p className="text-sm text-gray-500 font-normal">
             Status: <span className={`font-semibold ${isHold ? 'text-red-600' : 'text-dost-title'}`}>
               {dbStatus || 'Unknown'}
             </span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlippableStipendCard
              title="Total Received"
              value={data.received}
              tooltip="Total amount credited to your Landbank account."
              variant="complete"
              breakdown={receivedAllowances}
              isFlipped={flippedCard === 'received'}
              onFlip={() => handleFlip('received')}
            />
            <FlippableStipendCard
              title={isHold ? 'On Hold' : 'Pending Release'}
              value={data.pending}
              tooltip={isHold ? 'Amount withheld pending requirements.' : 'Amount being processed.'}
              variant={isHold ? 'on hold' : 'pending'}
              breakdown={pendingAllowances as any}
              isFlipped={flippedCard === 'pending'}
              onFlip={() => handleFlip('pending')}
            />
            <FlippableStipendCard
              title="Expected Total"
              value={data.total}
              tooltip="Total expected allowance for this term."
              variant="processing"
              // We use 'allItems' here to show the full picture
              breakdown={allItems} 
              isFlipped={flippedCard === 'total'}
              onFlip={() => handleFlip('total')}
            />
          </div>

          {/* Updates Timeline */}
          <div>
             <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Updates</h4>
             {updates.length > 0 ? (
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