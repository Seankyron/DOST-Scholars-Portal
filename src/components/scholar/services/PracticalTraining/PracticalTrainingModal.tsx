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
import { Calendar, Edit } from 'lucide-react'; 
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { formatDate } from '@/lib/utils/date'; 
import { ReferralRequestForm } from './ReferralRequestForm';
import { CompletionSubmissionForm } from './CompletionSubmissionForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { toast } from '@/components/ui/toaster';
import { PTPTransactionType } from './PracticalTrainingPanel';

interface PracticalTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PTPTransactionType;
  existingRequest?: any;
}

export function PracticalTrainingModal({ isOpen, onClose, type, existingRequest }: PracticalTrainingModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Derived State
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';
  
  // Determine initial editing state
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  // Form States (Referral)
  const [plan, setPlan] = useState<string>(existingRequest?.ptpPlan || '');
  const [grades, setGrades] = useState<File | null>(null);
  const [replySlip, setReplySlip] = useState<File | null>(null);

  // Form States (Completion)
  const [form126, setForm126] = useState<File | null>(null);
  const [form127, setForm127] = useState<File | null>(null);
  const [form128, setForm128] = useState<File | null>(null);
  const [dtr, setDtr] = useState<File | null>(null);
  const [certCompletion, setCertCompletion] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    // Validation logic
    if (type === 'Referral Letter') {
       if (!plan && !existingRequest) { toast.error('Please select your Practical Training Plan.'); return; }
       if (!grades && !existingRequest) { toast.error('Please upload your Certified Grades.'); return; }
       if (!replySlip && !existingRequest) { toast.error('Please upload your Reply Slip.'); return; }
    }

    if (type === 'Program Completion') {
       if ((!form126 || !form127 || !form128 || !dtr || !certCompletion) && !existingRequest) {
          toast.error('Please upload all required completion documents.');
          return;
       }
    }

    setIsLoading(true);
    try {
      // Simulate API Submission
      console.log("Submitting:", { type, plan }); 
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Documents submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine if we should show the admin alert
  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="3xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : (type === 'Referral Letter' ? 'Request PTP Referral' : 'Submit PTP Completion')}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
             Transaction: <span className="font-semibold text-dost-title">{type}</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {/* 1. Admin Comment Alert */}
          {showAdminAlert && (
            <AdminCommentAlert status={status} comment={adminComment} />
          )}

          {/* 2. Forms */}
          {type === 'Referral Letter' ? (
            <ReferralRequestForm
               plan={plan} setPlan={setPlan}
               grades={grades} setGrades={setGrades}
               replySlip={replySlip} setReplySlip={setReplySlip}
               isReadOnly={!isEditing}
               isResubmit={isResubmit}
               adminComment={adminComment}
            />
          ) : (
            <CompletionSubmissionForm
               form126={form126} setForm126={setForm126}
               form127={form127} setForm127={setForm127}
               form128={form128} setForm128={setForm128}
               dtr={dtr} setDtr={setDtr}
               certCompletion={certCompletion} setCertCompletion={setCertCompletion}
               isReadOnly={!isEditing}
               isResubmit={isResubmit}
               adminComment={adminComment}
            />
          )}

          {/* 3. Confirmation Checkbox (Only in Edit Mode) */}
          {isEditing && (
            <div className="pt-4 border-t">
              <Checkbox
                label="I confirm that the uploaded documents are correct and complete."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

          {/* 4. Status & Date Information (Read-Only Mode) */}
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
                        {formatDate(existingRequest.timestamp || existingRequest.dateSubmitted)}
                    </div>
                </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
             /* EDIT MODE FOOTER */
             <>
              <ModalClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </ModalClose>
              <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
                {isResubmit ? 'Submit Corrections' : 'Submit'}
              </Button>
             </>
          ) : (
             /* VIEW MODE FOOTER */
             <>
               <ModalClose asChild>
                 <Button variant="outline">Close</Button>
               </ModalClose>

               {/* Edit Button for Pending Requests */}
               {status === 'Pending' && (
                 <Button onClick={() => setIsEditing(true)}>
                   <Edit className="h-4 w-4 mr-2" />
                   Edit Response
                 </Button>
               )}
             </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}