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
import { Edit, Calendar, DollarSign } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { ReimbursementForm } from './ReimbursementForm';

interface ReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  existingRequest?: any;
}

export function ReimbursementModal({ isOpen, onClose, type, existingRequest }: ReimbursementModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // State
  const [amount, setAmount] = useState(existingRequest?.amount?.toString() || '');
  const [details, setDetails] = useState(existingRequest?.details || '');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Status Logic
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that the details and receipts are correct.');
      return;
    }
    if (!amount || !details) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!receipt && !existingRequest) {
        toast.error('Please upload the official receipt.');
        return;
    }

    setIsLoading(true);
    try {
      // Mock Submission
      console.log({ type, amount, details, receipt });
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(isResubmit ? 'Correction submitted!' : 'Reimbursement request submitted!');
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
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'New Reimbursement'}
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {existingRequest && (status === 'Resubmit' || status === 'Approved') && (
             <AdminCommentAlert status={status} comment={adminComment || ''} />
          )}

          <ReimbursementForm 
             type={type}
             amount={amount} setAmount={setAmount}
             details={details} setDetails={setDetails}
             receipt={receipt} setReceipt={setReceipt}
             isReadOnly={!isEditing}
          />

           {isEditing && (
            <div className="pt-4 border-t">
              <Checkbox
                label="I certify that the expenses incurred are valid and the receipt is authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

          {existingRequest && !isEditing && (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                 <div>
                     <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                     <div className="mt-1"><StatusBadge status={status} /></div>
                 </div>
                 <div className="text-right">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                     <div className="flex items-center justify-end gap-2 mt-1 text-sm font-medium text-gray-900">
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
                    {isResubmit ? 'Submit Correction' : 'Submit Request'}
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