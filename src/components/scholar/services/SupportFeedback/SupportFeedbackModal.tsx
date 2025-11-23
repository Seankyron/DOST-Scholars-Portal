// src/components/scholar/services/SupportFeedback/SupportFeedbackModal.tsx
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
import { Button } from '@/components/ui/button';
import { Calendar, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { FeedbackForm } from './FeedbackForm';

interface SupportFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  existingRequest?: any;
}

export function SupportFeedbackModal({ isOpen, onClose, category, existingRequest }: SupportFeedbackModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [message, setMessage] = useState(existingRequest?.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Logic
  const status = existingRequest?.status;
  const adminResponse = existingRequest?.adminResponse;
  
  // Initial Mode: Edit if New Request OR Pending (allow updates)
  const [isEditing, setIsEditing] = useState(!existingRequest || status === 'Pending');

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm your submission.');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      console.log({ category, message, file });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Ticket submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Ticket' : 'View Ticket') : 'Create Support Ticket'}
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {/* Show Admin Response if Resolved */}
          {existingRequest && status === 'Approved' && adminResponse && (
             <AdminCommentAlert status="Approved" comment={adminResponse} />
          )}

          <FeedbackForm 
             category={category}
             message={message} setMessage={setMessage}
             file={file} setFile={setFile}
             isConfirmed={isConfirmed} setIsConfirmed={setIsConfirmed}
             isReadOnly={!isEditing}
          />

          {/* Footer Info (Read-Only Mode) */}
          {existingRequest && !isEditing && (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                 <div>
                     <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                     <div className="mt-1">
                        <StatusBadge status={status}>
                            {status === 'Approved' ? 'Resolved' : status}
                        </StatusBadge>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Submitted</span>
                     <div className="flex items-center gap-2 mt-1 text-sm font-medium text-gray-900">
                         <Calendar className="h-4 w-4 text-gray-500" />
                         {formatDate(existingRequest.dateSubmitted)}
                     </div>
                 </div>
             </div>
          )}
        </ModalBody>

        <ModalFooter>
           {isEditing ? (
              <>
                <ModalClose asChild>
                    <Button variant="outline" disabled={isLoading}>Cancel</Button>
                </ModalClose>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
                    Submit Ticket
                </Button>
              </>
           ) : (
              <>
                 <ModalClose asChild>
                    <Button variant="outline">Close</Button>
                 </ModalClose>
                 {status === 'Pending' && (
                    <Button onClick={() => setIsEditing(true)}>
                       <Edit className="h-4 w-4 mr-2" />
                       Update Ticket
                    </Button>
                 )}
              </>
           )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}