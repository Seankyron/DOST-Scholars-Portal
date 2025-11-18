'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { FlippableStipendCard } from './FlippableStipendCard';
import { StipendUpdates } from './StipendUpdates';

interface StipendDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Uses the StipendData type structure
  title: string;
}

export function StipendDetailsModal({ isOpen, onClose, data, title }: StipendDetailsModalProps) {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const handleFlip = (cardId: string) => {
    setFlippedCard((prev) => (prev === cardId ? null : cardId));
  };

  if (!data) return null;

  const receivedAllowances = data.breakdown.filter((i: any) => i.status === 'Released');
  const pendingAllowances = data.breakdown.filter((i: any) => i.status !== 'Released');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="4xl">
        <ModalHeader>
          <ModalTitle>{title} - Stipend Breakdown</ModalTitle>
          <p className="text-sm text-gray-500 font-normal">
             Academic Year: <span className="font-semibold text-dost-title">2023-2024</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
          
          {/* 1. Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlippableStipendCard
              title="Total Received"
              value={data.received}
              tooltip="Total amount credited to your Landbank account."
              variant="success"
              breakdown={receivedAllowances}
              isFlipped={flippedCard === 'received'}
              onFlip={() => handleFlip('received')}
            />
            <FlippableStipendCard
              title={data.onHold ? 'On Hold' : 'Pending Release'}
              value={data.pending}
              tooltip={data.onHold ? 'Amount withheld pending requirements.' : 'Amount being processed.'}
              variant={data.onHold ? 'warning' : 'pending'}
              breakdown={pendingAllowances}
              isFlipped={flippedCard === 'pending'}
              onFlip={() => handleFlip('pending')}
            />
            <FlippableStipendCard
              title="Expected Total"
              value={data.total}
              tooltip="Total expected allowance for this term."
              variant="info"
              breakdown={data.breakdown}
              isFlipped={flippedCard === 'total'}
              onFlip={() => handleFlip('total')}
            />
          </div>

          {/* 2. Updates Timeline */}
          <div>
             <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Updates</h4>
             <StipendUpdates updates={data.updates} />
          </div>

        </ModalBody>

      </ModalContent>
    </Modal>
  );
}