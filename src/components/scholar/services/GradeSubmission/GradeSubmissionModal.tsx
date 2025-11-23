'use client';

import { useState } from 'react';
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
import { Edit, Calendar } from 'lucide-react'; 
import { SubmissionForm } from './SubmissionForm';
import { AdminCommentAlert } from '../../../shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import type { SemesterAvailability, GradeSubmission, YearLevel } from '@/types'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';
import { iGradeSubmissions, useCurrentScholarGrade } from '@/hooks/scholar/useCurrentScholarGrade';
import {  } from '@/hooks/scholar/useDocumentUpload';
import { createClient } from '@/lib/supabase/client';
import { useCloudinaryUpload } from '@/hooks/scholar/useDocumentUpload';
import { useSubmitGrade } from '@/hooks/scholar/useSubmitGrade';
import { useUpdateGrade } from '@/hooks/scholar/useUpdateGrade';


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

function GetMissingDocument(grade: iGradeSubmissions | null = null)
{
  if (!grade) return ['Transcript of Records (TOR)', 'Certificate of Registration (COR)'];
  else if (!grade?.cor_file_key) return ['Certificate of Registration (COR)'];
  else if (!grade?.grade_file_key) return ['Transcript of Records (TOR)'];
  else return null;
}

function GetAdminComment(missingDoc: string[] | null) {
  if (!missingDoc || missingDoc.length === 0) {
    return 'Your submission is approved. Please wait for your stipend to be processed. You can check the status in the Stipend Tracking service.';
  }

  const docList = missingDoc.join(' and ');

  return `Invalid ${docList}. Please upload the certified true copy of the document from the university registrar.`;
}


//Invalid Certificate of Registration. Please upload the certified true copy of the document from the university registrar.
export function GradeSubmissionModal({ isOpen, onClose, semester }: GradeSubmissionModalProps) 
{
  const user = JSON.parse(sessionStorage.getItem('user') ?? '');
  const gradeRecords = useCurrentScholarGrade(semester.year, semester.semester);
  const missingDoc = GetMissingDocument(gradeRecords.grade[0])
  const { uploadDocument } = useCloudinaryUpload();
  const { submitGrade, loading, error, success } = useSubmitGrade();
  const { updateGrade } = useUpdateGrade();


  let submissionData: GradeSubmission;

  submissionData = {
    id: '-1',
    scholarId: user.spas_id,
    status: semester.status,
    dateSubmitted: gradeRecords.grade[0]?.updated_at?? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminComment: semester.status === 'Resubmit' ? GetAdminComment(missingDoc) : undefined,
    yearLevel: yearLabels[semester.year] || '1st Year',
    semester: semester.semester,
    academicYear: semester.academicYear?.slice(-9),
    registrationForm: `${user.last_name}_COR.pdf`,
    registrationFormUrl: semester.corFileKey ?? '',
    copyOfGrades: `${user.last_name}_Grades.pdf`,
    copyOfGradesUrl: semester.gradeFileKey ?? '',
  };

  const [submission, setSubmission] = useState<GradeSubmission | null>(submissionData);

  // --- State ---
  // const [submission, setSubmission] = useState<GradeSubmission | null>(initialSubmission);
  
  // Derived State (Moved up so handleSubmit can access them)
  const status = submission?.status || semester.status;
  const adminComment = submission?.adminComment;
  const isResubmit = status === 'Resubmit';
  
  // Initial Mode: Edit if 'Open' or 'Resubmit'. View otherwise.
  const [isEditing, setIsEditing] = useState(semester.status === 'Open' || isResubmit);
  
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const scholarId = submissionData.id; 
  const { uploadFile } = useFileUpload('grade-submissions');
  // const scholarId = 'mock-scholar-id'; 

  const handleCloseAndReset = () => {
    setIsLoading(false);
    setRegForm(null);
    setGradesFile(null);
    setIsConfirmed(false);
    onClose(); 
  };

  const handleSubmit = async () => {
    // 1. Universal Check: Confirmation
    if (!isConfirmed) {
       toast.error('Please confirm that your documents are correct.');
       return;
    }
    
    // setIsConfirmOpen(true);
    setIsConfirmed(true);
    handleConfirmSubmit();
    setIsLoading(false);
  };

  const handleConfirmSubmit = async () => {
    // setIsConfirmOpen(false);
    setIsConfirmed(false);
    const toastLoading = toast.loading('Submitting your documents...');

    try {
      let regFormUrl = submission?.registrationFormUrl || null;
      let gradesUrl = submission?.copyOfGradesUrl || null;
      let update: boolean = false;


      // Upload Registration Form to Cloudinary
      if (regForm) {
        const uploadedRegFormUrl = await uploadDocument(regForm, `DOST-Portal/regForm-submissions/${user.spas_id}`);
        if (!uploadedRegFormUrl) {
          throw new Error('Failed to upload Registration Form.');
        }
        regFormUrl = uploadedRegFormUrl.url;
      }

      // Upload Grades file to Cloudinary
      if (gradesFile) {
        const uploadedGradesUrl = await uploadDocument(gradesFile, `DOST-Portal/grade-submissions/${user.spas_id}`);
        if (!uploadedGradesUrl) {
          throw new Error('Failed to upload Grades file.');
        }
        gradesUrl = uploadedGradesUrl.url;
      }
      
      // Validate that all required files have URLs
      if (!regFormUrl || !gradesUrl) {
        throw new Error('File upload failed. Please ensure all documents are provided.');
      }

      if (gradeRecords?.grade[0]?.id) { 
        await updateGrade({
          id: gradeRecords?.grade[0]?.id ?? 0,
          spas_id: user.spas_id,
          year: semester.year,
          semester: semester.semester,
          regFormUrl: regFormUrl,
          gradesUrl: gradesUrl,
          comment: submission?.adminComment,
          created_at: submission?.dateProcessed
        });
      }      
      else { 
        await submitGrade({
          spas_id: user.spas_id,
          year: semester.year,
          semester: semester.semester,
          regFormUrl: regFormUrl,
          gradesUrl: gradesUrl,
          comment: submission?.adminComment,
          created_at: submission?.dateProcessed
        });
      }

      toast.dismiss(toastLoading);
      toast.success('Submission successful! Awaiting verification.');
      handleCloseAndReset();
    } catch (err: any) {
      setIsLoading(false);
      toast.dismiss(toastLoading);
      toast.error(err.message || 'Submission failed.');
    } 
  };

  // Alert Logic
  // const showAdminAlert = hasSubmission && (isResubmit || status === 'Approved');
  const showAdminAlert = submission && (isResubmit || status === 'Approved');

  let alertMessage = adminComment || 'No comment provided.';
  if (status === 'Approved') alertMessage = APPROVED_MESSAGE;

  return (
    <Modal open={isOpen} onOpenChange={handleCloseAndReset}>
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
          
          {/* 1. Metadata Banner */}
          

          {/* 2. Admin Feedback Loop */}
          {showAdminAlert && (
            <AdminCommentAlert status={status} comment={alertMessage} />
          )}

          {/* 3. Smart Form */}
          <SubmissionForm
            semester={semester}
            submission={submission}
            regForm={regForm}
            setRegForm={setRegForm}
            gradesFile={gradesFile}
            setGradesFile={setGradesFile}
            // Logic Props for Smart Validation
            isReadOnly={!isEditing}
            isResubmit={isResubmit}
            adminComment={adminComment}
          />

          {/* 4. Confirmation Checkbox (Only in Edit Mode) */}
          {isEditing && (
             <div className="pt-4 border-t">
                <Checkbox
                    label="I confirm that the uploaded documents are correct, clear, and authentic."
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                />
             </div>
          )}

          {submission && !isEditing && (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                     <div><StatusBadge status={status} /></div>
                 </div>
                 <div className="flex flex-col gap-1">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                     <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                         <Calendar className="h-4 w-4 text-gray-500" />
                         {submission ? formatDate(submission.dateSubmitted) : 'N/A'}
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
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </ModalClose>
              <Button
                type="button"
                onClick={handleSubmit} 
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isResubmit ? 'Submit Corrections' : 'Submit Grades'}
              </Button>
            </>
          ) : (
            /* VIEW MODE FOOTER */
            <>
              <ModalClose asChild>
                <Button variant="outline">Close</Button>
              </ModalClose>
              
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