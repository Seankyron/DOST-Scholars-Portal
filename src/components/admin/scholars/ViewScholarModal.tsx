'use client';

import { Scholar } from './ScholarRow';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/modal';

interface ViewScholarModalProps {
  scholar: Scholar;
  onClose: () => void;
}

export function ViewScholarModal({ scholar, onClose }: ViewScholarModalProps) {
  return (
    <Modal open={true} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>View Scholar</ModalTitle>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <p><strong>Name:</strong> {scholar.name}</p>
          <p><strong>SPAS ID:</strong> {scholar.scholarId}</p>
          <p><strong>Email:</strong> {scholar.email}</p>
          <p><strong>University:</strong> {scholar.university}</p>
          <p><strong>Program:</strong> {scholar.program}</p>
          <p><strong>Status:</strong> {scholar.status}</p>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
