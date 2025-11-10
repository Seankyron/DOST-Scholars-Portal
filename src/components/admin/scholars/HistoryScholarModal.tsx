'use client';

// --- MODIFICATION: Import the correct type ---
import { type ScholarRowData } from './ScholarRow';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/ui/modal';

interface HistoryScholarModalProps {
  scholar: ScholarRowData; // <-- Use ScholarRowData
  onClose: () => void;
  open: boolean; // <-- 1. Add open prop
}

export function HistoryScholarModal({
  scholar,
  onClose,
  open, // <-- 2. Accept open prop
}: HistoryScholarModalProps) {
  return (
    <Modal open={open} onOpenChange={onClose}>
      {' '}
      {/* <-- 3. Use open prop */}
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>Scholar History</ModalTitle>
        </ModalHeader>
        <div className="p-6 space-y-4">
          {/* Replace with actual history data */}
          <p>No history data available for {scholar.name}.</p>
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