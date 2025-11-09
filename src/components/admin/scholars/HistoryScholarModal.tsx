'use client';

import { Scholar } from './ScholarRow';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/modal';

interface HistoryScholarModalProps {
  scholar: Scholar;
  onClose: () => void;
}

export function HistoryScholarModal({ scholar, onClose }: HistoryScholarModalProps) {
  return (
    <Modal open={true} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>Scholar History</ModalTitle>
        </ModalHeader>
        <div className="p-6 space-y-4">
          {/* Replace with actual history data */}
          <p>No history data available for {scholar.name}.</p>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
