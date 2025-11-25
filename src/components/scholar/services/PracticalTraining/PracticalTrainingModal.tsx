'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Calendar, Loader2, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';

import { ReferralRequestForm } from './ReferralRequestForm';
import { CompletionSubmissionForm } from './CompletionSubmissionForm';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { toast } from '@/components/ui/toaster';
import { PTPTransactionType } from './PracticalTrainingPanel';

// 1. Import Hooks
import { useCloudinaryUpload } from '@/hooks/scholar/useDocumentUpload';
import { useSubmitPTP } from '@/hooks/scholar/PTP Submission/usePTPUpload'; 
import { useUpdatePTP } from '@/hooks/scholar/PTP Submission/usePTPUpdate';
import { useRecentGrade } from '@/hooks/scholar/PTP Submission/useRecentGrade';
import { usePTPSubmission } from '@/hooks/scholar/PTP Submission/usePTPCheckReferral'; 
import { 
  useCurrentScholarPTP, 
  type PTPReferralData, 
  type PTPCompletionData 
} from '@/hooks/scholar/PTP Submission/useCurrentScholarPTP';
import { 
  PracticalTrainingReferral, 
  PracticalTrainingCompletion, 
  PTPPlan,
  SubmissionStatus } from '@/types/services';


interface PracticalTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PTPTransactionType;
  existingRequest?: any;
}

export function PracticalTrainingModal({ isOpen, onClose, type, existingRequest }: PracticalTrainingModalProps) {
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  // --- Hooks ---
  const { uploadDocument } = useCloudinaryUpload();
  const { submitGrade, loading: submitLoading, error: submitError, success } = useSubmitPTP();
  const { updatePTP, loading: updateLoading} = useUpdatePTP();
  const { recentGradeKey } = useRecentGrade(user?.spas_id);
  const { hasReferral } = usePTPSubmission(user?.spas_id);

  const { data: fetchedData, loading: dataLoading } = useCurrentScholarPTP(type);

  // Raw data from DB
  const activeRequest = existingRequest || fetchedData;

  // --- Construct Submission Data Object ---
  // This unifies the messy DB fields into a clean interface
  let submissionData: PracticalTrainingReferral | PracticalTrainingCompletion | null = null;
  let ptpUrl = `dost-portal/${user.spas_id}/ptp-submission`;

  if (activeRequest) {
    const baseData = {
      id: activeRequest.id?.toString() || '',
      scholarId: user?.spas_id || '',
      status: (activeRequest.status || 'Open') as SubmissionStatus,
      dateSubmitted: activeRequest.created_at || activeRequest.timestamp || activeRequest.dateSubmitted || new Date().toISOString(),
      adminComment: activeRequest.comment || activeRequest.adminComment,
      trainingYear: activeRequest.trainingYear || 0, // Default if missing
    };

    if (type === 'Referral Letter') {
      const data = activeRequest as PTPReferralData;
      submissionData = {
        ...baseData,
        id: data.id,
        plan: (data.plan as PTPPlan) || undefined,
        replySlip: data.reply_slip_file_key || '',
        curriculum: data.curriculum_file_key || '',
      } as PracticalTrainingReferral;
    } else {
      const data = activeRequest as PTPCompletionData; // Cast to any to handle potential property name variations
      submissionData = {
        ...baseData,
        form126: data.form_126_file_key || '',
        form127: data.form_127_file_key || '',
        form128: data.form_128_file_key || '',
        dtr: data.dtr_file_key || '',
        trainingCompletion: data.training_completion_file_key || '',
      } as PracticalTrainingCompletion;
    }
  }

  // Derived State from the clean object
  const status = submissionData?.status;
  const adminComment = submissionData?.adminComment;
  const isResubmit = status === 'Resubmit';
  const hasRecentGrade = !!recentGradeKey;

  // --- State Management ---
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form States (Referral)
  const [plan, setPlan] = useState<string>('');
  
  // File States
  const [grades, setGrades] = useState<File | null>(null);
  const [replySlip, setReplySlip] = useState<File | null>(null);
  const [form126, setForm126] = useState<File | null>(null);
  const [form127, setForm127] = useState<File | null>(null);
  const [form128, setForm128] = useState<File | null>(null);
  const [dtr, setDtr] = useState<File | null>(null);
  const [certCompletion, setCertCompletion] = useState<File | null>(null);

  // --- Ref to track initialization (Prevents Edit button loop) ---
  const hasInitialized = useRef(false);

  // --- EFFECT: Reset & Sync State on Open ---
  useEffect(() => {
    if (!isOpen) {
        hasInitialized.current = false;
        return;
    }

    if (isOpen) {
      // 1. Reset File Inputs & Confirmation on open (if not initialized)
      if (!hasInitialized.current) {
          setGrades(null);
          setReplySlip(null);
          setForm126(null);
          setForm127(null);
          setForm128(null);
          setDtr(null);
          setCertCompletion(null);
          setIsConfirmed(false);
      }

      // 2. Sync Data using the clean submissionData object
      if (submissionData) {
        // Only set isEditing AUTOMATICALLY on the very first load
        if (!hasInitialized.current) {
            setIsEditing(false);
            hasInitialized.current = true;
            // Sync specific fields
            if (type === 'Referral Letter') {
              const data = submissionData as PracticalTrainingReferral;
              setPlan(data.plan || '');
            }
        }
 

      } else if (!dataLoading && !submissionData) {
        // 3. No Data -> New Submission -> Default to Edit Mode
        if (!hasInitialized.current) {
            setIsEditing(true);
            setPlan('');
            hasInitialized.current = true;
        }
      }
    }
  }, [isOpen, activeRequest, dataLoading, type]); 

  // Close on success
  useEffect(() => {
    if (success) {
      toast.success('Documents submitted successfully!');
      onClose();
    }
  }, [success, onClose]);

  useEffect(() => {
    if (submitError) toast.error(submitError);
  }, [submitError]);

  const handleFileUpload = async (file: File, context: string): Promise<string> => {
    const result = await uploadDocument(file, context);
    if (!result?.key) throw new Error(`Failed to upload ${file.name}`);
    return result.key;
  };

  const handleSubmit = async () => {
    if (!user?.spas_id) {
      toast.error("User session missing.");
      return;
    }

    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    const toastId = toast.loading('Processing documents...');
    console.log("dbCert: ", (submissionData as PracticalTrainingCompletion));

    try {
      const submissionType = type === 'Referral Letter' ? 'Referral' : 'Completion';
      let payload: any = {
        spas_id: user.spas_id,
        type: submissionType,
        created_at: new Date().toISOString()
      };

      if (type === 'Referral Letter') {
         // Cast to interface for clean access
         const currentData = submissionData as PracticalTrainingReferral | null;
         
         if (!plan && !currentData) throw new Error('Please select your Practical Training Plan.');
         
         if (!grades && !currentData?.curriculum && !recentGradeKey) {
           throw new Error('Please upload your Certified Grades.');
         }
         
         if (!replySlip && !currentData?.replySlip && plan !== 'cannot_participate') {
           throw new Error('Please upload your Reply Slip.');
         }

         let gradesKey = currentData?.curriculum; 
         if (grades) gradesKey = await handleFileUpload(grades, ptpUrl);
         else if (!gradesKey && recentGradeKey) gradesKey = recentGradeKey;

         let replySlipKey = currentData?.replySlip;
         if (replySlip) replySlipKey = await handleFileUpload(replySlip, ptpUrl);

         // Set keys for insert/update
         payload.plan = plan;
         payload.grade_file_key = gradesKey;
         payload.reply_slip_file_key = replySlipKey;
         payload.type = type;

         console.log("Current Data: ", currentData)
        if(currentData) {
          await updatePTP({
            id: Number(currentData.id), // Ensure ID is a number
            plan: plan || currentData.plan, // Ensure plan is passed as string
            grade_file_key: gradesKey,
            reply_slip_file_key: replySlipKey,
            status: 'Pending'
          })
        } else {
          await submitGrade(payload);
          toast.dismiss(toastId);
        }
      }

      if (type === 'Program Completion') {
         const currentData = submissionData as PracticalTrainingCompletion | null;
         
         const dbForm126 = currentData?.form126;
         const dbForm127 = currentData?.form127;
         const dbForm128 = currentData?.form128;
         const dbDtr = currentData?.dtr;
         const dbCert = currentData?.trainingCompletion;

         if ((!form126 && !dbForm126) || (!form127 && !dbForm127) || (!form128 && !dbForm128) || (!dtr && !dbDtr) || (!certCompletion && !dbCert)) {
           throw new Error('Please upload all required completion documents.');
         }

         let form126Key = dbForm126;
         if (form126) form126Key = await handleFileUpload(form126, ptpUrl);

         let form127Key = dbForm127;
         if (form127) form127Key = await handleFileUpload(form127, ptpUrl);

         let form128Key = dbForm128;
         if (form128) form128Key = await handleFileUpload(form128, ptpUrl);

         let dtrKey = dbDtr;
         if (dtr) dtrKey = await handleFileUpload(dtr, ptpUrl);

         let certKey = dbCert;
         if (certCompletion) certKey = await handleFileUpload(certCompletion, ptpUrl);

         // Set keys for payload
         payload.form_126_file_key = form126Key;
         payload.form_127_file_key = form127Key;
         payload.form_128_file_key = form128Key;
         payload.dtr_file_key = dtrKey;
         payload.training_completion_file_key = certKey;
         payload.type = type;
         
        if(currentData) {
          await updatePTP({
            id: Number(currentData.id),
            form_126_file_key: form126Key,
            form_127_file_key: form127Key,
            form_128_file_key: form128Key,
            dtr_file_key: dtrKey,
            training_completion_file_key: certKey,
            status: 'Pending'
          })
        } else {
          console.log("Payload: ", payload)
          await submitGrade(payload);
          toast.dismiss(toastId);
      }
      }
      toast.success('Submission Successful');
      onClose();
      
    } catch (error: any) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(error.message || 'Submission failed.');
    }
  };

  const showAdminAlert = submissionData && (status === 'Resubmit' || status === 'Approved');

  const handleEdit = () => {
    setIsEditing(true);
    setPlan('');
    console.log("Plan: ", plan)
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="3xl">
        <ModalHeader>
          <ModalTitle>
             {submissionData ? (isEditing ? 'Update Request' : 'View Request') : (type === 'Referral Letter' ? 'Request PTP Referral' : 'Submit PTP Completion')}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
              Transaction: <span className="font-semibold text-dost-title">{type}</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {dataLoading && !existingRequest ? (
             <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-dost-blue" />
             </div>
          ) : (
            <>
              {showAdminAlert && (
                <AdminCommentAlert status={status} comment={adminComment || ''} />
              )}

              {type === 'Referral Letter' ? (
                <ReferralRequestForm
                   plan={plan} setPlan={setPlan}
                   grades={grades} setGrades={setGrades}
                   replySlip={replySlip} setReplySlip={setReplySlip}
                   isReadOnly={!isEditing}
                   isResubmit={isResubmit}
                   adminComment={adminComment || ''}
                   hasRecentGrade={hasRecentGrade}
                   gradeUrl={(submissionData as PracticalTrainingReferral)?.curriculum || recentGradeKey as any}
                   replySlipUrl={(submissionData as PracticalTrainingReferral)?.replySlip}
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
                   adminComment={adminComment || ''}
                   DTRUrl={(submissionData as PracticalTrainingCompletion)?.dtr}
                   certUrl={(submissionData as PracticalTrainingCompletion)?.trainingCompletion}
                   form126Url={(submissionData as PracticalTrainingCompletion)?.form126}
                   form127Url={(submissionData as PracticalTrainingCompletion)?.form127}
                   form128Url={(submissionData as PracticalTrainingCompletion)?.form128}
                />
              )}

              {isEditing && (
                <div className="pt-4 border-t">
                  <Checkbox
                    label="I confirm that the uploaded documents are correct and complete."
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                  />
                </div>
              )}

              {submissionData && !isEditing && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                        <div><StatusBadge status={status as any} /></div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {formatDate(submissionData.dateSubmitted)}
                        </div>
                    </div>
                </div>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
             <>
               <ModalClose asChild>
                 <Button variant="outline" disabled={submitLoading}>Cancel</Button>
               </ModalClose>
               <Button 
                 onClick={handleSubmit} 
                 isLoading={submitLoading} 
                 disabled={submitLoading}
               >
                 {isResubmit ? 'Submit Corrections' : 'Submit'}
               </Button>
             </>
          ) : (
             <>
               <ModalClose asChild>
                 <Button variant="outline">Close</Button>
               </ModalClose>
               
               {(status === 'Pending' || status === 'Resubmit') && (
                 <Button onClick={handleEdit} >
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