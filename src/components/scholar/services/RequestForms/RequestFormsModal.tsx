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
import { Calendar, Edit } from 'lucide-react'; // Import Edit icon
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { RequestForm } from './RequestForm';
import type { RequestFormType } from '@/types/services';

interface RequestFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: RequestFormType;
  existingRequest?: any;
}

export function RequestFormsModal({ isOpen, onClose, type, existingRequest }: RequestFormsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // State
  const [reason, setReason] = useState(existingRequest?.reason || '');
  const [details, setDetails] = useState(existingRequest?.details || '');
  const [file, setFile] = useState<File | null>(null); // File state
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Status Logic
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';
  
  // --- EDIT MODE LOGIC ---
  // Default to Editing if: New Request OR Resubmit OR Pending
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm your request.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Brief reason is required.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock Submission
      console.log({ type, reason, details, file });
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(isResubmit ? 'Correction submitted!' : 'Request submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'New Request'}
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {existingRequest && (status === 'Resubmit' || status === 'Approved') && (
             <AdminCommentAlert status={status} comment={adminComment || ''} />
          )}

          <RequestForm 
             type={type}
             reason={reason} setReason={setReason}
             details={details} setDetails={setDetails}
             file={file} setFile={setFile}
             isConfirmed={isConfirmed} setIsConfirmed={setIsConfirmed}
             isReadOnly={!isEditing} // Pass the read-only state
          />

          {/* Footer Info (Only in Read-Only Mode) */}
          {existingRequest && !isEditing && (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                 <div>
                     <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                     <div className="mt-1"><StatusBadge status={status} /></div>
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
              /* --- EDIT MODE FOOTER --- */
              <>
                <ModalClose asChild>
                    <Button variant="outline" disabled={isLoading}>Cancel</Button>
                </ModalClose>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
                    {isResubmit ? 'Submit Correction' : 'Submit Request'}
                </Button>
              </>
           ) : (
              /* --- VIEW MODE FOOTER --- */
              <>
                 <ModalClose asChild>
                    <Button variant="outline">Close</Button>
                 </ModalClose>
                 
                 {/* The Edit Button: Only show if status is Pending */}
                 {status === 'Pending' && (
                    <Button onClick={() => setIsEditing(true)}>
                       <Edit className="h-4 w-4 mr-2" />
                       Edit Request
                    </Button>
                 )}
              </>
           )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}