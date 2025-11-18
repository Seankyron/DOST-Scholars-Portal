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
import { SubmissionForm } from './SubmissionForm';
import { SubmissionReview } from './SubmissionReview';
import { AdminCommentAlert } from '../../../shared/AdminCommenAlert';
import type { SemesterAvailability } from '@/types/curriculum';
import type { GradeSubmission, YearLevel } from '@/types'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';
import { Edit } from 'lucide-react'; 
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

  const [isEditing, setIsEditing] = useState(semester.status === 'Open' || semester.status === 'Resubmit');
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); 
  
  const scholarId = submissionData.id; 
  const { uploadFile } = useFileUpload('grade-submissions');

  const handleCloseAndReset = () => {
    setIsLoading(false);
    setRegForm(null);
    setGradesFile(null);
    setIsConfirmed(false);
    setIsConfirmOpen(false); 
    onClose(); 
  };


  let commentToShow: string | undefined = undefined;
  if (semester.status === 'Resubmit' && submission?.adminComment) {
    commentToShow = submission.adminComment;
  } else if (semester.status === 'Approved') {
    commentToShow = APPROVED_MESSAGE;
  }
  
  const showForm = isEditing;
  
  const canEdit = submission?.status === 'Pending' || submission?.status === 'Resubmit';

  const isResubmit = submission && submission.status === 'Resubmit';
  const comment = submission?.adminComment?.toLowerCase() || '';
  const showRegFormUpload = !isResubmit || (isResubmit && (comment.includes('registration') || comment.includes('form 5')));
  const showGradesFormUpload = !isResubmit || (isResubmit && (comment.includes('grades') || comment.includes('tor')));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showRegFormUpload && !regForm && !submission?.registrationFormUrl) {
       toast.error('Please upload your Registration Form.');
       return;
    }
    if (showGradesFormUpload && !gradesFile && !submission?.copyOfGradesUrl) {
       toast.error('Please upload your Copy of Grades.');
       return;
    }
    if (!isConfirmed) {
       toast.error('Please confirm your submission.');
       return;
    }
    
    setIsConfirmOpen(true);
    handleConfirmSubmit();
    setIsLoading(false);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false);
    const toastLoading = toast.loading('Submitting your documents...');

    try {
      let regFormUrl = submission?.registrationFormUrl || null;
      let gradesUrl = submission?.copyOfGradesUrl || null;
      let update: boolean = false;


      // Upload Registration Form to Cloudinary
      if (showRegFormUpload && regForm) {
        const uploadedRegFormUrl = await uploadDocument(regForm, `DOST-Portal/regForm-submissions/${user.spas_id}`);
        if (!uploadedRegFormUrl) {
          throw new Error('Failed to upload Registration Form.');
        }
        regFormUrl = uploadedRegFormUrl.url;
      }

      // Upload Grades file to Cloudinary
      if (showGradesFormUpload && gradesFile) {
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

  return (
    <>
      <Modal open={isOpen} onOpenChange={handleCloseAndReset}>
        <ModalContent size="2xl">
          <ModalHeader>
            <ModalTitle>
              Grade Submission: {yearLabels[semester.year] || `${semester.year}th Year`}
              , {semester.semester}
            </ModalTitle>
          </ModalHeader>
          
          <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
            {commentToShow && (
              <AdminCommentAlert
                status={semester.status}
                comment={commentToShow}
              />
            )}

            {showForm ? (
              <SubmissionForm
                semester={semester}
                submission={submission}
                regForm={regForm}
                setRegForm={setRegForm}
                gradesFile={gradesFile}
                setGradesFile={setGradesFile}
                isConfirmed={isConfirmed}
                setIsConfirmed={setIsConfirmed}
              />
            ) : (
              submission && (
                <SubmissionReview
                  submission={submission}
                />
              )
            )}
          </ModalBody>
          
          <ModalFooter>
            {showForm ? (
              // When in EDITING mode
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
                  Submit
                </Button>
              </>
            ) : (
              <>
                <ModalClose asChild>
                  <Button variant="outline">Close</Button>
                </ModalClose>
                
                {canEdit && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Response
                  </Button>
                )}
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
}