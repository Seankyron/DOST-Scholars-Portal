'use client';

import { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalBody, 
  ModalFooter,
  ModalClose 
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Calendar, Loader2 } from 'lucide-react'; 
import { SubmissionForm } from './SubmissionForm';
import { AdminCommentAlert } from '../../../shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import type { SemesterAvailability, YearLevel } from '@/types'; 
import type { GradeSubmission, SubmissionStatus } from '@/types/services'; 
import { toast } from '@/components/ui/toaster';
import { useFetchGrades } from '@/hooks/scholars/Get/useFetchGrade';
import { grep } from 'jquery';
import { useEffect } from 'react';
import { useUploadDocument } from '@/hooks/scholars/Post/useUploadDocument';
import { useSubmitGrade, SubmissionData } from '@/hooks/scholars/Post/useSubmitGrade';
import { useUpdateGrade } from '@/hooks/scholars/Post/useUpdateGrade';
import { iGradeSubmissions } from '@/hooks/scholars/Get/useFetchGrade';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: SemesterAvailability;
}

const yearLabels: { [key: number]: YearLevel } = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
  5: '5th Year',
};

const APPROVED_MESSAGE = 'Your submission is approved. Please wait for your stipend to be processed. You can check the status in the Stipend Tracking service.';

// Helper to determine missing docs based on DB columns
function GetMissingDocument(grade: iGradeSubmissions | null = null) {
  if (!grade) return ['Transcript of Records (TOR)', 'Certificate of Registration (COR)'];
  if (!grade.cor_file_key && !grade.grade_file_key) return ['Transcript of Records (TOR)', 'Certificate of Registration (COR)'];
  if (!grade.cor_file_key) return ['Certificate of Registration (COR)'];
  if (!grade.grade_file_key) return ['Transcript of Records (TOR)'];
  return null;
}

// Helper to generate admin comment
function GetAdminComment(missingDoc: string[] | null) {
  if (!missingDoc || missingDoc.length === 0) {
    return APPROVED_MESSAGE;
  }
  const docList = missingDoc.join(' and ');
  return `Invalid or missing ${docList}. Please upload the certified true copy of the document.`;
}

export function GradeSubmissionModal({ isOpen, onClose, semester }: GradeSubmissionModalProps) {
  // 1. Get User Info Safely
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Fetch Real Data
  const { grade, loading: dataLoading } = useCurrentScholarGrade(semester.year, semester.semester);
  const currentGradeRecord = grade?.[0] || null;

  // 3. Hooks for Actions
  const { uploadDocument } = useCloudinaryUpload(); 
  const { submitGrade, loading: submitLoading } = useSubmitGrade();
  const { updateGrade, loading: updateLoading } = useUpdateGrade();

  // 4. State
  const [isEditing, setIsEditing] = useState(false);
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 5. Determine Status and UI Mode
  const rawStatus = currentGradeRecord?.status || semester.status;
  const dbStatus = (rawStatus || 'Open') as SubmissionStatus;
  
  const isResubmit = dbStatus === 'Resubmit';
  const hasSubmission = !!currentGradeRecord;

  const missingDocs = isResubmit ? GetMissingDocument(currentGradeRecord) : null;
  const adminComment = isResubmit ? GetAdminComment(missingDocs) : undefined;

  // Initialize Edit Mode based on status
  useEffect(() => {
    if (isOpen) {
      setIsEditing(dbStatus === 'Open' || dbStatus === 'Resubmit');
      setRegForm(null);
      setGradesFile(null);
      setIsConfirmed(false);
    }
  }, [isOpen, dbStatus]);

  // 6. Construct the Submission Object for the UI
  const submissionData: GradeSubmission | null = hasSubmission ? {
    id: currentGradeRecord.id.toString(),
    scholarId: user?.spas_id || '',
    status: dbStatus,
    dateSubmitted: currentGradeRecord.updated_at || new Date().toISOString(),
    adminComment: adminComment,
    yearLevel: yearLabels[semester.year] || '1st Year',
    semester: semester.semester,
    academicYear: semester.academicYear?.slice(-9) || 'N/A',
    registrationForm: currentGradeRecord.cor_file_key || '', 
    copyOfGrades: currentGradeRecord.grade_file_key || '',
  } : null;

  const isLoading = submitLoading || updateLoading;

  // 7. Handle Submit Logic
  const handleSubmit = async () => {
    if (!user) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    if (!hasSubmission && (!regForm || !gradesFile)) {
      toast.error('Please upload both the Registration Form and Copy of Grades.');
      return;
    }

    if (isResubmit && !regForm && !gradesFile) {
       toast.error('Please upload the corrected documents.');
       return;
    }

    const toastId = toast.loading('Submitting documents...');

    try {
      let regFormKey = currentGradeRecord?.cor_file_key || '';
      let gradesKey = currentGradeRecord?.grade_file_key || '';
      
      // This isn't a URL, it's the "bucket" or "folder context" for your API
      const uploadContext = `dost-portal/${user.spas_id}/grade-submissions`; 

      // Upload Reg Form if a new one is selected
      if (regForm) {
        // Pass the file and the "bucket" name to your hook
        // Your hook calls /api/upload, which handles the `${userId}/${bucket}/filename` logic
        const result = await uploadDocument(regForm, uploadContext);
        
        // --- FIX: Strict checking for the key ---
        if (!result || !result.key) {
            console.error("Upload result missing key:", result);
            throw new Error('Failed to upload Registration Form: No key returned');
        }
        regFormKey = result.key;
      }

      // Upload Grades if a new one is selected
      if (gradesFile) {
        const result = await uploadDocument(gradesFile, uploadContext);
        
        // --- FIX: Strict checking for the key ---
        if (!result || !result.key) {
            console.error("Upload result missing key:", result);
            throw new Error('Failed to upload Copy of Grades: No key returned');
        }
        gradesKey = result.key;
      }

      const payload = {
        spas_id: user.spas_id,
        year_level: semester.year,
        semester: semester.semester,
        cor_file_key: regFormKey,
        grade_file_key: gradesKey,
      };

      let currentStatus = 'Pending';

      if (hasSubmission) {
        if (currentGradeRecord?.status === 'Resubmit') currentStatus = 'Resubmit-Pending'
        await updateGrade({
          id: currentGradeRecord.id,
          ...payload,
          status: currentStatus
        });
      } else {
        await submitGrade(payload);
      }

      toast.dismiss(toastId);
      toast.success('Submission successful! Awaiting verification.');
      onClose();
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error("Submission Error:", error);
      toast.error(error.message || 'Submission failed. Please try again.');
    }
  };

  const showAdminAlert = hasSubmission && (isResubmit || dbStatus === 'Approved');
  let alertMessage = adminComment || 'No comment provided.';
  if (dbStatus === 'Approved') alertMessage = APPROVED_MESSAGE;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>
            Grade Submission: {yearLabels[semester.year] || `${semester.year}th Year`}
            , {semester.semester}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
             Academic Year: <span className="font-semibold text-dost-title">{semester.academicYear || 'N/A'}</span>
          </p>
        </ModalHeader>
        
        <ModalBody className="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          
          {dataLoading && (
             <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-dost-blue" />
             </div>
          )}

          {!dataLoading && (
            <>
              {showAdminAlert && (
                <AdminCommentAlert status={dbStatus} comment={alertMessage} />
              )}

              <SubmissionForm
                semester={semester}
                submission={submissionData}
                regForm={regForm}
                setRegForm={setRegForm}
                gradesFile={gradesFile}
                setGradesFile={setGradesFile}
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

              {hasSubmission && !isEditing && (
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1">
                         <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                         <div><StatusBadge status={dbStatus} /></div>
                     </div>
                     <div className="flex flex-col gap-1">
                         <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                         <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                             <Calendar className="h-4 w-4 text-gray-500" />
                             {submissionData ? formatDate(submissionData.dateSubmitted) : 'N/A'}
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
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </ModalClose>
              <Button
                type="button"
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isResubmit ? 'Submit Corrections' : 'Submit Grades'}
              </Button>
            </>
          ) : (
            <>
              <ModalClose asChild>
                <Button variant="outline">Close</Button>
              </ModalClose>
              
              {(dbStatus === 'Pending' || dbStatus === 'Resubmit') && (
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