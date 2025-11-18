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
import { MedicalPersonalForm } from './MedicalPersonalForm';
import { ExchangeStudentForm } from './ExchangeStudentForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';
import type { LOAReason } from '@/types';

interface LeaveOfAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: LOAReason;
  existingRequest?: any; // Optional prop for viewing history
}

export function LeaveOfAbsenceModal({ isOpen, onClose, reason, existingRequest }: LeaveOfAbsenceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [appForm, setAppForm] = useState<File | null>(null);
  const [univApproval, setUnivApproval] = useState<File | null>(null);
  const [grades, setGrades] = useState<File | null>(null);
  const [financialBreakdown, setFinancialBreakdown] = useState<File | null>(null);
  const [medCert, setMedCert] = useState<File | null>(null);
  const [otherDocs, setOtherDocs] = useState<File | null>(null);
  const [regForm, setRegForm] = useState<File | null>(null);
  const [proofAdmission, setProofAdmission] = useState<File | null>(null);

  const { uploadFile } = useFileUpload('leave-of-absence');

  // If viewing an existing request, we might want to show its status or prevent editing
  const isReadOnly = !!existingRequest && existingRequest.status !== 'Resubmit';
  const showAdminAlert = existingRequest && (existingRequest.status === 'Resubmit' || existingRequest.status === 'Approved');

  const handleSubmit = async () => {
    // 1. Check Confirmation
    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    // 2. Basic Validation (Required Fields)
    if (!appForm) {
        toast.error('Please upload the Application Form for LOA.');
        return;
    }
    
    if (reason === 'Medical/Personal') {
        if (!univApproval) {
             toast.error('Please upload the University Approval.');
             return;
        }
        if (!grades) {
             toast.error('Please upload the Certification of Grades.');
             return;
        }
        // Medical Cert is conditional (only if health reason), but we can't strictly validate "reason" content here easily without more UI.
        // We'll trust the user or add specific logic if you have a "Health" radio button inside the form.
    }

    if (reason === 'Exchange Student Program') {
        if (!grades) {
             toast.error('Please upload the Certification of Grades.');
             return;
        }
        if (!regForm) {
            toast.error('Please upload the Registration Form.');
            return;
        }
        if (!proofAdmission) {
            toast.error('Please upload the Proof of Admission.');
            return;
        }
    }

    setIsLoading(true);
    toast.loading('Submitting application...');

    try {
      // TODO: Upload logic here using uploadFile() for each non-null file
      // const appFormUrl = await uploadFile(appForm, ...);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Leave of Absence application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="3xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? 'View Request' : 'Apply for Leave of Absence'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Type: <span className="font-semibold text-dost-title">{reason}</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {/* Admin Comment Alert */}
          {showAdminAlert && (
            <AdminCommentAlert 
              status={existingRequest.status}
              comment={existingRequest.adminComment || 'No comment provided.'}
            />
          )}

          {/* Forms swap based on reason */}
          {reason === 'Medical/Personal' ? (
            <MedicalPersonalForm 
               appForm={appForm} setAppForm={setAppForm}
               univApproval={univApproval} setUnivApproval={setUnivApproval}
               grades={grades} setGrades={setGrades}
               medCert={medCert} setMedCert={setMedCert}
               otherDocs={otherDocs} setOtherDocs={setOtherDocs}
               isReadOnly={isReadOnly}
            />
          ) : (
            <ExchangeStudentForm 
               appForm={appForm} setAppForm={setAppForm}
               univApproval={univApproval} setUnivApproval={setUnivApproval}
               grades={grades} setGrades={setGrades}
               financialBreakdown={financialBreakdown} setFinancialBreakdown={setFinancialBreakdown}
               regForm={regForm} setRegForm={setRegForm}
               proofAdmission={proofAdmission} setProofAdmission={setProofAdmission}
               isReadOnly={isReadOnly}
            />
          )}

          {!isReadOnly && (
            <div className="pt-4 border-t">
              <Checkbox
                label="I confirm that the uploaded documents are correct, clear, and authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" disabled={isLoading}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
          </ModalClose>
          {!isReadOnly && (
            <Button 
              onClick={handleSubmit} 
              isLoading={isLoading}
              disabled={isLoading} // Only disable if loading, not if !isConfirmed
            >
              {existingRequest?.status === 'Resubmit' ? 'Resubmit Application' : 'Submit Application'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}