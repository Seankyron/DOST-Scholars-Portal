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

interface ViewScholarModalProps {
  scholar: ScholarRowData; // <-- Use ScholarRowData
  onClose: () => void;
  open: boolean; // <-- 1. Add open prop
}

export function ViewScholarModal({
  scholar,
  onClose,
  open, // <-- 2. Accept open prop
}: ViewScholarModalProps) {
  return (
    <Modal open={open} onOpenChange={onClose}>
      {' '}
      {/* <-- 3. Use open prop */}
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>View Scholar</ModalTitle>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <p>
            <strong>Name:</strong> {scholar.name}
          </p>
          <p>
            <strong>SPAS ID:</strong> {scholar.scholarId}
          </p>
          <p>
            <strong>Email:</strong> {scholar.email}
          </p>
          <p>
            <strong>University:</strong> {scholar.university}
          </p>
          <p>
            <strong>Program:</strong> {scholar.program}
          </p>
          <p>
            <strong>Status:</strong> {scholar.status}
          </p>
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