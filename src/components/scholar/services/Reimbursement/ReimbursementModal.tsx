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
import { useSubmitReimbursement, SubmissionData } from '@/hooks/scholars/Post/useSubmitReimbursement';
import { useUploadDocument } from '@/hooks/scholars/Post/useUploadDocument';
import { de } from 'zod/v4/locales';

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
  const [details, setDetails] = useState(existingRequest?.reason || '');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Status Logic
  const status = existingRequest?.status;
  const adminComment = existingRequest?.comment;
  const isResubmit = status === 'Resubmit';
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit);

  const { submitReimbursement, error:submitError } = useSubmitReimbursement();
  const { uploadDocument } = useUploadDocument();
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

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
    const loadingId = toast.loading('Submitting request...');

    try {
      const { url:receiptUrl, error } = await uploadDocument(receipt!, `DOST/${scholar?.spas_id}/reimbursement/${type}/receipt`);
      if (error) return toast.error('Failed to upload document.');

      const data: SubmissionData = {
        type: type,
        amount: amount,
        reason: details, 
        spas_id: scholar?.spas_id,
        receipt_file_key: receiptUrl,
        updated_at: new Date().toISOString()
      };

      if (!existingRequest) {
        await submitReimbursement(data, null);
      }
      else {
        const id = existingRequest.id;
        if (!id) { return toast.error('Failed to update reimbursement request.'); }

        await submitReimbursement(data, id);
      }
      if(submitError) throw new Error('Failed to update reimbursement request.');

      toast.success(isResubmit ? 'Correction submitted!' : 'Reimbursement request submitted!');
      onClose();
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingId);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'New Reimbursement'}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          
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
            <div className="pt-4 border-t mt-4">
              <Checkbox
                label="I confirm that the expenses incurred are valid and the receipt is authentic."
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
                         {formatDate(existingRequest.updated_at)}
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