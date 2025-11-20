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
import { MedicalPersonalForm } from './MedicalPersonalForm';
import { ExchangeStudentForm } from './ExchangeStudentForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { formatDate } from '@/lib/utils/date'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';
import type { LOAReason } from '@/types';

interface LeaveOfAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: LOAReason;
  existingRequest?: any;
}

export function LeaveOfAbsenceModal({ isOpen, onClose, reason, existingRequest }: LeaveOfAbsenceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';

  // Determine initial editing state:
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  // Form State
  const [appForm, setAppForm] = useState<File | null>(null);
  const [univApproval, setUnivApproval] = useState<File | null>(null);
  const [grades, setGrades] = useState<File | null>(null);
  const [medCert, setMedCert] = useState<File | null>(null);
  const [otherDocs, setOtherDocs] = useState<File | null>(null);
  const [regForm, setRegForm] = useState<File | null>(null);
  const [proofAdmission, setProofAdmission] = useState<File | null>(null);

  const { uploadFile } = useFileUpload('leave-of-absence');

  // Helper to check if a specific file is required based on current state
  const isRequired = (keywords: string[]) => {
    // 1. If creating a NEW request, standard fields are required
    if (!existingRequest) return true;

    // 2. If PENDING (user is editing voluntarily), standard fields are required 
    // (assuming they want to replace or just keep existing, but simpler to enforce presence if we had real data binding)
    if (status === 'Pending') return true; 

    // 3. If RESUBMIT, only require fields mentioned in the comment
    if (isResubmit) {
        return keywords.some(k => (adminComment || '').toLowerCase().includes(k));
    }
    
    return false;
  };

  const handleSubmit = async () => {
    // --- VALIDATION LOGIC ---
    
    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    if (reason === 'Medical/Personal') {
        // Application Form
        if (isRequired(['application', 'form', 'loa']) && !appForm && !existingRequest) {
             // Note: In a real app with "existingRequest", you'd check if there's already a file URL.
             // Since we only have file state here, we assume for "Resubmit" they MUST upload a new one if asked.
             toast.error('Please upload the Application Form for LOA.');
             return;
        }
        // University Approval
        if (isRequired(['university', 'approval']) && !univApproval && !existingRequest) {
             toast.error('Please upload the University Approval.');
             return;
        }
        // Grades
        if (isRequired(['grades', 'certification']) && !grades && !existingRequest) {
             toast.error('Please upload the Certification of Grades.');
             return;
        }
        // Medical Cert (Conditional check for Resubmit)
        if (isResubmit && isRequired(['medical', 'certificate', 'health']) && !medCert) {
             toast.error('Please upload the requested Medical Certificate.');
             return;
        }
    }

    if (reason === 'Exchange Student Program') {
        // Application Form
        if (isRequired(['application', 'form', 'loa']) && !appForm && !existingRequest) {
            toast.error('Please upload the Application Form for LOA.');
            return;
        }
        // Grades
        if (isRequired(['grades', 'certification']) && !grades && !existingRequest) {
             toast.error('Please upload the Certification of Grades.');
             return;
        }
        // Registration Form
        if (isRequired(['registration', 'form 5']) && !regForm && !existingRequest) {
            toast.error('Please upload the Registration Form / Form 5.');
            return;
        }
        // Proof of Admission
        if (isRequired(['proof', 'admission', 'acceptance']) && !proofAdmission && !existingRequest) {
            toast.error('Please upload the Proof of Admission.');
            return;
        }
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(isResubmit ? 'Resubmission successful!' : 'Application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit application.');
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
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'Apply for Leave of Absence'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Reason: <span className="font-semibold text-dost-title">{reason}</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin space-y-6">
          
          

          {/* 2. Admin Comment Alert */}
          {showAdminAlert && (
            <AdminCommentAlert 
              status={status}
              comment={adminComment || 'No comment provided.'}
            />
          )}

          {/* 3. Forms */}
          {reason === 'Medical/Personal' ? (
            <MedicalPersonalForm 
               appForm={appForm} setAppForm={setAppForm}
               univApproval={univApproval} setUnivApproval={setUnivApproval}
               grades={grades} setGrades={setGrades}
               medCert={medCert} setMedCert={setMedCert}
               otherDocs={otherDocs} setOtherDocs={setOtherDocs}
               isReadOnly={!isEditing}
               isResubmit={isResubmit}
               adminComment={adminComment}
            />
          ) : (
            <ExchangeStudentForm 
               appForm={appForm} setAppForm={setAppForm}
               univApproval={univApproval} setUnivApproval={setUnivApproval}
               grades={grades} setGrades={setGrades}
               regForm={regForm} setRegForm={setRegForm}
               proofAdmission={proofAdmission} setProofAdmission={setProofAdmission}
               isReadOnly={!isEditing}
               isResubmit={isResubmit}
               adminComment={adminComment}
            />
          )}

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
                        {formatDate(existingRequest.timestamp || existingRequest.dateSubmitted)}
                    </div>
                </div>
                {existingRequest.semester && (
                   <div className="flex flex-col gap-1 sm:col-span-2 border-t border-gray-200 pt-3 mt-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Effectivity</span>
                      <p className="text-sm font-medium text-gray-900">
                         {existingRequest.semester} | {existingRequest.academicYear}
                      </p>
                   </div>
                )}
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
              <Button 
                onClick={handleSubmit} 
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isResubmit ? 'Submit Corrections' : 'Submit Application'}
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