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
import { AdminCommentAlert } from './AdminCommenAlert';
import type { SemesterAvailability } from '@/types/curriculum';
import type { GradeSubmission, YearLevel } from '@/types'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';
import { Edit } from 'lucide-react'; 

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


export function GradeSubmissionModal({ isOpen, onClose, semester }: GradeSubmissionModalProps) {
  
  const mockSubmissionData: GradeSubmission = {
    id: 'sub123',
    scholarId: 'scholar123',
    status: semester.status,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminComment: semester.status === 'Resubmit' 
      ? 'Invalid Certificate of Registration. Please upload the certified true copy of the document from the university registrar.'
      : undefined,
    yearLevel: yearLabels[semester.year] || '1st Year',
    semester: semester.semester,
    academicYear: '2023-2024',
    registrationForm: 'De Larosa_COR.pdf',
    registrationFormUrl: '#mock-reg-form-url',
    copyOfGrades: 'De Larosa_Grades.pdf',
    copyOfGradesUrl: '#mock-grades-url',
  };

  const [submission, setSubmission] = useState<GradeSubmission | null>(
    (semester.status === 'Pending' || semester.status === 'Resubmit' || semester.status === 'Approved' || semester.status === 'Closed') 
    ? mockSubmissionData
    : null
  );

  const [isEditing, setIsEditing] = useState(semester.status === 'Open' || semester.status === 'Resubmit');
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); 
  
  const scholarId = 'mock-scholar-id'; 
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
  };
  
  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false);
    setIsLoading(true);
    toast.loading('Submitting your documents...');

    try {
      let regFormUrl = submission?.registrationFormUrl || null;
      let gradesUrl = submission?.copyOfGradesUrl || null;

      if (showRegFormUpload && regForm) {
        const regFormPath = `${scholarId}/${semester.year}-${semester.semester}-regform.${regForm.name.split('.').pop()}`;
        regFormUrl = await uploadFile(regForm, regFormPath, { acceptedTypes: ['.pdf'] });
      }

      if (showGradesFormUpload && gradesFile) {
        const gradesPath = `${scholarId}/${semester.year}-${semester.semester}-grades.${gradesFile.name.split('.').pop()}`;
        gradesUrl = await uploadFile(gradesFile, gradesPath, { acceptedTypes: ['.pdf'] });
      }
      
      if (!regFormUrl || !gradesUrl) {
        throw new Error('File upload failed. Please ensure all documents are provided.');
      }

      console.log('Registration Form URL:', regFormUrl);
      console.log('Grades URL:', gradesUrl);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Submission successful! Awaiting verification.');
      handleCloseAndReset();

    } catch (error: any) {
      toast.error(error.message || 'Submission failed.');
      setIsLoading(false); 
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
                  disabled={
                    isLoading || !isConfirmed ||
                    (showRegFormUpload && !regForm && !submission?.registrationFormUrl) ||
                    (showGradesFormUpload && !gradesFile && !submission?.copyOfGradesUrl)
                  }
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