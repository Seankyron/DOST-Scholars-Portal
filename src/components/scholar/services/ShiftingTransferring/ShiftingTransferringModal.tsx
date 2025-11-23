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
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Calendar } from 'lucide-react';
import { ShiftingForm } from './ShiftingForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import type { ShiftingType } from '@/types';

interface ShiftingTransferringModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ShiftingType;
  existingRequest?: any;
}

export function ShiftingTransferringModal({ isOpen, onClose, type, existingRequest }: ShiftingTransferringModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';
  
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that your uploaded documents are correct.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="3xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Application' : 'View Application') : 'Application Form'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
             Type: <span className="font-semibold text-dost-title">{type}</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {showAdminAlert && (
            <AdminCommentAlert status={status} comment={adminComment} />
          )}

          <ShiftingForm 
            type={type}
            isReadOnly={!isEditing}
            isResubmit={isResubmit}
            adminComment={adminComment}
          />

          {isEditing && (
            <div className="pt-4 border-t">
              <Checkbox
                label="I confirm that the uploaded documents are correct, clear, and authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

          {existingRequest && !isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                    <div><StatusBadge status={status} /></div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
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
                {isResubmit ? 'Submit Corrections' : 'Submit Application'}
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
                   Edit Application
                 </Button>
               )}
             </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}